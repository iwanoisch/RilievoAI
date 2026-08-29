import {persistor, useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {loginFailure, loginStart, loginSuccess, logout} from "../slice/authSlice.ts";
import storage from "redux-persist/lib/storage";
import {useAlert} from "../../../common/alert/useAlert.ts";
import {User} from "../slice/auth.type.ts";
import {useTheme} from "../../../common/theme-selector/useTheme";
import {useLanguage} from "../../../common/language-selector/useLanguage";
import {MOCK_USER} from "../../../dataMock/MOCK_USER.ts";
import {MOCK_TOKEN} from "../../../dataMock/MOCK_TOKEN.ts";

export const useAuth = () => {
    const {showAlert} = useAlert();
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const {resetTheme, loadUserTheme} = useTheme();
    const {resetLanguage, loadUserLanguage} = useLanguage();

    const login = async (email: string, password: string) => {
        dispatch(loginStart());

        // Simula un breve ritardo di rete
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Login fake: accetta admin/admin
            if (email === 'admin' && password === 'admin') {
                const user = MOCK_USER as User;

                localStorage.setItem('auth_user', JSON.stringify(user));
                dispatch(loginSuccess({user, token: MOCK_TOKEN}));

                loadUserTheme(user.id);
                loadUserLanguage(user.id);

                return {success: true};
            }

            dispatch(loginFailure('Credenziali non valide'));
            return {success: false, error: 'Credenziali non valide. Usa admin/admin'};

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(loginFailure(message));
            return {success: false, error: message};
        }
    }

    const logoutUser = async () => {
        try {
            localStorage.removeItem('auth_user');
            await storage.removeItem('persist:root');
            await persistor.purge();
            await persistor.flush();
            dispatch(logout());

            resetTheme();
            resetLanguage();
        } catch (error) {
            showAlert({
                title: 'Error',
                type: "error",
                message: (error as unknown as { message: string }).message,
            })
        }
    }

    const checkAuth = async () => {
        try {
            const savedUser = localStorage.getItem('auth_user');
            if (!savedUser) return false;

            const token = authState.token;
            if (!token) return false;

            return true;
        } catch (_error) {
            localStorage.removeItem('auth_user');
            await storage.removeItem('persist:root');
            await persistor.purge();
            await persistor.flush();
            return false;
        }
    }

    return {
        ...authState,
        login,
        logout: logoutUser,
        checkAuth
    }
}
