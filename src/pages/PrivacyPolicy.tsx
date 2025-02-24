
export const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-gray">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground">
            FileSecureAI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
        </section>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
