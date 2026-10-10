/* Mounts every HTML component into its <div data-component="..."> placeholder (runs before the app code). */
(function () {
  var C = window.FV_COMPONENTS || {};
  document.querySelectorAll("[data-component]").forEach(function (slot) {
    var html = C[slot.dataset.component];
    if (html == null) { console.error("Missing component:", slot.dataset.component); return; }
    slot.outerHTML = html;
  });
})();
