import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    id: "soho-jewels",
    name: "Soho Jewels",
    description: "A luxury eCommerce platform for jewellery with Stripe payments, admin dashboard, customer reviews, and 2FA.",
    techStack: ["Next.js 14", "Prisma", "PostgreSQL", "Stripe", "Cloudinary", "NextAuth.js", "Tailwind CSS"],
    links: {
      github: "https://github.com/Daanish4237/Commerce-Website",
      live: "https://soho-jewels-beta.vercel.app/",
    },
    position: [-6, 2, -4],
    color: "#f59e0b",
  },
  {
    id: "bus-tracking",
    name: "Bus Tracking System",
    description: "Real-time bus tracking for passengers — view routes, select drop-off stops, and see live GPS bus locations updating every 10 seconds.",
    techStack: ["TypeScript", "Vite", "Node.js", "Express", "Vitest"],
    links: {
      github: "https://github.com/Daanish4237/bus-tracking-system",
      live: "https://bus-tracking-system-wheat.vercel.app/",
    },
    position: [5, -1, -6],
    color: "#06b6d4",
  },
  {
    id: "taskflow",
    name: "TaskFlow",
    description: "A productivity web app with task management, time tracking, goal setting, team collaboration, and an analytics dashboard.",
    techStack: ["PHP 8.2", "MySQL", "JavaScript", "Chart.js", "HTML5", "CSS3"],
    links: {
      github: "https://github.com/Daanish4237/Goal-Tracking-Website",
      live: "",
    },
    position: [2, 4, -8],
    color: "#10b981",
  },
];
