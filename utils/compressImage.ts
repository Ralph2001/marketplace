import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
    };
    return await imageCompression(file, options);
};