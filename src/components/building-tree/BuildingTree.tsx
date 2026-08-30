import {FC, useState, useCallback} from "react";
import {useBuilding} from "../../features/building/hooks/useBuilding.ts";
import {useTranslation} from "react-i18next";
import {ChevronRightIcon, CubeIcon, BuildingOffice2Icon} from "@heroicons/react/24/outline";
import type {BuildingTreeProps, BuildingTreeNodeProps} from "./buildingTree.type.ts";
import {BUILDING_ELEMENT_ICONS} from "../../constants/building-element-icons.constant.ts";

const BuildingTreeNode: FC<BuildingTreeNodeProps> = ({elementId, depth, onSelectElement, selectedElementId}) => {
    const {t} = useTranslation();
    const {elements, getChildren} = useBuilding();
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const element = elements[elementId];
    const children = element ? getChildren(elementId) : [];
    const hasChildren = children.length > 0;
    const isSelected = selectedElementId === elementId;
    const Icon = element ? (BUILDING_ELEMENT_ICONS[element.type] || CubeIcon) : CubeIcon;

    const handleToggle = useCallback(() => {
        if (hasChildren) setIsExpanded(prev => !prev);
    }, [hasChildren]);

    const handleSelect = useCallback(() => {
        if (element) onSelectElement(element);
    }, [element, onSelectElement]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleSelect();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (hasChildren && !isExpanded) setIsExpanded(true);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (isExpanded) setIsExpanded(false);
                break;
        }
    }, [handleSelect, hasChildren, isExpanded]);

    if (!element) return null;

    return (
        <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors min-h-[44px]
                    ${isSelected
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-surface-hover border border-transparent'
                }`}
                style={{paddingLeft: `${depth * 16 + 12}px`}}
                onClick={handleSelect}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label={`${t('building.' + element.type)} - ${element.label}`}
            >
                {/* Chevron expand */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform
                        ${hasChildren ? 'text-slate-500' : 'invisible'}`}
                    aria-hidden="true"
                    tabIndex={-1}
                >
                    <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}/>
                </button>

                {/* Icona tipo */}
                <Icon className={`h-5 w-5 flex-shrink-0 ${element.type === 'defect' ? 'text-error' : 'text-primary-500'}`}/>

                {/* Label */}
                <span className="text-sm text-text-primary truncate flex-1">{element.label}</span>

                {/* Badge tipo */}
                <span className="badge badge-primary text-xs hidden sm:inline-flex">
                    {t('building.' + element.type)}
                </span>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <ul role="group" className="list-none">
                    {children.map(child => (
                        <BuildingTreeNode
                            key={child.id}
                            elementId={child.id}
                            depth={depth + 1}
                            onSelectElement={onSelectElement}
                            selectedElementId={selectedElementId}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export const BuildingTree: FC<BuildingTreeProps> = ({onSelectElement, selectedElementId}) => {
    const {t} = useTranslation();
    const {elements, rootBuildingId} = useBuilding();

    const rootElements = rootBuildingId
        ? [rootBuildingId]
        : Object.values(elements).filter(el => el.parentId === null).map(el => el.id);

    if (rootElements.length === 0) {
        return (
            <div className="py-8 text-center">
                <BuildingOffice2Icon className="h-12 w-12 text-slate-400 mx-auto mb-3"/>
                <p className="text-sm text-text-muted">{t('building.no_elements')}</p>
                <p className="text-sm text-text-muted mt-1">{t('building.add_first_element')}</p>
            </div>
        );
    }

    return (
        <ul role="tree" aria-label={t('building.tree_label')} className="list-none">
            {rootElements.map(id => (
                <BuildingTreeNode
                    key={id}
                    elementId={id}
                    depth={0}
                    onSelectElement={onSelectElement}
                    selectedElementId={selectedElementId}
                />
            ))}
        </ul>
    );
};
