var renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  sphere = null,
  sphereEnvMapped = null,
  orbitControls = null,
  store = null,
  player = null,
  jacket = null,
  jacketTexture = null,
  pants = null,
  pantsTexture;

var isJacketSelected = true;

var directionalLight = null;
var spotLight = null;
var pointLight = null;
var ambientLight = null;
var textureOn = null;

var mapUrl = "./images/Environment/floor.jpg";
var objLoader = null;
var mtlLoader = null;

var mouse = new THREE.Vector2(),
  INTERSECTED, CLICKED;
var raycaster;

var canvas;

var duration = 20000; // ms
var currentTime = Date.now();

function animate() {
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 2 * fract;
  // Rotate the sphere group about its Y axis
  group.rotation.y += angle;
}

function run() {
  requestAnimationFrame(function() {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();

  // Update the camera controller
  orbitControls.update();
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  event.preventDefault();
  mouse.x = (event.clientX / canvas.width) * 2 - 1;
  mouse.y = -(event.clientY / canvas.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    CLICKED = intersects[0].object.parent;
    console.log("Clicked!")
    if (CLICKED.name.includes("Jacket")) {
      $("#selectorMsg").html("Jacket Selected");
      isJacketSelected = true;
      console.log("jacket")
    } else if (CLICKED.name.includes("Pants")) {
      $("#selectorMsg").html("Pants Selected");
      isJacketSelected = false;
      console.log("pants")
    }

  }
}

function loadStore() {
  if (!mtlLoader) {
    mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/store/store.mtl', function(materials) {
      materials.preload();
      objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        'models/store/store.obj',

        function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          store = object;
          store.scale.set(3, 3, 3);
          store.bbox = new THREE.Box3()
          store.bbox.setFromObject(store)
          store.position.z = 0;
          store.position.x = 200;
          store.position.y = -50;
          store.rotation.y = Math.PI / 2;
          group.add(store);
        },
        function(error) {
          console.log('An error happened');
        });
    })
  }
}

function loadMannequin2() {
  var textureMannequin = new THREE.TextureLoader().load("models/mannequin/texture.tif");
  lambertMannequin = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureMannequin
  });
  if (!objLoader)
    objLoader = new THREE.OBJLoader();

  objLoader.load(
    'models/mannequin/basicman.obj',

    function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = lambertMannequin;
        }
      });
      player = object;
      player.scale.set(4.2, 4.67, 3.5);
      player.bbox = new THREE.Box3()
      player.bbox.setFromObject(player)
      player.position.z = 0;
      player.position.x = -1.065;
      player.position.y = -10;
      player.rotation.y = Math.PI / 2;
      textureOn = true;
      group.add(player);
    },
    function(error) {

      console.log('An error happened');
    });

}

function changeJacketMaterial(textureUri) {
  jacketTexture = new THREE.TextureLoader().load(textureUri);
  var jackerLambert = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: jacketTexture
  });
  objLoader = new THREE.OBJLoader();
  objLoader.load(
    'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',
    function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = jackerLambert;
        }
      });
      jacket = object;
      jacket.name = "Jacket"
      jacket.bbox = new THREE.Box3()
      jacket.bbox.setFromObject(jacket)
      jacket.position.z = 0;
      jacket.position.x = 1.8;
      jacket.position.y = -72.4;
      jacket.scale.set(0.45, 0.65, 0.5);
      jacket.rotation.y = Math.PI / 2;
      group.add(jacket);
    } //, onProgress, onError
  );
}

function changePantsMaterial(textureUri) {
  pantsTexture = new THREE.TextureLoader().load(textureUri);
  var pantslambert = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: pantsTexture
  });
  objLoader = new THREE.OBJLoader();
  objLoader.load(
    'models/clothes/jeans.obj',
    function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = pantslambert;
        }
      });
      pants = object;
      pants.name = "Pants"
      pants.bbox = new THREE.Box3()
      pants.bbox.setFromObject(pants)
      pants.position.z = 0;
      pants.position.x = 1;
      pants.position.y = -54;
      pants.scale.set(0.4, 0.4, 0.5);
      pants.rotation.x = Math.PI / 2;
      pants.rotation.y = Math.PI
      pants.rotation.z = 3 * Math.PI / 2;
      group.add(pants);
    }
  );
}

function changeSelectedMaterial(textureUri) {
  if (isJacketSelected) {
    changeJacketMaterial(textureUri)
  } else {
    changePantsMaterial(textureUri)
  }
}

function createScene(_canvas) {
  canvas = _canvas
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  // Set the viewport size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.set(100, 50, 100);
  scene.add(camera);



  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.minDistance = 100;
  orbitControls.maxDistance = 160;
  orbitControls.minPolarAngle = 0;
  orbitControls.maxPolarAngle = Math.PI / 1.8;

  // Create a group to hold all the objects
  root = new THREE.Object3D;

  // Add a directional light to show off the object
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  // Create and add all the lights
  directionalLight.position.set(.5, 0, 3);
  root.add(directionalLight);

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);

  // Create a group to hold the spheres
  group = new THREE.Object3D;
  root.add(group);
  loadStore();
  //loadMannequin2();
  //loadJacketModel();
  changeJacketMaterial('./images/4.jpg')
  changePantsMaterial('./images/1.jpeg')

  raycaster = new THREE.Raycaster();
  document.addEventListener('mousedown', onDocumentMouseDown);

  // Now add the group to our scene
  scene.add(root);
}
