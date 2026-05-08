---
name: react-force-graph
description: Work with react-force-graph / force-graph / 3d-force-graph libraries. Use for force-directed graphs, network visualizations, graph layouts (2D Canvas, 3D Three.js, VR, AR), node/link styling, custom rendering, force engine tuning, and interaction patterns. Covers ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR components.
---

# react-force-graph Skill

React bindings for force-directed graphs. Four components: `ForceGraph2D` (Canvas), `ForceGraph3D` (Three.js), `ForceGraphVR` (A-Frame), `ForceGraphAR` (AR.js). The 2D and 3D variants share most props; VR/AR are subsets.

## Architecture

- **Kapsule bridge**: Each component wraps a vanilla kapsule module via `react-kapsule`. Props map directly to kapsule config setters. Methods exposed on the ref map to kapsule instance methods.
- **`initPropNames`** (e.g. `controlType`, `rendererConfig`, `extraRenderers`, `markerAttrs`): these only take effect on mount — changing them later has NO effect.
- **Data input**: `graphData` requires new object identity for React to detect changes. Mutating `nodes`/`links` arrays or their objects in-place will cause silent failures.
- **Node position state**: The force engine mutates `node.x`, `node.y`, `node.z`, `node.vx`, `node.vy`, `node.vz`. Fixed positions use `node.fx`, `node.fy`, `node.fz`. Do NOT put these in React state — they belong on the node objects themselves.

## Data Format

```json
{
  "nodes": [{ "id": "id1", "name": "Name", "val": 1, "color": "red" }],
  "links": [{ "source": "id1", "target": "id2" }]
}
```

- `nodeId` default: `"id"` — name of the unique identifier attribute on node objects
- `linkSource` default: `"source"`, `linkTarget` default: `"target"` — point to node ids
- `nodeVal` default: `"val"` — controls node size proportional to sqrt(val) in 2D, cbrt(val) in 3D

## Accessor Pattern

Every styling prop accepts three forms:

| Form | Example | Semantics |
|------|---------|-----------|
| Constant | `nodeColor="red"` | All nodes red |
| Attribute name | `nodeColor="group"` | Reads `node.group` |
| Function | `nodeColor={d => d.group > 5 ? "red" : "blue"}` | Full control |

This applies to: `nodeColor`, `nodeLabel`, `nodeVal`, `nodeVisibility`, `nodeAutoColorBy`, `linkColor`, `linkLabel`, `linkWidth`, `linkVisibility`, `linkCurvature`, `linkAutoColorBy`, `linkDirectionalArrowLength`, `linkDirectionalArrowColor`, `linkDirectionalArrowRelPos`, `linkDirectionalParticles`, `linkDirectionalParticleSpeed`, `linkDirectionalParticleOffset`, `linkDirectionalParticleWidth`, `linkDirectionalParticleColor`, and (2D-only) `linkLineDash`.

**Critical gotcha**: Accessor functions for link props receive the link object, NOT `{source, target}` node objects. The link's `source`/`target` are node IDs (strings/numbers), not node references. If you need node data in a link accessor, pass `graphData` through scope or pre-compute.

## The Ref Pattern

```jsx
import { useRef } from 'react';

const fgRef = useRef();
// ...
<ForceGraph3D ref={fgRef} graphData={data} />
// then call: fgRef.current.zoomToFit()
```

### 2D Ref Methods

```
emitParticle(link)         — emit single particle along link
d3Force(name) / d3Force(name, fn) — get/set force functions
d3ReheatSimulation()       — restart simulation
stopAnimation()            — freeze rendering (removes canvas from DOM)  
pauseAnimation()           — freeze rendering (keeps view)
resumeAnimation()          — restart rendering
centerAt(x?, y?, ms?)      — pan viewport
zoom(k?, ms?)              — zoom in/out
zoomToFit(ms?, px?, filter?)— auto zoom/pan to fit
getGraphBbox(filter?)      — { x: [min,max], y: [min,max] }
screen2GraphCoords(x, y)   — screen px → graph coords
graph2ScreenCoords(x, y)   — graph coords → screen px
```

