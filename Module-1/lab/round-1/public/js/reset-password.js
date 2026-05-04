/* ============================================================
   reset-password.js — Token-based password reset
   ============================================================ */
'use strict';

// ---------------------------------------------------------------------------
// Extract token from URL query string
// ---------------------------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const token  = params.get('token');

if (!token) {
  document.getElementById('resetError').textContent =
    'Invalid or missing reset token. Please request a new password reset.';
  document.getElementById('resetError').classList.remove('hidden');
  document.getElementById('resetForm').querySelector('[type="submit"]').disabled = true;
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------
function showAlert(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.remove('hidden');
}

function hideAlert(id) {
  document.getElementById(id).classList.add('hidden');
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.label;
}

document.querySelectorAll('button[type="submit"]').forEach(btn => {
  btn.dataset.label = btn.textContent;
});

// ---------------------------------------------------------------------------
// Password strength meter
// ---------------------------------------------------------------------------
function updateStrength(input, barId) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  const val = input.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%',   color: '#e2e8f0' },
    { pct: '25%',  color: '#ef4444' },
    { pct: '50%',  color: '#f97316' },
    { pct: '75%',  color: '#eab308' },
    { pct: '100%', color: '#22c55e' },
  ];
  const lvl = levels[score];
  bar.style.setProperty('--strength', lvl.pct);
  bar.style.setProperty('--strength-color', lvl.color);
}

document.getElementById('newPassword').addEventListener('input', e =>
  updateStrength(e.target, 'strengthBar')
);

// ---------------------------------------------------------------------------
// Form submission
// ---------------------------------------------------------------------------
document.getElementById('resetForm').addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert('resetError');
  hideAlert('resetSuccess');

  const btn      = e.target.querySelector('[type="submit"]');
  const password = document.getElementById('newPassword').value;
  const confirm  = document.getElementById('confirmPassword').value;

  if (password !== confirm) {
    showAlert('resetError', 'Passwords do not match.');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('resetError', data.error || 'Password reset failed.');
      return;
    }

    showAlert('resetSuccess', data.message + ' Redirecting to login…');
    e.target.reset();

    setTimeout(() => window.location.replace('/'), 2500);
  } catch {
    showAlert('resetError', 'Network error. Please try again.');
  } finally {
    setLoading(btn, false);
  }
});
