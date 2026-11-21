/* ============================================================
   SHARED INBOX CONNECTOR — one line on any page:

     <script src="…/shared/inbox.js" defer></script>

   then mark the forms to capture:

     <form data-inbox="actor:audition"> … </form>

   On submit the form's fields (and a file input named "file", if any)
   are also sent to the private inbox. It never blocks or replaces the
   page's own handler — WhatsApp, e-mail or whatever the form already
   does keeps working, and if the inbox is unreachable nothing breaks.
   ============================================================ */
(function () {
  "use strict";

  // Set once the Worker is deployed. Empty = the connector does nothing.
  var API = "";

  if (!API || !window.fetch || !window.FormData) return;

  function addHoneypot(form) {
    if (form.querySelector('input[name="website"]')) return;
    var hp = document.createElement("input");
    hp.type = "text";
    hp.name = "website";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0";
    form.appendChild(hp);
  }

  function capture(form) {
    var tag = (form.getAttribute("data-inbox") || "other:enquiry").split(":");
    var fd = new FormData(form);
    fd.set("_site", tag[0] || "other");
    fd.set("_kind", tag[1] || "enquiry");
    fd.set("page", location.pathname);
    var file = fd.get("file");
    var hasFile = file && typeof file === "object" && file.size > 0;
    if (!hasFile) fd.delete("file");
    var body;
    if (hasFile) body = fd;
    else {
      // Small and file-free: send as JSON so it survives the page navigating away.
      var o = {};
      fd.forEach(function (v, k) { o[k] = o[k] ? o[k] + ", " + v : v; });
      body = JSON.stringify(o);
    }
    try {
      fetch(API + "/api/enquiry", {
        method: "POST",
        body: body,
        headers: hasFile ? undefined : { "content-type": "application/json" },
        keepalive: !hasFile,
        mode: "cors",
        credentials: "omit"
      }).then(function (r) {
        form.dispatchEvent(new CustomEvent("inbox:sent", { bubbles: true, detail: { ok: r.ok } }));
      }).catch(function () {
        form.dispatchEvent(new CustomEvent("inbox:sent", { bubbles: true, detail: { ok: false } }));
      });
    } catch (e) { /* never interfere with the page */ }
  }

  function wire() {
    document.querySelectorAll("form[data-inbox]").forEach(addHoneypot);
  }
  // Capture phase, so it runs even when the page's own handler stops the event.
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form && form.matches && form.matches("form[data-inbox]") && form.checkValidity()) capture(form);
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
