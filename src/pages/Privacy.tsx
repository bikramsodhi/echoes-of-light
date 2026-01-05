import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Our Commitment to Your Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                EchoLight exists to help you leave meaningful messages for the
                people you love. We understand these messages are deeply
                personal, and we treat your privacy with the care and respect it
                deserves.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Account Information:</strong> Your name, email
                  address, and password when you create an account.
                </li>
                <li>
                  <strong>Messages & Media:</strong> The letters, voice memos,
                  photos, and videos you create within EchoLight.
                </li>
                <li>
                  <strong>Recipient Information:</strong> Names, relationships,
                  and contact details of people you designate to receive
                  messages.
                </li>
                <li>
                  <strong>Trusted Contact Information:</strong> Names and
                  contact details of individuals you appoint to verify delivery
                  conditions.
                </li>
                <li>
                  <strong>Usage Data:</strong> Basic analytics to improve our
                  service (page views, feature usage).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and maintain EchoLight's core services</li>
                <li>To deliver your messages to designated recipients</li>
                <li>To communicate with you about your account</li>
                <li>To improve and develop new features</li>
                <li>To ensure the security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Data Protection & Encryption
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your messages are encrypted at rest and in transit. We use
                industry-standard security measures to protect your data. Only
                you and your designated recipients can access your messages—our
                team cannot read them.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data for as long as your account is active or as
                needed to fulfill delivery of your messages. You may delete your
                account at any time, which will permanently remove all your data
                from our systems.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use trusted third-party services for hosting, email delivery,
                and analytics. These providers are contractually bound to
                protect your data and use it only for the purposes we specify.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Your Rights
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and download your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and all associated data</li>
                <li>Object to certain data processing</li>
                <li>Data portability where applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or your data,
                please contact us at{" "}
                <a
                  href="mailto:privacy@echolight.live"
                  className="text-primary hover:underline"
                >
                  privacy@echolight.live
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

export default Privacy;
