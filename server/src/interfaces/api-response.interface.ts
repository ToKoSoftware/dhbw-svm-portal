export interface ApiResponse<T> {
    success: boolean;
    data?: T | ApiResponseData;
    error?: string;
}

export interface ApiResponseData {
    [key: string]: number | string | boolean | ApiResponseData | Array<number | string | boolean | ApiResponseData | unknown[]>
}