### 3D Ref Methods

All of the above (minus `centerAt` and `zoom`, plus):

```
cameraPosition({x?,y?,z?}, lookAt?, ms?) — animate camera
postProcessingComposer()   — access EffectComposer
lights() / lights(arr)     — get/set scene lights
scene()                    — ThreeJS Scene
camera()                   — ThreeJS Camera
renderer()                 — WebGLRenderer
controls()                 — controls object
refresh()                  — redraw all
```

### VR/AR Ref Methods (subset)

```
emitParticle, d3Force, d3ReheatSimulation, refresh, getGraphBbox
```

## 2D Custom Node Rendering (critical recipe)

When using `nodeCanvasObject`, you MUST also provide `nodePointerAreaPaint` or hover/click detection won't work:

```jsx
<ForceGraph2D
  nodeCanvasObject={(node, ctx, globalScale) => {
    const fontSize = 12 / globalScale;  // zoom-independent sizing
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = node.color;
    ctx.fillText(node.id, node.x, node.y);
    // Stash computed dimensions for pointer area
    node.__bckgDimensions = [ctx.measureText(node.id).width, fontSize];
  }}
  nodePointerAreaPaint={(node, color, ctx) => {
    ctx.fillStyle = color;  // color is the node's unique detection ID
    const [w, h] = node.__bckgDimensions || [10, 10];
    ctx.fillRect(node.x - w/2, node.y - h/2, w, h);
  }}
/>
```

**`nodeCanvasObjectMode`**: `"replace"` (default), `"before"`, or `"after"` the default circle.
Return the mode per-node with a function: `nodeCanvasObjectMode={n => highlightNodes.has(n) ? 'before' : undefined}`

**`globalScale`**: Use it in ALL custom rendering for zoom-independent sizing. `fontSize = baseSize / globalScale`. Without this, nodes look wrong when zoomed.

## 3D Custom Node Objects

```jsx
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

<ForceGraph3D
  nodeThreeObject={node => {
    // Return a Three.js Object3D, or falsy to use default sphere
    const sprite = new SpriteText(node.id);
    sprite.color = node.color;
    sprite.textHeight = 8;
    return sprite;
  }}
  nodeThreeObjectExtend={true}  // keep default sphere underneath
/>
```

- `nodeThreeObjectExtend={true}`: custom object added alongside default sphere
- `nodeThreeObjectExtend={false}` (default): custom object REPLACES default sphere
- `nodePositionUpdate(obj, coords, node)`: custom position logic. Return truthy to skip default positioning.
- `nodeThreeObject` receives `(node)` and must return Object3D instance (not a class/constructor)

**CSS2D for HTML overlays**:
```jsx
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
const extraRenderers = [new CSS2DRenderer()];

<ForceGraph3D
  extraRenderers={extraRenderers}
  nodeThreeObject={node => {
    const el = document.createElement('div');
    el.textContent = node.id;
    el.style.color = node.color;
    return new CSS2DObject(el);
  }}
  nodeThreeObjectExtend={true}
/>
```

## 3D Custom Link Objects

```jsx
<ForceGraph3D
  linkThreeObject={link => {
    const sprite = new SpriteText(`${link.source} → ${link.target}`);
    return sprite;
  }}
  linkThreeObjectExtend={true}
  linkPositionUpdate={(sprite, { start, end }, link) => {
    // Must manually position: library doesn't know custom object shape
    Object.assign(sprite.position, {
      x: start.x + (end.x - start.x) / 2,
      y: start.y + (end.y - start.y) / 2,
      z: start.z + (end.z - start.z) / 2,
    });
  }}
/>
```

`linkPositionUpdate` is MANDATORY for custom link objects. The callback receives `(object3D, {start: {x,y,z}, end: {x,y,z}}, linkData)`. Return truthy to skip default `lookAt` positioning.

## Force Engine Tuning

### Simulation lifecycle

