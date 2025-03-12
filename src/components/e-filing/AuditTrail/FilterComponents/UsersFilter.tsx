
import { User, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface UsersFilterProps {
  users: string[];
  selectedUsers: Set<string>;
  onUserChange: (userName: string) => void;
}

export const UsersFilter = ({ 
  users, 
  selectedUsers, 
  onUserChange 
}: UsersFilterProps) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <User className="h-4 w-4 mr-2" />
          Users
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-3 pb-3">
        <div className="flex flex-wrap gap-2">
          {users.length <= 5 ? (
            users.map(userName => (
              <Badge
                key={userName}
                variant={selectedUsers.has(userName) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onUserChange(userName)}
              >
                {userName}
              </Badge>
            ))
          ) : (
            <>
              {users.slice(0, 3).map(userName => (
                <Badge
                  key={userName}
                  variant={selectedUsers.has(userName) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onUserChange(userName)}
                >
                  {userName}
                </Badge>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge variant="outline" className="cursor-pointer">
                    +{users.length - 3} more
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {users.slice(3).map(userName => (
                    <DropdownMenuItem 
                      key={userName}
                      onClick={() => onUserChange(userName)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>{userName}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
