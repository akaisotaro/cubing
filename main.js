
import {
    connectGanCube
} from "https://cdn.jsdelivr.net/npm/gan-web-bluetooth@3.0.2/+esm";

const moves = [
    null,
    { move: "U'" },
    { move: "U" },
    null,
    { move: "L" },
    { move: "B'" },
    { move: "B" },
    { move: "R'" },
    { move: "L'" },
    { move: "F" },
    { move: "F'" },
    { move: "R" },
    null,
    { move: "D" },
    { move: "D'" },
    null
];

const PRESET_COUNT = 3;

const presets = {

    preset1: {

        name: "Preset 1",

        // 各面の色
        faceColors: {

            "U": "#8f8f8f",
            "F": "#366936",
            "D": "#7c7c3f",
            "L": "#81623e",
            "R": "#834141",
            "B": "#415a80"

        },

        // 各回転に対応する音声
        sounds: {

            "U":  "sounds/preset1/D.mp3",
            "U'": "sounds/preset1/Gs.mp3",

            "R":  "sounds/preset1/C.mp3",
            "R'": "sounds/preset1/Fs.mp3",

            "F":  "sounds/preset1/F.mp3",
            "F'": "sounds/preset1/B.mp3",

            "D":  "sounds/preset1/Cs.mp3",
            "D'": "sounds/preset1/G.mp3",

            "L":  "sounds/preset1/E.mp3",
            "L'": "sounds/preset1/As.mp3",

            "B":  "sounds/preset1/Ds.mp3",
            "B'": "sounds/preset1/A.mp3"

        },

        // 各回転に対応する表示文字
        notes: {

            "U'": "Gs",
            "U":  "D",

            "L":  "E",

            "B'": "A",
            "B":  "Ds",

            "R'": "Fs",

            "L'": "As",

            "F":  "F",
            "F'": "B",

            "R":  "C",

            "D":  "Cs",
            "D'": "G"

        }

    },


    preset2: {

        name: "Preset 2",

        faceColors: {

            "U": "#8f8f8f",
            "F": "#366936",
            "D": "#7c7c3f",
            "L": "#81623e",
            "R": "#834141",
            "B": "#415a80"

        },

        sounds: {

            "U":  "sounds/preset2/C.mp3",
            "U'": "sounds/preset2/C.mp3",

            "R":  "sounds/preset2/C.mp3",
            "R'": "sounds/preset2/C.mp3",

            "F":  "sounds/preset2/C.mp3",
            "F'": "sounds/preset2/C.mp3",

            "D":  "sounds/preset2/C.mp3",
            "D'": "sounds/preset2/C.mp3",

            "L":  "sounds/preset2/C.mp3",
            "L'": "sounds/preset2/C.mp3",

            "B":  "sounds/preset2/C.mp3",
            "B'": "sounds/preset2/C.mp3"

        },

        notes: {

            "U'": "C",
            "U":  "C",

            "L":  "C",

            "B'": "C",
            "B":  "C",

            "R'": "C",

            "L'": "C",

            "F":  "C",
            "F'": "C",

            "R":  "C",

            "D":  "C",
            "D'": "C"

        }

    },


    preset3: {

        name: "Preset 3",

        faceColors: {

            "U": "#8f8f8f",
            "F": "#366936",
            "D": "#7c7c3f",
            "L": "#81623e",
            "R": "#834141",
            "B": "#415a80"

        },

        sounds: {

            "U":  "sounds/preset3/bd1.mp3",
            "U'": "sounds/preset3/sn1.mp3",

            "R":  "sounds/preset3/hh1.mp3",
            "R'": "sounds/preset3/hh1.mp3",

            "F":  "sounds/preset3/hh2.mp3",
            "F'": "sounds/preset3/hh2.mp3",

            "D":  "sounds/preset3/clap1.mp3",
            "D'": "sounds/preset3/stab1.mp3",

            "L":  "sounds/preset3/hh1.mp3",
            "L'": "sounds/preset3/hh1.mp3",

            "B":  "sounds/preset3/hh2.mp3",
            "B'": "sounds/preset3/hh2.mp3"

        },

        notes: {

            "U'": "sn1",
            "U":  "bd1",

            "L":  "hh1",

            "B'": "hh2",
            "B":  "hh2",

            "R'": "hh1",

            "L'": "hh1",

            "F":  "hh2",
            "F'": "hh2",

            "R":  "hh1",

            "D":  "clap1",
            "D'": "stab1"

        }

    }

};


// ==================================================
// DOM
// ==================================================

const current =
    document.getElementById("current");

const buttons =
    document.getElementById("buttons");

const connectButton =
    document.getElementById("connect");

const presetSelect =
    document.getElementById("preset");


// ==================================================
// 現在のプリセット
// ==================================================

let currentPreset =
    presets.preset1;


// ==================================================
// AudioContext
// ==================================================

const audio =
    new AudioContext();


// ==================================================
// AudioBuffer
// ==================================================

const audioBuffers = {};


// ==================================================
// AudioContextを有効化
// ==================================================

async function enableAudio() {

    if (
        audio.state === "suspended"
    ) {

        await audio.resume();

    }

}


// ==================================================
// 音声読み込み
// ==================================================

