const t = document.querySelector(".menu-toggle");
const n = document.querySelector(".nav-links");
if (t && n) {
  t.addEventListener("click", () => n.classList.toggle("open"));
  n.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => n.classList.remove("open")),
  );
}
