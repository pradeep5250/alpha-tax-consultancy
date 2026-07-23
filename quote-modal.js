(() => {
  if (window.__alphaQuoteModalReady) return;
  window.__alphaQuoteModalReady = true;

  const style = document.createElement("style");
  style.textContent = `
    .modal{position:fixed;inset:0;background:rgba(7,31,56,.72);backdrop-filter:blur(4px);display:grid;place-items:center;z-index:300;padding:1.5rem;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease}
    .modal.open{opacity:1;visibility:visible}
    .modal__panel{background:#fff;color:#1a2332;width:min(100%,480px);border-radius:18px;padding:1.75rem;position:relative;box-shadow:0 32px 80px rgba(0,0,0,.35);transform:scale(.92) translateY(20px);transition:transform .4s cubic-bezier(.22,1,.36,1)}
    .modal.open .modal__panel{transform:scale(1) translateY(0)}
    .modal__close{position:absolute;top:.85rem;right:.95rem;width:36px;height:36px;border:none;border-radius:50%;background:#eef2f6;color:#0b2a4a;font-size:1.4rem;line-height:1;cursor:pointer}
    .modal__close:hover{background:#1a7a4c;color:#fff}
    .modal__panel h3{font-family:Outfit,Manrope,system-ui,sans-serif;font-size:1.35rem;font-weight:800;color:#0b2a4a;margin:0 2rem .45rem 0}
    .modal__panel>p{color:#5a6a7a;font-size:.92rem;margin:0 0 1.1rem}
    .modal__panel form{display:grid;gap:.75rem}
    .modal__panel input,.modal__panel textarea,.modal__panel select{width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:.78rem .9rem;font:inherit;background:#f4f7fb;color:#1a2332}
    .modal__panel input:focus,.modal__panel textarea:focus,.modal__panel select:focus{outline:none;border-color:#1a7a4c;background:#fff;box-shadow:0 0 0 3px rgba(26,122,76,.15)}
    .modal__panel .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.85rem 1.4rem;border-radius:8px;border:none;background:#1a7a4c;color:#fff;font-family:Outfit,Manrope,system-ui,sans-serif;font-weight:700;font-size:.88rem;text-transform:uppercase;letter-spacing:.02em;cursor:pointer}
    .modal__panel .btn:hover{background:#14603c}
    .modal__check{display:flex;align-items:flex-start;justify-content:flex-start;gap:.7rem;font-size:.85rem;color:#5a6a7a;font-weight:500;line-height:1.45;cursor:pointer;text-align:left}
    .modal__check input[type="checkbox"]{width:1.25rem;height:1.25rem;min-width:1.25rem;margin:.1rem 0 0;padding:0;accent-color:#1a7a4c;cursor:pointer;flex-shrink:0;border-radius:4px}
    .modal__check span{flex:1;text-align:left}
    .modal__check a{color:#1a7a4c;font-weight:700;text-decoration:none}
    .modal__check a:hover{text-decoration:underline}
    .modal__success{display:none;margin:0;text-align:center;font-weight:700;color:#1a7a4c}
    .modal__success.show{display:block}
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
      <button class="modal__close" type="button" aria-label="Close">&times;</button>
      <h3 id="quoteTitle">Get a Quote</h3>
      <p>Share a few details and our team will reach out shortly.</p>
      <form id="quoteForm">
        <input type="text" id="name" name="name" placeholder="Your name" required autocomplete="name" />
        <input type="email" id="email" name="email" placeholder="Email address" required autocomplete="email" />
        <input type="tel" id="phone" name="phone" placeholder="Phone number" autocomplete="tel" />
        <select id="service" name="service" required>
          <option value="">Select a service</option>
          <optgroup label="Startup Company">
            <option>Private Limited Company</option>
            <option>Public Limited Company</option>
            <option>LLP Registration</option>
            <option>One Person Company</option>
            <option>Partnership Firm</option>
            <option>Sole Proprietorship</option>
            <option>Trust Registration</option>
            <option>Section 8 Company</option>
          </optgroup>
          <optgroup label="Registrations">
            <option>GST Registration</option>
            <option>MSME Registration</option>
            <option>PF & ESI Registration</option>
            <option>Firm Registration</option>
            <option>Import & Export Code</option>
            <option>Trade Licence</option>
            <option>Professional Tax</option>
            <option>Trade Mark</option>
            <option>APEDA Licence</option>
            <option>Spice Board</option>
            <option>Digital Signature Certificate</option>
            <option>FSSAI Registration</option>
            <option>ISO Certification</option>
            <option>Shop & Establishment License</option>
            <option>80G and 12A Registration</option>
            <option>Darpan Registration</option>
            <option>LEI Code Registration</option>
          </optgroup>
          <optgroup label="Compliance">
            <option>GST Returns Filing</option>
            <option>Income Tax Returns</option>
            <option>PF ESI Returns Filing</option>
            <option>TDS Filing</option>
            <option>ROC Filing</option>
          </optgroup>
          <option>Other</option>
        </select>
        <textarea id="message" name="message" rows="3" placeholder="Tell us what you need"></textarea>
        <label class="modal__check">
          <input type="checkbox" name="consent" required />
          <span>I agree to the <a href="#">Privacy Policy</a> and consent to being contacted about my enquiry.</span>
        </label>
        <button type="submit" class="btn btn--primary">Submit Request</button>
        <p class="modal__success" id="quoteSuccess">Opening WhatsApp…</p>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const openModal = () => {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  const sendToWhatsapp = () => {
    const number = "919940666015";
    const name = document.getElementById("name")?.value.trim() || "-";
    const email = document.getElementById("email")?.value.trim() || "-";
    const phone = document.getElementById("phone")?.value.trim() || "-";
    const service = document.getElementById("service")?.value.trim() || "-";
    const message = document.getElementById("message")?.value.trim() || "-";

    const text =
`*New Quote Request*

────────────────────

*Name:*
${name}

*Email:*
${email}

*Phone:*
${phone}

*Service:*
${service}

*Message:*
${message}`;

    const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };

  const isQuoteTrigger = (el) => {
    if (!el || el.closest(".top-bar__contacts")) return false;
    if (el.closest(".modal")) return false;
    // Let Contact Us links navigate to the contact page
    const href = (el.getAttribute("href") || "").toLowerCase();
    if (href.includes("contact-us")) return false;
    const label = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!label) return false;
    if (label.includes("contact us")) return false;
    return (
      label.includes("get a quote") ||
      label.includes("get started") ||
      /\bquote\b/.test(label)
    );
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    if (!isQuoteTrigger(el)) return;
    e.preventDefault();
    openModal();
  });

  modal.querySelector(".modal__close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  const quoteForm = modal.querySelector("#quoteForm");
  const quoteSuccess = modal.querySelector("#quoteSuccess");
  quoteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }
    sendToWhatsapp();
    quoteSuccess?.classList.add("show");
    quoteForm.reset();
    window.setTimeout(() => {
      quoteSuccess?.classList.remove("show");
      closeModal();
    }, 1200);
  });

  window.openAlphaQuoteModal = openModal;
  window.sendToWhatsapp = sendToWhatsapp;
})();
