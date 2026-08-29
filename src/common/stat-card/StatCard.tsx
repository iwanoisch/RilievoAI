import {StatCardProps} from "./statsCard.type.ts";


export const StatCard = ({icon: Icon, label, value, color, bgColor}: StatCardProps) => {
    return <>
        <div className="p-2.5 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h5 className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5 lg:mb-1 truncate">{label}</h5>
                    <span className="text-base sm:text-lg lg:text-2xl font-bold text-slate-800">{value}</span>
                </div>
                <div className={`p-1.5 sm:p-2 lg:p-3 rounded-full ${bgColor} shadow-sm flex-shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${color}`}/>
                </div>
            </div>
        </div>
    </>
};
