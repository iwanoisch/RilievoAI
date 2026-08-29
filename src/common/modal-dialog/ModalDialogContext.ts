import {createContext} from "react";
import {ModalDialogContextProps} from "./ModalDialog.type.ts";

export const ModalDialogContext = createContext<ModalDialogContextProps>({
    showModalDialog: () => '',
    hideModalDialog: () => {},
    hideAllModalsDialog: () => {},
});
