---
name: threejs
description: Work with three.js for 3D graphics. Covers scene graph, materials, lighting, rendering, React/Next.js integration, TSL/WebGPU, performance, and debugging. Use when building 3D visualizations, correcting visual output, or optimizing three.js code.
metadata:
  {"threejs": {"local_repo": "/home/alan/Code/three.js", "version": "0.184.0"}}
---

# Three.js Skill

## Section 1: Philosophy — Don't Fight the Framework

**Hard prescriptive rules. Violating them causes bugs, poor performance, and unreadable code.**

- **Scene graph is king** — Use `Object3D` hierarchy, NOT manual matrix math. `mesh.position.set(x, y, z)` and `mesh.rotation.set(x, y, z)` are the correct ways to transform. **Never manually construct `Matrix4` unless absolutely necessary.**
- **Use built-in materials and geometries** — Extend via parameters, `ShaderMaterial`, or TSL. Don't reinvent basic shapes with raw `BufferGeometry` unless there is no built-in.
- **Follow the render pipeline** — `renderer.render(scene, camera)`. Scene must contain objects. Camera must point at the scene. Renderer needs a canvas.
- **Use modern import maps** — `import * as THREE from 'three'` with importmap or bundler. **NEVER use old CDN `<script src="cdnjs...three.min.js">` patterns.**
- **Use the right renderer for the job** — `WebGLRenderer` for maximum compatibility (default), `WebGPURenderer` only when you need TSL custom shaders or compute.
- **Let three.js handle projection, culling, and transforms** — Don't manually project points or do frustum checks.

## Section 2: Visual Mental Models (Anti-Hallucination)

### Material Visual Guide

| Material | What you will ACTUALLY see |
|----------|---------------------------|
| `MeshBasicMaterial` | **FLAT, UNLIT.** Color is uniform regardless of lighting. Use for wireframes, UI elements, or when you want no shading at all. |
| `MeshLambertMaterial` | **CHEAP, PER-VERTEX lighting.** Gouraud shading. Lighting computed only at vertices then interpolated. Faster but looks faceted on low-poly meshes. |
| `MeshPhongMaterial` | **SHINY SPECULAR HIGHLIGHTS.** Per-fragment lighting with specular. `shininess` controls highlight size (0 = huge/diffuse, 150 = tiny/point-like). Good for plastic/metal look. |
| `MeshStandardMaterial` | **PBR (Physically Based Rendering).** `roughness` 0 = mirror, 1 = matte. `metalness` 0 = dielectric (wood/plastic), 1 = metal. Most realistic for general use. Needs lights + ideally an environment map. |
| `MeshPhysicalMaterial` | **Advanced PBR.** Adds `clearcoat`, `transmission` (glass), `ior` (index of refraction), `sheen`. Use for car paint, glass, liquids. |

#### Roughness / Metalness Visual Spectrum

- **roughness 0.0** — mirror-like reflections, sharp highlights
- **roughness 0.25** — slightly blurred reflections
- **roughness 0.5** — satin / matte appearance
- **roughness 1.0** — completely diffuse, no specular
- **metalness 0.0** — non-metallic, diffuse color dominates
- **metalness 1.0** — fully metallic, surface color becomes reflectance color

### Emissive "Glow"

`material.emissive` makes the object **self-illuminating** but does **NOT** create a halo or light in the scene by default. For a true glow / bloom effect, you need post-processing (`UnrealBloomPass`).

### Lighting Visual Guide

| Light | What you will ACTUALLY see |
|-------|---------------------------|
| `AmbientLight` | Uniform flat fill. No direction, no shadows, no falloff. Just raises the base illumination of everything. **Used with other lights, not alone.** |
| `DirectionalLight` | Parallel rays like the sun. Creates hard shadows. **Direction matters** (light comes FROM the direction vector). Position doesn't matter for intensity, only direction. |
| `PointLight` | Light bulb. Emits in all directions from a point. `distance` controls falloff radius. `decay` controls how fast it dims (2 = physically correct, 1 = faster / less realistic). |
| `SpotLight` | Flashlight / cone. `angle` is half-angle of cone in radians. `penumbra` controls soft edge (0 = hard edge, 1 = very soft). Casts shadows. |
| `HemisphereLight` | Sky / ground gradient. No shadows. `color` = sky color, `groundColor` = ground color. Great for ambient outdoor scenes. |
| `RectAreaLight` | Area light (window / softbox). **Only works with `MeshStandardMaterial` and `MeshPhysicalMaterial`.** Needs `RectAreaLightUniformsLib` init. |

