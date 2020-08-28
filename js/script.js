/*import { EffectComposer } from 'js/EffectComposer.js';
import { RenderPass } from '/js//RenderPass.js';
import { UnrealBloomPass } from '/js/UnrealBloomPass.js';*/

const LOADER = document.getElementById('js-loader');

const TRAY = document.getElementById('js-tray-slide');
const DRAG_NOTICE = document.getElementById('js-drag-notice');

var theModel;
const MODEL_PATH = "models/WEBGL.glb";
var activeOption = 'main';
var activeURL = 'https://zippy-passenger.glitch.me/'
var loaded = false;
const colors = [
{
    texture: 'resources/blue.png',
    size: [1,1,1],
    shininess: 0,
    link: 'android/beds/1.html',
    //glb: 'android/beds/glbs/BROWN.glb',
    //usdz: 'android/beds/glbs/BROWN2.usdz',
},
{
    texture: 'resources/green.png',
    size: [1,1,1],
    shininess: 0,
    link: 'android/beds/2.html',
    //glb: 'android/beds/glbs/LIGHTBROWN.glb',
    //usdz: 'android/beds/glbs/LIGHTBROWN2.usdz',

},
{
    texture: 'resources/brown.png',
    size: [1,1,1],
    shininess: 0,
    link: 'android/beds/3.html',
    //glb: 'android/beds/glbs/PINK.glb',
    //usdz: 'android/beds/glbs/PINK2.usdz',
},
{
    texture: 'resources/cream.png',
    size: [1,1,1],
    shininess: 0,
    link: 'android/beds/4.html',
    //glb: 'android/beds/glbs/RED.glb',
    //usdz: 'android/beds/glbs/RED2.usdz',
},
{
    texture: 'resources/yellow.png',
    size: [1,1,1],
    shininess: 0,
    link: 'android/beds/5.html',
    //glb: 'android/beds/glbs/RED.glb',
    //usdz: 'android/beds/glbs/RED2.usdz',
}];
var mixer;
var clock = new THREE.Clock();

const BACKGROUND_COLOR = 0x0A0A0A;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, -1, 100);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.0;

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

var cameraFar = 200;
var camera, raycaster, stats;
document.body.appendChild(renderer.domElement);

// Add a camerra
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;
camera.position.y = 8;
camera.rotation.y = -50;

setTimeout( function() {
    
  
  gsap.to( camera.position, {
    duration: 4,
    zoom: 2,
    x: 0,
    y: 5,
    z: 12,
    onUpdate: function () {
    
      camera.updateProjectionMatrix();
    
    }
  },
  
  
  );
gsap.to(camera.rotation, {
      duration: 2,
      x: deg(360),
      y: deg(360),
      repeat: -1,
      ease: "none",
      onUpdate: function () {
    
        camera.updateProjectionMatrix();
      
      }
    });
  
}, 1000 );
function deg(degrees) {
  // Converts degrees to radians.
  return (degrees * Math.PI) / 180;
}
// backup original rotation


// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });

const INITIAL_MAP = [
{ childID: "main", mtl: INITIAL_MTL }];

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
//const INITIAL_LINK = [
   // { link: INITIAL_URL }
//];
//UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU
//function (open) {
   // theLink = 'link';
//}
//SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
//for (let object of INITIAL_URL){
   // initLink(theLink, object.childID, object.link);
//}


var light = new THREE.PointLight( 0xB428FF, 10, 100 );
light.position.set( 10, 1, 10 );
scene.add( light );

var light2 = new THREE.PointLight( 0x011CFF, 20, 100 );
light2.position.set( -10, 1, 10 );
scene.add( light2 );

var light3 = new THREE.PointLight( 0xFFFFFF, 2, 100 );
light3.position.set( 0, 5, 5 );
scene.add( light3 );

/*var spotLight = new THREE.SpotLight( 0xffffff, 0.2 );
spotLight.position.set( -16, 15, 0 );
spotLight.rotation.set(90, -20, 0);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 50;

scene.add( spotLight );*/

