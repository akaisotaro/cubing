import { connectSmartPuzzle }
from "https://cdn.cubing.net/v0/js/cubing/bluetooth";

let puzzle = null;
let connected = false;

let currentMove = "-";

const moves = [
    "U","U'",
    "R","R'",
    "F","F'",
    "D","D'",
    "L","L'",
    "B","B'"
];

const buttons = [];

function handleMove(move){

    currentMove = move;

    console.log(move);

}

async function connectCube(){

    if(connected) return;

    try{

        puzzle = await connectSmartPuzzle();

        connected = true;

        puzzle.addAlgLeafListener((e)=>{

            handleMove(
                e.latestAlgLeaf.toString()
            );

        });

    }
    catch(err){

        console.log(err);

    }

}

function setup(){

    createCanvas(windowWidth, windowHeight);

    textAlign(CENTER,CENTER);
    textSize(24);

    const w = 90;
    const h = 60;

    let y = 120;

    let i = 0;

    for(let r=0;r<3;r++){

        let x = 20;

        for(let c=0;c<4;c++){

            buttons.push({

                x:x,
                y:y,
                w:w,
                h:h,
                move:moves[i]

            });

            x += 100;
            i++;

        }

        y += 80;

    }

}

function draw(){

    background(240);

    fill(connected ? "green" : "lightgray");
    rect(20,20,180,60,10);

    fill(0);

    text(
        connected ? "接続済み" : "接続",
        110,
        50
    );

    for(const b of buttons){

        fill(255);

        rect(
            b.x,
            b.y,
            b.w,
            b.h,
            8
        );

        fill(0);

        text(
            b.move,
            b.x+b.w/2,
            b.y+b.h/2
        );

    }

    textSize(40);

    fill("blue");

    text(
        currentMove,
        width/2,
        height-80
    );

}

function mousePressed(){

    if(
        mouseX>=20 &&
        mouseX<=200 &&
        mouseY>=20 &&
        mouseY<=80
    ){

        connectCube();

        return;
    }

    for(const b of buttons){

        if(
            mouseX>=b.x &&
            mouseX<=b.x+b.w &&
            mouseY>=b.y &&
            mouseY<=b.y+b.h
        ){

            handleMove(b.move);

            break;

        }

    }

}

function windowResized(){

    resizeCanvas(windowWidth,windowHeight);

}
