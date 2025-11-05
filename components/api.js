import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://backend-fellsystem.vercel.app';

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
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  // If response is JSON-like try parse, otherwise return text
  if (ct.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      const json = text ? JSON.parse(text) : null;
      if (!res.ok) throw json || { message: `HTTP ${res.status}` };
      return json;
    } catch (err) {
      if (res.ok) return text; // server returned invalid JSON but status ok
      throw err;
    }
  }
  if (!res.ok) throw { message: `HTTP ${res.status}`, body: text };
  return text;
}

export async function getProfile() {
  const tryPaths = ['/auth/me', '/users/me', '/me', '/profile', '/custumers/me', '/customers/me', '/customer/me'];
  for (const p of tryPaths) {
    try {
      const result = await apiFetch(p);
      if (result) {
        // normalize common response shapes into { nome, sobrenome, email, username, dataEntrada, profilePic }
        const src = result.data || result.user || result.customer || result;
        const email = src.email || src.emailAddress || src.username || src.user_email;
        const username = src.username || src.userName || src.login || src.user || email;
        const nome = src.nome || src.name || src.firstName || src.first_name || (src.fullName ? src.fullName.split(' ')[0] : '') || '';
        const sobrenome = src.sobrenome || src.lastName || src.last_name || (src.fullName ? src.fullName.split(' ').slice(1).join(' ') : '') || '';
        const created = src.createdAt || src.created_at || src.registeredAt || src.dataEntrada || src.date || null;
        const dataEntrada = created ? new Date(created).toLocaleDateString() : null;
        const profilePic = src.avatar || src.picture || src.profilePic || src.image || null;
        return { nome, sobrenome, email, username, dataEntrada, profilePic };
      }
    } catch (e) {
      // continue trying other endpoints
    }
  }
  return null;
}

export async function updateProfile(payload) {
  const tryPaths = ['/users/me', '/profile', '/auth/me', '/custumers/me', '/customers/me'];
  for (const p of tryPaths) {
    try {
      // map local payload to common API shapes
      const body = Object.assign({}, payload);
      // if user provided nome/sobrenome, also add name/firstName/lastName
      if (payload.nome || payload.sobrenome) {
        body.name = `${payload.nome || ''}${payload.sobrenome ? ' ' + payload.sobrenome : ''}`.trim();
        body.firstName = payload.nome || payload.firstName || '';
        body.lastName = payload.sobrenome || payload.lastName || '';
      }
      const result = await apiFetch(p, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      return result;
    } catch (e) {
      // try PUT as fallback
      try {
        const body = Object.assign({}, payload);
        if (payload.nome || payload.sobrenome) {
          body.name = `${payload.nome || ''}${payload.sobrenome ? ' ' + payload.sobrenome : ''}`.trim();
          body.firstName = payload.nome || payload.firstName || '';
          body.lastName = payload.sobrenome || payload.lastName || '';
        }
        const resultPut = await apiFetch(p, {
          method: 'PUT',
          body: JSON.stringify(body),
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
