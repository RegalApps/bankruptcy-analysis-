
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MeetingServiceCardProps {
  title: string;
  icon: LucideIcon;
  url: string;
  bgColorClass: string;
  textColorClass: string;
}

export const MeetingServiceCard = ({
  title,
  icon: Icon,
  url,
  bgColorClass,
  textColorClass
}: MeetingServiceCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center">
          <div className={`p-2 rounded-full ${bgColorClass} ${textColorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-center text-base">{title}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(url, "_blank")}
        >
          Open {title}
        </Button>
      </CardFooter>
    </Card>
  );
};
