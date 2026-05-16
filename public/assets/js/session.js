/**
 * SESSION MANAGER - Sincronización Frontend/Backend
 */

const SessionManager = (() => {
  const SESSION_KEY = 'sessionId';
  let socket = null;

  async function init() {
    try {
      const res = await fetch(window.API_BASE_URL + '/api/session', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, data.sessionId);
        connect();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  function connect() {
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) return;
    socket = io(window.API_BASE_URL);
    socket.on('connect', () => {
      socket.emit('registerSession', sessionId);
    });
  }

  function getSessionId() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function waitForAction(handlers = {}) {
    connect();
    if (!socket) return;
    const handle = ({ action }) => {
      if (handlers[action]) {
        socket.off('action', handle);
        handlers[action]();
      }
    };
    socket.on('action', handle);
  }

  return { init, getSessionId, connect, waitForAction };
})();

console.log('✅ SessionManager cargado');