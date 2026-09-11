import {openDB} from 'idb';
import type {DBSchema, IDBPDatabase} from 'idb';

export interface FloorPlanImage {
    fileId: string;
    buildingId: string;
    name: string;
    mimeType: string;
    base64: string;
}

interface FloorPlanDBSchema extends DBSchema {
    floorPlanImages: {
        key: string;
        value: FloorPlanImage;
        indexes: {
            byBuilding: string;
        };
    };
}

const DB_NAME = 'rilievo-floor-plans';
const DB_VERSION = 1;
const STORE_NAME = 'floorPlanImages';

const getDb = (): Promise<IDBPDatabase<FloorPlanDBSchema>> =>
    openDB<FloorPlanDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            const store = db.createObjectStore(STORE_NAME, {keyPath: 'fileId'});
            store.createIndex('byBuilding', 'buildingId');
        },
    });

export const floorPlanDB = {
    async save(buildingId: string, fileId: string, data: {name: string; mimeType: string; base64: string}): Promise<void> {
        const db = await getDb();
        await db.put(STORE_NAME, {
            fileId,
            buildingId,
            name: data.name,
            mimeType: data.mimeType,
            base64: data.base64,
        });
    },

    async getByKey(fileId: string): Promise<FloorPlanImage | undefined> {
        const db = await getDb();
        return db.get(STORE_NAME, fileId);
    },

    async getAllForBuilding(buildingId: string): Promise<FloorPlanImage[]> {
        const db = await getDb();
        return db.getAllFromIndex(STORE_NAME, 'byBuilding', buildingId);
    },

    async delete(fileId: string): Promise<void> {
        const db = await getDb();
        await db.delete(STORE_NAME, fileId);
    },

    async deleteAllForBuilding(buildingId: string): Promise<void> {
        const db = await getDb();
        const images = await db.getAllFromIndex(STORE_NAME, 'byBuilding', buildingId);
        const tx = db.transaction(STORE_NAME, 'readwrite');
        for (const img of images) {
            await tx.store.delete(img.fileId);
        }
        await tx.done;
    },
};
