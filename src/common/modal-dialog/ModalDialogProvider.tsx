import React, {FC, useState} from "react";
import {positionClasses} from "../../utility/alert-utils.ts";
import {motion} from "framer-motion";
import ReactDOM from "react-dom";
import {ModalDialogOptions, ModalDialogPosition, ModalDialogProviderProps} from "./ModalDialog.type.ts";
import {ModalDialog} from "./ModalDialog.tsx";
import {ModalDialogContext} from "./ModalDialogContext.ts";

export const ModalDialogProvider: FC<ModalDialogProviderProps> = ({children, position = 'top-right', duration = 5000}) => {
    const [alerts, setAlerts] = useState<Record<string, ModalDialogOptions>>({});

    const showModalDialog = (options: ModalDialogOptions): string => {
        const id = options.id || Math.random().toString(36).substring(2, 9);

        setAlerts((prev) => ({...prev, [id]: options}));

        // Auto-dismiss dopo la durata specificata
        if (options.duration !== 0) { // 0 = no auto-dismiss
            const dismissTime = options.duration || duration;
            setTimeout(() => {
                hideModalDialog(id);
            }, dismissTime);
        }

        return id;
    };

    const hideModalDialog = (id: string) => {
        setAlerts((prev) => {
            const newAlerts = {...prev};
            delete newAlerts[id];
            return newAlerts;
        });
    };

    const hideAllModalsDialog = () => {
        setAlerts({});
    };

    return (
        <ModalDialogContext.Provider value={{showModalDialog: showModalDialog, hideModalDialog: hideModalDialog, hideAllModalsDialog: hideAllModalsDialog}}>
            {children}
            {/* Rimuovi fixed inset-0 e usa portal */}
            {Object.entries(alerts).map(([id, alert]) => (
                <ModalDialogPortal key={id} position={alert.position || position}>
                    <motion.div
                        layout
                        initial={{opacity: 0, y: 20, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, x: 20}}
                        transition={{duration: 0.3}}
                        className="w-96"
                    >
                        <ModalDialog {...alert} onClose={() => hideModalDialog(id)}/>
                    </motion.div>
                </ModalDialogPortal>
            ))}
        </ModalDialogContext.Provider>
    );
};

const ModalDialogPortal = ({children, position}: {children: React.ReactNode, position: ModalDialogPosition}) => {
    return ReactDOM.createPortal(
        <div className={`fixed ${positionClasses[position]} z-[9999]`}>
            {children}
        </div>,
        document.body
    );
};
