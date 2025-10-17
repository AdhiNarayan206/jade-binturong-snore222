import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { repo } = await req.json()
    if (!repo) {
      throw new Error("Repository is required.")
    }

    // Create a Supabase client with the Auth context of the user that called the function.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user's session to access their GitHub provider token
    const { data: { session } } = await supabaseClient.auth.getSession()

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const providerToken = session.provider_token
    if (!providerToken) {
      return new Response(JSON.stringify({ error: 'GitHub account not linked. Please link your GitHub account via the sidebar.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // Fetch commits from GitHub API
    const githubResponse = await fetch(`https://api.github.com/repos/${repo}/commits`, {
      headers: {
        Authorization: `token ${providerToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      return new Response(JSON.stringify({ error: `GitHub API error: ${errorData.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: githubResponse.status,
      })
    }

    const commits = await githubResponse.json()

    return new Response(JSON.stringify(commits), {
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