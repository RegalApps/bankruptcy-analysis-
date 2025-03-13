
import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface SignatureConsentSectionProps {
  formData: IncomeExpenseData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onConsentChange: (checked: boolean) => void;
}

export const SignatureConsentSection = ({ 
  formData, 
  onChange,
  onConsentChange
}: SignatureConsentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature & Consent</CardTitle>
        <CardDescription>
          Verify information and provide consent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electronic_signature">Electronic Signature</Label>
            <Input
              id="electronic_signature"
              name="electronic_signature"
              value={formData.electronic_signature || ""}
              onChange={onChange}
              placeholder="Type your full name as signature"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verification_date">Date Verified</Label>
            <Input
              id="verification_date"
              name="verification_date"
              type="date"
              value={formData.verification_date || ""}
              onChange={onChange}
            />
          </div>
          
          <div className="col-span-2 flex items-start space-x-2 pt-4">
            <Checkbox 
              id="consent_data_use" 
              checked={formData.consent_data_use === "true"}
              onCheckedChange={(checked) => onConsentChange(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="consent_data_use"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to the use of this data for financial analysis and record-keeping purposes
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree that the information provided is complete and accurate.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consent_date">Consent Date</Label>
            <Input
              id="consent_date"
              name="consent_date"
              type="date"
              value={formData.consent_date || ""}
              onChange={onChange}
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
