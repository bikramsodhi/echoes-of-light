import { useState } from "react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  email: z.string().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  message: z.string().min(1, "Please share your thoughts").max(5000, "Message must be less than 5000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending (in production, this would call an edge function)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Your words have reached us
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto mb-8">
                Thank you for taking the time to share your thoughts. 
                We read everything with care.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="text-muted-foreground"
              >
                Send another message
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
              Share Your Thoughts
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                EchoLight is still growing—and your voice helps shape it.
              </p>
              <p className="text-base">
                If something didn't feel right, or something beautiful could be even better, 
                we'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Your name
                <span className="text-muted-foreground/60 text-sm ml-2">(optional)</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="How should we address you?"
                className="bg-background border-border/60 focus:border-primary/50"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
                <span className="text-muted-foreground/60 text-sm ml-2">
                  (only if you'd like a reply)
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className="bg-background border-border/60 focus:border-primary/50"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                What's on your mind?
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="A reflection, a suggestion, a story, or simply what you felt..."
                rows={6}
                className="bg-background border-border/60 focus:border-primary/50 resize-none"
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto gap-2"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send with care
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Closing Note */}
          <p className="text-center text-muted-foreground/70 text-sm mt-12 leading-relaxed">
            We read everything with care.<br />
            Thank you for helping EchoLight grow more quietly human.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
