import * as THREE from "three";

import "./style.css";

import Input from "./core/Input.js";
import Car from "./cars/Car.js";
import Road from "./world/Road.js";
import City from "./world/City.js";


// ==========================================
// LOADING SCREEN
// ==========================================

const loadingScreen =
    document.createElement("div");

loadingScreen.id =
    "aurelis-loading";


loadingScreen.innerHTML = `

    <div class="loading-content">

        <div class="loading-brand">
            AURELIS
        </div>

        <div class="loading-line"></div>

        <div class="loading-tagline">
            OWN THE ROAD
        </div>

        <div class="loading-status">
            INITIALIZING EXPERIENCE
        </div>

        <div class="loading-bar">

            <div
                class="loading-progress"
                id="loading-progress"
            ></div>

        </div>

        <div
            class="loading-percent"
            id="loading-percent"
        >
            0%
        </div>

    </div>

`;


document.body.innerHTML = "";

document.body.appendChild(
    loadingScreen
);


// ==========================================
// LOADING ELEMENTS
// ==========================================

const loadingProgress =
    document.getElementById(
        "loading-progress"
    );


const loadingPercent =
    document.getElementById(
        "loading-percent"
    );


function updateLoading(percent) {

    const value =
        Math.round(percent);


    loadingProgress.style.width =
        `${value}%`;


    loadingPercent.textContent =
        `${value}%`;

}


// ==========================================
// SCENE
// ==========================================

const scene =
    new THREE.Scene();


// ==========================================
// AURELIS SKY
// ==========================================

const skyColor =
    0x78b9e6;


scene.background =
    new THREE.Color(
        skyColor
    );


// ==========================================
// ATMOSPHERIC FOG
// ==========================================

scene.fog =
    new THREE.Fog(
        skyColor,
        180,
        850
    );


// ==========================================
// CAMERA
// ==========================================

const camera =
    new THREE.PerspectiveCamera(

        60,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1500

    );


// Initial temporary position.
// It will be immediately synchronized
// with the car before the game starts.

camera.position.set(
    0,
    3.8,
    7
);


// ==========================================
// RENDERER
// ==========================================

const renderer =
    new THREE.WebGLRenderer({

        antialias: true

    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


// ==========================================
// COLOR MANAGEMENT
// ==========================================

renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.05;


// ==========================================
// SHADOWS
// ==========================================

renderer.shadowMap.enabled =
    true;


renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


// ==========================================
// WORLD GROUND
// ==========================================

const groundGeometry =
    new THREE.PlaneGeometry(
        5000,
        5000
    );


const groundMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x70583f,

        roughness: 1,

        metalness: 0

    });


const ground =
    new THREE.Mesh(

        groundGeometry,

        groundMaterial

    );


ground.rotation.x =
    -Math.PI / 2;


// ==========================================
// KEEP GROUND BELOW ROAD
// ==========================================

ground.position.y =
    -1.0;


ground.receiveShadow =
    true;


scene.add(
    ground
);


// ==========================================
// LIGHTING
// ==========================================

const sunlight =
    new THREE.DirectionalLight(

        0xfff4dc,

        3

    );


sunlight.position.set(

    80,

    120,

    60

);


sunlight.castShadow =
    true;


// ==========================================
// SUN SHADOW QUALITY
// ==========================================

sunlight.shadow.mapSize.width =
    2048;


sunlight.shadow.mapSize.height =
    2048;


sunlight.shadow.camera.near =
    1;


sunlight.shadow.camera.far =
    300;


sunlight.shadow.camera.left =
    -120;


sunlight.shadow.camera.right =
    120;


sunlight.shadow.camera.top =
    120;


sunlight.shadow.camera.bottom =
    -120;


sunlight.shadow.bias =
    -0.0001;


scene.add(
    sunlight
);


// ==========================================
// AMBIENT LIGHT
// ==========================================

