import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.4.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { teamId, email } = await req.json()
    if (!teamId || !email) {
      throw new Error("Team ID and email are required.")
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get inviter's data and check for a valid session
    const { data: { user: inviter } } = await supabaseClient.auth.getUser()
    if (!inviter) {
      throw new Error("Authentication error. Your session may have expired. Please log in again.")
    }

    const { data: inviterProfile } = await supabaseClient.from('profiles').select('full_name').eq('id', inviter.id).single()
    const inviterName = inviterProfile?.full_name || inviter.email

    // Get team name and check if inviter is an admin
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

    // Use the admin client for user management
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find or invite the user by email
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

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('team_members')
      .select('id, status')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingMember && existingMember.status !== 'declined') {
      throw new Error('This user is already a member or has a pending invitation.')
    }

    // Insert a pending invitation record
    const { error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId, status: 'pending', role: 'Member' })
    if (insertError) throw new Error(`Database error: Could not add member to team.`)

    // Send email notification via Resend
    const projectRef = Deno.env.get('SUPABASE_URL')?.split('.')[0].replace('https://', '')
    const siteUrl = `https://${projectRef}.vercel.app` // Assumes Vercel deployment convention
    const invitationUrl = `${siteUrl}/teams`

    const subject = `You're invited to join the ${teamName} team on CollabMate!`
    const body = `
      <html><body>
        <h2>Hello!</h2>
        <p>${inviterName} has invited you to join the <strong>${teamName}</strong> team on CollabMate.</p>
        <p>If you are a new user, you will receive a separate email from Supabase to set up your account.</p>
        <p>Once your account is ready, you can accept or decline this invitation by logging in and visiting the Teams page.</p>
        <a href="${invitationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          View Invitation
        </a>
        <p>If you were not expecting this invitation, you can ignore this email.</p>
      </body></html>
    `

    await resend.emails.send({
      from: 'CollabMate <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: body,
    })

    return new Response(JSON.stringify({ message: 'Invitation sent successfully.' }), {
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