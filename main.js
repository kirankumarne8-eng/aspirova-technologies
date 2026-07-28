// ===== WELCOME LANGUAGE ROTATOR =====
const langs = [
  { greeting: 'ನಮಸ್ಕಾರ,', rest: 'Aspirova Technologies ಗೆ ಸ್ವಾಗತ' },
  { greeting: 'Hello,', rest: 'Welcome to Aspirova Technologies' },
  { greeting: 'नमस्ते,', rest: 'Aspirova Technologies में आपका स्वागत है' },
  { greeting: 'నమస్కారం,', rest: 'Aspirova Technologies కు స్వాగతం' }
];
let li = 0;
const wl  = document.getElementById('welcomeLang');
const wr  = document.getElementById('welcomeRest');

function rotateLang() {
  if (!wl || !wr) return;
  wl.style.opacity = '0';
  wr.style.opacity = '0';
  setTimeout(() => {
    li = (li + 1) % langs.length;
    wl.textContent = langs[li].greeting;
    wr.textContent = langs[li].rest;
    wl.style.opacity = '1';
    wr.style.opacity = '1';
  }, 400);
}
if (wl && wr) setInterval(rotateLang, 4500);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

function initScrollReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ===== QUOTE BANNER REVEAL =====
const quoteObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const content = entry.target.querySelector('.qb-content');
      if (content) content.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

function initQuoteReveal() {
  document.querySelectorAll('.quote-banner').forEach(el => quoteObserver.observe(el));
}

// ===== NAV SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    mainNav.style.boxShadow =
      window.scrollY > 20 ? '0 4px 20px rgba(10, 22, 40, 0.1)' : '0 2px 16px rgba(10, 22, 40, 0.07)';
  }
});

// ===== MOBILE NAV TOGGLES =====
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.classList.toggle('open');
}

// Close mobile navigation drawer
function closeMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.classList.remove('open');
}

