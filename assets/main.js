/* Progressive enhancement: content and links work without JavaScript. */
const menu = document.querySelector(".menu-toggle"),
  nav = document.querySelector("#navigation");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document
      .querySelectorAll("details[open]")
      .forEach((el) => (el.open = false));
    if (nav?.classList.contains("open")) {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.focus();
    }
  }
});
document.addEventListener("click", (event) => {
  document.querySelectorAll(".nav-group details[open]").forEach((el) => {
    if (!el.contains(event.target)) el.open = false;
  });
});
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".experience,.family-copy,.stay-copy")
    .forEach((e) => observer.observe(e));
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".experience").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (reduced.matches) return;
        const r = card.getBoundingClientRect();
        card.style.transform = `rotateX(${(-(event.clientY - r.top - r.height / 2) / r.height) * 2}deg) rotateY(${((event.clientX - r.left - r.width / 2) / r.width) * 2}deg)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
    const hero = document.querySelector(".hero-image");
    let pending = false;
    if (hero)
      addEventListener(
        "scroll",
        () => {
          if (pending || reduced.matches) return;
          pending = true;
          requestAnimationFrame(() => {
            hero.style.transform = `translateY(${Math.min(scrollY * 0.08, 28)}px)`;
            pending = false;
          });
        },
        { passive: true },
      );
  }
}
