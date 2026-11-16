import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/projects.html?raw";
import { LegacyPage, $, showModal, hideModal, modalHandlers } from "@/components/LegacyPage";

function openModal(card: HTMLElement) {
  $("modalTitle").innerText = card.querySelector("h3")!.innerText;
  $("modalSubtitle").innerText = (card.querySelector(".project-label") as HTMLElement | null)?.innerText ?? "";
  const logo = card.querySelector(".card-logo");
  $("modalLogo").innerHTML = logo?.innerHTML ?? "";
  $("modalLogo").style.display = logo ? "flex" : "none";
  const bullets = card.querySelector("ul")?.outerHTML ?? "";
  const hidden = card.querySelector(".hidden-details");
  if (hidden) {
    $("modalStory").innerHTML = bullets + (hidden.querySelector(".story")?.innerHTML ?? "");
    $("modalSimilar").innerHTML = hidden.querySelector(".similar")?.innerHTML ?? "";
  } else {
    $("modalStory").innerHTML = bullets || "<p>Details coming soon.</p>";
    $("modalSimilar").innerHTML = "";
  }
  const tech = card.querySelector(".tech-pills");
  $("modalSkillsSection").style.display = tech ? "block" : "none";
  if (tech) $("modalSkills").innerHTML = '<div class="skills-container">' + tech.innerHTML + "</div>";
  showModal("projectModal");
}

const handlers = {
  ...modalHandlers("projectModal"),
  openModal,
  jumpToProject: (id: string) => {
    hideModal("projectModal");
    const target = document.getElementById(id);
    if (!target) return;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.transition = "0.3s";
      target.style.transform = "scale(1.02)";
      target.style.borderColor = "#0082d8";
      setTimeout(() => {
        target.style.transform = "";
        target.style.borderColor = "";
        openModal(target);
      }, 500);
    }, 350);
  },
  filterProjects: (category: string, event: Event) => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    (event.target as HTMLElement).classList.add("active");
    document.querySelectorAll<HTMLElement>(".project-card").forEach((c) => {
      c.style.display = category === "all" || c.dataset["category"] === category ? "flex" : "none";
    });
  },
};

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Paarth Kapur" },
      { name: "description", content: "Professional, research, academic and volunteer data projects by Paarth Kapur." },
      { property: "og:title", content: "Projects | Paarth Kapur" },
      { property: "og:description", content: "Analytics, machine learning and software projects by Paarth Kapur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegacyPage html={html} handlers={handlers} />,
});
