import {
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    CameraIcon,
    BuildingOffice2Icon,
    MapIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type {MenuItem} from "../types/shared.type.ts";

export const SUB_MENU_ITEMS: MenuItem[] = [
    {id: "building", name: "Edificio", href: "/building", icon: BuildingOffice2Icon},
    {id: "survey", name: "Rilievo AI", href: "/survey", icon: CameraIcon},
    {id: "validation", name: "Validazione", href: "/validation", icon: ClipboardDocumentCheckIcon},
    {id: "fascicolo", name: "Fascicolo", href: "/fascicolo", icon: DocumentTextIcon},
    {id: "floorPlan", name: "Planimetria", href: "/floor-plan", icon: MapIcon},
];

export const USER_MENU_ITEMS: MenuItem[] = [
    {id: "profile", name: "Profilo utente", href: "/userprofile", icon: UserCircleIcon},
    {id: "option", name: "Impostazioni", href: "/usersettings", icon: Cog6ToothIcon},
    {id: "logout", name: "Logout", href: "#", icon: ArrowLeftStartOnRectangleIcon, action: "logout"},
];
