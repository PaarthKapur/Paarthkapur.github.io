import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/home.html?raw";
import { LegacyPage, $, showModal, modalHandlers } from "@/components/LegacyPage";

const handlers = {
  ...modalHandlers("skillModal"),
  openSkillModal: (card: HTMLElement) => {
    $("modalTitle").innerText = card.querySelector("h3")!.innerText;
    $("modalSkillList").innerText = card.querySelector("p")!.innerText;
    const hidden = card.querySelector(".hidden-details");
    $("modalExperiences").innerHTML = hidden?.querySelector(".related-experience")?.innerHTML ?? "<span>No specific experience linked.</span>";
    $("modalProjects").innerHTML = hidden?.querySelector(".related-projects")?.innerHTML ?? "<span>No specific projects linked.</span>";
    showModal("skillModal");
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paarth Kapur | Portfolio" },
      { name: "description", content: "Paarth Kapur — MS Data Science student at UW focused on data and business analytics." },
      { property: "og:title", content: "Paarth Kapur | Portfolio" },
      { property: "og:description", content: "Data science, business analytics, and projects by Paarth Kapur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegacyPage html={html} handlers={handlers} />,
});
