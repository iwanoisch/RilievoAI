import {createContext} from "react";
import {AlertContextProps} from "./Alert.type.ts";

export const AlertContext = createContext<AlertContextProps>({
    showAlert: () => '',
    hideAlert: () => {},
    hideAllAlerts: () => {},
});
