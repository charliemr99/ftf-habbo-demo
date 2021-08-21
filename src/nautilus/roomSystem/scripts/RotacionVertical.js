const RotacionVertical = scene.getObjectByName("RotacionVertical");

console.log("RotacionVertical", RotacionVertical);
const HitBox = scene.getObjectByName("HitBox");

//const GameCamera = scene.getObjectByName("GameCamera");
let speed = 0;
const maxSpeed = 0.2;
const force = 0.002;
const sensibility = 0.005;

let rotatingByItself = true;
let rotationCounter = 0;
let mouseClickXCoord = 0;
let mouseClick = false;
let rotationOffset = 0;
const screenSize = { width: player.width, height: player.height };

//player.setCamera(GameCamera);

handleResize();

function update({ time, delta }) {
  if (rotatingByItself) {
    rotationCounter += (delta / 1000) * speed;
  }

  speed += force;
  speed = Math.min(speed, maxSpeed);

  RotacionVertical.rotation.y = rotationCounter;

  handleResize();
}

function pointerdown(e) {
  const { screenX, screenY } = e;

  const clickOnHitBox = game.raycast([HitBox])[0];

  if (clickOnHitBox) {
    mouseClickXCoord = screenX;
    rotatingByItself = false;
    mouseClick = true;
    rotationOffset = rotationCounter;
    speed = 0;
    console.log("✅");
  } else {
    console.log("❌");
  }
}

function pointermove({ screenX }) {
  if (mouseClick) {
    rotationCounter =
      rotationOffset + (mouseClickXCoord - screenX) * sensibility;
  }
}

function pointerup(e) {
  rotatingByItself = true;
  mouseClick = false;
}

function handleResize() {
  if (player.width != screenSize.width || player.height != screenSize.height) {
    if (player.width < player.height * 0.8) {
      camera.fov = 0.4;
      camera.updateProjectionMatrix();
    } else {
      camera.fov = 0.22;
      camera.updateProjectionMatrix();
    }

    screenSize.width = player.width;
    screenSize.height = player.height;
  }
}
