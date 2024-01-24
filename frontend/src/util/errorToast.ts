import libraryToast from 'react-hot-toast';
import { HttpError } from './HttpError';
import { toastMessages } from '../constants/toast';

/**
 * A utility error handler that displays an appropriate
 * toast. Can be passed an ``HttpError`` to automatically display
 * an appropriate message.
 * @param err if ``err`` is an instance of ``HttpError``, a default
 * appropriate message will be used depending on the status code, otherwise,
 * the handler will simply display an error toast with ``message`` or a
 * default message if not passed.
 * @param message overrides the message that would otherwise be
 * used.
 */
export function errorToast(err: unknown, message?: string) {
  if (!(err instanceof HttpError)) {
    libraryToast.error(message || toastMessages.error.serverError);
    return;
  }

  const defaultErrorMessagesPerStatusCode: Record<number, string> = {
    401: toastMessages.error.notLoggedIn,
    403: toastMessages.error.noPermission,
    404: toastMessages.error.pageDoesNotExist,
  };

  const error = err.err;
  const errorMessage =
    message || defaultErrorMessagesPerStatusCode[error.status] || toastMessages.error.serverError;

  libraryToast.error(errorMessage);
}
