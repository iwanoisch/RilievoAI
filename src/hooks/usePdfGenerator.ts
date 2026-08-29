// hooks/usePdfGenerator.ts
import {useRef, useState} from 'react';
import {useApiClient} from "./useApiClient.ts";

export const usePdfGenerator = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const {post} = useApiClient();

    const sendHTMLToBackend = async () => {
        if (!contentRef.current) {
            alert('Nessun contenuto da convertire');
            return;
        }
        setIsGenerating(true);
        try {
            const element = contentRef.current;
            const data = await post<Response>("/data/convert", {mode: "html2pdf", content: element.outerHTML}, undefined);
            return data?.blob();
        } catch (error) {
            console.log(error);
        } finally {
            setIsGenerating(false);
        }
    }

    return {
        contentRef,
        sendHTMLToBackend,
        isGenerating,
    };
};