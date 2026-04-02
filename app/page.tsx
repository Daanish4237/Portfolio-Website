'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import nextDynamic from 'next/dynamic';
import { Project } from '../types';
import LandingScene from '../components/LandingScene';
import ProjectOverlay from '../components/ProjectOverlay';

const GalaxyCanvas = nextDynamic(() => import('../components/GalaxyCanvas'), { ssr: false });

export default function Home() {
  const [scene, setScene] = useState<'landing' | 'galaxy'>('landing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);

  function handleBack() {
    setSelectedProject(null);
    setTargetPosition(null);
    setIsZooming(false);
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {scene === 'landing' ? (
          <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <LandingScene onEnter={() => setScene('galaxy')} />
          </motion.div>
        ) : (
          <motion.div
            key="galaxy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100vw', height: '100vh' }}
          >
            <GalaxyCanvas
              onSelectProject={(project) => {
                setSelectedProject(project);
                setIsZooming(true);
                setTargetPosition(project.position);
              }}
              onZoomComplete={() => setIsZooming(false)}
              targetPosition={targetPosition}
              isZooming={isZooming}
            />
            {/* Home button */}
            <button
              onClick={() => {
                handleBack();
                setScene('landing');
              }}
              className="fixed top-4 left-4 z-20 px-4 py-2 rounded-full border border-purple-500 text-purple-300 text-sm font-semibold tracking-wide bg-black/40 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_16px_rgba(139,92,246,0.8)]"
            >
              ← Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject !== null && (
          <ProjectOverlay
            key={selectedProject.id}
            project={selectedProject}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </>
  );
}
