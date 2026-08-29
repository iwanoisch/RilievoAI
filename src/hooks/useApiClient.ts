import {useAlert} from "../common/alert/useAlert.ts";
import {useState} from "react";
import {ApiHeaders, ApiRequestBody, QueryParams} from "./useApiClient.type.ts";
import {RootState, store} from "../store/store.ts";
import {logout} from "../features/auth/slice/authSlice.ts";
import {useLocation, useNavigate} from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useApiClient() {
    const {showAlert} = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const state = store.getState() as RootState;
    const token = state.auth.token;
    const navigate = useNavigate();
    const location = useLocation();

    const apiRequest = async <T, >(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        body?: ApiRequestBody,
        customHeaders?: ApiHeaders,
        queryParams?: QueryParams
    ): Promise<T  | null> => {
        setIsLoading(true);
        const headers: ApiHeaders = {
            'Accept': 'application/json',
            ...customHeaders,
        };
        //console.log('token aut', token);
        // Aggiungi automaticamente il token se presente
        //const token = localStorage.getItem('auth_token');
        if (!headers['Content-Type'] && (method === 'POST' || method === 'PUT')) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let queryString = '';
        if (queryParams) {
            const validParams = Object.entries(queryParams)
                .filter(([_key, value]) => value !== undefined && value !== null)
                .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);

            if (validParams.length > 0) {
                queryString = `?${validParams.join('&')}`;
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
                method,
                headers: headers as HeadersInit,
                body: body ? JSON.stringify(body) : undefined,
                redirect: 'follow',
            });

            if (response.status === 401) {
                store.dispatch(logout());
                navigate(`/login?from=${location.pathname}`, { state: { message: 'session_expired' } });

                return null;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Request failed');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return  await response.json();
            } else {
                return  response as unknown as T;
            }
        } catch (error) {
            showAlert({
                title: 'API Error',
                type: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
            return null;
        } finally {
            setIsLoading(false);
        }

    };

    return {
        isLoading,
        get: <T, >(endpoint: string, headers?: ApiHeaders, queryParams?: QueryParams) =>
            apiRequest<T>('GET', endpoint, undefined, headers, queryParams),
        post: <T, >(endpoint: string, body?: ApiRequestBody, headers?: ApiHeaders) =>
            apiRequest<T>('POST', endpoint, body, headers),
        put: <T, >(endpoint: string, body?: ApiRequestBody, headers?: ApiHeaders) =>
            apiRequest<T>('PUT', endpoint, body, headers),
        del: <T, >(endpoint: string, headers?: ApiHeaders, queryParams? : QueryParams) =>
            apiRequest<T>('DELETE', endpoint, undefined, headers, queryParams),
    };

}
