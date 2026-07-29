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
// BACK BUTTON FIX: the previous version called history.replaceState() on every
// navigation. replaceState() never adds a new entry to the browser's history
// stack -- it just overwrites the current one. That meant no matter how many
// "pages" a visitor clicked through inside this single-page app, the entire
// session was still just ONE entry in the browser's history. So the very first
// press of the Android back button had nowhere in the app to go back to, and
// the browser fell through to whatever was open before the site (e.g. Google
// search results), making it look like the site "exits immediately".
//
// Fix: use history.pushState() for real, user-initiated navigations so each
// page the visitor visits becomes its own history entry, and only use
// replaceState() for the very first page load and for syncing state when the
// back/forward buttons are pressed (popstate) so we don't create duplicate
// entries in that case.
let isHandlingPopState = false;

function showPage(pageId, subAnchor, pushHistory) {
  if (pushHistory === undefined) pushHistory = true;

  // Hide all sections, show target section
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  } else {
    pageId = 'home';
    const home = document.getElementById('page-home');
    if (home) home.classList.add('active');
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
  } else if (!isHandlingPopState) {
    // Don't force-scroll to top when we're just restoring state after a
    // back/forward press -- let the browser handle scroll restoration.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update history state: push a new entry for real navigations so the
  // Back button has somewhere in the app to go, otherwise just sync the URL.
  const newHash = '#' + pageId + (subAnchor ? '-' + subAnchor : '');
  const state = { pageId: pageId, subAnchor: subAnchor || null };
  if (pushHistory && !isHandlingPopState) {
    if (window.location.hash !== newHash) {
      history.pushState(state, '', newHash);
    } else {
      history.replaceState(state, '', newHash);
    }
  } else {
    history.replaceState(state, '', newHash);
  }

  // Re-observe dynamic sections if needed
  initScrollReveal();
  initQuoteReveal();
}

function resolveRoute(hash) {
  const pages = ['home', 'about', 'courses', 'services', 'business', 'blogs', 'portal', 'careers', 'certificate-verification', 'contact'];
  hash = (hash || '').replace('#', '');
  if (!hash) return { page: 'home', subAnchor: null };
  for (const p of pages) {
    if (hash === p) return { page: p, subAnchor: null };
    if (hash.startsWith(p + '-')) return { page: p, subAnchor: hash.substring(p.length + 1) };
  }
  return { page: 'home', subAnchor: null };
}

function initRoute() {
  const route = resolveRoute(window.location.hash);
  // Initial load: sync to the URL without pushing a new history entry.
  showPage(route.page, route.subAnchor, false);
}

// Handle Back / Forward button presses: re-render the target page without
// pushing another history entry (that would fight with the browser's own
// back/forward stack).
window.addEventListener('popstate', (e) => {
  isHandlingPopState = true;
  const route = e.state
    ? { page: e.state.pageId, subAnchor: e.state.subAnchor }
    : resolveRoute(window.location.hash);
  showPage(route.page, route.subAnchor, false);
  isHandlingPopState = false;
});

// ===== STUDENT PORTAL LOGIN =====
// NOTE ON SECURITY: this is a simple CLIENT-SIDE gate, not real server-side
// authentication. The credential list below ships inside this file, so anyone
// who opens browser dev tools / view-source can read it. That's an acceptable
// trade-off for gating a handful of recorded class videos, but do NOT rely on
// this to protect anything sensitive (grades, personal data, payments, etc).
// If that need ever comes up, replace this with real auth — e.g. Firebase
// Authentication or Supabase Auth — which checks credentials on a server.
//
// Edit this list to add/remove students. id and password are case-insensitive
// on the id, case-sensitive on the password.
const portalCredentials = [
  { id: 'ASP-STU-001', password: 'ChangeMe@123', name: 'Student' }
  // { id: 'ASP-STU-002', password: 'AnotherPass1', name: 'Student Name' },
];

function validatePortalAccess(studentId, password) {
  const idNorm = (studentId || '').trim().toLowerCase();
  const match = portalCredentials.find(
    c => c.id.toLowerCase() === idNorm && c.password === password
  );
  return match || null;
}

