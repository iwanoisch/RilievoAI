import {FC} from "react";
import {AlertOptions} from "./Alert.type";
import {alertConfig} from "../../utility/alert-utils.ts";
import {motion} from 'framer-motion';
import {Button} from "@headlessui/react";

export const Alert: FC<AlertOptions & { onClose: () => void }> = ({
                                                                      type,
                                                                      title,
                                                                      message,
                                                                      links,
                                                                      onClose,
                                                                  }) => {
    const config = alertConfig[type];
    const Icon = config.icon;


    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, x: 20}}
            transition={{duration: 0.3}}

        >
            <div className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4`}>
                <div className="flex">
                    <div className="shrink-0">
                        <Icon aria-hidden="true" className={`size-5 ${config.iconColor}`}/>
                    </div>
                    <div className="ml-3">
                        {title && <p className={`text-sm font-medium ${config.textColor}`}>{title}</p>}
                        <div className={`text-sm ${config.textColor}`}>
                            {message}
                            {links && links.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {links.map((link, index) => (
                                        <Button
                                            key={index}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                link.onClick();
                                            }}
                                            className={`px-3 py-1 text-sm rounded-md ${config.buttonClasses[link.variant || 'secondary']}`}
                                        >
                                            {link.text}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className={`rounded-md ${config.bgColor} inline-flex ${config.textColor} hover:opacity-80 focus:outline-none`}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
