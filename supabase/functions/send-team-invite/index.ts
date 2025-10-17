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
    const { teamId, email } = await req.json()
    if (!teamId || !email) {
      throw new Error("Team ID and email are required.")
    }

    // Create a Supabase client with the Auth context of the user that called the function.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Check if the inviter is an admin of the team
    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('is_admin_of', { team_id_to_check: teamId })
    if (isAdminError || !isAdmin) {
      throw new Error('You must be an admin to invite members.')
    }

    // Create a Supabase admin client to interact with auth.users
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user exists
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    let userId;
    if (userError) {
        // If user not found, invite them to the app
        if (userError.message.includes('User not found')) {
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
            if (inviteError) throw inviteError
            userId = inviteData.user.id
        } else {
            throw userError
        }
    } else {
        userId = userData.user.id
    }

    // Check if user is already a member or has a pending invite
    const { data: existingMember, error: existingMemberError } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingMember) {
      throw new Error('User is already a member of this team or has a pending invitation.')
    }
    if (existingMemberError && existingMemberError.code !== 'PGRST116') { // Ignore 'not found' error
        throw existingMemberError
    }

    // Insert a pending invitation
    const { error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId,
        status: 'pending',
        role: 'Member'
      })

    if (insertError) throw insertError

    return new Response(JSON.stringify({ message: 'Invitation sent successfully.' }), {
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