// SCENE VARIABLES
var renderer = null,
  scene = null,
  camera = null,
  root = null,
  plane_idle = null,
  planeLife = 100,
  planeCollider = null,
  planeBox = null,
  displayPlaneBoxHelper = false,
  crashDamage = 15,
  shootEnemy = 5,
  helicopter_idle = null,
  bullet_idle = null,
  group = null;

// VARIABLES FOR THE GAME
var gameOn = false,
  difficult = 2;

// VARIABLES FOR THE HELICOPTERS
var helicopters = [],
  helicopterNames = 1,
  moves = 1;

// VARIABLES FOR THE BULLETS
var bullets = [],
  bulletNames = 1;

// VARIABLES FOR THE TIMES
var duration = 20000, // ms
  currentTime = Date.now(),
  speedHelicopters = 0.5,
  speedBullets = 0.8,
  intervalCreateHelicopters = null,
  intervalCreateBullets = null,
  intervalGrass = null,
  intervalTimer = null;

// VARIABLES FOR THE GAME TIME
var gameTime = 40, // 40 seg
  time = 0;

// VARIABLES FOR THE GRASS MOVEMENT
var animateGrass = true,
  terrain = null,
  grassAnimator = null,
  loopAnimation = false;

// VARIBLES FOR THE LIMITS OF THE AIRPLANE
var minX = -18,
  maxX = 17,
  minY = 25,
  maxY = 46,
  minZ = -110,
  maxZ = 120;


function getXPositionRandom() {
  minX = Math.ceil(minX);
  maxX = Math.floor(maxX);
  return Math.floor(Math.random() * (maxX - minX + 1)) + minX;
}

function getYPositionRandom() {
  minY = Math.ceil(minY);
  maxY = Math.floor(maxY);
  return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
}

function loadAirplaneFBX() {
  var loader = new THREE.FBXLoader();
  loader.load('models/Plane.fbx', function(object) {
    object.scale.set(0.01, 0.01, 0.01);
    object.position.set(0, 35, 120);
    object.rotation.y = Math.PI;
    object.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    plane_idle = object;
    scene.add(plane_idle);

    planeBox = new THREE.BoxHelper(plane_idle, 0x00ff00);
    planeBox.update();
    planeBox.visible = displayPlaneBoxHelper;

    scene.add(planeBox);
  });
}

function loadHelicopterFBX() {
  var loader = new THREE.FBXLoader();
  loader.load('models/Helicopter.FBX', function(object) {
    object.scale.set(0.09, 0.09, 0.09);
    // object.position.set(getXPositionRandom(), getYPositionRandom(), minZ);
    object.rotation.y = Math.PI;
    object.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    helicopter_idle = object;
  });
}

function loadBulletFBX() {
  var loader = new THREE.FBXLoader();
  loader.load('models/Bullet.fbx', function(object) {
    object.scale.set(0.8, 0.8, 0.8);
    object.rotation.x = -Math.PI / 2;
    object.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    bullet_idle = object;
  });
}

function timer() {
  contador_s = 0;
  time = document.getElementById("time");
  intervalTimer = window.setInterval(function() {
    time.innerHTML = (gameTime - contador_s).toString() + " seg";
    contador_s++;
    if (contador_s === gameTime || planeLife <= 0) {
      gameOn = true;
      startGame();
    }
  }, 1000);
}

function startGame() {
  if (!gameOn) {
    gameOn = true;
    timer();
    createHelicopters();
    document.getElementById("start").value = "Stop";
  } else {
    clearAllHelicopters();
    clearAllBullets();
    window.clearInterval(intervalTimer);
    window.clearInterval(intervalCreateHelicopters);
    gameOn = false;
    time = 40;
    planeLife = 100;
    document.getElementById("life").innerHTML = planeLife.toString() + " %";
    document.getElementById("start").value = "Start";
    document.getElementById("time").innerHTML = time.toString() + " seg";
  }
}

function animate() {
  // Update the animations
  KF.update();

  // Update the box
  planeBox.update();

  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;

  if (helicopters.length === 0 && gameOn) {
    // EL JUEGO HA COMENZADO
  }

  if (helicopters.length > 0 && gameOn) {
    // CREAR EL COLLIDER DE LA NAVE
    planeCollider = new THREE.Box3().setFromObject(plane_idle);

    // EL JUEGO ESTA CORRIENDO
    helicopters.forEach((helicopter, indexHelicopters) => {
      var helicopterCollider = new THREE.Box3().setFromObject(helicopter);

      bullets.forEach((bullet, indexBullets) => {
        var bulletCollider = new THREE.Box3().setFromObject(bullet);

        if (helicopterCollider.intersectsBox(bulletCollider)) {
          scene.remove(helicopter);
          scene.remove(bullet);
          helicopters.splice(indexHelicopters, 1);
          bullets.splice(indexBullets, 1);
          planeLife += shootEnemy;
          document.getElementById("life").innerHTML = planeLife.toString() + " %";
        }
      });

      if (planeCollider.intersectsBox(helicopterCollider)) {
        scene.remove(helicopter);
        helicopters.splice(indexHelicopters, 1);
        planeLife -= crashDamage;
        document.getElementById("life").innerHTML = planeLife.toString() + " %";
      }

      helicopter.position.z += deltat * 0.055;

      if (helicopter.position.z >= maxZ) {
        scene.remove(helicopter);
        helicopters.splice(indexHelicopters, 1);
      }

    });

    bullets.forEach((bullet, index) => {
      bullet.position.z -= deltat * 0.055;

      if (bullet.position.z <= minZ) {
        // console.log("Se fue la bala " + bullet.name.toString());
        scene.remove(bullet);
        bullets.splice(index, 1);
      }
    })
  }

  if (helicopters.length === 0 && !gameOn) {
    // NO HAY HELICOPTEROS CUANDO NO HAY JUEGO
  }

  if (helicopters.length > 0 && !gameOn) {
    // clearAllHelicopters();
  }

}

