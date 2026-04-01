import axios from 'axios';
import { isStaticMode } from './config/staticMode.js';
import { handleStaticRequest } from './mocks/staticApiHandler.js';


const raw = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

export function setAuthToken(token) {
  if (token) {
    raw.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete raw.defaults.headers.common.Authorization;
  }
}

async function exec(method, url, data, config) {
  if (isStaticMode()) {
    const res = await handleStaticRequest(method.toLowerCase(), url, data, config);
    if (res.status >= 400) {
      const err = new Error(res.data?.error || 'So\'rov xatosi');
      err.response = res;
      throw err;
    }
    return res;
  }
  switch (method.toLowerCase()) {
    case 'get':
      return raw.get(url, config);
    case 'post':
      return raw.post(url, data, config);
    case 'patch':
      return raw.patch(url, data, config);
    case 'delete':
      return raw.delete(url, config);
    default:
      return raw.request({ method, url, data, ...config });
  }
}

const api = {
  get: (url, config) => exec('get', url, undefined, config),
  post: (url, data, config) => exec('post', url, data, config),
  patch: (url, data, config) => exec('patch', url, data, config),
  delete: (url, config) => exec('delete', url, undefined, config),
  defaults: raw.defaults,
};

export default api;
