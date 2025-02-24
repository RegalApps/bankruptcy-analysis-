
export const TermsOfService = () => {
  return (
    <div className="container max-w-4xl py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-gray">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">1. Terms</h2>
          <p className="text-muted-foreground">
            By accessing FileSecureAI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default TermsOfService;
