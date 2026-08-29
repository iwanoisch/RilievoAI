import {Token} from "../api/auth.type.ts";
import {Company, Address} from "../../../types/shared.type.ts";
import {UserRole} from "../../../utility/menu-items-utils.ts";

export interface Operational extends Address  {
    id?: string,
    name: string,
    phone: string,
    email: string,
    company_id?: string,
    created_at?: string,
    updated_at?: string,
    nodes?: {
    company: string,
    }

}

export interface User extends Address{
    id: string;
    role: UserRole;
    company_id: string;
    code_tax: string;
    dob:string;
    first_name: string;
    last_name: string;
    phone? : string;
    email: string;
    email_verified_at: string | null;
    created_by?: string;
    created_at: string;
    updated_at: string;
    relations: {company: Company ,creator?:User,attachments : object};
    name: string;
    short_name: string;
    avatar: string;
    picture? : string;
//TODO OLD rimuovi
    username: string
    password: string
    surname: string
    company?: CompanyProperties,
    iva?: string
}

export interface CompanyProperties {
    id: string,
    name?: string,
    country?: string,
    comune?: string,
    address?: string,
    adr_number?: string,
    cap?: string,
    region?: string,
    email?: string,
    pec?: string,
    sdi?: string,
    code_ateco?: string,
    codice_fiscale?: string,
    phone?: string,
    code_client?: string,
    referente?: string,
    address_note?: string,
    note?: string,
    iva?: string,
    type?: string,
}

export interface AuthState {
    isAuthenticated: boolean
    user: Omit<Partial<User>, 'password'> | null // Esclude password
    token: Token | null | string,
    isLoading: boolean
    error: string | null
}


