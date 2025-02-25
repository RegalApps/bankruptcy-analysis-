
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { DocumentUpload } from "./DocumentUpload";
import { IntelligentScheduling } from "./IntelligentScheduling";
import { FormData } from "./types";

interface FormStepsProps {
  currentStep: number;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormSteps = ({ currentStep, formData, handleInputChange }: FormStepsProps) => {
  return (
    <>
      <TabsContent value="step-1" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="step-2" className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              placeholder="Enter business type"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional information..."
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="step-3" className="space-y-4">
        <DocumentUpload />
      </TabsContent>

      <TabsContent value="step-4" className="space-y-4">
        <IntelligentScheduling />
      </TabsContent>
    </>
  );
};
