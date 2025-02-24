
import { MainHeader } from "@/components/header/MainHeader";

export const ActivityPage = () => {
  return (
    <div className="pl-16">
      <MainHeader />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Activity</h1>
        <p className="text-muted-foreground">Track your document activity here.</p>
      </div>
    </div>
  );
};