/*var wood;

function handle_load(gltf) {
    wood = gltf.scene.children[0];
    scene.add(wood);
    wood.position.y = 1;
    wood.position.x = -3;
    wood.rotation.y = 89.5;
    wood.scale.set(.005,.005,.005);
    //wood.rotation.y = Math.PI +90;
     wood.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
    wood.animations;
});
                   }*/

var loader = new THREE.GLTFLoader();
                   
loader.load(MODEL_PATH, function (gltf) {
  theModel = gltf.scene;
  mixer= new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
  theModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  

  // Set the models initial scale   
  theModel.scale.set(.05, .05, .05);
  theModel.rotation.y = 0;

  // Offset the y position a bit
  theModel.position.y = -1;
  theModel.position.z = 0;
  theModel.position.x = 0;
    

  // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }

  // Add the model to the scene
  scene.add(theModel);

  // Remove the loader
  LOADER.remove();

});

/*function setupTween (position, target, duration)
{
       TWEEN.removeAll();    // remove previous tweens if needed

       new TWEEN.Tween (position)
           .to (target, duration)
           .easing (TWEEN.Easing.Bounce.InOut)
           .onUpdate (
               function() {
                   // copy incoming position into capera position
                   camera.position.copy (position);
               })
           .start();
           
}
setupTween (camera.position.clone(), new THREE.Vector3(x, y, z), 7500);*/
/*var startRotation = new THREE.Euler().copy( camera.rotation );

// final rotation (with lookAt)
camera.lookAt( theModel.position );
var endRotation = new THREE.Euler().copy( camera.rotation );

// revert to original rotation
camera.rotation.copy( startRotation );

// Tween
new TWEEN.Tween( camera ).to( { rotation: endRotation }, 600 ).start();*/
// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
      }
    }
  });
}

// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.0);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene   
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene    
scene.add(dirLight);

// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0 });


var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = true; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 1; // 30

function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
mixer.update( delta )
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (theModel != null && loaded == false) {
    //initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}

animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {

    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');
    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else
    {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click', selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ifram = () => {
    document.getElementById("modviewer").src = color.link;
}
const toggleModal = () => {
    document.querySelector('.modal')
    .classList.toggle('modal--hidden')
}

const removeModal = () => {
    document.querySelector('.modal')
    .classList.remove('modal--hidden')
}

const toggleInfoar =() => {
    document.querySelector('.ar')
    .classList.toggle('ar--hidden')
}

const removeInfoar = () => {
    document.querySelector('.ar')
    .classList.remove('ar--hidden')
}
const toggleCvet = () => {
    document.querySelector('.cvet')
    .classList.toggle('cvet--hidden')
}

const removeCvet = () => {
    document.querySelector('.cvet')
    .classList.remove('cvet--hidden')
}

//DETECTING PLATFORM !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;
    ///
  let ev = color.link;
      document.querySelector('#modviewer').src = color.link
     document.querySelector('#js-tray').addEventListener('click', ifram);
     //document.querySelector('#js-tray').addEventListener('click', toggleModal);
      //document.querySelector('#js-tray').addEventListener('click', removeModal);
      //document.querySelector('#js-tray').addEventListener('click', toggleInfoar);
      //document.querySelector('#js-tray').addEventListener('click', removeInfoar);
      //document.querySelector('#js-tray').addEventListener('click', toggleCvet);
      document.querySelector('#js-tray').addEventListener('click', removeCvet);
      if (color.texture) {
    let txt = new THREE.TextureLoader().load(color.texture);
    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;


    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10 });
  } else

  {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10 });

  } 
  setMaterial(theModel, activeOption, new_mtl);
}



document.querySelector('#modviewer').onclick = function () {
            document.getElementById("modviewer").src = color.link
            console.log("hey");
            }

function setMaterial(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}

// Function - Opening rotate
let initRotate = 0;

/*--function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
      wood.rotation.x += Math.PI / 60;
  } else {
    loaded = true;
  }
}*/
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    
var slider = document.getElementById('js-tray'),sliderItems = document.getElementById('js-tray-slide'),difference;

function slide(wrapper, items) {
  var posX1 = 0,
  posX2 = 0,
  posInitial,
  threshold = 20,
  posFinal,
  slides = items.getElementsByClassName('tray__swatch');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {

    } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = posInitial + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);
