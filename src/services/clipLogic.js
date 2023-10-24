const CLIPS_LOCAL_STORAGE_KEY = 'clips';
const EXPIRATION_LOCAL_STORAGE_KEY = 'clips_expiration';

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

const getTotalPoints = (clips) => {
    return clips.reduce((total, clip) => total + clip.points, 0);
}

const setExpirationDate = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    midnight.setDate(midnight.getDate() + 1);

    localStorage.setItem(EXPIRATION_LOCAL_STORAGE_KEY, midnight.getTime().toString());
}

const resetGuesses = (clips) => {
    const updatedClips = clips.map(clip => ({
        ...clip,
        points: 0,
        seen: false
    }));
    updateCachedClips(updatedClips);
    return updatedClips;
}

const updateCachedClips = (clips) => {
    localStorage.setItem(CLIPS_LOCAL_STORAGE_KEY, JSON.stringify(clips));
}

const resetCachedClips = () => {
    localStorage.removeItem(CLIPS_LOCAL_STORAGE_KEY);
    localStorage.removeItem(EXPIRATION_LOCAL_STORAGE_KEY);
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
        points: 0,
        seen: false
    }));

    setExpirationDate();
    localStorage.setItem(CLIPS_LOCAL_STORAGE_KEY, JSON.stringify(mappedClips));
}

const getCachedClips = () => {
    return JSON.parse(localStorage.getItem(CLIPS_LOCAL_STORAGE_KEY));
}

export {
    getFirstNotSeenClip,
    getTotalSeenClips,
    getTotalPoints,
    getCachedClips,
    resetCachedClips,
    setClipAsSeen,
    resetGuesses,
    updateCachedClips,
    cacheClips,
    areClipsCached,
}