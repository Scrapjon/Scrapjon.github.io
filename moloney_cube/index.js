// Constants

const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"
const FPS = 60;



console.log(moloney_cube);

moloney_cube.width = 800;
moloney_cube.height = 800;

const ctx = moloney_cube.getContext("2d");

console.log(ctx);

function clear() {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, moloney_cube.width, moloney_cube.height);
}


function point({x, y}) {
    console.log(x, y);
    const s = 20;
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x, y, s, s);
}

// Convert 2d space to screen space: -1..1 => 0..width and height
function screen(p) {
    return {
        x: (p.x + 1)/2*moloney_cube.width,
        y: (1 - (p.y + 1)/2)*moloney_cube.width,
    };
}

function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z,
    };
}

let dz = 1;
let angle = 0;
const vs = [
    {x: 0.25, y: 0.25, z: 0.25},
    {x: -0.25, y: 0.25, z: 0.25},
    {x: -0.25, y: -0.25, z: 0.25},
    {x: 0.25, y: -0.25, z: 0.25},

    {x: 0.25, y: 0.25, z: -0.25},
    {x: -0.25, y: 0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
    {x: 0.25, y: -0.25, z: -0.25},
];

const fs = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
]

function translateZ({x, y, z}, dz) {
    return {x: x, y: y, z: z + dz};
}

function rotateXZ({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y: y,
        z: x*s+z*c,
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

function frame() {
    // Calculate delta time
    const dt = 1/FPS;
    //dz += 1*dt;
    angle += Math.PI*dt;
    // Draw cube to screen
    clear();

    for (const v of vs) {
        //point(screen(project(translateZ(rotateXZ(v, angle), dz))));
    }

    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(
                screen(project(translateZ(rotateXZ(a, angle), dz))),
                screen(project(translateZ(rotateXZ(b, angle), dz)))
            );
            
        }
    }

    // Write the title
    writeText("moloney_cube", screen({x: 0, y: -0.75}));

    // Schedule next frame
    setTimeout(frame, 1000/FPS);
}

function writeText(text, {x, y}) {
    ctx.fillStyle = FOREGROUND;
    ctx.font = "48px serif";
    ctx.fillText(text, x, y);
    ctx.textAlign = "center";
}

setTimeout(frame, 1000/FPS)





