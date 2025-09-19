import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackText = "No Image" }) => {
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" fill="#F3F4F6"/>
            <rect x="12" y="12" width="40" height="40" stroke="#9CA3AF" stroke-width="2" fill="none" rx="4"/>
            <circle cx="24" cy="24" r="3" fill="#9CA3AF"/>
            <path d="M16 44L24 36L32 44H16Z" fill="#9CA3AF"/>
            <path d="M36 32L44 40L52 32V44H36V32Z" fill="#9CA3AF"/>
            <text x="32" y="54" text-anchor="middle" fill="#6B7280" font-size="8" font-family="system-ui">
                ${fallbackText}
            </text>
        </svg>
    `)}`;

    const handleError = () => {
        if (retryCount < 1 && !error) {
            setRetryCount(prev => prev + 1);
            setError(true);
        }
    };

    const handleLoad = () => {
        setError(false);
        setRetryCount(0);
    };

    if (error && retryCount >= 1) {
        return (
            <img
                src={fallbackSvg}
                alt={alt}
                className={className}
            />
        );
    }

    const imageSrc = error ?
        `https://via.placeholder.com/64x64/F3F4F6/9CA3AF?text=${encodeURIComponent(fallbackText)}` :
        src;

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
        />
    );
};

export default ImageWithFallback;