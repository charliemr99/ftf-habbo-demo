import * as THREE from "./three.module";
import Stats from "./stats";
import { StereoEffect } from "./StereoEffect";
import ParticleSystem from "./ParticleSystem";
import XRManager from "./XRManager";
import { SkeletonUtils } from "./SkeletonUtils";
import { LightProbeGenerator } from "./LightProbeGenerator";

const audioLoader = new THREE.AudioLoader();

var APP = {
  Player: function () {
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.domElement.style.overflow = "hidden";

    this.getRenderer = () => {
      return renderer;
    };

    var loader = new THREE.ObjectLoader();
    var camera, scene;
    const game = {};

    game.mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    game.renderStack = [];
    game.vr = XRManager;

    game.SkeletonUtils = SkeletonUtils;
    game.LightProbeGenerator = LightProbeGenerator;
    game.handleOrientation = (event) => {
      //Creo esta variables para la rotacion
      let GAMMA, ALPHA, BETA;

      //Ajusto la rotacion
      GAMMA = event.gamma + 90;
      ALPHA = event.alpha;
      BETA = event.beta;

      //Arreglo problema de rotacion de la camara
      if (GAMMA < 90) {
        GAMMA += 180;
        ALPHA -= 180;
        BETA += 180;
        BETA = -Math.abs(BETA);
      }

      //Aplico estos valores a la camara
      camera.rotation.x = THREE.Math.degToRad(GAMMA);
      camera.rotation.y = THREE.Math.degToRad(ALPHA);
      camera.rotation.z = THREE.Math.degToRad(BETA);
    };

    game.startPhoneVr = ({ player = this, invert = false }) => {
      camera.rotation.order = "YXZ";

      if (
        window.DeviceMotionEvent &&
        typeof window.DeviceMotionEvent.requestPermission === "function"
      ) {
        window.DeviceMotionEvent.requestPermission();
      }

      window.addEventListener("deviceorientation", game.handleOrientation);

      const stereoEffect = new StereoEffect(renderer);

      stereoEffect.setEyeSeparation(0.064);

      game.renderStack.push(stereoEffect);
      camera.fov = 95;

      game.phonevr.session = true;

      openFullscreen(renderer.domElement.parentElement);

      if (scene.externalData && scene.externalData.onphonevrstart) {
        scene.externalData.onphonevrstart();
      }

      //VR cursor

      const vrCursorGeometry = new THREE.PlaneGeometry(0.6, 0.6, 1);
      const vrCursorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        depthTest: false,
      });
      const vrCursor = new THREE.Mesh(vrCursorGeometry, vrCursorMaterial);
      vrCursor.name = "vrCursor";
      vrCursor.position.z = -10;
      vrCursor.depthWrite = false;

      //...

      camera.add(vrCursor);
    };

    game.stopPhoneVr = ({ player = this }) => {
      window.removeEventListener("deviceorientation", game.handleOrientation);

      camera.rotation.z = 0;
      camera.rotation.x = 0;
      camera.rotation.y = 0;

      game.renderStack = [];
      player.setSize(
        renderer.domElement.clientWidth,
        renderer.domElement.clientHeight
      );
      //Vr cursor
      const vrCursor = player.getScene().getObjectByName("vrCursor");
      vrCursor.parent.remove(vrCursor);
      //
      game.phonevr.session = false;
      closeFullscreen();

      if (scene.externalData && scene.externalData.onphonevrend) {
        scene.externalData.onphonevrend();
      }
    };

    function checkIfHasDeviceMotionEvent() {
      if (
        window.DeviceMotionEvent &&
        typeof window.DeviceMotionEvent.requestPermission === "function"
      ) {
        return true;
      } else {
        return false;
      }
    }

    game.phonevr = {
      isEnabled: checkIfHasDeviceMotionEvent(),
      session: false,
      start: ({ renderer = renderer, camera = camera, player = this }) => {
        game.startPhoneVr({ renderer, camera, player });
      },
      stop: ({ renderer = renderer, camera = camera, player = this }) => {
        game.stopPhoneVr({ renderer, camera, player });
      },
    };

    let audio;

    let events = {};

    var dom = document.createElement("div");
    dom.appendChild(renderer.domElement);

    this.dom = dom;
    this.debug = false;

    this.width = 500;
    this.height = 500;

    this.load = function (json, data) {
      var project = json.project;

      if (project.vr !== undefined) renderer.xr.enabled = project.vr;
      if (project.shadows !== undefined)
        renderer.shadowMap.enabled = project.shadows;
      if (project.shadowType !== undefined)
        renderer.shadowMap.type = project.shadowType;
      if (project.toneMapping !== undefined)
        renderer.toneMapping = project.toneMapping;
      if (project.toneMappingExposure !== undefined)
        renderer.toneMappingExposure = project.toneMappingExposure;
      if (project.physicallyCorrectLights !== undefined)
        renderer.physicallyCorrectLights = project.physicallyCorrectLights;

      this.setScene(loader.parse(json.scene));
      this.setCamera(loader.parse(json.camera));
      scene.externalData = data;
      this.debug = data.stats || false;

      //Audio

      audio = json.audio;
      // create an AudioListener and add it to the camera
      const listener = new THREE.AudioListener();
      camera.add(listener);

      scene.audio = [];

      scene.onAudioLoad = function () {};
      let audioLeftToImport = Object.keys(audio).length;

      for (const key in audio) {
        if (Object.hasOwnProperty.call(audio, key)) {
          // create a global audio source
          const sound = new THREE.Audio(listener);

          const audioBase64 = audio[key];
          audioLoader.load(audioBase64, function (buffer) {
            sound.setBuffer(buffer);
            sound.name = key;
            scene.audio[key] = sound;
            scene.add(sound);
            audioLeftToImport -= 1;
            if (audioLeftToImport == 0) {
              if (scene.onAudioLoad) {
                scene.onAudioLoad();
              }
            }
          });
        }
      }

      //Particles

      scene.particles = json.particles;

      //Mouse

      game.ParticleSystem = ParticleSystem;

      scene.intersectObjectsVR = [];

      game.raycast = (menuButtons) => {
        if (!game.vr.currentSession) {
          raycaster.setFromCamera(game.mouse, camera);
          return raycaster.intersectObjects(menuButtons, true);
        } else {
          scene.intersectObjectsVR = menuButtons;
          const intersects = game.vr.checkVRClick({
            controller: game.vr.controllers[0].control,
            objects: menuButtons,
          });

          return intersects;
        }
      };

      this.resetEvents = function () {
        const newEventsObject = {
          init: [],
          start: [],
          stop: [],
          keydown: [],
          keyup: [],
          pointerdown: [],
          pointerup: [],
          pointermove: [],
          mousedown: [],
          mouseup: [],
          mousemove: [],
          touchstart: [],
          touchend: [],
          touchmove: [],
          update: [],
        };

        events = { ...newEventsObject };
      };

      this.resetEvents();

      this.getEvents = () => {
        return events;
      };

      var scriptWrapParams = "player,renderer,scene,camera,THREE,game";
      var scriptWrapResultObj = {};

      for (var eventKey in events) {
        scriptWrapParams += "," + eventKey;
        scriptWrapResultObj[eventKey] = eventKey;
      }

      var scriptWrapResult = JSON.stringify(scriptWrapResultObj).replace(
        /\"/g,
        ""
      );

      // if (
      //   json.scripts["00000000-0000-0000-0000-000000000000"].length &&
      //   json.scripts["00000000-0000-0000-0000-000000000000"][0].name !==
      //     "StateMachine"
      // ) {
      //   json.scripts["00000000-0000-0000-0000-000000000000"].unshift({
      //     name: "StateMachine",
      //     source: StateMachine,
      //   });
      // }

      if (
        json.scripts["00000000-0000-0000-0000-000000000000"].length &&
        json.scripts["00000000-0000-0000-0000-000000000000"][0].name !==
          "animationMixer"
      ) {
        json.scripts["00000000-0000-0000-0000-000000000000"].unshift({
          name: "animationMixer",
          source: startAnimationSystem,
        });
      }

      for (var uuid in json.scripts) {
        var object = scene.getObjectByProperty("uuid", uuid, true);

        if (object === undefined) {
          console.warn("APP.Player: Script without object.", uuid);
          continue;
        }

        var scripts = json.scripts[uuid];

        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];

          var functions = new Function(
            scriptWrapParams,
            script.source + "\nreturn " + scriptWrapResult + ";"
          ).bind(object)(this, renderer, scene, camera, THREE, game);

          for (var name in functions) {
            if (functions[name] === undefined) continue;

            if (events[name] === undefined) {
              console.warn("APP.Player: Event type not supported (", name, ")");
              continue;
            }

            events[name].push(functions[name].bind(object));
          }
        }
      }

      dispatch(events.init, arguments);
    };

    this.setCamera = function (value) {
      camera = value;
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
    };

    this.getCamera = () => {
      return camera;
    };

    this.setScene = function (value) {
      scene = value;
    };

    this.getScene = () => {
      return scene;
    };

    this.getGame = () => {
      return game;
    };

    this.setSize = function (width, height) {
      this.width = width;
      this.height = height;

      if (camera) {
        camera.aspect = this.width / this.height;
        camera.updateProjectionMatrix();
      }

      if (renderer) {
        renderer.setSize(width, height);
      }
    };

    function dispatch(array, event) {
      if (array) {
        for (var i = 0, l = array.length; i < l; i++) {
          array[i](event);
        }
      }
    }

    var time, prevTime;

    function animate(player) {
      if (player.debug) {
        player.stats.begin();
      }

      time = performance.now();

      try {
        dispatch(events.update, { time: time, delta: time - prevTime });
      } catch (e) {
        console.error(e.message || e, e.stack || "");
      }

      if (game.renderStack && game.renderStack.length > 0) {
        for (let ii = 0; ii < game.renderStack.length; ii++) {
          const effect = game.renderStack[ii];

          if (effect.customMade) {
            effect.render();
          } else {
            effect.render(scene, camera);
          }
        }
      } else {
        renderer.render(scene, camera);
      }

      prevTime = time;
      if (player.debug) {
        player.stats.end();
      }
    }

    this.play = function ({ data = {} }) {
      this.debug = data.stats || false;
      if (!this.getScene().externalData) {
        this.getScene().externalData = data;
      }

      if (this.debug) {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
      }

      prevTime = performance.now();

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("pointerup", onPointerUp);
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);

      dispatch(events.start, arguments);

      renderer.setAnimationLoop(() => {
        animate(this);
      });
    };

    this.stop = function () {
      console.log("%c Stoping game...", "color: red; font-size: 10px");

      renderer.setAnimationLoop(null);

      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);

      dispatch(events.stop, arguments);

      if (this.debug) {
        if (this.stats && this.stats.dom && this.stats.dom.parentElement) {
          this.stats.dom.parentElement.removeChild(this.stats.dom);
        }
      }
      //Stop Audios

      for (const childIndex in scene.children) {
        if (Object.hasOwnProperty.call(scene.children, childIndex)) {
          const child = scene.children[childIndex];
          child.traverse((item) => {
            if (item && item.dispose) {
              item.dispose();
            }
          });
        }
      }
      this.resetEvents();
    };

    this.dispose = function () {
      renderer.dispose();

      camera = undefined;
      scene = undefined;
    };

    function onKeyDown(event) {
      dispatch(events.keydown, event);
    }

    function onKeyUp(event) {
      dispatch(events.keyup, event);
    }

    function onPointerDown(event) {
      dispatch(events.pointerdown, event);
    }

    function onPointerUp(event) {
      dispatch(events.pointerup, event);
    }

    function onPointerMove(event) {
      dispatch(events.pointermove, event);
    }

    function onMouseDown(event) {
      dispatch(events.mousedown, event);
    }

    function onMouseUp(event) {
      dispatch(events.mouseup, event);
    }

    function onMouseMove(event) {
      dispatch(events.mousemove, event);
    }

    function onTouchStart(event) {
      dispatch(events.touchstart, event);
    }

    function onTouchEnd(event) {
      dispatch(events.touchend, event);
    }

    function onTouchMove(event) {
      dispatch(events.touchmove, event);
    }
  },
};

