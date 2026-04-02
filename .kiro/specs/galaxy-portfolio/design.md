# Design Document: Galaxy Portfolio

## Overview

The Galaxy Portfolio is a Next.js 14 (App Router) application that renders an immersive 3D space environment using `@react-three/fiber` (R3F) and `@react-three/drei`. The UI layer is built with Tailwind CSS and animated with Framer Motion. The app has two primary visual states: a **Landing Scene** and a **Galaxy Scene**, with a **Project Overlay** that appears on top of the 3D canvas after a planet is selected.

The architecture separates concerns cleanly:
- **3D rendering** lives entirely inside an R3F `<Canvas>`
- **UI overlays** live outside the canvas as standard React/HTML
- **State management** uses React `useState`/`useRef` with no external store needed at this scale

---

## Architecture

```
app/
├── page.tsx                  # Root page — mounts App shell
├── layout.tsx                # Root layout with global styles
components/
├── LandingScene.tsx          # Full-screen landing with stars + title + CTA
├── GalaxyCanvas.tsx          # R3F Canvas wrapper (Galaxy Scene)
├── Planet.tsx                # Individual planet mesh with hover/click logic
├── CameraController.tsx      # Handles lerp zoom and OrbitControls toggling
├── ProjectOverlay.tsx        # 2D overlay panel shown after zoom-in
data/
├── projects.ts               # Project data array
types/
├── index.ts                  # Shared TypeScript types
```

### State Flow

```
page.tsx
  ├── scene: 'landing' | 'galaxy'
  ├── selectedProject: Project | null
  └── isZooming: boolean

LandingScene  ──(Enter Universe)──► scene = 'galaxy'
GalaxyCanvas
  └── Planet ──(click)──► selectedProject = project, isZooming = true
CameraController ──(zoom complete)──► isZooming = false
ProjectOverlay ──(Back)──► selectedProject = null, camera resets
```

---

## Components and Interfaces

### `data/projects.ts`

Exports a single `PROJECTS` constant array. All planet and overlay content derives from this.

### `types/index.ts`

```typescript
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
```

### `LandingScene.tsx`

- Full-screen `div` with a dark background
- Renders a lightweight CSS/canvas star field (or reuses drei `Stars` inside a small embedded canvas)
- Framer Motion `motion.div` for title and button entrance animations
- On "Enter Universe" click: calls `onEnter()` prop, triggering a Framer Motion exit animation before unmounting

### `GalaxyCanvas.tsx`

- Wraps R3F `<Canvas>` with `camera={{ position: [0, 0, 20], fov: 60 }}` and `dpr={[1, 2]}` to match the device pixel ratio (up to 2x) for crisp 4K rendering
- Renders `<Stars>` from drei for the background particle field
- Maps `PROJECTS` array to `<Planet>` components
- Renders `<CameraController>` inside the canvas

### `Planet.tsx`

- `useRef` on the mesh for rotation animation via `useFrame`
- `useState` for `hovered` boolean
- On hover: scale to `1.25`, apply emissive glow via `meshStandardMaterial` `emissive` + `emissiveIntensity`
- On hover: render `<Html>` from drei to show project name label
- On click: calls `onSelect(project)` prop

### `CameraController.tsx`

- Receives `targetPosition: Vector3 | null` and `isZooming: boolean`
- Uses `useFrame` to lerp `camera.position` toward `targetPosition` when zooming
- Renders `<OrbitControls>` with `enabled={!isZooming}`, `minDistance={5}`, `maxDistance={40}`
- Calls `onZoomComplete()` when camera is within threshold distance of target

### `ProjectOverlay.tsx`

- Positioned absolutely over the canvas using Tailwind (`fixed inset-0 z-10`)
- Framer Motion `motion.div` with `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}`
- Displays: title, description, tech stack tags, "View Live", "View Code", "Back" buttons
- "View Live" / "View Code" open links with `target="_blank" rel="noopener noreferrer"`
- "Back" calls `onBack()` prop

---

## Data Models

### Project

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `name` | `string` | Display name of the project |
| `description` | `string` | Short paragraph describing the project |
| `techStack` | `string[]` | Array of technology names |
| `links.github` | `string` | GitHub repository URL |
| `links.live` | `string` | Live demo URL |
| `position` | `[number, number, number]` | XYZ coordinates in 3D scene |
| `color` | `string` | CSS hex color for planet material |

### Example Data

