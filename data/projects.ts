import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Project Alpha",
    description: "A full-stack web application for task management with real-time collaboration features.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    links: {
      github: "https://github.com/example/alpha",
      live: "https://alpha.example.com",
    },
    position: [-6, 2, -4],
    color: "#4f46e5",
  },
  {
    id: "project-2",
    name: "Project Beta",
    description: "A machine learning dashboard for visualizing and exploring large datasets interactively.",
    techStack: ["Python", "FastAPI", "React", "D3.js"],
    links: {
      github: "https://github.com/example/beta",
      live: "https://beta.example.com",
    },
    position: [5, -1, -6],
    color: "#06b6d4",
  },
  {
    id: "project-3",
    name: "Project Gamma",
    description: "A mobile-first e-commerce platform with seamless checkout and inventory management.",
    techStack: ["Next.js", "Stripe", "MongoDB", "Tailwind CSS"],
    links: {
      github: "https://github.com/example/gamma",
      live: "https://gamma.example.com",
    },
    position: [2, 4, -8],
    color: "#10b981",
  },
  {
    id: "project-4",
    name: "Project Delta",
    description: "A real-time multiplayer game built with WebSockets and a custom physics engine.",
    techStack: ["TypeScript", "Socket.io", "Canvas API", "Express"],
    links: {
      github: "https://github.com/example/delta",
      live: "https://delta.example.com",
    },
    position: [-3, -3, -5],
    color: "#f59e0b",
  },
];