function checkPortalSession() {
  const loginCard = document.getElementById('portalLoginCard');
  const unlockedContent = document.getElementById('portalUnlockedContent');
  const savedName = sessionStorage.getItem('mkPortalStudentName');

  if (sessionStorage.getItem('mkPortalAccess') === 'true') {
    if (loginCard) loginCard.style.display = 'none';
    if (unlockedContent) unlockedContent.style.display = 'block';
    const welcomeEl = document.getElementById('portalWelcomeName');
    if (welcomeEl && savedName) welcomeEl.textContent = savedName;
    renderPortalVideos('all');
  } else {
    if (loginCard) loginCard.style.display = 'block';
    if (unlockedContent) unlockedContent.style.display = 'none';
  }
}

function lockPortalSession() {
  sessionStorage.removeItem('mkPortalAccess');
  sessionStorage.removeItem('mkPortalStudentName');
  const loginCard = document.getElementById('portalLoginCard');
  const unlockedContent = document.getElementById('portalUnlockedContent');
  const idInput = document.getElementById('studentIdInput');
  const pwInput = document.getElementById('studentPasswordInput');

  if (idInput) idInput.value = '';
  if (pwInput) pwInput.value = '';
  if (unlockedContent) unlockedContent.style.display = 'none';
  if (loginCard) loginCard.style.display = 'block';
}

function initPortalLoginForm() {
  const form = document.getElementById('portalLoginForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idInput = document.getElementById('studentIdInput');
    const pwInput = document.getElementById('studentPasswordInput');
    const errorEl = document.getElementById('err-portalLogin');

    const studentId = idInput.value.trim();
    const password = pwInput.value;

    if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }

    if (!studentId || !password) {
      if (errorEl) { errorEl.textContent = 'Please enter both your Student ID and password.'; errorEl.classList.add('visible'); }
      return;
    }

    const match = validatePortalAccess(studentId, password);
    if (match) {
      sessionStorage.setItem('mkPortalAccess', 'true');
      sessionStorage.setItem('mkPortalStudentName', match.name || match.id);
      checkPortalSession();
    } else {
      if (errorEl) { errorEl.textContent = 'Incorrect Student ID or password. Please try again or contact your coordinator.'; errorEl.classList.add('visible'); }
      pwInput.value = '';
    }
  });
}

