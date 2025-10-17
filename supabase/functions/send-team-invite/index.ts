import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { Resend } from 'https://esm.sh/resend@3.4.0' // Temporarily disabled

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '') // Temporarily disabled

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let teamId, email;

  try {
    const body = await req.json()
    teamId = body.teamId;
    email = body.email;

    if (!teamId || !email) {
      throw new Error("Team ID and email are required.")
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user: inviter } } = await supabaseClient.auth.getUser()
    if (!inviter) {
      throw new Error("Authentication error. Your session may have expired. Please log in again.")
    }

    const { data: inviterProfile } = await supabaseClient.from('profiles').select('full_name').eq('id', inviter.id).single()
    const inviterName = inviterProfile?.full_name || inviter.email

    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .single()

    if (teamError) throw new Error('Team not found or you do not have access.')
    const teamName = team.name

    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('is_admin_of', { team_id_to_check: teamId })
    if (isAdminError || !isAdmin) {
      throw new Error('Permission denied. You must be an admin to invite members.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let userId;
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    if (userError) {
        if (userError.message.includes('User not found')) {
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
            if (inviteError) throw new Error(`Could not invite new user: ${inviteError.message}`)
            userId = inviteData.user.id
        } else {
            throw userError
        }
    } else {
        userId = userData.user.id
    }

    const { data: existingMember } = await supabaseAdmin
      .from('team_members')
      .select('id, status')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingMember && existingMember.status !== 'declined') {
      throw new Error('This user is already a member or has a pending invitation.')
    }

    const { error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId, status: 'pending', role: 'Member' })
      .select('id')
      .single()

    if (insertError) throw new Error(`Database error: Could not add member to team. ${insertError.message}`)

    // Temporarily disabled Resend email to prevent timeouts.
    // The user will receive a standard Supabase Auth invite if they are new,
    // and can see the pending team invitation on the Teams page.

    return new Response(JSON.stringify({ message: 'Invitation sent! The user can accept it on the Teams page.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error in send-team-invite function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})