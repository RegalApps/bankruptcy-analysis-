
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash, 
  UserPlus, 
  LogIn, 
  LogOut,
  File,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface AuditEvent {
  id: string;
  eventType: 'view' | 'edit' | 'delete' | 'download' | 'login' | 'logout' | 'create' | 'upload' | 'access_change';
  userId: string;
  userName: string;
  userRole: string;
  resourceType: 'document' | 'user' | 'client' | 'system';
  resourceId?: string;
  resourceName?: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  details?: string;
  severity: 'info' | 'warning' | 'critical';
  province?: string;
}

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<{from: Date, to: Date} | undefined>(undefined);

  // Mock audit log data
  const auditLogs: AuditEvent[] = [
    {
      id: 'al1',
      eventType: 'view',
      userId: '2',
      userName: 'Robert Johnson',
      userRole: 'Multi-Province Trustee',
      resourceType: 'document',
      resourceId: 'doc123',
      resourceName: 'Form 47 - Jane Smith',
      timestamp: '2023-08-10T14:25:00Z',
      ipAddress: '192.168.1.101',
      success: true,
      details: 'Viewed client document',
      severity: 'info',
      province: 'Ontario'
    },
    {
      id: 'al2',
      eventType: 'edit',
      userId: '1',
      userName: 'Jane Smith',
      userRole: 'Global Admin',
      resourceType: 'document',
      resourceId: 'doc123',
      resourceName: 'Form 47 - Jane Smith',
      timestamp: '2023-08-10T13:10:00Z',
      ipAddress: '192.168.1.100',
      success: true,
      details: 'Updated client information',
      severity: 'info',
      province: 'Ontario'
    },
    {
      id: 'al3',
      eventType: 'login',
      userId: '3',
      userName: 'Maria Garcia',
      userRole: 'Regional Trustee',
      resourceType: 'system',
      timestamp: '2023-08-10T09:05:00Z',
      ipAddress: '192.168.1.102',
      success: true,
      details: 'Successful login',
      severity: 'info',
      province: 'Quebec'
    },
    {
      id: 'al4',
      eventType: 'download',
      userId: '4',
      userName: 'David Lee',
      userRole: 'Case Administrator',
      resourceType: 'document',
      resourceId: 'doc456',
      resourceName: 'Financial Statement - Michael Brown',
      timestamp: '2023-08-09T16:30:00Z',
      ipAddress: '192.168.1.103',
      success: true,
      details: 'Downloaded client financial statement',
      severity: 'info',
      province: 'Ontario'
    },
    {
      id: 'al5',
      eventType: 'login',
      userId: 'unknown',
      userName: 'Unknown User',
      userRole: 'N/A',
      resourceType: 'system',
      timestamp: '2023-08-09T15:45:00Z',
      ipAddress: '203.0.113.42',
      success: false,
      details: 'Failed login attempt - incorrect password (3rd attempt)',
      severity: 'warning',
      province: 'N/A'
    },
    {
      id: 'al6',
      eventType: 'access_change',
      userId: '1',
      userName: 'Jane Smith',
      userRole: 'Global Admin',
      resourceType: 'user',
      resourceId: '4',
      resourceName: 'David Lee',
      timestamp: '2023-08-09T14:20:00Z',
      ipAddress: '192.168.1.100',
      success: true,
      details: 'Changed user role from Case Administrator to Regional Trustee',
      severity: 'info',
      province: 'Ontario'
    },
    {
      id: 'al7',
      eventType: 'view',
      userId: '5',
      userName: 'Sarah Williams',
      userRole: 'Reviewer',
      resourceType: 'document',
      resourceId: 'doc789',
      resourceName: 'Form 47 - Michael Brown',
      timestamp: '2023-08-09T11:15:00Z',
      ipAddress: '192.168.1.104',
      success: true,
      details: 'Viewed client document',
      severity: 'info'
    },
    {
      id: 'al8',
      eventType: 'delete',
      userId: '2',
      userName: 'Robert Johnson',
      userRole: 'Multi-Province Trustee',
      resourceType: 'document',
      resourceId: 'doc321',
      resourceName: 'Draft Agreement - Sarah Williams',
      timestamp: '2023-08-09T10:05:00Z',
      ipAddress: '192.168.1.101',
      success: true,
      details: 'Deleted draft document',
      severity: 'info',
      province: 'British Columbia'
    },
    {
      id: 'al9',
      eventType: 'upload',
      userId: '3',
      userName: 'Maria Garcia',
      userRole: 'Regional Trustee',
      resourceType: 'document',
      resourceId: 'doc654',
      resourceName: 'Tax Assessment - Maria Garcia',
      timestamp: '2023-08-08T16:40:00Z',
      ipAddress: '192.168.1.102',
      success: true,
      details: 'Uploaded new document',
      severity: 'info',
      province: 'Quebec'
    },
    {
      id: 'al10',
      eventType: 'view',
      userId: '7',
      userName: 'Unknown IP',
      userRole: 'Case Administrator',
      resourceType: 'document',
      resourceId: 'doc123',
      resourceName: 'Form 47 - Jane Smith',
      timestamp: '2023-08-08T14:55:00Z',
      ipAddress: '203.0.113.100',
      success: false,
      details: 'Attempted to view document from unrecognized location',
      severity: 'critical',
      province: 'Ontario'
    }
  ];

  // Get icon for event type
  const getEventIcon = (eventType: AuditEvent['eventType']) => {
    switch (eventType) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'logout':
        return <LogOut className="h-4 w-4" />;
      case 'create':
        return <UserPlus className="h-4 w-4" />;
      case 'upload':
        return <File className="h-4 w-4" />;
      case 'access_change':
        return <Save className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Format event type for display
  const formatEventType = (eventType: AuditEvent['eventType']) => {
    switch (eventType) {
      case 'view':
        return 'View';
      case 'edit':
        return 'Edit';
      case 'delete':
        return 'Delete';
      case 'download':
        return 'Download';
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      case 'create':
        return 'Create';
      case 'upload':
        return 'Upload';
      case 'access_change':
        return 'Access Change';
      default:
        return eventType;
    }
  };

  // Format date string
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

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    // Filter by search term
    const searchMatches = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.resourceName && log.resourceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    // Filter by event type
    const eventTypeMatches = eventType === 'all' || log.eventType === eventType;
    
    // Filter by date range
    let dateMatches = true;
    if (timeRange) {
      const logDate = new Date(log.timestamp);
      const from = new Date(timeRange.from);
      const to = new Date(timeRange.to);
      to.setHours(23, 59, 59, 999); // Set to end of day
      
      dateMatches = logDate >= from && logDate <= to;
    }
    
    return searchMatches && eventTypeMatches && dateMatches;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="view">View</SelectItem>
              <SelectItem value="edit">Edit</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="access_change">Access Change</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker 
            onChange={setTimeRange} 
            value={timeRange}
          />
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className={log.severity === 'critical' ? 'bg-destructive/10' : log.severity === 'warning' ? 'bg-amber-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full 
                        ${log.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                          log.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                          'bg-muted text-muted-foreground'}`}
                      >
                        {getEventIcon(log.eventType)}
                      </span>
                      <div>
                        <div className="font-medium">{formatEventType(log.eventType)}</div>
                        <div className="text-xs text-muted-foreground">{log.details}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-xs text-muted-foreground">{log.userRole}</div>
                  </TableCell>
                  <TableCell>
                    {log.resourceName ? (
                      <>
                        <div className="font-medium">{log.resourceName}</div>
                        <div className="text-xs text-muted-foreground">{log.resourceType}</div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{log.resourceType}</span>
                    )}
                    {log.province && log.province !== 'N/A' && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {log.province}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.ipAddress}</code>
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge variant="success">Success</Badge>
                    ) : (
                      <div className="flex items-center">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Failed
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
