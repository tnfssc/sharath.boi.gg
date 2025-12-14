import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Geometry parameters for the organic sculpture
const VERTICAL_SEGMENTS = 80; // Height resolution (reduced further for perf)
const RADIAL_SEGMENTS = 80; // Circular resolution (reduced further for perf)
const SCULPTURE_HEIGHT = 4.0; // Total height of the form
const PHI_START = Math.PI; // Rotate lathe seam to the back, away from camera

// Animation parameters
// (Transform-only animation uses inline values, no separate constants)

// ============================================================================
// TYPES
// ============================================================================

interface BackgroundSceneProps {
  mode?: "dark" | "light";
}

interface BreathingSculptureProps {
  mode: "dark" | "light";
}

// ============================================================================
// BACKGROUND SCENE
// Wraps Canvas with proper camera, lighting, and environment setup
// ============================================================================

export function BackgroundScene({ mode = "dark" }: BackgroundSceneProps) {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{
          far: 100,
          fov: 28, // Slightly narrower FOV for composed framing
          near: 0.1,
          position: [0.35, 0.4, 4.85], // Reframed for a more head-on perspective
        }}
        dpr={[1, 1.1]} // Mobile-safe pixel ratio (lighter)
        gl={{
          alpha: true, // Transparent background
          antialias: true,
          powerPreference: "low-power", // Battery-friendly
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: "transparent" }}
      >
        {/* ----------------------------------------------------------------
            LIGHTING: Exact measured values for confident contrast
        ---------------------------------------------------------------- */}

        {/* Base ambient - low, so directional lights sculpt */}
        <ambientLight intensity={0.18} />

        {/* Key light - dominant direction, warm tint */}
        <directionalLight castShadow={false} color="#ffe5d6" intensity={1.2} position={[2.5, 4, 1.5]} />

        {/* Rim light - soft cool accent from behind */}
        <directionalLight color="#66d3ff" intensity={0.35} position={[-3.0, 1.2, -2.0]} />

        {/* Environment map for realistic glass reflections */}
        <Environment environmentIntensity={0.35} preset="city" />

        {/* The sculpture, pushed further off-center and enlarged for cropping */}
        <group position={[0, -0.38, 0]} rotation={[0, 0.18, 0.1]} scale={[1.35, 1.35, 1.35]}>
          <BreathingSculpture mode={mode} />
        </group>
      </Canvas>
    </div>
  );
}

// ============================================================================
// LEGACY EXPORT
// Maintains backwards compatibility with existing usage
// ============================================================================

export function LiquidSimulation() {
  return <BackgroundScene mode="dark" />;
}

// ============================================================================
// BREATHING SCULPTURE
// Handles geometry creation, glass material, and subtle animation
// ============================================================================

