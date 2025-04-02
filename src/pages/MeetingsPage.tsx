
import { MainLayout } from "@/components/layout/MainLayout";
import { MeetingsDashboard } from "@/components/meetings/MeetingsDashboard";
import { Footer } from "@/components/layout/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import NotesStandalonePage from "./meetings/NotesStandalonePage";
import AgendaStandalonePage from "./meetings/AgendaStandalonePage";
import FeedbackStandalonePage from "./meetings/FeedbackStandalonePage";

const MeetingsPage = () => {
  const location = useLocation();
  const path = location.pathname.replace("/meetings", "");
  
  // Render different components based on the current path without using a nested router
  if (path === "/notes-standalone") {
    return <NotesStandalonePage />;
  } else if (path === "/agenda-standalone") {
    return <AgendaStandalonePage />;
  } else if (path === "/feedback-standalone") {
    return <FeedbackStandalonePage />;
  }
  
  // Default view for /meetings path
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
