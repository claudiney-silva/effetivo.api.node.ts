import { getReasonPhrase } from 'http-status-codes';
import { ApiError } from './APIError';

class ErrorService {
  public format(err: ApiError): ApiError {
    const status = err.status || 500;
    const error = err.error || getReasonPhrase(status);
    const key = err.key || error.toUpperCase().replace(/\s/g, '_');
    return {
      status,
      error,
      key,
      ...(err.message && { message: err.message }),
      ...(err.data && { data: err.data }),
    };
  }
}

export default new ErrorService();
