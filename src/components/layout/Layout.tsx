import {LayoutPagePros} from "./layout.type.ts"
import {useAuth} from "../../features/auth/hooks/useAuth.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState, useCallback} from "react";
import {Spinner} from "../../common/spinner/Spinner.tsx";
import {SideBar} from "../../common/side-bar/SideBar.tsx";
import {SIDEBAR_STORAGE_KEY} from "../../utility/constants.ts";

export const Layout = ({children}: LayoutPagePros) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        return stored === "true";
    });

    const toggleSidebar = useCallback(() => {
        setIsCollapsed(prev => {
            const newValue = !prev;
            localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newValue));
            return newValue;
        });
    }, []);

    const {isAuthenticated, checkAuth, isLoading} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const publicPaths = ['/login'];
    const excludePath = ['/login'];

    useEffect(() => {
        const verifyAuth = async () => {
            // CASO 1: landing "/"
            if (location.pathname === "/") {
                if (isAuthenticated) {
                    navigate("/buildings", {replace: true});
                }
                return;
            }

            // CASO 2: route pubbliche
            if (publicPaths.includes(location.pathname)) {
                return;
            }

            // CASO 3: route private
            if (!isAuthenticated) {
                const isAuth = await checkAuth();
                if (!isAuth) {
                    navigate("/", {replace: true});
                }
            }
        };

        void verifyAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, isAuthenticated, checkAuth, navigate]);

    if (excludePath.includes(location.pathname)) return <div>{children}</div>;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="xl"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SideBar showFullSidebar={isAuthenticated} isCollapsed={isCollapsed} onToggle={toggleSidebar}/>
            <main className={`min-h-screen transition-all duration-300 ease-in-out ${isAuthenticated ? (isCollapsed ? 'lg:pl-20' : 'lg:pl-72') : ''}`}>
                {children}
            </main>
        </div>
    );
}
