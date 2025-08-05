import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ADMIN_TABLE, ROLE_TYPE, UserRole } from "@/constants";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreHorizontalIcon, ShieldIcon, User } from "lucide-react";
import { UserWithoutPassword } from "../queries";

type UserTableRowProps = {
  user: UserWithoutPassword;
  isLoading: string | null;
  getUserInitials: (name: string | null) => string;
  handleRoleToggle: (userId: string, currentRole: UserRole) => void;
};

export const UserTableRow = ({
  user,
  isLoading,
  getUserInitials,
  handleRoleToggle,
}: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name || "Unknown User"}</div>
            <div className="text-xs text-muted-foreground">
              ID: {user.id.substring(0, ADMIN_TABLE.ID_DISPLAY_LENGTH)}...
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge
          variant={user.role === ROLE_TYPE.ADMIN ? "destructive" : "secondary"}
          className="flex w-fit items-center gap-1"
        >
          {user.role === ROLE_TYPE.ADMIN ? (
            <ShieldIcon className="size-3" />
          ) : (
            <User className="size-3" />
          )}
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(user.createdAt), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading === user.id}
            >
              {isLoading === user.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MoreHorizontalIcon />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={
                user.role === ROLE_TYPE.ADMIN
                  ? "text-destructive"
                  : "text-blue-600"
              }
              onClick={() => handleRoleToggle(user.id, user.role as UserRole)}
              disabled={isLoading === user.id}
            >
              {user.role === ROLE_TYPE.ADMIN
                ? ADMIN_TABLE.ACTIONS.DEMOTE
                : ADMIN_TABLE.ACTIONS.PROMOTE}{" "}
              to {user.role === ROLE_TYPE.ADMIN ? "User" : "Admin"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
