const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export default class MicroblogApiClient {
  base_url: string;

  constructor(onError: () => void) {
    this.onError = onError;
    this.base_url = BASE_API_URL + '/api';
  }

  async request(options: any) {
    let response = await this.requestInternal(options);
    if (response.status === 401 && options.url !== '/tokens') {
      const refreshResponse = await this.put('/tokens', {
        access_token: localStorage.getItem('accessToken'),
      });
      if (refreshResponse.ok) {
        localStorage.setItem('accessToken', refreshResponse.body.access_token);
        response = await this.requestInternal(options);
      }
    }
    if (response.status >= 500 && this.onError) {
      this.onError(response);
    }
    return response;
  }

  async requestInternal(options: any) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response: any;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          ...options.headers,
        },
        credentials: options.url === '/tokens' ? 'include' : 'omit',
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorString = error.toString();
        response = {
          ok: false,
          status: 500,
          json: async () => { return {
            code: 500,
            message: 'The server is unresponsive',
            description: errorString,
          }; }
        };
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
  }

  async get(url: string, query?: any, options?: any) {
    return this.request({method: 'GET', url, query, ...options});
  }

  async post(url: string, body?: any, options?: any) {
    return this.request({method: 'POST', url, body, ...options});
  }

  async put(url: string, body?: any, options?: any) {
    return this.request({method: 'PUT', url, body, ...options});
  }

  async delete(url: string, options?: any) {
    return this.request({method: 'DELETE', url, ...options});
  }

  async login(username: string, password: string) {
    const response = await this.post('/tokens', null, {
      headers: {
        Authorization:  'Basic ' + btoa(username + ":" + password)
      }
    });
    if (!response.ok) {
      return response.status === 401 ? 'fail' : 'error';
    }
    localStorage.setItem('accessToken', response.body.access_token);
    return 'ok';
  }

  async logout() {
    await this.delete('/tokens');
    localStorage.removeItem('accessToken');
  }

  isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
  }
}