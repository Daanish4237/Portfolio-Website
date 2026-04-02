'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import * as fc from 'fast-check';
import Home from './page';

// Mock child components so we can control interactions without WebGL
vi.mock('../components/LandingScene', () => ({
  default: ({ onEnter }: { onEnter: () => void }) => (
    <button data-testid="enter-btn" onClick={onEnter}>Enter</button>
  ),
}));

vi.mock('../components/GalaxyCanvas', () => ({
  default: ({
    onSelectProject,
  }: {
    onSelectProject: (p: import('../types').Project) => void;
    onZoomComplete: () => void;
    targetPosition: [number, number, number] | null;
    isZooming: boolean;
  }) => (
    <div data-testid="galaxy-canvas">
      <button
        data-testid="select-project"
        onClick={() =>
          onSelectProject({
            id: 'p1',
            name: 'Test Project',
            description: 'desc',
            techStack: ['React'],
            links: { github: 'https://github.com/x', live: 'https://x.com' },
            position: [1, 2, 3],
            color: '#fff',
          })
        }
      >
        Select
      </button>
    </div>
  ),
}));

vi.mock('../components/ProjectOverlay', () => ({
  default: ({
    project,
    onBack,
  }: {
    project: import('../types').Project;
    onBack: () => void;
  }) => (
    <div data-testid="project-overlay">
      <span data-testid="overlay-name">{project.name}</span>
      <button data-testid="back-btn" onClick={onBack}>
        Back
      </button>
    </div>
  ),
}));

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe('Home page — back navigation', () => {
  it('shows overlay after selecting a project', () => {
    const { container } = render(<Home />);
    const q = within(container);

    // Enter galaxy (AnimatePresence exit may be async — use act)
    act(() => {
      fireEvent.click(q.getByTestId('enter-btn'));
    });

    act(() => {
      fireEvent.click(q.getByTestId('select-project'));
    });

    expect(q.getByTestId('project-overlay')).toBeInTheDocument();
  });

  it('hides overlay after clicking Back', () => {
    const { container } = render(<Home />);
    const q = within(container);

    act(() => { fireEvent.click(q.getByTestId('enter-btn')); });
    act(() => { fireEvent.click(q.getByTestId('select-project')); });
    act(() => { fireEvent.click(q.getByTestId('back-btn')); });

    expect(q.queryByTestId('project-overlay')).not.toBeInTheDocument();
  });

  it('galaxy canvas remains visible after clicking Back', () => {
    const { container } = render(<Home />);
    const q = within(container);

    act(() => { fireEvent.click(q.getByTestId('enter-btn')); });
    act(() => { fireEvent.click(q.getByTestId('select-project')); });
    act(() => { fireEvent.click(q.getByTestId('back-btn')); });

    expect(q.getByTestId('galaxy-canvas')).toBeInTheDocument();
  });
});

// ─── Property 7 ───────────────────────────────────────────────────────────────

// Feature: galaxy-portfolio, Property 7: Back navigation restores galaxy state
describe('Property 7: Back navigation restores galaxy state', () => {
  it('after onBack, overlay is gone and galaxy canvas is still present', () => {
    // **Validates: Requirements 5.7, 5.8**
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (cycles) => {
          const { container, unmount } = render(<Home />);
          const q = within(container);

          // Navigate to galaxy
          act(() => { fireEvent.click(q.getByTestId('enter-btn')); });

          for (let i = 0; i < cycles; i++) {
            // Select a project — overlay should appear
            act(() => { fireEvent.click(q.getByTestId('select-project')); });
            expect(q.getByTestId('project-overlay')).toBeInTheDocument();

            // Click Back — overlay should disappear, galaxy canvas stays
            act(() => { fireEvent.click(q.getByTestId('back-btn')); });
            expect(q.queryByTestId('project-overlay')).not.toBeInTheDocument();
            expect(q.getByTestId('galaxy-canvas')).toBeInTheDocument();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
