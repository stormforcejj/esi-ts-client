// From project: localisprimary/esi (https://github.com/localisprimary/esi/)
// Licensed under the ISC License
// Copyright (c) 2025 localisprimary

export interface EsiResponse<TData> {
    data: TData;
    // headers: THeaders;
    headers: Record<string, string>;
    status: number;
}

export interface EsiError {
    error: string;
    response: Response;
    status: number;
}
