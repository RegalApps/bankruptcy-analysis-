
import { MeetingNotes } from "../MeetingNotes";
import { Card, CardContent } from "@/components/ui/card";

export const StandaloneNotes = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <MeetingNotes isStandalone={true} />
        </CardContent>
      </Card>
    </div>
  );
};
