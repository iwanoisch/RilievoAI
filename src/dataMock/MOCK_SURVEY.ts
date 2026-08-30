import type {SurveySession, SurveyPhoto, VoiceObservation, Measurement} from "../features/survey/slice/survey.type.ts";

export const createMockSession = (buildingId: string): SurveySession => ({
    id: 'session-' + Date.now(),
    buildingId,
    technicianId: '1',
    deviceInfo: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        platform: 'web',
        screenWidth: typeof window !== 'undefined' ? window.screen.width : 0,
        screenHeight: typeof window !== 'undefined' ? window.screen.height : 0,
        hasCamera: true,
        hasMicrophone: true,
        hasGeolocation: true,
        hasDeviceOrientation: true,
    },
    startedAt: new Date().toISOString(),
    status: 'active',
    softwareVersion: '1.0.0',
});

export const MOCK_PHOTOS: SurveyPhoto[] = [];

export const MOCK_VOICE_OBSERVATIONS: VoiceObservation[] = [];

export const MOCK_MEASUREMENTS: Measurement[] = [];
