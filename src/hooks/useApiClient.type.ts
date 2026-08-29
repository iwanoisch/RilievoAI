export type ApiRequestBody = Record<string, unknown> | FormData | null | undefined;

export type ApiHeaders = {
    'Content-Type'?: string;
    Authorization?: string;
    [key: string]: string | undefined; // Per altre proprietà personalizzate
};

export type QueryParams = Record<string, string | number | boolean | undefined | null>;
