console.log("main.js loaded");

import { connectGanCube }
from "https://cdn.jsdelivr.net/npm/gan-web-bluetooth@3.0.2/+esm";

console.log("gan-web-bluetooth loaded");

const moves = [
    null,
    {move:"U'"},
    {move:"U"},
    null,

    {move:"L"},
    {move:"B'"},
    {move:"B"},
    {move:"R'"},

    {move:"L'"},
    {move:"F"},
    {move:"F'"},
    {move:"R"},

    null,
    {move:"D"},
    {move:"D'"},
    null
];

const presets = {
    preset1:{
        chords:{
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
        },
        notes:{
            "U'":"1",
            "U":"2",
            "L":"3",
            "B'":"4",
            "B":"5",
            "R'":"6",
            "L'":"7",
            "F":"8",
            "F'":"9",
            "R":"10",
            "D":"11",
            "D'":"12"
        }
    },

    preset2:{
        chords:{
            "U":[261.63,392.00,523.25],
            "U'":[293.66,440.00,587.33],
            "R":[329.63,493.88,659.25],
            "R'":[349.23,523.25,698.46],
            "F":[220.00,329.63,440.00],
            "F'":[246.94,369.99,493.88],
            "D":[196.00,293.66,392.00],
            "D'":[174.61,261.63,349.23],
            "L":[146.83,220.00,293.66],
            "L'":[130.81,196.00,261.63],
            "B":[164.81,246.94,329.63],
            "B'":[155.56,233.08,311.13]
        },
        notes:{
            "U'":"A",
            "U":"B",
            "L":"C",
            "B'":"D",
            "B":"E",
            "R'":"F",
            "L'":"G",
            "F":"H",
            "F'":"I",
            "R":"J",
            "D":"K",
            "D'":"L"
        }
    },

    preset3:{
        chords:{
            "U":[261.63,311.13,392.00],
            "U'":[293.66,349.23,415.30],
            "R":[329.63,392.00,493.88],
            "R'":[349.23,440.00,523.25],
            "F":[220.00,293.66,349.23],
            "F'":[246.94,311.13,392.00],
            "D":[196.00,261.63,329.63],
            "D'":[174.61,233.08,293.66],
            "L":[146.83,196.00,246.94],
            "L'":[130.81,174.61,220.00],
            "B":[164.81,220.00,277.18],
            "B'":[155.56,207.65,261.63]
        },
        notes:{
            "U'":"1",
            "U":"2",
            "L":"3",
            "B'":"4",
            "B":"5",
            "R'":"6",
            "L'":"7",
            "F":"8",
            "F'":"9",
            "R":"10",
            "D":"11",
            "D'":"12"
        }
    }

};

let currentPreset = presets.preset1;

document.getElementById("preset").onchange = (e)=>{

    currentPreset = presets[e.target.value];

    document.querySelectorAll("#buttons button").forEach(button=>{

        const move = button.dataset.move;

        button.querySelector(".note").textContent =
            currentPreset.notes[move];

    });

};

const current = document.getElementById("current");
const audio = new AudioContext();

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
    playChord(currentPreset.chords[move]);
}

// 手動ボタン

const buttons = document.getElementById("buttons");

for (const item of moves) {

    if (item === null) {
        buttons.appendChild(document.createElement("div"));
        continue;
    }

    const button = document.createElement("button");

    button.dataset.move = item.move;

    button.innerHTML = `
        ${item.move}
        <span class="note">${currentPreset.notes[item.move]}</span>
    `;

    button.onclick = async () => {
        await enableAudio();
        handleMove(item.move);
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
