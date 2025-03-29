
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, User, Check, X } from "lucide-react";

interface AccessRequestsProps {
  pendingRequests: number;
  onApproveRequest: () => void;
  onDenyRequest: () => void;
}

interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  requestType: 'province_access' | 'role_change' | 'document_permission';
  requestedItems: string[];
  justification: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'denied';
  expiryDate?: string;
}

export const AccessRequests = ({ 
  pendingRequests, 
  onApproveRequest, 
  onDenyRequest 
}: AccessRequestsProps) => {
  // Mock access request data
  const accessRequests: AccessRequest[] = [
    {
      id: 'req1',
      requesterId: '2',
      requesterName: 'Robert Johnson',
      requesterEmail: 'robert.johnson@example.com',
      requesterRole: 'Multi-Province Trustee',
      requestType: 'province_access',
      requestedItems: ['Nova Scotia'],
      justification: 'Expanding services to Nova Scotia region to support new client base.',
      requestDate: '2023-08-10T09:30:00Z',
      status: 'pending',
      expiryDate: '2023-12-31T23:59:59Z'
    },
    {
      id: 'req2',
      requesterId: '4',
      requesterName: 'David Lee',
      requesterEmail: 'david.lee@example.com',
      requesterRole: 'Case Administrator',
      requestType: 'role_change',
      requestedItems: ['Regional Trustee'],
      justification: 'Completed training and certification for regional trustee position.',
      requestDate: '2023-08-05T14:15:00Z',
      status: 'pending'
    },
    {
      id: 'req3',
      requesterId: '3',
      requesterName: 'Maria Garcia',
      requesterEmail: 'maria.garcia@example.com',
      requesterRole: 'Regional Trustee',
      requestType: 'province_access',
      requestedItems: ['Ontario'],
      justification: 'Need temporary access to handle overflow cases from Ontario region.',
      requestDate: '2023-08-01T11:00:00Z',
      status: 'pending',
      expiryDate: '2023-09-30T23:59:59Z'
    },
    {
      id: 'req4',
      requesterId: '5',
      requesterName: 'Sarah Williams',
      requesterEmail: 'sarah.williams@example.com',
      requesterRole: 'Reviewer',
      requestType: 'document_permission',
      requestedItems: ['Edit Permission for Form 47'],
      justification: 'Need to make corrections to compliance documentation for audit purposes.',
      requestDate: '2023-07-28T16:45:00Z',
      status: 'approved'
    },
    {
      id: 'req5',
      requesterId: '7',
      requesterName: 'Jennifer Lopez',
      requesterEmail: 'jennifer.lopez@example.com',
      requesterRole: 'Case Administrator',
      requestType: 'province_access',
      requestedItems: ['Alberta'],
      justification: 'Client relocated to Alberta, need access to continue case management.',
      requestDate: '2023-07-25T10:20:00Z',
      status: 'denied'
    }
  ];

  const getRequestTypeLabel = (type: AccessRequest['requestType']) => {
    switch (type) {
      case 'province_access':
        return 'Province Access';
      case 'role_change':
        return 'Role Change';
      case 'document_permission':
        return 'Document Permission';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      {accessRequests.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No access requests found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {accessRequests.map((request) => (
            <Card key={request.id} className={request.status === 'pending' ? 'border-amber-200' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{getRequestTypeLabel(request.requestType)}</CardTitle>
                    <CardDescription>Requested by {request.requesterName}</CardDescription>
                  </div>
                  <Badge 
                    variant={
                      request.status === 'pending' 
                        ? 'warning' 
                        : request.status === 'approved' 
                        ? 'success' 
                        : 'destructive'
                    }
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Requester:</span>
                    <span>{request.requesterName} ({request.requesterRole})</span>
                  </div>
                  
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground mr-1">Requested:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {request.requestedItems.map(item => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Requested on:</span>
                    <span>{formatDate(request.requestDate)}</span>
                  </div>
                  
                  {request.expiryDate && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground mr-1">Expires on:</span>
                      <span>{formatDate(request.expiryDate)}</span>
                    </div>
                  )}
                  
                  <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                    <p className="font-medium mb-1">Justification:</p>
                    <p>{request.justification}</p>
                  </div>
                </div>
              </CardContent>
              
              {request.status === 'pending' && (
                <CardFooter className="pt-2">
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive border-destructive/50 hover:bg-destructive/10" 
                      onClick={onDenyRequest}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={onApproveRequest}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
