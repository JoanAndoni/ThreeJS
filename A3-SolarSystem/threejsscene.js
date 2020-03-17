var renderer = null,
  scene = null,
  camera = null,
  galaxyGroup = null,
  asteroid = null,
  sun = null,
  mercuryTraslation = null,
  mercury = null,
  venusTraslation = null,
  venus = null,
  earthTraslation = null,
  earthGroup = null,
  earth = null,
  moon = null,
  marsTraslation = null,
  mars = null,
  jupiterTraslation = null,
  jupiter = null,
  saturnTraslation = null,
  saturnGroup = null,
  saturn = null,
  saturnRings = null,
  uranusTraslation = null,
  uranus = null,
  neptuneTraslation = null,
  neptune = null,
  plutoTraslation = null,
  pluto = null;

var duration = 10000; // ms
var currentTime = Date.now();

var loadOBJ = function() {
  var manager = new THREE.LoadingManager();
  //Loader for Obj from Three.js
  var loader = new THREE.OBJLoader(manager);
  //Launch loading of the obj file, addBananaInScene is the callback when it's ready
  loader.load('models/Asteroid.obj', addAsteroidInScene);

};

var addAsteroidInScene = function(object) {
  banana = object;
  // Move the banana in the scene
  //banana.rotation.x = Math.PI / 2;
  banana.position.y = 3;
  banana.position.z = 0;
  // Go through all children of the loaded object and search for a Mesh
  object.traverse(function(child) {
    //This allow us to check if the children is an instance of the Mesh constructor
    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color(0X00FF00);
      //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
      child.geometry.computeVertexNormals();
    }
  });
  //Add the 3D object in the scene
  galaxyGroup.add(banana);
};


function animate() {
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 2 * fract;
  var movement = now * 0.001;

  // Rotation of the galaxy
  galaxyGroup.rotation.y += angle / 5;

  // Rotation of the groups
  earthGroup.rotation.x += angle * 0.05;

  // Rotation of the planets
  sun.rotation.y += angle / 7;
  sun.rotation.x += angle / 3;
  mercury.rotation.y += angle;
  venus.rotation.y += angle;
  earth.rotation.y -= angle;
  mars.rotation.y += angle;
  jupiter.rotation.y += angle / 4;
  saturn.rotation.y += angle;
  uranus.rotation.y += angle;
  neptune.rotation.y += angle / 3;
  pluto.rotation.y += angle;

  // Rotation of the moons
  moon.rotation.y += angle;
}

