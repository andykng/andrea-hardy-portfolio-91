
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the API key from environment variables
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  contentType?: string; // 'blog', 'product-description', etc.
  prompt?: string;
  topic?: string;      // For backward compatibility
  category?: string;   // For backward compatibility
  type?: string;       // For backward compatibility
  article?: string;    // For backward compatibility
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract request data
    const requestData: RequestBody = await req.json();
    console.log("Request data:", JSON.stringify(requestData).substring(0, 200) + "...");
    
    let prompt = requestData.prompt;
    let contentType = requestData.contentType || 'blog';
    const options = requestData.options || {};
    
    // Handle backward compatibility with existing components
    if (!prompt && requestData.topic) {
      prompt = requestData.topic;
      
      // Handle the existing blog generator format
      if (requestData.type) {
        if (requestData.type === 'full') {
          contentType = 'blog';
        } else if (requestData.type === 'excerpt') {
          contentType = 'blog-excerpt';
        } else if (requestData.type === 'title') {
          contentType = 'blog-title';
        }
      }
    }
    
    // Handle AIAssistant format
    if (requestData.article && requestData.prompt) {
      contentType = 'tech-assistant';
      prompt = `${requestData.article}\n\n${requestData.prompt}`;
    }
    
    if (!prompt) {
      console.error("Missing prompt in request");
      return new Response(
        JSON.stringify({ error: "Le prompt est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Build the system prompt and user prompt based on content type
    let systemPrompt = "Tu es un expert en création de contenu spécialisé en technologie.";
    let userPrompt = prompt;
    
    // Optimize the prompt based on content type
    switch (contentType) {
      case "blog":
        systemPrompt = "Tu es un expert en rédaction de contenus spécialisés dans le domaine de la technologie et du développement informatique. Tu dois générer des articles de blog informatifs, précis et bien structurés qui mettent en valeur ton expertise technique.";
        userPrompt = `Génère un article de blog complet et détaillé sur le sujet suivant: "${prompt}". 
        L'article doit inclure:
        - Un titre accrocheur
        - Une introduction qui présente le sujet et sa pertinence
        - Plusieurs sections avec sous-titres
        - Un corps détaillé avec des exemples et des explications
        - Une conclusion avec des perspectives d'avenir
        - Utilise un ton professionnel mais accessible.`;
        
        if (requestData.category) {
          userPrompt += ` L'article doit être pertinent pour la catégorie "${requestData.category}" et inclure des termes techniques appropriés pour ce domaine.`;
        }
        break;
        
      case "blog-excerpt":
        systemPrompt = "Tu es un expert en rédaction de contenus spécialisés dans le domaine de la technologie.";
        userPrompt = `Génère un résumé concis (environ 150 mots) pour un article de blog sur le sujet: "${prompt}". 
        Ce résumé servira d'extrait pour donner aux lecteurs une idée du contenu sans révéler tous les détails.`;
        break;
        
      case "blog-title":
        systemPrompt = "Tu es un expert en rédaction de titres accrocheurs et SEO-friendly.";
        userPrompt = `Suggère 5 titres accrocheurs pour un article de blog sur le thème: "${prompt}". 
        Les titres doivent être engageants et optimisés pour le référencement naturel.`;
        break;
        
      case "product-description":
        systemPrompt = "Tu es un expert en copywriting et marketing de produits.";
        userPrompt = `Crée une description de produit convaincante pour: ${prompt}. 
        Mets en avant les caractéristiques principales, les avantages et la valeur pour le client. 
        La description doit être attrayante et orientée vers la conversion.`;
        break;
        
      case "social-media":
        systemPrompt = "Tu es un expert en marketing sur les réseaux sociaux.";
        userPrompt = `Génère un post pour les réseaux sociaux à propos de: ${prompt}. 
        Le post doit être concis, engageant et inclure des hashtags pertinents.`;
        break;
        
      case "seo-metadata":
        systemPrompt = "Tu es un expert en SEO et méta-données.";
        userPrompt = `Crée un titre SEO, une méta-description et des mots-clés pour: ${prompt}. 
        Formate la réponse en JSON avec les champs 'title', 'description' et 'keywords'.`;
        break;
        
      case "tech-assistant":
        systemPrompt = "Tu es AssistProTech, un assistant spécialisé en technologies informatiques qui aide à analyser et à comprendre des articles de veille technologique. Tes fonctionnalités principales sont la génération de résumés de projets à partir de spécifications techniques et l'analyse de compétences pour suggérer des technologies complémentaires. Tu donnes des explications claires, concises et informatives. Tu expliques les concepts techniques de manière accessible.";
        userPrompt = prompt; // Already formatted in the handler above
        break;
    }
    
    console.log(`Calling DeepSeek API with contentType: ${contentType}`);
    
    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000
      })
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek Error (${response.status}):`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek Error: ${response.status}`, 
          details: errorText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Process the response
    const responseText = await response.text();
    console.log("Raw DeepSeek response:", responseText.substring(0, 200) + "...");
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      return new Response(
        JSON.stringify({ 
          error: "Error parsing response from DeepSeek", 
          details: e.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Extract the generated content
    const generatedContent = data.choices[0]?.message?.content || "";
    
    // Format the response depending on the original format expected by the client
    if (contentType === 'tech-assistant' || requestData.article) {
      // AIAssistant expects this format
      return new Response(
        JSON.stringify({
          response: generatedContent,
          content: generatedContent
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (requestData.type) {
      // BlogAIGenerator expects this format
      return new Response(
        JSON.stringify({
          content: generatedContent
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // New format for the AIContentGenerator class
      return new Response(
        JSON.stringify({
          contentType,
          content: generatedContent,
          metadata: {
            model: options.model || "deepseek-chat",
            prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : "")
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Server error:", error.message);
    
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
