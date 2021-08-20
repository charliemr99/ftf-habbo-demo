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
  scene.states[scene.state].pointermove(e);
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
  scene.states[scene.state].pointerdown(e);
}

function mouseup(e) {
  scene.states[scene.state].pointerup(e);
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
  scene.states[scene.state].pointermove(e);
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
  scene.states[scene.state].pointerdown(e);
}

function touchend(e) {
  scene.states[scene.state].pointerup(e);
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
