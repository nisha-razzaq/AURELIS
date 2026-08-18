import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


export default class Tree {

    constructor(scene) {

        this.scene = scene;

        this.loader =
            new GLTFLoader();

        this.model = null;

        this.ready =
            this.loadTree();

    }


    // ==========================================
    // LOAD TREE
    // ==========================================

    loadTree() {

        return new Promise(
            (resolve, reject) => {

                this.loader.load(

                    "/assets/environment/tree.glb",

                    (gltf) => {

                        this.model =
                            gltf.scene;


                        this.prepareTree(
                            this.model
                        );


                        console.log(
                            "Tree model loaded."
                        );


                        resolve(
                            this.model
                        );

                    },

                    undefined,

                    (error) => {

                        console.error(
                            "Tree GLB error:",
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
    // PREPARE TREE
    // ==========================================

    prepareTree(
        tree
    ) {

        tree.traverse(
            (child) => {

                if (
                    child.isMesh
                ) {

                    // Shadows disabled for
                    // better performance.

                    child.castShadow =
                        false;

                    child.receiveShadow =
                        false;

                }

            }
        );


        // ======================================
        // PUT TREE ON GROUND
        // ======================================

        const box =
            new THREE.Box3()
                .setFromObject(
                    tree
                );


        tree.position.y -=
            box.min.y;

    }


    // ==========================================
    // GET TREE
    // ==========================================

    getTree() {

        if (
            !this.model
        ) {

            return null;

        }


        return this.model.clone(
            true
        );

    }

}