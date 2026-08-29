import {FC} from "react";
import {Props} from "./pageTitle.type.ts";
import {MapPinIcon} from "@heroicons/react/24/outline";

export const PageTitle: FC<Props> = ({
                                         title,
                                         subtitle,
                                         badges,
                                         address
                                     }) => {
    const hasAddress = address && (address.street || address.city || address.province);
    const hasBadges = badges && badges.length > 0;

    const words = title.split(" ");

    return (
        <div className="flex items-center gap-4">

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h1 className="text-xl sm:text-3xl uppercase font-bold text-slate-900 tracking-tight truncate">
                        {
                            words.length === 2
                                ? <>{words[0]} <span className="text-primary-500">{words[1]}</span></>
                                : title
                        }
                    </h1>
                    {hasBadges && badges.map((badge, index) => {
                        const BadgeIcon = badge.icon;
                        return (
                            <span
                                key={index}
                                className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    badge.bgColor || 'bg-primary-500'
                                } ${
                                    badge.textColor || 'text-white'
                                } ${
                                    badge.borderColor ? `border ${badge.borderColor}` : ''
                                }`}
                            >
                                {BadgeIcon && <BadgeIcon className="h-3 w-3"/>}
                                {badge.label}
                            </span>
                        );
                    })}
                </div>
                {hasAddress ? (
                    <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-slate-700 italic">
                        <MapPinIcon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0"/>
                        <span className="truncate">
                            {address.street && `${address.street}, `}
                            {address.city}
                            {address.province && ` (${address.province})`}
                        </span>
                    </div>
                ) : subtitle ? (
                    <p className="mt-1 text-sm sm:text-base text-slate-500">
                        {subtitle}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
