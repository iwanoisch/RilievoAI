import './i18n';
import * as ReactDOM from 'react-dom/client';
import AppRouting from "./AppRouting.tsx";
import {persistor, store} from "./store/store.ts";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {Spinner} from "./common/spinner/Spinner.tsx";
import {ModalDialogProvider} from "./common/modal-dialog/ModalDialogProvider.tsx";
import {AlertProvider} from "./common/alert/AlertProvider.tsx";
import {ThemeProvider} from "./common/theme-selector/ThemeContext.tsx";
import {LanguageProvider} from "./common/language-selector/LanguageContext.tsx";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const loadSpinner = (
    <div className="flex h-screen items-center justify-center">
        <Spinner size="xl"/>
    </div>
);

root.render(
    <Provider store={store}>
        <PersistGate loading={loadSpinner} persistor={persistor}>
            <ThemeProvider>
                <LanguageProvider>
                    <AlertProvider>
                        <ModalDialogProvider>
                            <AppRouting/>
                        </ModalDialogProvider>
                    </AlertProvider>
                </LanguageProvider>
            </ThemeProvider>
        </PersistGate>
    </Provider>
);
