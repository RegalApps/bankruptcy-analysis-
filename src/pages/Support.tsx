
export const Support = () => {
  return (
    <div className="container max-w-4xl py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            Our support team is available 24/7 to help you with any questions or issues you may have.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">support@filesecureai.com</p>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
