// components/SimpleCardSkeleton/SimpleCardSkeleton.tsx
import React from 'react';
import { SimpleCardSkeletonProps } from './simpleCardSkeleton.type';

export const SimpleCardSkeleton: React.FC<SimpleCardSkeletonProps> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="block rounded-lg bg-white shadow-lg relative">
                    {/* Header - Replica esatta della card originale */}
                    <div className="border-b-2 border-slate-200 px-6 py-4 bg-slate-100 rounded-t-lg">
                        <div>
                            {/* Title skeleton */}
                            <div className="h-4 bg-slate-300 rounded w-2/3 mb-2 animate-pulse"></div>

                            {/* Subtitle skeleton - Nessun subtitle nella tua card, quindi vuoto */}
                            {/*<div className="h-3 bg-slate-300 rounded w-1/2 animate-pulse"></div>*/}
                        </div>
                    </div>

                    {/* Menu button skeleton - Posizione assoluta come l'originale */}
                    <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-slate-300 rounded-full animate-pulse"></div>
                    </div>

                    {/* Description skeleton - line-clamp-5 come l'originale */}
                    <div className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="h-2 bg-slate-300 rounded w-full animate-pulse"></div>
                            <div className="h-2 bg-slate-300 rounded w-11/12 animate-pulse"></div>
                            <div className="h-2 bg-slate-300 rounded w-10/12 animate-pulse"></div>
                            <div className="h-2 bg-slate-300 rounded w-9/12 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
