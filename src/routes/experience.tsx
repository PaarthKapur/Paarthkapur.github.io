import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/experience.html?raw";
import { LegacyPage, $, showModal, modalHandlers } from "@/components/LegacyPage";

const handlers = {
  ...modalHandlers("projectModal"),
  switchTab: (tabId: string, event: Event) => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    (event.target as HTMLElement).classList.add("active");
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    document.getElementById(tabId)?.classList.add("active");
    (window as unknown as { reveal: () => void }).reveal();
  },
  openModal: (card: HTMLElement) => {
    $("modalTitle").innerText = card.querySelector("h3")!.innerText;
    $("modalCompany").innerText = (card.querySelector(".company") as HTMLElement).innerText;
    $("modalLogo").innerHTML = card.querySelector(".card-logo")!.innerHTML;
    const hidden = card.querySelector(".hidden-details");
    if (hidden) {
      $("modalStory").innerHTML = hidden.querySelector(".story")?.innerHTML ?? "";
      $("modalSimilar").innerHTML = hidden.querySelector(".similar")?.innerHTML ?? "";
      const skills = hidden.querySelector(".skills-content");
      $("modalSkillsSection").style.display = skills ? "block" : "none";
      if (skills) $("modalSkills").innerHTML = '<div class="skills-container">' + skills.innerHTML + "</div>";
    } else {
      $("modalStory").innerHTML = "<p>No further details available.</p>";
      $("modalSimilar").innerHTML = "<span>No projects linked.</span>";
      $("modalSkillsSection").style.display = "none";
    }
    showModal("projectModal");
  },
};

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience & Education | Paarth Kapur" },
      { name: "description", content: "Professional, research, volunteer experience and education of Paarth Kapur." },
      { property: "og:title", content: "Experience & Education | Paarth Kapur" },
      { property: "og:description", content: "Roles at Tata Play, Colgate, Mobicule and studies at UW and KJSCE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegacyPage html={html} handlers={handlers} revealSelector=".reveal, .tab-description" revealOffset={50} />,
});
