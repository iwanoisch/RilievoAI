import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const SubMenuBar = () => {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-8xl ">
                {/* Prima riga - Menu principale */}
                <div className="bg-sky-500 text-white border-b-1 border-sky-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-3 text-sm font-medium">
                    <div className="flex flex-wrap gap-4">
                        <a href="#" className="hover:text-sky-950">HOME</a>
                        <a href="#" className="hover:text-sky-950">BACHECA LAVORO</a>
                        <a href="#" className="hover:text-sky-950">MYB PER TE</a>
                        <a href="#" className="hover:text-sky-950">PROJECT MANAGEMENT</a>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <a href="#" className="hover:text-sky-950">INFORMATIVE</a>

                        {/* Campo di ricerca - ora si espande su mobile */}
                        <div className="relative w-full sm:w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="CERCA IN..."
                                className="block w-full rounded-md py-1 pl-8 pr-3 text-sm bg-slate-50 border border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Seconda riga - Sottomenu */}
                <div className="  flex flex-wrap gap-4 px-6 py-3 text-sm font-medium bg-sky-500 text-white">
                    <a href="#" className="font-semibold text-sky-950">PANNELLO DI CONTROLLO</a>
                    <a href="#" className="hover:text-slate-900">ATTIVITÀ</a>
                    <a href="#" className="hover:text-slate-900">CALENDARIO</a>
                    <a href="#" className="hover:text-slate-900">PROGETTI</a>
                </div>
            </div>
        </div>
    );
};

export default SubMenuBar;
