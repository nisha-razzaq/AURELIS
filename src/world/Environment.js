import * as THREE from "three";


export default class Environment {

    constructor(scene) {

        this.scene = scene;

        this.roadLength = 500;

        this.createBuildings();

        this.createTrees();

        this.createStreetLights();
    }


    // ==========================================
    // BUILDINGS
    // ==========================================

    createBuildings() {

        const buildingColors = [
            0xd7ccc8,
            0xb0bec5,
            0xc5cae9,
            0xffcc80,
            0xbcaaa4,
            0x90a4ae
        ];


        for (
            let z = -240;
            z <= 240;
            z += 30
        ) {

            // LEFT BUILDING

            const leftWidth =
                THREE.MathUtils.randFloat(
                    8,
                    14
                );

            const leftDepth =
                THREE.MathUtils.randFloat(
                    10,
                    18
                );

            const leftHeight =
                THREE.MathUtils.randFloat(
                    8,
                    28
                );


            const leftGeometry =
                new THREE.BoxGeometry(
                    leftWidth,
                    leftHeight,
                    leftDepth
                );


            const leftMaterial =
                new THREE.MeshStandardMaterial({
                    color:
                        buildingColors[
                            Math.floor(
                                Math.random() *
                                buildingColors.length
                            )
                        ],
                    roughness: 0.8
                });


            const leftBuilding =
                new THREE.Mesh(
                    leftGeometry,
                    leftMaterial
                );


            leftBuilding.position.set(
                THREE.MathUtils.randFloat(
                    -23,
                    -19
                ),
                leftHeight / 2,
                z +
                THREE.MathUtils.randFloat(
                    -8,
                    8
                )
            );


            this.scene.add(
                leftBuilding
            );


            // RIGHT BUILDING

            const rightWidth =
                THREE.MathUtils.randFloat(
                    8,
                    14
                );

            const rightDepth =
                THREE.MathUtils.randFloat(
                    10,
                    18
                );

            const rightHeight =
                THREE.MathUtils.randFloat(
                    8,
                    28
                );


            const rightGeometry =
                new THREE.BoxGeometry(
                    rightWidth,
                    rightHeight,
                    rightDepth
                );


            const rightMaterial =
                new THREE.MeshStandardMaterial({
                    color:
                        buildingColors[
                            Math.floor(
                                Math.random() *
                                buildingColors.length
                            )
                        ],
                    roughness: 0.8
                });


            const rightBuilding =
                new THREE.Mesh(
                    rightGeometry,
                    rightMaterial
                );


            rightBuilding.position.set(
                THREE.MathUtils.randFloat(
                    19,
                    23
                ),
                rightHeight / 2,
                z +
                THREE.MathUtils.randFloat(
                    -8,
                    8
                )
            );


            this.scene.add(
                rightBuilding
            );
        }
    }


    // ==========================================
    // TREES
    // ==========================================

    createTrees() {

        const trunkMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x6d4c41
            });


        const leafMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2e7d32
            });


        for (
            let z = -235;
            z <= 235;
            z += 25
        ) {

            this.createTree(
                -13,
                z +
                THREE.MathUtils.randFloat(
                    -5,
                    5
                ),
                trunkMaterial,
                leafMaterial
            );


            this.createTree(
                13,
                z +
                THREE.MathUtils.randFloat(
                    -5,
                    5
                ),
                trunkMaterial,
                leafMaterial
            );
        }
    }


    createTree(
        x,
        z,
        trunkMaterial,
        leafMaterial
    ) {

        // TRUNK

        const trunkGeometry =
            new THREE.CylinderGeometry(
                0.25,
                0.35,
                3,
                8
            );


        const trunk =
            new THREE.Mesh(
                trunkGeometry,
                trunkMaterial
            );


        trunk.position.set(
            x,
            1.5,
            z
        );


        this.scene.add(
            trunk
        );


        // LEAVES

        const leafGeometry =
            new THREE.SphereGeometry(
                1.7,
                12,
                12
            );


        const leaves =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );


        leaves.position.set(
            x,
            4,
            z
        );


        this.scene.add(
            leaves
        );
    }


    // ==========================================
    // STREET LIGHTS
    // ==========================================

    createStreetLights() {

        for (
            let z = -225;
            z <= 225;
            z += 35
        ) {

            this.createStreetLight(
                -10,
                z
            );


            this.createStreetLight(
                10,
                z + 17
            );
        }
    }


    createStreetLight(
        x,
        z
    ) {

        // POLE

        const poleGeometry =
            new THREE.CylinderGeometry(
                0.12,
                0.15,
                6,
                8
            );


        const poleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.7,
                roughness: 0.3
            });


        const pole =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial
            );


        pole.position.set(
            x,
            3,
            z
        );


        this.scene.add(
            pole
        );


        // LIGHT

        const lightGeometry =
            new THREE.SphereGeometry(
                0.3,
                12,
                12
            );


        const lightMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xfff4c2,
                emissive: 0xffd54f,
                emissiveIntensity: 2
            });


        const lamp =
            new THREE.Mesh(
                lightGeometry,
                lightMaterial
            );


        lamp.position.set(
            x,
            6.1,
            z
        );


        this.scene.add(
            lamp
        );
    }
}