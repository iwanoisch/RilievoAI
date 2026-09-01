import {type FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {POC_TABS} from "../../constants/poc-tabs.constant.ts";
import type {PocTabId} from "./poc.type.ts";
import {Edificio} from "../edificio/Edificio.tsx";
import {Survey} from "../survey/Survey.tsx";
import {SurveyValidation} from "../survey-validation/SurveyValidation.tsx";
import {Fascicolo} from "../fascicolo/Fascicolo.tsx";
import {FloorPlan} from "../floor-plan/FloorPlan.tsx";

export const Poc: FC = () => {
    const {t} = useTranslation();
    const [activeTab, setActiveTab] = useState<PocTabId>('survey');

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary-50/50 via-primary-100/30 to-slate-50">
            {/* Tab bar */}
            <div className="bg-surface-card border-b border-border-default">
                <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto -mb-px">
                        {POC_TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px]
                                        ${activeTab === tab.id
                                        ? 'text-primary-600 border-b-2 border-primary-500'
                                        : 'text-text-muted hover:text-text-secondary'
                                    }`}
                                >
                                    <Icon className="h-4 w-4"/>
                                    {t(tab.labelKey)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'building' && <Edificio/>}
            {activeTab === 'survey' && <Survey/>}
            {activeTab === 'validation' && <SurveyValidation/>}
            {activeTab === 'fascicolo' && <Fascicolo/>}
            {activeTab === 'floorPlan' && <FloorPlan/>}
        </div>
    );
};
