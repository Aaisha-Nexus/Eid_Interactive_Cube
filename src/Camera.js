import * as THREE from "three";

function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(2, 1.2, 3); 
  camera.lookAt(0, 0.2, 0);

  return camera;
}

export default createCamera;