### Shadows

**Shadows are NOT automatic.** Requirements:

1. Renderer: `renderer.shadowMap.enabled = true`
2. Light: `light.castShadow = true` (only `DirectionalLight`, `SpotLight`, `PointLight`)
3. Object: `mesh.castShadow = true`
4. Receiver: `mesh.receiveShadow = true`
5. Camera near / far must encompass shadow-casting objects

Shadow map size (`light.shadow.mapSize.width` / `height`) controls sharpness. **Bigger = sharper but slower.**

### Color & Output

- CSS colors (`#ff0000`, `'red'`) are **sRGB**
- three.js internally works in **linear color space** for physically correct math
- `ColorManagement.enabled = true` handles conversion automatically in modern three.js
- Without tone mapping, bright areas clip to white harshly
- `ACESFilmicToneMapping` = film-like, preserves detail in highlights
- `NoToneMapping` = raw linear output, often looks wrong for PBR

## Section 3: Architecture & Core Patterns

### Canonical "Hello Cube"

```js
import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Mesh = Geometry + Material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 5, 5);
scene.add(directional);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

### Scene Graph Hierarchy

- `Object3D` is the base of everything
- `Scene` is the root
- `Group` is a container for organizing
- `Mesh`, `Line`, `Points` are renderable objects
- Children inherit parent transforms (position, rotation, scale)
- **`camera` does NOT need to be in the scene graph to work** (unlike other objects)

## Section 4: React / Next.js Integration

### Dynamic import with SSR disabled (REQUIRED for Next.js)

```tsx
import dynamic from 'next/dynamic';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### Canvas lifecycle pattern

```tsx
useEffect(() => {
  const renderer = new THREE.WebGLRenderer();
  containerRef.current.appendChild(renderer.domElement);

  // setup scene, camera, objects...

  return () => {
    // CLEANUP IS MANDATORY
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    containerRef.current?.removeChild(renderer.domElement);
  };
}, []);
```

### ResizeObserver for responsive canvas

```tsx
useEffect(() => {
  const observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  observer.observe(containerRef.current);
  return () => observer.disconnect();
}, []);
```

### NEVER put mutable three.js objects in React state

```tsx
// BAD - causes infinite re-renders and hydration mismatches
const [mesh, setMesh] = useState(new THREE.Mesh());

// GOOD - use refs for three.js objects
const meshRef = useRef(new THREE.Mesh(geometry, material));
```

## Section 5: TSL & WebGPU

### When to use WebGPU

- Custom shaders with TSL (Three.js Shading Language)
- Compute shaders (GPGPU)
- Node-based materials

### Import pattern

```js
import * as THREE from 'three/webgpu';
import { texture, uv, color, uniform, Fn } from 'three/tsl';

const renderer = new THREE.WebGPURenderer();
await renderer.init();
```

### TSL example

```js
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = texture(myTexture).mul(color(0xff0000));
```

### Node material classes

- `MeshBasicNodeMaterial`
- `MeshStandardNodeMaterial`
- `MeshPhysicalNodeMaterial`
- `LineBasicNodeMaterial`
- `SpriteNodeMaterial`

## Section 6: Performance & Memory

### Disposal reference table

| Object | Method | When |
|--------|--------|------|
| `BufferGeometry` | `.dispose()` | When geometry no longer needed |
| `Material` | `.dispose()` | When material no longer needed (shader programs shared, released when all materials disposed) |
| `Texture` | `.dispose()` | When texture no longer needed |
| `WebGLRenderTarget` | `.dispose()` | When render target no longer needed |
| `Skeleton` | `.dispose()` | When skinned mesh removed (only if not shared) |
| `Controls` | `.dispose()` | Removes event listeners |
| `EffectComposer` | `.dispose()` | Removes render targets |
| `WebGLRenderer` | `.dispose()` | Final cleanup |

**IMPORTANT**: Textures are **NOT** disposed when their material is disposed. Dispose textures separately.

### Performance tips

- `InstancedMesh` for repeated geometry (one draw call)
- `LOD` (Level of Detail) for distant objects
- Share geometries and materials across meshes
- Use `renderer.info` to monitor draw calls
- `alpha: false` in renderer if no transparency needed

