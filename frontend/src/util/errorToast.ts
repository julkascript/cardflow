import libraryToast from 'react-hot-toast';
import { HttpError } from './HttpError';
import { legacyToastMessages } from '../constants/toast';

/**
 * A utility error handler that displays an appropriate
 * toast. Can be passed an ``HttpError`` to automatically display
 * an appropriate message.
 * @param err if ``err`` is an instance of ``HttpError``, a default
 * appropriate message will be used depending on the status code, otherwise,
 * the handler will simply display an error toast with ``message`` or a
 * default message if not passed.
 * @param message overrides the message that would otherwise be used.
 * @param excludedCodes the list of status codes which will not trigger this function.
 * This is useful for cases where an error response is a valid part of the
 * application's flow
 * (e.g. a 403 error that prevents the display of sensitive data,
 * but renders the rest of the whole data anyways). **Note:** this option
 * is valid only if ``err`` is an instance of ``HttpError``.
 * 
 * @deprecated
 */
export function legacyErrorToast(err: unknown, message?: string, ...excludedCodes: number[]) {
  if (!(err instanceof HttpError)) {
    libraryToast.error(message || legacyToastMessages.error.serverError);
    return;
  }

  const defaultErrorMessagesPerStatusCode: Record<number, string> = {
    401: legacyToastMessages.error.notLoggedIn,
    403: legacyToastMessages.error.noPermission,
    404: legacyToastMessages.error.pageDoesNotExist,
  };

  const error = err.err;

  if (excludedCodes && excludedCodes.includes(error.status)) {
    return;
  }

  const errorMessage =
    message || defaultErrorMessagesPerStatusCode[error.status] || legacyToastMessages.error.serverError;

  libraryToast.error(errorMessage);
}
