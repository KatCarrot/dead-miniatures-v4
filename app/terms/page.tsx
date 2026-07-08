import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="July 8, 2026">
      <p>
        These terms cover your use of this website
        (<strong>Dead Miniatures</strong>, &ldquo;the site&rdquo;), operated by
        an individual artist based in Belarus (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). By browsing the site, you agree to them. If you
        don&rsquo;t agree, please don&rsquo;t use the site.
      </p>

      <h2>1. What this site is</h2>
      <p>
        This site is a portfolio and showcase of hand-painted miniatures. It
        doesn&rsquo;t process payments or take orders directly — every
        commission, purchase, or collaboration is agreed separately, directly
        with us, outside this website (by email, Instagram, or however we
        arrange it with you). These terms cover only your use of the{" "}
        <em>website</em>; the terms of any actual commission or sale are
        whatever we agree with you individually at the time.
      </p>

      <h2>2. Intellectual property</h2>
      <p>
        All photos, videos, text, and design on this site are our work (or used
        with permission) and stay our property. You&rsquo;re welcome to view,
        share a link to, or screenshot a page for personal, non-commercial use
        (e.g. sharing a piece you like). You may not reproduce, resell,
        redistribute, or use our photos/videos commercially, or claim our work as
        your own, without our written permission first.
      </p>

      <h2>3. The showcase &amp; availability</h2>
      <p>
        Pieces marked &ldquo;Available&rdquo; or &ldquo;Sold&rdquo; reflect our
        own records and may not always be perfectly up to date at the exact
        moment you&rsquo;re browsing. Nothing on this site is an offer to sell
        that we&rsquo;re automatically bound to — availability, pricing, and
        commission slots are confirmed directly with you when we talk.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          attempt to disrupt, overload, or gain unauthorised access to the site
          or the systems behind it;
        </li>
        <li>scrape, copy, or bulk-download the site&rsquo;s content; or</li>
        <li>use the contact form for spam, harassment, or unlawful purposes.</li>
      </ul>

      <h2>5. Third-party links</h2>
      <p>
        We link to our Instagram and YouTube. Those are run by their own
        platforms under their own terms — we&rsquo;re not responsible for their
        content, availability, or how they handle your data once you&rsquo;re
        there.
      </p>

      <h2>6. No warranty</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. We try to keep it accurate and
        available, but we don&rsquo;t guarantee it will be error-free,
        uninterrupted, or available at all times.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we&rsquo;re not liable for any indirect,
        incidental, or consequential loss arising from your use of this website.
        This doesn&rsquo;t limit any liability that can&rsquo;t legally be
        excluded, including mandatory consumer-protection rights you may have
        under the law of your own country if you&rsquo;re a consumer in the EU or
        US.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These terms are governed by the law of Belarus, where we are based. If
        you&rsquo;re a consumer based in the EU or US, this doesn&rsquo;t take
        away any mandatory protections you&rsquo;re entitled to under the law of
        your own country of residence.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these terms as the site changes. The &ldquo;last
        updated&rdquo; date above shows when they were last revised.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:Deaddietrich@gmail.com">Deaddietrich@gmail.com</a>. See
        also our <Link href="/privacy">Privacy Policy</Link> for how we handle
        your data.
      </p>
    </LegalPage>
  );
}