## Section 7: Post-Processing

### EffectComposer pipeline

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass());
composer.addPass(new OutputPass());

// In animate loop:
composer.render();
```

### Common passes

| Pass | Purpose |
|------|---------|
| `RenderPass` | Renders the scene (always first) |
| `UnrealBloomPass` | Bloom / glow effect |
| `FXAAPass` | Fast anti-aliasing |
| `OutputPass` | Color space conversion (add at end) |

### Integration with react-force-graph-3d

```tsx
useEffect(() => {
  if (!fgRef.current) return;
  const bloomPass = new UnrealBloomPass();
  bloomPass.strength = 4;
  bloomPass.radius = 1;
  bloomPass.threshold = 0;
  fgRef.current.postProcessingComposer().addPass(bloomPass);
}, []);
```

## Section 8: Debugging & Troubleshooting

### Symptom → Cause diagnostic guide

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Black object | No lights in scene OR using unlit material with black color | Add lights or check `material.color` |
| Object invisible / not rendering | Camera inside object, `near`/`far` planes wrong, or frustum culling | Move camera, adjust `camera.near` / `camera.far`, check object position |
| Washed out / overly bright colors | Missing tone mapping or color space mismatch | Set `renderer.toneMapping = THREE.ACESFilmicToneMapping` |
| Jagged edges | No anti-aliasing | Enable `antialias: true` in `WebGLRenderer` or use `FXAAPass` |
| Memory leak / slowdown | Not disposing textures, geometries, materials | Call `.dispose()` on removal |
| SSR crash / hydration error | three.js code running on server | Wrap in `dynamic(() => import(...), { ssr: false })` |
| Shadow not appearing | `shadowMap.enabled = false`, light doesn't cast shadows, or object doesn't cast/receive | Enable all 5 shadow requirements |
| Texture looks wrong | Wrong wrap mode, flipped UVs, or missing mipmap | Check `texture.wrapS` / `wrapT`, `texture.flipY`, `texture.generateMipmaps` |
| Colors don't match design | CSS sRGB vs three.js linear | Use `ColorManagement` or manually convert |
| Scene is too dark | Missing ambient light or light intensity too low | Add `AmbientLight` + directional/point light |
| Infinite re-mount loop in React | `Math.random()` or `Date.now()` in render path | Use deterministic values |

## Section 9: Local Reference

### Paths to the local three.js repository

| What | Path |
|------|------|
| Source code | `/home/alan/Code/three.js/src/` |
| Unit tests | `/home/alan/Code/three.js/test/unit/src/` |
| Manual / tutorials | `/home/alan/Code/three.js/manual/en/` |
| API docs pages | `/home/alan/Code/three.js/docs/pages/en/` |
| Examples / addons | `/home/alan/Code/three.js/examples/jsm/` |
| LLM-optimized docs (concise) | `/home/alan/Code/three.js/docs/llms.txt` |
| Full LLM docs | `/home/alan/Code/three.js/docs/llms-full.txt` |

### Searching the source

```bash
# Find where a class is defined
rg "class MeshStandardMaterial" /home/alan/Code/three.js/src/

# Find all unit tests for a module
ls /home/alan/Code/three.js/test/unit/src/materials/

# Find manual article
ls /home/alan/Code/three.js/manual/en/ | grep -i light
```

## Section 10: Common Pitfalls

Anti-patterns with consequences:

1. **Manual matrix math instead of scene graph** → code is brittle, doesn't compose
2. **Creating new `Vector3` / `Color` in render loop** → GC pressure, use `const _v = new Vector3()` outside loop and `.set()` inside
3. **Forgetting `dispose()`** → WebGL context loss, memory leaks
4. **Using `MeshBasicMaterial` and expecting shadows** → `MeshBasicMaterial` ignores ALL lighting
5. **Setting `camera.position` without `camera.updateProjectionMatrix()` after aspect change** → distorted view
6. **Mutating `graphData` in-place for react-force-graph** → React doesn't detect changes, create new objects
7. **Not using `globalScale` in custom canvas rendering** → text/images wrong size when zoomed
8. **Forgetting `nodePointerAreaPaint` with custom `nodeCanvasObject`** → hover/click detection breaks
9. **Using `Math.random()` in SSR components** → hydration mismatch, infinite loops
10. **Wrong light position vs direction for DirectionalLight** → position doesn't matter, direction vector does
