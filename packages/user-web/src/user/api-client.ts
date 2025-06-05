
type Method = 'GET' | 'POST' | 'PATCH';

interface APIClientOptions {
  url: string;
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
}

export class APIClient {
  static async request<T>(options: APIClientOptions): Promise<T> {
    const {
      url,
      method = 'GET',
      body,
      headers = {},
    } = options;

    const fetchHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };
    // Si POST o PATCH, agrega Content-Type y body
    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`API error (${res.status}): ${res.statusText}`);
    }
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response from server');
    }

    return await res.json() as T;
  }
}
