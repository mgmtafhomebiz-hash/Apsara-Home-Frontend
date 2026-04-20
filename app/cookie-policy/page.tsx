import LegalPageShell from '@/components/legal/LegalPageShell';

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      subtitle="This policy explains how cookies help improve your browsing experience and how you can control them."
    >
      <p>
        At AF Home, we use cookies and similar tracking technologies to enhance your experience on our website and to
        analyze our traffic. This Cookie Policy explains what cookies are, how we use them, how third-parties we may
        partner with may use cookies on the service, your choices regarding cookies, and further information about
        cookies.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are used to store small pieces of information. They are stored on your
          device when the website is loaded on your browser. These cookies help us make the website function properly,
          make it more secure, provide better user experience, and understand how the website performs and to analyze
          what works and where it needs improvement.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. How AF Home Uses Cookies</h2>
        <p>When you use and access the Service, we may place a number of cookies files in your web browser.</p>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Essential Cookies: We use cookies to remember information that changes the way the Service behaves or
            looks, such as a user&apos;s language preference on the Service.
          </li>
          <li>
            Account-Related Cookies: We use cookies to manage the signup process and general administration. These
            cookies will usually be deleted when you log out; however, in some cases, they may remain afterward to
            remember your site preferences when logged out.
          </li>
          <li>
            Analytics Cookies: We use cookies to help us analyze how our visitors use the website and to monitor
            website performance. This helps us provide a high-quality experience by customizing our offering and
            quickly identifying and fixing any issues that arise.
          </li>
          <li>
            Advertising Cookies: We may use cookies to deliver advertisements that are relevant to you and your
            interests.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the
          Service and deliver advertisements on and through the Service. These third-party cookies are governed by the
          respective privacy policies of these third parties.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">4. Your Choices Regarding Cookies</h2>
        <p>
          If you prefer to avoid the use of cookies on the website, you must first disable the use of cookies in your
          browser and then delete the cookies saved in your browser associated with this website. You may use this
          option for preventing the use of cookies at any time.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Browser Settings: Most web browsers allow you to control cookies through their settings preferences. To
            find out more about cookies, including how to see what cookies have been set and how to manage and delete
            them, visit www.allaboutcookies.org or www.youronlinechoices.com.
          </li>
          <li>
            Opt-Out: You can opt-out of targeted advertising by visiting the following links: Network Advertising
            Initiative and Digital Advertising Alliance.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
          Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
          Changes to this Cookie Policy are effective when they are posted on this page.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">6. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy, please contact us:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: info@afhome.biz</li>
          <li>Address: AF Home Head Office, Meycauayan, Bulacan</li>
        </ul>
      </div>

      <p>Thank you for visiting AF Home!</p>
      <p className="font-medium text-gray-900 dark:text-white">
        You can update cookie preferences anytime using your browser settings.
      </p>
    </LegalPageShell>
  );
}
