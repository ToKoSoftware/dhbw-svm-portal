
export interface PortalErrorData {
  message: string;
  status: number;
  type: string;
  // eslint-disable-next-line
  stacktrace?: string[];
  success: false;
}
