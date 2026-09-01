import {
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    BuildingOffice2Icon,
    BeakerIcon,
} from "@heroicons/react/24/outline";
import type {MenuItem} from "../types/shared.type.ts";

export const SUB_MENU_ITEMS: MenuItem[] = [
    {id: "buildings", name: "Gestione Edifici", href: "/buildings", icon: BuildingOffice2Icon},
    {id: "poc", name: "Poc", href: "/poc", icon: BeakerIcon},
];

export const USER_MENU_ITEMS: MenuItem[] = [
    {id: "profile", name: "Profilo utente", href: "/userprofile", icon: UserCircleIcon},
    {id: "option", name: "Impostazioni", href: "/usersettings", icon: Cog6ToothIcon},
    {id: "logout", name: "Logout", href: "#", icon: ArrowLeftStartOnRectangleIcon, action: "logout"},
];
