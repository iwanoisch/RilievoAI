import * as React from "react";

type ModalBodyProps = {
    children: React.ReactNode;
    className?: string;
};

export const ModalBody = ({
    children,
    className = "p-6",
}: ModalBodyProps) => {
    // Se className contiene overflow-visible, non aggiungere overflow-y-auto
    const hasOverflowVisible = className.includes('overflow-visible');
    const overflowClass = hasOverflowVisible ? '' : 'overflow-y-auto';

    return (
        <div className={`flex-1 min-h-0 ${overflowClass} ${className}`}>
            {children}
        </div>
    );
};