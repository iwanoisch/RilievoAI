import {useTranslation} from "react-i18next";
import {CalendarIcon, CubeIcon, ChartBarIcon} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const HomePage = () => {
    const { t } = useTranslation();


    return <>
        <section className="relative isolate">

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
            <div className="mx-auto max-w-2xl py-12 sm:px-12 px-6 lg:px-8">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div
                        className="relative rounded-full px-3 py-1 text-sm/6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
                        {t('hero_section.new_version')}{' '}
                        <a href="#" className="font-semibold text-primary-600">
                            <span aria-hidden="true" className="absolute inset-0"/>
                            {t('hero_section.learn_more')} <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
                <header className="text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-balance text-slate-900 sm:text-7xl">
                        {t('hero_section.title')}
                    </h1>
                    <p className="mt-8 text-lg font-medium text-pretty text-slate-600 sm:text-xl/8">
                        {t('hero_section.explanation')}
                    </p>
                    <nav className="mt-10 flex items-center justify-center gap-x-6" aria-label="Azioni principali">
                        <Link
                            to="/login"
                            className="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                        >
                            {t('hero_section.cta_login')}
                        </Link>


                        <a href="#features" className="text-sm/6 font-semibold text-slate-900">
                            {t('hero_section.cta_features')} <span aria-hidden="true">→</span>
                        </a>
                    </nav>
                </header>
            </div>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#F28F16] to-[#fbbf24] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
            </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 id="features-heading" className="text-base font-semibold leading-7 text-primary-600">{t('hero_section.efficiency')}</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {t('hero_section.explanation-2')}
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        {t('hero_section.features_subtitle')}
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {[
                            {
                                name: t('hero_section.feature_planning'),
                                description: t('hero_section.feature_planning_desc'),
                                icon: CalendarIcon,
                            },
                            {
                                name: t('hero_section.feature_materials'),
                                description: t('hero_section.feature_materials_desc'),
                                icon: CubeIcon,
                            },
                            {
                                name: t('hero_section.feature_reports'),
                                description: t('hero_section.feature_reports_desc'),
                                icon: ChartBarIcon,
                            },
                        ].map((feature) => (
                            <article key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                    <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true"/>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </article>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    </>
}
