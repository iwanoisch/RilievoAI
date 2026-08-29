import { SimpleTableProps } from "./simpleTable.type.ts";

export const SimpleTable = <T,>({
                                     data,
                                     columns,
                                     emptyMessage = 'Nessun dato disponibile',
                                     headerClassName = 'bg-slate-50',
                                     rowClassName = 'hover:bg-slate-50',
                                 }: SimpleTableProps<T>) => {
    return (
        <>

            {/* Container principale */}
            <div className="bg-white shadow-sm rounded-lg border border-slate-200">
                {/* Versione mobile - scroll orizzontale con barra verticale sempre visibile */}
                <div className="md:hidden flex flex-col" style={{ maxHeight: '500px' }}>
                    <div className="overflow-y-auto flex-1"> {/* Scroll verticale */}
                        <div className="overflow-x-auto pb-4"> {/* Scroll orizzontale con padding per la scrollbar */}
                            <div className="min-w-max"> {/* Forza la larghezza minima */}
                                {/* Intestazioni colonne */}
                                <div className={`grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 ${headerClassName}`}>
                                    {columns.map((column) => (
                                        <div
                                            key={`header-${column.key}`}
                                            className={`${column.width} ${column.headerClassName || ''}`}
                                        >
                                            {column.header}
                                        </div>
                                    ))}
                                </div>

                                {/* Corpo tabella */}
                                <div className="divide-y divide-slate-200">
                                    {data.length === 0 ? (
                                        <div className="p-6 text-center text-slate-500 min-w-full center">
                                            {emptyMessage}
                                        </div>
                                    ) : (
                                        data.map((item, index) => (
                                            <div
                                                key={`row-${index}`}
                                                className={`grid grid-cols-12 ${rowClassName}`}
                                            >
                                                {columns.map((column) => (
                                                    <div
                                                        key={`cell-${column.key}-${index}`}
                                                        className={`px-6 py-4 ${column.width} ${column.cellClassName || ''}`}
                                                    >
                                                        {column.render(item)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Versione desktop (originale) */}
                <div className="hidden md:block">
                    <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                        {/* Intestazioni colonne */}
                        <div className={`grid grid-cols-12 px-0 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 ${headerClassName}`}>
                            {columns.map((column) => (
                                <div
                                    key={`header-${column.key}`}
                                    className={`px-6 ${column.width} ${column.headerClassName || ''}`}
                                >
                                    {column.header}
                                </div>
                            ))}
                        </div>

                        {/* Corpo tabella */}
                        <div className="divide-y divide-slate-200 max-h-81 overflow-y-auto">
                            {data.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">
                                    {emptyMessage}
                                </div>
                            ) : (
                                data.map((item, index) => (
                                    <div
                                        key={`row-${index}`}
                                        className={`grid grid-cols-12 ${rowClassName}`}
                                    >
                                        {columns.map((column) => (
                                            <div
                                                key={`cell-${column.key}-${index}`}
                                                className={`px-6 py-4 ${column.width} ${column.cellClassName || ''}`}
                                            >
                                                {column.render(item)}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
