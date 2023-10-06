import apiClient from "@/services/base";

const CLIPS_LOCAL_STORAGE_KEY = 'clips';
const EXPIRATION_LOCAL_STORAGE_KEY = 'clips_expiration';

const getClips = async () => {
    const response = await apiClient.get('/clip');
    return response.data;
}

const guessClip = async ({ clipId, subRank }) => {
    const response = await apiClient.post(`/clip/${clipId}/guess`, {
        guessedRank: subRank
    });
    return response.data;
}

const getFirstNotSeenClip = (clips) => {
    return clips.find(clip => !clip.seen);
}

const getTotalSeenClips = (clips) => {
    return clips.filter(clip => clip.seen).length;
}

const setClipAsSeen = (clips, clipId) => {
    const clipIndex = clips.findIndex(clip => clip.id === clipId);
    clips[clipIndex].seen = true;
    return clips;
}

const updateCachedClips = (clips) => {
    localStorage.setItem(CLIPS_LOCAL_STORAGE_KEY, JSON.stringify(clips));
}

const setExpirationDate = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    localStorage.setItem(EXPIRATION_LOCAL_STORAGE_KEY, midnight.getTime().toString());
}

const checkExpirationDate = () => {
    const expirationTime = localStorage.getItem(EXPIRATION_LOCAL_STORAGE_KEY);

    if (!expirationTime) {
        return true;
    }
    const now = new Date();

    return now.getTime() >= parseInt(expirationTime);
}

const areClipsCached = () => {
    const cachedData = JSON.parse(localStorage.getItem(CLIPS_LOCAL_STORAGE_KEY));
    const areClipsExpired = checkExpirationDate();

    return cachedData && !areClipsExpired;
}

const cacheClips = (clips) => {
    const mappedClips = clips.map(clip => ({
        ...clip,
        seen: false
    }));

    setExpirationDate();
    localStorage.setItem(CLIPS_LOCAL_STORAGE_KEY, JSON.stringify(mappedClips));
}

const getCachedClips = () => {
    return JSON.parse(localStorage.getItem(CLIPS_LOCAL_STORAGE_KEY));
}

export {
    getClips,
    guessClip,
    getFirstNotSeenClip,
    getTotalSeenClips,
    setClipAsSeen,
    updateCachedClips,
    cacheClips,
    areClipsCached,
    getCachedClips
}
