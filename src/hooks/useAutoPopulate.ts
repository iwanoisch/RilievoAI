// hooks/useAutoPopulate.ts

// export interface CompanyData {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     code_vat: string;
//     code_tax: string;
//     first_name: string;
//     last_name: string;
//     addr_street: string;
//     addr_zip: string;
//     addr_city: string;
//     addr_province: string;
//     addr_country: string;
// }
//
// export interface UserData {
//     id: number;
//     email: string;
//     first_name: string;
//     last_name: string;
//     // ... altri campi utente
// }

import {Company} from "../types/shared.type.ts";
import {User} from "../features/auth/slice/auth.type.ts";

export const useAutoPopulate = () => {
    const getCompanyData = (): Company | null => {
        try {
            const companyData = localStorage.getItem('auth_user_company');
            return companyData ? JSON.parse(companyData) : null;
        } catch {
            return null;
        }
    };

    const getUserData = (): User | null => {
        try {
            const userData = localStorage.getItem('auth_user');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    };

    // Mappatura tra i field name dello schema e i campi dell'azienda/utente
    const getFieldMapping = (): Record<string, string> => ({
        // Dati Azienda
        'DG_RAGSOC': 'name',
        'DG_INDIRIZ': 'addr_street',
        'DG_CAP': 'addr_zip',
        'DG_CITTA': 'addr_city',
        'DG_PROV': 'addr_province',
        'DG_TELEFON': 'phone',
        'DG_EMAIL': 'email',
        'DG_PARTIVA': 'code_vat',

        // Firmatario (dati utente)
        'IMP_02': 'user_fullname',
        'DICHIAR_01': 'user_fullname',

        // Dati specifici company
        'DG_CODFISC': 'code_tax',
    });

    const getAutoPopulatedData = (): Record<string, string> => {
        const companyData = getCompanyData();
        const userData = getUserData();
        const mapping = getFieldMapping();
        const autoData: Record<string, string> = {};

        if (companyData) {
            Object.entries(mapping).forEach(([fieldName, dataKey]) => {
                if (dataKey in companyData) {
                    autoData[fieldName] = companyData[dataKey as keyof Company] as string;
                }
            });
        }

        // Gestione campi derivati
        if (userData && companyData) {
            // Nome completo utente
            const userFullName = `${userData.first_name} ${userData.last_name}`.trim();
            autoData['IMP_02'] = userFullName;
            autoData['DICHIAR_01'] = userFullName;

            // Indirizzo completo
            if (!autoData['DG_INDIRIZ'] && companyData.addr_street) {
                autoData['DG_INDIRIZ'] = companyData.addr_street;
            }
        }

        // Data corrente
        autoData['DG_DATA'] = new Date().toLocaleDateString('it-IT');

        return autoData;
    };

    return {
        getAutoPopulatedData,
        getCompanyData,
        getUserData
    };
};
