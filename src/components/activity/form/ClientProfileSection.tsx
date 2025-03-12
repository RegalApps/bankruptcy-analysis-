
import { IncomeExpenseData } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientProfileSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onMaritalStatusChange: (value: string) => void;
}

export const ClientProfileSection = ({ 
  formData, 
  onChange, 
  onMaritalStatusChange 
}: ClientProfileSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Profile</CardTitle>
        <CardDescription>
          Personal information and household details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="residential_address">Residential Address</Label>
            <Input
              id="residential_address"
              name="residential_address"
              value={formData.residential_address}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_home">Phone Number (Home)</Label>
            <Input
              id="phone_home"
              name="phone_home"
              value={formData.phone_home}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select 
              value={formData.marital_status} 
              onValueChange={onMaritalStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
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
            <Label htmlFor="employer_name">Employer Name</Label>
            <Input
              id="employer_name"
              name="employer_name"
              value={formData.employer_name}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_phone">Work Contact Number</Label>
            <Input
              id="work_phone"
              name="work_phone"
              value={formData.work_phone}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="spouse_name">Spouse/Partner's Name</Label>
            <Input
              id="spouse_name"
              name="spouse_name"
              value={formData.spouse_name}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="household_size">Household Size</Label>
            <Input
              id="household_size"
              name="household_size"
              type="number"
              min="1"
              value={formData.household_size}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submission_date">Submission Date</Label>
            <Input
              id="submission_date"
              name="submission_date"
              type="date"
              value={formData.submission_date}
              onChange={onChange}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
