
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'global_admin' | 'multi_province_trustee' | 'regional_trustee' | 'case_administrator' | 'reviewer' | 'client';

interface Province {
  id: string;
  name: string;
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (userData: any) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onUserAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "reviewer" as UserRole,
    sendInvitation: true
  });
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  // Mock list of provinces
  const provinces: Province[] = [
    { id: "1", name: "Ontario" },
    { id: "2", name: "Quebec" },
    { id: "3", name: "British Columbia" },
    { id: "4", name: "Alberta" },
    { id: "5", name: "Manitoba" },
    { id: "6", name: "Saskatchewan" },
    { id: "7", name: "Nova Scotia" },
    { id: "8", name: "New Brunswick" },
    { id: "9", name: "Newfoundland and Labrador" },
    { id: "10", name: "Prince Edward Island" }
  ];

  const toggleProvince = (provinceId: string) => {
    setSelectedProvinces(prev => 
      prev.includes(provinceId)
        ? prev.filter(id => id !== provinceId)
        : [...prev, provinceId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call - would be replaced with an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user data object including selected provinces
      const userData = {
        ...formData,
        provinces: selectedProvinces.map(id => {
          const province = provinces.find(p => p.id === id);
          return province ? province.name : "";
        }),
        id: `user-${Date.now()}`,
        status: formData.sendInvitation ? 'invited' : 'inactive',
        lastActive: 'Never'
      };
      
      onUserAdded(userData);
      
      // Success message
      toast({
        title: "User added successfully",
        description: formData.sendInvitation 
          ? `An invitation has been sent to ${formData.email}` 
          : `${formData.name} has been added with ${formData.role} role`,
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        role: "reviewer",
        sendInvitation: true
      });
      setSelectedProvinces([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to add user",
        description: "There was an error adding the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and assign appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select a role" />
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
            
            {formData.role !== 'global_admin' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Provinces
                </Label>
                <div className="col-span-3 space-y-2">
                  {provinces.map((province) => (
                    <div key={province.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`province-${province.id}`}
                        checked={selectedProvinces.includes(province.id)}
                        onCheckedChange={() => toggleProvince(province.id)}
                      />
                      <Label 
                        htmlFor={`province-${province.id}`}
                        className="text-sm font-normal"
                      >
                        {province.name}
                      </Label>
                    </div>
                  ))}
                  {selectedProvinces.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formData.role === 'client' 
                        ? "Clients don't need province access"
                        : "Please select at least one province"}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox 
                  id="sendInvitation"
                  checked={formData.sendInvitation}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, sendInvitation: checked === true }))
                  }
                />
                <Label htmlFor="sendInvitation" className="font-normal">
                  Send email invitation
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
