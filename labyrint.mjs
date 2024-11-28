import ANSI from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";
import { isSetIterator } from "util/types";


const startingLevel = CONST.START_LEVEL_ID;
const secondLevel = CONST.A_SHARP_PLACE;
const levels = loadLevelListings();

function loadLevelListings(source = CONST.LEVEL_LISTING_FILE) {
    let data = readRecordFile(source);
    let levels = {};
    for (const item of data) {
        let keyValue = item.split(":");
        if (keyValue.length >= 2) {
            let key = keyValue[0];
            let value = keyValue[1];
            levels[key] = value;
        }
    }
    return levels;
}

let levelData = readMapFile(levels[startingLevel]);
let level = levelData;

let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
}

let isDirty = true;

let playerPos = {
    row: null,
    col: null,
}

const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const DOOR_1 = "1";
const DOOR_2 = "2";
const DOOR_3 = "3";
const TELEPORT = "\u2668";

let direction = -1;

let items = [];

const THINGS = [LOOT, EMPTY];
const PLAYER_TRANSPORTATION =[DOOR_1, DOOR_2, DOOR_3, TELEPORT];

let eventText = "";
let prevDoorUsed = null;

const HP_MAX = 10;

const playerStats = {
    hp: 8,
    cash: 0
}

let isGameStarted = true;
class Labyrinth {

    update() {

        if (isGameStarted) {
            playerPos.row = 6;
            playerPos.col = 4;
            isGameStarted = false;
        } else {
            if (playerPos.row === null) {
                playerPos.row = null;
                playerPos.col = null;
            }
        }

        findSymbol(HERO);

        let dRow = 0;
        let dCol = 0;

        if (KeyBoardManager.isUpPressed()) {
            dRow = -1;
        } else if (KeyBoardManager.isDownPressed()) {
            dRow = 1;
        }

        if (KeyBoardManager.isLeftPressed()) {
            dCol = -1;
        } else if (KeyBoardManager.isRightPressed()) {
            dCol = 1;
        }

        let tRow = playerPos.row + (1 * dRow);
        let tcol = playerPos.col + (1 * dCol);

        if (THINGS.includes(level[tRow][tcol])) { // Is there anything where Hero is moving to

            let currentItem = level[tRow][tcol];
            if (currentItem == LOOT) {
                let loot = Math.round(Math.random() * 7) + 3;
                playerStats.cash += loot;
                eventText = `Player gained ${loot}$`;
            }

            // Move the HERO
            level[playerPos.row][playerPos.col] = EMPTY;
            level[tRow][tcol] = HERO;

            // Update the HERO
            playerPos.row = tRow;
            playerPos.col = tcol;

            // Make the draw function draw.
            isDirty = true;
        } else {
            direction *= -1;
        }

        if (PLAYER_TRANSPORTATION.includes(level[tRow][tcol])) { // Is there anything where Hero is moving to
            let currentItem = level[tRow][tcol];
            prevDoorUsed = currentItem;

            if (currentItem == DOOR_1) {
                levelData = readMapFile(levels[secondLevel]);
                level = levelData;
                playerPos.col = 1;        
            } else if (currentItem == DOOR_2) {
                levelData = readMapFile(levels[startingLevel]);
                level = levelData;
                playerPos.col = 27;
            } else if (currentItem == TELEPORT) {
                level[playerPos.row][playerPos.col] = EMPTY;
                level[tRow][tcol] = EMPTY;
                playerPos.row = null;

                if (playerPos.row == null) {
                    for (let row = 0; row < level.length; row++) {
                        for (let col = 0; col < level[row].length; col++) {
                            if (level[row][col] == TELEPORT) {
                                tRow = row;
                                tcol = col;
                                level[tRow][tcol] = HERO;
                                playerPos.row = tRow;
                                playerPos.col = tcol;
                                isDirty = true;
                                break;
                            }
                        }
                        if (playerPos.row != undefined) {
                            break;
                        }
                    }
                }
            }

            // Make the draw function draw.
            isDirty = true;
        } else {
            direction *= -1;
        }
    }

    draw() {

        if (isDirty == false) {
            return;
        }
        isDirty = false;

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

        let rendring = "";

        rendring += renderHud();

        for (let row = 0; row < level.length; row++) {
            let rowRendering = "";
            for (let col = 0; col < level[row].length; col++) {
                let symbol = level[row][col];
                if (pallet[symbol] != undefined) {
                    rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
                } else {
                    rowRendering += symbol;
                }
            }
            rowRendering += "\n";
            rendring += rowRendering;
        }

        console.log(rendring);
        if (eventText != "") {
            console.log(eventText);
            eventText = "";
        }
    }
}

function renderHud() {
    let hpBar = `Life:[${ANSI.COLOR.RED + pad(playerStats.hp, "♥︎") + ANSI.COLOR_RESET}${ANSI.COLOR.LIGHT_GRAY + pad(HP_MAX - playerStats.hp, "♥︎") + ANSI.COLOR_RESET}]`
    let cash = `$:${playerStats.cash}`;
    return `${hpBar} ${cash}\n`;
}

function pad(len, text) {
    let output = "";
    for (let i = 0; i < len; i++) {
        output += text;
    }
    return output;
}

function findSymbol (symbol) {
    if (playerPos.row == null) {
        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                if (level[row][col] == symbol) {
                    playerPos.row = row;
                    playerPos.col = col;
                    break;
                }
            }
            if (playerPos.row != undefined) {
                break;
            }
        }
    }
}
               
export default Labyrinth;