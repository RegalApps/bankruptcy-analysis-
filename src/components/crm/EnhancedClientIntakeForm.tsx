
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EnhancedClientIntakeFormProps {
  section: 'personal' | 'financial' | 'business';
  clientData: any;
  setClientData: (data: any) => void;
  ocrProcessing?: boolean;
  ocrResults?: any;
  isProcessing?: boolean;
  progressStatus?: string;
  onAnalyze?: () => void;
}

export const EnhancedClientIntakeForm = ({
  section,
  clientData,
  setClientData,
  ocrProcessing = false,
  ocrResults,
  isProcessing = false,
  progressStatus = '',
  onAnalyze
}: EnhancedClientIntakeFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parentField, childField] = name.split('.');
      setClientData({
        ...clientData,
        [parentField]: {
          ...clientData[parentField],
          [childField]: value
        }
      });
    } else {
      setClientData({
        ...clientData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setClientData({
        ...clientData,
        [parentField]: {
          ...clientData[parentField],
          [childField]: value
        }
      });
    } else {
      setClientData({
        ...clientData,
        [field]: value
      });
    }
  };
  
  // Helper to render AI assistant hint
  const renderAIAssistantHint = (text: string) => (
    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 mb-4">
      <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  );
  
  // Render Personal Information Section
  const renderPersonalSection = () => (
    <div className="space-y-6">
      {renderAIAssistantHint("I'll help you collect the client's personal information. Upload ID documents to use OCR for automatic form filling.")}
      
      {ocrProcessing && (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <p className="font-medium">AI Document Processing</p>
                <p className="text-sm text-muted-foreground">Scanning uploaded documents and extracting information...</p>
              </div>
            </div>
            <Progress value={45} className="h-1 mt-3" />
          </CardContent>
        </Card>
      )}
      
      {ocrResults && (
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 rounded-sm">AI Extracted</Badge>
              <span className="text-sm">Information has been pre-filled from uploaded documents</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Legal Name *</Label>
            <Input
              id="name"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              placeholder="Enter client's full legal name"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={clientData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sin">Social Insurance Number (SIN) *</Label>
            <Input
              id="sin"
              name="sin"
              value={clientData.sin}
              onChange={handleChange}
              placeholder="000-000-000"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="maritalStatus">Marital Status *</Label>
            <Select 
              value={clientData.maritalStatus} 
              onValueChange={(value) => handleSelectChange('maritalStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="common-law">Common Law</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {(clientData.maritalStatus === 'married' || clientData.maritalStatus === 'common-law') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Spouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="spouse.name">Spouse's Full Name *</Label>
                  <Input
                    id="spouse.name"
                    name="spouse.name"
                    value={clientData.spouse?.name || ''}
                    onChange={handleChange}
                    placeholder="Enter spouse's full name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="spouse.sin">Spouse's SIN</Label>
                  <Input
                    id="spouse.sin"
                    name="spouse.sin"
                    value={clientData.spouse?.sin || ''}
                    onChange={handleChange}
                    placeholder="000-000-000"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="spouse.income">Spouse's Monthly Income</Label>
                <Input
                  id="spouse.income"
                  name="spouse.income"
                  type="number"
                  value={clientData.spouse?.income || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="address.street">Street Address *</Label>
            <Input
              id="address.street"
              name="address.street"
              value={clientData.address?.street || ''}
              onChange={handleChange}
              placeholder="Enter street address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address.city">City *</Label>
              <Input
                id="address.city"
                name="address.city"
                value={clientData.address?.city || ''}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address.province">Province *</Label>
              <Select 
                value={clientData.address?.province || ''} 
                onValueChange={(value) => handleSelectChange('address.province', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                  <SelectItem value="NT">Northwest Territories</SelectItem>
                  <SelectItem value="NU">Nunavut</SelectItem>
                  <SelectItem value="YT">Yukon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address.postalCode">Postal Code *</Label>
              <Input
                id="address.postalCode"
                name="address.postalCode"
                value={clientData.address?.postalCode || ''}
                onChange={handleChange}
                placeholder="A1A 1A1"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone.home">Home Phone</Label>
              <Input
                id="phone.home"
                name="phone.home"
                type="tel"
                value={clientData.phone?.home || ''}
                onChange={handleChange}
                placeholder="(000) 000-0000"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone.mobile">Mobile Phone *</Label>
              <Input
                id="phone.mobile"
                name="phone.mobile"
                type="tel"
                value={clientData.phone?.mobile || ''}
                onChange={handleChange}
                placeholder="(000) 000-0000"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={clientData.email || ''}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render Financial Section
  const renderFinancialSection = () => (
    <div className="space-y-6">
      {renderAIAssistantHint("Now let's gather employment, income, and financial details. This information is crucial for determining the appropriate insolvency solution.")}
      
      <div className="space-y-4">
        <h3 className="font-medium">Employment & Income Details</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="employment.status">Employment Status *</Label>
          <Select 
            value={clientData.employment?.status || ''} 
            onValueChange={(value) => handleSelectChange('employment.status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(clientData.employment?.status === 'full-time' || 
          clientData.employment?.status === 'part-time' || 
          clientData.employment?.status === 'self-employed') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="employment.employer">Employer Name</Label>
              <Input
                id="employment.employer"
                name="employment.employer"
                value={clientData.employment?.employer || ''}
                onChange={handleChange}
                placeholder="Enter employer name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="employment.occupation">Occupation</Label>
              <Input
                id="employment.occupation"
                name="employment.occupation"
                value={clientData.employment?.occupation || ''}
                onChange={handleChange}
                placeholder="Enter occupation"
              />
            </div>
          </div>
        )}
        
        {clientData.employment?.status === 'self-employed' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="business.name">Business Name *</Label>
                  <Input
                    id="business.name"
                    name="business.name"
                    value={clientData.business?.name || ''}
                    onChange={handleChange}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business.registrationNumber">Registration Number</Label>
                  <Input
                    id="business.registrationNumber"
                    name="business.registrationNumber"
                    value={clientData.business?.registrationNumber || ''}
                    onChange={handleChange}
                    placeholder="Enter business number"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business.type">Business Type</Label>
                <Select 
                  value={clientData.business?.type || ''} 
                  onValueChange={(value) => handleSelectChange('business.type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="business.annualRevenue">Annual Revenue</Label>
                  <Input
                    id="business.annualRevenue"
                    name="business.annualRevenue"
                    type="number"
                    value={clientData.business?.annualRevenue || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business.annualExpenses">Annual Expenses</Label>
                  <Input
                    id="business.annualExpenses"
                    name="business.annualExpenses"
                    type="number"
                    value={clientData.business?.annualExpenses || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business.outstandingTaxes">Outstanding Tax Debt</Label>
                <Input
                  id="business.outstandingTaxes"
                  name="business.outstandingTaxes"
                  type="number"
                  value={clientData.business?.outstandingTaxes || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="income.monthly">Monthly Income *</Label>
            <Input
              id="income.monthly"
              name="income.monthly"
              type="number"
              value={clientData.income?.monthly || ''}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="income.frequency">Income Frequency</Label>
            <Select 
              value={clientData.income?.frequency || ''} 
              onValueChange={(value) => handleSelectChange('income.frequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium">Debt Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="debt.unsecured">Unsecured Debt *</Label>
            <Input
              id="debt.unsecured"
              name="debt.unsecured"
              type="number"
              value={clientData.debt?.unsecured || ''}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground">Credit cards, personal loans, lines of credit</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="debt.secured">Secured Debt</Label>
            <Input
              id="debt.secured"
              name="debt.secured"
              type="number"
              value={clientData.debt?.secured || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">Mortgages, car loans</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="debt.taxDebt">Tax Debt</Label>
            <Input
              id="debt.taxDebt"
              name="debt.taxDebt"
              type="number"
              value={clientData.debt?.taxDebt || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">CRA/provincial tax debts</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="debt.courtJudgments">Court Judgments</Label>
            <Input
              id="debt.courtJudgments"
              name="debt.courtJudgments"
              type="number"
              value={clientData.debt?.courtJudgments || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium">Assets</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="assets.realEstate">Real Estate Value</Label>
            <Input
              id="assets.realEstate"
              name="assets.realEstate"
              type="number"
              value={clientData.assets?.realEstate || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="assets.bankAccounts">Bank Accounts</Label>
            <Input
              id="assets.bankAccounts"
              name="assets.bankAccounts"
              type="number"
              value={clientData.assets?.bankAccounts || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="assets.vehicles">Vehicles</Label>
            <Input
              id="assets.vehicles"
              name="assets.vehicles"
              type="number"
              value={clientData.assets?.vehicles || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-medium">Monthly Expenses</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expenses.housing">Housing Costs</Label>
            <Input
              id="expenses.housing"
              name="expenses.housing"
              type="number"
              value={clientData.expenses?.housing || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="expenses.utilities">Utilities & Internet</Label>
            <Input
              id="expenses.utilities"
              name="expenses.utilities"
              type="number"
              value={clientData.expenses?.utilities || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expenses.transportation">Transportation</Label>
            <Input
              id="expenses.transportation"
              name="expenses.transportation"
              type="number"
              value={clientData.expenses?.transportation || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="expenses.food">Food & Household</Label>
            <Input
              id="expenses.food"
              name="expenses.food"
              type="number"
              value={clientData.expenses?.food || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={onAnalyze} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {progressStatus}
            </div>
          ) : (
            "Analyze Financial Situation"
          )}
        </Button>
      </div>
    </div>
  );
  
  // Render selected section
  return (
    <>
      {section === 'personal' && renderPersonalSection()}
      {section === 'financial' && renderFinancialSection()}
    </>
  );
};