const startAnimationSystem = `
//State machine

scene.state = null;
scene.states = {};
scene.createState = ({
  name,
  update = (e) => {},
  pointermove = (e) => {},
  pointerdown = (e) => {},
  pointerup = (e) => {},
  mousedown = (e) => {},
  mouseup = (e) => {},
  mousemove = (e) => {},
  touchstart = (e) => {},
  touchend = (e) => {},
  touchmove = (e) => {},
  keydown = (e) => {},
  keyup = (e) => {},
  onchange = (e) => {},
  onstart = (e) => {},
  pointerdownVR = (e) => {},
  pointerupVR = (e) => {},
  updateVR = (e) => {},
}) => {
  if (name) {
    this.states[name] = {
      update,
      pointermove,
      pointerdown,
      pointerup,
      keydown,
      keyup,
      onstart,
      onchange,
      pointerdownVR,
      pointerupVR,
      updateVR,
      mousedown,
      mouseup,
      mousemove,
      touchstart,
      touchend,
      touchmove,
    };
  } else {
    console.error("You must put a name to the State");
  }
};

scene.changeState = (state) => {
  if (state && this.states[this.state]) {
    if (this.states[this.state].onchange) {
      this.states[this.state].onchange();
    }
  }

  if (this.states[state].onstart) {
    this.states[state].onstart();
    if (this.states[state] && game.vr.currentSession) {
      this.states[state].pointerdown("SYNTHETIC");
    }
  }

  this.state = state;
};

scene.createState({
  name: "init",
});

scene.changeState("init");

//Animation
scene.animationMixers = {};

scene.traverse((item) => {
  if (item.animations.length > 0) {
    scene.animationMixers[item.name] = {
      mixer: new THREE.AnimationMixer(item),
      animations: item.animations,
    };
  }
});

scene.getAnimation = function (ObjectName, ClipName) {
  let match = null;

  for (
    let i = 0;
    i < scene.animationMixers[ObjectName].animations.length;
    i++
  ) {
    const currentClip = scene.animationMixers[ObjectName].animations[i];

    if (ClipName === currentClip.name) {
      match = currentClip;
    }
  }

  if (match) {
    return scene.animationMixers[ObjectName].mixer.clipAction(match);
  } else {
    console.error("This animation clip doesn't exist: " + ClipName);
  }
};

function getAllAnimations(rig, looping = THREE.LoopOnce) {
  const Rig = scene.getObjectByName(rig);
  const animations = {};
  scene.animationMixers[rig].animations = Rig.animations;

  for (let i = 0; i < Rig.animations.length; i++) {
    const animation = Rig.animations[i];
    const clip = scene.getAnimation(rig, animation.name);

    clip.setLoop(looping);
    clip.clampWhenFinished = true;

    animations[animation.name] = clip;
  }

  return animations;
}

scene.getAllAnimations = getAllAnimations;

function update(e) {
  const { delta } = e;

  for (let mixerName in scene.animationMixers) {
    const mixer = scene.animationMixers[mixerName].mixer;
    mixer.update(delta / 1000);
  }

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    }
  }

  scene.states[scene.state].update(e);
  if (game.vr.currentSession) {
    scene.states[scene.state].updateVR(e);
  }
}
function mousemove(e) {
  const { offsetX, offsetY } = e;

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].mousemove(e);
}

function mousedown(e) {
  const { offsetX, offsetY } = e;

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].mousedown(e);
}

function mouseup(e) {
  scene.states[scene.state].mouseup(e);
}

function touchmove(e) {
  const { offsetX, offsetY } = e.targetTouches[0];

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].touchmove(e);
}

function touchstart(e) {
  const { offsetX, offsetY } = e.targetTouches[0];

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].touchstart(e);
}

function touchend(e) {
  scene.states[scene.state].touchend(e);
}

function pointermove(e) {
  const { offsetX, offsetY } = e;

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].pointermove(e);
}

function pointerdown(e) {
  const { offsetX, offsetY } = e;

  if (game.mouse) {
    if (game.phonevr.session) {
      game.mouse.x = 0;
      game.mouse.y = 0;
    } else {
      game.mouse.x = (offsetX / player.width) * 2 - 1;
      game.mouse.y = -(offsetY / player.height) * 2 + 1;
    }
  }
  scene.states[scene.state].pointerdown(e);
}

function pointerup(e) {
  scene.states[scene.state].pointerup(e);
}

function keydown(e) {
  scene.states[scene.state].keydown(e);
}

function keyup(e) {
  scene.states[scene.state].keyup(e);
}


  `;

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}
export { APP };
