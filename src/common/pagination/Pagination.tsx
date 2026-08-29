import {IPagination} from "../../types/shared.type.ts";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/16/solid";
import {useEffect, useMemo, useState} from "react";
import {useApiClient} from "../../hooks/useApiClient.ts";
import {useAlert} from "../alert/useAlert.ts";

type Props = {
    pagination: IPagination;
    onPageChange?: (link: string) => void;
    displayedData?: (data : []) => void ;
    projectId?: string;
    relations?: string;
    classNameDiv?: string;
}
export const Pagination = ({pagination,displayedData,classNameDiv}: Props ) => {
    const {get} = useApiClient();
    const getPagination = async (url: string) => {
        const parts = url.split('/api');
        const path = parts.length > 1 ? parts[1] : url;
        const response = await get<IPagination & { data: [] }>(path);
        return {data: response};
    };
    const {showAlert} = useAlert();

    const [changedPagination,setChangedPagination] = useState<IPagination>(pagination);

    useEffect(() => {
        setChangedPagination(pagination);
    }, [pagination]);

    const fetchDataByPageUrl = async (url: string) => {
        const risp = await getPagination(url);
        if (risp.data){
            if(displayedData){
            displayedData(risp.data.data ? risp.data.data : []);
            setChangedPagination(risp.data);}
        }
        else{
            showAlert ({
                    type: 'error',
                    message: 'Paginazione fallita',
                    duration: 3000
                });
        }
    }

    const visiblePages = useMemo(() => {
        const last = changedPagination.last_page;
        const current = changedPagination.current_page;
        const delta = 2;
        const pages: (number | 'ellipsis')[] = [];

        const rangeStart = Math.max(2, current - delta);
        const rangeEnd = Math.min(last - 1, current + delta);

        pages.push(1);

        if (rangeStart > 2) {
            pages.push('ellipsis');
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        if (rangeEnd < last - 1) {
            pages.push('ellipsis');
        }

        if (last > 1) {
            pages.push(last);
        }

        return pages;
    }, [changedPagination.last_page, changedPagination.current_page]);

    return (
        //<div className="flex items-center justify-between border-t border-slate-50 bg-slate-50 px-4 py-6 sm:px-6">
        <div className={classNameDiv}>
            <div className="flex flex-1 justify-between sm:hidden">
                <a onClick={() =>  fetchDataByPageUrl(changedPagination.prev_page_url ? changedPagination.prev_page_url : changedPagination.last_page_url) }
                   className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Precedente
                </a>
                <a  onClick={() => fetchDataByPageUrl(changedPagination.next_page_url ? changedPagination.next_page_url : changedPagination.first_page_url) }
                    className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Successivo
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-700">
                        Mostrati da <span className="font-medium">{changedPagination.from}</span> a <span className="font-medium">{changedPagination.to}</span> di
                        <span className="font-medium"> {changedPagination.total}</span> risultati
                    </p>
                </div>
                <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        <a
                            onClick={() =>  fetchDataByPageUrl(changedPagination.prev_page_url ? changedPagination.prev_page_url : changedPagination.last_page_url) }
                            className="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 inset-ring inset-ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon aria-hidden="true" className="size-5"/>
                        </a>
                        {visiblePages.map((item, idx) => {
                            if (item === 'ellipsis') {
                                return (
                                    <span
                                        key={`ellipsis-${idx}`}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-500 ring-1 ring-slate-300"
                                    >
                                        &hellip;
                                    </span>
                                );
                            }
                            const page = item;
                            return (
                                <a
                                    key={page}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        fetchDataByPageUrl(changedPagination.first_page_url.slice(0,-1) + page);
                                    }}
                                    className={`cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        changedPagination.current_page === page
                                            ? 'bg-primary-500 text-white'
                                            : 'text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </a>
                            );
                        })}
                        <a
                            onClick={() => fetchDataByPageUrl(changedPagination.next_page_url ? changedPagination.next_page_url : changedPagination.first_page_url) }
                            className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 inset-ring inset-ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon aria-hidden="true" className="size-5"/>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}