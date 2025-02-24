
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name: string;
  role: "manager" | "employee" | "client";
}

export const ProfileHeader = ({ name, role }: ProfileHeaderProps) => {
  return (
    <div className="relative w-full bg-gradient-to-r from-primary/5 to-primary/10 p-8 rounded-lg mb-6">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
          {role === "manager" && (
            <Badge variant="default" className="bg-primary">
              Admin
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
