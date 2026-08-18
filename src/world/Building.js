import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


export default class Building {

    constructor(scene) {

        this.scene = scene;

        this.buildings = [];

        this.loader =
            new GLTFLoader();


        // ==========================================
        // START LOADING
        // ==========================================

        this.ready =
            this.loadBuilding();

    }


    // ==========================================
    // LOAD SINGLE BUILDING
    // ==========================================

    loadBuilding() {

        return new Promise(
            (resolve, reject) => {

                this.loader.load(

                    "/assets/buildings/building.glb",

                    (gltf) => {

                        const building =
                            gltf.scene;


                        this.prepareBuilding(
                            building
                        );


                        this.buildings.push(
                            building
                        );


                        console.log(
                            "Single building model loaded."
                        );


                        // Tell City that
                        // building is ready.

                        resolve(
                            building
                        );

                    },


                    undefined,


                    (error) => {

                        console.error(
                            "Building GLB error:",
                            error
                        );


                        reject(
                            error
                        );

                    }

                );

            }
        );

    }


    // ==========================================
    // PREPARE BUILDING
    // ==========================================

    prepareBuilding(
        building
    ) {

        building.position.set(
            0,
            0,
            0
        );


        building.rotation.set(
            0,
            0,
            0
        );


        building.scale.set(
            1,
            1,
            1
        );


        // ======================================
        // DISABLE SHADOWS
        // ======================================

        building.traverse(
            (child) => {

                if (
                    child.isMesh
                ) {

                    child.castShadow =
                        false;

                    child.receiveShadow =
                        false;

                }

            }
        );


        // ======================================
        // CENTER MODEL
        // ======================================

        const box =
            new THREE.Box3()
                .setFromObject(
                    building
                );


        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        building.position.x -=
            center.x;


        building.position.z -=
            center.z;


        // ======================================
        // PUT ON GROUND
        // ======================================

        const groundBox =
            new THREE.Box3()
                .setFromObject(
                    building
                );


        building.position.y -=
            groundBox.min.y;

    }


    // ==========================================
    // GET BUILDING
    // ==========================================

    getRandomBuilding() {

        if (
            this.buildings.length === 0
        ) {

            return null;

        }


        return this.buildings[0].clone(
            true
        );

    }

}