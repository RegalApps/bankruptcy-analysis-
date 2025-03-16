
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentUpload } from "./DocumentUpload";
import { IntelligentScheduling } from "./IntelligentScheduling";
import { FormData } from "./types";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Bot, AlertCircle } from "lucide-react";

interface FormStepsProps {
  currentStep: number;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (field: string, value: string) => void;
  handleEmploymentTypeChange?: (value: string) => void;
}

export const FormSteps = ({ 
  currentStep, 
  formData, 
  handleInputChange,
  handleSelectChange,
  handleEmploymentTypeChange 
}: FormStepsProps) => {
  const [showSpouseDetails, setShowSpouseDetails] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [financialRiskLevel, setFinancialRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Determine if spouse details should be shown based on marital status
  useEffect(() => {
    if (formData.maritalStatus === 'married' || formData.maritalStatus === 'common-law') {
      setShowSpouseDetails(true);
    } else {
      setShowSpouseDetails(false);
    }
  }, [formData.maritalStatus]);
  
  // Determine if business details should be shown based on employment type
  useEffect(() => {
    if (formData.employmentType === 'self-employed') {
      setShowBusinessDetails(true);
    } else {
      setShowBusinessDetails(false);
    }
  }, [formData.employmentType]);
  
  // Simulate AI analysis when certain fields change
  useEffect(() => {
    if (
      formData.monthlyIncome && 
      (formData.unsecuredDebt || formData.securedDebt || formData.taxDebt)
    ) {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        
        // Calculate risk level based on debt-to-income ratio
        const monthlyIncome = parseFloat(formData.monthlyIncome || '0');
        const unsecuredDebt = parseFloat(formData.unsecuredDebt || '0');
        const securedDebt = parseFloat(formData.securedDebt || '0');
        const taxDebt = parseFloat(formData.taxDebt || '0');
        
        const totalDebt = unsecuredDebt + securedDebt + taxDebt;
        const annualIncome = monthlyIncome * 12;
        const debtToIncomeRatio = totalDebt / (annualIncome || 1);
        
        if (debtToIncomeRatio > 1.5) {
          setFinancialRiskLevel('high');
        } else if (debtToIncomeRatio > 0.8) {
          setFinancialRiskLevel('medium');
        } else {
          setFinancialRiskLevel('low');
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.monthlyIncome, formData.unsecuredDebt, formData.securedDebt, formData.taxDebt]);
  
  // Helper to render AI assistant hint
  const renderAIAssistantHint = (text: string) => (
    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 mb-4">
      <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  );
  
  // Helper to render risk analysis badge
  const renderRiskBadge = (level: 'low' | 'medium' | 'high') => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-amber-100 text-amber-800",
      high: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={colors[level]}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </Badge>
    );
  };
  
  // AI Analysis Card for financial assessment
  const renderAIAnalysisCard = () => {
    if (!formData.monthlyIncome || !formData.unsecuredDebt) return null;
    
    const monthlyIncome = parseFloat(formData.monthlyIncome || '0');
    const monthlyExpenses = parseFloat(formData.housingCosts || '0') + 
                          parseFloat(formData.utilitiesInternet || '0') + 
                          parseFloat(formData.transportationCosts || '0') + 
                          parseFloat(formData.foodHousehold || '0');
    
    const disposableIncome = monthlyIncome - monthlyExpenses;
    const totalDebt = parseFloat(formData.unsecuredDebt || '0') + 
                    parseFloat(formData.securedDebt || '0') + 
                    parseFloat(formData.taxDebt || '0');
    
    let recommendation = '';
    if (financialRiskLevel === 'high') {
      recommendation = 'Based on the debt-to-income ratio, bankruptcy may be the most suitable option.';
    } else if (financialRiskLevel === 'medium') {
      recommendation = 'A Consumer Proposal is recommended to restructure and reduce debt obligations.';
    } else {
      recommendation = 'Debt Management Plan is suggested as a viable solution for the current financial situation.';
    }
    
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">AI Financial Assessment</CardTitle>
            {renderRiskBadge(financialRiskLevel)}
          </div>
          <CardDescription>
            Automated analysis based on provided financial information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span>Analyzing financial data...</span>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Monthly Income:</span>
                  <span>${monthlyIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Expenses:</span>
                  <span>${monthlyExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Disposable Income:</span>
                  <span>${disposableIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Debt:</span>
                  <span>${totalDebt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Debt-to-Income Ratio:</span>
                  <span>{(totalDebt / (monthlyIncome * 12)).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Recommendation:</p>
                    <p className="text-muted-foreground">{recommendation}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <>
      <TabsContent value="step-1" className="space-y-4">
        <div className="grid gap-4">
          {renderAIAssistantHint("I'll help you collect the client's personal information. Required fields are marked with an asterisk (*)")}
          
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Legal Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter client's full legal name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sin">Social Insurance Number (SIN) *</Label>
              <Input
                id="sin"
                name="sin"
                value={formData.sin}
                onChange={handleInputChange}
                placeholder="000-000-000"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="maritalStatus">Marital Status *</Label>
            <Select 
              value={formData.maritalStatus} 
              onValueChange={(value) => handleSelectChange && handleSelectChange('maritalStatus', value)}
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
          
          {showSpouseDetails && (
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Spouse Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="spouseName">Spouse's Full Name *</Label>
                <Input
                  id="spouseName"
                  name="spouseName"
                  value={formData.spouseName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter spouse's full name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="spouseSin">Spouse's SIN</Label>
                  <Input
                    id="spouseSin"
                    name="spouseSin"
                    value={formData.spouseSin || ''}
                    onChange={handleInputChange}
                    placeholder="000-000-000"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="spouseIncome">Spouse's Monthly Income</Label>
                  <Input
                    id="spouseIncome"
                    name="spouseIncome"
                    type="number"
                    value={formData.spouseIncome || ''}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Enter street address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="province">Province *</Label>
              <Select 
                value={formData.province || ''} 
                onValueChange={(value) => handleSelectChange && handleSelectChange('province', value)}
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
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode || ''}
                onChange={handleInputChange}
                placeholder="A1A 1A1"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Home Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(000) 000-0000"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mobilePhone">Mobile Phone *</Label>
              <Input
                id="mobilePhone"
                name="mobilePhone"
                type="tel"
                value={formData.mobilePhone || ''}
                onChange={handleInputChange}
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
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="step-2" className="space-y-4">
        <div className="grid gap-4">
          {renderAIAssistantHint("Now let's gather employment and income details. This helps determine the appropriate insolvency options for the client.")}
          
          <div className="grid gap-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <RadioGroup 
              value={formData.employmentType || ''} 
              onValueChange={(value) => handleEmploymentTypeChange && handleEmploymentTypeChange(value)}
              className="grid grid-cols-2 md:grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-time" id="full-time" />
                <Label htmlFor="full-time" className="cursor-pointer">Full-Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="part-time" id="part-time" />
                <Label htmlFor="part-time" className="cursor-pointer">Part-Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self-employed" id="self-employed" />
                <Label htmlFor="self-employed" className="cursor-pointer">Self-Employed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unemployed" id="unemployed" />
                <Label htmlFor="unemployed" className="cursor-pointer">Unemployed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retired" id="retired" />
                <Label htmlFor="retired" className="cursor-pointer">Retired</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.employmentType && formData.employmentType !== 'unemployed' && formData.employmentType !== 'retired' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="employer">Current Employer</Label>
                <Input
                  id="employer"
                  name="employer"
                  value={formData.employer || ''}
                  onChange={handleInputChange}
                  placeholder="Enter employer name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation || ''}
                    onChange={handleInputChange}
                    placeholder="Enter occupation"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleInputChange}
                    placeholder="Enter industry"
                  />
                </div>
              </div>
            </>
          )}
          
          {showBusinessDetails && (
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Business Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName || ''}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessNumber">Business Registration Number</Label>
                  <Input
                    id="businessNumber"
                    name="businessNumber"
                    value={formData.businessNumber || ''}
                    onChange={handleInputChange}
                    placeholder="Enter business number"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={formData.businessType || ''} 
                    onValueChange={(value) => handleSelectChange && handleSelectChange('businessType', value)}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input
                    id="annualRevenue"
                    name="annualRevenue"
                    type="number"
                    value={formData.annualRevenue || ''}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="annualExpenses">Annual Expenses</Label>
                  <Input
                    id="annualExpenses"
                    name="annualExpenses"
                    type="number"
                    value={formData.annualExpenses || ''}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="businessTaxes">Outstanding Business Taxes</Label>
                <Input
                  id="businessTaxes"
                  name="businessTaxes"
                  type="number"
                  value={formData.businessTaxes || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="monthlyIncome">Gross Monthly Income *</Label>
              <Input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="incomeFrequency">Income Frequency</Label>
              <Select 
                value={formData.incomeFrequency || ''} 
                onValueChange={(value) => handleSelectChange && handleSelectChange('incomeFrequency', value)}
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
          
          <div className="space-y-2">
            <Label>Government Benefits Received</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ei" 
                  checked={formData.ei === 'true'} 
                  onCheckedChange={(checked) => handleSelectChange && handleSelectChange('ei', checked ? 'true' : 'false')} 
                />
                <Label htmlFor="ei" className="cursor-pointer">EI Benefits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cpp" 
                  checked={formData.cpp === 'true'} 
                  onCheckedChange={(checked) => handleSelectChange && handleSelectChange('cpp', checked ? 'true' : 'false')} 
                />
                <Label htmlFor="cpp" className="cursor-pointer">CPP Benefits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="oas" 
                  checked={formData.oas === 'true'} 
                  onCheckedChange={(checked) => handleSelectChange && handleSelectChange('oas', checked ? 'true' : 'false')} 
                />
                <Label htmlFor="oas" className="cursor-pointer">OAS Benefits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="disability" 
                  checked={formData.disability === 'true'} 
                  onCheckedChange={(checked) => handleSelectChange && handleSelectChange('disability', checked ? 'true' : 'false')} 
                />
                <Label htmlFor="disability" className="cursor-pointer">Disability</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="childBenefits" 
                  checked={formData.childBenefits === 'true'} 
                  onCheckedChange={(checked) => handleSelectChange && handleSelectChange('childBenefits', checked ? 'true' : 'false')} 
                />
                <Label htmlFor="childBenefits" className="cursor-pointer">Child Benefits</Label>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="step-3" className="space-y-4">
        <div className="grid gap-4">
          {renderAIAssistantHint("Let's gather information about the client's debts, assets, and financial obligations. This is essential for determining the appropriate insolvency solution.")}
          
          <div className="grid gap-2">
            <h3 className="font-medium">Debt Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unsecuredDebt">Total Unsecured Debt *</Label>
                <Input
                  id="unsecuredDebt"
                  name="unsecuredDebt"
                  type="number"
                  value={formData.unsecuredDebt || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-muted-foreground">Credit cards, personal loans, lines of credit, etc.</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="securedDebt">Total Secured Debt</Label>
                <Input
                  id="securedDebt"
                  name="securedDebt"
                  type="number"
                  value={formData.securedDebt || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Mortgages, car loans, etc.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taxDebt">Outstanding Tax Debt</Label>
                <Input
                  id="taxDebt"
                  name="taxDebt"
                  type="number"
                  value={formData.taxDebt || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">CRA/provincial tax debts</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="courtJudgments">Court Judgments & Garnishments</Label>
                <Input
                  id="courtJudgments"
                  name="courtJudgments"
                  type="number"
                  value={formData.courtJudgments || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <h3 className="font-medium">Asset Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="realEstate">Real Estate Value</Label>
                <Input
                  id="realEstate"
                  name="realEstate"
                  type="number"
                  value={formData.realEstate || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bankAccounts">Bank Account Balances</Label>
                <Input
                  id="bankAccounts"
                  name="bankAccounts"
                  type="number"
                  value={formData.bankAccounts || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="investments">Investments</Label>
                <Input
                  id="investments"
                  name="investments"
                  type="number"
                  value={formData.investments || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">RRSP, TFSA, stocks, etc.</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vehicles">Vehicles Value</Label>
                <Input
                  id="vehicles"
                  name="vehicles"
                  type="number"
                  value={formData.vehicles || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="personalAssets">Personal Assets (&gt;$5,000)</Label>
                <Input
                  id="personalAssets"
                  name="personalAssets"
                  type="number"
                  value={formData.personalAssets || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Jewelry, equipment, art, etc.</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <h3 className="font-medium">Monthly Expenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="housingCosts">Housing Costs</Label>
                <Input
                  id="housingCosts"
                  name="housingCosts"
                  type="number"
                  value={formData.housingCosts || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Mortgage/rent, property taxes, condo fees</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="utilitiesInternet">Utilities & Internet</Label>
                <Input
                  id="utilitiesInternet"
                  name="utilitiesInternet"
                  type="number"
                  value={formData.utilitiesInternet || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transportationCosts">Transportation Costs</Label>
                <Input
                  id="transportationCosts"
                  name="transportationCosts"
                  type="number"
                  value={formData.transportationCosts || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Car payments, insurance, gas, transit</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="foodHousehold">Food & Household Expenses</Label>
                <Input
                  id="foodHousehold"
                  name="foodHousehold"
                  type="number"
                  value={formData.foodHousehold || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="childcareEducation">Childcare & Education</Label>
                <Input
                  id="childcareEducation"
                  name="childcareEducation"
                  type="number"
                  value={formData.childcareEducation || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="healthcareExpenses">Healthcare Expenses</Label>
                <Input
                  id="healthcareExpenses"
                  name="healthcareExpenses"
                  type="number"
                  value={formData.healthcareExpenses || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Insurance, prescriptions</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="entertainmentDiscretionary">Entertainment & Discretionary</Label>
                <Input
                  id="entertainmentDiscretionary"
                  name="entertainmentDiscretionary"
                  type="number"
                  value={formData.entertainmentDiscretionary || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="debtRepayments">Monthly Debt Repayments</Label>
              <Input
                id="debtRepayments"
                name="debtRepayments"
                type="number"
                value={formData.debtRepayments || ''}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Loans, credit cards, CRA payments</p>
            </div>
          </div>
          
          {renderAIAnalysisCard()}
        </div>
      </TabsContent>

      <TabsContent value="step-4" className="space-y-4">
        <DocumentUpload />
      </TabsContent>

      <TabsContent value="step-5" className="space-y-4">
        <IntelligentScheduling />
      </TabsContent>
    </>
  );
};
