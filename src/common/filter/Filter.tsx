import { useTranslation } from "react-i18next";

export type FilterValue = string | undefined;

export interface FilterField {
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "select" | "date";
    options?: {
        label: string;
        value: string;
    }[];
}

interface FilterProps {
    title: string;
    filters: Record<string, string | number>;
    fields: FilterField[];
    onChange: (name: string, value: string) => void;
    onConfirm: () => void;
    onReset: () => void;
}

export const Filter = ({
                           title,
                           filters,
                           fields,
                           onChange,
                           onConfirm,
                           onReset,
                       }: FilterProps) => {
    const { t } = useTranslation();

    const renderField = (field: FilterField) => {
        const value = filters[field.name] ?? "";
        const type = field.type ?? "text";

        return (
            <div key={field.name} className="flex-1 min-w-[200px]">
                <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                </label>

                {type === "select" ? (
                    <select
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">{t("common.all")}</option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : type === "date" ? (
                    <input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="block w-full rounded-md border px-3 py-2 text-sm"
                    />
                ) : (
                    <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="block w-full rounded-md border px-3 py-2 text-sm"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="mb-6 px-4 py-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {fields.map((field) => renderField(field))}

                <div className="flex-1 min-w-[150px] flex items-end">
                    <button
                        onClick={onConfirm}
                        className="w-full rounded-md border border-primary-600 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                    >
                        Applica filtro
                    </button>
                </div>

                <div className="flex-1 min-w-[150px] flex items-end">
                    <button
                        onClick={onReset}
                        className="w-full rounded-md border border-primary-600 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                    >
                        {t("activities.resetFilters")}
                    </button>
                </div>
            </div>
        </div>
    );
};
