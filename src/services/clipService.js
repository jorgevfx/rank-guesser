import apiClient from "@/services/base";

const SESSION_STORAGE_KEY = 'clips';
const localDate = new Date();
const date = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))

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
    const currentTime = date.getTime();

    return expirationTime > currentTime;
}

const cacheClips = (clips) => {
    const expirationTime = date.setHours(24,0,0,0)

    const mappedClips = clips.map(clip => ({
        ...clip,
        seen: false
    }));

    const dataToCache = {
        clips: mappedClips,
        expirationTime: expirationTime.toISOString()
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(dataToCache));
}

const getCachedClips = () => {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}
