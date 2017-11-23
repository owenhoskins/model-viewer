var camera, scene, renderer;
var mesh, material, controls, sky, objects = [];
var controls, guiControls, datGUI;
var sun, sky, Light1, Light2, Light3, Light4, Light5;
var sphereSize = 0.5;

var defaults = savedsettings.remembered.default[0]


/* SCENE*/
scene = new THREE.Scene();

/*CAMERA*/

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 600);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 26;
camera.lookAt(scene.position);


/*RENDERER*/

renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

/*renderer.setClearColor(0xe0e0e0);*/
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.shadowMap.enabled = true;
renderer.physicallyBasedShading = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/*RENDERER to HTML*/

document.getElementById("webGL-container").appendChild(renderer.domElement);

/*ORBITCONTROLS*/

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.dampingFactor = 0.5;
controls.maxDistance = 50; //maximale Entfernung
controls.minDistance = 15; // minimale Entfernung
controls.enableZoom = true;


/* LOADER */
var texloader = new THREE.TextureLoader();
var jsonloader = new THREE.JSONLoader();
var texpath = 'textures/';
var modelpath = 'geo/';


/*Enviroment Map*/

// PARK Envoirement
var path = "textures/cube/skybox/";
var format = '.jpg';
var urls = [
  	path + 'px' + format, path + 'nx' + format,
  	path + 'py' + format, path + 'ny' + format,
  	path + 'pz' + format, path + 'nz' + format
  ];
var skyCube = new THREE.CubeTextureLoader().load(urls);
skyCube.format = THREE.RGBFormat;


// STUDIO Envoirement
var path = "textures/cube/green/";
var format = '.jpg';
var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];
var lightCube = new THREE.CubeTextureLoader().load(urls);
lightCube.format = THREE.RGBFormat;

scene.background = skyCube


function addMesh(geometry, s, material) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(s, s, s);
    tween(mesh);
    //mesh.castShadow = true;
    //mesh.receiveShadow = true;
    scene.add(mesh);
    objects.push(mesh);
};

/* LOAD TEXTURES */

var bottleNormal = texloader.load(texpath + 'eve_bottle_normal.jpg');
bottleNormal.warpS = bottleNormal.wrapT = THREE.RepeatWrapping;

var labelTexture = texloader.load(texpath + 'eve_label.jpg');
labelTexture.warpS = labelTexture.wrapT = THREE.RepeatWrapping;

var foilTexture = texloader.load(texpath + 'eve_foil_color.jpg');
foilTexture.warpS = foilTexture.wrapT = THREE.RepeatWrapping;

var foilNormal = texloader.load(texpath + 'eve_foil_normal.jpg');
foilNormal.warpS = foilNormal.wrapT = THREE.RepeatWrapping;


/* MATERIALS*/


// reflection
// outter material
skyCube.mapping = THREE.CubeReflectionMapping;

var bottleReflection = new THREE.MeshPhysicalMaterial( {
  envMap: skyCube,
  normalMap: bottleNormal,
  color: defaults.m2color,
  metalness: defaults.m2metalness,
  roughness: defaults.m2roughness,
  reflectivity: defaults.m2reflectivity,
  clearCoat: defaults.m2clearCoat,
  clearCoatRoughness: defaults.m2clearCoatRoughness,
  transparent: true,
  opacity: defaults.m2opacity,
  refractionRatio: defaults.m2refractionRatio,
  envMapIntensity: defaults.m2envMapIntensity,
  shading: THREE.SmoothShading,
  premultipliedAlpha: false,
  side: THREE.FrontSide,
  blending: THREE.MultiplyBlending,
  depthWrite: true,
});


// refraction
skyCube.mapping = THREE.CubeRefractionMapping;

bottleRefraction = new THREE.MeshPhysicalMaterial({
    envMap: skyCube,
    normalMap: bottleNormal,
    color: defaults.m1color,
    metalness: defaults.m1metalness,
    roughness: defaults.m1roughness,
    reflectivity: defaults.m1reflectivity,
    clearCoat: defaults.m1clearCoat,
    clearCoatRoughness: defaults.m1clearCoatRoughness,
    transparent: true,
    opacity: defaults.m1opacity,
    refractionRatio: defaults.m1refractionRatio,
    envMapIntensity: defaults.m1envMapIntensity,
    shading: THREE.SmoothShading,
    premultipliedAlpha: false,
    side: THREE.FrontSide,
    blending: THREE.MultiplyBlending,
    depthWrite: true,
});

var label = new THREE.MeshPhysicalMaterial({
    map: labelTexture,
    metalness: 0.2,
    roughness: 0.4, // spreads out the specular / simulates a rough surface
    reflectivity: 0.4,
    // envMap: lightCube,
    // envMapIntensity: 0.1,
});

var foil = new THREE.MeshPhysicalMaterial({
    map: foilTexture,
    normalMap: foilNormal,
    metalness: 0.2,
    reflectivity: 0.5,
    roughness: 0.3,
    envMap: skyCube,
    envMapIntensity: 0.0,
});


