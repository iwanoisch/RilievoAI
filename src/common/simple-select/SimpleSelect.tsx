import { useState } from 'react';
import * as React from "react";

interface SimpleSelectProps<T> {
    id: string;
    name: string;
    data: T[];
    existingValue?: string;
    getKey: (item: T) => string;
    getValue: (item: T) => string;
    getLabel?: (item: T) => string;
    disabled?: boolean;
    isRequired?: boolean;
    classSetting?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue?: string;
}

export const SimpleSelect = <T, > ({
                                     id,
                                     name,
                                     data,
                                     existingValue,
                                     getKey,
                                     getValue,
                                     getLabel,
                                     disabled = false,
                                     isRequired = false,
                                     classSetting,
                                     onChange,
                                     defaultValue = '',
                                 }: SimpleSelectProps<T>) => {
    const [selected, setSelected] = useState(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
        onChange(e);
    };
    return (
        <>
        <select
            id={id}
            name={name}
            required={isRequired}
            className={classSetting}
            disabled={disabled}
            onChange={handleChange}
            value={selected || existingValue}
            autoComplete="on"
            aria-label="Seleziona"
        >
            <option value="">Seleziona un'opzione</option>
            {data.map((item) => (
                <option key={getKey(item)} value={getValue(item)}>
                    {getLabel ? getLabel(item) : getValue(item)}
                </option>
            ))}
        </select>
        </>
    );
}
