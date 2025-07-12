import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Predefined Q&A pairs for financial questions
const financialQA = [
  {
    keywords: ['portfolio', 'diversify', 'diversification'],
    response: "Diversification is key to managing risk in your portfolio. I recommend spreading your investments across different asset classes like stocks, bonds, and potentially some alternative investments. A common rule of thumb is to subtract your age from 100 to determine your stock allocation percentage, with the rest in bonds. However, consider your risk tolerance and investment timeline."
  },
  {
    keywords: ['risk', 'risky', 'safe', 'conservative'],
    response: "Risk tolerance varies by individual and depends on factors like your age, income stability, and investment timeline. Conservative investors might prefer bonds and dividend-paying stocks, while those with higher risk tolerance might consider growth stocks or emerging markets. Remember, higher potential returns usually come with higher risk."
  },
  {
    keywords: ['retirement', 'retire', '401k', 'ira', 'pension'],
    response: "For retirement planning, start early and contribute consistently. Take advantage of employer 401(k) matching if available - it's free money! Consider both traditional and Roth IRAs based on your current vs. expected future tax bracket. A general guideline is to save 10-15% of your income for retirement, but adjust based on your specific goals and timeline."
  },
  {
    keywords: ['emergency', 'fund', 'savings'],
    response: "An emergency fund is crucial for financial security. Aim to save 3-6 months of living expenses in a high-yield savings account or money market fund. This should be easily accessible and separate from your investment accounts. Start with a smaller goal like $1,000 if 3-6 months seems overwhelming."
  },
  {
    keywords: ['stock', 'stocks', 'equity', 'shares'],
    response: "When investing in individual stocks, research the company's fundamentals: revenue growth, profit margins, debt levels, and competitive position. Consider starting with broad market index funds if you're new to investing, as they provide instant diversification. Dollar-cost averaging can help reduce the impact of market volatility."
  },
  {
    keywords: ['bond', 'bonds', 'fixed income'],
    response: "Bonds can provide stability and income to your portfolio. Government bonds are generally safer but offer lower returns, while corporate bonds offer higher yields with more risk. Consider bond funds for diversification. Bond prices typically move inversely to interest rates, so be aware of interest rate risk."
  },
  {
    keywords: ['debt', 'credit card', 'loan', 'mortgage'],
    response: "Prioritize paying off high-interest debt first, especially credit cards. For mortgages and student loans with lower interest rates, you might consider investing extra money instead of paying them off early, depending on your situation. Create a debt repayment plan and stick to it - the debt snowball or avalanche methods can be effective."
  },
  {
    keywords: ['budget', 'budgeting', 'expenses', 'spending'],
    response: "Create a budget using the 50/30/20 rule as a starting point: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your expenses for a month to understand your spending patterns. Use budgeting apps or spreadsheets to monitor your progress and adjust as needed."
  },
  {
    keywords: ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum'],
    response: "Cryptocurrency is a highly volatile and speculative investment. If you choose to invest, only allocate a small percentage of your portfolio (typically 5-10% maximum) and money you can afford to lose. Research thoroughly, understand the technology, and be prepared for significant price swings."
  },
  {
    keywords: ['market', 'crash', 'recession', 'volatility'],
    response: "Market volatility is normal and crashes are part of investing. Stay calm and avoid emotional decisions. If you have a long-term investment horizon, market downturns can present buying opportunities. Maintain your diversified portfolio and continue regular investing through dollar-cost averaging."
  }
];

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

    // Generate response based on predefined Q&A
    const userMessageLower = message.toLowerCase();
    let botMessage = "I'm Atlas, your AI financial advisor. I can help you with questions about portfolio diversification, risk management, retirement planning, emergency funds, stocks, bonds, debt management, budgeting, and market volatility. What specific financial topic would you like to discuss?";

    // Find matching response based on keywords
    for (const qa of financialQA) {
      if (qa.keywords.some(keyword => userMessageLower.includes(keyword))) {
        botMessage = qa.response + "\n\nRemember, this is general guidance. Always consider consulting with a qualified financial advisor for personalized advice based on your specific situation.";
        break;
      }
    }

    // Check for greeting keywords
    if (['hello', 'hi', 'hey', 'start'].some(word => userMessageLower.includes(word))) {
      botMessage = "Hello! I'm Atlas, your AI financial advisor. I'm here to help you with investment guidance, portfolio management, and financial planning. What financial topic would you like to explore today?";
    }

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