//Horse

sga["RigHorse"]["idle_eating"].play();

scene.animationMixers["RigHorse"].mixer.addEventListener(
  "finished",
  ({ action }) => {
    const animationName = action._clip.name;

    if (animationName == "idle_eating") {
      sga["RigHorse"]["idle_eating"].stop();
      sga["RigHorse"]["walk"].play();
    }

    if (animationName == "walk") {
      sga["RigHorse"]["walk"].stop();
      sga["RigHorse"]["idle_eating"].play();
    }
  }
);