- `warmupTicks` (default `0`): ticks to run BEFORE any rendering. For large graphs (300+ nodes), set to 50-100 to avoid jarring spread.
- `cooldownTicks` (default `Infinity`): render ticks before auto-freeze. Engine stops when cooldownTicks OR cooldownTime is reached (whichever first).
- `cooldownTime` (default `15000`): ms before auto-freeze.
- `onEngineStop()`: fires when layout freezes.

### DAG Mode

Constrains layout to a directed acyclic graph (tree/hierarchy). Modes: `"td"` (top-down), `"bu"`, `"lr"`, `"rl"`, `"zout"`, `"zin"`, `"radialout"`, `"radialin"`.

- Graph MUST be acyclic. If cycles exist, `onDagError(loopNodeIds)` fires and layout is best-effort.
- `dagLevelDistance`: spacing between depth levels. Auto-derived if not set.
- `dagNodeFilter(node) => bool`: exclude nodes from DAG constraint.

### Custom Forces

```jsx
import { forceCollide } from 'd3-force-3d';

// In useEffect after ref is ready:
fgRef.current.d3Force('center', null);   // remove default
fgRef.current.d3Force('charge', null);   // remove default
fgRef.current.d3Force('collide', forceCollide(4)); // add collision
fgRef.current.d3Force('box', () => { ... });       // add boundary
```

Default forces: `"link"`, `"charge"`, `"center"`. Remove with `d3Force(name, null)`. Add with `d3Force(name, forceFn)`.

### Continuous simulation (no auto-freeze)

```jsx
cooldownTime={Infinity}
d3AlphaDecay={0}
d3VelocityDecay={0}
```

## Directional Links

### Arrows
```jsx
linkDirectionalArrowLength={3.5}      // 0 = no arrow
linkDirectionalArrowRelPos={1}        // 0=at source, 0.5=middle, 1=at target
linkDirectionalArrowColor="red"
linkCurvature={0.25}                  // curve to make arrows visible on straight links
```

### Particles
```jsx
linkDirectionalParticles={4}          // number of particles per link
linkDirectionalParticleSpeed={0.01}   // ratio of link length per frame (>0.5 bad)
linkDirectionalParticleWidth={2}      // particle pixel size
linkDirectionalParticleColor="red"
```

Use `linkDirectionalParticles="value"` to bind to a link attribute.

### Emit single particles on demand

```jsx
onLinkClick={link => fgRef.current.emitParticle(link)}
```
The particle follows the link once then disappears. Reuses `linkDirectionalParticle*` style props.

## Common Recipes

### Highlight nodes/links on hover (2D)

```jsx
const [highlightNodes, setHighlightNodes] = useState(new Set());
const [highlightLinks, setHighlightLinks] = useState(new Set());
const [hoverNode, setHoverNode] = useState(null);

const handleNodeHover = node => {
  highlightNodes.clear();
  highlightLinks.clear();
  if (node) {
    highlightNodes.add(node);
    node.neighbors?.forEach(n => highlightNodes.add(n));
    node.links?.forEach(l => highlightLinks.add(l));
  }
  setHoverNode(node || null);
};

// Pre-compute neighbors/links on load:
data.links.forEach(link => {
  const a = data.nodes[link.source], b = data.nodes[link.target];
  a.neighbors = [...(a.neighbors || []), b];
  b.neighbors = [...(b.neighbors || []), a];
  a.links = [...(a.links || []), link];
  b.links = [...(b.links || []), link];
});

// Then in props:
nodeCanvasObjectMode={n => highlightNodes.has(n) ? 'before' : undefined}
nodeCanvasObject={(node, ctx) => {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 10, 0, 2*Math.PI);
  ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
  ctx.fill();
}}
linkWidth={l => highlightLinks.has(l) ? 4 : 1}
```

**Note**: Must call `setHighlightNodes(new Set(highlightNodes))` (create new Set) for React to re-render. Mutating the existing Set and calling setState with it won't trigger an update since React sees the same reference.

### Click-to-focus camera (3D)

