export interface DesignToken {
    id: string;
    site_id: string;
    colors: Record<string, string>;
    typography: Record<string, any>;
    spacing: Record<string, any>;
    metadata_info: Record<string, any>;
}

export interface Site {
    id: string;
    url: string;
    domain: string;
    status: string;
    error_message?: string;
    created_at: string;
}

export interface LockedToken {
    token_path: string;
    locked_value: any;
}
