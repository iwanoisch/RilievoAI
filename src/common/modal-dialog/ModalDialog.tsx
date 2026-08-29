import {FC, useState} from 'react'
import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'
import {ModalDialogOptions} from "./ModalDialog.type.ts";
import { motion } from 'framer-motion';
import {modalDialog} from "../../utility/modal-dialog-util.ts";

export const ModalDialog : FC<ModalDialogOptions & { onClose: () => void }> = ({
                                                                                   type,
                                                                                   title,
                                                                                   message,
                                                                                   links,
                                                                                   focusBlocked= false,
                                                                               }) => {
    const [open, setOpen] = useState(true)
    const config = modalDialog[type];
    const Icon = config.icon;
    return (
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, x: 20}}
                transition={{duration: 0.3}}

            >
                <Dialog open={open}  onClose={(value) => {
                    if (!focusBlocked) {
                        setOpen(value);
                    }
                }} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-slate-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10">
                                        <Icon aria-hidden="true" className={`${config.iconColor}`}/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h2" className="text-base font-semibold text-slate-900">
                                            {title}
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500 font-semibold">
                                                {message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {links && links.length > 0 && (
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        {links.map((link, index) => (
                                            <Button
                                                key={index}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    link.onClick();
                                                }}
                                                className={`${config.buttonClasses[link.variant || 'single']}`}
                                            >
                                                {link.text}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
         </motion.div>
    )
}