```jsx
const handleClick = useCallback(node => {
  const distance = 40;
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
  fgRef.current.cameraPosition(
    { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
    node,   // lookAt target
    3000    // animation duration ms
  );
}, [fgRef]);
```

### Fix nodes after dragging (3D, also works for 2D)

```jsx
onNodeDragEnd={node => {
  node.fx = node.x;
  node.fy = node.y;
  node.fz = node.z;  // omit z for 2D
}}
```

### Dynamic data (add/remove nodes)

React detects graphData changes by OBJECT IDENTITY. Must create new objects:

```jsx
const [data, setData] = useState({ nodes: [{ id: 0 }], links: [] });

// Add node:
setData(({ nodes, links }) => ({
  nodes: [...nodes, { id: nodes.length }],
  links: [...links, { source: nodes.length, target: Math.floor(Math.random() * nodes.length) }]
}));

// Remove node:
const handleClick = node => {
  setData(({ nodes, links }) => {
    const newNodes = nodes.filter(n => n !== node);
    const newLinks = links.filter(l => {
      const src = typeof l.source === 'object' ? l.source : nodes.find(n => n.id === l.source);
      const tgt = typeof l.target === 'object' ? l.target : nodes.find(n => n.id === l.target);
      return src !== node && tgt !== node;
    });
    return { nodes: newNodes, links: newLinks };
  });
};
```

### Expandable/collapsible nodes

```jsx
const getPrunedTree = () => {
  const visibleNodes = [];
  const visibleLinks = [];
  (function traverseTree(node = rootNode) {
    visibleNodes.push(node);
    if (node.collapsed) return;
    visibleLinks.push(...node.childLinks);
    node.childLinks.forEach(link => traverseTree(getTargetNode(link)));
  })();
  return { nodes: visibleNodes, links: visibleLinks };
};
// Toggle with onNodeClick: node.collapsed = !node.collapsed; then setPrunedTree(getPrunedTree())
```

### Multi-selection with group drag

```jsx
const [selectedNodes, setSelectedNodes] = useState(new Set());

onNodeClick={(node, event) => {
  if (event.ctrlKey || event.shiftKey || event.altKey) {
    // toggle
    selectedNodes.has(node) ? selectedNodes.delete(node) : selectedNodes.add(node);
  } else {
    // single select (or untoggle if already single-selected)
    const untoggle = selectedNodes.has(node) && selectedNodes.size === 1;
    selectedNodes.clear();
    if (!untoggle) selectedNodes.add(node);
  }
  setSelectedNodes(new Set(selectedNodes));
}}

onNodeDrag={(node, translate) => {
  if (selectedNodes.has(node)) {
    [...selectedNodes]
      .filter(s => s !== node)
      .forEach(s => {
        s.fx = s.x + translate.x;
        s.fy = s.y + translate.y;
        s.fz = s.z + (translate.z || 0);
      });
  }
}}

onNodeDragEnd={node => {
  if (selectedNodes.has(node)) {
    [...selectedNodes].filter(s => s !== node)
      .forEach(s => { s.fx = undefined; s.fy = undefined; s.fz = undefined; });
  }
}}
```

### Zoom to fit after layout settles

```jsx
<ForceGraph2D
  cooldownTicks={100}
  onEngineStop={() => fgRef.current.zoomToFit(400)}  // 400ms animation
/>
```

### Bloom post-processing (3D)

```jsx
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

useEffect(() => {
  const bloomPass = new UnrealBloomPass();
  bloomPass.strength = 4;
  bloomPass.radius = 1;
  bloomPass.threshold = 0;
  fgRef.current.postProcessingComposer().addPass(bloomPass);
}, []);
// Set backgroundColor="#000003" for best bloom results
```

### Camera auto-orbit (3D)

```jsx
useEffect(() => {
  fgRef.current.cameraPosition({ z: distance });
  let angle = 0;
  const interval = setInterval(() => {
    fgRef.current.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle),
    });
    angle += Math.PI / 300;
  }, 10);
  return () => clearInterval(interval);
}, []);
// Disable user controls: enableNavigationControls={false}
```

