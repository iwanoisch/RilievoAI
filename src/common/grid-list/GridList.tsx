import {GridListProps} from "./GridList.type.ts";
import {Pagination} from "../pagination/Pagination.tsx";


export const GridList = <T, >({data, gridlist, pagination, setDisplayedData, classNamePagination}: GridListProps<T>) => {
    return (
        <>
            <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((data) => (
                    <li key={gridlist.key + crypto.randomUUID()} className="col-span-1 divide-y divide-slate-200 rounded-xl bg-white shadow-sm border border-slate-200/60">
                        {gridlist.render(data)}
                    </li>
                ))}
            </ul>
            {pagination && (
                <Pagination pagination={pagination} displayedData={setDisplayedData} classNameDiv={classNamePagination}/>
            )}
        </>
    )
}
