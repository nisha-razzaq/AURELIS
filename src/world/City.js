import * as THREE from "three";

import Building from "./Building.js";
import Tree from "./Tree.js";


export default class City {

    constructor(scene, road) {

        this.scene = scene;

        this.road = road;


        // ==========================================
        // SYSTEMS
        // ==========================================

        this.buildingSystem =
            new Building(scene);


        this.treeSystem =
            new Tree(scene);


        // ==========================================
        // ENVIRONMENT SETTINGS
        // ==========================================

        this.roadLength =
            this.road?.roadLength || 1800;


        this.roadWidth =
            this.road?.roadWidth || 14;


        // ==========================================
        // BUILDINGS
        // ==========================================

        this.buildingDistance =
            18;


        this.buildingSpacing =
            55;


        this.minBuildingScale =
            2;


        this.maxBuildingScale =
            2;


        // ==========================================
        // TREES
        // ==========================================

        this.treeDistance =
            12;


        this.treeSpacing =
            35;


        this.minTreeScale =
            0.85;


        this.maxTreeScale =
            1.05;


        // ==========================================
        // STREET LIGHTS
        // ==========================================

        this.streetLightDistance =
            8;


        this.streetLightSpacing =
            45;


        // ==========================================
        // WAIT FOR ASSETS
        // ==========================================

        this.waitForAssets();

    }


    // ==========================================
    // WAIT FOR ASSETS
    // ==========================================

    waitForAssets() {

        const buildingReady =
            this.buildingSystem
                .buildings
                .length > 0;


        const treeReady =
            this.treeSystem
                .model !== null;


        if (
            !buildingReady ||
            !treeReady
        ) {

            setTimeout(
                () => {

                    this.waitForAssets();

                },
                100
            );

            return;

        }


        console.log(
            "AURELIS environment assets ready."
        );


        this.createCity();

    }


    // ==========================================
    // CREATE CITY
    // ==========================================

    createCity() {

        this.createBuildings();

        this.createTrees();

        this.createStreetLights();


        console.log(
            "AURELIS curved environment created."
        );

    }


    // ==========================================
    // ROAD POSITION HELPER
    // ==========================================

    getRoadSidePosition(
        side,
        z,
        distance
    ) {

        if (
            this.road &&
            typeof this.road.getSidePosition ===
            "function"
        ) {

            return this.road.getSidePosition(
                side,
                z,
                distance
            );

        }


        // Fallback

        return {

            x:
                side *
                (
                    this.roadWidth / 2 +
                    distance
                ),

            z:
                z

        };

    }


    // ==========================================
    // ROAD HEIGHT
    // ==========================================

    getRoadHeight(z) {

        if (
            this.road &&
            typeof this.road.getHeight ===
            "function"
        ) {

            return this.road.getHeight(z);

        }


        return 0;

    }


    // ==========================================
    // ROAD ANGLE
    // ==========================================

    getRoadAngle(z) {

        if (
            this.road &&
            typeof this.road.getRoadAngle ===
            "function"
        ) {

            return this.road.getRoadAngle(z);

        }


        return 0;

    }


    // ==========================================
    // BUILDINGS
    // ==========================================

    createBuildings() {

        this.createBuildingRow(-1);

        this.createBuildingRow(1);

    }


    // ==========================================
    // BUILDING ROW
    // ==========================================

