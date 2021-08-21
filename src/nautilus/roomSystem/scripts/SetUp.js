// Hitbox unreveal
const HitBox = scene.getObjectByName("HitBox");
HitBox.visible = false;

console.log("Scene", scene);

// camera setup
camera.position.set(0, 1.96, 2000);
camera.rotation.set(0, 0, 0);
camera.fov = 0.22;
camera.near = 1500;
camera.far = 2015;

camera.updateProjectionMatrix();

console.log(camera);

// Light setup
const point = scene.getObjectByName("Point");
const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(point.position);
scene.add(light);

////// Group for model rotation
const RotacionIsometrica = new THREE.Group();

RotacionIsometrica.rotation.x = THREE.MathUtils.degToRad(-30);
RotacionIsometrica.rotation.y = THREE.MathUtils.degToRad(-45);
RotacionIsometrica.rotation.z = THREE.MathUtils.degToRad(0);

RotacionIsometrica.rotation.order = "ZYX";
RotacionIsometrica.name = "RotacionIsometrica";

//////

const RotacionVertical = new THREE.Group();
RotacionVertical.name = "RotacionVertical";

//////

scene.add(RotacionVertical);
RotacionVertical.add(RotacionIsometrica);
RotacionIsometrica.add(camera);

////

renderer.setClearColor(0x000000, 0); // the default
