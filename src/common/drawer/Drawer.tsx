import {FC} from "react";
import {Props} from "./Drawer.type.ts";
import {Dialog, DialogPanel,} from "@headlessui/react";

export const Drawer: FC<Props> = ({isOpen, onClose, children}) => {

    return(
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <div className="fixed inset-0"/>
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <DialogPanel className="pointer-events-auto w-screen max-w-2xl">
                            {children}
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
