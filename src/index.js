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
import SmoothScrollbar from "smooth-scrollbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const world = {};
const os = [];
const canvas = document.querySelector("#canvas");
const canvasRect = canvas.getBoundingClientRect();

init();
function init() {
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
      opacity: 0.2,
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
      $: {
        el,
      },
    };

    world.scene.add(mesh);
    os.push(o);
  });

  scrollInit();

  function render() {
    requestAnimationFrame(render);
    os.forEach((o) => {
      scroll(o);
    });
    world.renderer.render(world.scene, world.camera);
  }
  render();
}

function scroll(o) {
  const {
    $: { el },
    mesh,
  } = o;
  const rect = el.getBoundingClientRect();
  const { y } = getWorldPosition(rect, canvasRect);
  // console.log(rect.top, y);
  // mesh.position.x = x;
  mesh.position.y = y;
}

function getWorldPosition(rect, canvasRect) {
  const x = rect.left + rect.width / 2 - canvasRect.width / 2;
  const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
  return { x, y };
}

function scrollInit() {
  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector("#page-container");
  SmoothScrollbar.init(pageContainer);

  // 3rd party library setup:
  const bodyScrollBar = Scrollbar.init(document.body, {
    damping: 0.1,
    delegateTo: document,
  });

  // Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element:
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value; // setter
      }
      return bodyScrollBar.scrollTop; // getter
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  // when the smooth scroller updates, tell ScrollTrigger to update() too:
  bodyScrollBar.addListener(ScrollTrigger.update);

  const el = document.querySelector("[data-webgl]");

  //   const rect = el.getBoundingClientRect();
  //   const x = rect.left + 10;
  //   const pos = getWorldPosition({ left: x, width: rect.width }, canvasRect);

  //   //追加記述
  //   const meshX = os[0].mesh.position.x;
  //   const animation = {
  //     x: meshX,
  //     rotation: 0,
  //   };

  //   gsap.to(animation, {
  //     rotation: Math.PI * 2,
  //     x: meshX + 600,
  //     scrollTrigger: {
  //       trigger: el,
  //       start: "center 80%",
  //       end: "center 20%",
  //       scrub: true,
  //       pin: true,
  //     },
  //     onUpdate() {
  //       os[0].mesh.position.x = animation.x;
  //       os[0].mesh.rotation.z = animation.rotation;
  //     },
  //   });

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
