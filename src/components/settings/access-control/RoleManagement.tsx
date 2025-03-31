import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  Edit2, 
  Trash2, 
  Search, 
  Shield, 
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define user role types
type UserRole = 'global_admin' | 'multi_province_trustee' | 'regional_trustee' | 'case_administrator' | 'reviewer' | 'client';

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provinces: string[];
  lastActive: string;
  status: 'active' | 'invited' | 'inactive';
}

interface RoleManagementProps {
  newUsers?: any[];
}

// Map role to appropriate icon
const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'global_admin':
      return <ShieldAlert className="h-4 w-4 text-destructive" />;
    case 'multi_province_trustee':
      return <ShieldCheck className="h-4 w-4 text-primary" />;
    case 'regional_trustee':
      return <Shield className="h-4 w-4 text-blue-500" />;
    case 'case_administrator':
      return <Users className="h-4 w-4 text-amber-500" />;
    case 'reviewer':
      return <User className="h-4 w-4 text-green-500" />;
    case 'client':
      return <User className="h-4 w-4 text-gray-500" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

// Format role name for display
const formatRoleName = (role: UserRole): string => {
  switch (role) {
    case 'global_admin':
      return 'Global Admin';
    case 'multi_province_trustee':
      return 'Multi-Province Trustee';
    case 'regional_trustee':
      return 'Regional Trustee';
    case 'case_administrator':
      return 'Case Administrator';
    case 'reviewer':
      return 'Reviewer';
    case 'client':
      return 'Client';
    default:
      return role;
  }
};

export const RoleManagement: React.FC<RoleManagementProps> = ({ newUsers = [] }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [users, setUsers] = useState<UserWithRole[]>([]);

  // Mock user data
  const initialUsers: UserWithRole[] = [
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'global_admin',
      provinces: ['All Provinces'],
      lastActive: '2 minutes ago',
      status: 'active',
    },
    {
      id: '2',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'multi_province_trustee',
      provinces: ['Ontario', 'Alberta', 'British Columbia'],
      lastActive: '1 hour ago',
      status: 'active',
    },
    {
      id: '3',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'regional_trustee',
      provinces: ['Quebec'],
      lastActive: '3 hours ago',
      status: 'active',
    },
    {
      id: '4',
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'case_administrator',
      provinces: ['Ontario'],
      lastActive: '2 days ago',
      status: 'active',
    },
    {
      id: '5',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'reviewer',
      provinces: ['All Provinces (Read-Only)'],
      lastActive: '1 week ago',
      status: 'active',
    },
    {
      id: '6',
      name: 'Michael Brown',
      email: 'michael.brown@client.com',
      role: 'client',
      provinces: ['N/A'],
      lastActive: '2 weeks ago',
      status: 'active',
    },
    {
      id: '7',
      name: 'Jennifer Lopez',
      email: 'jennifer.lopez@example.com',
      role: 'case_administrator',
      provinces: ['British Columbia'],
      lastActive: 'Never',
      status: 'invited',
    },
  ];

  // Initialize users with initial data
  useEffect(() => {
    setUsers(initialUsers);
  }, []);

  // Add new users when they are received from props
  useEffect(() => {
    if (newUsers && newUsers.length > 0) {
      const latestNewUser = newUsers[newUsers.length - 1];
      if (latestNewUser && !users.some(user => user.id === latestNewUser.id)) {
        setUsers(prevUsers => [...prevUsers, latestNewUser]);
      }
    }
  }, [newUsers, users]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: UserWithRole) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (currentUser) {
      // Update the user in the users array
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentUser.id ? currentUser : user
        )
      );
      
      // Show success toast
      toast({
        title: "User updated",
        description: `${currentUser.name}'s role has been updated to ${formatRoleName(currentUser.role)}`,
      });
      
      setEditDialogOpen(false);
    }
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // Remove user from the users array
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    // Update selected users if needed
    setSelectedUsers(prev => prev.filter(id => id !== userId));
    
    // Show success toast
    toast({
      title: "User deleted",
      description: `${userName} has been removed from the system`,
    });
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    let updatedUsers = [...users];
    let message = '';
    
    switch (action) {
      case 'activate':
        updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' as const } 
            : user
        );
        message = `${selectedUsers.length} users activated`;
        break;
        
      case 'deactivate':
        updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'inactive' as const } 
            : user
        );
        message = `${selectedUsers.length} users deactivated`;
        break;
        
      case 'delete':
        updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
        message = `${selectedUsers.length} users deleted`;
        break;
    }
    
    setUsers(updatedUsers);
    
    toast({
      title: "Bulk action completed",
      description: message,
    });
    
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedUsers.length})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction('activate')}>Activate Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>Deactivate Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-destructive">Delete Users</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Roles</DropdownMenuItem>
              <DropdownMenuItem>Global Admins</DropdownMenuItem>
              <DropdownMenuItem>Multi-Province Trustees</DropdownMenuItem>
              <DropdownMenuItem>Regional Trustees</DropdownMenuItem>
              <DropdownMenuItem>Case Administrators</DropdownMenuItem>
              <DropdownMenuItem>Reviewers</DropdownMenuItem>
              <DropdownMenuItem>Clients</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={(checked) => handleSelectAllUsers(checked === true)}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Province Access</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-2">{formatRoleName(user.role)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.provinces.map(province => (
                        <Badge key={province} variant="outline" className="text-xs">
                          {province}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'success' : user.status === 'invited' ? 'warning' : 'outline'}
                    >
                      {user.status === 'active' ? 'Active' : user.status === 'invited' ? 'Invited' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update role and permissions for {currentUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={(value: UserRole) => 
                    setCurrentUser({...currentUser, role: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global_admin">Global Admin</SelectItem>
                    <SelectItem value="multi_province_trustee">Multi-Province Trustee</SelectItem>
                    <SelectItem value="regional_trustee">Regional Trustee</SelectItem>
                    <SelectItem value="case_administrator">Case Administrator</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Document Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="view" defaultChecked />
                    <Label htmlFor="view">View</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edit" defaultChecked={currentUser.role !== 'reviewer' && currentUser.role !== 'client'} />
                    <Label htmlFor="edit">Edit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="delete" defaultChecked={['global_admin', 'multi_province_trustee'].includes(currentUser.role)} />
                    <Label htmlFor="delete">Delete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="approve" defaultChecked={['global_admin', 'multi_province_trustee', 'regional_trustee'].includes(currentUser.role)} />
                    <Label htmlFor="approve">Approve</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value: 'active' | 'invited' | 'inactive') => 
                    setCurrentUser({...currentUser, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
