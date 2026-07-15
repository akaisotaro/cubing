console.log("main.js loaded");

import { connectGanCube }
from "https://cdn.jsdelivr.net/npm/gan-web-bluetooth@3.0.2/+esm";

console.log("gan-web-bluetooth loaded");

const moves = [
    "U","U'",
    "R","R'",
    "F","F'",
    "D","D'",
    "L","L'",
    "B","B'"
];


const chords = {

    "U":[261.63,329.63,392.00],
    "U'":[293.66,349.23,440.00],

    "R":[392.00,493.88,587.33],
    "R'":[440.00,523.25,659.25],

    "F":[349.23,440.00,523.25],
    "F'":[329.63,392.00,493.88],

    "D":[293.66,369.99,440.00],
    "D'":[246.94,293.66,369.99],

    "L":[220.00,277.18,329.63],
    "L'":[174.61,220.00,261.63],

    "B":[196.00,246.94,293.66],
    "B'":[164.81,207.65,246.94]

};


const current =
document.getElementById("current");


const audio =
new AudioContext();



async function enableAudio(){

    if(audio.state === "suspended"){
        await audio.resume();
    }

}



function playChord(freqs){

    if(!freqs){
        return;
    }


    for(const freq of freqs){

        const osc =
        audio.createOscillator();

        const gain =
        audio.createGain();


        osc.type="sine";
        osc.frequency.value=freq;


        gain.gain.value=0.15;


        osc.connect(gain);
        gain.connect(audio.destination);


        osc.start();


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.8
        );


        osc.stop(
            audio.currentTime + 0.8
        );

    }

}



function handleMove(move){

    console.log(move);

    current.textContent = move;


    playChord(
        chords[move]
    );

}



// 手動ボタン

const buttons =
document.getElementById("buttons");


for(const move of moves){

    const button =
    document.createElement("button");


    button.textContent =
    move;


    button.onclick=async()=>{

        await enableAudio();

        handleMove(move);

    };


    buttons.appendChild(button);

}



// GAN接続

document.getElementById("connect")
.onclick = async()=>{


    await enableAudio();


    const conn =
    await connectGanCube(
        async()=>{
            return "70:19:88:8F:A4:58";
        }
    );


    console.log("GAN Connected");


    const button =
    document.getElementById("connect");


    button.disabled=true;
    button.textContent="接続済み";



    conn.events$.subscribe(
        event=>{


            console.log(event);


            if(event.type==="MOVE"){


                handleMove(
                    event.move
                );


            }


        }
    );


};
