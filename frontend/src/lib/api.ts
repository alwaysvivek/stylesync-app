import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

export const getSiteTokens = async (siteId: string) => {
    const response = await api.get(`/tokens/${siteId}`);
    return response.data;
};

export const updateSiteTokens = async (siteId: string, tokens: any) => {
    const response = await api.put(`/tokens/${siteId}`, tokens);
    return response.data;
};

export const lockSiteToken = async (siteId: string, path: string, value: any) => {
    const response = await api.post(`/tokens/${siteId}/lock`, {
        token_path: path,
        locked_value: value
    });
    return response.data;
};

export const unlockSiteToken = async (siteId: string, path: string) => {
    const response = await api.post(`/tokens/${siteId}/unlock`, {
        token_path: path
    });
    return response.data;
};

export const getLockedTokens = async (siteId: string) => {
    const response = await api.get(`/tokens/${siteId}/locks`);
    return response.data;
};

export const getSiteVersions = async (siteId: string) => {
    const response = await api.get(`/versions/${siteId}`);
    return response.data;
};

export const restoreSiteVersion = async (versionId: string) => {
    const response = await api.post(`/versions/${versionId}/restore`);
    return response.data;
};

export const submitSiteScrape = async (url: string) => {
    const response = await api.post('/sites/', { url });
    return response.data;
};

export const getSite = async (siteId: string) => {
    const response = await api.get(`/sites/${siteId}`);
    return response.data;
};

export default api;
