import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePageMeta from '../hooks/usePageMeta';
import rawHtml from './PrivacyPolicyRaw.html?raw';

export default function PrivacyPolicyPage() {
  usePageMeta('Privacy Policy — MK 1974', 'Privacy Policy for MK 1974.');

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[900px] mx-auto bg-white p-6 sm:p-12 rounded-xl border border-black/10 shadow-sm privacy-policy-content">
          <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
        </div>
      </main>
      <Footer />
    </>
  );
}
