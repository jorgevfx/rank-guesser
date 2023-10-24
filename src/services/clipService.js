import apiClient from "@/services/base";

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

export {
    getClips,
    guessClip
}