/* LOAD GEOMETRY */

// bottle
jsonloader.load(modelpath + '171020_eve_glass.json', function (geometry) {
    addMesh(geometry, 49.25, bottleRefraction);
});

jsonloader.load(modelpath + '171020_eve_glass.json', function (geometry) {
    addMesh(geometry, 50, bottleReflection);
});

// label
jsonloader.load(modelpath + '171020_eve_label.json', function (geometry) {
    addMesh(geometry, 50, label);
});

//foil
jsonloader.load(modelpath + '171020_eve_foil.json', function (geometry) {
    addMesh(geometry, 50, foil);
});



/*datGUI controls object*/
guiControls = new function () {


    this.xsun = defaults.xsun;
    this.ysun = defaults.ysun;
    this.zsun = defaults.zsun;
    this.intensitysun = defaults.intensitysun;
    this.colorsun = defaults.colorsun;

    this.intensitysky = defaults.intensitysky;
    this.colorsky = defaults.colorsky;
    this.colorground = defaults.colorground;

    this.x1 = defaults.x1;
    this.y1 = defaults.y1;
    this.z1 = defaults.z1;
    this.intensity1 = defaults.intensity1;
    this.color1 = defaults.color1;

    this.m1color = defaults.m1color
    this.m1metalness = defaults.m1metalness
    this.m1roughness = defaults.m1roughness
    this.m1reflectivity = defaults.m1reflectivity
    this.m1clearCoat = defaults.m1clearCoat
    this.m1clearCoatroughness = defaults.m1clearCoatroughness
    this.m1opacity = defaults.m1opacity
    this.m1ior = defaults.m1ior
    this.m1envMapIntensity = defaults.m1envMapIntensity

    this.m2color = defaults.m2color
    this.m2metalness = defaults.m2metalness
    this.m2roughness = defaults.m2roughness
    this.m2reflectivity = defaults.m2reflectivity
    this.m2clearCoat = defaults.m2clearCoat
    this.m2clearCoatroughness = defaults.m2clearCoatroughness
    this.m2opacity = defaults.m2opacity
    this.m2ior = defaults.m2ior
    this.m2envMapIntensity = defaults.m2envMapIntensity

};

/* adds directional light (sun) with starting parameters */
sun = new THREE.DirectionalLight(guiControls.colorsun);

sun.position.set(2, 2, 2);
sun.intensity = guiControls.intensitysun;
scene.add(sun);

/* adds hemispheric light (Sky) to the scene */
sky = new THREE.HemisphereLight(guiControls.colorsky, guiControls.colorground, guiControls.intensitysky );

scene.add(sky);


/*adds spot light (Light1) with starting parameters*/
Light1 = new THREE.PointLight(guiControls.color1);

Light1.position.set(20, 35, 40);
Light1.intensity = guiControls.intensity1;
Light1.distance = 250;
Light1.castShadow = true;
Light1.decay = 2;
Light1.shadow.camera.near = 10;
Light1.shadow.camera.far = 100;
Light1.shadow.camera.fov = 50;
scene.add(Light1);

var pointLightHelper = new THREE.PointLightHelper(Light1, sphereSize);
scene.add(pointLightHelper);



/*adds controls to scene*/
datGUI = new dat.GUI({
    load: savedsettings // loaded from settings.js
});

datGUI.remember(guiControls);

// setup for hemisphere
var hemisphere = datGUI.addFolder(`sky`);
hemisphere.add(guiControls, `intensitysky`, 0, 5).onChange(function (value) {
    sky.intensity = value;
});
hemisphere.addColor(guiControls, `colorsky`).onChange(function (value){
    sky.skyColor = new THREE.Color(value);
});
hemisphere.addColor(guiControls, `colorground`).onChange(function (value){
    sky.groundColor = new THREE.Color(value);
});

// setup for sun
var directional = datGUI.addFolder(`sun`);
directional.add(guiControls, `xsun`, -20, 20);
directional.add(guiControls, `ysun`, -20, 20);
directional.add(guiControls, `zsun`, -20, 20);
directional.add(guiControls, `intensitysun`, 0, 5).onChange(function (value) {
    sun.intensity = value;
});
directional.addColor(guiControls, `colorsun`).onChange(function(value){
    sun.color = new THREE.Color(value);
});

//setup for normal light
var l1 = datGUI.addFolder('Licht1');
l1.add(guiControls, 'x1', -20, 20);
l1.add(guiControls, 'y1', -50, 20);
l1.add(guiControls, 'z1', -20, 20);
l1.add(guiControls, 'intensity1', 0, 5).onChange(function (value) {
    Light1.intensity = value;
});
l1.addColor(guiControls, 'color1').onChange(function (value) {
    Light1.color = new THREE.Color(value);
});

// gui material1
var m1 = datGUI.addFolder('Bottle Refraction');
m1.addColor(guiControls, 'm1color').onChange(function (value) {
    bottleRefraction.color = new THREE.Color(value);
});
m1.add(guiControls, 'm1metalness', 0, 1).onChange(function (value) {
    bottleRefraction.metalness = value;
});
m1.add(guiControls, 'm1roughness', 0, 1).onChange(function (value) {
    bottleRefraction.roughness = value;
});
m1.add(guiControls, 'm1reflectivity', 0, 1).onChange(function (value) {
    bottleRefraction.reflectivity = value;
});
m1.add(guiControls, 'm1clearCoat', 0, 1).onChange(function (value) {
    bottleRefraction.clearCoat = value;
});
m1.add(guiControls, 'm1clearCoatroughness', 0, 1).onChange(function (value) {
    bottleRefraction.clearCoatRoughness = value;
});
m1.add(guiControls, 'm1envMapIntensity', 0, 3).onChange(function (value) {
    bottleRefraction.envMapIntensity = value;
});
m1.add(guiControls, `m1opacity`, 0, 1).onChange(function (value){
    bottleRefraction.opacity = value;
});
m1.add(guiControls, `m1ior`, 0 , 1).onChange(function (value){
    bottleRefraction.refractionRatio = value;
});

// gui material2
var m2 = datGUI.addFolder('Bottle Reflection');
m2.addColor(guiControls, 'm2color').onChange(function (value) {
    bottleReflection.color = new THREE.Color(value);
});
m2.add(guiControls, 'm2metalness', 0, 1).onChange(function (value) {
    bottleReflection.metalness = value;
});
m2.add(guiControls, 'm2roughness', 0, 1).onChange(function (value) {
    bottleReflection.roughness = value;
});
m2.add(guiControls, 'm2reflectivity', 0, 1).onChange(function (value) {
    bottleReflection.reflectivity = value;
});
m2.add(guiControls, 'm2clearCoat', 0, 1).onChange(function (value) {
    bottleReflection.clearCoat = value;
});
m2.add(guiControls, 'm2clearCoatroughness', 0, 1).onChange(function (value) {
    bottleReflection.clearCoatRoughness = value;
});
m2.add(guiControls, 'm2envMapIntensity', 0, 3).onChange(function (value) {
    bottleReflection.envMapIntensity = value;
});
m2.add(guiControls, `m2opacity`, 0, 1).onChange(function (value){
    bottleReflection.opacity = value;
});
m2.add(guiControls, `m2ior`, 0 , 1).onChange(function (value){
    bottleReflection.refractionRatio = value;
});


datGUI.close();


/* RENDER*/

function render() {
    sun.position.x = guiControls.xsun;
    sun.position.y = guiControls.ysun;
    sun.position.z = guiControls.zsun;

    Light1.position.x = guiControls.x1;
    Light1.position.y = guiControls.y1;
    Light1.position.z = guiControls.z1;
};




// Stats

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
document.body.appendChild(stats.domElement);

function animate() {
    requestAnimationFrame(animate);
    render();
    renderer.render(scene, camera);
    stats.update();
};


function backgroundVideo() {
    var aspectRatio = 9 / 16
    var wW = parseInt(window.innerWidth)
    var wH = parseInt(window.innerHeight)
    var height = Math.ceil(wW * aspectRatio)
    var isLandscape = wH < height

    var video = document.getElementById("video")
    if (isLandscape) {
        video.style.width = wW + "px";
        video.style.height = "auto"
    } else {
        video.style.width = "auto";
        video.style.height = wH + "px";
    }
}


////backgroundVideo()


function tween(mesh) {
    if (mesh) {
        var tween = new TWEEN.Tween(mesh.rotation)
            .to({
                y: "-" + Math.PI / 2
            }, 2500) // relative animation
            .onComplete(function () {
                // Check that the full 360 degrees of rotation,
                // and calculate the remainder of the division to avoid overflow.
                if (Math.abs(mesh.rotation.y) >= 2 * Math.PI) {
                    mesh.rotation.y = mesh.rotation.y % (2 * Math.PI);
                }
            })
            .start();
        tween.repeat(Infinity)
    }
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //backgroundVideo()
});

animate();

/*

  function setupControls(ob) {
    var gui = new dat.GUI();
    var uniformsFolder = gui.addFolder('Uniforms');
    for(key in ob){
      if(ob[key].type == 'f'){
        var controller = uniformsFolder.add(ob[key], 'value').name(key);
        if(typeof ob[key].min != 'undefined'){
          controller.min(ob[key].min).name(key);
        }
        if(typeof ob[key].max != 'undefined'){
          controller.max(ob[key].max).name(key);
        }
        controller.onChange(function(value){
          this.object.value = parseFloat(value);
        });
      }else if(ob[key].type == 'c'){
        ob[key].guivalue = [ob[key].value.r * 255, ob[key].value.g * 255, ob[key].value.b * 255];
        var controller = uniformsFolder.addColor(ob[key], 'guivalue').name(key);
        controller.onChange(function(value){
          this.object.value.setRGB(value[0]/255, value[1]/255, value[2]/255);
        });
      }
    }
    uniformsFolder.open();

  }

  setupControls(uniforms);
*/
