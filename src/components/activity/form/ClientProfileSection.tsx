
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "../types";

interface ClientProfileSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaritalStatusChange?: (value: string) => void;
  isNewClientMode?: boolean;
  newClient?: Client;
}

export const ClientProfileSection = ({ 
  formData, 
  onChange, 
  onMaritalStatusChange,
  isNewClientMode,
  newClient
}: ClientProfileSectionProps) => {
  // Generate client profile form with appropriate fields
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name || ""}
              onChange={onChange}
              placeholder="Full Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_home">Phone Number</Label>
            <Input
              id="phone_home"
              name="phone_home"
              value={formData.phone_home || ""}
              onChange={onChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="residential_address">Residential Address</Label>
          <Input
            id="residential_address"
            name="residential_address"
            value={formData.residential_address || ""}
            onChange={onChange}
            placeholder="Street Address"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth || ""}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select 
              onValueChange={onMaritalStatusChange}
              value={formData.marital_status || "single"}
            >
              <SelectTrigger id="marital_status">
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="common_law">Common Law</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dependents">Number of Dependents</Label>
            <Input
              id="dependents"
              name="dependents"
              type="number"
              min="0"
              value={formData.dependents || "0"}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employer_name">Employer Name</Label>
            <Input
              id="employer_name"
              name="employer_name"
              value={formData.employer_name || ""}
              onChange={onChange}
              placeholder="Employer Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation || ""}
              onChange={onChange}
              placeholder="Occupation"
            />
          </div>
        </div>
        
        {(formData.marital_status === "married" || formData.marital_status === "common_law") && (
          <div className="space-y-2">
            <Label htmlFor="spouse_name">Spouse's Name</Label>
            <Input
              id="spouse_name"
              name="spouse_name"
              value={formData.spouse_name || ""}
              onChange={onChange}
              placeholder="Spouse's Name"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