async function loadSound(
    move,
    path
) {

    console.log(
        "Loading:",
        move,
        path
    );


    const response =
        await fetch(path);


    if (!response.ok) {

        throw new Error(
            `Failed to load: ${path}`
        );

    }


    const arrayBuffer =
        await response.arrayBuffer();


    const audioBuffer =
        await audio.decodeAudioData(
            arrayBuffer
        );


    audioBuffers[move] =
        audioBuffer;


    console.log(
        "Loaded:",
        move
    );

}


// ==================================================
// 現在のプリセットの音声を読み込む
// ==================================================

async function loadPresetSounds() {

    // 既存の音声を削除
    for (
        const key
        of Object.keys(audioBuffers)
    ) {

        delete audioBuffers[key];

    }


    const promises = [];


    for (
        const [move, path]
        of Object.entries(
            currentPreset.sounds
        )
    ) {

        promises.push(
            loadSound(
                move,
                path
            )
        );

    }


    await Promise.all(
        promises
    );


    console.log(
        "Preset sounds loaded:",
        currentPreset.name
    );

}


// ==================================================
// 音声再生
// ==================================================

function playSound(move) {

    const buffer =
        audioBuffers[move];


    if (!buffer) {

        console.warn(
            "AudioBuffer not found:",
            move
        );

        return;

    }


    const source =
        audio.createBufferSource();


    source.buffer =
        buffer;


    source.connect(
        audio.destination
    );


    source.start();

}


// ==================================================
// ボタンの表示を更新
// ==================================================

function updateButtons() {

    const buttonElements =
        document.querySelectorAll(
            "#buttons button"
        );

    buttonElements.forEach(
        button => {

            const move =
                button.dataset.move;

            // U' → U
            // R' → R
            const face =
                move.replace(
                    "'",
                    ""
                );

            // 色を変更
            button.style.backgroundColor =
                currentPreset.faceColors[face];

            button.style.color =
                "#000000";

            // 表示文字を変更
            const note =
                button.querySelector(
                    ".note"
                );

            // soundsのファイル名を取得して表示
            const soundPath =
                currentPreset.sounds[move];

            const fileName =
                soundPath.split("/").pop().replace(".mp3", "");

            note.textContent =
                fileName;

        }
    );

}




// ==================================================
// 回転処理
// ==================================================

function handleMove(move) {

    console.log(
        "MOVE:",
        move
    );


    // 現在の回転を表示
    current.textContent =
        move;


    // 音声再生
    playSound(
        move
    );

}


// ==================================================
// 手動ボタン生成
// ==================================================

for (const item of moves) {

    if (item === null) {

        buttons.appendChild(
            document.createElement(
                "div"
            )
        );

        continue;

    }

    const button =
        document.createElement(
            "button"
        );

    button.dataset.move =
        item.move;

    // soundsのファイル名を取得して表示
    const soundPath =
        currentPreset.sounds[item.move];

    const fileName =
        soundPath.split("/").pop().replace(".mp3", "");

    button.innerHTML = `
        ${item.move}
        <span class="note">
            ${fileName}
        </span>
    `;

    button.onclick = async () => {

        await enableAudio();

        handleMove(
            item.move
        );

    };

    buttons.appendChild(
        button
    );

}


// ==================================================
// プリセット選択肢を生成
// ==================================================

for (
    let i = 1;
    i <= PRESET_COUNT;
    i++
) {

    const key =
        `preset${i}`;


    if (!presets[key]) {

        console.warn(
            `Preset not found: ${key}`
        );

        continue;

    }


    const option =
        document.createElement(
            "option"
        );


    option.value =
        key;


    option.textContent =
        presets[key].name;


    presetSelect.appendChild(
        option
    );

}


// ==================================================
// プリセット変更
// ==================================================

presetSelect.onchange =
    async (event) => {

        const presetKey =
            event.target.value;


        currentPreset =
            presets[presetKey];


        console.log(
            "Preset changed:",
            currentPreset.name
        );


        // ボタンの色と文字を更新
        updateButtons();


        // 音声を読み込み
        try {

            await loadPresetSounds();

        } catch (error) {

            console.error(
                "Failed to load preset sounds:",
                error
            );

        }

    };


// ==================================================
// GANキューブ接続
// ==================================================

connectButton.onclick =
    async () => {

        try {

            await enableAudio();


            const conn =
                await connectGanCube(
                    async () => {

                        return "70:19:88:8F:A4:58";

                    }
                );


            console.log(
                "GAN Connected"
            );


            connectButton.disabled =
                true;


            connectButton.textContent =
                "接続済み";


            conn.events$.subscribe(
                event => {

                    console.log(
                        event
                    );


                    if (
                        event.type === "MOVE"
                    ) {

                        handleMove(
                            event.move
                        );

                    }

                }
            );


        } catch (error) {

            console.error(
                "GAN connection error:",
                error
            );

        }

    };


// ==================================================
// 初期化
// ==================================================

async function initialize() {

    try {

        // ボタンの初期表示
        updateButtons();


        // 初期プリセットの音声を読み込む
        await loadPresetSounds();


        console.log(
            "Initialization complete"
        );


    } catch (error) {

        console.error(
            "Initialization error:",
            error
        );

    }

}


initialize();
