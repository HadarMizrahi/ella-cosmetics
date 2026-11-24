const DATA_FILES = {
  site: "data/site.json",
  treatments: "data/treatments.json",
  brands: "data/brands.json",
  gallery: "data/gallery.json",
  pricing: "data/pricing.json"
};

const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M13.5 21v-7.5h2.5l.5-3h-3v-1.8c0-.9.3-1.7 1.6-1.7h1.5V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.3-3.7 3.9v2.2H8.5v3H11V21"></path></svg>`
};

async function loadData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

const byId = (id) => document.getElementById(id);

const safeText = (id, value) => {
  const el = byId(id);
  if (el && value) el.textContent = value;
};

const imageOrPlaceholder = (img, label) => {
  if (!img) return;
  img.addEventListener("error", () => {
    const holder = img.parentElement;
    img.remove();
    if (holder) {
      holder.classList.add("image-placeholder");
      holder.setAttribute("aria-label", label || "תמונה תתווסף בהמשך");
    }
  }, { once: true });
};

function setWhatsApp(phone, message) {
  const cleanPhone = (phone || "").replace(/[^\d]/g, "");
  const href = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || "שלום, אשמח לקבל פרטים ולתאם פגישה בקליניקה.")}`
    : "#contact";
  document.querySelectorAll(".whatsapp-link").forEach((a) => {
    a.href = href;
  });
}

function renderSocials(site) {
  const links = [];
  if (site.instagram) {
    links.push(`<a class="social-icon-link" href="${site.instagram}" target="_blank" rel="noopener" aria-label="אינסטגרם">${SOCIAL_ICONS.instagram}</a>`);
  }
  if (site.facebook) {
    links.push(`<a class="social-icon-link" href="${site.facebook}" target="_blank" rel="noopener" aria-label="פייסבוק">${SOCIAL_ICONS.facebook}</a>`);
  }
  const html = links.join("");
  ["socialLinks", "footerSocials"].forEach((id) => {
    const el = byId(id);
    if (el) el.innerHTML = html;
  });
}

function renderTreatments(items) {
  const root = byId("treatmentGrid");
  if (!root) return;
  if (!items?.length) {
    root.innerHTML = '<div class="empty-state">פרטי הטיפולים יופיעו כאן בקרוב.</div>';
    return;
  }
  root.innerHTML = items.map((item) => `
    <article class="treatment-card">
      <div class="treatment-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="treatment-content">
        ${item.tag ? `<span class="treatment-tag">${item.tag}</span>` : ""}
        <h3>${item.name}</h3>
        <p>${item.description || ""}</p>
        ${(item.duration || item.price) ? `
          <div class="card-footer">
            <span class="card-duration">${item.duration || ""}</span>
            <span class="card-price">${item.price || ""}</span>
          </div>
        ` : ""}
      </div>
    </article>
  `).join("");
  root.querySelectorAll("img").forEach((img) => imageOrPlaceholder(img, "תמונת טיפול"));
}

function renderBrands(items) {
  const root = byId("brandGrid");
  if (!root) return;
  if (!items?.length) {
    root.innerHTML = '<div class="empty-state">רשימת המותגים תופיע כאן בקרוב.</div>';
    return;
  }
  root.innerHTML = items.map((item) => `
    <div class="brand-card">
      ${item.logo ? `<img src="${item.logo}" alt="${item.name}" loading="lazy">` : `<span class="brand-title">${item.name}</span>`}
      ${item.note ? `<span class="brand-note">${item.note}</span>` : ""}
    </div>
  `).join("");
  root.querySelectorAll("img").forEach((img) => imageOrPlaceholder(img, "לוגו מותג"));
}

function renderGallery(items) {
  const root = byId("resultsGrid");
  if (!root) return;
  if (!items?.length) {
    root.innerHTML = '<div class="empty-state">תמונות התוצאות יתווספו כאן לאחר קבלת התמונות מהקליניקה.</div>';
    return;
  }
  root.innerHTML = items.map((item) => `
    <article class="result-card">
      <div class="result-images">
        <img src="${item.before}" alt="לפני ${item.title}" loading="lazy">
        <img src="${item.after}" alt="אחרי ${item.title}" loading="lazy">
      </div>
      <div class="result-labels">
        <span>לפני</span>
        <span>אחרי</span>
      </div>
      <p class="result-caption">${item.title}</p>
      ${item.subtitle ? `<p class="result-sub">${item.subtitle}</p>` : ""}
    </article>
  `).join("");
  root.querySelectorAll("img").forEach((img) => imageOrPlaceholder(img, "תמונת תוצאה"));
}

function renderPrices(items) {
  const root = byId("priceList");
  if (!root) return;
  if (!items?.length) {
    root.innerHTML = '<div class="empty-state">המחירון יפורסם בקרוב.</div>';
    return;
  }
  root.innerHTML = items.map((item) => `
    <div class="price-row">
      <div class="price-info">
        <strong>${item.name}</strong>
        ${item.details ? `<small>${item.details}</small>` : ""}
      </div>
      <span class="price-tag">${item.price}</span>
    </div>
  `).join("");
}

async function init() {
  try {
    const [site, treatments, brands, gallery, pricing] = await Promise.all(
      Object.values(DATA_FILES).map(loadData)
    );

    document.title = `${site.businessName} | קליניקה לקוסמטיקה מתקדמת`;
    safeText("brandName", site.brandShort || site.businessName);
    safeText("brandSubtitle", site.brandSubtitle || "ADVANCED SKIN CLINIC");
    safeText("heroEyebrow", site.heroEyebrow);
    safeText("heroTitle", site.heroTitle);
    safeText("heroText", site.heroText);
    safeText("aboutTitle", site.aboutTitle);
    safeText("aboutText", site.aboutText);
    safeText("aboutSignature", site.aboutSignature);
    safeText("contactTitle", site.contactTitle);
    safeText("contactText", site.contactText);
    safeText("footerName", site.businessName);
    safeText("hoursText", site.hours);

    const heroImg = byId("heroImage");
    if (heroImg) {
      if (site.heroImage) heroImg.src = site.heroImage;
      imageOrPlaceholder(heroImg, "תמונת אווירה ראשית");
    }

    const phone = (site.phone || "").trim();
    const phoneLink = byId("phoneLink");
    if (phoneLink) {
      if (phone) {
        phoneLink.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
        phoneLink.textContent = `נייד: ${phone}`;
      } else {
        phoneLink.remove();
      }
    }

    const email = (site.email || "").trim();
    const emailLink = byId("emailLink");
    if (emailLink) {
      if (email) {
        emailLink.href = `mailto:${email}`;
        emailLink.textContent = `מייל: ${email}`;
      } else {
        emailLink.remove();
      }
    }

    const address = (site.address || "").trim();
    const addressEl = byId("addressText");
    if (addressEl) {
      if (address) {
        addressEl.textContent = `כתובת: ${address}`;
      } else {
        addressEl.remove();
      }
    }

    setWhatsApp(site.whatsapp || phone, site.whatsappMessage);
    renderSocials(site);
    renderTreatments(treatments);
    renderBrands(brands);
    renderGallery(gallery);
    renderPrices(pricing);

    const yearEl = byId("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (error) {
    console.error(error);
    const main = document.querySelector("main");
    if (main) {
      main.insertAdjacentHTML(
        "afterbegin",
        '<div class="container"><p class="empty-state">לא ניתן לטעון את תוכן האתר. בדקו שהקבצים בתיקיית data קיימים ושמרתם את הפרויקט דרך שרת מקומי.</p></div>'
      );
    }
  }
}

const toggle = byId("menuToggle");
const nav = byId("mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

init();