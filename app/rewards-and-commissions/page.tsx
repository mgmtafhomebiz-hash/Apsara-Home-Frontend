import LegalPageShell from '@/components/legal/LegalPageShell';

export default function RewardsAndCommissionsPage() {
  return (
    <LegalPageShell
      title="Rewards and Commissions"
      subtitle="Learn how rewards are earned, tracked, and distributed. We keep it transparent so you can plan with confidence."
    >
      <p className="font-semibold text-gray-900 dark:text-white">Disclaimer:</p>
      <p className="font-semibold text-gray-900 dark:text-white">Rewards and Commissions</p>

      <p>
        At AF Home, we understand the importance of transparency and clarity when it comes to network marketing rewards
        and commissions. We want to ensure that all our valued distributors and partners have a comprehensive
        understanding of how our compensation plan works. Therefore, we have prepared the following disclaimers to
        provide you with important information:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          Earnings Disclaimer: Any statements or examples of earnings mentioned in our marketing materials or
          presentations are not guarantees of income. The success and income potential of each individual distributor
          may vary based on their skills, efforts, and market conditions. We encourage you to set realistic
          expectations and understand that building a successful network marketing business requires time, dedication,
          and hard work.
        </li>
        <li>
          No Income Guarantee: We do not guarantee any level of income or financial success to our distributors. The
          amount of income you can earn will depend on various factors, including your personal efforts, the size and
          productivity of your network, and market conditions. It is important to note that success in network
          marketing is not guaranteed and individual results may vary.
        </li>
        <li>
          Compliance with Laws and Regulations: As a distributor, it is your responsibility to comply with all
          applicable laws and regulations governing network marketing and direct selling in your country or region. This
          includes but is not limited to adhering to advertising guidelines, accurately representing our products and
          business opportunity, and avoiding any misleading or deceptive practices.
        </li>
        <li>
          Investment Risk: Participating in network marketing involves certain risks, including the risk of financial
          loss. It is important to carefully evaluate the opportunity and consider your personal financial situation
          before making any investment. We recommend consulting with a financial advisor or professional to assess the
          risks and suitability of network marketing as a business opportunity for you.
        </li>
        <li>
          Independent Contractor Status: As a distributor, you are an independent contractor and not an employee,
          partner, or franchisee of Value Max. You have the freedom to operate your business according to your own
          schedule and methods, but you are also responsible for your own expenses, taxes, and legal compliance.
        </li>
        <li>
          Changes to the Compensation Plan: We reserve the right to modify or update our compensation plan at any time
          to ensure its fairness, sustainability, and compliance with legal requirements. Any changes will be
          communicated to our distributors in a timely manner.
        </li>
      </ul>

      <p>
        Please take the time to read and understand these disclaimers. If you have any questions or concerns regarding
        our network marketing rewards and commissions, please reach out to our support team for further clarification.
        We are here to support you on your journey to success.
      </p>

      <p className="font-medium text-gray-900 dark:text-white">
        Questions about commissions? Reach us anytime through the Contact Us page.
      </p>
    </LegalPageShell>
  );
}
