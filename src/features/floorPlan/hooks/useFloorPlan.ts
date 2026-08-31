import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setDocuments, setSelectedDocumentId, setSelectedPageId, setFloorPlanError, resetFloorPlan} from "../slice/floorPlanSlice.ts";
import type {FloorPlanDocument, PhotoMarker} from "../slice/floorPlan.type.ts";

export const useFloorPlan = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.floorPlan);

    // --- Document CRUD ---

    const fetchDocuments = async (_buildingId: string) => {
        try {
            // TODO real api: const response = await get<FloorPlanDocument[]>(`/buildings/${buildingId}/floorplan-documents`);
            return {data: state.documents};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const addDocument = async (doc: FloorPlanDocument) => {
        try {
            // TODO real api: const response = await post<FloorPlanDocument>('/floorplan-documents', doc);
            dispatch(setDocuments([...state.documents, doc]));
            return {data: doc};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const renameDocument = async (documentId: string, name: string) => {
        try {
            // TODO real api: await put(`/floorplan-documents/${documentId}`, { name });
            const updated = state.documents.map(d =>
                d.id === documentId ? {...d, name} : d
            );
            dispatch(setDocuments(updated));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const updateDocument = async (documentId: string, changes: Partial<Pick<FloorPlanDocument, 'name' | 'buildingId'>>) => {
        try {
            // TODO real api: await put(`/floorplan-documents/${documentId}`, changes);
            const updated = state.documents.map(d =>
                d.id === documentId ? {...d, ...changes} : d
            );
            dispatch(setDocuments(updated));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const deleteDocument = async (documentId: string) => {
        try {
            // TODO real api: await del(`/floorplan-documents/${documentId}`);
            const currentList = state.documents;
            const deletedIdx = currentList.findIndex(d => d.id === documentId);
            const updated = currentList.filter(d => d.id !== documentId);
            dispatch(setDocuments(updated));

            if (state.selectedDocumentId === documentId) {
                if (updated.length > 0) {
                    const nextIdx = Math.min(deletedIdx, updated.length - 1);
                    dispatch(setSelectedDocumentId(updated[nextIdx].id));
                } else {
                    dispatch(setSelectedDocumentId(null));
                    dispatch(setSelectedPageId(null));
                }
            }
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const deleteAllDocuments = async () => {
        try {
            // TODO real api: await del('/floorplan-documents/all');
            dispatch(setDocuments([]));
            dispatch(setSelectedDocumentId(null));
            dispatch(setSelectedPageId(null));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    const deleteDocumentsBatch = async (documentIds: string[]) => {
        try {
            // TODO real api: await del('/floorplan-documents/batch', { ids: documentIds });
            const updated = state.documents.filter(d => !documentIds.includes(d.id));
            dispatch(setDocuments(updated));
            if (state.selectedDocumentId && documentIds.includes(state.selectedDocumentId)) {
                dispatch(setSelectedDocumentId(null));
                dispatch(setSelectedPageId(null));
            }
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    // --- Selection ---

    const selectDocument = (documentId: string | null) => {
        dispatch(setSelectedDocumentId(documentId));
        if (documentId) {
            const doc = state.documents.find(d => d.id === documentId);
            if (doc && doc.pages.length > 0) {
                dispatch(setSelectedPageId(doc.pages[0].id));
            } else {
                dispatch(setSelectedPageId(null));
            }
        } else {
            dispatch(setSelectedPageId(null));
        }
    };

    const selectPage = (pageId: string | null) => {
        dispatch(setSelectedPageId(pageId));
    };

    // --- Page operations ---

    const deletePage = async (documentId: string, pageId: string) => {
        try {
            // TODO real api: await del(`/floorplan-documents/${documentId}/pages/${pageId}`);
            const doc = state.documents.find(d => d.id === documentId);
            if (!doc) return null;

            const deletedIdx = doc.pages.findIndex(p => p.id === pageId);
            const updatedPages = doc.pages.filter(p => p.id !== pageId);

            if (updatedPages.length === 0) {
                return deleteDocument(documentId);
            }

            const updated = state.documents.map(d =>
                d.id === documentId ? {...d, pages: updatedPages} : d
            );
            dispatch(setDocuments(updated));

            if (state.selectedPageId === pageId) {
                const nextIdx = Math.min(deletedIdx, updatedPages.length - 1);
                dispatch(setSelectedPageId(updatedPages[nextIdx].id));
            }
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setFloorPlanError(message));
            return null;
        }
    };

    // --- Marker operations ---

    const addMarker = (pageId: string, marker: PhotoMarker) => {
        const updated = state.documents.map(doc => ({
            ...doc,
            pages: doc.pages.map(page => {
                if (page.id !== pageId) return page;
                const markerIdx = page.photoMarkers.findIndex(m => m.photoId === marker.photoId);
                const updatedMarkers = [...page.photoMarkers];
                if (markerIdx !== -1) {
                    updatedMarkers[markerIdx] = marker;
                } else {
                    updatedMarkers.push(marker);
                }
                return {...page, photoMarkers: updatedMarkers};
            }),
        }));
        dispatch(setDocuments(updated));
    };

    const deleteMarker = (pageId: string, photoId: string) => {
        const updated = state.documents.map(doc => ({
            ...doc,
            pages: doc.pages.map(page => {
                if (page.id !== pageId) return page;
                return {...page, photoMarkers: page.photoMarkers.filter(m => m.photoId !== photoId)};
            }),
        }));
        dispatch(setDocuments(updated));
    };

    // --- Derived data ---

    const selectedDocument = state.selectedDocumentId
        ? state.documents.find(d => d.id === state.selectedDocumentId) ?? null
        : null;

    const selectedPage = selectedDocument && state.selectedPageId
        ? selectedDocument.pages.find(p => p.id === state.selectedPageId) ?? null
        : null;

    const getDocumentsByBuildingId = (buildingId: string): FloorPlanDocument[] => {
        return state.documents.filter(d => d.buildingId === buildingId);
    };

    const reset = () => {
        dispatch(resetFloorPlan());
    };

    return {
        ...state,
        selectedDocument,
        selectedPage,
        fetchDocuments,
        addDocument,
        renameDocument,
        updateDocument,
        deleteDocument,
        deleteAllDocuments,
        deleteDocumentsBatch,
        selectDocument,
        selectPage,
        deletePage,
        addMarker,
        deleteMarker,
        getDocumentsByBuildingId,
        reset,
    };
};
