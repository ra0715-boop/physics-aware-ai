// data-scroll-target 속성이 있는 버튼을 누르면 원하는 섹션으로 이동합니다.
const scrollButtons = document.querySelectorAll("[data-scroll-target]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.scrollTarget;

    // "top"은 문서 맨 위로 올리는 특별한 값으로 처리합니다.
    if (targetId === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// 헤더가 스크롤 위치에 따라 조금 더 또렷하게 보이도록 클래스를 바꿉니다.
const siteHeader = document.querySelector(".site-header");

const updateHeaderStyle = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderStyle();
window.addEventListener("scroll", updateHeaderStyle, { passive: true });

// reveal 클래스를 가진 요소가 화면에 보이면 자연스럽게 등장시킵니다.
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;
const tiltScenes = document.querySelectorAll(
  ".hero-panel-screen, .demo-canvas, .concept-mini"
);

revealItems.forEach((item) => {
  const delay = item.dataset.delay || "0";
  item.style.setProperty("--delay", `${delay}s`);
});

// 3D처럼 보이도록, 주요 mockup에 아주 약한 마우스 틸트를 적용합니다.
if (!reduceMotion && canHover) {
  tiltScenes.forEach((scene) => {
    const strength = scene.classList.contains("concept-mini") ? 5 : 4;

    scene.addEventListener("pointermove", (event) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      scene.style.setProperty("--tilt-x", `${y * -strength}deg`);
      scene.style.setProperty("--tilt-y", `${x * strength}deg`);
    });

    scene.addEventListener("pointerleave", () => {
      scene.style.setProperty("--tilt-x", "0deg");
      scene.style.setProperty("--tilt-y", "0deg");
    });
  });
}

if (reduceMotion) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}
