# Implementation Plan: Galaxy Portfolio

## Overview

Incrementally build the Next.js galaxy portfolio from the data layer up through 3D rendering, interactions, and UI overlays. Each task wires into the previous so there is no orphaned code.

## Tasks

- [x] 1. Project scaffolding and dependencies
  - Initialize a Next.js 14 App Router project with TypeScript and Tailwind CSS
  - Install dependencies: `@react-three/fiber`, `@react-three/drei`, `three`, `framer-motion`, `@types/three`
  - Install dev dependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `jsdom`
  - Configure `vitest.config.ts` with jsdom environment and `@testing-library/jest-dom` setup
  - Add mock for `@react-three/fiber` and `@react-three/drei` in `__mocks__/` so unit tests run without WebGL
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Data layer — types and project data
  - [x] 2.1 Create `types/index.ts` with the `Project` interface (id, name, description, techStack, links, position, color)
    - _Requirements: 7.2_
  - [x] 2.2 Create `data/projects.ts` exporting the `PROJECTS` constant array with 4 sample projects, each with unique color and 3D position
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 2.3 Write property test for project data integrity
    - **Property 2: Planet derives all properties from Project data** — for any project in PROJECTS, all required fields are present, positions are finite numbers, and links are non-empty strings
    - **Property 3: Project data round-trip integrity** — serialize each project to JSON and back, assert deep equality
    - **Validates: Requirements 7.2, 7.3**

- [x] 3. Landing Scene
  - [x] 3.1 Create `components/LandingScene.tsx` — full-screen dark div with animated CSS star field, Framer Motion title entrance, and "Enter Universe" button; accepts `onEnter: () => void` prop
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 8.3_
  - [x] 3.2 Write unit tests for LandingScene
    - Test: renders developer title text
    - Test: renders "Enter Universe" button
    - Test: clicking button calls `onEnter`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Planet component
  - [x] 4.1 Create `components/Planet.tsx` — mesh sphere with `meshStandardMaterial`, `useFrame` rotation, hover state (scale + emissiveIntensity), drei `<Html>` label on hover, click calls `onSelect(project)`
    - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_
  - [x] 4.2 Write property test for hover round-trip
    - **Property 4: Hover state is exclusive** — simulate hover on one planet, assert only that planet is hovered
    - **Property (3.4): Hover off restores state** — hover then un-hover, assert scale and emissive return to defaults
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 5. Camera controller
  - [x] 5.1 Create `components/CameraController.tsx` — renders `<OrbitControls>` with `minDistance={5}` `maxDistance={40}` and `enabled={!isZooming}`; uses `useFrame` to lerp camera toward `targetPosition` when `isZooming=true`; calls `onZoomComplete` when within threshold
    - _Requirements: 4.1, 4.2, 4.4, 6.1, 6.2, 6.3_
  - [x] 5.2 Write unit tests for CameraController props
    - Test: OrbitControls receives `enabled={false}` when `isZooming=true`
    - Test: OrbitControls receives `minDistance={5}` and `maxDistance={40}`
    - **Property 6: OrbitControls disabled during zoom** — for any isZooming=true state, OrbitControls enabled prop is false
    - **Validates: Requirements 4.2, 6.1, 6.2, 6.3**

- [x] 6. Galaxy Canvas
  - [x] 6.1 Create `components/GalaxyCanvas.tsx` — R3F `<Canvas dpr={[1, 2]} camera={{ position: [0,0,20], fov: 60 }}>` containing `<Stars>`, mapped `<Planet>` components from PROJECTS, and `<CameraController>`; accepts `onSelectProject` and zoom state props
    - _Requirements: 2.1, 2.2, 9.1, 9.4, 9.5_
  - [x] 6.2 Write property test for planet count
    - **Property 1: Planet count matches project data** — for any PROJECTS array with N ≤ 5 entries, GalaxyCanvas renders exactly N Planet components
    - **Validates: Requirements 2.2, 9.1**

- [x] 7. Project Overlay
  - [x] 7.1 Create `components/ProjectOverlay.tsx` — fixed overlay with Framer Motion fade+slide entrance; renders project title, description, tech stack tags, "View Live" link (target=_blank), "View Code" link (target=_blank), and "Back" button; disables link buttons when URL is empty string
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.9, 8.1, 8.2, 8.3_
  - [x] 7.2 Write property tests for ProjectOverlay
    - **Property 5: Overlay content matches selected project** — for any project, overlay renders name, description, links matching that project
    - **Property 8: Tech stack tags render one tag per entry** — for any project with techStack of length N, overlay renders exactly N tags
    - Test: "Back" button calls `onBack`
    - Test: "View Live" button is disabled when `links.live` is empty
    - Test: "View Code" button is disabled when `links.github` is empty
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7**

- [x] 8. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire everything together in `app/page.tsx`
  - [x] 9.1 Add state: `scene: 'landing' | 'galaxy'`, `selectedProject: Project | null`, `isZooming: boolean`, `targetPosition: Vector3 | null`
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 9.2 Render `<LandingScene>` when `scene === 'landing'`; on `onEnter` set `scene = 'galaxy'` with Framer Motion exit animation
    - _Requirements: 1.4_
  - [x] 9.3 Render `<GalaxyCanvas>` when `scene === 'galaxy'`; wire `onSelectProject` to set `selectedProject`, `isZooming=true`, and `targetPosition`; wire `onZoomComplete` to set `isZooming=false`
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 9.4 Render `<ProjectOverlay>` conditionally when `selectedProject` is not null; wire `onBack` to clear `selectedProject`, reset camera target, and re-enable controls
    - **Property 7: Back navigation restores galaxy state**
    - _Requirements: 5.7, 5.8_
  - [x] 9.5 Write property test for back navigation state
    - **Property 7: Back navigation restores galaxy state** — after onBack is called, selectedProject is null and isZooming is false
    - **Validates: Requirements 5.7, 5.8**

- [x] 10. Canvas pixel ratio and WebGL fallback
  - [x] 10.1 Confirm `<Canvas dpr={[1, 2]}>` is set in GalaxyCanvas; add a WebGL fallback `<div>` rendered via R3F `fallback` prop or an error boundary
    - **Property 9: Canvas pixel ratio matches device**
    - _Requirements: 9.4, 9.5_
  - [x] 10.2 Write unit test for pixel ratio prop
    - Test: GalaxyCanvas passes `dpr={[1, 2]}` to Canvas
    - **Validates: Requirements 9.4, 9.5**

- [x] 11. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations each
- Mock `@react-three/fiber` and `@react-three/drei` in all unit/property tests (jsdom has no WebGL)
- Tag format for property tests: `// Feature: galaxy-portfolio, Property N: <property_text>`