function BreathingSculpture(_: BreathingSculptureProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const currentGeometryRef = useRef<null | THREE.LatheGeometry>(null);
  const hoverRef = useRef<{
    active: boolean;
    strength: number;
    targetU: number;
    targetV: number;
    u: number;
    v: number;
  }>({
    active: false,
    strength: 0,
    targetU: 0.5,
    targetV: 0.5,
    u: 0.5,
    v: 0.5,
  });
  const ripplesRef = useRef<
    Array<{
      createdAt: number;
      u: number;
      v: number;
    }>
  >([]);

  // Precompute geometry scaffolding once: base lathe, profile y positions, and
  // trigonometric tables for each radial segment. We mutate the geometry
  // in-place each frame to avoid allocations and GC spikes on pointer move.
  const { baseGeometry, cosTable, pointsCount, profileY, sinTable, vertexCount } = useMemo(() => {
    const pts: Array<THREE.Vector2> = [];
    const profileY: Array<number> = [];

    for (let i = 0; i <= VERTICAL_SEGMENTS; i++) {
      const y = (i / VERTICAL_SEGMENTS) * SCULPTURE_HEIGHT - SCULPTURE_HEIGHT / 2;
      const yn = y / (SCULPTURE_HEIGHT / 2);
      const base = 0.6;
      const polyAmp = 0.45 * (0.7 + 0.5 * 0.3); // approximate mid-state
      const poly = polyAmp * (1 - yn * yn);
      const r = base + poly;
      pts.push(new THREE.Vector2(r, y));
      profileY.push(y);
    }

    const baseGeometry = new THREE.LatheGeometry(pts, RADIAL_SEGMENTS, PHI_START);
    const sinTable = new Float32Array(RADIAL_SEGMENTS + 1);
    const cosTable = new Float32Array(RADIAL_SEGMENTS + 1);
    for (let i = 0; i <= RADIAL_SEGMENTS; i++) {
      const phi = PHI_START + (i / RADIAL_SEGMENTS) * Math.PI * 2;
      sinTable[i] = Math.sin(phi);
      cosTable[i] = Math.cos(phi);
    }

    return {
      baseGeometry,
      cosTable,
      pointsCount: pts.length,
      profileY,
      sinTable,
      vertexCount: baseGeometry.attributes.position.count,
    };
  }, []);

  const radiiRef = useRef<Float32Array>(new Float32Array(pointsCount));
  const colorsRef = useRef<Float32Array>(new Float32Array(vertexCount * 3));
  const normalThrottleRef = useRef(0);
  const colorThrottleRef = useRef(0);
  const boundsThrottleRef = useRef(0);
  const yRangeRef = useRef<{ max: number; min: number }>({ max: 1, min: 0 });

  const palette = useMemo(
    () => [
      new THREE.Color("#E578B8"), // soft magenta
      new THREE.Color("#6A47FF"), // indigo
      new THREE.Color("#2EC3F7"), // cyan
      new THREE.Color("#6EEB9E"), // mint
    ],
    [],
  );

  const scratchColor = useMemo(() => new THREE.Color(), []);
  const scratchHSL = useMemo(() => ({ h: 0, l: 0, s: 0 }), []);

  // Compute UV distance with wrapping on the U seam so hover/click effects
  // don't show a visible cut where u wraps from 1 -> 0.
  const uvDistance = (u1: number, v1: number, u2: number, v2: number) => {
    const duRaw = u1 - u2;
    const du = Math.abs(duRaw);
    const duWrapped = Math.min(du, 1 - du); // handle seam at u=0/1
    const dv = v1 - v2;
    return { d2: duWrapped * duWrapped + dv * dv, dist: Math.sqrt(duWrapped * duWrapped + dv * dv) };
  };

  // Safe hover ref update: creates a new object instead of mutating properties
  const updateHoverRef = (updates: Partial<typeof hoverRef.current>) => {
    hoverRef.current = { ...hoverRef.current, ...updates };
  };

  // -------------------------------------------------------------------------
  // MATERIAL: Premium Glass Shader
  //
  // High transmission, low roughness, and physical properties for realism.
  // -------------------------------------------------------------------------
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      clearcoat: 0.05,
      color: new THREE.Color(0xffffff),
      envMapIntensity: 0.4,
      ior: 1.33, // Water-like refraction
      opacity: 0.72, // Keep translucent but not milky
      reflectivity: 0.2,
      roughness: 0.14, // Slightly soft highlights
      side: THREE.DoubleSide,
      thickness: 0.25, // Interior depth
      transmission: 1, // Full thin-glass refraction
      transparent: true,
      vertexColors: true,
    });
  }, []);

  // Prevent frustum culling hiding the mesh when the animated geometry extends
  // outside the initial bounds, and ensure old geometry is released.
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = false;
      meshRef.current.geometry = baseGeometry;
    }

    // Initialize persistent color attribute once
    baseGeometry.setAttribute("color", new THREE.BufferAttribute(colorsRef.current, 3));

    // Initialize bounding volumes once so we can safely mutate them later
    // without reassigning geometry properties that some linters consider immutable.
    baseGeometry.computeBoundingSphere();
    baseGeometry.computeBoundingBox();

    return () => {
      baseGeometry.dispose();
    };
  }, [baseGeometry]);

  // =========================================================================
  // ANIMATION: Dynamic Time-Dependent Geometry with Chaotic Deformation
  // + Surface Ripples
  //
  // Geometry regenerates every frame with time-dependent polynomial
  // coefficients and interference patterns. Ripples are applied in a
  // post-pass directly on the surface vertices in UV space, so clicks and
  // hovers affect the *actual* hit location on the mesh.
  // =========================================================================
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta * 0.6;
    const time = timeRef.current;

    // =====================================================================
    // TIME MODULATIONS: Create chaotic but continuous deformation
    // =====================================================================
    const t1 = Math.sin(time * 0.3) * 0.5 + 0.5; // 0..1 slow oscillation
    const t2 = Math.sin(time * 0.7) * 0.5 + 0.5; // 0..1 faster oscillation
    const t3 = Math.sin(time * 1.3) * 0.5 + 0.5; // 0..1 even faster
    const _t4 = Math.sin(time * 0.15) * 0.5 + 0.5; // 0..1 very slow

    // =====================================================================
    // GENERATE BASE PROFILE: Dynamic polynomial + interference pattern
    // =====================================================================
    const geo = baseGeometry;
    currentGeometryRef.current = geo;

    // Compute dynamic radii per vertical segment (profile only, not radial)
    const radii = radiiRef.current;
    for (let i = 0; i < pointsCount; i++) {
      const y = profileY[i];
      const yn = y / (SCULPTURE_HEIGHT / 2); // -1..1

      const base = 0.6;
      const polyAmp = 0.45 * (0.7 + t1 * 0.3);
      const poly = polyAmp * (1 - yn * yn);

      const bulgeAmp = 0.12 * (0.8 + t2 * 0.4);
      const bulgeFreq = 1.4 + Math.sin(time * 0.4) * 0.3;
      const bulgePhase = time * 0.2;
      const atten1 = 0.9;
      const bulge = bulgeAmp * Math.sin(bulgeFreq * Math.PI * yn + bulgePhase) * Math.exp(-atten1 * yn * yn);

      const detailAmp = 0.04 * (0.6 + t3 * 0.7);
      const detailFreq = 6.0 + Math.sin(time * 0.6) * 1.5;
      const detailPhase = time * 0.3;
      const detail = detailAmp * Math.sin(detailFreq * Math.PI * yn + detailPhase) * 0.4;

      const interference =
        0.05 * Math.sin(2.5 * Math.PI * yn + time * 0.4) * Math.cos(3.7 * Math.PI * yn + time * 0.6) * (0.5 + t2 * 0.5);

      radii[i] = base + poly + bulge + detail + interference;
    }

    // =====================================================================
    // SURFACE RIPPLES: Hover dimples and click bubbles in UV space
    // =====================================================================
    const positionAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const pos = positionAttr.array as Float32Array;
    const normalAttr = geo.getAttribute("normal") as null | THREE.BufferAttribute;
    const uvs = geo.attributes.uv.array as Float32Array;
    const count = vertexCount;

    // Precompute influence radii to short-circuit expensive math when
    // hover/click is far away. This reduces per-frame work spikes on hover.
    const hoverRadius = 0.06;
    const hoverRadius2 = hoverRadius * hoverRadius * 4; // loose cutoff

    // Clean up expired ripples (3s lifetime)
    const liveRipples = ripplesRef.current.filter((r) => time - r.createdAt < 3);
    ripplesRef.current = liveRipples;

    const hasInteraction = hoverRef.current.strength > 0.001 || liveRipples.length > 0;

    // Smooth hover UV once per frame to reduce jitter-induced flicker near edges
    let hoverU = hoverRef.current.u;
    let hoverV = hoverRef.current.v;
    let hoverStrength = hoverRef.current.strength;
    if (hoverRef.current.active) {
      hoverU = THREE.MathUtils.lerp(hoverRef.current.u, hoverRef.current.targetU, 0.18);
      hoverV = THREE.MathUtils.lerp(hoverRef.current.v, hoverRef.current.targetV, 0.18);
      // Ease strength toward 1 when actively hovering
      hoverStrength = THREE.MathUtils.lerp(hoverStrength, 1, 0.35);
      updateHoverRef({ strength: hoverStrength, u: hoverU, v: hoverV });
    } else {
      // Gently decay hover strength when raycasting drops at the silhouette
      hoverStrength = THREE.MathUtils.lerp(hoverStrength, 0, 0.18);
      updateHoverRef({ strength: hoverStrength });
    }

    let maxR = 0;
    for (let i = 0; i < count; i++) {
      const uIndex = Math.floor(i / pointsCount);
      const vIndex = i - uIndex * pointsCount;
      const radius = radii[vIndex];

      let rippleDelta = 0;

      const iu = i * 2;
      const u = uvs[iu];
      const v = uvs[iu + 1];

      if (hasInteraction) {
        // Extra falloff and dead-zone near the U seam to avoid visible line & bubbling
        const seamU = Math.min(u, 1 - u);
        const seamDeadZone = 0.02;
        const seamSigma = 0.14;
        const seamFactor = seamU < seamDeadZone ? 0 : 1 - Math.exp(-(seamU * seamU) / (2 * seamSigma * seamSigma));

        // Additional damping near the screen-space silhouette (left/right edges)
        // Approximated using the x-direction component of the radial basis.
        const nx = sinTable[uIndex];
        const edgeInner = 0.7;
        const edgeOuter = 0.96;
        const ax = Math.abs(nx);
        const tEdge = Math.min(1, Math.max(0, (ax - edgeInner) / (edgeOuter - edgeInner)));
        const edgeFactor = 1 - tEdge; // 1 in the front, 0 at extreme edges

        const interactionFactor = seamFactor * edgeFactor;
        if (interactionFactor <= 0.0005) {
          // Skip ripple work entirely when fully damped at seam+edge
          const newR = Math.max(0.0001, radius);
          if (newR > maxR) maxR = newR;
          positionAttr.setXYZ(i, newR * sinTable[uIndex], profileY[vIndex], newR * cosTable[uIndex]);
          continue;
        }

        // Hover dimple: local inward push under the cursor
        if (hoverStrength > 0.001) {
          const { d2 } = uvDistance(u, v, hoverU, hoverV);
          if (d2 < hoverRadius2) {
            const falloff = Math.exp(-(d2 / (2 * hoverRadius * hoverRadius)));
            rippleDelta += -0.04 * falloff * hoverStrength * interactionFactor;
          }
        }

        // Click bubbles: expanding ring + central bubble
        for (const ripple of liveRipples) {
          const age = time - ripple.createdAt;
          const life = 3;
          const envelope = Math.max(0, 1 - age / life);
          if (envelope <= 0) continue;

          const { dist } = uvDistance(u, v, ripple.u, ripple.v);

          // Expanding ring wave
          const speed = 0.35;
          const ringRadius = speed * age;
          const ringWidth = 0.1;

          // Quick rejection if well outside both ring and bubble influence
          const maxInfluence = 0.18 + ringRadius; // ringWidth*~1.5 + bubbleRadius
          if (dist > maxInfluence + 0.08) continue;
          const ringDist = dist - ringRadius;
          const ringEnvelope = Math.exp(-(ringDist * ringDist) / (2 * ringWidth * ringWidth));
          const ring = Math.sin((dist - ringRadius) * 18.0) * 0.03 * ringEnvelope * envelope;

          // Central bubble
          const bubbleRadius = 0.12;
          const bubbleCore = Math.max(0, 1 - dist / bubbleRadius);
          const bubble = bubbleCore * 0.09 * envelope;

          rippleDelta += (ring + bubble) * interactionFactor;
        }
      }

      // Clamp ripple-induced change to prevent edge popping
      rippleDelta = Math.min(0.04, Math.max(-0.04, rippleDelta));

      const newR = Math.max(0.0001, radius + rippleDelta);
      if (newR > maxR) maxR = newR;
      positionAttr.setXYZ(i, newR * sinTable[uIndex], profileY[vIndex], newR * cosTable[uIndex]);
    }

    // =====================================================================
    // DYNAMIC VERTEX COLORS: Hue shift and saturation modulation
    // =====================================================================
    const colorArray = colorsRef.current;

    let colorsUpdated = false;

    // Refresh colors every few frames (always, not just on interaction)
    // Use cached ymin/ymax from idle state to prevent color jumps on hover
    if (colorThrottleRef.current++ % 6 === 0) {
      // Dynamic hue shift: rotates color wheel over time
      const hueShift = time * 0.2;

      // Dynamic saturation: breathing between 0.55 and 0.75
      const saturationMod = 0.65 + Math.sin(time * 0.5) * 0.1;

      // Update ymin/ymax cache periodically (especially when idle)
      // This ensures stable color mapping across the mesh lifetime
      if (!hasInteraction || colorThrottleRef.current % 30 === 0) {
        let ymin = Infinity;
        let ymax = -Infinity;
        for (let i = 0; i < count; i++) {
          const y = pos[i * 3 + 1];
          ymin = Math.min(ymin, y);
          ymax = Math.max(ymax, y);
        }
        yRangeRef.current = { max: ymax, min: ymin };
      }

      const { max: ymax, min: ymin } = yRangeRef.current;

      // Assign colors with hue shift and saturation modulation
      for (let i = 0; i < count; i++) {
        const y = pos[i * 3 + 1];
        const t = (y - ymin) / (ymax - ymin); // 0..1

        // Map t to palette with smooth blending
        const seg = t * (palette.length - 1);
        const idx = Math.floor(seg);
        const localT = seg - idx;
        const nextIdx = Math.min(idx + 1, palette.length - 1);

        scratchColor.copy(palette[idx]).lerp(palette[nextIdx], localT);

        // Convert to HSL, apply hue shift and saturation mod (in-place scratch)
        scratchColor.getHSL(scratchHSL);
        scratchHSL.h = (scratchHSL.h + hueShift) % 1;
        scratchHSL.s = Math.max(0, Math.min(1, scratchHSL.s * saturationMod));
        scratchColor.setHSL(scratchHSL.h, scratchHSL.s, scratchHSL.l);

        const i3 = i * 3;
        colorArray[i3] = scratchColor.r;
        colorArray[i3 + 1] = scratchColor.g;
        colorArray[i3 + 2] = scratchColor.b;
      }

      colorsUpdated = true;
    }

    positionAttr.needsUpdate = true;

    // Compute normals frequently when interacting, less frequently when idle
    // Flag for update every frame to keep reflections responsive
    const shouldComputeNormals =
      (hasInteraction && normalThrottleRef.current++ % 5 === 0) ||
      (!hasInteraction && normalThrottleRef.current++ % 2 === 0);

    if (shouldComputeNormals && normalAttr) {
      geo.computeVertexNormals();
      normalAttr.needsUpdate = true;
    } else if (normalAttr) {
      // Flag for update even if we didn't recompute, to keep reflections animating
      normalAttr.needsUpdate = true;
    }

    const _colorAttr = geo.getAttribute("color") as null | THREE.BufferAttribute;
    if (colorsUpdated && _colorAttr) {
      _colorAttr.needsUpdate = true;
    }

    // Geometry stays the same instance; just flag updates
    meshRef.current.geometry = geo;

    // Keep bounds reasonably fresh for stable raycasting; update less often when idle
    if (
      (hasInteraction && boundsThrottleRef.current++ % 3 === 0) ||
      (!hasInteraction && boundsThrottleRef.current++ % 2 === 0)
    ) {
      const halfHeight = SCULPTURE_HEIGHT / 2;
      const boundRadius = Math.sqrt(maxR * maxR + halfHeight * halfHeight);

      // Three.js bounds updates
      geo.boundingSphere ??= new THREE.Sphere();
      geo.boundingSphere.radius = boundRadius;
      geo.boundingSphere.center.set(0, 0, 0);

      geo.boundingBox ??= new THREE.Box3();
      geo.boundingBox.min.set(-maxR, -halfHeight, -maxR);
      geo.boundingBox.max.set(maxR, halfHeight, maxR);
    }

    // Subtle rotation for liveness
    meshRef.current.rotation.y = Math.sin(time * 0.08) * 0.04;
    meshRef.current.rotation.x = 0;
  });

  return (
    <mesh
      castShadow
      material={material}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!e.uv) return;

        ripplesRef.current.push({
          createdAt: timeRef.current,
          u: e.uv.x,
          v: e.uv.y,
        });

        if (ripplesRef.current.length > 6) {
          ripplesRef.current.shift();
        }
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (!e.uv) return;
        updateHoverRef({
          active: true,
          targetU: e.uv.x,
          targetV: e.uv.y,
        });
      }}
      onPointerOut={() => {
        updateHoverRef({ active: false });
      }}
      receiveShadow
      ref={meshRef}
    />
  );
}
