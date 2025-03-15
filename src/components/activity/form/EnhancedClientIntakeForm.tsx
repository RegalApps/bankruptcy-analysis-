
import { useState } from "react";
import { Loader2, Brain, Info, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EnhancedClientIntakeFormProps {
  clientData: any;
  setClientData: (data: any) => void;
  ocrProcessing?: boolean;
  ocrResults?: any;
  section: "personal" | "financial";
  onAnalyze?: () => void;
  isProcessing?: boolean;
  progressStatus?: string;
}

export const EnhancedClientIntakeForm = ({
  clientData,
  setClientData,
  ocrProcessing,
  ocrResults,
  section,
  onAnalyze,
  isProcessing,
  progressStatus,
}: EnhancedClientIntakeFormProps) => {
  const [activeTab, setActiveTab] = useState(section === "personal" ? "personal" : "employment");

  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setClientData({
        ...clientData,
        [parent]: {
          ...clientData[parent],
          [child]: value
        }
      });
    } else {
      setClientData({
        ...clientData,
        [name]: value
      });
    }
  };
  
  // Handle nested field changes
  const handleNestedChange = (parent: string, child: string, value: any) => {
    setClientData({
      ...clientData,
      [parent]: {
        ...clientData[parent],
        [child]: value
      }
    });
  };
  
  // Handle select field changes
  const handleSelectChange = (field: string, value: string) => {
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setClientData({
        ...clientData,
        [parent]: {
          ...clientData[parent],
          [child]: value
        }
      });
    } else {
      setClientData({
        ...clientData,
        [field]: value
      });
    }
  };
  
  // Handle toggle switches
  const handleToggleChange = (field: string, checked: boolean) => {
    setClientData({
      ...clientData,
      [field]: checked
    });
  };

  const renderPersonalInfoSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Personal Information</span>
          {ocrProcessing && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Processing Documents...
            </Badge>
          )}
          {ocrResults && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              AI Processed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Enter the client's basic personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Full Legal Name</FormLabel>
            <Input
              name="name"
              value={clientData.name}
              onChange={handleChange}
              placeholder="Full Legal Name"
              className={ocrResults?.personalInfo?.name ? "border-green-500" : ""}
            />
            {ocrResults?.personalInfo?.name && (
              <div className="text-xs text-green-600 mt-1">
                AI detected name: {ocrResults.personalInfo.name}
              </div>
            )}
          </div>
          
          <div>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              name="dateOfBirth"
              value={clientData.dateOfBirth}
              onChange={handleChange}
              type="date"
              placeholder="Date of Birth"
            />
          </div>
          
          <div>
            <FormLabel>Social Insurance Number (SIN)</FormLabel>
            <Input
              name="sin"
              value={clientData.sin}
              onChange={handleChange}
              placeholder="000-000-000"
              className={ocrResults?.personalInfo?.sin ? "border-green-500" : ""}
            />
            {ocrResults?.personalInfo?.sin && (
              <div className="text-xs text-green-600 mt-1">
                AI detected SIN: {ocrResults.personalInfo.sin}
              </div>
            )}
          </div>
          
          <div>
            <FormLabel>Marital Status</FormLabel>
            <Select
              value={clientData.maritalStatus}
              onValueChange={(value) => handleSelectChange("maritalStatus", value)}
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
        </div>
        
        <div>
          <FormLabel>Contact Information</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormDescription className="text-xs">Home Phone</FormDescription>
              <Input
                name="phone.home"
                value={clientData.phone.home}
                onChange={(e) => handleNestedChange("phone", "home", e.target.value)}
                placeholder="Home Phone"
              />
            </div>
            <div>
              <FormDescription className="text-xs">Mobile Phone</FormDescription>
              <Input
                name="phone.mobile"
                value={clientData.phone.mobile}
                onChange={(e) => handleNestedChange("phone", "mobile", e.target.value)}
                placeholder="Mobile Phone"
              />
            </div>
            <div>
              <FormDescription className="text-xs">Work Phone</FormDescription>
              <Input
                name="phone.work"
                value={clientData.phone.work}
                onChange={(e) => handleNestedChange("phone", "work", e.target.value)}
                placeholder="Work Phone"
              />
            </div>
          </div>
        </div>
        
        <div>
          <FormLabel>Email Address</FormLabel>
          <Input
            name="email"
            value={clientData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
          />
        </div>
        
        <div>
          <FormLabel>Residential Address</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormDescription className="text-xs">Street Address</FormDescription>
              <Input
                name="address.street"
                value={clientData.address.street}
                onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                placeholder="Street Address"
                className={ocrResults?.personalInfo?.address ? "border-green-500" : ""}
              />
            </div>
            <div>
              <FormDescription className="text-xs">City</FormDescription>
              <Input
                name="address.city"
                value={clientData.address.city}
                onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <FormDescription className="text-xs">Province</FormDescription>
              <Select
                value={clientData.address.province}
                onValueChange={(value) => handleNestedChange("address", "province", value)}
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
            <div>
              <FormDescription className="text-xs">Postal Code</FormDescription>
              <Input
                name="address.postalCode"
                value={clientData.address.postalCode}
                onChange={(e) => handleNestedChange("address", "postalCode", e.target.value)}
                placeholder="Postal Code"
              />
            </div>
          </div>
        </div>
        
        {(clientData.maritalStatus === "married" || clientData.maritalStatus === "common_law") && (
          <div>
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Spouse Information Required</AlertTitle>
              <AlertDescription>
                For married or common-law clients, spouse information is required for insolvency filings.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-4">
              <div>
                <FormLabel>Spouse's Full Name</FormLabel>
                <Input
                  name="spouse.name"
                  value={clientData.spouse.name}
                  onChange={(e) => handleNestedChange("spouse", "name", e.target.value)}
                  placeholder="Spouse's Full Name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Spouse's SIN</FormLabel>
                  <Input
                    name="spouse.sin"
                    value={clientData.spouse.sin}
                    onChange={(e) => handleNestedChange("spouse", "sin", e.target.value)}
                    placeholder="Spouse's SIN"
                  />
                </div>
                <div>
                  <FormLabel>Spouse's Monthly Income</FormLabel>
                  <Input
                    name="spouse.income"
                    value={clientData.spouse.income}
                    onChange={(e) => handleNestedChange("spouse", "income", e.target.value)}
                    placeholder="Spouse's Monthly Income"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  const renderEmploymentIncomeSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Employment & Income Details</span>
          {ocrResults && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              AI Enhanced
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Enter all sources of employment and income
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <FormLabel>Employment Status</FormLabel>
          <Select
            value={clientData.employment.status}
            onValueChange={(value) => handleNestedChange("employment", "status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time Employed</SelectItem>
              <SelectItem value="part-time">Part-Time Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {clientData.employment.status !== "unemployed" && clientData.employment.status !== "retired" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Employer Name</FormLabel>
              <Input
                name="employment.employer"
                value={clientData.employment.employer}
                onChange={(e) => handleNestedChange("employment", "employer", e.target.value)}
                placeholder="Employer Name"
              />
            </div>
            <div>
              <FormLabel>Occupation/Job Title</FormLabel>
              <Input
                name="employment.occupation"
                value={clientData.employment.occupation}
                onChange={(e) => handleNestedChange("employment", "occupation", e.target.value)}
                placeholder="Occupation"
              />
            </div>
            <div>
              <FormLabel>Industry</FormLabel>
              <Input
                name="employment.industry"
                value={clientData.employment.industry}
                onChange={(e) => handleNestedChange("employment", "industry", e.target.value)}
                placeholder="Industry"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Gross Monthly Income</FormLabel>
            <Input
              name="income.monthly"
              value={clientData.income.monthly}
              onChange={(e) => handleNestedChange("income", "monthly", e.target.value)}
              placeholder="Monthly Income"
              type="number"
              className={ocrResults?.financialInfo?.income ? "border-green-500" : ""}
            />
            {ocrResults?.financialInfo?.income && (
              <div className="text-xs text-green-600 mt-1">
                AI detected income: ${parseFloat(ocrResults.financialInfo.income).toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <FormLabel>Pay Frequency</FormLabel>
            <Select
              value={clientData.income.frequency}
              onValueChange={(value) => handleNestedChange("income", "frequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pay frequency" />
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
        
        {clientData.employment.status === "self-employed" && (
          <div>
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Business Information Required</AlertTitle>
              <AlertDescription>
                Additional business details are required for self-employed clients.
              </AlertDescription>
            </Alert>
            
            <CardTitle className="text-sm mb-2">Business Information</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Business Name</FormLabel>
                <Input
                  name="business.name"
                  value={clientData.business.name}
                  onChange={(e) => handleNestedChange("business", "name", e.target.value)}
                  placeholder="Business Name"
                />
              </div>
              <div>
                <FormLabel>Business Registration Number</FormLabel>
                <Input
                  name="business.registrationNumber"
                  value={clientData.business.registrationNumber}
                  onChange={(e) => handleNestedChange("business", "registrationNumber", e.target.value)}
                  placeholder="Registration Number"
                />
              </div>
              <div>
                <FormLabel>Business Type</FormLabel>
                <Select
                  value={clientData.business.type}
                  onValueChange={(value) => handleNestedChange("business", "type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FormLabel>Annual Revenue</FormLabel>
                <Input
                  name="business.annualRevenue"
                  value={clientData.business.annualRevenue}
                  onChange={(e) => handleNestedChange("business", "annualRevenue", e.target.value)}
                  placeholder="Annual Revenue"
                  type="number"
                />
              </div>
              <div>
                <FormLabel>Annual Expenses</FormLabel>
                <Input
                  name="business.annualExpenses"
                  value={clientData.business.annualExpenses}
                  onChange={(e) => handleNestedChange("business", "annualExpenses", e.target.value)}
                  placeholder="Annual Expenses"
                  type="number"
                />
              </div>
              <div>
                <FormLabel>Outstanding Tax Amounts</FormLabel>
                <Input
                  name="business.outstandingTaxes"
                  value={clientData.business.outstandingTaxes}
                  onChange={(e) => handleNestedChange("business", "outstandingTaxes", e.target.value)}
                  placeholder="Outstanding Tax Amount"
                  type="number"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  const renderDebtFinancialSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Debt & Financial Obligations</span>
          {ocrResults && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              AI Enhanced
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Enter all debts and financial obligations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Total Unsecured Debt</FormLabel>
            <FormDescription className="text-xs">
              Credit cards, lines of credit, personal loans
            </FormDescription>
            <Input
              name="debt.unsecured"
              value={clientData.debt.unsecured}
              onChange={(e) => handleNestedChange("debt", "unsecured", e.target.value)}
              placeholder="Total Unsecured Debt"
              type="number"
              className={ocrResults?.financialInfo?.creditCardDebt ? "border-green-500" : ""}
            />
            {ocrResults?.financialInfo?.creditCardDebt && (
              <div className="text-xs text-green-600 mt-1">
                AI detected credit card debt: ${parseFloat(ocrResults.financialInfo.creditCardDebt).toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <FormLabel>Total Secured Debt</FormLabel>
            <FormDescription className="text-xs">
              Mortgages, car loans, etc.
            </FormDescription>
            <Input
              name="debt.secured"
              value={clientData.debt.secured}
              onChange={(e) => handleNestedChange("debt", "secured", e.target.value)}
              placeholder="Total Secured Debt"
              type="number"
              className={ocrResults?.financialInfo?.mortgageBalance ? "border-green-500" : ""}
            />
            {ocrResults?.financialInfo?.mortgageBalance && (
              <div className="text-xs text-green-600 mt-1">
                AI detected mortgage: ${parseFloat(ocrResults.financialInfo.mortgageBalance).toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <FormLabel>Outstanding Tax Debt</FormLabel>
            <FormDescription className="text-xs">
              CRA/Provincial tax debt
            </FormDescription>
            <Input
              name="debt.taxDebt"
              value={clientData.debt.taxDebt}
              onChange={(e) => handleNestedChange("debt", "taxDebt", e.target.value)}
              placeholder="Tax Debt"
              type="number"
              className={ocrResults?.financialInfo?.taxDebt ? "border-green-500" : ""}
            />
            {ocrResults?.financialInfo?.taxDebt && (
              <div className="text-xs text-green-600 mt-1">
                AI detected tax debt: ${parseFloat(ocrResults.financialInfo.taxDebt).toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <FormLabel>Court Judgments & Garnishments</FormLabel>
            <Input
              name="debt.courtJudgments"
              value={clientData.debt.courtJudgments}
              onChange={(e) => handleNestedChange("debt", "courtJudgments", e.target.value)}
              placeholder="Court Judgments Amount"
              type="number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FormLabel>Pending Lawsuits or Legal Claims</FormLabel>
            <Textarea
              name="debt.pendingLawsuits"
              value={clientData.debt.pendingLawsuits}
              onChange={(e) => handleNestedChange("debt", "pendingLawsuits", e.target.value)}
              placeholder="Describe any pending lawsuits or legal claims"
            />
          </div>
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <FormLabel className="text-base">Previous Bankruptcy</FormLabel>
              <FormDescription>
                Has the client previously declared bankruptcy?
              </FormDescription>
            </div>
            <Switch
              checked={clientData.previousBankruptcy}
              onCheckedChange={(checked) => handleToggleChange("previousBankruptcy", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div>
              <FormLabel className="text-base">Existing Debt Restructuring</FormLabel>
              <FormDescription>
                Is the client currently in a debt restructuring program?
              </FormDescription>
            </div>
            <Switch
              checked={clientData.hasExistingDebt}
              onCheckedChange={(checked) => handleToggleChange("hasExistingDebt", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderAssetsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Assets & Net Worth</CardTitle>
        <CardDescription>
          Enter client's assets and property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Real Estate Value</FormLabel>
            <Input
              name="assets.realEstate"
              value={Array.isArray(clientData.assets.realEstate) ? "" : clientData.assets.realEstate}
              onChange={(e) => handleNestedChange("assets", "realEstate", e.target.value)}
              placeholder="Value of Real Estate Owned"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Bank Account Balances</FormLabel>
            <Input
              name="assets.bankAccounts"
              value={Array.isArray(clientData.assets.bankAccounts) ? "" : clientData.assets.bankAccounts}
              onChange={(e) => handleNestedChange("assets", "bankAccounts", e.target.value)}
              placeholder="Total Value in Bank Accounts"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Investment Value</FormLabel>
            <FormDescription className="text-xs">
              RRSP, TFSA, Stocks, Bonds, etc.
            </FormDescription>
            <Input
              name="assets.investments"
              value={Array.isArray(clientData.assets.investments) ? "" : clientData.assets.investments}
              onChange={(e) => handleNestedChange("assets", "investments", e.target.value)}
              placeholder="Value of Investments"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Vehicle Value</FormLabel>
            <Input
              name="assets.vehicles"
              value={Array.isArray(clientData.assets.vehicles) ? "" : clientData.assets.vehicles}
              onChange={(e) => handleNestedChange("assets", "vehicles", e.target.value)}
              placeholder="Value of Vehicles"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Personal Assets</FormLabel>
            <FormDescription className="text-xs">
              Items worth over $5,000 (jewelry, art, etc.)
            </FormDescription>
            <Input
              name="assets.personalAssets"
              value={Array.isArray(clientData.assets.personalAssets) ? "" : clientData.assets.personalAssets}
              onChange={(e) => handleNestedChange("assets", "personalAssets", e.target.value)}
              placeholder="Value of Personal Assets"
              type="number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderExpensesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Enter client's monthly expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Housing Costs</FormLabel>
            <FormDescription className="text-xs">
              Mortgage/Rent, Property Taxes, Condo Fees
            </FormDescription>
            <Input
              name="expenses.housing"
              value={clientData.expenses.housing}
              onChange={(e) => handleNestedChange("expenses", "housing", e.target.value)}
              placeholder="Monthly Housing Costs"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Utilities</FormLabel>
            <FormDescription className="text-xs">
              Electric, Gas, Water, Internet, Phone
            </FormDescription>
            <Input
              name="expenses.utilities"
              value={clientData.expenses.utilities}
              onChange={(e) => handleNestedChange("expenses", "utilities", e.target.value)}
              placeholder="Monthly Utilities"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Transportation</FormLabel>
            <FormDescription className="text-xs">
              Car payments, insurance, gas, public transit
            </FormDescription>
            <Input
              name="expenses.transportation"
              value={clientData.expenses.transportation}
              onChange={(e) => handleNestedChange("expenses", "transportation", e.target.value)}
              placeholder="Monthly Transportation Costs"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Food & Household</FormLabel>
            <Input
              name="expenses.food"
              value={clientData.expenses.food}
              onChange={(e) => handleNestedChange("expenses", "food", e.target.value)}
              placeholder="Monthly Food & Household Expenses"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Childcare & Education</FormLabel>
            <Input
              name="expenses.childcare"
              value={clientData.expenses.childcare}
              onChange={(e) => handleNestedChange("expenses", "childcare", e.target.value)}
              placeholder="Monthly Childcare Costs"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Health Insurance & Prescriptions</FormLabel>
            <Input
              name="expenses.health"
              value={clientData.expenses.health}
              onChange={(e) => handleNestedChange("expenses", "health", e.target.value)}
              placeholder="Monthly Healthcare Costs"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Entertainment & Discretionary</FormLabel>
            <Input
              name="expenses.entertainment"
              value={clientData.expenses.entertainment}
              onChange={(e) => handleNestedChange("expenses", "entertainment", e.target.value)}
              placeholder="Monthly Entertainment Costs"
              type="number"
            />
          </div>
          <div>
            <FormLabel>Debt Repayments</FormLabel>
            <FormDescription className="text-xs">
              Loans, Credit Cards, CRA Payments
            </FormDescription>
            <Input
              name="expenses.debtRepayments"
              value={clientData.expenses.debtRepayments}
              onChange={(e) => handleNestedChange("expenses", "debtRepayments", e.target.value)}
              placeholder="Monthly Debt Payments"
              type="number"
            />
          </div>
        </div>
        
        {section === "financial" && (
          <div className="pt-4 border-t">
            <Button
              type="button"
              className="w-full"
              onClick={onAnalyze}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {progressStatus || "Processing..."}
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Financial Status & Recommend Solutions
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {section === "personal" ? (
        <>
          {renderPersonalInfoSection()}
        </>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="employment">Employment & Income</TabsTrigger>
            <TabsTrigger value="debt">Debt & Obligations</TabsTrigger>
            <TabsTrigger value="assets">Assets & Net Worth</TabsTrigger>
            <TabsTrigger value="expenses">Monthly Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employment">
            {renderEmploymentIncomeSection()}
          </TabsContent>
          
          <TabsContent value="debt">
            {renderDebtFinancialSection()}
          </TabsContent>
          
          <TabsContent value="assets">
            {renderAssetsSection()}
          </TabsContent>
          
          <TabsContent value="expenses">
            {renderExpensesSection()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
