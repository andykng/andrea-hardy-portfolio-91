
export class AIContentGenerator {
  private supabaseUrl: string;
  private supabaseAnonKey: string;
  private endpointUrl: string;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.endpointUrl = `${supabaseUrl}/functions/v1/deepseek-integration`;
  }

  /**
   * Génère du contenu en utilisant l'IA
   * @param contentType - Type de contenu ('blog', 'product-description', 'social-media', 'seo-metadata')
   * @param prompt - Instructions pour l'IA
   * @param options - Options additionnelles (model, temperature, max_tokens)
   * @returns Promise - Le contenu généré
   */
  async generateContent(
    contentType: string, 
    prompt: string, 
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    } = {}
  ) {
    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          prompt,
          options
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la génération de contenu:', error);
      throw error;
    }
  }

  /**
   * Génère un article de blog
   * @param topic - Sujet du blog
   * @returns Promise - Le contenu généré
   */
  async generateBlogPost(topic: string) {
    return this.generateContent('blog', topic);
  }

  /**
   * Génère une description de produit
   * @param productInfo - Information sur le produit
   * @returns Promise - Le contenu généré
   */
  async generateProductDescription(productInfo: string) {
    return this.generateContent('product-description', productInfo);
  }

  /**
   * Génère un post pour les réseaux sociaux
   * @param topic - Sujet du post
   * @returns Promise - Le contenu généré
   */
  async generateSocialMediaPost(topic: string) {
    return this.generateContent('social-media', topic);
  }

  /**
   * Génère des métadonnées SEO
   * @param pageInfo - Information sur la page
   * @returns Promise - Les métadonnées générées
   */
  async generateSEOMetadata(pageInfo: string) {
    return this.generateContent('seo-metadata', pageInfo);
  }
}

// Export an instance with the project's Supabase URL and anon key
export const aiContentGenerator = new AIContentGenerator(
  "https://nxwrldqcewwaamrsvlon.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3JsZHFjZXd3YWFtcnN2bG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjc4NDMsImV4cCI6MjA1NTgwMzg0M30.DC2GGhH_kQWd559UBK81LhPbLUzHW46bP45XAs7gSS4"
);
