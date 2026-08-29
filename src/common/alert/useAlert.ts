import {useContext} from "react";
import {AlertContext} from "./AlertContext.ts";


export const useAlert = () => {
    return useContext(AlertContext);
};
