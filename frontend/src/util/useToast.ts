import { useTranslation } from 'react-i18next';
import libraryToast from 'react-hot-toast';
import { toastMessages } from '../constants/toast';
import { HttpError } from './HttpError';

type SuccessToastMessageOptions = {
  toastKey: string;
  /**
   * See https://www.i18next.com/translation-function/context
   */
  context?: string;

  /**
   * Used for interpolation, see https://www.i18next.com/translation-function/interpolation
   *
   * Check the respective .json file with translations to see the needed keywords.
   */
  values?: object;
};

type ErrorToastMessageOptions = {
  /**
   * If provided, this will override whatever message may be generated
   * by the provided ``error``, provided that the key is valid.
   */
  toastKey?: string;
  /**
   * if an ``HttpError``, this can be used to automatically
   * decide which message to be displayed, if ``toastKey`` is not provided.
   */
  error?: unknown;
  /**
   * if ``error`` is an ``HttpError``, then the toast will not display
   * an error message if ``error``'s status code is contained within this
   * property. This is useful in cases where an error code can be a part
   * of the normal application flow (e.g. a request which renders sensitive
   * data, but does not prevent the render of the page)
   */
  excludedStatusCodes?: number[];
  /**
   * See https://www.i18next.com/translation-function/context
   */
  context?: string;
  /**
   * Used for interpolation, see https://www.i18next.com/translation-function/interpolation
   *
   * Check the respective .json file with translations to see the needed keywords.
   */
  values?: object;
};

export const useToast = () => {
  const { t } = useTranslation('toast');

  function success(options: SuccessToastMessageOptions) {
    const { toastKey, values = {}, context } = options;
    libraryToast.success(t(toastKey, { context, ...values }));
  }

  function error(options: ErrorToastMessageOptions) {
    const { error, toastKey = '', values, excludedStatusCodes, context } = options;

    if (!(error instanceof HttpError)) {
      const key = toastKey || toastMessages.serverError;
      libraryToast.error(t(key, { context, ...values }));
      return;
    }

    const defaultErrorMessagesPerStatusCode: Record<number, string> = {
      401: toastMessages.notLoggedIn,
      403: toastMessages.noPermission,
      404: toastMessages.pageDoesNotExist,
    };

    const err = error.err;

    if (excludedStatusCodes && excludedStatusCodes.includes(err.status)) {
      return;
    }

    const errorMessage =
      (toastMessages as Record<string, string>)[toastKey] ||
      defaultErrorMessagesPerStatusCode[err.status] ||
      toastMessages.serverError;

    libraryToast.error(t(errorMessage, { context, ...values }));
  }

  return { success, error };
};
