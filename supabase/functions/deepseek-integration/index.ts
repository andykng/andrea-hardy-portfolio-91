
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
    const requestBody = await req.json();
    console.log("Fonction deepseek-integration appelée avec:", JSON.stringify(requestBody).substring(0, 200) + "...");

    // Vérification de la clé API
    if (!DEEPSEEK_API_KEY) {
      console.error("Erreur: DEEPSEEK_API_KEY n'est pas définie");
      throw new Error("Clé API DeepSeek manquante");
    }

    const { messages, type, topic, category } = requestBody;

    let finalMessages = messages;
    
    // Configuration pour la génération de blog si nécessaire
    if (type && topic) {
      let systemPrompt = "Tu es un expert en rédaction de contenus spécialisés dans le domaine de la technologie et du développement informatique. Tu dois générer des articles de blog informatifs, précis et bien structurés qui mettent en valeur ton expertise technique.";
      let userPrompt = "";
      
      if (type === "full") {
        userPrompt = `Génère un article de blog complet et détaillé sur le sujet suivant: "${topic}". 
        L'article doit inclure:
        - Un titre accrocheur
        - Une introduction qui présente le sujet et sa pertinence
        - Plusieurs sections avec sous-titres
        - Un corps détaillé avec des exemples et des explications
        - Une conclusion avec des perspectives d'avenir
        - Utilise un ton professionnel mais accessible.`;
      } else if (type === "excerpt") {
        userPrompt = `Génère un résumé concis (environ 150 mots) pour un article de blog sur le sujet: "${topic}". 
        Ce résumé servira d'extrait pour donner aux lecteurs une idée du contenu sans révéler tous les détails.`;
      } else if (type === "title") {
        userPrompt = `Suggère 5 titres accrocheurs pour un article de blog sur le thème: "${topic}". 
        Les titres doivent être engageants et optimisés pour le référencement naturel.`;
      } else {
        userPrompt = `Génère un article de blog sur le sujet: "${topic}". Utilise un ton professionnel et informatif.`;
      }

      if (category) {
        userPrompt += ` L'article doit être pertinent pour la catégorie "${category}" et inclure des termes techniques appropriés pour ce domaine.`;
      }
      
      finalMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];
    }
    
    // Assistant tech-watch si aucune configuration de blog n'est fournie
    else if (!finalMessages) {
      const assistantPrompt = "Tu es AssistProTech, un assistant spécialisé en technologies informatiques qui aide à analyser et à comprendre des articles de veille technologique. Tes fonctionnalités principales sont la génération de résumés de projets à partir de spécifications techniques et l'analyse de compétences pour suggérer des technologies complémentaires. Tu donnes des explications claires, concises et informatives. Tu expliques les concepts techniques de manière accessible.";
      
      finalMessages = [
        { role: "system", content: assistantPrompt },
        { role: "user", content: requestBody.prompt || "Bonjour" }
      ];
      
      // Si un article est fourni, l'ajouter au prompt
      if (requestBody.article) {
        finalMessages[1].content = `Voici un article de veille technologique:\n\n${requestBody.article}\n\n${finalMessages[1].content}`;
      }
    }

    console.log("Appel de l'API DeepSeek avec messages:", JSON.stringify(finalMessages).substring(0, 200) + "...");

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: finalMessages,
          max_tokens: 1500,
          temperature: 0.7
        }),
      });

      console.log("Statut de la réponse DeepSeek:", response.status);
      
      const responseText = await response.text();
      console.log("Réponse brute de l'API DeepSeek:", responseText.substring(0, 200) + "...");
      
      if (!response.ok) {
        console.error("Erreur API DeepSeek - Réponse complète:", responseText);
        throw new Error(`Erreur API DeepSeek (${response.status}): ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors de l'analyse de la réponse JSON:", e);
        throw new Error(`Réponse non-JSON reçue de l'API DeepSeek: ${responseText.substring(0, 100)}...`);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Format de réponse DeepSeek inattendu:", JSON.stringify(data));
        throw new Error("Format de réponse DeepSeek inattendu");
      }

      // Format de réponse unifié pour les deux cas d'utilisation
      return new Response(JSON.stringify({
        content: data.choices[0].message.content,
        response: data.choices[0].message.content
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API DeepSeek:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans la fonction deepseek-integration:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