const ambientLight =
    new THREE.AmbientLight(

        0xffffff,

        0.85

    );


scene.add(
    ambientLight
);


// ==========================================
// HEMISPHERE LIGHT
// ==========================================

const hemisphereLight =
    new THREE.HemisphereLight(

        0x9ed8ff,

        0x506040,

        1.15

    );


scene.add(
    hemisphereLight
);


// ==========================================
// WORLD
// ==========================================

const road =
    new Road(
        scene
    );


const city =
    new City(
        scene,
        road
    );


// ==========================================
// INPUT
// ==========================================

const input =
    new Input();


// ==========================================
// PLAYER CAR
// ==========================================

const car =
    new Car(

        scene,

        road

    );


// ==========================================
// CAMERA DYNAMICS
// ==========================================

let cameraSideOffset =
    0;


let cameraHeightOffset =
    0;


let cameraDistanceOffset =
    0;


// ==========================================
// CAMERA SETTINGS
// ==========================================

const baseCameraHeight =
    3.8;


const baseCameraDistance =
    7;


// Camera follows faster than before.

const cameraFollowSpeed =
    0.32;


// Camera rotation follows quickly.

const cameraLookSpeed =
    0.28;


// ==========================================
// SYNCHRONIZE CAMERA WITH CAR
// ==========================================

function syncCameraToCar() {

    const cameraOffset =
        new THREE.Vector3(

            0,
            baseCameraHeight,
            baseCameraDistance

        );


    cameraOffset.applyQuaternion(
        car.mesh.quaternion
    );


    cameraOffset.add(
        car.mesh.position
    );


    camera.position.copy(
        cameraOffset
    );


    const lookTarget =
        car.mesh.position.clone();


    lookTarget.y +=
        1.1;


    const initialLookAhead =
        new THREE.Vector3(

            0,
            0,
            -5

        );


    initialLookAhead.applyQuaternion(
        car.mesh.quaternion
    );


    lookTarget.add(
        initialLookAhead
    );


    camera.lookAt(
        lookTarget
    );

}


// ==========================================
// START GAME
// ==========================================

function startGame() {

    document.body.appendChild(
        renderer.domElement
    );


    // IMPORTANT:
    // Put camera behind car BEFORE
    // the first rendered frame.

    syncCameraToCar();


    updateLoading(
        100
    );


    loadingScreen.classList.add(
        "loading-finished"
    );


    setTimeout(

        () => {

            loadingScreen.remove();

            // Synchronize one more time
            // immediately before animation.

            syncCameraToCar();

            animate();

        },

        700

    );

}


// ==========================================
// INITIALIZE GAME
// ==========================================

async function initializeGame() {

    try {

        console.log(
            "Loading AURELIS environment..."
        );


        updateLoading(
            10
        );


        updateLoading(
            20
        );


        await city
            .buildingSystem
            .ready;


        updateLoading(
            55
        );


        await city
            .treeSystem
            .ready;


        updateLoading(
            85
        );


        await new Promise(

            (resolve) => {

                setTimeout(

                    resolve,

                    100

                );

            }

        );


        updateLoading(
            95
        );


        console.log(
            "Environment loaded."
        );


        startGame();


    }

    catch (error) {

        console.error(

            "AURELIS initialization failed:",

            error

        );


        loadingScreen.innerHTML = `

            <div class="loading-content">

                <div class="loading-brand">
                    AURELIS
                </div>

                <div class="loading-status">
                    FAILED TO LOAD
                </div>

                <div class="loading-error">
                    Please refresh the page.
                </div>

            </div>

        `;

    }

}


