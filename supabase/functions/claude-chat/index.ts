import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body with error handling
    let body;
    try {
      const requestText = await req.text();
      if (!requestText.trim()) {
        throw new Error('Empty request body');
      }
      body = JSON.parse(requestText);
    } catch (parseError) {
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }
    
    const { message, sessionId } = body;
    
    if (!message) {
      throw new Error('No message provided');
    }

    const claudeApiKey = Deno.env.get('ClaudeAPI');
    if (!claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Processing message from user:', user.id);

    // Create or get chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: session, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + '...'
        })
        .select()
        .single();

      if (sessionError) {
        throw new Error(`Failed to create session: ${sessionError.message}`);
      }
      currentSessionId = session.id;
    }

    // Save user message
    const { error: userMessageError } = await supabaseClient
      .from('messages')
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        content: message,
        is_bot: false
      });

    if (userMessageError) {
      throw new Error(`Failed to save user message: ${userMessageError.message}`);
    }

    // Get recent messages for context
    const { data: recentMessages } = await supabaseClient
      .from('messages')
      .select('content, is_bot')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build conversation context
    const conversationHistory = recentMessages?.reverse().map(msg => ({
      role: msg.is_bot ? 'assistant' : 'user',
      content: msg.content
    })) || [];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: conversationHistory.length > 0 ? conversationHistory : [
          {
            role: 'user',
            content: message
          }
        ],
        system: "You are Atlas, an AI financial advisor. You provide helpful, accurate financial advice and investment guidance. Keep responses concise and professional. Focus on practical financial insights, market analysis, and investment strategies. Always remind users to do their own research and consider consulting with a qualified financial advisor for personalized advice."
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorData}`);
    }

    const claudeResponse = await response.json();
    const botMessage = claudeResponse.content[0].text;

    // Save bot response
    const { error: botMessageError } = await supabaseClient
      .from('messages')
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        content: botMessage,
        is_bot: true
      });

    if (botMessageError) {
      throw new Error(`Failed to save bot message: ${botMessageError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        message: botMessage, 
        sessionId: currentSessionId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in claude-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});