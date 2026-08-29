import { ComponentType, SVGProps } from "react";

export interface Props {
    title: string;
    subtitle?: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    iconGradientFrom?: string;
    iconGradientTo?: string;
    iconColor?: string;
    iconBackground?: string;
}