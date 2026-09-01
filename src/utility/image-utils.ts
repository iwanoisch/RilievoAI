interface ImageResult {
    mediaPath: string;
    thumbnailPath: string;
}

export const fileToImageData = (file: File): Promise<ImageResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                // Full image canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context non disponibile'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                const mediaPath = canvas.toDataURL('image/jpeg', 0.85);

                // Thumbnail
                const thumbCanvas = document.createElement('canvas');
                const thumbSize = 200;
                const ratio = Math.min(thumbSize / img.width, thumbSize / img.height);
                thumbCanvas.width = img.width * ratio;
                thumbCanvas.height = img.height * ratio;
                const thumbCtx = thumbCanvas.getContext('2d');
                thumbCtx?.drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height);
                const thumbnailPath = thumbCanvas.toDataURL('image/jpeg', 0.6);

                resolve({mediaPath, thumbnailPath});
            };
            img.onerror = () => reject(new Error('Errore caricamento immagine'));
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Errore lettura file'));
        reader.readAsDataURL(file);
    });
};
