import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | smartXman",
  description: "Read about our terms of service, conditions, and intellectual property policies.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Terms of Service</h1>
      <p className="text-slate-500 mb-12">Last updated: June 3, 2026</p>
      
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using smartXman, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Account Responsibility</h2>
          <p>
            If you create an account on smartXman, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Affiliate Disclosure</h2>
          <p>
            smartXman participates in the Amazon Services LLC Associates Program. We may earn a commission when you click on or make purchases via our affiliate links, at no extra cost to you. Our reviews are based on our own research and expert opinion, and the presence of an affiliate link does not influence our product ratings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of smartXman and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any part of this site without express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Limitation of Liability</h2>
          <p>
            smartXman and its components are offered for informational purposes only; this site shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the site following any such change constitutes your agreement to follow and be bound by the terms as changed.
          </p>
        </section>
      </div>
    </div>
  );
}
