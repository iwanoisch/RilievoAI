import {MultiSelectProps} from "./MultiSelect.type.ts";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/solid";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {useMemo, useState} from "react";

export const MultiSelect = ({
                                label,
                                options,
                                selected,
                                onChange,
                                className,
                                ariaLabel = 'Multiselect',
                                placeholder = '',
                                labelClassName = "block text-sm/6 font-medium text-slate-900"
                            }: MultiSelectProps) => {
    const [searchTerm, setSearchTerm] = useState("")

    const removeItem = (itemToRemove: { value: string }) => {
        onChange(selected.filter(item => item.value !== itemToRemove.value))
    }

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm])

    return (
        <Listbox value={selected} onChange={onChange} multiple>
            <div className={className}>
                <label htmlFor={label} className={labelClassName}>{label}</label>
                <div className="relative mt-1">
                    <ListboxButton
                        className="flex min-h-[38px] max-h-[60px] overflow-y-auto w-full cursor-default flex-wrap items-start content-start gap-1 rounded-md bg-white py-1.5 pr-8 pl-3 text-left text-slate-900 outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                    >
                        {selected.length > 0 ? (
                            selected.map((option) => (
                                <span
                                    key={option.value}
                                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs"
                                >
                                    {option.label}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(option);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                removeItem(option);
                                            }
                                        }}
                                        className="text-slate-500 hover:text-slate-700 focus:outline-none"
                                    >
                                        <XMarkIcon className="h-3 w-3"/>
                                    </span>
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-400">{placeholder || 'Seleziona opzioni'}</span>
                        )}
                    </ListboxButton>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-2.5 size-5 text-slate-500 sm:size-4"
                    />

                    <ListboxOptions
                        transition
                        className="absolute z-[9999] mt-1 max-h-40 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                        <div className="sticky z-10 top-0 bg-white px-3 py-2">
                            <input
                                type="text"
                                placeholder={placeholder}
                                aria-label={ariaLabel}
                                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((person) => (
                                <ListboxOption
                                    key={person.value}
                                    value={person}
                                    className="group relative cursor-default py-2 pr-4 pl-8 text-slate-900 select-none data-focus:bg-primary-500 data-focus:text-white data-focus:outline-hidden"
                                >
                  <span className="block truncate font-normal group-data-selected:font-semibold">
                    {person.label}
                  </span>
                                    <span
                                        className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary-600 group-data-focus:text-white">
                    {selected.some(p => p.value === person.value) && (
                        <CheckIcon aria-hidden="true" className="size-5"/>
                    )}
                  </span>
                                </ListboxOption>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-slate-500">
                                Nessun risultato trovato
                            </div>
                        )}
                    </ListboxOptions>
                </div>
            </div>
        </Listbox>
    );
}
