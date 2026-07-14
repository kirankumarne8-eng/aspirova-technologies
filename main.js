// ===== WELCOME LANGUAGE ROTATOR =====
const langs = [
  { greeting: 'à²¨à²®à²¸à³à²•à²¾à²°,',  rest: 'Aspirova Technologies à²—à³† à²¸à³à²µà²¾à²—à²¤' },
  { greeting: 'Hello,',      rest: 'Welcome to Aspirova Technologies' },
  { greeting: 'à¤¨à¤®à¤¸à¥à¤¤à¥‡,',    rest: 'Aspirova Technologies à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ' },
  { greeting: 'à°¨à°®à°¸à±à°•à°¾à°°à°‚,', rest: 'Aspirova Technologies à°•à± à°¸à±à°µà°¾à°—à°¤à°‚' },
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
function showPage(pageId, subAnchor) {
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

  // Update history state
  history.replaceState(null, '', '#' + pageId + (subAnchor ? '-' + subAnchor : ''));
  
  // Re-observe dynamic sections if needed
  initScrollReveal();
  initQuoteReveal();
}

function initRoute() {
  const hash = window.location.hash.replace('#', '');
  const pages = ['home', 'about', 'courses', 'services', 'business', 'blogs', 'portal', 'careers', 'contact'];
  if (!hash) {
    showPage('home');
    return;
  }
  for (const p of pages) {
    if (hash === p) {
      showPage(p);
      return;
    }
    if (hash.startsWith(p + '-')) {
      showPage(p, hash.substring(p.length + 1));
      return;
    }
  }
  showPage('home');
}

// ===== STUDENT PORTAL â€” TEMPORARILY DISABLED =====
// SECURITY FIX: This portal previously checked a hardcoded array of student/admin
// IDs directly in this JavaScript file. That is not real authentication â€” anyone
// could open browser dev tools, read the list, and log in (including as admin).
// The insecure credential list and client-side check have been removed. The portal
// now always shows the "temporarily unavailable" notice until it is wired up to a
// real backend such as Firebase Authentication or Supabase Auth, which validates
// credentials on a server instead of inside the page's source code.

function validatePortalAccess() {
  // Disabled on purpose â€” see note above. No credentials are checked client-side.
  return;
}

function checkPortalSession() {
  // Always ensure any old/legacy session flag is cleared and the locked notice shows.
  sessionStorage.removeItem('mkPortalAccess');
  const loginCard = document.getElementById('portalLoginCard');
  const unlockedContent = document.getElementById('portalUnlockedContent');
  const adminContent = document.getElementById('portalAdminContent');
  if (loginCard) loginCard.style.display = 'block';
  if (unlockedContent) unlockedContent.style.display = 'none';
  if (adminContent) adminContent.style.display = 'none';
}

function lockPortalSession() {
  sessionStorage.removeItem('mkPortalAccess');
  const loginCard = document.getElementById('portalLoginCard');
  const unlockedContent = document.getElementById('portalUnlockedContent');
  const adminContent = document.getElementById('portalAdminContent');
  const inputEl = document.getElementById('studentIdInput');
  
  if (inputEl) inputEl.value = '';
  if (unlockedContent) unlockedContent.style.display = 'none';
  if (adminContent) adminContent.style.display = 'none';
  if (loginCard) loginCard.style.display = 'block';
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
      <td style="padding:12px 8px; max-width: 220px; word-wrap: break-word;">${escapeHtml(enq.message || 'â€”')}</td>
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
// opened a blank Google Form and made the visitor type everything in again â€” many
// people would simply leave at that point. This version submits the enquiry
// directly from the page to a backend form API (Formspree), so nothing needs to
// be re-typed and the enquiry reaches your inbox in one step.
//
// The static contact form opens WhatsApp with the visitor's enquiry filled in.
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
  
  // Local backup copy only (useful offline/for debugging) â€” the line above is the
  // real delivery mechanism now, so enquiries no longer depend on this device.
  let enquiries = [];
  try {
    const stored = localStorage.getItem('mk_enquiries');
    if (stored) enquiries = JSON.parse(stored);
  } catch (err) {}
  enquiries.push(newEnquiry);
  localStorage.setItem('mk_enquiries', JSON.stringify(enquiries));
  
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg> Opening WhatsApp...';
  btn.disabled = true;

  const formEl = document.getElementById('contactForm');
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
  window.open(`https://wa.me/916361792249?text=${encodeURIComponent(enquiryText)}`, '_blank', 'noopener');
  btn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-0.15em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg> Continue in WhatsApp';
  btn.style.background = '#1A8F5A';
  btn.style.color = 'white';
  if (formEl) formEl.reset();

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
  }, 4000);
}

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initRoute();
  initScrollReveal();
  initQuoteReveal();
  checkPortalSession();
  
  // Bind real HTML form listener
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});
