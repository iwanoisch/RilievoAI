import { ComponentType, SVGProps } from "react";

export interface PageTitleBadge {
    label: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface PageTitleAddress {
    street?: string;
    city?: string;
    province?: string;
}

export interface Props {
    title: string;
    subtitle?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    iconBgColor?: string;
    iconColor?: string;
    badges?: PageTitleBadge[];
    address?: PageTitleAddress;
}
