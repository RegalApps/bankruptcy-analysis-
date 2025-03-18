
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BookingLinkFormProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  caseType: string;
  setCaseType: (type: string) => void;
  caseNumber: string;
  setCaseNumber: (number: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (notes: string) => void;
}

export const BookingLinkForm = ({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  caseType,
  setCaseType,
  caseNumber,
  setCaseNumber,
  additionalNotes,
  setAdditionalNotes
}: BookingLinkFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Client Information</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Client Name</label>
          <Input 
            placeholder="Enter client name" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Client Email</label>
          <Input 
            type="email" 
            placeholder="client@example.com" 
            value={clientEmail} 
            onChange={(e) => setClientEmail(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Case Type</label>
          <select 
            className="w-full p-2 border rounded-md" 
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
          >
            <option value="Consumer Proposal">Consumer Proposal</option>
            <option value="Bankruptcy">Bankruptcy</option>
            <option value="Debt Counseling">Debt Counseling</option>
            <option value="Financial Assessment">Financial Assessment</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Case Number (optional)</label>
          <Input 
            placeholder="Enter case number if available" 
            value={caseNumber} 
            onChange={(e) => setCaseNumber(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Additional Notes</label>
          <Textarea 
            placeholder="Add any special instructions or notes for this booking" 
            rows={3}
            value={additionalNotes} 
            onChange={(e) => setAdditionalNotes(e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};
