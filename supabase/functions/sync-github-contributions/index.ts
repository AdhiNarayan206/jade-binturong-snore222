import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { teamId } = await req.json()
    if (!teamId) {
      throw new Error("Team ID is required.")
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('is_admin_of', { team_id_to_check: teamId })
    if (isAdminError || !isAdmin) {
      throw new Error('Permission denied. You must be an admin to sync contributions.')
    }

    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('github_repo')
      .eq('id', teamId)
      .single()

    if (teamError || !team || !team.github_repo) {
      throw new Error('Team not found or GitHub repository is not set for this team.')
    }
    const repo = team.github_repo

    const { data: { session } } = await supabaseClient.auth.getSession()
    if (!session || !session.provider_token) {
      throw new Error('GitHub account not linked. Please link your GitHub account via the sidebar.')
    }
    const providerToken = session.provider_token

    const githubResponse = await fetch(`https://api.github.com/repos/${repo}/commits`, {
      headers: {
        Authorization: `token ${providerToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      throw new Error(`GitHub API error: ${errorData.message}`)
    }
    const commits = await githubResponse.json()

    const contributions = new Map<string, number>()
    for (const commit of commits) {
      const email = commit.commit.author.email
      if (email) {
        contributions.set(email, (contributions.get(email) || 0) + 1)
      }
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: teamMembers, error: membersError } = await supabaseAdmin
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('status', 'accepted')

    if (membersError) throw membersError
    const memberIds = teamMembers.map(m => m.user_id).filter(id => id) as string[]

    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const memberUsers = users.filter(u => memberIds.includes(u.id));

    const emailToIdMap = new Map<string, string>()
    memberUsers.forEach(u => {
        if (u.email) emailToIdMap.set(u.email, u.id)
    });

    const upsertData = []
    for (const [email, count] of contributions.entries()) {
      const userId = emailToIdMap.get(email)
      if (userId) {
        upsertData.push({
          team_id: teamId,
          user_id: userId,
          commit_count: count,
        })
      }
    }
    
    const contributedUserIds = new Set(upsertData.map(d => d.user_id));
    const zeroContributionMembers = memberIds.filter(id => !contributedUserIds.has(id));
    
    if (zeroContributionMembers.length > 0) {
        zeroContributionMembers.forEach(userId => {
            upsertData.push({
                team_id: teamId,
                user_id: userId,
                commit_count: 0,
            });
        });
    }

    if (upsertData.length > 0) {
      const now = new Date().toISOString();
      const dataWithTimestamp = upsertData.map(d => ({ ...d, last_synced_at: now }));

      const { error: upsertError } = await supabaseAdmin
        .from('team_contributions')
        .upsert(dataWithTimestamp, { onConflict: 'team_id, user_id' })

      if (upsertError) throw upsertError
    }

    return new Response(JSON.stringify({ message: `Sync complete. Processed ${commits.length} commits.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})