### Collision detection with bouncing (2D)

```jsx
useEffect(() => {
  fgRef.current.d3Force('center', null);
  fgRef.current.d3Force('charge', null);
  fgRef.current.d3Force('collide', forceCollide(4));
  fgRef.current.d3Force('box', () => {
    nodes.forEach(node => {
      if (Math.abs(node.x) > HALF_SIDE) { node.vx *= -1; }
      if (Math.abs(node.y) > HALF_SIDE) { node.vy *= -1; }
    });
  });
}, []);
// Keep simulation alive: cooldownTime={Infinity} d3AlphaDecay={0} d3VelocityDecay={0}
```

## Common Pitfalls

1. **Mutating graphData in-place**: `nodes.push(...)` or `links.push(...)` without creating new objects. React won't detect changes. Always create new array/object references.

2. **Missing `nodePointerAreaPaint`**: Custom `nodeCanvasObject` replaces default rendering, but pointer detection still uses the default circle area unless you also provide `nodePointerAreaPaint`.

3. **Not using `globalScale` in custom canvas rendering**: Node text/images will appear tiny when zoomed out and huge when zoomed in. Always divide visual sizes by `globalScale`.

4. **Link accessor confusion**: `link.source` and `link.target` in accessor functions are node IDs (strings/numbers), NOT node objects. To get node data in link accessors, reference node data via scope.

5. **`useEffect` running before ref is ready**: In strict mode, effects may run before the kapsule instance is mounted. Guard with `if (!fgRef.current) return;` or use `onEngineStop`/`onEngineTick` callbacks.

6. **`cooldownTicks` vs `cooldownTime`**: Both are active simultaneously. The engine stops when EITHER is reached. If you set `cooldownTicks={100}` but also have `cooldownTime={15000}`, the 100-tick limit likely triggers first on small graphs.

7. **Forgetting `warmupTicks` for large graphs**: 300+ nodes with no warmup results in a violent initial explosion that users see. Set `warmupTicks={50}` minimum.

8. **Changing `graphData` while drag is in progress**: Can cause nodes to snap or disappear. Pause node drag if doing data updates.

9. **`linkDirectionalArrowRelPos` default is `0.5`**: Arrow sits in the middle of the link. Use `1` to place at the target node, `0` at source.

10. **Set memoization breaking custom renders**: When using `useMemo` or `useCallback` on accessor functions, ensure the dependency list is correct. A stale `useCallback` for `nodeColor` with `[selectedNodes]` won't update if `selectedNodes` is a mutated Set (use `new Set(selectedNodes)` in state updates).

11. **`width`/`height` default to `window.innerWidth/Height`**: If your container isn't full-window, explicitly pass these props. The component won't auto-resize to a smaller parent div without them.

12. **Not disposing Three.js objects**: Custom `nodeThreeObject` and `linkThreeObject` functions create new objects on every render. The library handles disposal internally, but if you're caching objects externally, you must dispose of unused ones.

13. **`linkHoverPrecision` default is `4`**: Low values mean you must hover very close to the link. Increase to make links easier to interact with (e.g. `10`).

14. **VR/AR require A-Frame globally**: `ForceGraphVR` and `ForceGraphAR` need `<script src="//cdn.jsdelivr.net/npm/aframe">` loaded before the component renders. In AR mode, also need camera permissions.

## TypeScript

Use generics for strongly typed node/link data:

```tsx
type MyNode = { id: number; group: string; neighbors?: MyNode[]; links?: MyLink[] };
type MyLink = { source: number; target: number; value: number };

const fgRef = useRef<ForceGraphMethods<MyNode, MyLink>>();

<ForceGraph3D<MyNode, MyLink>
  ref={fgRef}
  graphData={data}
  nodeColor={node => node.group === 'A' ? 'red' : 'blue'}
  linkWidth={link => link.value}
/>
```

The ref type must match the component type parameters exactly, or the `current` accessor won't be properly typed.
