
import { PasswordSection } from "@/components/profile/security/PasswordSection";
import { SecuritySettingsSection } from "@/components/profile/security/SecuritySettingsSection";
import { ActiveSessionsSection } from "@/components/profile/security/ActiveSessionsSection";
import { SecurityFormProps } from "@/components/profile/security/types";

export const SecurityForm = ({
  onPasswordUpdate,
  passwordFields,
  setPasswordFields,
  isUpdatingPassword,
}: SecurityFormProps) => {
  return (
    <div className="space-y-6">
      <PasswordSection
        passwordFields={passwordFields}
        onPasswordUpdate={onPasswordUpdate}
        setPasswordFields={setPasswordFields}
        isUpdatingPassword={isUpdatingPassword}
      />
      
      <SecuritySettingsSection />
      
      <div className="card">
        <ActiveSessionsSection />
      </div>
    </div>
  );
};
