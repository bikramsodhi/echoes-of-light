import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Welcome to EchoLight
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By using EchoLight, you agree to these terms. Please read them
                carefully. EchoLight provides a platform for creating and
                scheduling the delivery of personal messages to your loved ones.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to use EchoLight. By creating
                an account, you confirm that you meet this requirement and that
                the information you provide is accurate.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Your Account
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  You are responsible for maintaining the security of your
                  account credentials.
                </li>
                <li>
                  You are responsible for all activity that occurs under your
                  account.
                </li>
                <li>
                  You must notify us immediately of any unauthorized access.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Your Content
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You retain full ownership of all messages, media, and content
                you create on EchoLight. By using our service, you grant us a
                limited license to store, process, and deliver your content as
                necessary to provide our services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use EchoLight to create or distribute content
                that is illegal, harmful, threatening, abusive, defamatory, or
                otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Message Delivery
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                EchoLight will make reasonable efforts to deliver your messages
                according to your specified conditions. However, we cannot
                guarantee delivery in all circumstances. Factors outside our
                control—such as invalid contact information or technical
                failures—may affect delivery.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Trusted Contacts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                When you designate trusted contacts, you authorize them to
                verify conditions for message delivery. You are responsible for
                choosing trustworthy individuals and keeping their contact
                information current.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Service Availability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain EchoLight's availability but cannot
                guarantee uninterrupted service. We may temporarily suspend
                access for maintenance, updates, or unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, EchoLight shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Changes to These Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. We will notify you
                of significant changes via email or through the service.
                Continued use of EchoLight after changes constitutes acceptance
                of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You may close your account at any time. We reserve the right to
                suspend or terminate accounts that violate these terms. Upon
                termination, your data will be handled according to our Privacy
                Policy.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:support@echolight.live"
                  className="text-primary hover:underline"
                >
                  support@echolight.live
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
