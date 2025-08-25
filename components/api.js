import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://backend-feelflow-core.onrender.com/custumers/login';

async function getToken() {
  try {
    const t = await AsyncStorage.getItem('userToken');
    return t;
  } catch (e) {
    return null;
  }
}

async function apiFetch(path, opts = {}) {
  const token = await getToken();
  const headers = Object.assign(
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    opts.headers || {}
  );
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers,
  });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw json || { message: `HTTP ${res.status}` };
    return json;
  } catch (err) {
    // If JSON parse failed but status ok, return raw text
    if (res.ok) return text;
    throw err;
  }
}

export async function getProfile() {
  const tryPaths = ['/auth/me', '/users/me', '/me', '/profile'];
  for (const p of tryPaths) {
    try {
      const result = await apiFetch(p);
      if (result) return result;
    } catch (e) {
      // continue trying other endpoints
    }
  }
  return null;
}

export async function updateProfile(payload) {
  const tryPaths = ['/users/me', '/profile', '/auth/me'];
  for (const p of tryPaths) {
    try {
      const result = await apiFetch(p, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return result;
    } catch (e) {
      // try PUT as fallback
      try {
        const resultPut = await apiFetch(p, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        return resultPut;
      } catch (e2) {
        // continue
      }
    }
  }
  throw new Error('Unable to update profile: no supported endpoint responded');
}

export default { getProfile, updateProfile, apiFetch };
