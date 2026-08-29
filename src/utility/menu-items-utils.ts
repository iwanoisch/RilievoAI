import {
  Squares2X2Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ComponentType, SVGProps } from "react";

export type MenuIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type UserRole = 'owner' | 'superadmin' | 'user' ;

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: MenuIcon;
  role?: UserRole[] | undefined ;
  current?: boolean;
  action?: string;
}

export const subMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/dashboard",
    icon: Squares2X2Icon,
    current: true,
  },
];

export const userMenuItems: MenuItem[] = [
  { id: "profile", name: "Profilo utente", href: "/userprofile", icon: UserCircleIcon },
  { id: "option", name: "Impostazioni", href: "/usersettings", icon: Cog6ToothIcon },
  { id: "logout", name: "Logout", href: "#", icon: ArrowLeftStartOnRectangleIcon, action: "logout" },
];
