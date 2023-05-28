import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

import gsap from "gsap";
import Scrollbar from "smooth-scrollbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const world = {};
const os = [];
const canvas = document.querySelector("#canvas");
const canvasRect = canvas.getBoundingClientRect();

init();
function init() {
  scrollInit();
  bindResizeEvent();

  world.renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(canvasRect.width, canvasRect.height, false);
  world.renderer.setPixelRatio(window.devicePixelRatio);
  world.renderer.setClearColor(0x000000, 0.0);

  world.scene = new Scene();

  const cameraWidth = canvasRect.width;
  const cameraHeight = canvasRect.height;
  const near = 1500;
  const far = 4000;
  const aspect = cameraWidth / cameraHeight;
  const cameraZ = 2000;
  const radian = 2 * Math.atan(cameraHeight / 2 / cameraZ);
  const fov = radian * (180 / Math.PI);
  world.camera = new PerspectiveCamera(fov, aspect, near, far);
  world.camera.position.z = cameraZ;

  const els = document.querySelectorAll("[data-webgl]");
  els.forEach((el) => {
    const rect = el.getBoundingClientRect();

    const geometry = new PlaneGeometry(rect.width, rect.height, 1, 1);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.z = 0;

    const { x, y } = getWorldPosition(rect, canvasRect);
    mesh.position.x = x;
    mesh.position.y = y;

    const o = {
      geometry,
      material,
      mesh,
      rect, //追加　これでエラーは消えたけど、シンクロはせず
      $: {
        el,
      },
    };

    world.scene.add(mesh);
    os.push(o);
  });

  render();
  function render() {
    requestAnimationFrame(render);
    os.forEach((o) => {
      scroll(o);
    });
    world.renderer.render(world.scene, world.camera);
  }
}

function scroll(o) {
  const {
    $: { el },
    mesh,
  } = o;
  const rect = el.getBoundingClientRect();
  const { x, y } = getWorldPosition(rect, canvasRect);
  // console.log(rect.top, y);
  // mesh.position.x = x;
  mesh.position.y = y;
}

function resize(o, newCanvasRect) {
  const {
    $: { el },
    mesh,
    geometry,
    rect,
  } = o;
  const nextRect = el.getBoundingClientRect();
  const { x, y } = getWorldPosition(nextRect, newCanvasRect);
  mesh.position.x = x;
  mesh.position.y = y;

  //大きさの変更
  geometry.scale(nextRect.width / rect.width, nextRect.height / rect.height, 1);

  o.rect = nextRect;
}

function getWorldPosition(rect, canvasRect) {
  const x = rect.left + rect.width / 2 - canvasRect.width / 2;
  const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
  return { x, y };
}

function scrollInit() {
  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector("#page-container");

  const scrollBar = Scrollbar.init(pageContainer, {
    delegateTo: document,
  });

  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      if (arguments.length) {
        scrollBar.scrollTop = value; // setter
      }
      return scrollBar.scrollTop; // getter
    },
    // getBoundingClientRect() {
    //   return {
    //     top: 0,
    //     left: 0,
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //   };
    // },
  });

  scrollBar.addListener(ScrollTrigger.update);

  ScrollTrigger.defaults({
    scroller: pageContainer,
  });

  const el = document.querySelector("[data-webgl]");

  // const rect = el.getBoundingClientRect();
  // const x = rect.left + 10;
  // const pos = getWorldPosition({ left: x, width: rect.width }, canvasRect);

  //追加記述
  // const meshX = os[0].mesh.position.x;
  // const animation = {
  //   rotation: 0,
  //   x: meshX,
  // };

  // gsap.to(animation, {
  //   rotation: Math.PI * 2,
  //   x: meshX + 600,
  //   scrollTrigger: {
  //     trigger: el,
  //     start: "center 80%",
  //     end: "center 20%",
  //     scrub: true,
  //     pin: true,
  //   },
  //   onUpdate() {
  //     os[0].mesh.position.x = animation.x;
  //     os[0].mesh.rotation.z = animation.rotation;
  //   },
  // });

  //   // gsap.to(os[0].mesh.position, {
  //   //   x: pos.x,
  //   //   scrollTrigger: {
  //   //     trigger: el,
  //   //     start: "center 68%",
  //   //     end: "center 30%",
  //   //     scrub: true,
  //   //     // pin: true,
  //   //   },
  //   // });
  //   gsap.to(el, {
  //     x: 300,
  //     scrollTrigger: {
  //       trigger: el,
  //       start: "center 70%",
  //       end: "center 30%",
  //       scrub: true,
  //       pin: true,
  //       onEnter() {
  //         console.log("enter");
  //       },
  //       onLeave() {
  //         console.log("leave");
  //       },
  //       onEnterBack() {
  //         console.log("enter");
  //       },
  //       onLeaveBack() {
  //         console.log("leave");
  //       },
  //     },
  //     onUpdate() {
  //       const rect = el.getBoundingClientRect();
  //       const x = rect.left + 10;
  //       const pos = getWorldPosition({ left: x, width: rect.width }, canvasRect);
  //       os[0].mesh.position.x = pos.x;
  //     },
  //   });

  //   // const tl = gsap.timeline();
  //   // tl.to(el, {
  //   //   x: 600,
  //   // });

  //   // ScrollTrigger.create({
  //   //   animation: tl,
  //   //   trigger: el,
  //   //   start: "center 70%",
  //   //   end: "center 30%",
  //   //   scrub: true,
  //   //   pin: true,
  //   //   onEnter() {
  //   //     console.log("enter");
  //   //   },
  //   //   onLeave() {
  //   //     console.log("leave");
  //   //   },
  //   //   onEnterBack() {
  //   //     console.log("enter");
  //   //   },
  //   //   onLeaveBack() {
  //   //     console.log("leave");
  //   //   },
  //   //   onUpdate() {
  //   //     const rect = el.getBoundingClientRect();
  //   //     const x = rect.left + 10;
  //   //     const pos = getWorldPosition({ left: x, width: rect.width }, canvasRect);
  //   //     os[0].mesh.position.x = pos.x;
  //   //   },
  //   // });
}

function bindResizeEvent() {
  let timerId = null;
  window.addEventListener("resize", () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      console.log("resize");

      const newCanvasRect = canvas.getBoundingClientRect();
      // canvasサイズの変更
      world.renderer.setSize(newCanvasRect.width, newCanvasRect.height, false);
      // meshの位置の再計算
      os.forEach((o) => resize(o, newCanvasRect));
      // cameraの位置の再計算
      const cameraWidth = newCanvasRect.width;
      const cameraHeight = newCanvasRect.height;
      const near = 1500;
      const far = 4000;
      const aspect = cameraWidth / cameraHeight;
      const cameraZ = 2000;
      const radian = 2 * Math.atan(cameraHeight / 2 / cameraZ);
      const fov = radian * (180 / Math.PI);

      world.camera.fov = fov;
      world.camera.near = near;
      world.camera.far = far;
      world.camera.aspect = aspect;
      world.camera.updateProjectionMatrix();
    }, 500);
  });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);


// Raycasterのアドレス
// https://ics.media/tutorial-three/raycasting.html
//threejs.org/docs/index.html?q=Raycaster#api/en/core/Raycaster

/*
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);
*/