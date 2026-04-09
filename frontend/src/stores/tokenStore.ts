import { create } from 'zustand';
import { DesignToken } from '../types';
import * as api from '../lib/api';

interface TokenState {
    tokens: DesignToken | null;
    isUndoRedoing: boolean;
    isLoading: boolean;
    
    lockedPaths: Record<string, any>;
    versions: any[];
    currentVersionIndex: number;

    setTokens: (tokens: DesignToken) => void;
    fetchLocks: (siteId: string) => Promise<void>;
    fetchSiteVersions: (siteId: string) => Promise<void>;
    updateTokenPath: (category: string, key: string, value: any, shouldCommit?: boolean) => void;
    toggleLock: (siteId: string, category: string, key: string, value: any) => Promise<void>;
    saveChanges: (siteId: string) => Promise<void>;
    
    undo: (siteId: string) => Promise<void>;
    redo: (siteId: string) => Promise<void>;
}

export const useTokenStore = create<TokenState>((set, get) => ({
    tokens: null,
    isLoading: false,
    isUndoRedoing: false,
    lockedPaths: {},
    versions: [],
    currentVersionIndex: -1,

    setTokens: (tokens) => set({ tokens }),

    fetchLocks: async (siteId) => {
        try {
            const locks = await api.getLockedTokens(siteId);
            const pathMap: Record<string, any> = {};
            locks.forEach((l: any) => {
                pathMap[l.token_path] = l.locked_value;
            });
            set({ lockedPaths: pathMap });
        } catch (e) {
            console.error("Failed to fetch locks:", e);
        }
    },

    fetchSiteVersions: async (siteId) => {
        try {
            const history = await api.getSiteVersions(siteId);
            set({ versions: history, currentVersionIndex: 0 }); // Most recent is at 0
        } catch (e) {
            console.error("Failed to fetch versions:", e);
        }
    },
    
    updateTokenPath: (category, key, value, shouldCommit = true) => {
        const { tokens } = get();
        if (!tokens) return;
        
        const updatedTokens = {
            ...tokens,
            [category]: {
                ...tokens[category as keyof DesignToken],
                [key]: value
            }
        };

        // We NO LONGER update local history here. 
        // Undo/Redo only works between Saved Checkpoints as per user request.
        set({ tokens: updatedTokens });
    },

    toggleLock: async (siteId, category, key, value) => {
        const path = `${category}.${key}`;
        const { lockedPaths } = get();
        
        if (lockedPaths[path]) {
            await api.unlockSiteToken(siteId, path);
            const newLocked = { ...lockedPaths };
            delete newLocked[path];
            set({ lockedPaths: newLocked });
        } else {
            await api.lockSiteToken(siteId, path, value);
            set({ lockedPaths: { ...lockedPaths, [path]: value } });
        }
    },

    saveChanges: async (siteId) => {
        const { tokens } = get();
        if (!tokens) return;
        
        set({ isLoading: true });
        try {
            await api.updateSiteTokens(siteId, {
                colors: tokens.colors,
                typography: tokens.typography,
                spacing: tokens.spacing
            });
            // After save, refresh the version history
            await get().fetchSiteVersions(siteId);
        } finally {
            set({ isLoading: false });
        }
    },

    undo: async (siteId) => {
        const { versions, currentVersionIndex, isUndoRedoing } = get();
        if (isUndoRedoing || currentVersionIndex >= versions.length - 1) return;
        
        set({ isUndoRedoing: true });
        
        try {
            const nextIdx = currentVersionIndex + 1;
            const version = versions[nextIdx];
            await api.restoreSiteVersion(version.id);
            
            // Refresh tokens from the new state
            const updated = await api.getSiteTokens(siteId);
            set({ 
                tokens: updated, 
                currentVersionIndex: nextIdx,
                isUndoRedoing: false 
            });
        } catch (e) {
            console.error("Undo failed:", e);
            set({ isUndoRedoing: false });
        }
    },

    redo: async (siteId) => {
        const { versions, currentVersionIndex, isUndoRedoing } = get();
        if (isUndoRedoing || currentVersionIndex <= 0) return;
        
        set({ isUndoRedoing: true });
        
        try {
            const nextIdx = currentVersionIndex - 1;
            const version = versions[nextIdx];
            await api.restoreSiteVersion(version.id);
            
            // Refresh tokens from the new state
            const updated = await api.getSiteTokens(siteId);
            set({ 
                tokens: updated, 
                currentVersionIndex: nextIdx,
                isUndoRedoing: false 
            });
        } catch (e) {
            console.error("Redo failed:", e);
            set({ isUndoRedoing: false });
        }
    }
}));
