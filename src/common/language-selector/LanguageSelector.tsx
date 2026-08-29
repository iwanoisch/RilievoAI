import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {LanguageSelectorProps} from "./LanguageSelector.type.ts";
import {FC} from "react";
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useLanguage} from './useLanguage';
import {LANGUAGE_OPTIONS} from './language.types';
import type {LanguageType} from './language.types';

const LanguageSelector: FC<LanguageSelectorProps> = ({id}) => {
    const {currentLanguage, setLanguage} = useLanguage();
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as LanguageType, userId);
    };

    return <>
        <div>
            <div className="grid grid-cols-1">
                <select
                    id={id}
                    name="language"
                    value={currentLanguage}
                    onChange={handleChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                    aria-label="Seleziona lingua"
                >
                    {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.flag} {option.name}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-slate-500 sm:size-4"
                />
            </div>
        </div>
    </>

};

export default LanguageSelector;
