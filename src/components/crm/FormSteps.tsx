
import { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormStepsProps {
  currentStep: number;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleEmploymentTypeChange: (value: string) => void;
}

export const FormSteps = ({
  currentStep,
  formData,
  handleInputChange,
  handleSelectChange,
  handleEmploymentTypeChange
}: FormStepsProps) => {
  // Render appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leadSource">How did you hear about us?</Label>
              <Select 
                value={formData.leadSource} 
                onValueChange={(value) => handleSelectChange('leadSource', value)}
              >
                <SelectTrigger id="leadSource">
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website_search">Website search (Google, Bing, etc.)</SelectItem>
                  <SelectItem value="social_media">Social media (LinkedIn, Facebook, etc.)</SelectItem>
                  <SelectItem value="online_ad">Online advertisement</SelectItem>
                  <SelectItem value="referral">A friend or client referred me</SelectItem>
                  <SelectItem value="team_member">I met someone from your team</SelectItem>
                  <SelectItem value="event">Business event or webinar</SelectItem>
                  <SelectItem value="email">Email outreach from your team</SelectItem>
                  <SelectItem value="other">Other (please specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.leadSource === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="otherLeadSourceDetails">Please specify</Label>
                <Textarea
                  id="otherLeadSourceDetails"
                  name="otherLeadSourceDetails"
                  value={formData.otherLeadSourceDetails}
                  onChange={handleInputChange}
                  placeholder="Please tell us how you heard about us"
                />
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Employment Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select 
                value={formData.employmentType} 
                onValueChange={handleEmploymentTypeChange}
              >
                <SelectTrigger id="employmentType">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="self_employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(formData.employmentType === 'full_time' || formData.employmentType === 'part_time') && (
              <>
                <div>
                  <Label htmlFor="employer">Employer</Label>
                  <Input
                    id="employer"
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    placeholder="Enter employer name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="occupation">Occupation/Position</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Enter occupation or position"
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    placeholder="Enter monthly income"
                  />
                </div>
              </>
            )}
            
            {formData.employmentType === 'self_employed' && (
              <>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    placeholder="Enter business type"
                  />
                </div>
                
                <div>
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input
                    id="annualRevenue"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    placeholder="Enter annual revenue"
                  />
                </div>
              </>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Financial Information</h3>
            
            <div>
              <Label htmlFor="unsecuredDebt">Unsecured Debt Amount</Label>
              <Input
                id="unsecuredDebt"
                name="unsecuredDebt"
                value={formData.unsecuredDebt}
                onChange={handleInputChange}
                placeholder="Enter unsecured debt amount"
              />
              <p className="text-xs text-muted-foreground mt-1">Credit cards, personal loans, etc.</p>
            </div>
            
            <div>
              <Label htmlFor="securedDebt">Secured Debt Amount</Label>
              <Input
                id="securedDebt"
                name="securedDebt"
                value={formData.securedDebt}
                onChange={handleInputChange}
                placeholder="Enter secured debt amount"
              />
              <p className="text-xs text-muted-foreground mt-1">Mortgage, auto loans, etc.</p>
            </div>
            
            <div>
              <Label htmlFor="taxDebt">Tax Debt Amount</Label>
              <Input
                id="taxDebt"
                name="taxDebt"
                value={formData.taxDebt}
                onChange={handleInputChange}
                placeholder="Enter tax debt amount"
              />
              <p className="text-xs text-muted-foreground mt-1">CRA/provincial tax debts</p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Document Upload</h3>
            <p className="text-sm text-muted-foreground">
              Please upload the following documents to help us better understand your financial situation:
            </p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Required Documents:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Government-issued ID</li>
                <li>Recent pay stubs or income statements</li>
                <li>Recent bank statements (last 3 months)</li>
                <li>Tax returns and notices of assessment</li>
              </ul>
            </div>
            
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Drop files here or click to browse
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 text-sm text-primary border border-primary rounded-md"
              >
                Browse Files
              </button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Schedule Consultation</h3>
            <p className="text-sm text-muted-foreground">
              Select a convenient time for your initial consultation with one of our financial advisors.
            </p>
            
            <div className="border rounded-md p-4">
              <div className="space-y-4">
                <p className="text-sm font-medium">Available time slots:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {["Monday, 10:00 AM", "Tuesday, 2:00 PM", "Wednesday, 11:00 AM", "Thursday, 3:00 PM", "Friday, 1:00 PM"].map((slot, index) => (
                    <div key={index} className="flex items-center border rounded-md p-2">
                      <input
                        type="radio"
                        id={`slot-${index}`}
                        name="consultation-slot"
                        className="mr-2"
                      />
                      <label htmlFor={`slot-${index}`} className="text-sm">{slot}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional information that might be helpful for your consultation"
                rows={4}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return renderStep();
};
