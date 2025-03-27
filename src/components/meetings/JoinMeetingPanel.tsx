
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, UserPlus, Link2 } from "lucide-react";
import { JoinWithUrlForm } from "./join/JoinWithUrlForm";
import { JoinWithIdForm } from "./join/JoinWithIdForm";
import { MeetingServiceCard } from "./join/MeetingServiceCard";

export const JoinMeetingPanel = () => {
  const [activeTab, setActiveTab] = useState("url");
  
  const meetingServices = [
    {
      title: "Zoom",
      icon: Link2,
      url: "https://zoom.us/join",
      bgColorClass: "bg-blue-100",
      textColorClass: "text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      title: "Google Meet",
      icon: Video,
      url: "https://meet.google.com",
      bgColorClass: "bg-green-100",
      textColorClass: "text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    {
      title: "TeamViewer",
      icon: Link2,
      url: "https://www.teamviewer.com/en-us/download/",
      bgColorClass: "bg-purple-100",
      textColorClass: "text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-tight">Join a Meeting</h2>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <CardTitle>Join Meeting</CardTitle>
          </div>
          <CardDescription>
            Enter a meeting URL or ID to join an existing meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>Join with URL</span>
              </TabsTrigger>
              <TabsTrigger value="id" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Join with ID</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="mt-4">
              <JoinWithUrlForm onJoin={() => {}} />
            </TabsContent>
            
            <TabsContent value="id" className="mt-4">
              <JoinWithIdForm onJoin={() => {}} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {meetingServices.map(service => (
          <MeetingServiceCard
            key={service.title}
            title={service.title}
            icon={service.icon}
            url={service.url}
            bgColorClass={service.bgColorClass}
            textColorClass={service.textColorClass}
          />
        ))}
      </div>
    </div>
  );
};
