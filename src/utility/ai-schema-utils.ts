import type {AnagraficaSectionConfig} from "../features/anagrafica/anagrafica.type.ts";
import type {AiFieldSchema} from "../features/ai/ai.type.ts";

export const buildFieldSchema = (config: AnagraficaSectionConfig): AiFieldSchema[] => {
    const schema: AiFieldSchema[] = [];

    for (const group of config.groups) {
        if (group.fields.length > 0) {
            for (const field of group.fields) {
                if (field.type === 'heading' || field.type === 'file') continue;
                schema.push({
                    key: field.key,
                    label: field.label,
                    type: field.type,
                    groupKey: group.key,
                    repeatable: group.repeatable || undefined,
                    options: field.options?.map(o => o.value),
                });
            }
        }

        if (group.subGroups) {
            for (const subGroup of group.subGroups) {
                for (const field of subGroup.fields) {
                    if (field.type === 'heading' || field.type === 'file') continue;
                    schema.push({
                        key: field.key,
                        label: field.label,
                        type: field.type,
                        groupKey: `${group.key}.${subGroup.key}`,
                        repeatable: subGroup.repeatable || undefined,
                        options: field.options?.map(o => o.value),
                    });
                }
            }
        }
    }

    return schema;
};
