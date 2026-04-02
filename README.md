# Galaxy Portfolio

An interactive 3D portfolio built with Next.js 14, Three.js, and Framer Motion. Explore projects as planets floating in a galaxy — click one to zoom in and view details.

## Tech Stack

- **Next.js 14** (App Router)
- **@react-three/fiber** + **@react-three/drei** — 3D rendering
- **Three.js** — WebGL scene
- **Framer Motion** — UI animations
- **Tailwind CSS** — styling
- **TypeScript**

## Features

- Cinematic landing screen with animated star field
- Interactive 3D galaxy with orbiting planets (one per project)
- Hover effects with glow and project name labels
- Smooth camera zoom into selected planets
- Project detail overlay with live demo and GitHub links
- WebGL fallback for unsupported browsers
- Crisp rendering on high-DPI / 4K displays (`dpr={[1, 2]}`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx          # Root page — scene state management
├── layout.tsx        # Global layout
components/
├── LandingScene.tsx  # Landing screen
├── GalaxyCanvas.tsx  # R3F canvas wrapper
├── Planet.tsx        # Individual planet mesh
├── CameraController.tsx  # Zoom + OrbitControls
├── ProjectOverlay.tsx    # Project detail panel
data/
├── projects.ts       # Project data array
types/
├── index.ts          # Shared TypeScript types
```

## Adding Projects

Edit `data/projects.ts` — each entry follows the `Project` interface:

```typescript
{
  id: "my-project",
  name: "My Project",
  description: "Short description.",
  techStack: ["React", "Node.js"],
  links: {
    github: "https://github.com/you/repo",
    live: "https://yourproject.com"
  },
  position: [x, y, z],  // 3D coordinates in the scene
  color: "#4f46e5"       // Planet color (hex)
}
```

Keep the array at 5 entries or fewer for best performance.

## Testing

```bash
npm test
```

Uses Vitest + React Testing Library + fast-check for property-based tests.

## Deployment

Deploy to Vercel with zero config — just import the repo at [vercel.com/new](https://vercel.com/new).
