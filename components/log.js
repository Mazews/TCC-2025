export function maskToken(token) {
  if (!token || typeof token !== 'string') return token;
  if (token.length <= 16) return token;
  return token.slice(0, 8) + '...' + token.slice(-8);
}

export function safeLog(label, value) {
  try {
    if (typeof value === 'string' && value.split('.').length === 3) {
      // Looks like a JWT — mask it
      console.log(label, maskToken(value));
      return;
    }
    console.log(label, value);
  } catch (e) {
    console.log(label, value);
  }
}

export function safeError(label, err) {
  try {
    console.error(label, err && err.message ? err.message : err);
  } catch (e) {
    console.error(label, err);
  }
}
