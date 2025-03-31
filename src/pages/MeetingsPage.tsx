
import { MainLayout } from "@/components/layout/MainLayout";
import { MeetingsDashboard } from "@/components/meetings/MeetingsDashboard";
import { Footer } from "@/components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import NotesStandalonePage from "./meetings/NotesStandalonePage";
import AgendaStandalonePage from "./meetings/AgendaStandalonePage";

const MeetingsPage = () => {
  return (
    <Routes>
      <Route path="notes-standalone" element={<NotesStandalonePage />} />
      <Route path="agenda-standalone" element={<AgendaStandalonePage />} />
      <Route path="/" element={
        <div className="flex flex-col min-h-screen">
          <MainLayout>
            <MeetingsDashboard />
          </MainLayout>
          <Footer compact className="mt-auto w-full" />
        </div>
      } />
    </Routes>
  );
};

export default MeetingsPage;
