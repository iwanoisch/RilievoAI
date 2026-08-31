import {useAppSelector} from "../../../store/store.ts";
import {FASCICOLO_SKIP_FIELDS} from "../../../constants/fascicolo.constant.ts";
import type {BuildingElement} from "../../building/slice/building.type.ts";
import type {FascicoloScheda, FascicoloObservation, FascicoloField} from "../slice/fascicolo.type.ts";

const extractFields = (element: BuildingElement): FascicoloField[] => {
    const fields: FascicoloField[] = [];

    for (const [key, value] of Object.entries(element)) {
        if (FASCICOLO_SKIP_FIELDS.includes(key) || value === undefined || value === null) continue;
        fields.push({
            key,
            label: key,
            value: value as string | number,
            source: 'building',
            sourceId: element.id,
            confidence: element.confidence,
            dataStatus: element.dataStatus,
        });
    }
    return fields;
};

export const useFascicoloMapping = () => {
    const {elements} = useAppSelector(state => state.building);
    const {photos, voiceObservations, measurements} = useAppSelector(state => state.survey);

    const buildSchede = (): FascicoloScheda[] => {
        const validatedElements = Object.values(elements).filter(el => el.dataStatus === 'VALIDATED');

        return validatedElements.map(element => {
            const parent = element.parentId ? elements[element.parentId] : null;

            const observations: FascicoloObservation[] = [
                ...photos
                    .filter(p => p.dataStatus === 'VALIDATED' && p.targetElementId === element.id)
                    .map(p => ({
                        id: p.id,
                        type: 'photo' as const,
                        label: p.viewDirection || 'Foto',
                        confidence: p.confidence,
                        dataStatus: p.dataStatus,
                        timestamp: p.timestamp,
                        excluded: false,
                    })),
                ...voiceObservations
                    .filter(v => v.dataStatus === 'VALIDATED' && v.targetElementId === element.id)
                    .map(v => ({
                        id: v.id,
                        type: 'voice' as const,
                        label: v.transcription?.substring(0, 50) || 'Registrazione',
                        confidence: v.confidence,
                        dataStatus: v.dataStatus,
                        timestamp: v.timestamp,
                        excluded: false,
                    })),
                ...measurements
                    .filter(m => m.dataStatus === 'VALIDATED' && m.elementId === element.id)
                    .map(m => ({
                        id: m.id,
                        type: 'measurement' as const,
                        label: `${m.value} ${m.unit}`,
                        confidence: m.confidence,
                        dataStatus: m.dataStatus,
                        timestamp: m.timestamp,
                        excluded: false,
                    })),
            ];

            return {
                elementId: element.id,
                elementType: element.type,
                elementLabel: element.label,
                parentLabel: parent?.label ?? '',
                fields: extractFields(element),
                observations,
                transferStatus: 'pending' as const,
            };
        });
    };

    const validatedCount = Object.values(elements).filter(el => el.dataStatus === 'VALIDATED').length;
    const totalCount = Object.values(elements).length;

    return {
        buildSchede,
        validatedCount,
        totalCount,
    };
};
