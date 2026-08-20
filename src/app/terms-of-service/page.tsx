import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export const dynamic = 'force-dynamic';

export default function TermsOfServicePage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto w-full p-6 md:p-12">
        <div className="bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-3xl p-8 md:p-16 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Last Updated: March 15, 2026</p>
            
            <div className="space-y-10 text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg">
              <section>
                <p>
                  These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Recura (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of our business dashboard platform and related services securely located at recura.com. 
                </p>
                <p className="mt-4">
                  By accessing the Site, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. User Registration and Security</h2>
                <p>
                  You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Prohibited Activities</h2>
                <p className="mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include, but are not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Systematically retrieving data or other content from the Site to create or compile a collection, compilation, database, or directory without written permission from us.</li>
                  <li>Circumventing, disabling, or otherwise interfering with security-related features of the Site.</li>
                  <li>Engaging in unauthorized framing of or linking to the Site.</li>
                  <li>Interfering with, disrupting, or creating an undue burden on the Site or the networks or services connected to the Site.</li>
                  <li>Using the Site as part of any effort to compete with us or otherwise using the Site and/or the Content for any revenue-generating endeavor or commercial enterprise outside of intended use.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Intellectual Property Rights</h2>
                <p>
                  Unless otherwise indicated, the Site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Limitation of Liability</h2>
                <p>
                  In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Site, even if we have been advised of the possibility of such damages. 
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Modifications and Interruptions</h2>
                <p>
                  We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Governing Law</h2>
                <p>
                  These Terms shall be governed by and defined following the laws of your jurisdiction. Recura and yourself irrevocably consent that the courts of your jurisdiction shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Contact Information</h2>
                <p>
                  In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at <strong>legal@recura.com</strong>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
