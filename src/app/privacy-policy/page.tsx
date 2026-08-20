import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export const dynamic = 'force-dynamic';

export default function PrivacyPolicyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto w-full p-6 md:p-12">
        <div className="bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-8 md:p-16 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Last Updated: March 15, 2026</p>
            
            <div className="space-y-10 text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg">
              <section>
                <p>
                  At Recura (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information. By using our services, you consent to the data practices described in this statement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <p>
                    <strong>Personal Data:</strong> We may collect personally identifiable information, such as your name, email address, physical address, and phone number, when you voluntarily provide it to us through account registration or direct communication.
                  </p>
                  <p>
                    <strong>Usage Data:</strong> We automatically collect information about how you interact with our services. This may include your IP address, browser type, operating system, referring URLs, device information, and diagnostic data about your usage patterns.
                  </p>
                  <p>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to track activity on our service and store specific information. This allows us to improve and personalize your experience.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the collected data for various indispensable business purposes, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide, maintain, and improve our Service.</li>
                  <li>To notify you about critical changes and updates to our platform.</li>
                  <li>To allow you to participate in interactive features when you choose to do so.</li>
                  <li>To provide exemplary customer support and respond to inquiries.</li>
                  <li>To gather profound analysis or valuable information so that we can improve the user experience.</li>
                  <li>To monitor the usage of our Service and detect, prevent, and address technical issues.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Retention and Security</h2>
                <p>
                  We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. The security of your data is paramount to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable, industry-standard AES-256 encryption to protect your Personal Data, we cannot guarantee its absolute security against determined malicious actors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Sharing Your Data</h2>
                <p>
                  We do not sell your personal information to third parties. We may employ third-party companies and individuals to facilitate our Service (Service Providers), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Data Protection Rights</h2>
                <p className="mb-4">Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                  <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or incomplete.</li>
                  <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <strong>privacy@recura.com</strong> or write to us at our corporate headquarters.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
