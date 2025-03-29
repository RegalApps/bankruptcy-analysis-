
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
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Edit } from "lucide-react";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  provinces: string[];
}

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
];

export const ProvinceMappings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Global Admin',
      provinces: ['All Provinces'],
    },
    {
      id: '2',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'Multi-Province Trustee',
      provinces: ['Ontario', 'Alberta', 'British Columbia'],
    },
    {
      id: '3',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'Regional Trustee',
      provinces: ['Quebec'],
    },
    {
      id: '4',
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'Case Administrator',
      provinces: ['Ontario'],
    },
    {
      id: '5',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Reviewer',
      provinces: ['All Provinces (Read-Only)'],
    }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProvinces = (user: User) => {
    setCurrentUser(user);
    setSelectedProvinces(user.provinces.includes('All Provinces') ? [] : user.provinces);
    setEditDialogOpen(true);
  };

  const handleSaveProvinces = () => {
    if (currentUser) {
      // In a real app, save to database
      toast({
        title: "Provinces updated",
        description: `${currentUser.name}'s province access has been updated`,
      });
      setEditDialogOpen(false);
    }
  };

  const handleToggleProvince = (province: string, checked: boolean) => {
    if (checked) {
      setSelectedProvinces(prev => [...prev, province]);
    } else {
      setSelectedProvinces(prev => prev.filter(p => p !== province));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProvinces(provinces);
    } else {
      setSelectedProvinces([]);
    }
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
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Province Access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.provinces.map(province => (
                        <Badge key={province} variant="outline" className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {province}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProvinces(user)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Provinces</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Province Access</DialogTitle>
            <DialogDescription>
              Manage province access for {currentUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <Label>Provinces</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selectAll" 
                    checked={selectedProvinces.length === provinces.length} 
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll" className="text-sm">Select All</Label>
                </div>
              </div>
              
              <div className="h-[300px] overflow-auto border rounded-md p-4">
                <div className="grid grid-cols-1 gap-2">
                  {provinces.map(province => (
                    <div key={province} className="flex items-center space-x-2">
                      <Checkbox 
                        id={province} 
                        checked={selectedProvinces.includes(province)}
                        onCheckedChange={(checked) => handleToggleProvince(province, checked === true)}
                      />
                      <Label htmlFor={province} className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {province}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="allProvinces" />
                <Label htmlFor="allProvinces">Grant access to all provinces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="readOnly" />
                <Label htmlFor="readOnly">Read-only access</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProvinces}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
