
import { MainLayout } from "@/components/layout/MainLayout";
import { Footer } from "@/components/layout/Footer";

export const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainLayout>
        <div className="container max-w-4xl py-8 px-6 mb-16">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                FileSecureAI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us, such as when you create an account, upload documents, or contact customer support. This may include your name, email address, documents, and related metadata.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use your information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations. We may also use your information to personalize your experience and develop new features.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with service providers who help us operate our business, when required by law, or in connection with a merger or acquisition.
              </p>
            </section>
            
            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
              <p className="text-muted-foreground mb-4">
                We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>
          </div>
        </div>
      </MainLayout>
      <Footer compact className="mt-auto" />
    </div>
  );
};

export default PrivacyPolicy;
