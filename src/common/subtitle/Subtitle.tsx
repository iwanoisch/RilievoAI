import { FC } from "react";
import {SubtitleProps} from "./Subtitle.type.ts";

export const Subtitle: FC<SubtitleProps> = ({
    title,
    subtitle,
    icon: Icon,
    iconColor = "text-primary-600",
    iconBackground = "bg-primary-100",
}) => {
    return (
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${iconBackground}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-wide">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};
