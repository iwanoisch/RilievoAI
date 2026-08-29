import {Link} from "react-router-dom";
import {ChevronRightIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import {BreadcrumbsProps} from "./Breadcrumbs.type.ts";

export const Breadcrumbs = ({items}: BreadcrumbsProps) => {
    return (
        <nav className="flex mb-10" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        to="/"
                        className="text-slate-400 hover:text-primary-600 transition-colors"
                    >
                        <Squares2X2Icon className="h-5 w-5"/>
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRightIcon className="h-4 w-4 text-slate-400 mx-1"/>
                        {item.href ? (
                            <Link
                                to={item.href}
                                className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-sm text-slate-700 font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
