
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    // Envoyer l'email à l'administrateur
    const adminEmail = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'contact@andreahardy.fr',
      subject: `Nouveau message de contact: ${formData.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Sujet:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `,
    });

    // Envoyer un email de confirmation à l'expéditeur
    const confirmationEmail = await resend.emails.send({
      from: 'Andrea Hardy <onboarding@resend.dev>',
      to: formData.email,
      subject: 'Confirmation de réception de votre message',
      html: `
        <h2>Bonjour ${formData.name},</h2>
        <p>J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
        <p>Pour rappel, voici votre message :</p>
        <p><strong>Sujet:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <br>
        <p>Cordialement,</p>
        <p>Andrea Hardy</p>
      `,
    });

    console.log('Emails sent successfully:', { adminEmail, confirmationEmail });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
