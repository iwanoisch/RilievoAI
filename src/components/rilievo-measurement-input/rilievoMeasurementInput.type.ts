import type {RilievoMeasurement} from "../../features/rilievo/rilievo.type.ts";

export interface RilievoMeasurementInputProps {
    itemId: string;
    onAdd: (measurement: RilievoMeasurement) => void;
}
