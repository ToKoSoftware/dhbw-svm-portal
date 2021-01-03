import {ApiResponse, ApiResponseData} from '../interfaces/api-response.interface';

export function wrapResponse<T>(success: boolean, data?: ApiResponseData | T): ApiResponse<ApiResponseData | T> {
    return {
        success,
        data
    };
}
