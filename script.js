// ================================
// URLS
// ================================
const URLS = {
  // ======================
  // GLB MODELS (R2)
  // ======================
  site: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/site.glb',
  building: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/model_Building.glb',
  chunk: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/Chunk.glb',

  // ======================
  // DRAWINGS (R2)
  // ======================
  plan1: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/plan1.png',
  plan2: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/plan2.png',
  section: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/section.png',
  chunkDrawing: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/Chunk-drawing.png',

  // ======================
  // ADDITIONAL DRAWINGS
  // ======================
  dome2: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/Dome-2.png',
  groundFloor: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/ground-floor.png',
  secondFloor1: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/second-floor-1.png',
  secondFloor2: 'https://pub-969afcd7db904231b2d9023d590e0473.r2.dev/second-floor-2.png'
};

// ================================
// DOM
// ================================
const dom = {
  introScreen: document.getElementById('intro-screen'),
  introCanvas: document.getElementById('intro-canvas'),
  introCtx: document.getElementById('intro-canvas').getContext('2d'),
  enterButton: document.getElementById('enter-button'),
  explodeButton: document.getElementById('explode-button'),

  infoPanel: document.getElementById('info-panel'),
  infoTitle: document.getElementById('info-title'),
  infoDesc: document.getElementById('info-desc'),
  infoImage: document.getElementById('info-image'),
  infoImageOverlay: document.getElementById('info-image-overlay'),
  infoClose: document.getElementById('info-close'),

  viewButtons: document.querySelectorAll('.view-btn'),

  plan1Container: document.getElementById('plan1-container'),
  plan2Container: document.getElementById('plan2-container'),
  overlayPlan1: document.getElementById('overlay-plan1'),
  overlayPlan2: document.getElementById('overlay-plan2'),
  overlaySection: document.getElementById('overlay-section'),

  vignette: document.getElementById('vignette'),
  sectionBackdrop: document.getElementById('section-backdrop'),
  canvas: document.getElementById('canvas'),

  drawingsButton: document.getElementById('drawings-button'),
  drawingsMenu: document.getElementById('drawings-menu'),

  shadowStudyButton: document.getElementById('shadow-study-button'),
  shadowSliderWrap: document.getElementById('shadow-slider-wrap'),
  shadowSlider: document.getElementById('shadow-slider'),

  conceptButton: document.getElementById('concept-button'),
  conceptOverlay: document.getElementById('concept-overlay'),
  conceptClose: document.getElementById('concept-close'),
  conceptStars: document.getElementById('concept-stars'),
  conceptThreeCanvas: document.getElementById('concept-three-canvas'),

  chunkButton: document.getElementById('chunk-button'),
  chunkStars: document.getElementById('chunk-stars'),

  chunkDrawingButton: document.getElementById('chunk-drawing-button'),
  chunkDrawingOverlay: document.getElementById('chunk-drawing-overlay'),
  chunkDrawingClose: document.getElementById('chunk-drawing-close'),
  chunkDrawingImage: document.getElementById('chunk-drawing-image')
};

// ================================
// INITIAL IMAGE SRCs
// ================================
dom.overlayPlan1.src = URLS.plan1;
dom.overlayPlan2.src = URLS.plan2;
dom.overlaySection.src = URLS.section;
dom.chunkDrawingImage.src = URLS.chunkDrawing;

// ================================
// PROGRAM DATA
// ================================
const PROGRAM_DATA = {
  "be3e3e": {
    name: "High_Performance_Envelope",
    desc: "Large performance and gathering space."
  },
  "3ebebe": {
    name: "Archive_",
    desc: "Primary entry and circulation hub."
  },
  "beffbe": {
    name: "Entrance_",
    desc: "Back-of-house and operational spaces."
  },
  "000000": {
    name: "Core",
    desc: "Vertical circulation and services."
  },
  "ca886e": {
    name: "Facade_Modules",
    desc: "Flexible public-facing program space."
  },
  "ff7fff": {
    name: "Immersive_Dome",
    desc: "Specialized program or focal element."
  },
  "ffdead": {
    name: "Core_",
    desc: "Supporting spatial layer within the building."
  }
};

const EXPLODE_EXCLUDED_HEXES = new Set(['000000', 'ffdead']);

// ================================
// PLAN SPACES
// ================================
const PLAN_SPACES = {
  plan1: [
    {
      id: 'p1-second-1',
      name: 'Second Floor',
      desc: 'Placeholder description — tell me what to put here.',
      image: URLS.secondFloor1,
      x: 55,
      y: 40
    },
    {
      id: 'p1-second-2',
      name: 'Second Floor — View 2',
      desc: 'Placeholder description — tell me what to put here.',
      image: URLS.secondFloor2,
      x: 35,
      y: 40
    }
  ],
  plan2: [
    {
      id: 'p2-immersive',
      name: 'Immersive Exhibit',
      desc: 'Placeholder description — tell me what to put here.',
      image: URLS.groundFloor,
      x: 40,
      y: 45
    }
  ]
};

// ================================
// APP STATE
// ================================
const state = {
  intro: {
    width: window.innerWidth,
    height: window.innerHeight,
    running: true,
    time: 0,
    mouseX: window.innerWidth * 0.5,
    mouseY: window.innerHeight * 0.5,
    ripples: [],
    fieldPoints: []
  },

  concept: {
    open: false,
    stars: []
  },

  chunk: {
    stars: []
  },

  models: {
    site: null,
    building: null,
    chunk: null
  },

  explode: {
    active: false,
    programGroups: {},
    explodableGroups: {},
    originalPositions: new Map(),
    targetPositions: new Map(),
    offsets: new Map(),
    selectedHex: null
  },

  interaction: {
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2()
  },

  view: {
    current: 'default'
  }
};

// ================================
// MAIN SCENE / CAMERAS / RENDERER
// ================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
scene.fog = new THREE.Fog(0x0f1115, 100, 1100);

const perspectiveCamera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
perspectiveCamera.position.set(40, 30, 10);

const orthoFrustum = 40;
const aspect = window.innerWidth / window.innerHeight;

const orthographicCamera = new THREE.OrthographicCamera(
  (-orthoFrustum * aspect) / 2,
  (orthoFrustum * aspect) / 2,
  orthoFrustum / 2,
  -orthoFrustum / 2,
  0.1,
  10000
);
orthographicCamera.position.set(0, 200, 0.01);
orthographicCamera.lookAt(0, 0, 0);

