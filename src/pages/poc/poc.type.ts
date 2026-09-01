import type React from 'react';

export type PocTabId = 'building' | 'survey' | 'validation' | 'fascicolo' | 'floorPlan';

export interface PocTab {
    id: PocTabId;
    labelKey: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
