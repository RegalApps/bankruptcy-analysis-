
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo/ClientInfoPanel";
import { FileSignature, Calendar, Shield } from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  language?: string;
  filing_date?: string;
  status?: string;
}

interface ClientAgreementTemplateProps {
  clientInfo: ClientInfo;
}

export const ClientAgreementTemplate = ({ clientInfo }: ClientAgreementTemplateProps) => {
  const [insolvencyType, setInsolvencyType] = useState<string>("consumer_proposal");
  const [agreementDate, setAgreementDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [consentElectronic, setConsentElectronic] = useState<boolean>(true);
  
  // Mock trustee information
  const trusteeInfo = {
    name: "Smith & Associates LIT",
    licenseNumber: "12-3456-7",
    address: "456 Business Ave, Suite 300, Toronto, ON M5V 2N4",
    phone: "(416) 555-7890",
    email: "info@smithlit.ca"
  };
  
  return (
    <div className="space-y-6">
      <ClientInfoPanel clientInfo={clientInfo} readOnly={true} />
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Client Agreement Form (Engagement Letter)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insolvency-type">Type of Insolvency</Label>
                  <Select 
                    value={insolvencyType}
                    onValueChange={setInsolvencyType}
                  >
                    <SelectTrigger id="insolvency-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumer_proposal">Consumer Proposal</SelectItem>
                      <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                      <SelectItem value="division_i_proposal">Division I Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agreement-date" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Agreement Date
                  </Label>
                  <Input 
                    id="agreement-date" 
                    type="date" 
                    value={agreementDate}
                    onChange={(e) => setAgreementDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-md space-y-2">
                  <h4 className="font-medium">Trustee Information</h4>
                  <div className="text-sm space-y-1">
                    <p>{trusteeInfo.name}</p>
                    <p>License: {trusteeInfo.licenseNumber}</p>
                    <p>{trusteeInfo.address}</p>
                    <p>Phone: {trusteeInfo.phone}</p>
                    <p>Email: {trusteeInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Scope of Services</h4>
              <div className="text-sm p-4 bg-muted/30 rounded-md">
                {insolvencyType === "consumer_proposal" && (
                  <p>Smith & Associates LIT agrees to provide Consumer Proposal services to {clientInfo.name}, including financial assessment, preparation and filing of all necessary documents, representation in dealings with creditors, and ongoing support throughout the proposal process.</p>
                )}
                {insolvencyType === "bankruptcy" && (
                  <p>Smith & Associates LIT agrees to provide Bankruptcy services to {clientInfo.name}, including financial assessment, preparation and filing of all necessary documents, representation in dealings with creditors, asset liquidation as required, and ongoing support throughout the bankruptcy process.</p>
                )}
                {insolvencyType === "division_i_proposal" && (
                  <p>Smith & Associates LIT agrees to provide Division I Proposal services to {clientInfo.name}, including financial assessment, preparation and filing of all necessary documents, representation in dealings with creditors, and ongoing support throughout the proposal process specific to business insolvency.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Responsibilities of Each Party</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Trustee Responsibilities:</h5>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Conduct thorough assessment of financial situation</li>
                    <li>Prepare and file all required documentation</li>
                    <li>Provide guidance throughout the process</li>
                    <li>Represent client's interests with creditors</li>
                    <li>Ensure compliance with all legal requirements</li>
                    <li>Maintain confidentiality of all information</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Client Responsibilities:</h5>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Provide complete and accurate financial information</li>
                    <li>Disclose all assets and liabilities</li>
                    <li>Attend required counseling sessions</li>
                    <li>Make all required payments on time</li>
                    <li>Report any material changes in financial circumstances</li>
                    <li>Cooperate fully throughout the process</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Fees and Disbursements</h4>
              <div className="text-sm p-4 bg-muted/30 rounded-md">
                {insolvencyType === "consumer_proposal" && (
                  <p>The fees for Consumer Proposal services are regulated by the Bankruptcy and Insolvency Act and will be included in your proposal payments. The trustee's fees will be calculated as 20% of amounts distributed to creditors plus applicable taxes and disbursements. A detailed fee structure will be provided during your initial consultation.</p>
                )}
                {insolvencyType === "bankruptcy" && (
                  <p>The base fees for Bankruptcy services are regulated by the Bankruptcy and Insolvency Act. The fee structure includes a base fee of $1,800 plus applicable taxes, with additional fees for surplus income payments if applicable. A detailed fee structure will be provided during your initial consultation.</p>
                )}
                {insolvencyType === "division_i_proposal" && (
                  <p>The fees for Division I Proposal services are regulated by the Bankruptcy and Insolvency Act and will be included in your proposal payments. The fee structure is calculated based on the complexity of your case and value of assets involved. A detailed fee structure will be provided during your initial consultation.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Confidentiality Clause</h4>
              <div className="text-sm p-4 bg-muted/30 rounded-md">
                <p className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5" />
                  <span>All information provided by {clientInfo.name} will be kept strictly confidential, subject only to disclosure requirements under the Bankruptcy and Insolvency Act. The trustee will not disclose any personal or financial information to third parties except as required by law or as necessary to administer the {insolvencyType.replace('_', ' ')}.</span>
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consent" 
                  checked={consentElectronic}
                  onCheckedChange={(checked) => setConsentElectronic(checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm">
                  I consent to receive electronic communications from the trustee regarding my file.
                </Label>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client-signature">Client Signature</Label>
                <div className="h-24 border rounded-md flex items-center justify-center bg-muted/20">
                  <Button variant="outline" className="h-10">Sign Document</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trustee-signature">Trustee Signature</Label>
                <div className="h-24 border rounded-md flex items-center justify-center bg-muted/20">
                  <Button variant="outline" className="h-10">Sign Document</Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>Finalize Document</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
