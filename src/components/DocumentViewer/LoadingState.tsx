
export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground mt-2">Loading document...</p>
    </div>
  );
};
