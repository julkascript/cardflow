import { api } from '../../constants/api';
import { HttpError } from '../../util/HttpError';

type method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * The HTTP service provides standardized configurations for making requests.
 *
 * The passed body is stringified if such is provided and all necessary headers are
 * attached
 *
 * If the server responds with 401, the service will attempt to retrieve
 * a new access token and then redo the request.
 *
 * If the server responds with 204, the service returns ``undefined``. For
 * other 2xx status codes, it returns the response body. For any
 * other response status code, an ``HttpError`` with the response is thrown.
 */
export const httpService = {
  get<TResponseBody>(url: string, params?: object) {
    return request<TResponseBody>('GET', url, undefined, params);
  },
  post<TResponseBody>(url: string, body?: any, params?: object) {
    return request<TResponseBody>('POST', url, body, params);
  },
  put<TResponseBody>(url: string, body?: any, params?: object) {
    return request<TResponseBody>('PUT', url, body, params);
  },
  patch<TResponseBody>(url: string, body?: any, params?: object) {
    return request<TResponseBody>('PATCH', url, body, params);
  },
  del<TResponseBody>(url: string, params?: object) {
    return request<TResponseBody>('DELETE', url, undefined, params);
  },
};

function generateQueryStrings(query: object): string {
  const entries = Object.entries(query);
  if (entries.length === 0) {
    return '';
  }

  return '?' + entries.map((entry) => `${entry[0]}=${entry[1]}`).join('&');
}

async function request<TResponseBody>(
  method: method,
  url: string,
  body?: any,
  params?: object,
): Promise<TResponseBody | undefined> {
  const headers: HeadersInit = {};
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  let requestBody;

  if (body) {
    requestBody = body instanceof FormData ? body : JSON.stringify(body);
  }

  const request = {
    headers,
    method,
    body: requestBody,
  };

  if (params) {
    url = url + generateQueryStrings(params);
  }

  let res = await fetch(url, request);
  if (res.status === 204) {
    return undefined;
  }

  if (res.status === 401) {
    const newAccessToken = await generateNewAccessToken();
    request.headers.authorization = `Bearer ${newAccessToken}`;
    localStorage.setItem('accessToken', newAccessToken);

    res = await fetch(url, request);
  }

  if (!res.ok) {
    throw new HttpError(res);
  }

  const data: TResponseBody = await res.json();
  return data;
}

type RefreshResponse = {
  access: string;
};

async function generateNewAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');

  const res = await fetch(api.accounts.refresh, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    // don't delete tokens unless it's an actual bad request.
    if (res.status >= 400 && res.status < 500) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    throw new HttpError(res);
  }

  const data: RefreshResponse = await res.json();

  return data.access;
}