let activeCamera = perspectiveCamera;
const cameraTargetPosition = perspectiveCamera.position.clone();
const cameraTargetLookAt = new THREE.Vector3(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: dom.canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

const controls = new THREE.OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.5;
controls.zoomSpeed = 2.0;
controls.panSpeed = 1.5;

// ================================
// CONCEPT 3D SCENE
// ================================
const conceptScene = new THREE.Scene();
const conceptCamera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
conceptCamera.position.set(0, 0, 1400);

const conceptRenderer = new THREE.WebGLRenderer({
  canvas: dom.conceptThreeCanvas,
  antialias: true,
  alpha: true
});
conceptRenderer.setSize(window.innerWidth, window.innerHeight);
conceptRenderer.setPixelRatio(window.devicePixelRatio);
conceptRenderer.setClearColor(0x000000, 0);

const conceptControls = new THREE.OrbitControls(conceptCamera, dom.conceptThreeCanvas);
conceptControls.enableDamping = true;
conceptControls.dampingFactor = 0.06;
conceptControls.rotateSpeed = 0.8;
conceptControls.zoomSpeed = 0.8;
conceptControls.panSpeed = 0.7;
conceptControls.enablePan = true;
conceptControls.enableZoom = true;
conceptControls.minDistance = 500;
conceptControls.maxDistance = 2400;

// ================================
// ENVIRONMENT MAP
// ================================
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new THREE.TextureLoader().load(
  'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
  (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  },
  undefined,
  () => {
    console.warn('Environment map failed to load, continuing without it.');
  }
);

// ================================
// LIGHTS / HELPERS
// ================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.60);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(100, 60, 60);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.camera.left = -120;
directionalLight.shadow.camera.right = 120;
directionalLight.shadow.camera.top = 120;
directionalLight.shadow.camera.bottom = -120;
directionalLight.shadow.bias = -0.0005;
directionalLight.shadow.normalBias = 0.02;
directionalLight.shadow.radius = 2;
scene.add(directionalLight);
scene.add(directionalLight.target);

const conceptAmbientLight = new THREE.AmbientLight(0xffffff, 0.9);
conceptScene.add(conceptAmbientLight);

const conceptDirectional = new THREE.DirectionalLight(0xffffff, 0.7);
conceptDirectional.position.set(300, 400, 500);
conceptScene.add(conceptDirectional);

const gridHelper = new THREE.GridHelper(500, 40, 0x444444, 0x222222);
gridHelper.visible = false;
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(20);
axesHelper.visible = false;
scene.add(axesHelper);

// ================================
// LOADERS / ROOT
// ================================
const gltfLoader = new THREE.GLTFLoader();

const projectGroup = new THREE.Group();
scene.add(projectGroup);

const shadowGround = new THREE.Mesh(
  new THREE.PlaneGeometry(10000, 10000),
  new THREE.ShadowMaterial({ opacity: 0.22 })
);
shadowGround.rotation.x = -Math.PI / 2;
shadowGround.receiveShadow = true;
scene.add(shadowGround);

// ================================
// SAVED VIEWS
// ================================
const savedViews = {
  plan1: {
    position: new THREE.Vector3(0, 220, 0.01),
    target: new THREE.Vector3(0, 0, 0)
  },
  plan2: {
    position: new THREE.Vector3(0, 220, 0.01),
    target: new THREE.Vector3(0, 40, 0)
  },
  section: {
    position: new THREE.Vector3(120, 20, 50),
    target: new THREE.Vector3(100, 100, 0)
  }
};

// ================================
// UI HELPERS
// ================================
function hideAllDrawings() {
  if (dom.plan1Container) dom.plan1Container.classList.remove('visible');
  if (dom.plan2Container) dom.plan2Container.classList.remove('visible');
  dom.overlaySection.classList.remove('visible');
}

function showDrawing(viewName) {
  hideAllDrawings();

  if (viewName === 'plan1' && dom.plan1Container) dom.plan1Container.classList.add('visible');
  if (viewName === 'plan2' && dom.plan2Container) dom.plan2Container.classList.add('visible');
  if (viewName === 'section') dom.overlaySection.classList.add('visible');
}

function showVignette() {
  if (dom.vignette) dom.vignette.classList.add('visible');
}

function hideVignette() {
  if (dom.vignette) dom.vignette.classList.remove('visible');
}

function showSectionBackdrop() {
  if (dom.sectionBackdrop) dom.sectionBackdrop.classList.add('visible');
}

function hideSectionBackdrop() {
  if (dom.sectionBackdrop) dom.sectionBackdrop.classList.remove('visible');
}

function showInfoPanel({ title, desc, image }) {
  dom.infoTitle.innerText = title || '';
  dom.infoDesc.innerText = desc || '';

  if (image) {
    dom.infoImage.onload = () => {
      dom.infoImageOverlay.classList.add('visible');
    };
    dom.infoImage.onerror = () => {
      dom.infoImageOverlay.classList.remove('visible');
    };
    dom.infoImage.src = image;
    dom.infoImage.alt = title || '';
  } else {
    dom.infoImage.onload = null;
    dom.infoImage.onerror = null;
    dom.infoImageOverlay.classList.remove('visible');
    dom.infoImage.removeAttribute('src');
  }

  dom.infoPanel.classList.add('visible');
}

function hideInfoPanel() {
  dom.infoPanel.classList.remove('visible');
  dom.infoImageOverlay.classList.remove('visible');
  dom.infoImage.removeAttribute('src');
  document.querySelectorAll('.plan-marker.active').forEach((n) =>
    n.classList.remove('active')
  );
}

function showProgramInfo(name, desc) {
  showInfoPanel({ title: name, desc: desc });
}

function hideProgramInfo() {
  hideInfoPanel();
}

function openConceptOverlay() {
  state.concept.open = true;
  dom.conceptOverlay.classList.remove('hidden');
  closeAllMenus();
}

function closeConceptOverlay() {
  state.concept.open = false;
  dom.conceptOverlay.classList.add('hidden');
}

function openChunkDrawing() {
  if (dom.chunkDrawingOverlay) {
    dom.chunkDrawingOverlay.classList.add('visible');
  }
}

function closeChunkDrawing() {
  if (dom.chunkDrawingOverlay) {
    dom.chunkDrawingOverlay.classList.remove('visible');
  }
}

// ================================
// PLAN MARKERS
// ================================
function createPlanMarkers() {
  ['plan1', 'plan2'].forEach((planKey) => {
    const container = document.getElementById(planKey + '-container');
    if (!container) return;

    container.querySelectorAll('.plan-marker').forEach((n) => n.remove());

    (PLAN_SPACES[planKey] || []).forEach((space, index) => {
      const btn = document.createElement('button');
      btn.className = 'plan-marker';
      btn.textContent = String(index + 1);
      btn.style.left = space.x + '%';
      btn.style.top = space.y + '%';
      btn.dataset.planKey = planKey;
      btn.dataset.spaceId = space.id;
      btn.title = space.name;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePlanMarkerClick(planKey, space.id, btn);
      });
      container.appendChild(btn);
    });
  });
}

function handlePlanMarkerClick(planKey, spaceId, btnEl) {
  const list = PLAN_SPACES[planKey] || [];
  const space = list.find((s) => s.id === spaceId);
  if (!space) return;

  document.querySelectorAll('.plan-marker.active').forEach((n) =>
    n.classList.remove('active')
  );
  btnEl.classList.add('active');

  showInfoPanel({
    title: space.name,
    desc: space.desc,
    image: space.image
  });
}

// ================================
// CAMERA HELPERS
// ================================
function getBuildingBox() {
  if (!state.models.building) return null;
  return new THREE.Box3().setFromObject(state.models.building);
}

