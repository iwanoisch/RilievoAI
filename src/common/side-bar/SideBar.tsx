import {useState, Fragment, useEffect} from 'react';
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {NavLink, useNavigate} from 'react-router-dom';
import {subMenuItems, userMenuItems, UserRole} from '../../utility/menu-items-utils';
import {useAuth} from '../../features/auth/hooks/useAuth';
import LanguageSelector from '../language-selector/LanguageSelector';
import Avatar from '../avatar/Avatar';
import {useTranslation} from "react-i18next";

type SideBarProps = {
    showFullSidebar?: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
};

export const SideBar = ({showFullSidebar = true, isCollapsed, onToggle}: SideBarProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [userRole, setUserRole] = useState<UserRole | undefined>();

    useEffect(() => {
        if (user) setUserRole(user.role);
    }, [user]);

    const mobileLinkClass = (isActive: boolean) =>
        isActive
            ? 'block border-l-4 border-primary-600 bg-primary-50 py-2 pl-3 pr-4 text-base font-medium text-primary-700'
            : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800';

    const sidebarLinkClass = (isActive: boolean) =>
        isActive
            ? 'bg-primary-50 text-primary-600 group flex rounded-md text-sm font-semibold'
            : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600 group flex rounded-md text-sm font-semibold';

    return (
        <>
            {/* MOBILE + DESKTOP sidebar SOLO se showFullSidebar */}
            {showFullSidebar && (
                <>
                    {/* MOBILE: sidebar in Dialog */}
                    <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                        <DialogBackdrop className="fixed inset-0 bg-slate-900/80"/>

                        <div className="fixed inset-0 flex">
                            <DialogPanel className="relative flex w-full max-w-xs flex-1">
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-6">
                                    {/* Header con logo e chiudi */}
                                    <div className="flex h-16 items-center justify-between">
                                        <img
                                            alt="Logo"
                                            src="/images/logo_name.png"
                                            className="h-8 w-auto"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setSidebarOpen(false)}
                                            className="flex items-center gap-x-1 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            <span className="text-sm font-medium">Chiudi</span>
                                            <XMarkIcon className="size-5"/>
                                        </button>
                                    </div>

                                    {/* MOBILE MENU ITEMS */}
                                    <nav className="flex flex-1 flex-col">
                                        {user && (
                                            <div className="mt-2 space-y-1">
                                                {subMenuItems.map((item) => (
                                                    <NavLink
                                                        key={item.id}
                                                        to={item.href}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={({isActive}) =>
                                                            `flex items-center gap-x-3 ${mobileLinkClass(isActive)}`
                                                        }
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="size-5 shrink-0" aria-hidden="true"/>
                                                        )}
                                                        {t(`sidebar.` + item.id)}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}

                                        {/* Footer versione */}
                                        <div className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-400">
                                            <p className="font-medium text-slate-500">Boilerplate</p>
                                            <p>Versione {__APP_VERSION__}</p>
                                        </div>
                                    </nav>
                                </div>
                            </DialogPanel>
                        </div>
                    </Dialog>

                    {/* DESKTOP: sidebar fissa con collapse */}
                    <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
                        {/* Toggle button */}
                        <button
                            type="button"
                            onClick={onToggle}
                            className="absolute -right-3 top-40 z-10 flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-600"
                            aria-label={isCollapsed ? "Espandi sidebar" : "Riduci sidebar"}
                        >
                            {isCollapsed ? (
                                <ChevronRightIcon className="size-4"/>
                            ) : (
                                <ChevronLeftIcon className="size-4"/>
                            )}
                        </button>

                        <div className={`relative flex grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden border-r border-slate-200 bg-white px-3 transition-[padding] duration-300 ease-out ${isCollapsed ? '' : 'lg:px-6'}`}>
                            {/* Logo */}
                            <div
                                onClick={() => navigate('/dashboard')}
                                className="relative flex h-16 shrink-0 items-center justify-center border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-all duration-300 ease-out"
                            >
                                <img
                                    alt="Logo shield"
                                    src="/images/logo.png"
                                    className={`h-8 transition-all duration-300 ease-out ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-75 absolute'}`}
                                />
                                <img
                                    alt="Logo"
                                    src="/images/logo_name.png"
                                    className={`h-8 transition-all duration-300 ease-out ${isCollapsed ? 'opacity-0 scale-75 absolute' : 'opacity-100 scale-100'}`}
                                />
                            </div>

                            {/* Header Menu */}
                            <div className={`border-b border-slate-100 px-6 overflow-hidden transition-all duration-300 ease-out ${
                                isCollapsed ? 'opacity-0 max-h-0 py-0' : 'opacity-100 max-h-16 py-4'
                            }`}
                            >
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                                    {t('sidebar.menuManagement')}
                                </h2>
                            </div>

                            <nav className="flex flex-1 flex-col">
                                {user && (
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="space-y-1">
                                                {subMenuItems.map((item) => (
                                                    <li key={item.id}>
                                                        <NavLink
                                                            to={item.href}
                                                            title={isCollapsed ? item.name : undefined}
                                                            className={({isActive}) =>
                                                                `${sidebarLinkClass(isActive)} items-center transition-all duration-300 ease-out ${
                                                                    isCollapsed ? 'py-2 px-4' : 'p-2'
                                                                }`
                                                            }
                                                        >
                                                            {({isActive}) => (
                                                                <>
                                                                    {item.icon && (
                                                                        <item.icon
                                                                            className={`size-6 shrink-0 ${
                                                                                isActive
                                                                                    ? 'text-primary-600'
                                                                                    : 'text-slate-400 group-hover:text-primary-600'
                                                                            }`}
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                    <span className={`whitespace-nowrap transition-all duration-300 ease-out overflow-hidden ${
                                                                        isCollapsed ? 'opacity-0 max-w-0 ml-0' : 'opacity-100 max-w-48 ml-3'
                                                                    }`}>
                                                                        {t(`sidebar.` + item.id)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        {/* Footer versione */}
                                        <li className="mt-auto pb-4">
                                            <div className="border-1 border-primary-200 rounded-xl bg-primary-50 p-2 text-xs text-primary-400">
                                                <div className={`flex justify-center transition-all duration-300 ease-out overflow-hidden ${
                                                    isCollapsed ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'
                                                }`}>
                                                    <span
                                                        title={`Versione ${__APP_VERSION__}`}
                                                        className="text-[10px] font-bold text-primary-400"
                                                    >
                                                        V{__APP_VERSION__}
                                                    </span>
                                                </div>
                                                <div className={`transition-all duration-300 ease-out overflow-hidden ${
                                                    isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-20'
                                                }`}>
                                                    <p className="font-medium text-primary-500">Boilerplate</p>
                                                    <p>Versione {__APP_VERSION__}</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                )}
                            </nav>
                        </div>
                    </div>
                </>
            )}

            {/* TOPBAR (sempre visibile) */}
            <header
                className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-all duration-300 ease-in-out ${showFullSidebar ? (isCollapsed ? 'lg:pl-20' : 'lg:pl-72') : ''}`}
            >
                <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
                    {/* hamburger SOLO se sidebar completa */}
                    {showFullSidebar && (
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden -m-2.5 p-2.5 text-slate-700"
                        >
                            <Bars3Icon className="size-6"/>
                        </button>
                    )}

                    {/* badge azienda (se user) */}
                    {user && (
                        <div className="flex flex-1 justify-start">
                            <span className="inline-flex items-center rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700">
                                {user.relations?.company?.name || 'Boilerplate'}
                            </span>
                        </div>
                    )}

                    {/* menu profilo o login a destra */}
                    {user ? (
                        <div className="ml-auto flex items-center gap-x-3">
                            <Menu as="div" className="relative">
                                <MenuButton className="flex items-center gap-x-2 rounded-full bg-white text-sm focus:outline-none">
                                    <div className="flex items-center justify-center rounded-full bg-slate-200 text-slate-700 w-10 h-10">
                                        <Avatar name={user?.name || 'Utente'}/>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-xs text-slate-500">{user?.role || 'Ruolo'}</p>
                                        <p className="text-sm font-medium text-slate-900">{user?.first_name || 'Utente'}</p>
                                    </div>
                                </MenuButton>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                        {userMenuItems
                                            .filter(
                                                (item) =>
                                                    !item.role || (userRole !== undefined && item.role.includes(userRole))
                                            )
                                            .map((item) =>
                                                item.action === 'logout' ? (
                                                    <MenuItem
                                                        key={item.id}
                                                        as="button"
                                                        className="group flex w-full items-center gap-x-2 px-4 py-2 text-sm text-slate-700 data-[active]:bg-slate-100"
                                                        onClick={() => {
                                                            logout();
                                                            navigate('/', {replace: true});
                                                        }}
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="size-5 text-slate-400"/>
                                                        )}
                                                        <span>{item.name}</span>
                                                    </MenuItem>
                                                ) : (
                                                    <MenuItem
                                                        key={item.id}
                                                        as={NavLink}
                                                        to={item.href}
                                                        className="group flex items-center gap-x-2 px-4 py-2 text-sm text-slate-700 data-[active]:bg-slate-100"
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="size-5 text-slate-400"/>
                                                        )}
                                                        <span>{item.name}</span>
                                                    </MenuItem>
                                                )
                                            )}

                                        <div className="px-4 py-2">
                                            <LanguageSelector id="language"/>
                                        </div>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="cursor-pointer ml-auto rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500"
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>
        </>
    );

};
