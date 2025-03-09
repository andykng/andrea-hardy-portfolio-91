
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const API_URL = "https://api.deepseek.com/v1/chat/completions";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, article } = await req.json();

    let finalPrompt = prompt;
    if (article) {
      finalPrompt = `Voici un article de veille technologique:\n\n${article}\n\n${prompt}`;
    }

    console.log("Appel de l'API DeepSeek avec prompt:", finalPrompt.substring(0, 100) + "...");

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Tu es AssistProTech, un assistant spécialisé en technologies informatiques qui aide à analyser et à comprendre des articles de veille technologique. Tes fonctionnalités principales sont la génération de résumés de projets à partir de spécifications techniques et l'analyse de compétences pour suggérer des technologies complémentaires. Tu donnes des explications claires, concises et informatives. Tu expliques les concepts techniques de manière accessible."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    console.log("Réponse de l'API DeepSeek - statut:", response.status);

    if (!response.ok) {
      console.error("Erreur API DeepSeek:", data);
      throw new Error(data.error?.message || "Erreur lors de la communication avec l'API DeepSeek");
    }

    return new Response(JSON.stringify({
      response: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erreur dans la fonction:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
