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

    const { data: insertedInvitation, error: insertError } = await supabaseAdmin
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId, status: 'pending', role: 'Member' })
      .select('id')
      .single()

    if (insertError) throw new Error(`Database error: Could not add member to team. ${insertError.message}`)

    const projectRef = Deno.env.get('SUPABASE_URL')?.split('.')[0].replace('https://', '')
    const siteUrl = `https://${projectRef}.vercel.app`
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

    try {
      await resend.emails.send({
        from: 'CollabMate <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: body,
      })
    } catch (resendError) {
      console.error('Resend API Error:', resendError);
      // Roll back the database insert if the email fails
      if (insertedInvitation) {
        await supabaseAdmin.from('team_members').delete().eq('id', insertedInvitation.id);
      }
      throw new Error(`Failed to send email via Resend. The invitation has been cancelled. Details: ${resendError.message}`);
    }

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