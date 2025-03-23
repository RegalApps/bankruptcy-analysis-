
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

interface AuthFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isDisabled?: boolean;
}

export const AuthFields = ({
  email,
  setEmail,
  password,
  setPassword,
  isDisabled = false
}: AuthFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isDisabled}
          className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isDisabled}
          minLength={6}
          className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Password must be at least 6 characters long
        </p>
      </div>
    </div>
  );
};
