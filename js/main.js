
  var camera, scene, renderer;
  var mesh, material, controls, sky;


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
 controls.enableZoom = true;


 /* LOADER und PFADE*/


 var texloader = new THREE.TextureLoader(loadingManager);

 var jsonloader = new THREE.JSONLoader(loadingManager);
 var texpath = 'textures/';
 var modelpath = 'models/';


 /*Envoirement Map*/

 var path = "textures/cube/wetransfer/";
 var format = '.jpg';
 var urls = [
						path + 'px' + format, path + 'nx' + format,
						path + 'py' + format, path + 'ny' + format,
						path + 'pz' + format, path + 'nz' + format
					];
  var skyCube = new THREE.CubeTextureLoader(loadingManager).load(urls);
  skyCube.format = THREE.RGBFormat;
  skyCube.mapping = THREE.CubeRefractionMapping;

  var skyCube2 = new THREE.CubeTextureLoader(loadingManager).load(urls);
  skyCube2.format = THREE.RGBFormat;
  skyCube2.mapping = THREE.CubeReflectionMapping;

  scene.background = skyCube

  function addMesh(geometry, s, material) {
     var mesh = new THREE.Mesh(geometry, material);
     mesh.scale.set(s, s, s);

      mesh.position.set( 0, -7, 0 );
      mesh.__dirtyPosition = true;

      // Change the object's rotation
      //mesh.rotation.set(0, 90, 0);
      //mesh.__dirtyRotation = true;

     // https://stackoverflow.com/a/30154137/497344
     // mesh.rotation.y = Math.PI / 3.5;
     // mesh.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
     tween(mesh);
     scene.add(mesh);
  };


/*LOAD TEXTURES*/

var baseColor = texloader.load(texpath + 'bottle_low_Lopoly_BaseColor.jpg');
baseColor.warpS = baseColor.wrapT = THREE.RepeatWrapping;

var roughness = texloader.load(texpath + 'bottle_low_Lopoly_Roughness.jpg');
roughness.warpS = roughness.wrapT = THREE.RepeatWrapping;

var metalness = texloader.load(texpath + 'bottle_low_Lopoly_Metallic.jpg');
metalness.warpS = metalness.wrapT = THREE.RepeatWrapping;

var normal = texloader.load(texpath + 'bottle_low_Lopoly_Normal.jpg');
normal.warpS = normal.wrapT = THREE.RepeatWrapping;

// selavy_label.png
var labelTexture = texloader.load(texpath + 'selavy_label.png');
labelTexture.warpS = labelTexture.wrapT = THREE.RepeatWrapping;

// Crown_Sticker_6.png
var stickerTexture = texloader.load(texpath + 'Crown_Sticker_6.png');
stickerTexture.warpS = stickerTexture.wrapT = THREE.RepeatWrapping;

// TexturesCom_PaperCrumpled0030_1_seamless_S.jpg
var foilTexture = texloader.load(texpath + 'TexturesCom_PaperCrumpled0030_1_seamless_S.jpg');
foilTexture.warpS = foilTexture.wrapT = THREE.RepeatWrapping;


var shader = THREE.FresnelShader;
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

uniforms[ "tCube" ].value = skyCube;

var bottleBackMaterial = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: shader.vertexShader,
  fragmentShader: shader.fragmentShader,
  side: THREE.BackSide,
  //transparent: true
} );

  var bottleFrontMaterial = new THREE.MeshPhysicalMaterial( {
      map: null,
      envMap: skyCube2,
      color: 0x444400,
      metalness: 0.0,
      roughness: 0,
      opacity: 0.8,
      side: THREE.FrontSide,
      transparent: true,
      //shading: THREE.SmoothShading,
      envMapIntensity: 3,
      premultipliedAlpha: true
    } );


  // var bottleBackMaterial = new THREE.MeshPhysicalMaterial( {
  //     map: null,
  //     envMap: skyCube,
  //     color: 0x444400,
  //     metalness: 1.0,
  //     roughness: 0,
  //     opacity: 0.98,
  //     side: THREE.BackSide,
  //     transparent: true,
  //     //shading: THREE.SmoothShading,
  //     envMapIntensity: 1,
  //     premultipliedAlpha: true
  //   } );




/*MATERIALS*/



var label = new THREE.MeshPhysicalMaterial({
   map: labelTexture,
   metalness: 0,
   roughness: 0.5,
   envMap: skyCube,
   envMapIntensity: 0.5,
});

var sticker = new THREE.MeshPhysicalMaterial({
   map: stickerTexture,
   metalness: 0,
   roughness: 0.5,
   envMap: skyCube,
   envMapIntensity: 0.5,
});

var foil = new THREE.MeshPhysicalMaterial({
   map: foilTexture,
   metalness: 0.4,
   roughness: 0.3,
   normalMap: normal,
   envMap: skyCube,
   envMapIntensity: 0.1,
});



 /* BASE */
 jsonloader.load(modelpath + 'bottle_base.json', function (geometry) {
    addMesh(geometry, 50, bottleFrontMaterial);
 });

 /* BASE */
 jsonloader.load(modelpath + 'bottle_base.json', function (geometry) {
    addMesh(geometry, 50, bottleBackMaterial);
 });

 /* LABEL */
 jsonloader.load(modelpath + 'bottle_label-edgesplit.json', function (geometry) {
     var material = label;
     addMesh(geometry, 50, material);
 });

 /* STICKER */
 jsonloader.load(modelpath + 'bottle_sticker.json', function (geometry) {
     var material = sticker;
     addMesh(geometry, 50, material);
 });

  /* FOIL */
  jsonloader.load(modelpath + 'foil.json', function (geometry) {
    addMesh(geometry, 50, foil);
  });


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

  // Stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild( stats.domElement );

 function animate() {

    // This block runs while resources are loading.
    if (RESOURCES_LOADED == false) {
      requestAnimationFrame(animate);
      return; // Stop the function here.
    }

    requestAnimationFrame(animate);
    //TWEEN.update();
    renderer.render(scene, camera);
    stats.update();
 };

 function tween(mesh) {
  if (mesh) {
      var tween = new TWEEN.Tween(mesh.rotation)
        .to({ y: "-" + Math.PI/2}, 2500) // relative animation
        .onComplete(function() {
            // Check that the full 360 degrees of rotation,
            // and calculate the remainder of the division to avoid overflow.
            if (Math.abs(mesh.rotation.y)>=2*Math.PI) {
                mesh.rotation.y = mesh.rotation.y % (2*Math.PI);
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
 });

 animate();


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