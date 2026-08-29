import * as React from "react";
import {IPagination} from "../../types/shared.type.ts";


export interface ListDefinition<T>{
    key: string;
    render: (item: T) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    sortable?: boolean; // Nuovo campo per attivare l'ordinamento
    sortKey?: string; // Chiave alternativa per l'ordinamento
}


export interface GridListProps<T>{
     data : T[];
     gridlist: ListDefinition<T>;
     pagination?: IPagination | null,
     setDisplayedData?: (data : []) => void,
     classNamePagination?: string;
 }