function getBuildingCenterAndSize() {
  const box = getBuildingBox();
  if (!box) return null;

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  return { box, center, size, maxDim: Math.max(size.x, size.y, size.z) };
}

function setActiveCamera(camera) {
  activeCamera = camera;
  controls.object = camera;
}

function setHeroAxonView() {
  const data = getBuildingCenterAndSize();
  if (!data) return;

  const { center, maxDim } = data;

  const heroPosition = new THREE.Vector3(
    center.x - maxDim * 1.8,
    center.y + maxDim * 1.45,
    center.z + maxDim * 1.55
  );

  perspectiveCamera.position.copy(heroPosition);
  controls.target.copy(center);

  cameraTargetPosition.copy(heroPosition);
  cameraTargetLookAt.copy(center);

  controls.update();
}

function setPerspectiveView(position, target, fov = 35, enableControls = false) {
  setActiveCamera(perspectiveCamera);

  perspectiveCamera.fov = fov;
  perspectiveCamera.updateProjectionMatrix();

  cameraTargetPosition.copy(position);
  cameraTargetLookAt.copy(target);

  if (enableControls) {
    perspectiveCamera.position.copy(position);
    controls.target.copy(target);
    controls.enabled = true;
    controls.update();
  } else {
    controls.enabled = false;
  }
}

function setOrthoView(position, target) {
  setActiveCamera(orthographicCamera);

  orthographicCamera.position.copy(position);
  orthographicCamera.up.set(0, 0, -1);
  orthographicCamera.lookAt(target);
  orthographicCamera.updateProjectionMatrix();

  cameraTargetLookAt.copy(target);
  controls.enabled = false;
}

function frameCameraToObject(object, padding = 1.8) {
  if (!object) return;

  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  box.getCenter(center);
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = Math.max(maxDim * padding, 120);

  const position = new THREE.Vector3(
    center.x + distance * 0.9,
    center.y + distance * 0.55,
    center.z + distance * 0.9
  );

  setPerspectiveView(position, center, 35, true);
}

// ================================
// MODEL VISIBILITY HELPERS
// ================================
function resetMaterialOpacity(object) {
  if (!object) return;

  object.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = false;
      child.material.opacity = 1;
    }
  });
}

function setBuildingGhosted(hidden) {
  if (!state.models.building) return;
  state.models.building.visible = !hidden;
}

function showMainProject() {
  if (state.models.site) state.models.site.visible = true;
  if (state.models.building) state.models.building.visible = true;
  if (state.models.chunk) state.models.chunk.visible = false;
}

function showChunkOnly() {
  if (state.models.site) state.models.site.visible = false;
  if (state.models.building) state.models.building.visible = false;
  if (state.models.chunk) state.models.chunk.visible = true;
}

function resetSiteVisibility() {
  const site = state.models.site;
  const building = state.models.building;

  if (site) {
    site.traverse((child) => {
      if (child.isMesh) child.visible = true;
      if (child.isLine || child.type === "LineSegments") {
        child.visible = !!child.userData.isSiteEdgeOverlay;
      }
    });
  }

  if (building) {
    building.traverse((child) => {
      if (child.isLine || child.type === "LineSegments") {
        child.visible = !!child.userData.isBuildingEdgeOverlay;
      }
    });
  }

  gridHelper.visible = false;
  axesHelper.visible = false;
}

function updateSiteOcclusionForSection() {
  const site = state.models.site;
  const building = state.models.building;
  if (!site || !building) return;

  const buildingBox = new THREE.Box3().setFromObject(building);
  const buildingCenter = new THREE.Vector3();
  buildingBox.getCenter(buildingCenter);

  const cameraPosition = activeCamera.position.clone();
  const buildingDistance = cameraPosition.distanceTo(buildingCenter);

  site.traverse((child) => {
    if (!child.isMesh) return;

    const meshBox = new THREE.Box3().setFromObject(child);
    const meshCenter = new THREE.Vector3();
    meshBox.getCenter(meshCenter);

    const meshDistance = cameraPosition.distanceTo(meshCenter);
    child.visible = meshDistance > buildingDistance - 40;
  });
}

// ================================
// VIEW SWITCHING
// ================================
function updateSunPosition(angleDeg) {
  if (!state.models.building) return;

  const box = new THREE.Box3().setFromObject(projectGroup);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  box.getCenter(center);
  box.getSize(size);

  const radius = Math.max(size.x, size.z) * 1.4;
  const minHeight = size.y * 0.35;
  const maxHeight = size.y * 0.9;

  const angleRad = THREE.MathUtils.degToRad(angleDeg);
  const sunHeightFactor = (Math.sin(angleRad) + 1) * 0.5;
  const height = THREE.MathUtils.lerp(minHeight, maxHeight, sunHeightFactor);

  directionalLight.position.set(
    center.x + Math.cos(angleRad) * radius,
    center.y + height,
    center.z + Math.sin(angleRad) * radius
  );

  directionalLight.target.position.set(center.x, center.y, center.z);
  directionalLight.target.updateMatrixWorld();

  directionalLight.shadow.camera.left = -300;
  directionalLight.shadow.camera.right = 300;
  directionalLight.shadow.camera.top = 300;
  directionalLight.shadow.camera.bottom = -300;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 2000;
  directionalLight.shadow.camera.updateProjectionMatrix();
}

function disableShadowsForPlan() {
  directionalLight.castShadow = false;
  directionalLight.intensity = 0;
  ambientLight.intensity = 1.2;

  scene.background = new THREE.Color(0xffffff);
  scene.fog.color.set(0xffffff);
  scene.fog.near = 1;
  scene.fog.far = 10000;
}

function enableShadowsFor3D() {
  directionalLight.castShadow = true;
  directionalLight.intensity = 2.2;
  ambientLight.intensity = 0.60;

  scene.background = new THREE.Color(0x151515);
  scene.fog.color.set(0x0f1115);
  scene.fog.near = 100;
  scene.fog.far = 1100;
}

function goToDefaultView() {
  state.view.current = 'default';

  const data = getBuildingCenterAndSize();
  if (!data) return;

  const { center, maxDim } = data;

  const heroPosition = new THREE.Vector3(
    center.x - maxDim * 1.8,
    center.y + maxDim * 1.45,
    center.z + maxDim * 1.55
  );

  setPerspectiveView(heroPosition, center, 35, true);

  hideAllDrawings();
  hideVignette();
  hideSectionBackdrop();

  enableShadowsFor3D();

  showMainProject();
  setBuildingGhosted(false);
  resetSiteVisibility();
  resetSelection();

  if (dom.chunkStars) dom.chunkStars.classList.remove('visible');
  if (dom.chunkButton) dom.chunkButton.innerText = 'Chunk';
  if (dom.chunkDrawingButton) dom.chunkDrawingButton.classList.remove('visible');
}

