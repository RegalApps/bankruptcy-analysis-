
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SecurityFormProps {
  onPasswordUpdate: () => Promise<void>;
  passwordFields: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordFields: (fields: any) => void;
  isUpdatingPassword: boolean;
}

export const SecurityForm = ({
  onPasswordUpdate,
  passwordFields,
  setPasswordFields,
  isUpdatingPassword
}: SecurityFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwordFields.currentPassword}
          onChange={(e) => setPasswordFields(prev => ({
            ...prev,
            currentPassword: e.target.value
          }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={passwordFields.newPassword}
          onChange={(e) => setPasswordFields(prev => ({
            ...prev,
            newPassword: e.target.value
          }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordFields.confirmPassword}
          onChange={(e) => setPasswordFields(prev => ({
            ...prev,
            confirmPassword: e.target.value
          }))}
        />
      </div>
      <Button
        onClick={onPasswordUpdate}
        disabled={isUpdatingPassword || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword}
        className="w-full"
      >
        {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Password
      </Button>
    </div>
  );
};
