import { FC } from "react";
import { Props } from "./panelTitle.type.ts";

export const PanelTitle: FC<Props> = ({
    title,
    subtitle,
    icon: Icon,
    iconGradientFrom = "from-primary-500",
    iconGradientTo = "to-primary-600",
    iconColor = "text-white",
    iconBackground,
}) => {
    const backgroundClass = iconBackground
        ? iconBackground
        : `bg-gradient-to-br ${iconGradientFrom} ${iconGradientTo}`;

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${backgroundClass}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-slate-500">{subtitle}</p>
                )}
            </div>
        </div>
    );
};
