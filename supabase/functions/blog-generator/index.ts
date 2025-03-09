
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
    console.log("Fonction blog-generator appelée, méthode:", req.method);
    
    // Vérification de la clé API
    if (!DEEPSEEK_API_KEY) {
      console.error("Erreur: DEEPSEEK_API_KEY n'est pas définie");
      throw new Error("Clé API DeepSeek manquante. Veuillez configurer la variable d'environnement DEEPSEEK_API_KEY.");
    }
    
    // Analyse du corps de la requête
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Corps de la requête:", JSON.stringify(requestBody));
    } catch (e) {
      console.error("Erreur lors de l'analyse du corps de la requête:", e);
      throw new Error("Format de requête invalide. Assurez-vous d'envoyer un JSON valide.");
    }

    const { topic, category, type } = requestBody;

    if (!topic) {
      throw new Error("Le sujet est requis");
    }

    let prompt = "";
    
    if (type === "full") {
      prompt = `Génère un article de blog complet et détaillé sur le sujet suivant: "${topic}". 
      L'article doit inclure:
      - Un titre accrocheur
      - Une introduction qui présente le sujet et sa pertinence
      - Plusieurs sections avec sous-titres
      - Un corps détaillé avec des exemples et des explications
      - Une conclusion avec des perspectives d'avenir
      - Utilise un ton professionnel mais accessible.`;
    } else if (type === "excerpt") {
      prompt = `Génère un résumé concis (environ 150 mots) pour un article de blog sur le sujet: "${topic}". 
      Ce résumé servira d'extrait pour donner aux lecteurs une idée du contenu sans révéler tous les détails.`;
    } else if (type === "title") {
      prompt = `Suggère 5 titres accrocheurs pour un article de blog sur le thème: "${topic}". 
      Les titres doivent être engageants et optimisés pour le référencement naturel.`;
    } else {
      prompt = `Génère un article de blog sur le sujet: "${topic}". Utilise un ton professionnel et informatif.`;
    }

    if (category) {
      prompt += ` L'article doit être pertinent pour la catégorie "${category}" et inclure des termes techniques appropriés pour ce domaine.`;
    }

    console.log("Appel de l'API DeepSeek pour générer un blog, prompt:", prompt.substring(0, 100) + "...");

    try {
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
              content: "Tu es un expert en rédaction de contenus spécialisés dans le domaine de la technologie et du développement informatique. Tu dois générer des articles de blog informatifs, précis et bien structurés qui mettent en valeur ton expertise technique."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        }),
      });

      console.log("Statut de la réponse DeepSeek:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API DeepSeek - Réponse complète:", errorData);
        throw new Error(`Erreur API DeepSeek (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      console.log("Réponse de l'API DeepSeek reçue correctement");

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Format de réponse DeepSeek inattendu:", JSON.stringify(data));
        throw new Error("Format de réponse DeepSeek inattendu");
      }

      return new Response(JSON.stringify({
        content: data.choices[0].message.content
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API DeepSeek:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans la fonction blog-generator:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
