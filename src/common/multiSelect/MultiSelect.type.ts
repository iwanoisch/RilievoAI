export interface DataListType {
    value: string;
    label: string;
    area?: string;
    pre?: string;
}

export interface MultiSelectProps {
    label: string
    options: DataListType[]
    selected: DataListType[]
    onChange: (selected: DataListType[]) => void
    ariaLabel: string
    placeholder?: string
    className?: string
    labelClassName?: string
}

export type MultiOption = {
    id: number
    name: string
}
