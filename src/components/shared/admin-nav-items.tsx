import { routes } from "@/routes";
import {
  AlertTriangleIcon,
  LayoutDashboardIcon,
  Link2Icon,
  UsersIcon,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  exact: boolean;
};

export const getNavItems = (): NavItem[] => [
  {
    name: "Overview",
    href: routes.admin.root,
    icon: <LayoutDashboardIcon className="size-4" />,
    exact: true,
  },
  {
    name: "URLs",
    href: routes.admin.urls,
    icon: <Link2Icon className="size-4" />,
    exact: true,
  },
  {
    name: "Flagged URLs",
    href: routes.admin.flagged,
    icon: <AlertTriangleIcon className="size-4" />,
    exact: true,
  },
  {
    name: "Users",
    href: routes.admin.users,
    icon: <UsersIcon className="size-4" />,
    exact: true,
  },
];
