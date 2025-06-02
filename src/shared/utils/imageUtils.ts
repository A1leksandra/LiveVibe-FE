export const getImageUrl = (imageUrl: string): string => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${backendUrl}${imageUrl}`;
}; 