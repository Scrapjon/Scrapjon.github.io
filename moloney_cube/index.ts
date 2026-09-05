// 2D vector
type Vector2 = {
    x: number,
    y: number
}

// 3D vector
type Vector3 = {
    x: number,
    y: number,
    z: number
}

const enum RotationAxis {
    XY = 0,
    XZ = 1,
    YZ = 2
}

namespace MoloneyMath {
    export function project({ x, y, z }: Vector3): Vector2 {
        return {
            x: x / z,
            y: y / z,
        };
    }

    export function translateZ({ x, y, z }: Vector3, deltaZ: number): Vector3 {
        return { x: x, y: y, z: z + deltaZ };
    }

    export function getRotationFunc(rotationAxis: RotationAxis) {
        switch (rotationAxis) {
            case RotationAxis.XY:
                return rotateXY;
            case RotationAxis.XZ:
                return rotateXZ;
            case RotationAxis.YZ:
                return rotateYZ;
            default:
                return rotateXZ; // best looking rotation imo
        }
    }

    function rotateXY({ x, y, z }: Vector3, angle: number): Vector3 {
        const c: number = Math.cos(angle);
        const s: number = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: x * s + y * c,
            z: z,
        };
    }

    function rotateXZ({ x, y, z }: Vector3, angle: number): Vector3 {
        const c: number = Math.cos(angle);
        const s: number = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: y,
            z: x * s + z * c,
        };
    }

    function rotateYZ({ x, y, z }: Vector3, angle: number): Vector3 {
        const c: number = Math.cos(angle);
        const s: number = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: y,
            z: x * s + z * c,
        };
    }
}

// Constants

const BACKGROUND: string = "#101010"
const FOREGROUND: string = "#50FF50"
const FPS: number = 60;
const CANVAS_SIZE: number = Math.min(window.innerWidth, window.innerHeight)
const ZOOM_IN_SPEED: number = 1;

const VERTS: Vector3[] = [
    { x: 0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },

    { x: 0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
];

const FACES: number[][] = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
]

// Globals

let deltaZ: number = 10;

let angle: number = 0;

let rotationAxis: RotationAxis = RotationAxis.XZ

function main(): void {

    if (typeof (document.getElementById("moloney_cube")) == null) return;

    let moloney_cube: HTMLCanvasElement = document.getElementById("moloney_cube") as HTMLCanvasElement;

    moloney_cube = moloney_cube as HTMLCanvasElement;

    if (moloney_cube.getContext("2d") == null) return;

    const ctx: CanvasRenderingContext2D = moloney_cube.getContext("2d") as CanvasRenderingContext2D;

    moloney_cube.width = CANVAS_SIZE;
    moloney_cube.height = CANVAS_SIZE;

    const rotationFunc = MoloneyMath.getRotationFunc(rotationAxis);

    function clearScreen(): void {
        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, moloney_cube.width, moloney_cube.height);
    }


    function point({ x, y }: Vector2): void {
        console.log(x, y);
        const s = 20;
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(x, y, s, s);
    }

    // Convert 2d space to screen space: -1..1 => 0..width and height
    function projectToScreen(p: Vector2): Vector2 {
        return {
            x: (p.x + 1) / 2 * Math.min(moloney_cube.width, moloney_cube.height),
            y: (1 - (p.y + 1) / 2) * Math.min(moloney_cube.width, moloney_cube.height),
        };
    }

    function line(p1: Vector2, p2: Vector2): void {
        ctx.lineWidth = 3;
        ctx.strokeStyle = FOREGROUND;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    function writeText(text: string, { x, y }: Vector2): void {
        ctx.fillStyle = FOREGROUND;
        ctx.font = "48px serif";
        ctx.fillText(text, x, y);
        ctx.textAlign = "center";
    }

    function frame(): void {
        const showVERTS: boolean = false;

        // Calculate delta time
        const deltaTime: number = 1 / FPS;

        if (deltaZ > 1) {
            deltaZ = deltaZ - Math.max(ZOOM_IN_SPEED * deltaTime, 1);
        }

        angle += Math.PI * deltaTime;
        // Draw cube to screen
        clearScreen();

        for (const v of VERTS) {
            if (showVERTS)
                point(projectToScreen(MoloneyMath.project(MoloneyMath.translateZ(rotationFunc(v, angle), deltaZ))));
        }

        for (const f of FACES) {
            for (let i = 0; i < f.length; ++i) {
                const a: Vector3 = VERTS[f[i]];
                const b: Vector3 = VERTS[f[(i + 1) % f.length]];
                line(

                    projectToScreen(
                        MoloneyMath.project(
                            MoloneyMath.translateZ(
                                rotationFunc(a, angle),
                                deltaZ
                            )
                        )
                    ),
                    projectToScreen(
                        MoloneyMath.project(
                            MoloneyMath.translateZ(
                                rotationFunc(b, angle),
                                deltaZ
                            )
                        )
                    )
                );

            }
        }

        // Write the title
        writeText("moloney_cube", projectToScreen({ x: 0, y: -0.75 }));

        // Schedule next frame
        setTimeout(frame, 1000 / FPS);
    }

    setTimeout(frame, 1000 / FPS)
}

main();






