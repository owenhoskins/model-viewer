 /*LOADINGMANAGER*/


 var loadingManager = null;
 var RESOURCES_LOADED = false;

 // Create a loading manager to set RESOURCES_LOADED when appropriate.
 // Pass loadingManager to all resource loaders.
 loadingManager = new THREE.LoadingManager();

 loadingManager.onProgress = function (item, loaded, total) {
     console.log(item, loaded, total);
 };

 loadingManager.onLoad = function () {
     console.log("loaded all resources");
     RESOURCES_LOADED = true;
 };



 /* SCENE*/
 scene = new THREE.Scene();


 /*CAMERA*/

 camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 600);
 camera.position.x = 0;
 camera.position.y = 0;
 camera.position.z = 50;
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
 renderer.shadowMap.type = THREE.PCFSoftShadowMap;


 /*RENDERER to HTML*/


 $("#webGL-container").append(renderer.domElement);



 /*ORBITCONTROLS*/


 controls = new THREE.OrbitControls(camera, renderer.domElement);

 controls.enableDamping = false;
 controls.dampingFactor = 0.5;
 controls.maxDistance = 50; //maximale Entfernung
 controls.minDistance = 15; // minimale Entfernung

 //Beschränkung Kamera Hoch-Runter
 //controls.minPolarAngle = 0; // radians
 //controls.maxPolarAngle = Math.PI/2; // Kamera nicht unter Boden
 //Beschränkung Kamera links-rechts
 //controls.minAzimuthAngle = - Math.PI/2; // radians
 //controls.maxAzimuthAngle = Math.PI/2; // radians
 controls.enableZoom = true;


 /* LOADER und PFADE*/


 var texloader = new THREE.TextureLoader(loadingManager);

 var jsonloader = new THREE.JSONLoader(loadingManager);
 var texpath = 'textures/';
 var modelpath = 'models/';


 /*Envoirement Map*/



 var path = "textures/cube/studio2/";
 var format = '.jpg';
 var urls = [
						path + 'px' + format, path + 'nx' + format,
						path + 'py' + format, path + 'ny' + format,
						path + 'pz' + format, path + 'nz' + format
					];
 studio2 = new THREE.CubeTextureLoader(loadingManager).load(urls);
 studio2.format = THREE.RGBFormat;



 /*LOAD TEXTURES*/


var baseColor = texloader.load(texpath + 'bottle_low_Lopoly_BaseColor.jpg');
baseColor.warpS = baseColor.wrapT = THREE.RepeatWrapping;

var roughness = texloader.load(texpath + 'bottle_low_Lopoly_Roughness.jpg');
roughness.warpS = roughness.wrapT = THREE.RepeatWrapping;

var metalness = texloader.load(texpath + 'bottle_low_Lopoly_Metallic.jpg');
metalness.warpS = metalness.wrapT = THREE.RepeatWrapping;

var normal = texloader.load(texpath + 'bottle_low_Lopoly_Normal.jpg');
normal.warpS = normal.wrapT = THREE.RepeatWrapping;


/*MATERIALS*/

pbr = new THREE.MeshPhysicalMaterial({
   map: baseColor,
   metalnessMap: metalness,
   metalness: 0.65,
   roughnessMap: roughness,
   roughness: 0.5,
   normalMap: normal,
   envMap: studio2,
   envMapIntensity: 0.5,
});



 /*MODELLE*/


 jsonloader.load(modelpath + 'bottle_faces.json', function (geometry) {
     var material = pbr;
     noshadows(geometry, 50, material);
 });




 function noshadows(geometry, s, material) {
     var mesh = new THREE.Mesh(geometry, material);
     mesh.scale.set(s, s, s);
     mesh.castShadow = true;
     mesh.receiveShadow = true;
     scene.add(mesh);
 };




 /*LIGHTS*/


 Light1 = new THREE.PointLight(0xffffff);
 Light1.castShadow = true;
 Light1.position.set(12.56, 50, -4.29);
 Light1.intensity = 1.58;
 Light1.distance = 250;
 Light1.decay = 2;
 Light1.shadow.camera.near = 10;
 Light1.shadow.camera.far = 100;
 Light1.shadow.camera.fov = 50;
 scene.add(Light1);


 Light2 = new THREE.PointLight(0xffffff);
 Light2.castShadow = true;
 Light2.position.set(-34.62, 39.52, -5.41);
 Light2.intensity = 1.83;
 Light2.distance = 250;
 Light2.decay = 2;
 Light2.shadow.camera.near = 10;
 Light2.shadow.camera.far = 100;
 Light2.shadow.camera.fov = 50;
 scene.add(Light2);


 ambient = new THREE.AmbientLight(0xffffff)
 ambient.intensity = 2;
 scene.add(ambient);


 function animate() {

     // This block runs while resources are loading.
     if (RESOURCES_LOADED == false) {
         requestAnimationFrame(animate);
         return; // Stop the function here.
     }


     requestAnimationFrame(animate);

     renderer.render(scene, camera);
 };

 window.addEventListener("resize", function () {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
 });

 animate();
