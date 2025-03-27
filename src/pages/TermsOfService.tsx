
import { MainLayout } from "@/components/layout/MainLayout";
import { Footer } from "@/components/layout/Footer";

export const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainLayout>
        <div className="container max-w-4xl py-8 px-6 mb-16">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">1. Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing FileSecureAI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily use this software for personal or business purposes. This is the grant of a license, not a transfer of title, and under this license you may not modify, reproduce, or create derivative works based upon our service.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The materials on FileSecureAI's website are provided on an 'as is' basis. FileSecureAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties of merchantability or fitness for a particular purpose.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p className="text-muted-foreground mb-4">
                In no event shall FileSecureAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FileSecureAI's website.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
              <p className="text-muted-foreground mb-4">
                The materials appearing on FileSecureAI's website could include technical, typographical, or photographic errors. FileSecureAI does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>
          </div>
        </div>
      </MainLayout>
      <Footer compact className="mt-auto" />
    </div>
  );
};

export default TermsOfService;
