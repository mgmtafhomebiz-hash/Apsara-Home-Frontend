import LegalPageShell from '@/components/legal/LegalPageShell';

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      subtitle="Clear terms help everyone. Please review the guidelines that apply when using our website and services."
    >
      <p>The following are the latest Terms and Conditions of AF Home.</p>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Independent Distributor Agreement</h2>
        <p>
          By becoming a distributor of our company, you agree to be bound by the terms and conditions outlined in this
          agreement. You acknowledge that you are an independent contractor and not an employee, partner, or agent of
          the company.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Distributor Obligations</h2>
        <p>As a distributor, you agree to perform the following obligations:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Adhere to all applicable laws, regulations, and ethical guidelines in promoting and selling our
            products/services.
          </li>
          <li>Represent the company and its products/services honestly and accurately.</li>
          <li>
            Maintain a positive and professional image and avoid any activities that may damage the reputation of the
            company.
          </li>
          <li>Attend and participate in training and development programs provided by the company.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Compensation Plan</h2>
        <p>
          Our company uses a compensation plan that rewards distributors for sales and building a network. The details
          of the compensation plan, including commission structure, bonus eligibility, and qualification criteria, are
          outlined in a separate document, which is an integral part of these terms and conditions.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Product Purchase Requirements</h2>
        <p>
          To remain an active distributor and qualify for commissions and bonuses, you are required to meet monthly or
          quarterly product purchase requirements. These requirements may include personal consumption and/or retail
          sales requirements. Failure to meet these requirements may result in the loss of commissions and bonuses.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. Downline Structure</h2>
        <p>
          You may build and manage a network of distributors, commonly referred to as your &quot;downline.&quot; You
          understand that your commissions and bonuses may be based on the sales performance and activities of your
          downline. However, you are responsible for training, supporting, and motivating your downline members.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Termination and Resignation</h2>
        <p>
          Either party may terminate this agreement at any time with written notice. You understand that in the event
          of termination or resignation, you will no longer be eligible to receive commissions, bonuses, or other
          benefits associated with the MLM business.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">7. Intellectual Property</h2>
        <p>
          All trademarks, logos, copyrighted materials, and other intellectual property owned by the company are
          protected and may not be used without written permission. Any unauthorized use of company intellectual
          property may result in legal action.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">8. Non-Disparagement</h2>
        <p>
          During and after the term of this agreement, you agree not to make any disparaging or defamatory statements
          about the company, its products, or other distributors. Violation of this clause may result in termination
          and legal consequences.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">9. Product Returns and Refunds</h2>
        <p>
          Our company has a product return policy that allows customers to request refunds or exchanges within a
          specified time frame. You understand that you are responsible for handling customer returns and refunds, and
          any costs associated with the process.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">10. Governing Law and Jurisdiction</h2>
        <p>
          This agreement shall be governed by and construed in accordance with the laws of the Philippines. Any
          disputes arising from this agreement shall be subject to the exclusive jurisdiction of the courts of the
          Philippines.
        </p>
      </div>

      <p>
        By signing below or by accepting these terms and conditions electronically, you acknowledge that you have read,
        understood, and agreed to abide by the terms and conditions of AF Home.
      </p>

      <p className="font-medium text-gray-900 dark:text-white">
        Need clarification? Reach us anytime through the Contact Us page.
      </p>
    </LegalPageShell>
  );
}
