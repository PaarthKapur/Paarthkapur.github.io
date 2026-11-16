import { createFileRoute } from "@tanstack/react-router";
import html from "@/content/publications.html?raw";
import { LegacyPage, $, showModal, modalHandlers } from "@/components/LegacyPage";

const handlers = {
  ...modalHandlers("pubModal"),
  openModal: (card: HTMLElement) => {
    $("modalTitle").innerText = (card.querySelector(".pub-title") as HTMLElement).innerText;
    $("modalMeta").innerText = (card.querySelector(".hidden-details .meta-data") as HTMLElement).innerText;
    $("modalDesc").innerHTML = card.querySelector(".hidden-details .desc-data")!.innerHTML;
    showModal("pubModal");
  },
};

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Publications | Paarth Kapur" },
      { name: "description", content: "Research publications by Paarth Kapur." },
      { property: "og:title", content: "Publications | Paarth Kapur" },
      { property: "og:description", content: "Peer-reviewed research papers authored by Paarth Kapur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegacyPage html={html} handlers={handlers} />,
});
