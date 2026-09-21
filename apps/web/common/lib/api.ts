interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiErrorBody {
  message?: string;
}

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined — check the root .env");
}

let refreshPromise: Promise<void> | null = null;

const isAuthRoute = (url: string) =>
  ["auth/login", "auth/register", "auth/refresh", "auth/logout"].includes(
    url.replace(/^\//, ""),
  );

const getErrorMessage = async (response: Response) => {
  try {
    const body: ApiErrorBody = await response.json();
    return body.message || "Failed Sending The Request";
  } catch {
    return "Failed Sending The Request";
  }
};

const refreshAccessToken = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${PUBLIC_API_URL}auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const request = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  const requestOptions = {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  } satisfies RequestInit;

  let res = await fetch(PUBLIC_API_URL + url, requestOptions);

  // The access cookie is short-lived. If it has expired, rotate the cookies
  // once and retry the original request. A shared promise prevents a burst
  // of expired requests from rotating the refresh token concurrently.
  if (res.status === 401 && !isAuthRoute(url)) {
    try {
      await refreshAccessToken();
      res = await fetch(PUBLIC_API_URL + url, requestOptions);
    } catch {
      // Keep the original response error, which is the error for the request
      // the caller actually made.
    }
  }

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};