function run() {
  requestAnimationFrame(function() {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();
}


var loader = new THREE.OBJLoader();
// load a resource
loader.load(
  // resource URL
  'models/Asteroid.obj',
  // called when resource is loaded
  function(asteroid) {
    // return asteroid;
    // scene.add(object);
  },
  // called when loading is in progresses
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // called when loading has errors
  function(error) {
    console.log('An error happened');
  }
);

function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background color
  scene.background = new THREE.Color(0.2, 0.2, 0.2);
  // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.x = 16;
  camera.position.z = 65;
  camera.position.y = 5;

  scene.add(camera);

  // Create a group to hold all the objects
  galaxyGroup = new THREE.Object3D;
  mercury = new THREE.Object3D;
  venus = new THREE.Object3D;
  earthGroup = new THREE.Object3D;
  mars = new THREE.Object3D;
  jupiter = new THREE.Object3D;
  saturnGroup = new THREE.Object3D;
  uranus = new THREE.Object3D;
  neptune = new THREE.Object3D;
  pluto = new THREE.Object3D;

  // Add a directional light to show off the objects
  var light = new THREE.DirectionalLight(0xffffff, 1.0);
  // var light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

  // Position the light out from the scene, pointing at the origin
  light.position.set(-.5, .2, 1);
  light.target.position.set(0, -2, 0);
  scene.add(light);

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  var ambientLight = new THREE.AmbientLight(0xffcc00, 0.5);
  scene.add(ambientLight);

  // URL textures
  var textureSunUrl = "textures/sunmap.jpg";
  var textureMercuryUrl = "textures/mercurymap.jpg";
  var textureVenusUrl = "textures/venusmap.jpg";
  var textureEarthUrl = "textures/earthmap1k.jpg";
  var textureMoonUrl = "textures/moonmap1k.jpg";
  var textureMarsUrl = "textures/mars_1k_color.jpg";
  var textureJupiterUrl = "textures/jupitermap.jpg";
  var textureSaturnUrl = "textures/saturnmap.jpg";
  var textureSaturnRingsUrl = "textures/saturnringcolor.jpg";
  var textureUranusUrl = "textures/uranusmap.jpg";
  var textureNeptuneUrl = "textures/neptunemap.jpg";
  var texturePlutoUrl = "textures/plutomap1k.jpg";

  // Planet textures
  var textureSun = new THREE.TextureLoader().load(textureSunUrl);
  var textureMercury = new THREE.TextureLoader().load(textureMercuryUrl);
  var textureVenus = new THREE.TextureLoader().load(textureVenusUrl);
  var textureEarth = new THREE.TextureLoader().load(textureEarthUrl);
  var textureMoon = new THREE.TextureLoader().load(textureMoonUrl);
  var textureMars = new THREE.TextureLoader().load(textureMarsUrl);
  var textureJupiter = new THREE.TextureLoader().load(textureJupiterUrl);
  var textureSaturn = new THREE.TextureLoader().load(textureSaturnUrl);
  var textureSaturnRings = new THREE.TextureLoader().load(textureSaturnRingsUrl);
  var textureUranus = new THREE.TextureLoader().load(textureUranusUrl);
  var textureNeptune = new THREE.TextureLoader().load(textureNeptuneUrl);
  var texturePluto = new THREE.TextureLoader().load(texturePlutoUrl);

  // Materials
  var materialSun = new THREE.MeshPhongMaterial({
    map: textureSun
  });
  var materialMercury = new THREE.MeshPhongMaterial({
    map: textureMercury
  });
  var materialVenus = new THREE.MeshPhongMaterial({
    map: textureVenus
  });
  var materialEarth = new THREE.MeshPhongMaterial({
    map: textureEarth
  });
  var materialMoon = new THREE.MeshPhongMaterial({
    map: textureMoon
  });
  var materialMars = new THREE.MeshPhongMaterial({
    map: textureMars
  });
  var materialJupiter = new THREE.MeshPhongMaterial({
    map: textureJupiter
  });
  var materialSaturn = new THREE.MeshPhongMaterial({
    map: textureSaturn
  });
  var materialSaturnRings = new THREE.MeshPhongMaterial({
    map: textureSaturnRings,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  var materialUranus = new THREE.MeshPhongMaterial({
    map: textureUranus
  });
  var materialNeptune = new THREE.MeshPhongMaterial({
    map: textureNeptune
  });
  var materialPluto = new THREE.MeshPhongMaterial({
    map: texturePluto
  });
  var materialTraslations = new THREE.MeshPhongMaterial({
    // side: THREE.DoubleSide
    color: 0xffffff
  });

  // Create the SUN geometry
  var geometry = new THREE.SphereGeometry(5, 20, 20);
  sun = new THREE.Mesh(geometry, materialSun);
  sun.position.set(-1, 0, 0);
  sun.rotation.x = Math.PI / 5;
  sun.rotation.y = Math.PI / 5;
  galaxyGroup.add(sun);

  // set the position of the galaxy group
  galaxyGroup.position.set(0, 0, 0);

  // Create the MERCURY geometry
  geometry = new THREE.SphereGeometry(0.5, 20, 20);
  mercury = new THREE.Mesh(geometry, materialMercury);
  mercury.position.set(5, 0, 0);
  mercury.rotation.y = Math.PI;
  mercury.rotation.x = Math.PI / 5;
  galaxyGroup.add(mercury);

  // Create the MERCURY traslation
  geometry = new THREE.TorusGeometry(5, 0.08, 2, 300);
  mercuryTraslation = new THREE.Mesh(geometry, materialTraslations);
  mercuryTraslation.position.set(0, 0, 0);
  mercuryTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(mercuryTraslation);

  // Create the VENUS geometry
  geometry = new THREE.SphereGeometry(1.2, 20, 20);
  venus = new THREE.Mesh(geometry, materialVenus);
  venus.position.set(8, 0, -1);
  venus.rotation.y = Math.PI / 5;
  venus.rotation.x = Math.PI;
  galaxyGroup.add(venus);

  // Create the VENUS traslation
  geometry = new THREE.TorusGeometry(8, 0.08, 2, 300);
  venusTraslation = new THREE.Mesh(geometry, materialTraslations);
  venusTraslation.position.set(0, 0, 0);
  venusTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(venusTraslation);

  // Create a group for the EARTH
  earthGroup = new THREE.Object3D;
  earthGroup.position.set(12, 0, -2);
  galaxyGroup.add(earthGroup);

  // Create the Earth geometry
  geometry = new THREE.SphereGeometry(1.3, 20, 20);
  earth = new THREE.Mesh(geometry, materialEarth);
  earth.position.set(0, 0, 0);
  earthGroup.add(earth);

  // Create Moon
  geometry = new THREE.SphereGeometry(0.3, 20, 10);
  moon = new THREE.Mesh(geometry, materialMoon);
  moon.position.set(1.2, 0, 1.2);
  earth.add(moon);

  // Create the EARTH traslation
  geometry = new THREE.TorusGeometry(12, 0.08, 2, 300);
  earthTraslation = new THREE.Mesh(geometry, materialTraslations);
  earthTraslation.position.set(0, 0, 0);
  earthTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(earthTraslation);

  // Create the MARS geometry
  geometry = new THREE.SphereGeometry(0.6, 20, 20);
  mars = new THREE.Mesh(geometry, materialMars);
  mars.position.set(16, 0, 1);
  mars.rotation.y = Math.PI / 5;
  mars.rotation.x = Math.PI / 15;
  galaxyGroup.add(mars);

  // Create the MARS traslation
  geometry = new THREE.TorusGeometry(16, 0.08, 2, 300);
  marsTraslation = new THREE.Mesh(geometry, materialTraslations);
  marsTraslation.position.set(0, 0, 0);
  marsTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(marsTraslation);

  // Create the JUPITER geometry
  geometry = new THREE.SphereGeometry(4, 20, 20);
  jupiter = new THREE.Mesh(geometry, materialJupiter);
  jupiter.position.set(22, 0, -3);
  jupiter.rotation.y = Math.PI / 10;
  jupiter.rotation.z = Math.PI / 5;
  galaxyGroup.add(jupiter);

  // Create the JUPITER traslation
  geometry = new THREE.TorusGeometry(22, 0.08, 2, 300);
  jupiterTraslation = new THREE.Mesh(geometry, materialTraslations);
  jupiterTraslation.position.set(0, 0, 0);
  jupiterTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(jupiterTraslation);

  // Create a group for the SATURN
  saturnGroup = new THREE.Object3D;
  saturnGroup.position.set(35, 0, -6);
  galaxyGroup.add(saturnGroup);

  // Create the SATURN geometry
  geometry = new THREE.SphereGeometry(3.2, 20, 20);
  saturn = new THREE.Mesh(geometry, materialSaturn);
  saturn.position.set(0, 0, 0);
  saturn.rotation.x = Math.PI;
  saturnGroup.add(saturn);

  // Create SATURN RINGS
  geometry = new THREE.RingGeometry(7, 3.5, 32);
  saturnRings = new THREE.Mesh(geometry, materialSaturnRings);
  saturnRings.position.set(0, 0, 0);
  saturnRings.rotation.x = Math.PI / 2;
  saturn.add(saturnRings);

  // Create the SATURN traslation
  geometry = new THREE.TorusGeometry(35.5, 0.08, 2, 300);
  saturnTraslation = new THREE.Mesh(geometry, materialTraslations);
  saturnTraslation.position.set(0, 0, 0);
  saturnTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(saturnTraslation);

  // Create the URANUS geometry
  geometry = new THREE.SphereGeometry(2.2, 20, 20);
  uranus = new THREE.Mesh(geometry, materialUranus);
  uranus.position.set(44, 0, -1);
  uranus.rotation.y = Math.PI / 4;
  uranus.rotation.x = Math.PI / 5;
  galaxyGroup.add(uranus);

  // Create the URANUS traslation
  geometry = new THREE.TorusGeometry(44, 0.08, 2, 300);
  uranusTraslation = new THREE.Mesh(geometry, materialTraslations);
  uranusTraslation.position.set(0, 0, 0);
  uranusTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(uranusTraslation);

  // Create the NEPTUNE geometry
  geometry = new THREE.SphereGeometry(1.8, 20, 20);
  neptune = new THREE.Mesh(geometry, materialNeptune);
  neptune.position.set(50, 0, 3);
  neptune.rotation.y = -Math.PI;
  neptune.rotation.x = -Math.PI / 2;
  galaxyGroup.add(neptune);

  // Create the NEPTUNE traslation
  geometry = new THREE.TorusGeometry(50, 0.08, 2, 300);
  neptuneTraslation = new THREE.Mesh(geometry, materialTraslations);
  neptuneTraslation.position.set(0, 0, 0);
  neptuneTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(neptuneTraslation);

  // Create the PLUTO geometry
  geometry = new THREE.SphereGeometry(0.5, 20, 20);
  pluto = new THREE.Mesh(geometry, materialPluto);
  pluto.position.set(54, 0, 0);
  pluto.rotation.y = Math.PI / 2;
  pluto.rotation.x = Math.PI / 5;
  galaxyGroup.add(pluto);

  // Create the PLUTO traslation
  geometry = new THREE.TorusGeometry(54, 0.08, 2, 300);
  plutoTraslation = new THREE.Mesh(geometry, materialTraslations);
  plutoTraslation.position.set(0, 0, 0);
  plutoTraslation.rotation.x = Math.PI / 2;
  galaxyGroup.add(plutoTraslation);

  //Load the obj file
  // loadOBJ();

  // Now add the group to our scene
  scene.add(galaxyGroup);
}
