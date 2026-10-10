/* Sidebar navigation and view switching */

/* ===== Phase 1: sidebar navigation & settings ===== */
const VIEWS = ["home","dash","database","history","report","academy","settings"];
function closeMobileSidebar() { $("#sidebar").classList.remove("mobile-open"); $("#sidebar-backdrop").classList.remove("show"); document.body.classList.remove("drawer-open"); $("#hamburger").setAttribute("aria-expanded", "false"); }
function openMobileSidebar() { $("#sidebar").classList.add("mobile-open"); $("#sidebar-backdrop").classList.add("show"); document.body.classList.add("drawer-open"); $("#hamburger").setAttribute("aria-expanded", "true"); const f = $("#sidebar-close"); if (f) f.focus(); }
function showView(name) {
  if (!VIEWS.includes(name)) name = "home";
  VIEWS.forEach(v => { const el = $("#view-" + v); if (el) el.hidden = (v !== name); });
  document.querySelectorAll(".sidelink[data-view], .user-chip[data-view], .bnav-btn[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === name && b.id !== "checker-nav"));
  if (name === "dash" || name === "database") renderDash();
  if (name === "history") renderHistory();
  { const l = document.querySelector('.sidelink[data-view="' + name + '"]'); const t = $("#page-title"); if (l && t) t.textContent = l.textContent.trim(); }
  window.scrollTo(0, 0);
  closeMobileSidebar();
}
document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.auth === "1" && !me()) { showAuth(); return; }
    showView(btn.dataset.view);
    if (btn.dataset.scroll) { setTimeout(() => { showChecker(); }, 30); }
  });
});
$("#quick-check-btn").addEventListener("click", () => { showView("home"); setTimeout(showChecker, 30); });
function setSidebarCollapsed(collapsed) { $("#sidebar").classList.toggle("collapsed", collapsed); $("#sidebar-collapse").textContent = collapsed ? "⟩" : "⟨"; try { localStorage.setItem("fv_sidebar_collapsed", collapsed ? "1" : "0"); } catch (e) {} }
$("#sidebar-collapse").addEventListener("click", () => setSidebarCollapsed(!$("#sidebar").classList.contains("collapsed")));
$("#hamburger").addEventListener("click", openMobileSidebar);
$("#sidebar-backdrop").addEventListener("click", closeMobileSidebar);
try { setSidebarCollapsed(localStorage.getItem("fv_sidebar_collapsed") === "1"); } catch (e) {}
