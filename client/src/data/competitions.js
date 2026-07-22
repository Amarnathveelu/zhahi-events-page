// Central config — every competition + its enrollment form shape.
// Add a new competition by adding one object here; the rest of the
// app (cards, modal, validation, backend payload) adapts automatically.

import webDesigningImg from "../assets/webdesigning.png";
import videoEditingImg from "../assets/video_editing.png";
import contentCreationImg from "../assets/content_creation.png";
import graphicDesignImg from "../assets/graphicdesingning.png";
import debuggingImg from "../assets/debugging_team.png";

export const COMPETITIONS = [
  {
    id: "web-designing",
    title: "Web Designing",
    tagline: "One Day • Live Web Design Challenge",
    description:
      "Create a stunning professional website, compete with limited seats, and become the champion. Register Today!",
    icon: "Code2",
    accent: "#6C8CFF",
    image: webDesigningImg,
    duration: "1 Day",
    mode: "Live",
    fee: 199,
    isTeamEvent: false,
    hasThemeReveal: false,
    extraNote: "Unique, original design only — duplicate/template layouts will be disqualified.",
  },
  {
    id: "debugging",
    title: "Debugging Competition",
    tagline: "One Day • Live Web Design Challenge",
    description:
      "Create a stunning professional website, compete with limited seats, and become the champion. Register Today!",
    icon: "Bug",
    accent: "#B892FF",
    image: debuggingImg,
    duration: "1 Day",
    mode: "Live",
    fee: 149,
    isTeamEvent: false,
    hasThemeReveal: false,
    languageChoice: ["Python", "Java"],
  },
  {
    id: "video-editing",
    title: "Video Editing",
    tagline: "Live Edit • Raw Clips Provided",
    description:
      "We hand you the raw footage on the spot. You bring the storytelling, pacing and polish. Best cut wins.",
    icon: "Film",
    accent: "#FF8A65",
    image: videoEditingImg,
    duration: "1 Day",
    mode: "Live",
    fee: 199,
    isTeamEvent: false,
    hasThemeReveal: false,
    extraNote: "Editing software must be installed on your own laptop before the event.",
  },
  {
    id: "content-creation",
    title: "Content Creation",
    tagline: "Team Event • Max 4 Members",
    description:
      "Register as a squad of up to 4. Your theme drops 3 days before the event — enough time to plan, not enough to overthink.",
    icon: "Sparkles",
    accent: "#4FD1C5",
    image: contentCreationImg,
    duration: "3-Day Prep + Live",
    mode: "Hybrid",
    fee: 299,
    isTeamEvent: true,
    maxTeamSize: 4,
    hasThemeReveal: true,
    themeRevealNote: "Theme is released 3 days before the event to your registered email.",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    tagline: "Poster Challenge • No AI Tools",
    description:
      "Theme drops 3 days early. Design it, bring it, present it live — 100% human-made. AI-generated art is not allowed and will be disqualified.",
    icon: "PenTool",
    accent: "#F6C453",
    image: graphicDesignImg,
    duration: "3-Day Prep + Live",
    mode: "Hybrid",
    fee: 199,
    isTeamEvent: false,
    hasThemeReveal: true,
    themeRevealNote: "Poster theme is released 3 days before the event to your registered email.",
    extraNote: "AI design tools are strictly not allowed — hand/software design only.",
  },
];

export const getCompetition = (id) => COMPETITIONS.find((c) => c.id === id);
