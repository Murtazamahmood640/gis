import SectionHeading from "@/components/SectionHeading";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Legal" title="Privacy Policy" description="Last updated: February 2026" />
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="space-y-10 text-muted-foreground leading-relaxed text-sm sm:text-base">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">1. Information We Collect</h3>
              <p className="mb-2">We collect personal information you provide when booking an appointment, including your name, email address, phone number, vehicle information, and service address. We may also collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Device and browser information when you visit our website</li>
                <li>Usage data such as pages visited and time spent on site</li>
                <li>Communication records when you contact our support team</li>
                <li>Payment information processed securely through third-party providers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h3>
              <p className="mb-2">Your information is used to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process and manage your detailing appointments</li>
                <li>Communicate about appointment confirmations, reminders, and updates</li>
                <li>Send promotional offers and discounts (with your consent)</li>
                <li>Improve our services and customer experience</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations and resolve disputes</li>
              </ul>
              <p className="mt-2">We never sell your personal data to third parties.</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">3. Data Sharing</h3>
              <p>We may share your information with trusted service providers who assist in operating our business, such as payment processors, email services, and analytics platforms. All third parties are bound by confidentiality agreements and data protection standards.</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">4. Cookies & Tracking</h3>
              <p>Our website uses cookies and similar technologies to enhance your browsing experience. You can manage your cookie preferences through your browser settings. We use analytics cookies to understand website usage patterns and improve our services.</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">5. Data Security</h3>
              <p>We implement industry-standard security measures to protect your personal information, including SSL encryption, secure servers, and regular security audits. All data is encrypted in transit and at rest. Access to personal data is restricted to authorized personnel only.</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">6. Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">7. Data Retention</h3>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Appointment records are typically retained for 3 years for warranty and service history purposes.</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">8. Contact Us</h3>
              <p>If you have questions about this privacy policy or wish to exercise your data rights, please contact us at info@premiumdetail.com or call (555) 123-4567. We aim to respond to all inquiries within 48 business hours.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
