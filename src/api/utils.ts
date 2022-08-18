import { notification } from 'antd';
import queryString from 'query-string';
import { QueryParams } from '../types/general';

interface HTTPMethods {
  GET: keyof HTTPMethods;
  POST: keyof HTTPMethods;
  PUT: keyof HTTPMethods;
  DELETE: keyof HTTPMethods;
  PATCH: keyof HTTPMethods;
}

const httpMethods: HTTPMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

const handleResponse = async (response: Response): Promise<Response> => {
  if (
    response.status === 200 ||
    response.status === 201 ||
    response.status === 204
  ) {
    return response;
  } else {
    notification.error({
      message: 'An error occured. Please try again!',
    });
    return response;
  }
};

const createQueryFromParams = (params: any) => {
  let query = '';
  if (params && Object.keys(params).length) {
    query = `/?${queryString.stringify(params)}`;
  }

  return query;
};

const backendUrl = () => {
  
  const PROTOCOL = process.env.REACT_APP_BACKEND_PROTOCOL || 'http';
  const DOMAIN = process.env.REACT_APP_BACKEND_DOMAIN || 'localhost';
  const PORT = process.env.REACT_APP_BACKEND_PORT || '8000';
  const BACKEND_URL = `${PROTOCOL}://${DOMAIN}:${PORT}`;
  return BACKEND_URL;
};

export const api = {
  get: async (url: string, params?: QueryParams): Promise<Response> => {
    const query = createQueryFromParams(params);
    const fullUrl = `${backendUrl()}${url}${query}`;
    const response = await fetch(fullUrl, {
      method: httpMethods.GET,
    });
    return handleResponse(response);
  },
  post: async (
    url: string,
    body: any,
    params?: QueryParams,
  ): Promise<Response> => {
    const query = createQueryFromParams(params);
    const response = await fetch(`${backendUrl()}${url}${query}`, {
      method: httpMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },
  put: async (url: string, body: unknown): Promise<Response> => {
    const response = await fetch(`${backendUrl()}${url}`, {
      method: httpMethods.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (url: string, body?: unknown): Promise<Response> => {
    const requestInit: RequestInit = {
      method: httpMethods.DELETE,
    };

    if (body) {
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify(body);
    }
    const response = await fetch(`${backendUrl()}${url}`, {
      ...requestInit,
    });
    return handleResponse(response);
  },
};
