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

// Constants

const BACKGROUND: string = "#101010"
const FOREGROUND: string = "#50FF50"
const FPS: number = 60;

const verts: Vector3[] = [
    { x: 0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },

    { x: 0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
];

const faces: number[][] = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
]

// I don't know typescript that well :(

function main(): void {

    if (typeof (document.getElementById("moloney_cube")) == null) return;

    let moloney_cube: HTMLCanvasElement = document.getElementById("moloney_cube") as HTMLCanvasElement;

    moloney_cube = moloney_cube as HTMLCanvasElement;

    if (moloney_cube.getContext("2d") == null) return;

    const ctx: CanvasRenderingContext2D = moloney_cube.getContext("2d") as CanvasRenderingContext2D;

    moloney_cube.width = Math.min(window.innerWidth, window.innerHeight);
    moloney_cube.height = Math.min(window.innerWidth, window.innerHeight);

    let dz: number = 1;
    let angle: number = 0;

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

    function project({ x, y, z }: Vector3): Vector2 {
        return {
            x: x / z,
            y: y / z,
        };
    }

    function translateZ({ x, y, z }: Vector3, dz: number): Vector3 {
        return { x: x, y: y, z: z + dz };
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
        // Calculate delta time
        const dt: number = 1 / FPS;
        //dz += 1*dt;
        angle += Math.PI * dt;
        // Draw cube to screen
        clearScreen();

        for (const v of verts) {
            //point(projectToScreen(project(translateZ(rotateXZ(v, angle), dz))));
        }

        for (const f of faces) {
            for (let i = 0; i < f.length; ++i) {
                const a: Vector3 = verts[f[i]];
                const b: Vector3 = verts[f[(i + 1) % f.length]];
                line(
                    projectToScreen(project(translateZ(rotateXZ(a, angle), dz))),
                    projectToScreen(project(translateZ(rotateXZ(b, angle), dz)))
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