// ==========================================
// ANIMATION
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );


    // ======================================
    // UPDATE CAR
    // ======================================

    car.update(
        input
    );


    // ======================================
    // SPEED RATIO
    // ======================================

    const speedRatio =
        THREE.MathUtils.clamp(

            Math.abs(car.speed) /
            car.maxSpeed,

            0,

            1

        );


    // ======================================
    // STEERING VALUE
    // ======================================

    const steering =
        car.steeringInput || 0;


    // ======================================
    // CAMERA EFFECTS
    // ======================================

    // Slightly move camera farther back
    // at high speed, but not excessively.

    const targetDistanceOffset =
        speedRatio *
        0.65;


    cameraDistanceOffset =
        THREE.MathUtils.lerp(

            cameraDistanceOffset,

            targetDistanceOffset,

            0.18

        );


    // ======================================
    // TURN CAMERA SIDE MOVEMENT
    // ======================================

    const targetSideOffset =
        -steering *
        speedRatio *
        0.65;


    cameraSideOffset =
        THREE.MathUtils.lerp(

            cameraSideOffset,

            targetSideOffset,

            0.18

        );


    // ======================================
    // SPEED HEIGHT EFFECT
    // ======================================

    const targetHeightOffset =
        speedRatio *
        0.15;


    cameraHeightOffset =
        THREE.MathUtils.lerp(

            cameraHeightOffset,

            targetHeightOffset,

            0.18

        );


    // ======================================
    // CAMERA OFFSET
    // ======================================

    const cameraOffset =
        new THREE.Vector3(

            cameraSideOffset,

            baseCameraHeight +
            cameraHeightOffset,

            baseCameraDistance +
            cameraDistanceOffset

        );


    // ======================================
    // ROTATE OFFSET WITH CAR
    // ======================================

    const desiredCameraPosition =
        cameraOffset.clone();


    desiredCameraPosition.applyQuaternion(

        car.mesh.quaternion

    );


    desiredCameraPosition.add(

        car.mesh.position

    );


    // ======================================
    // CAMERA FOLLOW
    // ======================================

    // Much faster than the old 0.18.
    // This keeps the car locked into the
    // camera instead of letting it escape.

    camera.position.lerp(

        desiredCameraPosition,

        cameraFollowSpeed

    );


    // ======================================
    // LOOK TARGET
    // ======================================

    const lookTarget =
        car.mesh.position.clone();


    lookTarget.y +=
        1.1;


    // ======================================
    // LOOK AHEAD
    // ======================================

    const lookAheadDistance =
        5 +
        speedRatio *
        2.5;


    const lookAhead =
        new THREE.Vector3(

            0,

            0,

            -lookAheadDistance

        );


    lookAhead.applyQuaternion(

        car.mesh.quaternion

    );


    lookTarget.add(

        lookAhead

    );


    // ======================================
    // TURN LOOK EFFECT
    // ======================================

    lookTarget.x +=

        steering *
        speedRatio *
        0.9;


    // ======================================
    // SMOOTH CAMERA LOOK
    // ======================================

    // Instead of instantly snapping the
    // camera rotation, smoothly approach
    // the desired direction.

    const currentLookTarget =
        new THREE.Vector3();


    camera.getWorldDirection(
        currentLookTarget
    );


    const desiredDirection =
        lookTarget.clone()
            .sub(camera.position)
            .normalize();


    currentLookTarget.lerp(
        desiredDirection,
        cameraLookSpeed
    );


    const smoothLookPosition =
        camera.position.clone()
            .add(
                currentLookTarget.multiplyScalar(10)
            );


    camera.lookAt(
        smoothLookPosition
    );


    // ======================================
    // SPEED FOV
    // ======================================

    const targetFOV =
        60 +
        speedRatio *
        10;


    camera.fov =
        THREE.MathUtils.lerp(

            camera.fov,

            targetFOV,

            0.12

        );


    camera.updateProjectionMatrix();


    // ======================================
    // RENDER
    // ======================================

    renderer.render(

        scene,

        camera

    );

}


// ==========================================
// RESPONSIVE
// ==========================================

window.addEventListener(

    "resize",

    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

);


// ==========================================
// START INITIALIZATION
// ==========================================

initializeGame();