// Visual feedback starts on contact; actual actions retain their native click handling.
(() => {
  let pressed = null;
  const release = () => {
    pressed?.classList.remove("is-touch-pressed");
    pressed = null;
  };
  document.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    release();
    const target = event.target.closest?.("button, [role='button'], .file-trigger");
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
    pressed = target;
    pressed.classList.add("is-touch-pressed");
  }, { passive: true, capture: true });
  ["pointerup", "pointercancel"].forEach((name) => document.addEventListener(name, release, { passive: true, capture: true }));
  window.addEventListener("blur", release);
})();
