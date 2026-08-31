import {RootState, useAppDispatch} from "./store/store.ts";
import {useSelector} from "react-redux";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {Layout} from "./components/layout/Layout.tsx";
import {start} from "./features/init/slice/initSlice.ts";
import {lazy, Suspense, useEffect, useLayoutEffect} from "react";
import {useTranslation} from "react-i18next";

// Import immediati per le pagine iniziali (critiche per il first load)
import {HomePage} from "./pages/home-page/HomePage.tsx";
import {Login} from "./pages/login/Login.tsx";

// Lazy loading per tutte le altre pagine
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.tsx").then(m => ({default: m.Dashboard})));
const UserProfile = lazy(() => import("./pages/user-profile/UserProfile.tsx").then(m => ({default: m.UserProfile})));
const UserSettings = lazy(() => import("./pages/user-settings/UserSettings.tsx").then(m => ({default: m.UserSettings})));
const NotFound = lazy(() => import("./pages/not-found/NotFound.tsx").then(m => ({default: m.NotFound})));
const SurveyPage = lazy(() => import("./pages/survey/Survey.tsx").then(m => ({default: m.Survey})));
const BuildingPage = lazy(() => import("./pages/building/Building.tsx").then(m => ({default: m.Building})));
const FloorPlan = lazy(() => import("./pages/floor-plan/FloorPlan.tsx").then(m => ({default: m.FloorPlan})));
const FloorPlanDetail = lazy(() => import("./components/floor-plan-detail/FloorPlanDetail.tsx").then(m => ({default: m.FloorPlanDetail})));

// Scroll to top ad ogni cambio route
const ScrollToTop = () => {
    const {pathname} = useLocation();
    useLayoutEffect(() => {
        // Disabilita il ripristino automatico dello scroll del browser
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    }, [pathname]);
    return null;
};

// Componente di loading
const PageLoader = () => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

function AppRouting() {
    // Hook di init
    const init = useSelector((state: RootState) => state.init);
    const dispatch = useAppDispatch();
    const {i18n} = useTranslation();

    useEffect(() => {
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    useEffect(() => {
        dispatch(start(true));
    }, [dispatch, init.start]);

    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Layout>
                <Suspense fallback={<PageLoader/>}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/userprofile" element={<UserProfile/>}/>
                        <Route path="/usersettings" element={<UserSettings/>}/>
                        <Route path="/survey" element={<SurveyPage/>}/>
                        <Route path="/building" element={<BuildingPage/>}/>
                        <Route path="/floor-plan" element={<FloorPlan/>}/>
                        <Route path="/floor-plan/:documentId" element={<FloorPlanDetail/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Suspense>
            </Layout>
        </BrowserRouter>
    )
}

export default AppRouting
