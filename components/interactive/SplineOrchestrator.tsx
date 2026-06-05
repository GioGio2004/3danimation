"use client";

import { useState, useCallback } from "react";
import { Application, SPEObject } from "@splinetool/runtime";
import NfcScrollyTelling from "@/components/interactive/NfcScrollyTelling";
import HorizontalGallery from "@/components/HorizontalGallery";

/**
 * SplineOrchestrator — Client Component
 *
 * Thin coordination layer that bridges NfcScrollyTelling (which owns
 * the fixed Spline canvas) and HorizontalGallery (which needs the chip
 * ref to create a synchronized rotation timeline).
 *
 * State flow:
 *   NfcScrollyTelling.onLoad → onChipReady → setState → HorizontalGallery
 */

interface SplineOrchestratorProps {
  sceneUrl: string;
}

export default function SplineOrchestrator({
  sceneUrl,
}: SplineOrchestratorProps) {
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const [chipObj, setChipObj] = useState<SPEObject | null>(null);

  const handleChipReady = useCallback(
    (app: Application, chip: SPEObject) => {
      setSplineApp(app);
      setChipObj(chip);
    },
    []
  );

  return (
    <>
      {/* NfcScrollyTelling renders:
          • Fixed Spline canvas (Layer 2, z-0)
          • Invisible hero scroll wrapper (Layer 6, z-40, h-[300vh]) */}
      <NfcScrollyTelling
        sceneUrl={sceneUrl}
        onChipReady={handleChipReady}
      />

      {/* HorizontalGallery (Layer 4-5, z-10):
          Receives chip ref + app so its 3D rotation timeline binds to
          the exact same trigger/start/end as the 2D gallery scroll. */}
      <div className="relative z-10 w-full">
        <HorizontalGallery splineApp={splineApp} chipRef={chipObj} />
      </div>
    </>
  );
}
