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

export const request = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  const res = await fetch(PUBLIC_API_URL + url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const body: ApiErrorBody = await res.json();
    throw new Error(body.message || "Failed Sending The Request");
  }

  return res.json() as Promise<T>;
};