function goToSectionView() {
  state.view.current = 'section';

  const view = savedViews.plan1;
  setOrthoView(view.position, view.target);

  showDrawing('section');
  hideVignette();
  hideSectionBackdrop();

  disableShadowsForPlan();

  setBuildingGhosted(true);
  resetSiteVisibility();
  hideSiteForPlan();
  resetSelection();

  if (dom.chunkStars) dom.chunkStars.classList.remove('visible');
  if (dom.chunkButton) dom.chunkButton.innerText = 'Chunk';
  if (dom.chunkDrawingButton) dom.chunkDrawingButton.classList.remove('visible');
}

function goToPlanView(viewName) {
  state.view.current = viewName;

  const view = savedViews[viewName];
  if (!view) return;

  setOrthoView(view.position, view.target);

  showDrawing(viewName);
  hideVignette();
  hideSectionBackdrop();

  disableShadowsForPlan();

  setBuildingGhosted(true);
  resetSiteVisibility();
  hideSiteForPlan();
  resetSelection();

  if (dom.chunkStars) dom.chunkStars.classList.remove('visible');
  if (dom.chunkButton) dom.chunkButton.innerText = 'Chunk';
  if (dom.chunkDrawingButton) dom.chunkDrawingButton.classList.remove('visible');
}

function goToChunkView() {
  if (!state.models.chunk) return;

  state.view.current = 'chunk';

  hideAllDrawings();
  hideVignette();
  hideSectionBackdrop();
  hideInfoPanel();
  closeAllMenus();
  resetSelection();

  showChunkOnly();
  frameCameraToObject(state.models.chunk, 2.1);

  scene.background = new THREE.Color(0x0c0e14);
  scene.fog.color.set(0x0c0e14);
  scene.fog.near = 180;
  scene.fog.far = 1800;

  ambientLight.intensity = 0.38;
  directionalLight.intensity = 3.1;
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.radius = 3;
  directionalLight.shadow.bias = -0.0003;
  directionalLight.shadow.normalBias = 0.03;

  const box = new THREE.Box3().setFromObject(state.models.chunk);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  const lightDistance = Math.max(size.x, size.y, size.z) * 2.2;

  directionalLight.position.set(
    center.x + lightDistance,
    center.y + lightDistance * 0.85,
    center.z + lightDistance * 0.65
  );
  directionalLight.target.position.copy(center);
  directionalLight.target.updateMatrixWorld();

  if (dom.chunkStars) dom.chunkStars.classList.add('visible');
  if (dom.chunkButton) dom.chunkButton.innerText = 'Back';
  if (dom.chunkDrawingButton) dom.chunkDrawingButton.classList.add('visible');
}

function leaveChunkView() {
  if (dom.chunkStars) dom.chunkStars.classList.remove('visible');
  if (dom.chunkDrawingButton) dom.chunkDrawingButton.classList.remove('visible');
  closeChunkDrawing();
  showMainProject();
  goToDefaultView();
  if (dom.chunkButton) dom.chunkButton.innerText = 'Chunk';
}

function hideSiteForPlan() {
  const site = state.models.site;
  if (!site) return;

  site.traverse((child) => {
    if (child.isMesh || child.isLine || child.type === 'LineSegments') {
      child.visible = false;
    }
  });

  gridHelper.visible = false;
  axesHelper.visible = false;
}

function goToView(viewName) {
  if (viewName === 'default') {
    goToDefaultView();
    return;
  }

  if (viewName === 'section') {
    goToSectionView();
    return;
  }

  if (viewName === 'plan1' || viewName === 'plan2') {
    goToPlanView(viewName);
  }
}

// ================================
// SELECTION
// ================================
function resetSelection() {
  if (!state.models.building) return;
  resetMaterialOpacity(state.models.building);
  hideProgramInfo();
  state.explode.selectedHex = null;
}

function getMeshProgramHex(mesh) {
  if (!mesh) return null;
  if (mesh.userData && mesh.userData.programHex) return mesh.userData.programHex;
  if (mesh.material && mesh.material.userData && mesh.material.userData.programHex) {
    return mesh.material.userData.programHex;
  }
  return null;
}

function selectProgramByColor(hex) {
  const building = state.models.building;
  if (!building || !PROGRAM_DATA[hex]) return;

  building.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      child.material.opacity = 0.12;
    }
  });

  building.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    if (getMeshProgramHex(child) === hex) {
      child.material.opacity = 1;
    }
  });

  showProgramInfo(PROGRAM_DATA[hex].name, PROGRAM_DATA[hex].desc);
  state.explode.selectedHex = hex;
}

// ================================
// EXPLODE
// ================================
function setupExplodeOffsets() {
  state.explode.offsets.clear();
  state.explode.explodableGroups = {};

  const entries = Object.keys(state.explode.programGroups)
    .filter((hex) => !EXPLODE_EXCLUDED_HEXES.has(hex))
    .map((hex) => {
      const group = state.explode.programGroups[hex];
      const box = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      box.getCenter(center);
      state.explode.explodableGroups[hex] = group;
      return { hex, group, center };
    });

  entries.sort((a, b) => a.center.y - b.center.y);

  const verticalSpacing = 20;
  const slightSpread = 10;

  entries.forEach((entry, index) => {
    const horizontal = new THREE.Vector3(entry.center.x, 0, entry.center.z);

    if (horizontal.lengthSq() > 0) {
      horizontal.normalize().multiplyScalar(slightSpread);
    }

    const offset = new THREE.Vector3(
      horizontal.x,
      index * verticalSpacing,
      horizontal.z
    );

    state.explode.offsets.set(entry.hex, offset);
  });
}

function toggleExplode() {
  const building = state.models.building;
  if (!building) return;

  state.explode.active = !state.explode.active;

  Object.keys(state.explode.explodableGroups).forEach((hex) => {
    const group = state.explode.explodableGroups[hex];
    const offset = state.explode.offsets.get(hex);
    const original = state.explode.originalPositions.get(group);

    if (!offset || !original) return;

    const target = state.explode.active
      ? original.clone().add(offset)
      : original.clone();

    state.explode.targetPositions.set(group, target);
  });

  dom.explodeButton.innerText = state.explode.active ? 'Collapse' : 'Explode';
}

function updateExplodeAnimation() {
  Object.keys(state.explode.explodableGroups).forEach((hex) => {
    const group = state.explode.explodableGroups[hex];
    const target = state.explode.targetPositions.get(group);

    if (group && target) {
      group.position.lerp(target, 0.12);
    }
  });
}

// ================================
// PROGRAM ANNOTATIONS
// ================================
const SVG_NS = 'http://www.w3.org/2000/svg';
const ANNOTATION_OFFSET_X = 110;
const ANNOTATION_OFFSET_Y = 0;
const ANNOTATION_Y_NUDGES = [0, -18, 18, -34, 34];
const ANNOTATION_SIDES = ['left', 'right'];

