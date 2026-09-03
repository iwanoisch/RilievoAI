import {useState, useCallback, useRef} from "react";
import {store} from "../../../store/store.ts";
import {setElement} from "../../edificio/edificioSlice.ts";
import {setPhotos, setVoiceObservations} from "../../survey/slice/surveySlice.ts";
import {aiService} from "../services/ai-service.ts";
import type {AiPhotoAnalysisRequest, AiVoiceAnalysisRequest} from "../services/ai-service.type.ts";
import type {AiSuggestionWithStatus, SuggestionStatus} from "../slice/ai.type.ts";
import type {EdificioElement} from "../../edificio/edificio.type.ts";

export const useAiAnalysis = () => {
    const [suggestions, setSuggestions] = useState<AiSuggestionWithStatus[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzingSourceId, setAnalyzingSourceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const suggestionsRef = useRef(suggestions);
    suggestionsRef.current = suggestions;

    const analyzePhoto = useCallback(async (request: AiPhotoAnalysisRequest) => {
        try {
            setIsAnalyzing(true);
            setAnalyzingSourceId(request.photoId);
            setError(null);

            const suggestion = await aiService.analyzePhoto(request);
            const withStatus: AiSuggestionWithStatus = {...suggestion, status: 'pending'};

            setSuggestions(prev => [...prev, withStatus]);
            return {data: withStatus};
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Errore analisi AI';
            setError(message);
            return null;
        } finally {
            setIsAnalyzing(false);
            setAnalyzingSourceId(null);
        }
    }, []);

    const analyzeVoice = useCallback(async (request: AiVoiceAnalysisRequest) => {
        try {
            setIsAnalyzing(true);
            setAnalyzingSourceId(request.observationId);
            setError(null);

            const suggestion = await aiService.analyzeVoice(request);
            const withStatus: AiSuggestionWithStatus = {...suggestion, status: 'pending'};

            setSuggestions(prev => [...prev, withStatus]);
            return {data: withStatus};
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Errore analisi AI';
            setError(message);
            return null;
        } finally {
            setIsAnalyzing(false);
            setAnalyzingSourceId(null);
        }
    }, []);

    const analyzePhotoBatch = useCallback(async (
        requests: AiPhotoAnalysisRequest[],
        onProgress?: (completed: number, total: number) => void,
    ) => {
        const results: AiSuggestionWithStatus[] = [];
        for (let i = 0; i < requests.length; i++) {
            const result = await analyzePhoto(requests[i]);
            if (result?.data) {
                results.push(result.data);
            }
            onProgress?.(i + 1, requests.length);
        }
        return results;
    }, [analyzePhoto]);

    const respondToSuggestion = useCallback(async (suggestionId: string, action: SuggestionStatus, correction?: Partial<AiSuggestionWithStatus>) => {
        try {
            const suggestion = suggestionsRef.current.find(s => s.id === suggestionId);
            if (!suggestion) return null;

            await aiService.sendFeedback(suggestionId, action as 'accepted' | 'modified' | 'rejected', correction);

            if (action === 'accepted' || action === 'modified') {
                const now = new Date().toISOString();
                const elementId = String(Date.now());
                const buildingState = store.getState().edificio;
                const dispatch = store.dispatch;

                let parentId = suggestion.proposedParentId || null;
                if (!parentId || !buildingState.elements[parentId]) {
                    const existingBuilding = buildingState.rootBuildingId && buildingState.elements[buildingState.rootBuildingId]
                        ? buildingState.rootBuildingId
                        : Object.values(buildingState.elements).find(el => el.type === 'building')?.id;

                    if (existingBuilding) {
                        parentId = existingBuilding;
                    } else {
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
                            } as EdificioElement));
                        }
                        parentId = rootId;
                    }
                }

                const newElement: EdificioElement = {
                    id: elementId,
                    label: correction?.proposedElementLabel || suggestion.proposedElementLabel,
                    parentId,
                    type: correction?.proposedElementType || suggestion.proposedElementType,
                    dataStatus: 'PROPOSED',
                    confidence: suggestion.confidence,
                    sessionId: store.getState().survey.currentSession?.id || '',
                    createdAt: now,
                    updatedAt: now,
                } as EdificioElement;

                dispatch(setElement(newElement));

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

            setSuggestions(prev =>
                prev.map(s => s.id === suggestionId ? {...s, ...correction, status: action} : s)
            );
            return {success: true};
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Errore sconosciuto';
            setError(message);
            return null;
        }
    }, []);

    const acceptSuggestion = useCallback((suggestionId: string) =>
        respondToSuggestion(suggestionId, 'accepted'), [respondToSuggestion]);

    const rejectSuggestion = useCallback((suggestionId: string) =>
        respondToSuggestion(suggestionId, 'rejected'), [respondToSuggestion]);

    const modifySuggestion = useCallback((suggestionId: string, correction: Partial<AiSuggestionWithStatus>) =>
        respondToSuggestion(suggestionId, 'modified', correction), [respondToSuggestion]);

    const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
    const getSuggestionBySourceId = useCallback((sourceId: string) =>
        suggestionsRef.current.find(s => s.sourceId === sourceId), []);

    const reset = useCallback(() => {
        setSuggestions([]);
        setIsAnalyzing(false);
        setAnalyzingSourceId(null);
        setError(null);
    }, []);

    return {
        suggestions,
        isAnalyzing,
        analyzingSourceId,
        error,
        pendingSuggestions,
        analyzePhoto,
        analyzePhotoBatch,
        analyzeVoice,
        acceptSuggestion,
        rejectSuggestion,
        modifySuggestion,
        getSuggestionBySourceId,
        reset,
    };
};
