/* Landing page: shown to signed-out visitors; the app itself requires sign-in */

function showLanding() {
  $("#app").hidden = true; $("#auth").hidden = true; $("#landing").hidden = false;
  window.scrollTo(0, 0); revealLanding();
}
function openAuth(mode) { showAuth(); if (typeof showReset === "function") showReset(false); $(mode === "up" ? "#a-up" : "#a-in").click(); $("#a-email").focus(); }

$("#land-signin").addEventListener("click", () => openAuth("in"));
$("#land-signin-2").addEventListener("click", () => openAuth("in"));
["#land-start", "#land-start-nav", "#land-start-2"].forEach(id => $(id).addEventListener("click", () => openAuth("up")));
$("#a-back").addEventListener("click", () => { if (me()) showApp(); else showLanding(); });
$("#land-theme").addEventListener("click", () => applyTheme(document.body.classList.contains("night") ? "light" : "dark"));
$(".land-brand").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Scroll reveal: elements with .reveal fade up once they enter the viewport */
let landObserver = null;
function revealLanding() {
  const items = document.querySelectorAll("#landing .reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("in")); return; }
  if (!landObserver) landObserver = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); landObserver.unobserve(en.target); } }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => landObserver.observe(el));
}
/* Nav gets a soft shadow once the page scrolls */
window.addEventListener("scroll", () => { const n = $("#land-nav"); if (n && !$("#landing").hidden) n.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });
