"use strict";
var MoloneyMath;
(function (MoloneyMath) {
    function project({ x, y, z }) {
        return {
            x: x / z,
            y: y / z,
        };
    }
    MoloneyMath.project = project;
    function translateZ({ x, y, z }, deltaZ) {
        return { x: x, y: y, z: z + deltaZ };
    }
    MoloneyMath.translateZ = translateZ;
    function getRotationFunc(rotationAxis) {
        switch (rotationAxis) {
            case 0 /* RotationAxis.XY */:
                return rotateXY;
            case 1 /* RotationAxis.XZ */:
                return rotateXZ;
            case 2 /* RotationAxis.YZ */:
                return rotateYZ;
            default:
                return rotateXZ; // best looking rotation imo
        }
    }
    MoloneyMath.getRotationFunc = getRotationFunc;
    function rotateXY({ x, y, z }, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: x * s + y * c,
            z: z,
        };
    }
    function rotateXZ({ x, y, z }, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: y,
            z: x * s + z * c,
        };
    }
    function rotateYZ({ x, y, z }, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return {
            x: x * c - z * s,
            y: y,
            z: x * s + z * c,
        };
    }
})(MoloneyMath || (MoloneyMath = {}));
// Constants
const BACKGROUND = "#101010";
const FOREGROUND = "#50FF50";
const FPS = 60;
const CANVAS_SIZE = Math.min(window.innerWidth, window.innerHeight);
const ZOOM_IN_SPEED = 1;
const VERTS = [
    { x: 0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
];
const FACES = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
];
// Globals
let deltaZ = 10;
let angle = 0;
let rotationAxis = 1 /* RotationAxis.XZ */;
function main() {
    if (typeof (document.getElementById("moloney_cube")) == null)
        return;
    let moloney_cube = document.getElementById("moloney_cube");
    moloney_cube = moloney_cube;
    if (moloney_cube.getContext("2d") == null)
        return;
    const ctx = moloney_cube.getContext("2d");
    moloney_cube.width = CANVAS_SIZE;
    moloney_cube.height = CANVAS_SIZE;
    const rotationFunc = MoloneyMath.getRotationFunc(rotationAxis);
    function clearScreen() {
        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, moloney_cube.width, moloney_cube.height);
    }
    function point({ x, y }) {
        console.log(x, y);
        const s = 20;
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(x, y, s, s);
    }
    // Convert 2d space to screen space: -1..1 => 0..width and height
    function projectToScreen(p) {
        return {
            x: (p.x + 1) / 2 * Math.min(moloney_cube.width, moloney_cube.height),
            y: (1 - (p.y + 1) / 2) * Math.min(moloney_cube.width, moloney_cube.height),
        };
    }
    function line(p1, p2) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = FOREGROUND;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    function writeText(text, { x, y }) {
        ctx.fillStyle = FOREGROUND;
        ctx.font = "48px serif";
        ctx.fillText(text, x, y);
        ctx.textAlign = "center";
    }
    function frame() {
        const showVERTS = false;
        // Calculate delta time
        const deltaTime = 1 / FPS;
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
                const a = VERTS[f[i]];
                const b = VERTS[f[(i + 1) % f.length]];
                line(projectToScreen(MoloneyMath.project(MoloneyMath.translateZ(rotationFunc(a, angle), deltaZ))), projectToScreen(MoloneyMath.project(MoloneyMath.translateZ(rotationFunc(b, angle), deltaZ))));
            }
        }
        // Write the title
        writeText("moloney_cube", projectToScreen({ x: 0, y: -0.75 }));
        // Schedule next frame
        setTimeout(frame, 1000 / FPS);
    }
    setTimeout(frame, 1000 / FPS);
}
main();
