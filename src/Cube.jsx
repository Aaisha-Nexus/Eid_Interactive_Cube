import * as THREE from "three";  
import { useEffect, useRef } from "react";
import createCamera from "./Camera";

function Cube() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = createCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    // --------- CUBE FACES ---------
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid1.jpeg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid2.jpeg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid3.jpeg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid4.jpeg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid5.jpeg") }),
      new THREE.MeshBasicMaterial({ map: loader.load("/images/eid6.jpeg") })
    ];

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // group to rotate cube + lid together
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    // main cube
    const cube = new THREE.Mesh(cubeGeometry, materials);
    boxGroup.add(cube);

    // --------- LID ---------
    const hinge = new THREE.Object3D();
    hinge.position.set(0, 0.5, -0.5);
    boxGroup.add(hinge);

    const lidGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const lidMaterial = new THREE.MeshBasicMaterial({ color: 0xff1493 });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 0, 0.5);
    hinge.add(lid);

    // outer lid image
    const outerTexture = loader.load("/images/money.jpeg");
    const outerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: outerTexture })
    );
    outerMesh.position.set(0, 0.051, 0);
    outerMesh.rotation.x = -Math.PI / 2;
    lid.add(outerMesh);

    // inner lid image
    const innerTexture = loader.load("/images/lighting.jpeg");
    const innerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: innerTexture })
    );
    innerMesh.position.set(0, -0.051, 0);
    innerMesh.rotation.x = Math.PI / 2;
    lid.add(innerMesh);

    // --------- CONFETTI ---------
    const confetti = [];
    const confettiGeo = new THREE.BoxGeometry(0.03, 0.01, 0.03);
    for (let i = 0; i < 80; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
      const particle = new THREE.Mesh(confettiGeo, mat);
      particle.visible = false;
      scene.add(particle);
      confetti.push({ mesh: particle, velocity: new THREE.Vector3() });
    }

    let clicked = false;

    // --------- EID MUBARAK TEXT ---------
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = "#ff69b4"; // pink color
    context.font = "bold 80px Arial";
    context.textAlign = "center";
    context.fillText("Eid Mubarak", 256, 150);

    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true
    });
    const textGeometry = new THREE.PlaneGeometry(2, 0.9);
    const eidText = new THREE.Mesh(textGeometry, textMaterial);
    eidText.position.set(0, 0.6, 0); // start slightly above cube
    eidText.visible = false;
    scene.add(eidText);

    // --------- CLICK EVENT ---------
    window.addEventListener("click", () => {
      clicked = true;
      eidText.visible = true;

      confetti.forEach((c) => {
        c.mesh.visible = true;
        c.mesh.position.set(0, 0.6, 0);
        c.velocity.set(
          (Math.random() - 0.5) * 0.03,
          Math.random() * 0.05,
          (Math.random() - 0.5) * 0.03
        );
      });
    });

    // --------- ANIMATION LOOP ---------
    const animate = () => {
      requestAnimationFrame(animate);

      // lid opening
      if (clicked && hinge.rotation.x > -1.5) hinge.rotation.x -= 0.008;

      // confetti movement
      if (clicked) {
        confetti.forEach((c) => {
          c.mesh.position.add(c.velocity);
          c.velocity.y -= 0.0015; // gravity
        });

        // slow cube rotation to see all faces
        boxGroup.rotation.y += 0.005;
      }

      // Eid Mubarak rising
      if (clicked && eidText.position.y < 2.2) eidText.position.y += 0.02;
      eidText.lookAt(camera.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default Cube;