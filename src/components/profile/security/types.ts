
export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecurityFormProps {
  onPasswordUpdate: () => void;
  passwordFields: PasswordUpdate;
  setPasswordFields: (fields: PasswordUpdate) => void;
  isUpdatingPassword: boolean;
}
