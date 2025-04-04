// lib/cookies.ts
export function getClientSideToken() {
    if (typeof window !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
    }
    return null;
  }