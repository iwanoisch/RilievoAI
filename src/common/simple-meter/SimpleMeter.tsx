import {SimpleMeterProps} from "./SimpleMeter.type";
import {
    calculateMeterPercentage,
    getMeterBarColor,
    getMeterTextColor,
    getMeterStatusLabel,
    getMeterBadgeStyle
} from "../../utility/meter-utils";

function SimpleMeter({value, size = 1, min = 0, max = 100, className = ""}: SimpleMeterProps) {
    const percentage = calculateMeterPercentage(value, min, max);
    const usedGB = (value / 100 * size).toFixed(2);

    const barColor = getMeterBarColor(percentage);
    const textColor = getMeterTextColor(percentage);
    const statusLabel = getMeterStatusLabel(percentage);
    const badgeStyle = getMeterBadgeStyle(percentage);

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {/* Header con info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${textColor}`}>
            {usedGB} GB
          </span>
                    <span className="text-sm text-slate-500">di {size} GB</span>
                    {statusLabel && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}>
              {statusLabel}
            </span>
                    )}
                </div>
                <span className={`text-sm font-medium ${textColor}`}>
          {percentage < 1 ? "<1" : percentage.toFixed(0)}%
        </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                     style={{width: `${percentage}%`}}
                />
            </div>
        </div>
    );
}

export default SimpleMeter;
