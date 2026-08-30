/**
 * Tipi condivisi tra le feature del boilerplate.
 * Estratti da projects.type.ts durante la conversione a boilerplate.
 */

import {ComponentType, SVGProps} from "react";

export interface Address {
    addr_street: string;
    addr_zip: string;
    addr_city: string;
    addr_province: string;
    addr_country: string;
    addr_notes: string;
    coords_lat?: string;
    coords_lng?: string;
}

interface CompanyConfig {
    max_projects: string;
    storage: string;
}

interface CompanyData {
    pec: string;
    config: CompanyConfig;
}

export interface Company extends Address {
    id: string;
    code_vat: string;
    code_tax: string;
    first_name: string;
    last_name: string;
    type: string;
    code_sdi: string;
    code_ateco: string;
    code_ateco_2: string;
    name: string;
    email: string;
    phone: string;
    pec: string;
    picture?: string;
    licensed_from: string;
    licensed_to: string;
    user_ctx: { is_licensed: boolean };
    data?: CompanyData;
    created_at: string;
    updated_at: string;
}

export interface IPagination {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page_url: string;
    last_page: number;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    data?: [];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface GenericPagination<T> {
    pagination: IPagination;
    data: T[]
}

export type MenuIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type UserRole = 'owner' | 'superadmin' | 'user';

export interface MenuItem {
    id: string;
    name: string;
    href: string;
    icon?: MenuIcon;
    role?: UserRole[] | undefined;
    current?: boolean;
    action?: string;
}
