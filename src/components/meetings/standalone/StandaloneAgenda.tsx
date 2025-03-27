
import { MeetingAgenda } from "../MeetingAgenda";
import { Card, CardContent } from "@/components/ui/card";

export const StandaloneAgenda = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <MeetingAgenda isStandalone={true} />
        </CardContent>
      </Card>
    </div>
  );
};
