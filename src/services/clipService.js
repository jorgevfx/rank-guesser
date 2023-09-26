import apiClient from "@/services/base";

const LOCAL_STORAGE_KEY = 'clips';

const getClips = async () => {
    const response = await apiClient.get('/clip');
    return response.data;
}

const guessClip = async ({clipId, subRank}) => {
    const response = await apiClient.post(`/clip/${clipId}/guess`, {
        guessedRank: subRank
    });
    return response.data;
}

const areClipsExpired = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    return now > midnight;
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clips));
}

const cacheClips = (clips) => {
    const mappedClips = clips.map(clip => ({
        ...clip,
        seen: false
    }));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedClips));
}

const getCachedClips = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}

const areClipsCached = () => {
    return !!getCachedClips();
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
