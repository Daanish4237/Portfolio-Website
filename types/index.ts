export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  links: {
    github: string;
    live: string;
  };
  position: [number, number, number];
  color: string;
}
