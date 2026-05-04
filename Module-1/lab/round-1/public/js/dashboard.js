/* ============================================================
   dashboard.js — Protected dashboard page
   ============================================================ */
'use strict';

const token = localStorage.getItem('authToken');
if (!token) {
  window.location.replace('/');
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
// Load profile
// ---------------------------------------------------------------------------
async function loadProfile() {
  try {
    const res = await fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();
    const user = data.user;

    document.getElementById('navUsername').textContent = user.username;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileCreated').textContent = new Date(user.created_at).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    // Non-critical; silently fail
  }
}

loadProfile();

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  window.location.replace('/');
}

document.getElementById('logoutBtn').addEventListener('click', logout);

// ---------------------------------------------------------------------------
// Change password
// ---------------------------------------------------------------------------
document.getElementById('changePasswordForm').addEventListener('submit', async e => {
  e.preventDefault();
  hideAlert('cpError');
  hideAlert('cpSuccess');

  const btn            = e.target.querySelector('[type="submit"]');
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword     = document.getElementById('newPassword').value;
  const confirmNew      = document.getElementById('confirmNew').value;

  if (newPassword !== confirmNew) {
    showAlert('cpError', 'New passwords do not match.');
    return;
  }

  setLoading(btn, true);

  try {
    const res = await fetch('/api/user/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('cpError', data.error || 'Failed to change password.');
      return;
    }

    showAlert('cpSuccess', data.message);
    e.target.reset();
    // Reset strength bar
    const bar = document.getElementById('strengthBar');
    if (bar) {
      bar.style.setProperty('--strength', '0%');
      bar.style.setProperty('--strength-color', '#e2e8f0');
    }
  } catch {
    showAlert('cpError', 'Network error. Please try again.');
  } finally {
    setLoading(btn, false);
  }
});