function createAnnotations() {
  const container = document.getElementById('annotations-overlay');
  const svg = document.getElementById('annotation-svg');
  if (!container || !svg) return;

  Array.from(container.querySelectorAll('.program-annotation')).forEach((n) =>
    n.remove()
  );
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const hexes = Object.keys(state.explode.programGroups).filter(
    (hex) => !!PROGRAM_DATA[hex] && !EXPLODE_EXCLUDED_HEXES.has(hex)
  );

  hexes.sort((a, b) => {
    const ga = state.explode.programGroups[a];
    const gb = state.explode.programGroups[b];
    const ca = new THREE.Vector3();
    const cb = new THREE.Vector3();
    new THREE.Box3().setFromObject(ga).getCenter(ca);
    new THREE.Box3().setFromObject(gb).getCenter(cb);
    return cb.y - ca.y;
  });

  hexes.forEach((hex, index) => {
    const data = PROGRAM_DATA[hex];
    const displayName = data.name.replace(/_/g, ' ').trim();

    const side = ANNOTATION_SIDES[index % ANNOTATION_SIDES.length];
    const nudge = ANNOTATION_Y_NUDGES[index % ANNOTATION_Y_NUDGES.length];

    const el = document.createElement('div');
    el.className = 'program-annotation side-' + side;
    el.dataset.hex = hex;
    el.dataset.side = side;
    el.dataset.nudge = String(nudge);
    el.innerHTML = '<div class="annotation-label">' + displayName + '</div>';

    container.appendChild(el);

    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('class', 'annotation-leader');
    line.dataset.hex = hex;
    svg.appendChild(line);
  });
}

const _annotationBox = new THREE.Box3();
const _annotationCenter = new THREE.Vector3();

function updateAnnotations() {
  const container = document.getElementById('annotations-overlay');
  const svg = document.getElementById('annotation-svg');
  if (!container || !svg || !state.models.building) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  svg.setAttribute('width', vw);
  svg.setAttribute('height', vh);
  svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);

  const shouldShow =
    state.explode.active &&
    state.models.building.visible &&
    state.view.current === 'default';

  const selectedHex = state.explode.selectedHex;

  Array.from(container.querySelectorAll('.program-annotation')).forEach((el) => {
    const hex = el.dataset.hex;
    const group = state.explode.programGroups[hex];
    const leader = svg.querySelector(`line.annotation-leader[data-hex="${hex}"]`);

    const hide = () => {
      el.classList.remove('visible');
      if (leader) leader.setAttribute('stroke-opacity', '0');
    };

    if (!group || !shouldShow) {
      hide();
      return;
    }

    if (selectedHex && selectedHex !== hex) {
      hide();
      return;
    }

    _annotationBox.setFromObject(group);
    _annotationBox.getCenter(_annotationCenter);

    const projected = _annotationCenter.clone().project(activeCamera);

    if (projected.z > 1 || projected.z < -1) {
      hide();
      return;
    }

    const anchorX = (projected.x * 0.5 + 0.5) * vw;
    const anchorY = (-projected.y * 0.5 + 0.5) * vh;

    const side = el.dataset.side || 'left';
    const nudge = parseFloat(el.dataset.nudge || '0');

    const labelX =
      side === 'left'
        ? anchorX - ANNOTATION_OFFSET_X
        : anchorX + ANNOTATION_OFFSET_X;
    const labelY = anchorY + ANNOTATION_OFFSET_Y + nudge;

    el.style.left = labelX + 'px';
    el.style.top = labelY + 'px';
    el.classList.add('visible');

    if (leader) {
      const rect = el.getBoundingClientRect();
      const labelEdgeX =
        side === 'left' ? rect.right + 2 : rect.left - 2;

      leader.setAttribute('x1', labelEdgeX);
      leader.setAttribute('y1', labelY);
      leader.setAttribute('x2', anchorX);
      leader.setAttribute('y2', anchorY);
      leader.setAttribute('stroke-opacity', '1');
    }
  });
}

// ================================
// SCENE FRAMING
// ================================
function scaleProjectGroup(group, targetSize = 200) {
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim === 0) return;

  const scale = targetSize / maxDim;
  group.scale.setScalar(scale);
}

function anchorProjectToBuilding() {
  const building = state.models.building;
  if (!building) return;

  const buildingBox = new THREE.Box3().setFromObject(building);
  const buildingCenter = new THREE.Vector3();
  buildingBox.getCenter(buildingCenter);

  projectGroup.position.x -= buildingCenter.x;
  projectGroup.position.z -= buildingCenter.z;

  const updatedBox = new THREE.Box3().setFromObject(building);
  projectGroup.position.y -= updatedBox.min.y;
}

function frameCameraToBuilding() {
  const building = state.models.building;
  if (!building) return;

  const box = new THREE.Box3().setFromObject(building);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = Math.max(maxDim * 0.3, 10);

  perspectiveCamera.position.set(
    center.x + distance,
    center.y + distance,
    center.z + distance
  );

  controls.target.copy(center);
  controls.update();
}

function finalizeScene() {
  if (!state.models.site || !state.models.building) return;

  scaleProjectGroup(projectGroup, 3000);
  anchorProjectToBuilding();
  frameCameraToBuilding();
  setHeroAxonView();

  const fullBox = new THREE.Box3().setFromObject(projectGroup);
  shadowGround.position.y = fullBox.min.y + 0.5;
}

// ================================
// INTRO SYSTEM
// ================================
function createFieldPoints() {
  state.intro.fieldPoints = [];

  const spacing = 460;
  const cols = Math.ceil(state.intro.width / spacing) + 3;
  const rows = Math.ceil(state.intro.height / spacing) + 3;

  for (let x = -1; x < cols; x++) {
    for (let y = -1; y < rows; y++) {
      state.intro.fieldPoints.push({
        baseX: x * spacing,
        baseY: y * spacing,
        offsetX: Math.random() * Math.PI * 2,
        offsetY: Math.random() * Math.PI * 2,
        ampX: 40 + Math.random() * 60,
        ampY: 40 + Math.random() * 60,
        speedX: 0.001 + Math.random() * 0.001,
        speedY: 0.001 + Math.random() * 0.001
      });
    }
  }
}

function resizeIntroCanvas() {
  state.intro.width = window.innerWidth;
  state.intro.height = window.innerHeight;
  dom.introCanvas.width = state.intro.width;
  dom.introCanvas.height = state.intro.height;
  createFieldPoints();
}

function addRipple(x, y, strength = 1) {
  state.intro.ripples.push({
    x,
    y,
    radius: 0,
    life: 1,
    speed: 2 + Math.random() * 2,
    strength
  });
}

function updateRipples() {
  for (let i = state.intro.ripples.length - 1; i >= 0; i--) {
    const ripple = state.intro.ripples[i];
    ripple.radius += ripple.speed;
    ripple.life *= 0.985;

    if (ripple.life < 0.02) {
      state.intro.ripples.splice(i, 1);
    }
  }
}