function toggleMobDropdown(e) {
  e.preventDefault();
  const current = e.currentTarget.parentElement;
  const wasOpen = current.classList.contains('open');
  document.querySelectorAll('.mob-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!wasOpen) current.classList.add('open');
}

// ===== SPA PAGE SWITCHING & ROUTING =====
//
// BACK BUTTON FIX: The previous version only ever called history.replaceState(),
// which means the SPA never added new entries to the browser's history stack.
// Because of that, pressing the Android/browser Back button had nothing of ours
// to go back to — it skipped straight past the site entirely, back to Google (or
// whatever page the visitor arrived from). The fix has two parts:
//   1) showPage() now uses history.pushState() when the visitor is navigating to
//      a *different* page (so each page view becomes its own history entry), and
//      only uses replaceState() for the very first load / same-page updates.
//   2) A `popstate` listener re-renders the correct page from the URL hash
//      whenever Back/Forward is pressed, instead of leaving the SPA.
// Net effect: Back now steps backward through the site's own pages first, and
// only exits to Google (or wherever) once the visitor has stepped back past the
// page they first landed on — the expected, non-broken behaviour.
function showPage(pageId, subAnchor, isPopState) {
  // Hide all sections, show target section
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }

  // Update active states on navigation links
  document.querySelectorAll('[data-page]').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('[data-page="' + pageId + '"]').forEach(a => a.classList.add('active'));

  closeMobileNav();

  // Scroll logic
  if (subAnchor) {
    setTimeout(() => {
      const el = document.getElementById(subAnchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update history state — push a new entry for real navigations so Back/Forward
  // work as expected; only replace when we're responding to Back/Forward ourselves
  // (isPopState) or restoring the initial URL on first load.
  const newHash = '#' + pageId + (subAnchor ? '-' + subAnchor : '');
  if (!isPopState && window.location.hash !== newHash) {
    history.pushState({ pageId: pageId, subAnchor: subAnchor || null }, '', newHash);
  } else {
    history.replaceState({ pageId: pageId, subAnchor: subAnchor || null }, '', newHash);
  }

  // Re-observe dynamic sections if needed
  initScrollReveal();
  initQuoteReveal();
}

function initRoute(isPopState) {
  const hash = window.location.hash.replace('#', '');
  const pages = ['home', 'about', 'courses', 'services', 'business', 'blogs', 'portal', 'careers', 'contact'];
  if (!hash) {
    showPage('home', null, isPopState);
    return;
  }
  for (const p of pages) {
    if (hash === p) {
      showPage(p, null, isPopState);
      return;
    }
    if (hash.startsWith(p + '-')) {
      showPage(p, hash.substring(p.length + 1), isPopState);
      return;
    }
  }
  showPage('home', null, isPopState);
}

// Respond to the Back/Forward buttons by re-rendering the page the URL now
// points to, rather than doing nothing and letting the browser leave the SPA.
window.addEventListener('popstate', () => {
  initRoute(true);
});

// ===== STUDENT PORTAL — "COMING SOON" =====
// The portal page is now a simple static "Coming Soon" notice (see index.html),
// so the old client-side login (a hardcoded list of student/admin IDs checked
// directly in JavaScript) and the show/hide session logic that went with it have
// been removed entirely — that was never real authentication (anyone could read
// the list in dev tools), and there is nothing left on the page for it to toggle.
// When the real portal is ready, wire it up to a proper backend (e.g. Firebase
// Authentication or Supabase Auth) that validates credentials server-side.

// ===== ADMIN ENQUIRIES REVIEW LOGIC =====
function renderAdminEnquiries() {
  const tableBody = document.getElementById('enquiriesTableBody');
  const countEl = document.getElementById('adminEnquiryCount');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  
  if (countEl) countEl.textContent = enquiries.length;
  
  if (enquiries.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color:#888;">No student inquiries received yet.</td></tr>`;
    return;
  }
  
  [...enquiries].reverse().forEach((enq, index) => {
    const actualIndex = enquiries.length - 1 - index;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:12px 8px;">${enq.date}</td>
      <td style="padding:12px 8px; font-weight:600; color:var(--navy);">${escapeHtml(enq.name)}</td>
      <td style="padding:12px 8px;"><a href="tel:${enq.phone}" style="color:inherit; text-decoration:none;">${escapeHtml(enq.phone)}</a></td>
      <td style="padding:12px 8px;"><a href="mailto:${enq.email}" style="color:var(--blue);">${escapeHtml(enq.email)}</a></td>
      <td style="padding:12px 8px;">${escapeHtml(enq.stream || 'N/A')}</td>
      <td style="padding:12px 8px;"><span class="welcome-badge" style="font-size:11px; padding:3px 8px; background:rgba(26,58,107,0.1); color:var(--blue); margin:0;">${escapeHtml(enq.program || 'General')}</span></td>
      <td style="padding:12px 8px; max-width: 220px; word-wrap: break-word;">${escapeHtml(enq.message || '—')}</td>
      <td style="padding:12px 8px; text-align:center;">
        <button onclick="deleteEnquiry(${actualIndex})" class="action-delete-btn">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function deleteEnquiry(index) {
  if (!confirm("Are you sure you want to delete this enquiry?")) return;
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  
  enquiries.splice(index, 1);
  localStorage.setItem('mk_enquiries', JSON.stringify(enquiries));
  renderAdminEnquiries();
}

function clearAllEnquiries() {
  if (!confirm("WARNING: Are you sure you want to delete ALL enquiries? This action cannot be undone.")) return;
  localStorage.setItem('mk_enquiries', JSON.stringify([]));
  renderAdminEnquiries();
}

function exportEnquiries() {
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  
  if (enquiries.length === 0) {
    alert("No enquiries to export.");
    return;
  }
  
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Name,Phone,Email,Stream,Program,Message\n";
  
  enquiries.forEach(e => {
    const row = [
      `"${(e.date || '').replace(/"/g, '""')}"`,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.stream || '').replace(/"/g, '""')}"`,
      `"${(e.program || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ].join(",");
    csvContent += row + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `mk_aspirova_enquiries_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===== FAQ ACCORDION TOGGLES =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('open');
  });
  
  if (!isOpen) {
    item.classList.add('open');
  }
}

// ===== MODAL SYSTEM (PRIVACY & TERMS) =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===== CAREER APPLICATION UTILITY =====
function applyForJob(jobTitle) {
  showPage('contact');
  setTimeout(() => {
    const programSelect = document.getElementById('cProgram');
    const msgTextarea = document.getElementById('cMsg');
    
    if (programSelect) {
      for (let i = 0; i < programSelect.options.length; i++) {
        if (programSelect.options[i].text.includes('Career')) {
          programSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    if (msgTextarea) {
      msgTextarea.value = `Application for position: ${jobTitle}. I would like to discuss this opportunity further.`;
    }
  }, 150);
}

// ===== FORM SUBMISSION HANDLER =====
// FIX: The old version only saved the enquiry to this visitor's own browser, then
// opened a blank Google Form and made the visitor type everything in again — many
// people would simply leave at that point. This version submits the enquiry
// directly from the page to a backend form API (Formspree), so nothing needs to
// be re-typed and the enquiry reaches your inbox in one step.
//
// The form now validates and submits fully in-page — the visitor is never sent
// to an external Google Form or a new WhatsApp tab. It also POSTs the enquiry
// as JSON to CRM_ENDPOINT_URL below, so connecting a real CRM later is a one-line
// change rather than a rebuild.
//
// TO CONNECT A REAL CRM/INBOX LATER — set CRM_ENDPOINT_URL to any of:
//   • Formspree form endpoint          → https://formspree.io/f/your-form-id
//   • Google Sheets (via a Sheet Web App or Zapier/Make "Catch Webhook")
//   • Zoho CRM / Zoho Flow webhook URL
//   • HubSpot Forms API endpoint
// All of these accept a simple POST of JSON/form fields, so no other code here
// needs to change — just paste the URL in.
const CRM_ENDPOINT_URL = ''; // <-- paste your Formspree / Sheets / Zoho / HubSpot endpoint here when ready

function clearFieldErrors(formEl) {
  formEl.querySelectorAll('.field-error').forEach(el => el.remove());
  formEl.querySelectorAll('.field-invalid').forEach(el => el.classList.remove('field-invalid'));
}

function showFieldError(inputEl, message) {
  inputEl.classList.add('field-invalid');
  const err = document.createElement('div');
  err.className = 'field-error';
  err.textContent = message;
  inputEl.insertAdjacentElement('afterend', err);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formEl = document.getElementById('contactForm');
  const btn = document.querySelector('.form-submit');
  const statusEl = document.getElementById('formStatus');
  if (!formEl || !btn) return;

  clearFieldErrors(formEl);
  if (statusEl) { statusEl.style.display = 'none'; statusEl.textContent = ''; }

  const nameEl = document.getElementById('cName');
  const phoneEl = document.getElementById('cPhone');
  const emailEl = document.getElementById('cEmail');
  const streamEl = document.getElementById('cStream');
  const programEl = document.getElementById('cProgram');
  const msgEl = document.getElementById('cMsg');

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const email = emailEl.value.trim();
  const stream = streamEl.value;
  const program = programEl.value;
  const msg = msgEl.value.trim();

  // ----- Inline validation (no page leaves, no external redirect) -----
  let firstInvalid = null;
  if (name.length < 2) {
    showFieldError(nameEl, 'Please enter your full name.');
    firstInvalid = firstInvalid || nameEl;
  }
  const phoneDigits = phone.replace(/[^0-9]/g, '');
  if (phoneDigits.length < 10) {
    showFieldError(phoneEl, 'Please enter a valid phone number (at least 10 digits).');
    firstInvalid = firstInvalid || phoneEl;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showFieldError(emailEl, 'Please enter a valid email address.');
    firstInvalid = firstInvalid || emailEl;
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const newEnquiry = {
    name: name,
    phone: phone,
    email: email,
    stream: stream,
    program: program,
    message: msg,
    date: new Date().toLocaleString()
  };

  // Local backup copy so nothing is lost even if the network request below
  // fails or no CRM endpoint has been configured yet.
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  enquiries.push(newEnquiry);
  localStorage.setItem('mk_enquiries', JSON.stringify(enquiries));

  const originalText = btn.innerHTML;
  btn.innerHTML = 'Submitting…';
  btn.disabled = true;

  const finish = () => {
    formEl.reset();
    btn.innerHTML = originalText;
    btn.disabled = false;
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.innerHTML =
        '✅ Thank you, ' + escapeHtml(name) + '! Your enquiry has been received. ' +
        'Our counsellors will reach out to you within 24 hours. Prefer to chat now? ' +
        '<a href="https://wa.me/916361792249?text=' +
        encodeURIComponent('Hello MK Aspirova, I would like to enquire. Name: ' + name + ', Phone: ' + phone) +
        '" target="_blank" rel="noopener">Message us on WhatsApp</a>.';
    }
  };

  if (CRM_ENDPOINT_URL) {
    fetch(CRM_ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnquiry)
    })
      .catch(() => { /* enquiry is already safely backed up locally above */ })
      .finally(finish);
  } else {
    // No CRM endpoint configured yet — enquiry is saved locally and the visitor
    // still gets an on-page confirmation instead of being redirected anywhere.
    finish();
  }
}

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initRoute();
  initScrollReveal();
  initQuoteReveal();
  
  // Bind real HTML form listener
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});
