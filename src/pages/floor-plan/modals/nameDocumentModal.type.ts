export interface NameDocumentModalProps {
    defaultName: string;
    defaultBuildingId?: string;
    onConfirm: (name: string, buildingId: string | null) => void;
    onClose: () => void;
}