function drawFieldAt(cx, cy, baseStep) {
  const ctx = dom.introCtx;
  const maxRadius = 220;

  for (let r = 8; r < maxRadius; r += baseStep) {
    let distortion = 0;

    for (let i = 0; i < state.intro.ripples.length; i++) {
      const ripple = state.intro.ripples[i];
      const dx = cx - ripple.x;
      const dy = cy - ripple.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      distortion += Math.sin((dist - ripple.radius) * 0.045) * 8 * ripple.life * ripple.strength;
    }

    const finalRadius = r + distortion * (1 - r / maxRadius);

    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2, finalRadius), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.08 + (1 - r / maxRadius) * 0.28})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawRadialField() {
  const ctx = dom.introCtx;

  ctx.clearRect(0, 0, state.intro.width, state.intro.height);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, state.intro.width, state.intro.height);

  const baseStep = 14;

  for (let i = 0; i < state.intro.fieldPoints.length; i++) {
    const p = state.intro.fieldPoints[i];
    const cx = p.baseX + Math.sin(state.intro.time * p.speedX + p.offsetX) * p.ampX;
    const cy = p.baseY + Math.cos(state.intro.time * p.speedY + p.offsetY) * p.ampY;
    drawFieldAt(cx, cy, baseStep);
  }
}

function animateIntro() {
  if (!state.intro.running) return;

  state.intro.time += 16;
  updateRipples();
  drawRadialField();

  requestAnimationFrame(animateIntro);
}

// ================================
// CONCEPT STARFIELD
// ================================
function resizeConceptCanvas() {
  if (!dom.conceptStars) return;
  dom.conceptStars.width = window.innerWidth;
  dom.conceptStars.height = window.innerHeight;
}

function createConceptStars() {
  resizeConceptCanvas();
  state.concept.stars = [];

  const starCount = Math.floor((window.innerWidth * window.innerHeight) / 7000);

  for (let i = 0; i < starCount; i++) {
    state.concept.stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.03
    });
  }
}

function drawConceptStars() {
  if (!dom.conceptStars || !state.concept.open) return;

  const ctx = dom.conceptStars.getContext('2d');
  const w = dom.conceptStars.width;
  const h = dom.conceptStars.height;

  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createRadialGradient(
    w * 0.5, h * 0.45, 0,
    w * 0.5, h * 0.45, Math.max(w, h) * 0.7
  );
  grad.addColorStop(0, 'rgba(18,22,38,0.22)');
  grad.addColorStop(1, 'rgba(2,4,10,0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  state.concept.stars.forEach((star) => {
    star.pulse += star.speed;
    const alpha = star.a * (0.65 + 0.35 * Math.sin(star.pulse));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
}

// ================================
// CHUNK STARFIELD
// ================================
function resizeChunkStarsCanvas() {
  if (!dom.chunkStars) return;
  dom.chunkStars.width = window.innerWidth;
  dom.chunkStars.height = window.innerHeight;
}

function createChunkStars() {
  resizeChunkStarsCanvas();
  state.chunk.stars = [];

  const starCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);

  for (let i = 0; i < starCount; i++) {
    state.chunk.stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.25,
      a: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.025
    });
  }
}

function drawChunkStars() {
  if (!dom.chunkStars || state.view.current !== 'chunk') return;

  const ctx = dom.chunkStars.getContext('2d');
  const w = dom.chunkStars.width;
  const h = dom.chunkStars.height;

  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createRadialGradient(
    w * 0.5, h * 0.45, 0,
    w * 0.5, h * 0.45, Math.max(w, h) * 0.8
  );
  grad.addColorStop(0, 'rgba(28,30,42,0.18)');
  grad.addColorStop(1, 'rgba(6,8,14,0.92)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  state.chunk.stars.forEach((star) => {
    star.pulse += star.speed;
    const alpha = star.a * (0.65 + 0.35 * Math.sin(star.pulse));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
}

// ================================
// CONCEPT 3D OBJECTS
// ================================
function createTextSprite(text, fontSize = 64) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1024;
  canvas.height = 256;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(260, 65, 1);
  return sprite;
}

function createDashedRing(radius, axis = 'x', opacity = 0.9) {
  const curve = new THREE.EllipseCurve(
    0, 0,
    radius, radius,
    0, Math.PI * 2,
    false,
    0
  );

  const points2D = curve.getPoints(180);
  const points3D = points2D.map(p => new THREE.Vector3(p.x, p.y, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
  const material = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: radius * 0.08,
    gapSize: radius * 0.05,
    transparent: true,
    opacity
  });

  const line = new THREE.LineLoop(geometry, material);
  line.computeLineDistances();

  if (axis === 'x') line.rotation.y = Math.PI / 2;
  if (axis === 'y') line.rotation.x = Math.PI / 2;
  if (axis === 'z') line.rotation.z = 0;
  if (axis === 'diag1') {
    line.rotation.x = Math.PI / 3.2;
    line.rotation.y = Math.PI / 4.4;
  }
  if (axis === 'diag2') {
    line.rotation.x = -Math.PI / 4.2;
    line.rotation.y = Math.PI / 5.2;
  }

  return line;
}

function createConceptSphere({ x, y, z, radius, label = null, opacity = 0.18 }) {
  const group = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity,
    wireframe: true
  });

  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  const ringA = createDashedRing(radius * 1.02, 'x', 0.85);
  const ringB = createDashedRing(radius * 1.02, 'y', 0.85);
  const ringC = createDashedRing(radius * 1.02, 'diag1', 0.65);

  group.add(ringA, ringB, ringC);

  if (radius > 80) {
    const ringD = createDashedRing(radius * 0.86, 'diag2', 0.42);
    group.add(ringD);
  }

  if (label) {
    const sprite = createTextSprite(label, 70);
    sprite.position.set(0, 0, 0);
    group.add(sprite);
  }

  group.position.set(x, y, z);
  group.userData.radius = radius;
  group.userData.spin = (Math.random() - 0.5) * 0.004;
  group.userData.wobble = Math.random() * Math.PI * 2;

  return group;
}

function buildConceptScene() {
  const conceptRoot = new THREE.Group();
  conceptRoot.name = 'conceptRoot';

  const spheres = [
    { x: -560, y: 180, z: -120, radius: 250, label: 'TIME', opacity: 0.16 },
    { x: 40, y: 420, z: -220, radius: 230, label: 'EMOTIONS', opacity: 0.16 },
    { x: 620, y: 80, z: 40, radius: 270, label: 'CONSCIOUSNESS', opacity: 0.16 },
    { x: -200, y: -380, z: 80, radius: 240, label: 'PERCEPTIONS', opacity: 0.16 },
    { x: 360, y: -320, z: -160, radius: 250, label: 'MENTAL', opacity: 0.16 },

    { x: -320, y: 340, z: 200, radius: 130, opacity: 0.18 },
    { x: 260, y: 240, z: 180, radius: 150, opacity: 0.18 },
    { x: 720, y: -120, z: -180, radius: 135, opacity: 0.18 },
    { x: -480, y: -180, z: -220, radius: 120, opacity: 0.18 },
    { x: 30, y: -100, z: 260, radius: 140, opacity: 0.18 },

    { x: -80, y: 140, z: 320, radius: 80, opacity: 0.2 },
    { x: 180, y: -30, z: -320, radius: 90, opacity: 0.2 },
    { x: 520, y: 320, z: 260, radius: 70, opacity: 0.2 },
    { x: -650, y: 10, z: 180, radius: 78, opacity: 0.2 },
    { x: -260, y: -520, z: 220, radius: 66, opacity: 0.2 },
    { x: 620, y: -360, z: 200, radius: 74, opacity: 0.2 },

    { x: 120, y: 100, z: 110, radius: 38, opacity: 0.22 },
    { x: -140, y: 260, z: -120, radius: 34, opacity: 0.22 },
    { x: 380, y: 500, z: -40, radius: 42, opacity: 0.22 },
    { x: 860, y: 220, z: 110, radius: 48, opacity: 0.22 },
    { x: -500, y: 420, z: 100, radius: 40, opacity: 0.22 },
    { x: 140, y: -520, z: -40, radius: 44, opacity: 0.22 },
    { x: 460, y: -520, z: 120, radius: 36, opacity: 0.22 }
  ];

  spheres.forEach((cfg) => {
    conceptRoot.add(createConceptSphere(cfg));
  });

  conceptScene.add(conceptRoot);
  conceptScene.userData.root = conceptRoot;
}

