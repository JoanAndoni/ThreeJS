// VARIABLES OF THE OBJECTS AND SCENE
var render = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  floor = null;

// VARIABLES OF THE LIGHT
var directionalLight = null;

// VARIABLE FOR THE OBJECT TO LOAD
var objLoader = null;

// ANIMATION VARIABLES
var animation = null,
  positionKeys = [],
  movements = [],
  rotationKeys = [],
  angles = [];

// GET THE CANVAS FOR TO RENDER THE SCENE IN IT
canvas = document.getElementById("container");

// Correr todo el programa
function run() {
  requestAnimationFrame(function() {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Update the animations
  KF.update();

  // Update the camera controller
  controlers.update();
}

// Cargar el objeto
function loadObj() {
  if (!objLoader)
    objLoader = new THREE.OBJLoader();

  objLoader.load(
    'bunny/bunny.obj',

    function(object) {
      var texture = new THREE.TextureLoader().load('bunny/texture.jpg');
      var normalMap = new THREE.TextureLoader().load('bunny/normalMap.jpg');

      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.material.map = normalMap;
          child.material.normalMap = texture;
        }
      });

      bunny = object;
      bunny.scale.set(3.5, 3.5, 3.5);

      // POSITION OF THE BUNNY
      bunny.position.x = 0;
      bunny.position.y = 0;
      bunny.position.z = 0;

      // ROTATION OF THE BUNNY
      bunny.rotation.x = 0;
      bunny.rotation.y = 0;
      bunny.rotation.Z = 0;

      // ADD THE BUNNY TO THE GROUP
      group.add(object);
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function(error) {
      console.log('An error happened');
    });
}

function createScene(canvas) {

  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  // Set the viewport size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Turn on shadows
  renderer.shadowMap.enabled = true;

  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.set(0, 5, 10);
  scene.add(camera);

  // Create the controlers from the library of Three.js
  controlers = new THREE.OrbitControls(camera, renderer.domElement);

  // Create a group to hold all the objects
  root = new THREE.Object3D;

  // Add a directional light to show off the object
  directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);

  // Create and add all the lights
  directionalLight.position.set(-5, 15, 0);
  directionalLight.castShadow = true;
  root.add(directionalLight);

  // Create a group to hold the objects and add it to the root
  group = new THREE.Object3D;
  root.add(group);

  // Create a texture map
  var map = new THREE.TextureLoader().load('./grass/grass-texture.jpeg');
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(30, 30);

  // Put in a ground plane to show off the lighting
  geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
  floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: color,
    map: map,
    side: THREE.DoubleSide
  }));
  floor.rotation.x = -Math.PI / 2;

  // Add the mesh to our group
  root.add(floor);
  floor.castShadow = false;
  floor.receiveShadow = true;

  // And put the geometry and material together into a mesh
  var color = 0xffffff;

  // Create the objects
  loadObj();

  // Now add the group to our scene
  scene.add(root);
}

const path = [{
    x: 0,
    y: 0,
    z: 0,
  }, //  0
  {
    x: -2,
    y: 0,
    z: -1
  }, //  1
  {
    x: -4,
    y: 0,
    z: -2
  }, //  2
  {
    x: -6,
    y: 0,
    z: -1
  }, //  3
  {
    x: -6.5,
    y: 0,
    z: 0
  }, //  4
  {
    x: -6,
    y: 0,
    z: 1
  }, //  5
  {
    x: -4,
    y: 0,
    z: 2
  }, //  6
  {
    x: -2,
    y: 0,
    z: 1
  }, //  7
  {
    x: 0,
    y: 0,
    z: 0
  }, //  8
  {
    x: 2,
    y: 0,
    z: -1
  }, //  9
  {
    x: 4,
    y: 0,
    z: -2
  }, // 10
  {
    x: 6,
    y: 0,
    z: -1
  }, // 11
  {
    x: 6.5,
    y: 0,
    z: 0
  }, // 12
  {
    x: 6,
    y: 0,
    z: 1
  }, // 13
  {
    x: 4,
    y: 0,
    z: 2
  }, // 14
  {
    x: 2,
    y: 0,
    z: 1
  } // 15
];

const jumpMovement = [0, .7, 1, .7, 0];

function setKeysTime(numeroSaltos) {
  tiempoPorSalto = 1 / numeroSaltos;
  tiempoMovimientoSalto = tiempoPorSalto / jumpMovement.length;
  for (var i = 0; i < numeroSaltos; i++) {
    for (var i2 = 0; i2 < jumpMovement.length; i2++) {
      positionKeys.push((i * tiempoPorSalto) + (i2 * tiempoMovimientoSalto));
    }
    rotationKeys.push(i * tiempoPorSalto);
  }
}

function setAllMovements() {
  let x2, z2,
    xFraction, zFraction;

  path.forEach((jump, index) => {
    if (index === path.length - 1) {
      x2 = path[0].x;
      z2 = path[0].z;
    } else {
      x2 = path[index + 1].x;
      z2 = path[index + 1].z;
    }

    setAngles(jump.x, -jump.z, x2, -z2);
    xFraction = (-jump.x + x2) / jumpMovement.length;
    zFraction = (-jump.z + z2) / jumpMovement.length;

    jumpMovement.forEach((jumpMove, index) => {
      movements.push({
        x: jump.x + (index * xFraction),
        y: jumpMove,
        z: jump.z + (index * zFraction)
      })
    });
  });
}

function setAngles(x1, z1, x2, z2) {
  angles.push({
    y: Math.atan2(-(z2 - z1), -(x2 - x1))
  });
  console.log(Math.atan2(-(z2 - z1), -(x2 - x1)));

}

setKeysTime(path.length);
setAllMovements();

function animations() {
  animation = new KF.KeyFrameAnimator;
  animation.init({
    interps: [{
        keys: positionKeys,
        values: movements,
        target: group.position
      },
      {
        keys: rotationKeys,
        values: angles,
        target: group.rotation
      },
    ],
    loop: true,
    duration: 15000,
  });

  animation.start();
}
