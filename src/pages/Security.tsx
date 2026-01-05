import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Server, UserCheck, Bell } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your messages are encrypted before they leave your device and remain encrypted until delivered to your intended recipients.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "We use enterprise-grade cloud infrastructure with regular security audits, automated backups, and redundant systems.",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Design",
    description:
      "Our team cannot read your messages. Only you and your designated recipients have access to your content.",
  },
  {
    icon: UserCheck,
    title: "Trusted Contact Verification",
    description:
      "A multi-party verification system ensures messages are only delivered when conditions you set are genuinely met.",
  },
  {
    icon: Shield,
    title: "Row-Level Security",
    description:
      "Database-level policies ensure your data is isolated and inaccessible to other users, even in the unlikely event of a breach.",
  },
  {
    icon: Bell,
    title: "Activity Monitoring",
    description:
      "We monitor for suspicious activity and will notify you of any unusual access attempts on your account.",
  },
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Security at EchoLight
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your messages are sacred. We've built EchoLight with security and
              privacy at its core, so you can trust that your words will reach
              only the people you choose.
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="space-y-8 max-w-3xl mx-auto">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Our Security Practices
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Regular third-party security assessments</li>
                <li>Encrypted data at rest and in transit (TLS 1.3)</li>
                <li>Secure authentication with hashed passwords</li>
                <li>Automatic session expiration and secure cookies</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Regular software updates and vulnerability patching</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Responsible Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you discover a security vulnerability in EchoLight, please
                report it responsibly to{" "}
                <a
                  href="mailto:security@echolight.live"
                  className="text-primary hover:underline"
                >
                  security@echolight.live
                </a>
                . We appreciate your help in keeping our platform safe and will
                work with you to address any issues promptly.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Questions?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our security practices, please reach
                out to{" "}
                <a
                  href="mailto:support@echolight.live"
                  className="text-primary hover:underline"
                >
                  support@echolight.live
                </a>
                . We're happy to provide more details about how we protect your
                data.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
