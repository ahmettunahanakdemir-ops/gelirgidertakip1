// Visual feedback starts on contact; actual actions retain their native click handling.
(() => {
  let pressed = null;
  const release = () => {
    pressed?.classList.remove("is-touch-pressed");
    pressed = null;
  };
  document.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    document.documentElement.dataset.interactionModality = "pointer";
    release();
    const target = event.target.closest?.("button, [role='button'], .file-trigger");
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
    pressed = target;
    pressed.classList.add("is-touch-pressed");
  }, { passive: true, capture: true });
  document.addEventListener("keydown", (event) => {
    if (["Tab", "Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      document.documentElement.dataset.interactionModality = "keyboard";
    }
  }, { passive: true, capture: true });
  ["pointerup", "pointercancel"].forEach((name) => document.addEventListener(name, release, { passive: true, capture: true }));
  window.addEventListener("blur", release);
})();
