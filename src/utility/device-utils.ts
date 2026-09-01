import type {GeoPosition, DeviceOrient} from "../features/survey/slice/survey.type.ts";

export const getGeolocation = (): Promise<GeoPosition | undefined> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(undefined);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                alt: pos.coords.altitude ?? undefined,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
            }),
            () => resolve(undefined),
            {enableHighAccuracy: true, timeout: 5000}
        );
    });
};

export const getDeviceOrientation = (): Promise<DeviceOrient | undefined> => {
    return new Promise((resolve) => {
        const handler = (event: DeviceOrientationEvent) => {
            window.removeEventListener('deviceorientation', handler);
            resolve({alpha: event.alpha, beta: event.beta, gamma: event.gamma});
        };
        window.addEventListener('deviceorientation', handler);
        setTimeout(() => {
            window.removeEventListener('deviceorientation', handler);
            resolve(undefined);
        }, 1000);
    });
};
