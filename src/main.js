import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(0, 2, 5)
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00})
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planGeometry = new THREE.PlaneGeometry(20, 20)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planGeometry, planeMaterial)
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(20);
scene.add(gridHelper)

const sphereGeometry = new THREE.SphereGeometry(4, 50,50)
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

sphere.position.set(-10,10,0)
sphere.castShadow = true;
renderer.setClearColor(0xFFEA00)

const gui = new dat.GUI();

const directionalLight = new THREE.DirectionalLight(0xffffff,0.8)
scene.add(directionalLight)
directionalLight.position.set(-30,50,0)
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5)
scene.add(dLightHelper)

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper)

const options = {
    sphereColor : "#ffea00",
    wireframe : false,
    speed : 0.01
};

gui.addColor(options,'sphereColor').onChange(function (e){
    sphere.material.color.set(e);
})

gui.add(options,'wireframe').onChange(function (e){
    sphere.material.wireframe = e;
})

gui.add(options,'speed',0,0.1);


let step = 0;
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step))
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);
