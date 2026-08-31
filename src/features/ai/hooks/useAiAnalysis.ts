import {useAppDispatch, useAppSelector, store} from "../../../store/store.ts";
import {setSuggestions, setIsAnalyzing, setAnalyzingSourceId, setAiError, resetAi} from "../slice/aiSlice.ts";
import {setElement} from "../../building/slice/buildingSlice.ts";
import {setPhotos, setVoiceObservations} from "../../survey/slice/surveySlice.ts";
import {aiService} from "../services/ai-service.ts";
import type {AiPhotoAnalysisRequest, AiVoiceAnalysisRequest} from "../services/ai-service.type.ts";
import type {AiSuggestionWithStatus, SuggestionStatus} from "../slice/ai.type.ts";
import type {BuildingElement} from "../../building/slice/building.type.ts";

export const useAiAnalysis = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.ai);

    const analyzePhoto = async (request: AiPhotoAnalysisRequest) => {
        try {
            dispatch(setIsAnalyzing(true));
            dispatch(setAnalyzingSourceId(request.photoId));
            dispatch(setAiError(null));

            const suggestion = await aiService.analyzePhoto(request);
            const withStatus: AiSuggestionWithStatus = {...suggestion, status: 'pending'};

            const freshSuggestions = store.getState().ai.suggestions;
            dispatch(setSuggestions([...freshSuggestions, withStatus]));
            return {data: withStatus};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore analisi AI';
            dispatch(setAiError(message));
            return null;
        } finally {
            dispatch(setIsAnalyzing(false));
            dispatch(setAnalyzingSourceId(null));
        }
    };

    const analyzeVoice = async (request: AiVoiceAnalysisRequest) => {
        try {
            dispatch(setIsAnalyzing(true));
            dispatch(setAnalyzingSourceId(request.observationId));
            dispatch(setAiError(null));

            const suggestion = await aiService.analyzeVoice(request);
            const withStatus: AiSuggestionWithStatus = {...suggestion, status: 'pending'};

            const freshSuggestions = store.getState().ai.suggestions;
            dispatch(setSuggestions([...freshSuggestions, withStatus]));
            return {data: withStatus};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore analisi AI';
            dispatch(setAiError(message));
            return null;
        } finally {
            dispatch(setIsAnalyzing(false));
            dispatch(setAnalyzingSourceId(null));
        }
    };

    const respondToSuggestion = async (suggestionId: string, action: SuggestionStatus, correction?: Partial<AiSuggestionWithStatus>) => {
        try {
            const freshSuggestions = store.getState().ai.suggestions;
            const suggestion = freshSuggestions.find(s => s.id === suggestionId);
            if (!suggestion) return null;

            await aiService.sendFeedback(suggestionId, action as 'accepted' | 'modified' | 'rejected', correction);

            // Se accettato: crea elemento nell'edificio + aggiorna osservazione
            if (action === 'accepted' || action === 'modified') {
                const now = new Date().toISOString();
                const elementId = String(Date.now());
                const buildingState = store.getState().building;

                // Trova un parent valido
                let parentId = suggestion.proposedParentId || null;
                if (!parentId || !buildingState.elements[parentId]) {
                    // Cerca un edificio esistente (rootBuildingId o qualsiasi building)
                    const existingBuilding = buildingState.rootBuildingId && buildingState.elements[buildingState.rootBuildingId]
                        ? buildingState.rootBuildingId
                        : Object.values(buildingState.elements).find(el => el.type === 'building')?.id;

                    if (existingBuilding) {
                        parentId = existingBuilding;
                    } else {
                        // Nessun edificio: crea radice generica
                        const rootId = 'building-root';
                        if (!buildingState.elements[rootId]) {
                            dispatch(setElement({
                                id: rootId,
                                label: 'Edificio',
                                parentId: null,
                                type: 'building',
                                dataStatus: 'RAW',
                                confidence: 100,
                                sessionId: store.getState().survey.currentSession?.id || '',
                                createdAt: now,
                                updatedAt: now,
                                floors: [],
                            } as BuildingElement));
                        }
                        parentId = rootId;
                    }
                }

                // Crea elemento nell'albero edificio
                const newElement: BuildingElement = {
                    id: elementId,
                    label: correction?.proposedElementLabel || suggestion.proposedElementLabel,
                    parentId,
                    type: correction?.proposedElementType || suggestion.proposedElementType,
                    dataStatus: 'PROPOSED',
                    confidence: suggestion.confidence,
                    sessionId: store.getState().survey.currentSession?.id || '',
                    createdAt: now,
                    updatedAt: now,
                } as BuildingElement;

                dispatch(setElement(newElement));

                // Aggiorna osservazione con targetElementId e dataStatus PROPOSED
                const surveyState = store.getState().survey;

                if (suggestion.sourceType === 'photo') {
                    const updatedPhotos = surveyState.photos.map(p =>
                        p.id === suggestion.sourceId
                            ? {...p, targetElementId: elementId, dataStatus: 'PROPOSED' as const}
                            : p
                    );
                    dispatch(setPhotos(updatedPhotos));
                }

                if (suggestion.sourceType === 'voice') {
                    const updatedVoice = surveyState.voiceObservations.map(v =>
                        v.id === suggestion.sourceId
                            ? {...v, targetElementId: elementId, dataStatus: 'PROPOSED' as const}
                            : v
                    );
                    dispatch(setVoiceObservations(updatedVoice));
                }
            }

            // Aggiorna stato suggerimento
            const latestSuggestions = store.getState().ai.suggestions;
            const updated = latestSuggestions.map(s =>
                s.id === suggestionId ? {...s, ...correction, status: action} : s
            );
            dispatch(setSuggestions(updated));
            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setAiError(message));
            return null;
        }
    };

    const acceptSuggestion = (suggestionId: string) => respondToSuggestion(suggestionId, 'accepted');
    const rejectSuggestion = (suggestionId: string) => respondToSuggestion(suggestionId, 'rejected');
    const modifySuggestion = (suggestionId: string, correction: Partial<AiSuggestionWithStatus>) =>
        respondToSuggestion(suggestionId, 'modified', correction);

    const pendingSuggestions = state.suggestions.filter(s => s.status === 'pending');
    const getSuggestionBySourceId = (sourceId: string) => state.suggestions.find(s => s.sourceId === sourceId);

    const reset = () => dispatch(resetAi());

    return {
        ...state,
        pendingSuggestions,
        analyzePhoto,
        analyzeVoice,
        acceptSuggestion,
        rejectSuggestion,
        modifySuggestion,
        getSuggestionBySourceId,
        reset,
    };
};
