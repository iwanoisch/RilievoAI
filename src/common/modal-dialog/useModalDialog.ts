import {useContext} from "react";
import {ModalDialogContext} from "./ModalDialogContext.ts";

export const useModalDialog = () =>{
    return useContext(ModalDialogContext)
}