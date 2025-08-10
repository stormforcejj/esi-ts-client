// From project: localisprimary/esi (https://github.com/localisprimary/esi/)
// Licensed under the ISC License
// Copyright (c) 2025 localisprimary

export interface EsiResponse<TData, THeaders = Record<string, string>> {
    data: TData;
    headers: THeaders;
    status: number;
}

export interface EsiError {
    error: string;
    status: number;
}
