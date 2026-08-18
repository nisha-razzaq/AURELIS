import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


export default class Car {

    constructor(scene, road) {

        this.scene = scene;
        this.road = road;


        // ==========================================
        // CAR GROUP
        // ==========================================

        this.mesh =
            new THREE.Group();

        this.scene.add(
            this.mesh
        );


        // ==========================================
        // ENGINE START SOUND
        // ==========================================

        this.engineSound =
            new Audio("/assets/audio/engine.mp3");

        // IMPORTANT:
        // This is a one-shot sound.
        // It will NOT loop while racing.
        this.engineSound.loop = false;

        this.engineSound.volume = 0.65;

        this.engineSound.preload = "auto";

        this.engineSoundRunning = false;

        this.engineSoundStarting = false;


        // ==========================================
        // START ENGINE SOUND
        // ==========================================

        this.startEngineSound = () => {

            // Prevent duplicate starts
            if (
                this.engineSoundRunning ||
                this.engineSoundStarting
            ) {

                return;

            }


            this.engineSoundStarting = true;


            // Always start from beginning
            this.engineSound.currentTime = 0;


            const playPromise =
                this.engineSound.play();


            if (
                playPromise !== undefined
            ) {

                playPromise
                    .then(() => {

                        this.engineSoundRunning =
                            true;

                        this.engineSoundStarting =
                            false;


                        console.log(
                            "Engine start sound played!"
                        );

                    })
                    .catch((error) => {

                        this.engineSoundRunning =
                            false;

                        this.engineSoundStarting =
                            false;


                        console.warn(
                            "Engine sound could not play:",
                            error
                        );

                    });

            }

        };


        // ==========================================
        // STOP / RESET ENGINE SOUND
        // ==========================================

        this.stopEngineSound = () => {

            this.engineSound.pause();

            this.engineSound.currentTime = 0;


            this.engineSoundRunning =
                false;

            this.engineSoundStarting =
                false;

        };


        // ==========================================
        // USER INTERACTION
        // ==========================================

        this._keyDownHandler =
            (event) => {

                if (
                    event.code === "KeyW" ||
                    event.code === "ArrowUp"
                ) {

                    this.startEngineSound();

                }

            };


        this._keyUpHandler =
            (event) => {

                if (
                    event.code === "KeyW" ||
                    event.code === "ArrowUp"
                ) {

                    this.stopEngineSound();

                }

            };


        document.addEventListener(
            "keydown",
            this._keyDownHandler
        );


        document.addEventListener(
            "keyup",
            this._keyUpHandler
        );


        // ==========================================
        // LOAD CAR MODEL
        // ==========================================

        const loader =
            new GLTFLoader();


        loader.load(

            "/assets/cars/sports_car.glb",

            (gltf) => {

                const carModel =
                    gltf.scene;


                // ======================================
                // AUTO SCALE
                // ======================================

                const box =
                    new THREE.Box3()
                        .setFromObject(
                            carModel
                        );


                const size =
                    box.getSize(
                        new THREE.Vector3()
                    );


                const maxDimension =
                    Math.max(
                        size.x,
                        size.y,
                        size.z
                    );


                const targetSize =
                    4.8;


                const scale =
                    targetSize /
                    maxDimension;


                carModel.scale.setScalar(
                    scale
                );


                // ======================================
                // MODEL ORIENTATION
                // ======================================

                carModel.rotation.y =
                    Math.PI;


                // ======================================
                // CENTER MODEL
                // ======================================

                const centeredBox =
                    new THREE.Box3()
                        .setFromObject(
                            carModel
                        );


                const center =
                    centeredBox.getCenter(
                        new THREE.Vector3()
                    );


                carModel.position.x -=
                    center.x;


                carModel.position.z -=
                    center.z;


                // ======================================
                // PUT CAR ON GROUND
                // ======================================

                const finalBox =
                    new THREE.Box3()
                        .setFromObject(
                            carModel
                        );


                carModel.position.y -=
                    finalBox.min.y;


                // ======================================
                // SHADOWS
                // ======================================

                carModel.traverse(
                    (child) => {

                        if (
                            child.isMesh
                        ) {

                            child.castShadow =
                                true;

                            child.receiveShadow =
                                true;

                        }

                    }
                );


                // ======================================
                // ADD CAR
                // ======================================

                this.mesh.add(
                    carModel
                );


                console.log(
                    "Sports car loaded successfully!"
                );

            },


            // ==========================================
            // LOADING PROGRESS
            // ==========================================

            (progress) => {

                if (
                    progress.total > 0
                ) {

                    const percent =
                        (
                            progress.loaded /
                            progress.total
                        ) * 100;


                    console.log(
                        `Car loading: ${percent.toFixed(0)}%`
                    );

                }

            },


            // ==========================================
            // LOADING ERROR
            // ==========================================

            (error) => {

                console.error(
                    "Error loading car:",
                    error
                );

            }

        );


        // ==========================================
        // INITIAL POSITION
        // ==========================================

        this.mesh.position.set(
            0,
            0,
            20
        );


        // ==========================================
        // DRIVING PHYSICS
        // ==========================================

        this.speed = 0;


        // Maximum speed
        this.maxSpeed =
            2.6;


        // Reverse speed
        this.reverseSpeed =
            0.75;


        // Acceleration
        this.acceleration =
            0.075;


        // Braking
        this.brakePower =
            0.15;


        // ==========================================
        // STEERING
        // ==========================================

        this.turnSpeed =
            0.028;


        // ==========================================
        // ROAD BOUNDARY
        // ==========================================

        this.carHalfWidth =
            1.45;


        this.boundaryMargin =
            0.35;


        // ==========================================
        // STEERING SMOOTHING
        // ==========================================

        this.steeringInput =
            0;


        this.steeringSmoothness =
            0.15;


        // ==========================================
        // EXHAUST SMOKE SYSTEM
        // ==========================================

        this.smokeParticles = [];


        this.smokeGroup =
            new THREE.Group();


        this.mesh.add(
            this.smokeGroup
        );


        // ==========================================
        // SMOKE SETTINGS
        // ==========================================

        this.smokeTimer =
            0;


        this.maxSmokeParticles =
            120;


        // ==========================================
        // EXHAUST POSITIONS
        // ==========================================

        this.leftExhaust =
            new THREE.Vector3(
                -0.72,
                0.45,
                1.85
            );


        this.rightExhaust =
            new THREE.Vector3(
                0.72,
                0.45,
                1.85
            );


        // ==========================================
        // SMOKE MATERIAL
        // ==========================================

        this.smokeMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x777777,

                transparent: true,

                opacity: 0.38,

                depthWrite: false

            });


        // ==========================================
        // SMOKE GEOMETRY
        // ==========================================

        this.smokeGeometry =
            new THREE.SphereGeometry(
                0.16,
                8,
                8
            );

    }


    // ==========================================
    // GET ROAD CENTER
    // ==========================================

    getRoadCenterX(z) {

        if (
            this.road &&
            typeof this.road.getCenterX ===
            "function"
        ) {

            return this.road.getCenterX(z);

        }


        if (
            this.road &&
            typeof this.road.getRoadCenterX ===
            "function"
        ) {

            return this.road.getRoadCenterX(z);

        }


        return 0;

    }


    // ==========================================
    // GET ROAD WIDTH
    // ==========================================

    getRoadWidth() {

        if (
            this.road &&
            typeof this.road.roadWidth ===
            "number"
        ) {

            return this.road.roadWidth;

        }


        return 14;

    }


    // ==========================================
    // ROAD BOUNDARY
    // ==========================================

    checkRoadBoundary() {

        if (!this.road) {

            return;

        }


        const roadWidth =
            this.getRoadWidth();


        const roadCenterX =
            this.getRoadCenterX(
                this.mesh.position.z
            );


        const halfRoad =
            roadWidth / 2;


        const leftEdge =
            roadCenterX -
            halfRoad;


        const rightEdge =
            roadCenterX +
            halfRoad;


        const leftLimit =
            leftEdge +
            this.carHalfWidth +
            this.boundaryMargin;


        const rightLimit =
            rightEdge -
            this.carHalfWidth -
            this.boundaryMargin;


        if (
            this.mesh.position.x <
            leftLimit
        ) {

            this.mesh.position.x =
                leftLimit;

        }


        if (
            this.mesh.position.x >
            rightLimit
        ) {

            this.mesh.position.x =
                rightLimit;

        }

    }


    // ==========================================
    // CREATE SMOKE PARTICLE
    // ==========================================

    createSmokeParticle(
        exhaustPosition
    ) {

        if (
            this.smokeParticles.length >=
            this.maxSmokeParticles
        ) {

            return;

        }


        const particle =
            new THREE.Mesh(

                this.smokeGeometry,

                this.smokeMaterial.clone()

            );


        particle.position.copy(
            exhaustPosition
        );


        particle.position.x +=
            THREE.MathUtils.randFloat(
                -0.08,
                0.08
            );


        particle.position.y +=
            THREE.MathUtils.randFloat(
                -0.03,
                0.08
            );


        particle.position.z +=
            THREE.MathUtils.randFloat(
                -0.05,
                0.05
            );


        const initialScale =
            THREE.MathUtils.randFloat(
                0.65,
                1.0
            );


        particle.scale.setScalar(
            initialScale
        );


        particle.userData.life =
            0;


        particle.userData.maxLife =
            THREE.MathUtils.randFloat(
                0.7,
                1.2
            );


        particle.userData.velocity =
            new THREE.Vector3(

                THREE.MathUtils.randFloat(
                    -0.18,
                    0.18
                ),

                THREE.MathUtils.randFloat(
                    0.18,
                    0.35
                ),

                THREE.MathUtils.randFloat(
                    0.12,
                    0.30
                )

            );


        this.smokeGroup.add(
            particle
        );


        this.smokeParticles.push(
            particle
        );

    }


    // ==========================================
    // UPDATE SMOKE
    // ==========================================

    updateSmoke(
        deltaTime,
        engineRunning
    ) {

        if (
            engineRunning &&
            this.speed > 0.08
        ) {

            this.smokeTimer +=
                deltaTime;


            const speedRatio =
                THREE.MathUtils.clamp(

                    this.speed /
                    this.maxSpeed,

                    0,
                    1

                );


            const interval =
                THREE.MathUtils.lerp(

                    0.065,

                    0.022,

                    speedRatio

                );


            if (
                this.smokeTimer >=
                interval
            ) {

                this.smokeTimer = 0;


                this.createSmokeParticle(
                    this.leftExhaust
                );


                this.createSmokeParticle(
                    this.rightExhaust
                );

            }

        }

        else {

            this.smokeTimer = 0;

        }


        // ======================================
        // UPDATE EXISTING PARTICLES
        // ======================================

        for (
            let i =
                this.smokeParticles.length - 1;

            i >= 0;

            i--
        ) {

            const particle =
                this.smokeParticles[i];


            particle.userData.life +=
                deltaTime;


            const life =
                particle.userData.life;


            const maxLife =
                particle.userData.maxLife;


            const progress =
                life /
                maxLife;


            particle.position.addScaledVector(

                particle.userData.velocity,

                deltaTime

            );


            particle.scale.multiplyScalar(

                1 +
                deltaTime * 2.2

            );


            particle.material.opacity =
                0.38 *
                Math.max(
                    0,
                    1 - progress
                );


            if (
                progress >= 1
            ) {

                this.smokeGroup.remove(
                    particle
                );


                particle.material.dispose();


                this.smokeParticles.splice(
                    i,
                    1
                );

            }

        }

    }


    // ==========================================
    // UPDATE
    // ==========================================

    update(input) {

        const now =
            performance.now();


        const deltaTime =
            Math.min(

                0.05,

                this._lastTime

                    ?

                    (
                        now -
                        this._lastTime
                    ) / 1000

                    :

                    0.016

            );


        this._lastTime =
            now;


        // ======================================
        // FORWARD
        // ======================================

        if (
            input.keys.forward
        ) {

            this.speed +=
                this.acceleration;

        }


        // ======================================
        // BACKWARD / REVERSE
        // ======================================

        else if (
            input.keys.backward
        ) {

            if (
                this.speed > 0
            ) {

                this.speed -=
                    this.brakePower;

            }

            else {

                this.speed -=
                    this.acceleration *
                    0.75;

            }

        }


        // ======================================
        // NO BUTTON = IMMEDIATE STOP
        // ======================================

        else {

            this.speed = 0;

        }


        // ======================================
        // SPEED LIMIT
        // ======================================

        this.speed =
            THREE.MathUtils.clamp(

                this.speed,

                -this.reverseSpeed,
                this.maxSpeed

            );


        // ======================================
        // STEERING
        // ======================================

        let targetSteering =
            0;


        if (
            input.keys.left
        ) {

            targetSteering =
                1;

        }


        if (
            input.keys.right
        ) {

            targetSteering =
                -1;

        }


        this.steeringInput =
            THREE.MathUtils.lerp(

                this.steeringInput,

                targetSteering,

                this.steeringSmoothness

            );


        // ======================================
        // TURN CAR
        // ======================================

        if (
            Math.abs(this.speed) >
            0.01
        ) {

            const speedRatio =
                Math.min(

                    Math.abs(this.speed) /
                    this.maxSpeed,

                    1

                );


            const steeringAmount =
                this.turnSpeed *
                (
                    0.55 +
                    speedRatio * 0.85
                );


            const direction =
                this.speed >= 0
                    ? 1
                    : -1;


            this.mesh.rotation.y +=

                this.steeringInput *

                steeringAmount *

                direction;

        }


        // ======================================
        // MOVE CAR
        // ======================================

        this.mesh.translateZ(
            -this.speed
        );


        // ======================================
        // ROAD HEIGHT
        // ======================================

        if (
            this.road &&
            typeof this.road.getHeight ===
            "function"
        ) {

            this.mesh.position.y =
                this.road.getHeight(
                    this.mesh.position.z
                );

        }


        // ======================================
        // ROAD BOUNDARY
        // ==========================================

        this.checkRoadBoundary();


        // ======================================
        // SMOKE
        // ==========================================

        this.updateSmoke(

            deltaTime,

            this.engineSoundRunning

        );

    }

}