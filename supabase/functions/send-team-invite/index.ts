import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
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

  try {
    const body = await req.json()
    const teamId = body.teamId;
    const email = body.email;

    if (!teamId || !email) {
      throw new Error("Team ID and email are required.")
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format.")
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the current user
    const { data: { user: inviter }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !inviter) {
      throw new Error("Authentication error. Your session may have expired. Please log in again.")
    }

    // Check if user is admin of the team
    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('is_admin_of', { team_id_to_check: teamId })
    if (isAdminError) {
      console.error("Admin check error:", isAdminError)
      throw new Error('Permission check failed. Please try again.')
    }
    if (!isAdmin) {
      throw new Error('Permission denied. You must be an admin to invite members.')
    }

    // Get team info
    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      console.error("Team fetch error:", teamError)
      throw new Error('Team not found or you do not have access.')
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if service role key is available
    if (!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      throw new Error('Service configuration error. Please contact administrator.')
    }

    // Try to find existing user by email
    let userId: string | null = null;
    
    try {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
      
      if (userData?.user) {
        userId = userData.user.id
      }
    } catch (err) {
      console.log("User lookup error (may not exist):", err)
      // User doesn't exist, which is fine - we'll create a pending invitation
    }

    // If user exists, check if they're already a member
    if (userId) {
      const { data: existingMember } = await supabaseAdmin
        .from('team_members')
        .select('id, status')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .maybeSingle()

      if (existingMember) {
        if (existingMember.status === 'accepted') {
          throw new Error('This user is already a member of the team.')
        } else if (existingMember.status === 'pending') {
          throw new Error('This user already has a pending invitation.')
        }
        // If status is 'declined', we can re-invite them
      }

      // Add member with pending status
      const { error: insertError } = await supabaseAdmin
        .from('team_members')
        .insert({ team_id: teamId, user_id: userId, status: 'pending', role: 'Member' })

      if (insertError) {
        console.error("Insert error:", insertError)
        throw new Error(`Could not create invitation: ${insertError.message}`)
      }

      return new Response(JSON.stringify({ 
        message: 'Invitation sent! The user can accept it on the Teams page.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      // User doesn't exist - they need to sign up first
      return new Response(JSON.stringify({ 
        message: 'User not found. Please ask them to create an account first, then you can invite them.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

  } catch (error) {
    console.error("Error in send-team-invite function:", error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})