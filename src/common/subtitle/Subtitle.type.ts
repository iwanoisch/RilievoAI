import { ComponentType, SVGProps } from "react";

export interface SubtitleProps {
    title: string;
    subtitle?: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    iconColor?: string;
    iconBackground?: string;
}
