import * as THREE from "three";


export default class Road {

    constructor(scene) {

        this.scene = scene;

        // ==========================================
        // ROAD DIMENSIONS
        // ==========================================

        this.roadWidth = 14;

        this.roadLength = 3000;

        this.sidewalkWidth = 3;

        this.grassWidth = 7;

        this.segments = 1500;


        // ==========================================
        // CREATE ROAD SYSTEM
        // ==========================================

        this.createRoad();

        this.createLaneMarkings();

        this.createEdgeLines();

        this.createCurbs();

        this.createSidewalks();

        this.createGrass();

        this.createGreenRoadsideLines();

        this.createReflectiveStuds();

        this.createRoadWear();

    }


    // ==========================================
    // ROAD CENTER CURVE
    // ==========================================

    getCenterX(z) {

        return (
            Math.sin(z * 0.0045) * 24 +
            Math.sin(z * 0.010) * 10 +
            Math.sin(z * 0.021) * 4
        );

    }


    // ==========================================
    // ROAD HEIGHT
    // ==========================================

    getHeight(z) {

        return (
            Math.sin(z * 0.012) * 0.25 +
            Math.sin(z * 0.031) * 0.08
        );

    }


    // ==========================================
    // ROAD HEIGHT SLOPE
    // ==========================================

    getSlope(z) {

        const step = 0.1;

        return (
            this.getHeight(z + step) -
            this.getHeight(z - step)
        ) / (step * 2);

    }


    // ==========================================
    // ROAD CURVE SLOPE
    // ==========================================

    getCurveSlope(z) {

        const step = 0.1;

        return (
            this.getCenterX(z + step) -
            this.getCenterX(z - step)
        ) / (step * 2);

    }


    // ==========================================
    // ROAD ANGLE
    // ==========================================

    getRoadAngle(z) {

        return Math.atan(
            this.getCurveSlope(z)
        );

    }


    // ==========================================
    // ROAD SIDE POSITION
    // ==========================================

    getSidePosition(
        side,
        z,
        distance
    ) {

        const centerX =
            this.getCenterX(z);

        const slope =
            this.getCurveSlope(z);

        const normalLength =
            Math.sqrt(
                1 +
                slope * slope
            );

        const normalX =
            1 / normalLength;

        const normalZ =
            -slope / normalLength;

        return {

            x:
                centerX +
                side *
                normalX *
                distance,

            z:
                z +
                side *
                normalZ *
                distance

        };

    }


    // ==========================================
    // ROAD LIMITS
    // ==========================================

    getRoadLimits(z = 0) {

        const position =
            this.getSidePosition(
                0,
                z,
                0
            );

        const slope =
            this.getCurveSlope(z);

        const normalLength =
            Math.sqrt(
                1 +
                slope * slope
            );

        const normalX =
            1 / normalLength;

        return {

            left:
                position.x -
                normalX *
                (this.roadWidth / 2),

            right:
                position.x +
                normalX *
                (this.roadWidth / 2)

        };

    }


    // ==========================================
    // ROAD HEIGHT AT X/Z AREA
    // ==========================================

    getRoadHeight(z) {

        return this.getHeight(z);

    }


    // ==========================================
    // MAIN ROAD
    // ==========================================

