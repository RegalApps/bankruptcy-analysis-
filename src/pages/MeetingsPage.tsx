
import { MainLayout } from "@/components/layout/MainLayout";
import { MeetingsDashboard } from "@/components/meetings/MeetingsDashboard";
import { Footer } from "@/components/layout/Footer";

const MeetingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainLayout>
        <MeetingsDashboard />
      </MainLayout>
      <Footer compact className="mt-auto w-full" />
    </div>
  );
};

export default MeetingsPage;
