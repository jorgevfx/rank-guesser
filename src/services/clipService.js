import apiClient from "@/services/base";

const COOKIE_NAME = 'clips';
const COOKIE_EXPIRATION_DAYS = 1;

export const getClipsFromCacheOrApi = async () => {
    const cachedClips = getCachedClips();

    if (areClipsValid(cachedClips)) {
        return cachedClips.clips;
    }

    const clips = await getClips();
    cacheClips(clips);
    return clips;
}

const getClips = async () => {
    const response = await apiClient.get('/clip');
    return response.data;
}

const areClipsValid = (cachedClips) => {
    if (!cachedClips) {
        return false;
    }

    const expirationTime = new Date(cachedClips.expirationTime).getTime();
    const currentTime = new Date().getTime();

    return expirationTime > currentTime;
}

const cacheClips = (clips) => {
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + COOKIE_EXPIRATION_DAYS);

    const mappedClips = clips.map(clip => ({
        ...clip,
        seen: false
    }));

    const dataToCache = {
        clips: mappedClips,
        expirationTime: expirationTime.toISOString()
    };

    const jsonData = JSON.stringify(dataToCache);

    document.cookie = `${COOKIE_NAME}=${jsonData}; expires=${expirationTime.toUTCString()}; path=/`;
}

const getCachedClips = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === COOKIE_NAME) {
            return JSON.parse(decodeURIComponent(value));
        }
    }
    return null;
}
