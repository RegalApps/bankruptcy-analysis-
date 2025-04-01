
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClientInsightData } from "../../../activity/hooks/predictiveData/types";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Globe, User, Tag, FileText } from "lucide-react";

interface ClientProfilePanelProps {
  insights: ClientInsightData;
  clientName: string;
}

export const ClientProfilePanel = ({ insights, clientName }: ClientProfilePanelProps) => {
  // Extract initials from name
  const initials = clientName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={insights.clientProfile?.avatarUrl} alt={clientName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold">{clientName}</h2>
          
          {insights.clientProfile?.company && (
            <p className="text-sm text-muted-foreground">{insights.clientProfile.company}</p>
          )}
          
          {insights.clientProfile?.role && (
            <p className="text-sm text-muted-foreground">{insights.clientProfile.role}</p>
          )}
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-medium mb-2">Contact Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {insights.clientProfile?.email || "No email provided"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {insights.clientProfile?.phone || "No phone provided"}
                </span>
              </div>
              
              {insights.clientProfile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{insights.clientProfile.website}</span>
                </div>
              )}
              
              {insights.clientProfile?.assignedAgent && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Assigned to: {insights.clientProfile.assignedAgent}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Categories & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {insights.clientProfile?.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {!insights.clientProfile?.tags?.length && (
              <p className="text-sm text-muted-foreground">No tags assigned</p>
            )}
          </div>
        </div>

        {/* Lead Description Section */}
        {insights.clientProfile?.leadDescription && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Lead Information</h3>
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm">{insights.clientProfile.leadDescription}</p>
                    {insights.clientProfile?.leadSource && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: {insights.clientProfile.leadSource}
                      </p>
                    )}
                    {insights.clientProfile?.accountStatus && (
                      <p className="text-xs text-muted-foreground">
                        Status: <Badge variant="outline" className="text-xs py-0 px-1">{insights.clientProfile.accountStatus}</Badge>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
