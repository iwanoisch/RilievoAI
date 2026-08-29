import {useEffect, useState} from "react";
import {IPagination} from "../types/shared.type.ts";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationApiRaw<T> {
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
    data: T[];
}

export function mapPagination<T>(apiResponse: PaginationApiRaw<T>): IPagination {
    return {
        current_page: apiResponse.current_page,
        first_page_url: apiResponse.first_page_url,
        from: apiResponse.from ?? 0,
        last_page: apiResponse.last_page,
        last_page_url: apiResponse.last_page_url,
        links: apiResponse.links.map((link: PaginationLink) => ({
            url: link.url,
            label: link.label,
            active: link.active,
        })),
        next_page_url: apiResponse.next_page_url,
        path: apiResponse.path,
        per_page: apiResponse.per_page,
        prev_page_url: apiResponse.prev_page_url,
        to: apiResponse.to ?? 0,
        total: apiResponse.total,
    };
}

export function getWindowDimensions() {
    const { innerWidth: width} = window;
    return width > 505;
}

export function useIsMobileView() {
    const [isMobileView, setIsMobileView] = useState<boolean>(getWindowDimensions());

    useEffect(() => {
        const handleResize = () => setIsMobileView(getWindowDimensions());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobileView;
}