function createHelicopters() {
  intervalCreateHelicopters = window.setInterval(function() {
    if (gameOn) {
      var newHelicopter = cloneFbx(helicopter_idle);
      newHelicopter.position.set(getXPositionRandom(), getYPositionRandom(), minZ);
      newHelicopter.name = helicopterNames.toString();
      scene.add(newHelicopter);
      helicopters.push(newHelicopter);
      helicopterNames += 1;
    }
  }, difficult * 1000);
}

function clearAllHelicopters() {
  helicopters.forEach((helicopter) => {
    scene.remove(helicopter);
  });
  helicopters = [];
  helicopterNames = 1;
}

function clearAllBullets() {
  bullets.forEach((bullet) => {
    scene.remove(bullet);
  });
  bullets = [];
  bulletNames = 1;
}

function shoot() {
  if (gameOn) {
    var newBullet = cloneFbx(bullet_idle);
    newBullet.position.set(plane_idle.position.x, plane_idle.position.y, plane_idle.position.z);
    newBullet.name = bulletNames.toString();
    scene.add(newBullet);
    bullets.push(newBullet);
    bulletNames += 1;
  }
}

function playGrass() {
  grassAnimator = new KF.KeyFrameAnimator;
  grassAnimator.init({
    interps: [{
      keys: [0, 1],
      values: [{
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 3
        },
      ],
      target: terrain.material.map.offset
    }, ],
    loop: true,
    duration: 1 * 1000,
  });

  grassAnimator.start();
}

function onDocumentKeyDown(event) {
  var keyCode = event.which;

  // BOTON ARRIBA
  if (keyCode == 38) {
    if (plane_idle.position.y < maxY) {
      plane_idle.position.y += moves;
      plane_idle.rotation.x = Math.PI / 30;
    } else {
      plane_idle.rotation.x = 0;
    }
  }

  // BOTON ABAJO
  else if (keyCode == 40) {
    if (plane_idle.position.y > minY) {
      plane_idle.position.y -= moves;
      plane_idle.rotation.x = -Math.PI / 5;
    } else {
      plane_idle.rotation.x = 0;
    }
  }

  // BOTON IZQUIERDA
  else if (keyCode == 37) {
    if (plane_idle.position.x > minX) {
      plane_idle.position.x -= moves;
      plane_idle.rotation.z = -Math.PI / 5;
    } else {
      plane_idle.rotation.z = 0;
    }
  }

  // BOTON DERECHA
  else if (keyCode == 39) {
    if (plane_idle.position.x < maxX) {
      plane_idle.position.x += moves;
      plane_idle.rotation.z = Math.PI / 5;
    } else {
      plane_idle.rotation.z = 0;
    }
  }

  // Key: Z
  if (keyCode == 90) {
    shoot();
  }

}

function onDocumentKeyUp(event) {
  plane_idle.rotation.z = 0;
  plane_idle.rotation.x = 0;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function run() {
  requestAnimationFrame(function() {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // If the game is on
  if (gameOn) {
    animate();
  }
}

function setLightColor(light, r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "./images/grass-lowpoly.jpg";

var SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  // Set the viewport size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Turn on shadows
  renderer.shadowMap.enabled = true;

  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.set(0, 50, 150);
  camera.rotation.set(-44.4, 0, 0);
  scene.add(camera);

  // Create a group to hold all the objects
  root = new THREE.Object3D;

  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 80, 150);
  spotLight.target.position.set(-2, 0, -2);
  root.add(spotLight);

  spotLight.castShadow = true;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 45;

  spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);

  // Create the objects
  loadHelicopterFBX();
  loadAirplaneFBX();
  loadBulletFBX();

  // Create a group to hold the objects
  group = new THREE.Object3D;
  root.add(group);

  // Create a texture map
  var grassMap = new THREE.TextureLoader().load(mapUrl);
  grassMap.wrapS = grassMap.wrapT = THREE.RepeatWrapping;
  grassMap.repeat.set(20, 20);

  var color = 0xffffff;

  // Put in a ground plane to show off the lighting
  geometry = new THREE.PlaneGeometry(400, 200, 50, 50);
  terrain = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: color,
    map: grassMap,
    side: THREE.DoubleSide
  }));
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = -4.02;

  // Add the mesh to our group
  group.add(terrain);

  terrain.castShadow = false;
  terrain.receiveShadow = true;

  // Now add the group to our scene
  scene.add(root);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener("keydown", onDocumentKeyDown, false);
  document.addEventListener("keyup", onDocumentKeyUp, false);
}