```typescript
export const PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Project Alpha",
    description: "A full-stack web application for task management.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    links: { github: "https://github.com/...", live: "https://..." },
    position: [-6, 2, -4],
    color: "#4f46e5",
  },
  // ... 2–4 more
];
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Planet count matches project data

*For any* `PROJECTS` array with N entries (where N ≤ 5), the Galaxy Scene SHALL render exactly N Planet components — no more, no fewer.

**Validates: Requirements 2.2, 7.1**

---

### Property 2: Planet derives all properties from Project data

*For any* Project in the `PROJECTS` array, the rendered Planet's position, color, and label SHALL exactly match the values in that Project object.

**Validates: Requirements 2.4, 7.3**

---

### Property 3: Project data round-trip integrity

*For any* Project object in `PROJECTS`, serializing it to JSON and deserializing it SHALL produce an object that is deeply equal to the original.

**Validates: Requirements 7.2**

---

### Property 4: Hover state is exclusive

*For any* Galaxy Scene with N planets, at most one Planet SHALL be in the hovered state at any given time.

**Validates: Requirements 3.1, 3.2, 3.3**

---

### Property 5: Overlay content matches selected project

*For any* Project selected by clicking its Planet, the Project_Overlay SHALL display the name, description, techStack, and links that exactly match that Project object.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

---

### Property 6: OrbitControls disabled during zoom

*For any* camera zoom animation in progress (`isZooming = true`), OrbitControls SHALL be disabled; *for any* state where no zoom is in progress and no overlay is shown, OrbitControls SHALL be enabled.

**Validates: Requirements 4.2, 6.1, 8.2**

---

### Property 7: Back navigation restores galaxy state

*For any* selected project, clicking "Back" SHALL result in `selectedProject` being null and OrbitControls being re-enabled after the camera returns to its default position.

**Validates: Requirements 5.7, 5.8**

---

### Property 8: Tech stack tags render one tag per entry

*For any* Project with a `techStack` array of length N, the Project_Overlay SHALL render exactly N tag elements.

**Validates: Requirements 5.3**

---

### Property 9: Canvas pixel ratio matches device

*For any* device pixel ratio reported by the browser, the R3F Canvas `dpr` prop SHALL be set to `[1, 2]` so the renderer scales up to the native display resolution, preventing pixelation on high-DPI and 4K screens.

**Validates: Requirements 9.4, 9.5**

---

## Error Handling

- **Missing links**: If `links.live` or `links.github` is an empty string, the corresponding button SHALL be rendered as disabled (no `href`, visually muted).
- **WebGL unavailable**: If the browser does not support WebGL, the R3F Canvas will fail to mount. The app SHOULD display a fallback message: "Your browser does not support WebGL. Please try a modern browser."
- **Invalid project position**: Positions are validated at the data layer — all three coordinates must be finite numbers. Invalid entries are filtered before rendering.

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are used together for comprehensive coverage.

**Unit tests** cover:
- Specific rendering examples (e.g., overlay renders correct title for a known project)
- Edge cases (e.g., empty tech stack array renders zero tags)
- Error conditions (e.g., empty link disables button)

**Property-based tests** cover:
- Universal properties that must hold across all valid inputs
- Use [fast-check](https://github.com/dubzzz/fast-check) as the property-based testing library
- Each property test runs a minimum of **100 iterations**

### Property Test Tags

Each property test MUST be annotated with:

```
// Feature: galaxy-portfolio, Property N: <property_text>
```

### Property Test Mapping

| Property | Test Type | Description |
|---|---|---|
| Property 1 | Property | Planet count = project count |
| Property 2 | Property | Planet derives props from project data |
| Property 3 | Property | Project data JSON round-trip |
| Property 4 | Property | Hover state exclusivity |
| Property 5 | Property | Overlay content matches selected project |
| Property 6 | Property | OrbitControls disabled iff zooming |
| Property 7 | Property | Back navigation restores state |
| Property 8 | Property | Tech stack tag count matches array length |

### Unit Test Coverage

- `LandingScene`: renders title, renders button, calls `onEnter` on click
- `ProjectOverlay`: renders all fields, opens links in new tab, calls `onBack` on click, disables button when link is empty
- `projects.ts`: all projects have required fields, positions are valid finite numbers, max 5 projects
- `CameraController`: zoom completes when within threshold, OrbitControls toggled correctly

### Testing Framework

- **Test runner**: Vitest
- **Component testing**: React Testing Library
- **Property testing**: fast-check
- **3D mocking**: Mock `@react-three/fiber` and `@react-three/drei` in unit tests (jsdom cannot run WebGL)