// ================================
// LOADING: SITE
// ================================
function buildSiteEdgeOverlay(siteModel) {
  const siteEdges = new THREE.Group();

  siteModel.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const edges = new THREE.EdgesGeometry(child.geometry, 35);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0x777777,
        transparent: true,
        opacity: 0.22
      })
    );

    line.userData.isSiteEdgeOverlay = true;
    line.position.copy(child.position);
    line.rotation.copy(child.rotation);
    line.scale.copy(child.scale);

    siteEdges.add(line);
  });

  siteModel.add(siteEdges);
}

function styleSiteModel(siteModel) {
  siteModel.traverse((child) => {
    if (child.isLine || child.type === 'LineSegments') {
      child.visible = false;
      return;
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.9,
        metalness: 0.0
      });
    }
  });
}

function loadSite() {
  gltfLoader.load(
    URLS.site,
    (gltf) => {
      state.models.site = gltf.scene;

      styleSiteModel(state.models.site);
      buildSiteEdgeOverlay(state.models.site);

      projectGroup.add(state.models.site);
      finalizeScene();

      console.log('Site loaded successfully');
    },
    undefined,
    (error) => {
      console.error('Error loading site.glb:', error);
    }
  );
}

// ================================
// LOADING: BUILDING
// ================================
function createProgramGroups(buildingModel) {
  const meshesByColor = {};

  buildingModel.traverse((child) => {
    if (child.isMesh && child.material && child.material.color) {
      const hex = child.material.color.getHexString();

      if (!meshesByColor[hex]) meshesByColor[hex] = [];
      meshesByColor[hex].push(child);
    }
  });

  Object.keys(meshesByColor).forEach((hex) => {
    const wrapper = new THREE.Group();
    wrapper.name = `program_${hex}`;
    state.explode.programGroups[hex] = wrapper;
    buildingModel.add(wrapper);
  });

  Object.keys(meshesByColor).forEach((hex) => {
    const wrapper = state.explode.programGroups[hex];
    meshesByColor[hex].forEach((mesh) => wrapper.attach(mesh));
  });

  Object.keys(state.explode.programGroups).forEach((hex) => {
    const group = state.explode.programGroups[hex];
    state.explode.originalPositions.set(group, group.position.clone());
    state.explode.targetPositions.set(group, group.position.clone());
  });
}

function applyProgramMaterials(buildingModel) {
  buildingModel.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const hex = child.material.color
      ? child.material.color.getHexString()
      : 'ffffff';

    const maroonColor = new THREE.Color(0x7a2a3a);

    const newMaterial = new THREE.MeshStandardMaterial({
      color: maroonColor,
      roughness: 0.45,
      metalness: 0.65,
      envMapIntensity: 1.0
    });

    newMaterial.userData.programHex = hex;
    child.userData.programHex = hex;

    child.material = newMaterial;
    child.castShadow = true;
    child.receiveShadow = true;
  });
}

function buildBuildingEdgeOverlay(buildingModel) {
  const buildingEdges = new THREE.Group();
  buildingEdges.name = 'building_edge_overlay';

  buildingModel.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const edges = new THREE.EdgesGeometry(child.geometry, 30);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );

    line.position.copy(child.position);
    line.rotation.copy(child.rotation);
    line.scale.copy(child.scale);
    line.renderOrder = 10;
    line.userData.isBuildingEdgeOverlay = true;

    buildingEdges.add(line);
  });

  buildingModel.add(buildingEdges);
}

function loadBuilding() {
  gltfLoader.load(
    URLS.building,
    (gltf) => {
      state.models.building = gltf.scene;

      createProgramGroups(state.models.building);
      applyProgramMaterials(state.models.building);
      buildBuildingEdgeOverlay(state.models.building);
      projectGroup.add(state.models.building);

      setupExplodeOffsets();
      createAnnotations();
      finalizeScene();
      setHeroAxonView();

      console.log('Building loaded successfully');
    },
    undefined,
    (error) => {
      console.error('Error loading model_Building.glb:', error);
    }
  );
}

// ================================
// LOADING: CHUNK
// ================================
function styleChunkModel(chunkModel) {
  chunkModel.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    if (Array.isArray(child.material)) return;

    child.material = new THREE.MeshStandardMaterial({
      color: 0xd9d9d9,
      roughness: 0.7,
      metalness: 0.15
    });
  });
}

function buildChunkEdgeOverlay(chunkModel) {
  const chunkEdges = new THREE.Group();
  chunkEdges.name = 'chunk_edge_overlay';

  chunkModel.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const edges = new THREE.EdgesGeometry(child.geometry, 30);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0x9a9a9a,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
      })
    );

    line.position.copy(child.position);
    line.rotation.copy(child.rotation);
    line.scale.copy(child.scale);
    line.renderOrder = 10;

    chunkEdges.add(line);
  });

  chunkModel.add(chunkEdges);
}

function loadChunk() {
  gltfLoader.load(
    URLS.chunk,
    (gltf) => {
      state.models.chunk = gltf.scene;

      styleChunkModel(state.models.chunk);
      buildChunkEdgeOverlay(state.models.chunk);

      state.models.chunk.visible = false;
      state.models.chunk.position.set(0, 0, 0);

      projectGroup.add(state.models.chunk);

      console.log('Chunk loaded successfully');
    },
    undefined,
    (error) => {
      console.error('Error loading Chunk.glb:', error);
    }
  );
}

// ================================
// INTERACTION
// ================================
function updateMouseFromEvent(event) {
  state.interaction.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  state.interaction.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function handleProgramClick(event) {
  if (state.intro.running || !state.models.building || state.concept.open) return;
  if (state.view.current === 'chunk') return;
  if (event.target.closest('#bottom-ui-wrap')) return;
  if (event.target.closest('#chunk-button')) return;
  if (event.target.closest('#chunk-drawing-button')) return;
  if (event.target.closest('#info-panel')) return;
  if (event.target.closest('#concept-overlay')) return;

  updateMouseFromEvent(event);
  state.interaction.raycaster.setFromCamera(state.interaction.mouse, activeCamera);

  const intersects = state.interaction.raycaster.intersectObjects(
    state.models.building.children,
    true
  );

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const hex = getMeshProgramHex(clicked);

    if (hex && PROGRAM_DATA[hex]) {
      selectProgramByColor(hex);
      return;
    }
  }

  resetSelection();
}

