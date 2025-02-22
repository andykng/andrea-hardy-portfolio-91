
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Linkedin, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const formData: ContactFormData = {
        name: (formElement.querySelector('[name="name"]') as HTMLInputElement).value,
        email: (formElement.querySelector('[name="email"]') as HTMLInputElement).value,
        subject: (formElement.querySelector('[name="subject"]') as HTMLInputElement).value,
        message: (formElement.querySelector('[name="message"]') as HTMLTextAreaElement).value,
      };

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Vous recevrez bientôt un email de confirmation.",
      });

      formElement.reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contactez-moi
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              N'hésitez pas à me contacter pour toute question ou proposition de collaboration.
              Je vous répondrai dans les plus brefs délais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-primary/10"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Sujet de votre message"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Votre message..."
                    className="w-full min-h-[150px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg border border-primary/10 space-y-4">
                <h2 className="text-xl font-semibold">Informations de contact</h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@andreahardy.fr"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    contact@andreahardy.fr
                  </a>
                  <a
                    href="https://www.linkedin.com/in/andrea-hardy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg border border-primary/10 space-y-4">
                <h2 className="text-xl font-semibold">Localisation</h2>
                <p className="text-gray-600">Rennes, France</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
