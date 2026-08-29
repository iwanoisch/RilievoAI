import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const NotFound = () => {
    const {t} = useTranslation();

    return (
        <div className="relative isolate min-h-[calc(100vh-4rem)]">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#F28F16] to-[#fbbf24] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>

            <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-primary-600">404</p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-slate-900 sm:text-7xl">
                        {t('not_found.title')}
                    </h1>
                    <p className="mt-6 text-lg font-medium text-pretty text-slate-500 sm:text-xl/8">
                        {t('not_found.description')}
                    </p>
                    <div className="mt-10 flex items-center justify-center">
                        <Link
                            to="/"
                            className="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                        >
                            {t('not_found.go_home')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