// ================================
// EVENTS
// ================================
function handleMouseMove(event) {
  state.intro.mouseX = event.clientX;
  state.intro.mouseY = event.clientY;

  if (state.intro.running && Math.random() < 0.05) {
    addRipple(state.intro.mouseX, state.intro.mouseY, 0.7);
  }
}

function handleEnter() {
  dom.introScreen.classList.add('hidden');

  setTimeout(() => {
    state.intro.running = false;

    if (state.models.building) {
      setHeroAxonView();
    }

    hideAllDrawings();
    hideVignette();
    hideSectionBackdrop();

    controls.enabled = true;
  }, 1000);
}

function handleResize() {
  resizeIntroCanvas();
  resizeConceptCanvas();
  createConceptStars();
  resizeChunkStarsCanvas();
  createChunkStars();

  const newAspect = window.innerWidth / window.innerHeight;

  perspectiveCamera.aspect = newAspect;
  perspectiveCamera.updateProjectionMatrix();

  orthographicCamera.left = (-orthoFrustum * newAspect) / 2;
  orthographicCamera.right = (orthoFrustum * newAspect) / 2;
  orthographicCamera.top = orthoFrustum / 2;
  orthographicCamera.bottom = -orthoFrustum / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  conceptCamera.aspect = newAspect;
  conceptCamera.updateProjectionMatrix();
  conceptRenderer.setSize(window.innerWidth, window.innerHeight);
}

function closeAllMenus() {
  dom.drawingsMenu.classList.add('hidden');
  dom.shadowSliderWrap.classList.add('hidden');
  dom.drawingsButton.classList.remove('active');
  dom.shadowStudyButton.classList.remove('active');
}

function bindEvents() {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleProgramClick);
  window.addEventListener('resize', handleResize);

  dom.enterButton.addEventListener('click', handleEnter);

  dom.explodeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleExplode();
  });

  if (dom.conceptButton) {
    dom.conceptButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openConceptOverlay();
    });
  }

  if (dom.conceptClose) {
    dom.conceptClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeConceptOverlay();
    });
  }

  if (dom.conceptOverlay) {
    dom.conceptOverlay.addEventListener('click', (e) => {
      if (e.target === dom.conceptOverlay || e.target === dom.conceptStars) {
        closeConceptOverlay();
      }
    });
  }

  if (dom.chunkButton) {
    dom.chunkButton.addEventListener('click', (e) => {
      e.stopPropagation();

      if (state.view.current === 'chunk') {
        leaveChunkView();
      } else {
        goToChunkView();
      }
    });
  }

  if (dom.chunkDrawingButton) {
    dom.chunkDrawingButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openChunkDrawing();
    });
  }

  if (dom.chunkDrawingClose) {
    dom.chunkDrawingClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeChunkDrawing();
    });
  }

  if (dom.chunkDrawingOverlay) {
    dom.chunkDrawingOverlay.addEventListener('click', (e) => {
      if (e.target === dom.chunkDrawingOverlay) {
        closeChunkDrawing();
      }
    });
  }

  if (dom.infoClose) {
    dom.infoClose.addEventListener('click', (e) => {
      e.stopPropagation();
      hideInfoPanel();
      if (state.models.building) {
        resetMaterialOpacity(state.models.building);
        state.explode.selectedHex = null;
      }
    });
  }

  if (dom.infoPanel) {
    dom.infoPanel.addEventListener('click', (e) => e.stopPropagation());
  }

  if (dom.infoImageOverlay) {
    dom.infoImageOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      hideInfoPanel();
      if (state.models.building) {
        resetMaterialOpacity(state.models.building);
        state.explode.selectedHex = null;
      }
    });
  }

  dom.viewButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      goToView(button.dataset.view);
      closeAllMenus();
    });
  });

  dom.drawingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = dom.drawingsMenu.classList.contains('hidden');
    closeAllMenus();
    if (willOpen) {
      dom.drawingsMenu.classList.remove('hidden');
      dom.drawingsButton.classList.add('active');
    }
  });

  dom.shadowStudyButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = dom.shadowSliderWrap.classList.contains('hidden');
    closeAllMenus();
    if (willOpen) {
      dom.shadowSliderWrap.classList.remove('hidden');
      dom.shadowStudyButton.classList.add('active');
    }
  });

  dom.shadowSliderWrap.addEventListener('click', (e) => e.stopPropagation());
  dom.drawingsMenu.addEventListener('click', (e) => e.stopPropagation());

  dom.shadowSlider.addEventListener('input', (e) => {
    const angle = parseFloat(e.target.value);
    updateSunPosition(angle);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.concept.open) {
      closeConceptOverlay();
    }
    if (e.key === 'Escape') {
      closeChunkDrawing();
    }
  });

  window.addEventListener('click', (e) => {
    if (!e.target.closest('#bottom-bar')) {
      closeAllMenus();
    }
  });
}

// ================================
// ANIMATION LOOP
// ================================
function updateCameraAnimation() {
  if (!controls.enabled && activeCamera === perspectiveCamera) {
    perspectiveCamera.position.lerp(cameraTargetPosition, 0.08);

    const currentTarget = controls.target.clone();
    currentTarget.lerp(cameraTargetLookAt, 0.08);
    controls.target.copy(currentTarget);
  }
}

function animateConceptScene() {
  if (!conceptScene.userData.root) return;

  conceptControls.update();

  const root = conceptScene.userData.root;
  root.rotation.y += 0.0015;

  root.children.forEach((group, i) => {
    if (!group.userData) return;
    group.rotation.x += group.userData.spin || 0;
    group.rotation.y += (group.userData.spin || 0) * 0.7;

    const wobble = group.userData.wobble || 0;
    group.position.z += Math.sin(Date.now() * 0.00035 + wobble + i) * 0.03;
  });

  if (state.concept.open) {
    conceptRenderer.render(conceptScene, conceptCamera);
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (!state.models.building) {
    drawConceptStars();
    drawChunkStars();
    animateConceptScene();
    renderer.render(scene, activeCamera);
    return;
  }

  updateCameraAnimation();
  controls.update();
  updateExplodeAnimation();
  updateAnnotations();
  drawConceptStars();
  drawChunkStars();
  animateConceptScene();

  if (
    !controls.enabled &&
    activeCamera === perspectiveCamera &&
    state.view.current === 'section'
  ) {
    updateSiteOcclusionForSection();
  }

  renderer.render(scene, activeCamera);
}

// ================================
// INIT
// ================================
function init() {
  resizeIntroCanvas();
  createConceptStars();
  createChunkStars();
  buildConceptScene();
  animateIntro();
  createPlanMarkers();
  bindEvents();

  loadSite();
  loadBuilding();
  loadChunk();
  animate();
}

init();