    createBuildingRow(side) {

        const startZ =
            -this.roadLength / 2 + 30;


        const endZ =
            this.roadLength / 2 - 30;


        let count = 0;


        for (
            let z = startZ;

            z <= endZ;

            z += this.buildingSpacing
        ) {


            const building =
                this.buildingSystem
                    .getRandomBuilding();


            if (!building) {

                continue;

            }


            // ======================================
            // CURVED ROAD POSITION
            // ======================================

            const distance =
                this.roadWidth / 2 +
                this.buildingDistance;


            const position =
                this.getRoadSidePosition(
                    side,
                    z,
                    distance
                );


            building.position.set(

                position.x,

                this.getRoadHeight(z),

                position.z

            );


            // ======================================
            // FOLLOW ROAD CURVE
            // ======================================

            const roadAngle =
                this.getRoadAngle(z);


            /*
             * Buildings face toward the road.
             *
             * The road tangent changes continuously,
             * so the building orientation changes with it.
             */

            if (side === 1) {

                building.rotation.y =
                    roadAngle -
                    Math.PI / 2;

            }

            else {

                building.rotation.y =
                    roadAngle +
                    Math.PI / 2;

            }


            // ======================================
            // BUILDING SCALE
            // ======================================

            const scale =
                THREE.MathUtils.randFloat(

                    this.minBuildingScale,

                    this.maxBuildingScale

                );


            building.scale.setScalar(
                scale
            );


            // ======================================
            // SMALL NATURAL OFFSET
            // ======================================

            /*
             * Offset slightly farther from road.
             * This prevents buildings from touching
             * the sidewalk.
             */

            const extraDistance =
                THREE.MathUtils.randFloat(
                    0,
                    4
                );


            const finalPosition =
                this.getRoadSidePosition(
                    side,
                    z,
                    distance +
                    extraDistance
                );


            building.position.x =
                finalPosition.x;


            building.position.z =
                finalPosition.z;


            building.position.y =
                this.getRoadHeight(z);


            // ======================================
            // SHADOW SETTINGS
            // ======================================

            building.traverse(
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


            this.scene.add(
                building
            );


            count++;

        }


        console.log(
            `Created ${count} curved buildings on side ${side}.`
        );

    }


    // ==========================================
    // TREES
    // ==========================================

    createTrees() {

        this.createTreeRow(-1);

        this.createTreeRow(1);

    }


    // ==========================================
    // TREE ROW
    // ==========================================

    createTreeRow(side) {

        const startZ =
            -this.roadLength / 2 + 20;


        const endZ =
            this.roadLength / 2 - 20;


        let count = 0;


        for (
            let z = startZ;

            z <= endZ;

            z += this.treeSpacing
        ) {


            const tree =
                this.treeSystem.getTree();


            if (!tree) {

                continue;

            }


            // ======================================
            // RANDOM DISTANCE
            // ======================================

            const distance =
                this.roadWidth / 2 +
                this.treeDistance +
                THREE.MathUtils.randFloat(
                    -2,
                    5
                );


            // ======================================
            // CURVED ROAD POSITION
            // ======================================

            const position =
                this.getRoadSidePosition(
                    side,
                    z,
                    distance
                );


            tree.position.set(

                position.x,

                this.getRoadHeight(z),

                position.z

            );


            // ======================================
            // FOLLOW ROAD CURVE
            // ======================================

            tree.rotation.y =
                this.getRoadAngle(z) +
                THREE.MathUtils.randFloat(
                    -0.35,
                    0.35
                );


            // ======================================
            // TREE SCALE
            // ======================================

            const scale =
                THREE.MathUtils.randFloat(

                    this.minTreeScale,

                    this.maxTreeScale

                );


            tree.scale.setScalar(
                scale
            );


            // ======================================
            // SHADOWS
            // ======================================

            tree.traverse(
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


            this.scene.add(
                tree
            );


            count++;

        }


        console.log(
            `Created ${count} curved trees on side ${side}.`
        );

    }


    // ==========================================
    // STREET LIGHTS
    // ==========================================

    createStreetLights() {

        const startZ =
            -this.roadLength / 2 + 25;


        const endZ =
            this.roadLength / 2 - 25;


        let count = 0;


        for (

            let z = startZ;

            z <= endZ;

            z += this.streetLightSpacing

        ) {


            this.createStreetLight(
                -1,
                z
            );


            this.createStreetLight(
                1,
                z
            );


            count += 2;

        }


        console.log(
            `Created ${count} curved street lights.`
        );

    }


    // ==========================================
    // SINGLE STREET LIGHT
    // ==========================================

    createStreetLight(
        side,
        z
    ) {

        const group =
            new THREE.Group();


        // ======================================
        // CURVED ROAD POSITION
        // ======================================

        const distance =
            this.roadWidth / 2 +
            this.streetLightDistance;


        const position =
            this.getRoadSidePosition(
                side,
                z,
                distance
            );


        group.position.set(

            position.x,

            this.getRoadHeight(z),

            position.z

        );


        // ======================================
        // FOLLOW ROAD
        // ======================================

        group.rotation.y =
            this.getRoadAngle(z);


        // ======================================
        // POLE
        // ======================================

        const poleGeometry =
            new THREE.CylinderGeometry(

                0.08,
                0.11,
                5.5,
                10

            );


        const poleMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x30343a,

                roughness: 0.75,

                metalness: 0.35

            });


        const pole =
            new THREE.Mesh(

                poleGeometry,

                poleMaterial

            );


        pole.position.y =
            2.75;


        pole.castShadow =
            true;


        group.add(
            pole
        );


        // ======================================
        // TOP ARM
        // ======================================

        const armGeometry =
            new THREE.BoxGeometry(

                1.2,
                0.08,
                0.08

            );


        const arm =
            new THREE.Mesh(

                armGeometry,

                poleMaterial

            );


        arm.position.set(

            -side * 0.55,

            5.42,

            0

        );


        group.add(
            arm
        );


        // ======================================
        // LAMP HOUSING
        // ======================================

        const lampGeometry =
            new THREE.BoxGeometry(

                0.42,
                0.12,
                0.28

            );


        const lampMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x25282c,

                roughness: 0.55,

                metalness: 0.5

            });


        const lamp =
            new THREE.Mesh(

                lampGeometry,

                lampMaterial

            );


        lamp.position.set(

            -side * 1.05,

            5.35,

            0

        );


        group.add(
            lamp
        );


        // ======================================
        // LIGHT GLOW
        // ======================================

        const glowGeometry =
            new THREE.SphereGeometry(

                0.10,
                8,
                8

            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xfff3c4

            });


        const glow =
            new THREE.Mesh(

                glowGeometry,

                glowMaterial

            );


        glow.position.set(

            -side * 1.05,

            5.27,

            0

        );


        group.add(
            glow
        );


        // ======================================
        // ADD LIGHT
        // ======================================

        this.scene.add(
            group
        );

    }

}