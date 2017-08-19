
  var camera, scene, renderer;
  var mesh, material, controls, sky, objects = [];

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
  camera.position.y = -10;
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /*RENDERER to HTML*/

  document.getElementById("webGL-container").appendChild( renderer.domElement );

  /*ORBITCONTROLS*/

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.dampingFactor = 0.5;
  controls.maxDistance = 50; //maximale Entfernung
  controls.minDistance = 15; // minimale Entfernung
  controls.enableZoom = true;


  /* LOADER */
  var texloader = new THREE.TextureLoader(loadingManager);
  var jsonloader = new THREE.JSONLoader(loadingManager);
  var texpath = 'textures/';
  var modelpath = 'models/';


  /*Enviroment Map*/

  // CubeRefractionMapping
  var path = "textures/cube/Park2/";
  var format = '.jpg';
  var urls = [
  	path + 'px' + format, path + 'nx' + format,
  	path + 'py' + format, path + 'ny' + format,
  	path + 'pz' + format, path + 'nz' + format
  ];
  var skyCube = new THREE.CubeTextureLoader(loadingManager).load(urls);
  skyCube.format = THREE.RGBFormat;


  // CubeReflectionMapping
  var path = "textures/cube/green/";
  var format = '.jpg';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];
  var skyCube2 = new THREE.CubeTextureLoader(loadingManager).load(urls);
  skyCube2.format = THREE.RGBFormat;

  scene.background = skyCube


  function addMesh(geometry, s, material) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(s, s, s);
    //moves the bottle down when its origin point was a the bottom
    //mesh.position.set( 0, -7, 0 );
    //mesh.__dirtyPosition = true;
    tween(mesh);
    scene.add(mesh);
    objects.push( mesh );
  };

  /* LOAD TEXTURES */

  //var normal = texloader.load(texpath + 'bottle_low_Lopoly_Normal.jpg');
  //normal.warpS = normal.wrapT = THREE.RepeatWrapping;

  // selavy_label.png
  var labelTexture = texloader.load(texpath + 'selavy_label.png');
  labelTexture.warpS = labelTexture.wrapT = THREE.RepeatWrapping;

  // Crown_Sticker_6.png
  var stickerTexture = texloader.load(texpath + 'Crown_Sticker_6.png');
  stickerTexture.warpS = stickerTexture.wrapT = THREE.RepeatWrapping;

  // TexturesCom_PaperCrumpled0030_1_seamless_S.jpg
  var foilTexture = texloader.load(texpath + 'TexturesCom_PaperCrumpled0030_1_seamless_S.jpg');
  foilTexture.warpS = foilTexture.wrapT = THREE.RepeatWrapping;

  /* MATERIALS */

  // reflection
  skyCube2.mapping = THREE.CubeReflectionMapping;

  var bottleFrontMaterial = new THREE.MeshPhysicalMaterial( {
    map: null,
    envMap: skyCube2,
    color: 0x0F1E00,
    metalness: 0.5,
    roughness: 0.5,
    opacity: 0.8,
    transparent: true,
    shading: THREE.SmoothShading,
    envMapIntensity: 5,
    premultipliedAlpha: true
  });

  // refraction
  skyCube.mapping = THREE.CubeRefractionMapping;

  var bottleBackMaterial = new THREE.MeshPhysicalMaterial( {
    map: null,
    envMap: skyCube,
    color: 0x050501,
    metalness: 0.5,
    roughness: 0,
    opacity: 0.8,
    transparent: true,
    shading: THREE.SmoothShading,
    envMapIntensity: 0.5,
    refractionRatio: 0.95, // CubeRefractionMapping
    premultipliedAlpha: true
  });

  var label = new THREE.MeshPhysicalMaterial({
     map: labelTexture,
     metalness: 0,
     roughness: 0.5,
     envMap: skyCube2,
     envMapIntensity: 0.5,
  });

  var sticker = new THREE.MeshPhysicalMaterial({
     map: stickerTexture,
     metalness: 0,
     roughness: 0.5,
     envMap: skyCube2,
     envMapIntensity: 0.5,
  });

  var foil = new THREE.MeshPhysicalMaterial({
     //map: foilTexture,
     metalness: 0,
     roughness: 0.1,
     //normalMap: normal,
     envMap: skyCube2,
     envMapIntensity: 0.1,
  });


  /* BASE REFLECTION */
  jsonloader.load(modelpath + 'bottle-reduced.json', function (geometry) {
    addMesh(geometry, 49.9, bottleFrontMaterial);
  });

  /* BASE REFRACTION */
  jsonloader.load(modelpath + 'bottle-reduced.json', function (geometry) {
    addMesh(geometry, 50, bottleBackMaterial);
  });

  /* LABEL */
  jsonloader.load(modelpath + 'label-reduced.json', function (geometry) {
     var material = label;
     addMesh(geometry, 50, material);
  });

  /* STICKER */
  jsonloader.load(modelpath + 'crown-label-reduced.json', function (geometry) {
     var material = sticker;
     addMesh(geometry, 50, material);
  });

  /* FOIL */
  jsonloader.load(modelpath + 'foil-reduced.json', function (geometry) {
    addMesh(geometry, 50, foil);
  });


  // add hemi lights
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  // this is the Sun
  var dirLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( 40, -50, 50 ); // fromX, fromY, fromZ
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );

  // this is the Sun
  var dirLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -60, -50, 150 ); // fromX, fromY, fromZ
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );



  //dirLight.position.set( 1, 0.75, 1 );
  //scene.add( dirLight );

  // dirLight.shadowCameraVisible = true;
  /*dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;
  var d = 30;
  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;
  // the magic is here - this needs to be tweaked if you change dimensions
  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.000001;
  dirLight.shadowDarkness = 0.35;
  scene.add( dirLight );
*/

  /*LIGHTS*/
/*
  Light1 = new THREE.PointLight(0xffffff);
  Light1.castShadow = true;
  Light1.position.set(90, 20, 140); // x, y, z,
  Light1.intensity = .5;
  Light1.distance = 250;
  Light1.decay = 2;
  Light1.shadow.camera.near = 10;
  Light1.shadow.camera.far = 100;
  Light1.shadow.camera.fov = 50;
  scene.add(Light1);


  Light2 = new THREE.PointLight(0xffffff);
  Light2.castShadow = true;
  Light2.position.set(-90, 40, -60); // x, y, z,
  Light2.intensity = .5;
  Light2.distance = 250;
  Light2.decay = 2;
  Light2.shadow.camera.near = 10;
  Light2.shadow.camera.far = 100;
  Light2.shadow.camera.fov = 50;
  scene.add(Light2);


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
  scene.add(ambient);*/

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
    /*for ( var i = 0, l = objects.length; i < l; i ++ ) {
      var object = objects[ i ];
      object.rotation.y += 0.005;
    }*/
    renderer.render(scene, camera);
    stats.update();
  };


 function backgroundVideo () {
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