// Dynamic module sorting and rendering
function renderPortalVideos(filter = 'all') {
  const container = document.getElementById('portalVideosContainer');
  if (!container) return;
  container.innerHTML = '';
  
  // Update active state class on tab buttons
  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  tabBtns.forEach(btn => {
    const btnFilter = btn.getAttribute('data-filter') || 'all';
    if (btnFilter === filter) {
      btn.style.background = 'var(--navy)';
      btn.style.color = '#fff';
    } else {
      btn.style.background = 'var(--offwhite)';
      btn.style.color = 'var(--navy)';
    }
  });

  let hasVideos = false;
  // If "all", loop through all module list keys, otherwise only the filtered key
  const keys = filter === 'all' ? ['java', 'python', 'embedded_iot', 'c_cpp'] : [filter];
  
  // Safety check in case videosData isn't loaded from videos-list.js yet
  const data = (typeof videosData !== 'undefined') ? videosData : { java: [], python: [], embedded_iot: [], c_cpp: [] };
  
  keys.forEach(key => {
    const list = data[key] || [];
    list.forEach(video => {
      hasVideos = true;
      const card = document.createElement('div');
      card.className = 'video-card reveal visible';
      
      // Map keys to cleaner human-readable tags
      let tagLabel = key.replace('_', ' ');
      if (tagLabel === 'c cpp') tagLabel = 'C / C++';
      
      // Determine if path is web embed link or local MP4 file
      const pathStr = video.path ? video.path.toLowerCase() : '';
      const isEmbed = pathStr.startsWith('http') || pathStr.includes('youtube') || pathStr.includes('drive.google.com') || pathStr.includes('player.vimeo');
      
      let playerHtml = '';
      if (isEmbed) {
        playerHtml = `<iframe src="${video.path}" width="100%" height="100%" frameborder="0" allowfullscreen style="border: none;"></iframe>`;
      } else {
        playerHtml = `
          <video width="100%" height="100%" controls style="object-fit: cover; outline: none;">
            <source src="${video.path}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }
      
      card.innerHTML = `
        <div style="position: relative; height: 180px; background: #000;">
          ${playerHtml}
        </div>
        <div class="video-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="welcome-badge" style="font-size:10px; padding:3px 8px; margin:0; text-transform:uppercase; background:rgba(26,58,107,0.1); color:var(--blue); font-weight:700;">${tagLabel}</span>
            <span style="font-size:11px; color:#888;">${video.duration}</span>
          </div>
          <h4>${video.title}</h4>
          <p>${video.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });
  });
  
  if (!hasVideos) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 48px; border: 1.5px dashed #E5E9F2; border-radius: 16px;">
        <span style="font-size: 36px; display:block; margin-bottom:12px;"><svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
        <h4 style="font-family:'Syne',sans-serif; color:var(--navy); margin-bottom:4px;">No Class Videos Found</h4>
        <p style="font-size:13px; color:#888; margin:0;">Drop your MP4 recordings inside <code>videos/${filter}</code> and run the <code>update-videos.ps1</code> script.</p>
      </div>
    `;
  }
}

function filterPortalVideos(moduleName) {
  renderPortalVideos(moduleName);
}

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

// ===== CONTACT FORM: VALIDATION =====
function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
    el.classList.remove('field-invalid');
  });
}

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById('err-' + inputId);
  if (input) input.classList.add('field-invalid');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function validateContactForm(data) {
  clearFieldErrors();
  let firstInvalid = null;
  let isValid = true;

  if (!data.name || data.name.length < 2) {
    setFieldError('cName', 'Please enter your full name.');
    isValid = false;
    firstInvalid = firstInvalid || 'cName';
  }

  // Accepts optional +country code, spaces/dashes, 10-15 digits overall.
  const phoneDigits = data.phone.replace(/[^0-9]/g, '');
  if (!data.phone || phoneDigits.length < 10 || phoneDigits.length > 13) {
    setFieldError('cPhone', 'Please enter a valid phone number (at least 10 digits).');
    isValid = false;
    firstInvalid = firstInvalid || 'cPhone';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailPattern.test(data.email)) {
    setFieldError('cEmail', 'Please enter a valid email address.');
    isValid = false;
    firstInvalid = firstInvalid || 'cEmail';
  }

  if (firstInvalid) {
    const el = document.getElementById(firstInvalid);
    if (el) el.focus();
  }

  return isValid;
}

// ===== CONTACT FORM: CRM INTEGRATION HOOK =====
// This is the single place to wire the enquiry up to a real backend later.
// Drop in a fetch() call to whichever service you connect first — the
// payload shape below already matches what most of these expect:
//
//   Email (e.g. Formspree/Resend):
//     await fetch('https://formspree.io/f/your-form-id', {
//       method: 'POST', headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(enquiry)
//     });
//
//   Google Sheets (via Apps Script Web App or Sheet.best):
//     await fetch('https://script.google.com/macros/s/XXXX/exec', {
//       method: 'POST', body: JSON.stringify(enquiry)
//     });
//
//   Zoho CRM / HubSpot:
//     Use their Forms/Leads API endpoint and API key the same way.
//
// Until one of those is connected, the enquiry is only kept locally
// (see localStorage below) so the form still works end-to-end today.
async function sendEnquiryToCRM(enquiry) {
  // TODO: replace with a real fetch() call once an endpoint is chosen.
  return Promise.resolve({ ok: true, queued: true });
}

// ===== FORM SUBMISSION HANDLER =====
// The form now validates on this page, stores/queues the enquiry, and shows
// an on-page confirmation instead of sending visitors to an external Google
// Form. WhatsApp is offered as an optional, one-click way to continue the
// conversation immediately -- it is no longer required to complete the enquiry.
async function handleFormSubmit(e) {
  e.preventDefault();

  const btn = document.querySelector('.form-submit');
  if (!btn) return;

  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const stream = document.getElementById('cStream').value;
  const program = document.getElementById('cProgram').value;
  const msg = document.getElementById('cMsg').value.trim();

  const newEnquiry = {
    name: name,
    phone: phone,
    email: email,
    stream: stream,
    program: program,
    message: msg,
    date: new Date().toLocaleString()
  };

  if (!validateContactForm(newEnquiry)) {
    return;
  }

  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg> Submitting...';
  btn.disabled = true;

  try {
    await sendEnquiryToCRM(newEnquiry);
  } catch (err) {
    // Even if the (future) CRM call fails, don't strand the visitor --
    // the enquiry is still saved locally below and they can also reach us
    // on WhatsApp immediately.
  }

  // Local backup copy so the enquiry isn't lost even before a CRM is connected.
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  enquiries.push(newEnquiry);
  localStorage.setItem('mk_enquiries', JSON.stringify(enquiries));

  const enquiryText = [
    'Hello MK Aspirova, I would like to enquire.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Stream: ${stream || 'Not specified'}`,
    `Program: ${program || 'Not specified'}`,
    `Message: ${msg || 'Not specified'}`
  ].join('\n');
  const whatsappLink = document.getElementById('formWhatsappLink');
  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/916361792249?text=${encodeURIComponent(enquiryText)}`;
  }

  const formEl = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccessMsg');
  clearFieldErrors();
  if (formEl) formEl.reset();
  if (successMsg) {
    successMsg.classList.add('visible');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// ===== CERTIFICATE VERIFICATION =====
// STUB: There is no certificate database connected yet. This checks the
// entered ID against an (empty) local list purely so the page works
// end-to-end today. To go live, replace verifyCertificateId() with a call to
// your backend, e.g.:
//
//   async function verifyCertificateId(certId) {
//     const res = await fetch(`https://your-api.com/certificates/${certId}`);
//     if (!res.ok) return null;
//     return res.json(); // { name, program, issueDate }
//   }
//
const issuedCertificates = {
  'ASP-2026-000123': { name: 'Jane Doe', program: 'Java Development Internship', issueDate: '12 Jun 2026' },
  'ASP-2026-000124': { name: 'Sample Student', program: 'Java Certification Program', issueDate: '20 Jul 2026' }
  // Add more real records above in the same format, then remove these two samples.
};

async function verifyCertificateId(certId) {
  return issuedCertificates[certId.trim().toUpperCase()] || null;
}

function initCertVerifyForm() {
  const form = document.getElementById('certVerifyForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('certIdInput');
    const errorEl = document.getElementById('err-certIdInput');
    const resultEl = document.getElementById('certVerifyResult');
    const btn = form.querySelector('.form-submit');
    const certId = input.value.trim();

    input.classList.remove('field-invalid');
    if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
    if (resultEl) { resultEl.className = 'cert-verify-result'; resultEl.innerHTML = ''; }

    if (!certId) {
      input.classList.add('field-invalid');
      if (errorEl) { errorEl.textContent = 'Please enter a Certificate ID.'; errorEl.classList.add('visible'); }
      input.focus();
      return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Verifying...';
    btn.disabled = true;

    const record = await verifyCertificateId(certId);

    btn.innerHTML = originalText;
    btn.disabled = false;

    if (record) {
      resultEl.className = 'cert-verify-result cert-verify-success visible';
      resultEl.innerHTML = `
        <svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        <div>
          <strong>Certificate Verified</strong>
          <p>${escapeHtml(record.name)} — ${escapeHtml(record.program)}<br>Issued: ${escapeHtml(record.issueDate)}</p>
        </div>`;
    } else {
      resultEl.className = 'cert-verify-result cert-verify-notfound visible';
      resultEl.innerHTML = `
        <svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong>We couldn't verify this Certificate ID</strong>
          <p>Double-check the ID on your certificate, or <a href="javascript:void(0)" onclick="showPage('contact')">contact us</a> for help. (This tool is not yet linked to our full certificate records.)</p>
        </div>`;
    }
  });
}

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initRoute();
  initScrollReveal();
  initQuoteReveal();
  checkPortalSession();
  initPortalLoginForm();
  initCertVerifyForm();
  
  // Bind real HTML form listener
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});