    createRoad() {

        const geometry =
            new THREE.BufferGeometry();

        const vertices = [];

        const uvs = [];

        const indices = [];

        const halfWidth =
            this.roadWidth / 2;


        for (
            let i = 0;
            i <= this.segments;
            i++
        ) {

            const t =
                i / this.segments;

            const z =
                THREE.MathUtils.lerp(
                    -this.roadLength / 2,
                    this.roadLength / 2,
                    t
                );

            const centerX =
                this.getCenterX(z);

            const slope =
                this.getCurveSlope(z);

            const normalLength =
                Math.sqrt(
                    1 +
                    slope * slope
                );

            const normalX =
                1 / normalLength;

            const normalZ =
                -slope / normalLength;

            const y =
                this.getHeight(z);


            // LEFT EDGE

            vertices.push(
                centerX -
                normalX *
                halfWidth,

                y,

                z -
                normalZ *
                halfWidth
            );


            uvs.push(
                0,
                t * 50
            );


            // RIGHT EDGE

            vertices.push(
                centerX +
                normalX *
                halfWidth,

                y,

                z +
                normalZ *
                halfWidth
            );


            uvs.push(
                1,
                t * 50
            );

        }


        for (
            let i = 0;
            i < this.segments;
            i++
        ) {

            const a = i * 2;
            const b = i * 2 + 1;
            const c = i * 2 + 2;
            const d = i * 2 + 3;

            indices.push(
                a,
                c,
                b
            );

            indices.push(
                b,
                c,
                d
            );

        }


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                vertices,
                3
            )
        );


        geometry.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute(
                uvs,
                2
            )
        );


        geometry.setIndex(
            indices
        );


        geometry.computeVertexNormals();


        const texture =
            this.createAsphaltTexture();


        texture.wrapS =
            THREE.RepeatWrapping;

        texture.wrapT =
            THREE.RepeatWrapping;

        texture.repeat.set(
            1,
            50
        );

        texture.anisotropy = 8;

        texture.colorSpace =
            THREE.SRGBColorSpace;


        const material =
            new THREE.MeshStandardMaterial({

                map: texture,

                color: 0x454545,

                roughness: 0.98,

                metalness: 0

            });


        this.road =
            new THREE.Mesh(
                geometry,
                material
            );


        this.road.receiveShadow =
            true;


        this.scene.add(
            this.road
        );

    }


    // ==========================================
    // ASPHALT TEXTURE
    // ==========================================

    createAsphaltTexture() {

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 1024;
        canvas.height = 2048;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.fillStyle =
            "#383838";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // ASPHALT GRAIN

        for (
            let i = 0;
            i < 70000;
            i++
        ) {

            const x =
                Math.random() *
                canvas.width;

            const y =
                Math.random() *
                canvas.height;

            const brightness =
                Math.floor(
                    30 +
                    Math.random() * 40
                );

            const alpha =
                0.10 +
                Math.random() * 0.20;

            ctx.fillStyle =
                `rgba(
                    ${brightness},
                    ${brightness},
                    ${brightness},
                    ${alpha}
                )`;

            const size =
                Math.random() *
                1.8 +
                0.2;

            ctx.fillRect(
                x,
                y,
                size,
                size
            );

        }


        return new THREE.CanvasTexture(
            canvas
        );

    }


    // ==========================================
    // LANE MARKINGS
    // ==========================================

    createLaneMarkings() {

        this.createDashedLine(
            -3.5,
            0.12,
            4,
            8,
            0xe8e8e8
        );


        this.createDashedLine(
            3.5,
            0.12,
            4,
            8,
            0xe8e8e8
        );


        this.createDashedLine(
            0,
            0.18,
            5,
            6,
            0xf2c94c
        );

    }


    // ==========================================
    // CURVED DASHED LINE
    // ==========================================

    createDashedLine(
        offset,
        width,
        dashLength,
        gap,
        color
    ) {

        const material =
            new THREE.MeshStandardMaterial({

                color,

                roughness: 0.85

            });


        for (
            let z =
                -this.roadLength / 2;

            z <
                this.roadLength / 2;

            z +=
                dashLength + gap
        ) {

            const midZ =
                z +
                dashLength / 2;


            const position =
                this.getSidePosition(
                    0,
                    midZ,
                    offset
                );


            const geometry =
                new THREE.BoxGeometry(
                    width,
                    0.035,
                    dashLength
                );


            const line =
                new THREE.Mesh(
                    geometry,
                    material
                );


            line.position.set(
                position.x,
                this.getHeight(midZ) + 0.045,
                position.z
            );


            line.rotation.y =
                this.getRoadAngle(midZ);


            this.scene.add(
                line
            );

        }

    }


    // ==========================================
    // EDGE LINES
    // ==========================================

    createEdgeLines() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xf5f5f5,

                roughness: 0.85

            });


        this.createContinuousLine(
            -this.roadWidth / 2 +
            0.35,
            material
        );


        this.createContinuousLine(
            this.roadWidth / 2 -
            0.35,
            material
        );

    }


    // ==========================================
    // CURVED CONTINUOUS LINE
    // ==========================================

    createContinuousLine(
        offset,
        material
    ) {

        const geometry =
            new THREE.BufferGeometry();

        const vertices = [];

        const indices = [];

        const width = 0.18;


        for (
            let i = 0;
            i <= this.segments;
            i++
        ) {

            const t =
                i / this.segments;

            const z =
                THREE.MathUtils.lerp(
                    -this.roadLength / 2,
                    this.roadLength / 2,
                    t
                );


            const p1 =
                this.getSidePosition(
                    0,
                    z,
                    offset -
                    width / 2
                );


            const p2 =
                this.getSidePosition(
                    0,
                    z,
                    offset +
                    width / 2
                );


            const y =
                this.getHeight(z) +
                0.045;


            vertices.push(
                p1.x,
                y,
                p1.z,

                p2.x,
                y,
                p2.z
            );

        }


        for (
            let i = 0;
            i < this.segments;
            i++
        ) {

            const a = i * 2;
            const b = i * 2 + 1;
            const c = i * 2 + 2;
            const d = i * 2 + 3;

            indices.push(
                a,
                c,
                b,

                b,
                c,
                d
            );

        }


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                vertices,
                3
            )
        );


        geometry.setIndex(
            indices
        );


        geometry.computeVertexNormals();


        const line =
            new THREE.Mesh(
                geometry,
                material
            );


        this.scene.add(
            line
        );

    }


    // ==========================================
    // CURBS
    // ==========================================

    createCurbs() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x666666,

                roughness: 0.92

            });


        const spacing = 3;


        for (
            let z =
                -this.roadLength / 2;

            z <
                this.roadLength / 2;

            z += spacing
        ) {

            this.createCurb(
                -1,
                z,
                material
            );

            this.createCurb(
                1,
                z,
                material
            );

        }

    }


    // ==========================================
    // SINGLE CURB
    // ==========================================

    createCurb(
        side,
        z,
        material
    ) {

        const distance =
            this.roadWidth / 2 +
            0.28;


        const position =
            this.getSidePosition(
                side,
                z,
                distance
            );


        const geometry =
            new THREE.BoxGeometry(
                0.42,
                0.20,
                2.7
            );


        const curb =
            new THREE.Mesh(
                geometry,
                material
            );


        curb.position.set(
            position.x,
            this.getHeight(z) + 0.10,
            position.z
        );


        // ONLY follow horizontal curve.
        // No unwanted X tilt.

        curb.rotation.y =
            this.getRoadAngle(z);


        curb.receiveShadow =
            true;


        this.scene.add(
            curb
        );

    }


    // ==========================================
    // SIDEWALKS
    // ==========================================

    createSidewalks() {

        this.createSidewalk(-1);

        this.createSidewalk(1);

    }


    // ==========================================
    // SIDEWALK
    // ==========================================

    createSidewalk(side) {

        const geometry =
            new THREE.BufferGeometry();

        const vertices = [];

        const indices = [];


        const inner =
            this.roadWidth / 2 +
            0.55;

        const outer =
            inner +
            this.sidewalkWidth;


        for (
            let i = 0;
            i <= this.segments;
            i++
        ) {

            const t =
                i / this.segments;

            const z =
                THREE.MathUtils.lerp(
                    -this.roadLength / 2,
                    this.roadLength / 2,
                    t
                );


            const innerPos =
                this.getSidePosition(
                    side,
                    z,
                    inner
                );


            const outerPos =
                this.getSidePosition(
                    side,
                    z,
                    outer
                );


            const y =
                this.getHeight(z) +
                0.14;


            vertices.push(
                innerPos.x,
                y,
                innerPos.z,

                outerPos.x,
                y,
                outerPos.z
            );

        }


        for (
            let i = 0;
            i < this.segments;
            i++
        ) {

            const a = i * 2;
            const b = i * 2 + 1;
            const c = i * 2 + 2;
            const d = i * 2 + 3;


            if (side === -1) {

                indices.push(
                    a,
                    b,
                    c,

                    b,
                    d,
                    c
                );

            } else {

                indices.push(
                    c,
                    b,
                    a,

                    c,
                    d,
                    b
                );

            }

        }


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                vertices,
                3
            )
        );


        geometry.setIndex(
            indices
        );


        geometry.computeVertexNormals();


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x8f8f8f,

                roughness: 0.95

            });


        const sidewalk =
            new THREE.Mesh(
                geometry,
                material
            );


        sidewalk.receiveShadow =
            true;


        this.scene.add(
            sidewalk
        );

    }


    // ==========================================
    // GRASS
    // ==========================================

    createGrass() {

        const inner =
            this.roadWidth / 2 +
            0.55 +
            this.sidewalkWidth +
            0.15;


        const outer =
            inner +
            this.grassWidth;


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x3f6634,

                roughness: 1

            });


        for (
            const side of [-1, 1]
        ) {

            const geometry =
                new THREE.BufferGeometry();

            const vertices = [];

            const indices = [];


            for (
                let i = 0;
                i <= this.segments;
                i++
            ) {

                const t =
                    i / this.segments;

                const z =
                    THREE.MathUtils.lerp(
                        -this.roadLength / 2,
                        this.roadLength / 2,
                        t
                    );


                const p1 =
                    this.getSidePosition(
                        side,
                        z,
                        inner
                    );


                const p2 =
                    this.getSidePosition(
                        side,
                        z,
                        outer
                    );


                const y =
                    this.getHeight(z) -
                    0.015;


                vertices.push(
                    p1.x,
                    y,
                    p1.z,

                    p2.x,
                    y,
                    p2.z
                );

            }


            for (
                let i = 0;
                i < this.segments;
                i++
            ) {

                const a = i * 2;
                const b = i * 2 + 1;
                const c = i * 2 + 2;
                const d = i * 2 + 3;


                if (side === -1) {

                    indices.push(
                        a,
                        b,
                        c,

                        b,
                        d,
                        c
                    );

                } else {

                    indices.push(
                        c,
                        b,
                        a,

                        c,
                        d,
                        b
                    );

                }

            }


            geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(
                    vertices,
                    3
                )
            );


            geometry.setIndex(
                indices
            );


            geometry.computeVertexNormals();


            const grass =
                new THREE.Mesh(
                    geometry,
                    material
                );


            grass.receiveShadow =
                true;


            this.scene.add(
                grass
            );

        }

    }


    // ==========================================
    // GREEN OUTER BORDER
    // ==========================================

    createGreenRoadsideLines() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x527442,

                roughness: 1

            });


        const distance =
            this.roadWidth / 2 +
            0.55 +
            this.sidewalkWidth +
            0.05;


        const width = 0.20;


        for (
            const side of [-1, 1]
        ) {

            const geometry =
                new THREE.BufferGeometry();

            const vertices = [];

            const indices = [];


            for (
                let i = 0;
                i <= this.segments;
                i++
            ) {

                const t =
                    i / this.segments;

                const z =
                    THREE.MathUtils.lerp(
                        -this.roadLength / 2,
                        this.roadLength / 2,
                        t
                    );


                const p1 =
                    this.getSidePosition(
                        side,
                        z,
                        distance
                    );


                const p2 =
                    this.getSidePosition(
                        side,
                        z,
                        distance +
                        width
                    );


                const y =
                    this.getHeight(z) +
                    0.155;


                vertices.push(
                    p1.x,
                    y,
                    p1.z,

                    p2.x,
                    y,
                    p2.z
                );

            }


            for (
                let i = 0;
                i < this.segments;
                i++
            ) {

                const a = i * 2;
                const b = i * 2 + 1;
                const c = i * 2 + 2;
                const d = i * 2 + 3;


                indices.push(
                    a,
                    c,
                    b,

                    b,
                    c,
                    d
                );

            }


            geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(
                    vertices,
                    3
                )
            );


            geometry.setIndex(
                indices
            );


            geometry.computeVertexNormals();


            const line =
                new THREE.Mesh(
                    geometry,
                    material
                );


            this.scene.add(
                line
            );

        }

    }


    // ==========================================
    // REFLECTIVE STUDS
    // ==========================================

    createReflectiveStuds() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                emissive: 0x555555,

                emissiveIntensity: 0.35,

                roughness: 0.25

            });


        for (
            let z =
                -this.roadLength / 2;

            z <
                this.roadLength / 2;

            z += 12
        ) {

            for (
                const offset of [-3.5, 3.5]
            ) {

                const position =
                    this.getSidePosition(
                        0,
                        z,
                        offset
                    );


                const geometry =
                    new THREE.BoxGeometry(
                        0.07,
                        0.025,
                        0.12
                    );


                const stud =
                    new THREE.Mesh(
                        geometry,
                        material
                    );


                stud.position.set(
                    position.x,
                    this.getHeight(z) +
                    0.06,
                    position.z
                );


                stud.rotation.y =
                    this.getRoadAngle(z);


                this.scene.add(
                    stud
                );

            }

        }

    }


    // ==========================================
    // ROAD WEAR
    // ==========================================

    createRoadWear() {

        const material =
            new THREE.MeshBasicMaterial({

                color: 0x181818,

                transparent: true,

                opacity: 0.045

            });


        for (
            let z =
                -this.roadLength / 2;

            z <
                this.roadLength / 2;

            z += 20
        ) {

            for (
                const offset of [-1.5, 1.5]
            ) {

                const position =
                    this.getSidePosition(
                        0,
                        z,
                        offset
                    );


                const geometry =
                    new THREE.PlaneGeometry(
                        0.22,
                        8
                    );


                const wear =
                    new THREE.Mesh(
                        geometry,
                        material
                    );


                wear.rotation.x =
                    -Math.PI / 2;

                wear.rotation.z =
                    this.getRoadAngle(z);


                wear.position.set(
                    position.x,
                    this.getHeight(z) +
                    0.025,
                    position.z
                );


                this.scene.add(
                    wear
                );

            }

        }

    }

}