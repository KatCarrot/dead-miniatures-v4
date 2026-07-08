import LegalPage from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 8, 2026">
      <p>
        This policy explains what personal data Dead Miniatures (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects through this website, why, and what rights you
        have over it. Dead Miniatures is operated by an individual artist based in
        Belarus, serving customers primarily in the European Union and the United
        States. We can be reached at{" "}
        <a href="mailto:Deaddietrich@gmail.com">Deaddietrich@gmail.com</a>.
      </p>

      <h2>1. What we collect</h2>
      <p>
        The only personal data this site collects is what you choose to give us
        through the contact form on the homepage:
      </p>
      <ul>
        <li>your email address, and</li>
        <li>the message you write.</li>
      </ul>
      <p>
        We don&rsquo;t use analytics, advertising pixels, or any other tracking
        technology on this site. Browsing the gallery, viewing pieces, or reading
        this page does not send us any personal data.
      </p>

      <h2>2. Why we process it, and on what basis</h2>
      <p>
        We use your email and message only to read and reply to your enquiry —
        for example, about a commission, a piece in the showcase, or a general
        question. Under the EU General Data Protection Regulation (GDPR), the
        legal basis for this is your <strong>consent</strong> (Art. 6(1)(a)),
        given when you tick the consent checkbox and submit the form. You can
        withdraw that consent at any time by emailing us and asking us to delete
        your message — see Section 6.
      </p>

      <h2>3. Where your data is stored</h2>
      <p>
        Submitted messages are stored in our database, hosted by{" "}
        <strong>Supabase</strong>. The website itself is hosted by{" "}
        <strong>Vercel</strong>. Both act as our data processors — they host the
        infrastructure but don&rsquo;t use your data for their own purposes. We
        don&rsquo;t sell, rent, or share your data with any other third party.
      </p>

      <h2>4. International data transfer</h2>
      <p>
        Because we are based outside the EU and the data infrastructure above may
        also process data outside your own country, sending us a message involves
        a transfer of your data across borders. Since Belarus does not have an EU
        adequacy decision, this transfer relies on your explicit, informed consent
        as the legal basis for the transfer (GDPR Art. 49(1)(a)) — given when you
        tick the consent checkbox on the form, having been told about this here.
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        We keep contact-form messages for up to <strong>24 months</strong> from
        the date you send them, or until we&rsquo;ve fully resolved your enquiry
        and you ask us to delete it sooner — whichever you prefer. You&rsquo;re
        welcome to ask us to delete your message at any time.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Under the GDPR (and, in substance, under US state privacy laws too), you
        can ask us to:
      </p>
      <ul>
        <li>tell you what data we hold about you (access);</li>
        <li>correct it if it&rsquo;s inaccurate (rectification);</li>
        <li>delete it (erasure);</li>
        <li>restrict or object to how we use it;</li>
        <li>
          give you a copy in a portable format (data portability), where
          technically applicable; and
        </li>
        <li>withdraw your consent at any time, without affecting past processing.</li>
      </ul>
      <p>
        To exercise any of these, email{" "}
        <a href="mailto:Deaddietrich@gmail.com">Deaddietrich@gmail.com</a>. If
        you&rsquo;re in the EU and unhappy with our response, you can lodge a
        complaint with your local data protection supervisory authority.
      </p>

      <h2>7. EU representative</h2>
      <p>
        GDPR Art. 27 can require a business outside the EU that serves EU
        customers to appoint a representative in the EU. We rely on the Art.
        27(2) exemption for occasional, low-risk processing that doesn&rsquo;t
        involve special categories of data or large-scale processing — this site
        collects a small volume of contact-form messages, nothing more sensitive.
        If that changes, we&rsquo;ll appoint a representative and update this
        policy.
      </p>

      <h2>8. Cookies</h2>
      <p>
        This site sets exactly one cookie: a session cookie created by Auth.js
        when the site owner signs in to the admin panel. It is strictly
        necessary for that login to work, is never set for ordinary visitors
        browsing the public site, and doesn&rsquo;t track you in any way. Because
        it&rsquo;s strictly necessary, it doesn&rsquo;t require consent under the
        EU ePrivacy rules. We don&rsquo;t use any analytics, advertising, or
        third-party tracking cookies. This site does not respond to browser
        &ldquo;Do Not Track&rdquo; signals, because we have nothing to track in
        the first place.
      </p>

      <h2>9. US visitors</h2>
      <p>
        We don&rsquo;t sell or share your personal information for money or
        other consideration, and we don&rsquo;t knowingly collect data from
        anyone under 13. The categories of personal information collected
        (contact details, and the content of your message) and the purpose
        (responding to your enquiry) are described in Sections 1&ndash;2 above.
      </p>

      <h2>10. Children&rsquo;s privacy</h2>
      <p>
        This site isn&rsquo;t directed at children, and we don&rsquo;t knowingly
        collect data from anyone under 16. If you believe a child has sent us
        personal data, contact us and we&rsquo;ll delete it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        If we change what we collect or why, we&rsquo;ll update this page and
        change the &ldquo;last updated&rdquo; date above.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about this policy or your data:{" "}
        <a href="mailto:Deaddietrich@gmail.com">Deaddietrich@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
