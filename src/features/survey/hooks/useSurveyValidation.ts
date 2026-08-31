import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {setPhotos, setVoiceObservations, setMeasurements, setValidationLog, setSurveyError} from "../slice/surveySlice.ts";
import type {DataStatus} from "../../building/slice/building.type.ts";
import type {ObservationType, ValidationLogEntry} from "../slice/survey.type.ts";

export const useSurveyValidation = () => {
    const dispatch = useAppDispatch();
    const surveyState = useAppSelector(state => state.survey);
    const {photos, voiceObservations, measurements, currentSession} = surveyState;
    const validationLog = surveyState.validationLog ?? [];

    const validateObservation = async (
        observationId: string,
        observationType: ObservationType,
        newStatus: DataStatus,
        newConfidence?: number,
        note?: string,
    ) => {
        try {
            // TODO real api: await put(`/survey/observations/${observationId}/validate`, {newStatus, newConfidence});

            if (observationType === 'photo') {
                const photo = photos.find(p => p.id === observationId);
                if (!photo) return null;

                const logEntry: ValidationLogEntry = {
                    id: String(Date.now()),
                    observationId,
                    observationType,
                    previousStatus: photo.dataStatus,
                    newStatus,
                    previousConfidence: photo.confidence,
                    newConfidence: newConfidence ?? photo.confidence,
                    timestamp: new Date().toISOString(),
                    technicianId: currentSession?.technicianId ?? '',
                    note,
                };

                dispatch(setPhotos(photos.map(p =>
                    p.id === observationId
                        ? {...p, dataStatus: newStatus, confidence: newConfidence ?? p.confidence}
                        : p
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            if (observationType === 'voice') {
                const voice = voiceObservations.find(v => v.id === observationId);
                if (!voice) return null;

                const logEntry: ValidationLogEntry = {
                    id: String(Date.now()),
                    observationId,
                    observationType,
                    previousStatus: voice.dataStatus,
                    newStatus,
                    previousConfidence: voice.confidence,
                    newConfidence: newConfidence ?? voice.confidence,
                    timestamp: new Date().toISOString(),
                    technicianId: currentSession?.technicianId ?? '',
                    note,
                };

                dispatch(setVoiceObservations(voiceObservations.map(v =>
                    v.id === observationId
                        ? {...v, dataStatus: newStatus, confidence: newConfidence ?? v.confidence}
                        : v
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            if (observationType === 'measurement') {
                const measurement = measurements.find(m => m.id === observationId);
                if (!measurement) return null;

                const logEntry: ValidationLogEntry = {
                    id: String(Date.now()),
                    observationId,
                    observationType,
                    previousStatus: measurement.dataStatus,
                    newStatus,
                    previousConfidence: measurement.confidence,
                    newConfidence: newConfidence ?? measurement.confidence,
                    timestamp: new Date().toISOString(),
                    technicianId: currentSession?.technicianId ?? '',
                    note,
                };

                dispatch(setMeasurements(measurements.map(m =>
                    m.id === observationId
                        ? {...m, dataStatus: newStatus, confidence: newConfidence ?? m.confidence}
                        : m
                )));
                dispatch(setValidationLog([...validationLog, logEntry]));
            }

            return {success: true};
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            dispatch(setSurveyError(message));
            return null;
        }
    };

    const confirmObservation = (observationId: string, observationType: ObservationType) => {
        return validateObservation(observationId, observationType, 'VALIDATED', 100);
    };

    const rejectObservation = (observationId: string, observationType: ObservationType, note?: string) => {
        return validateObservation(observationId, observationType, 'REJECTED', undefined, note);
    };

    const correctObservation = (observationId: string, observationType: ObservationType, newConfidence: number, note?: string) => {
        return validateObservation(observationId, observationType, 'VALIDATED', newConfidence, note);
    };

    // --- Derived ---
    const allObservations = [
        ...photos.map(p => ({id: p.id, type: 'photo' as const, confidence: p.confidence, dataStatus: p.dataStatus, timestamp: p.timestamp})),
        ...voiceObservations.map(v => ({id: v.id, type: 'voice' as const, confidence: v.confidence, dataStatus: v.dataStatus, timestamp: v.timestamp})),
        ...measurements.map(m => ({id: m.id, type: 'measurement' as const, confidence: m.confidence, dataStatus: m.dataStatus, timestamp: m.timestamp})),
    ];

    const pendingValidation = allObservations
        .filter(o => o.dataStatus === 'PROPOSED' || o.dataStatus === 'DERIVED')
        .sort((a, b) => a.confidence - b.confidence);

    const validatedCount = allObservations.filter(o => o.dataStatus === 'VALIDATED').length;
    const rejectedCount = allObservations.filter(o => o.dataStatus === 'REJECTED').length;
    const totalCount = allObservations.length;
    const pendingCount = pendingValidation.length;

    const getLogForObservation = (observationId: string): ValidationLogEntry[] => {
        return validationLog.filter(l => l.observationId === observationId);
    };

    return {
        validationLog,
        pendingValidation,
        validatedCount,
        rejectedCount,
        totalCount,
        pendingCount,
        validateObservation,
        confirmObservation,
        rejectObservation,
        correctObservation,
        getLogForObservation,
    };
};
