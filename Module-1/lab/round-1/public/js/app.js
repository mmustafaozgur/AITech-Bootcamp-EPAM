/* ============================================================
   app.js — Login / Register / Forgot Password
   ============================================================ */
'use strict';

// Redirect authenticated users straight to the dashboard
const existingToken = localStorage.getItem('authToken');
if (existingToken) {
  window.location.replace('/dashboard.html');
}

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

function showTab(id) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  tabContents.forEach(tc => {
    tc.classList.toggle('active', tc.id === `${id}Form` || tc.id === `${id}Form`);
  });

  // Reset alerts
  document.querySelectorAll('.alert').forEach(el => el.classList.add('hidden'));
}

tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

// ---------------------------------------------------------------------------
// Forgot password link / back link
// ---------------------------------------------------------------------------
document.getElementById('forgotLink').addEventListener('click', e => {
  e.preventDefault();
  tabs.forEach(t => t.classList.remove('active'));
  tabContents.forEach(tc => tc.classList.remove('active'));
  document.getElementById('forgotForm').classList.add('active');
});

document.getElementById('backToLogin').addEventListener('click', () => showTab('login'));

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

// Cache original button labels
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

document.getElementById('regPassword').addEventListener('input', e =>
  updateStrength(e.target, 'strengthBar')
);

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert('loginError');

  const btn = e.target.querySelector('[type="submit"]');
  setLoading(btn, true);

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('loginError', data.error || 'Login failed.');
      return;
    }

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    window.location.replace('/dashboard.html');
  } catch {
    showAlert('loginError', 'Network error. Please try again.');
  } finally {
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------
document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert('registerError');
  hideAlert('registerSuccess');

  const btn      = e.target.querySelector('[type="submit"]');
  const username = document.getElementById('regUsername').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;

  if (password !== confirm) {
    showAlert('registerError', 'Passwords do not match.');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('registerError', data.error || 'Registration failed.');
      return;
    }

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    window.location.replace('/dashboard.html');
  } catch {
    showAlert('registerError', 'Network error. Please try again.');
  } finally {
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------------------
// FORGOT PASSWORD
// ---------------------------------------------------------------------------
document.getElementById('forgotForm').addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert('forgotError');
  hideAlert('forgotSuccess');

  const btn   = e.target.querySelector('[type="submit"]');
  const email = document.getElementById('forgotEmail').value.trim();

  setLoading(btn, true);

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('forgotError', data.error || 'Request failed.');
      return;
    }

    showAlert('forgotSuccess', data.message);
    e.target.reset();
  } catch {
    showAlert('forgotError', 'Network error. Please try again.');
  } finally {
    setLoading(btn, false);
  }
});
