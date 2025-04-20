
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { MeetingsDashboard } from "@/components/meetings/MeetingsDashboard";
import NotesStandalonePage from "./meetings/NotesStandalonePage";
import AgendaStandalonePage from "./meetings/AgendaStandalonePage";
import FeedbackStandalonePage from "./meetings/FeedbackStandalonePage";

const MeetingsPage = () => {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <MeetingsDashboard />
        </MainLayout>
      } />
      <Route path="/notes" element={<NotesStandalonePage />} />
      <Route path="/agenda" element={<AgendaStandalonePage />} />
      <Route path="/feedback" element={<FeedbackStandalonePage />} />
    </Routes>
  );
};

export default MeetingsPage;
