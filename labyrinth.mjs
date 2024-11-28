import { ANSI } from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import { readMapFile, readRecordFile } from "./utils/fileHelpers.mjs";
import * as CONST from "./constants.mjs";
import { isSetIterator } from "util/types";


const startingLevel = CONST.START_LEVEL_ID;
const secondLevel = CONST.A_SHARP_PLACE;
const thirdLevel = CONST.ROOM_3;
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

let direction = -1;
let isGameStarted = true;
let isDirty = true;
let eventText = "";
let playerPos = {
    row: null,
    col: null,
}
let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
}

const HP_MAX = 10;
const mapContent = {
    EMPTY: " ",    
    HERO: "H",
    LOOT: "$",
    DOOR_1: "1",
    DOOR_2: "2",
    DOOR_3: "3",
    DOOR_4: "4",
    TELEPORT: "\u2668"
}
const playerStats = {
    hp: 10,
    cash: 0
}
const THINGS = [mapContent.LOOT, mapContent.EMPTY];
const PLAYER_TRANSPORTATION =[mapContent.DOOR_1, mapContent.DOOR_2, mapContent.DOOR_3, mapContent.DOOR_4, mapContent.TELEPORT];

class Labyrinth {

    constructor() {
        this.lastEventTime = 0;
        this.eventDuration = 2000;
    }

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

        findSymbol(mapContent.HERO);

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
            if (currentItem == mapContent.LOOT) {
                let loot = Math.round(Math.random() * 7) + 3;
                playerStats.cash += loot;
                eventText = `Player gained ${loot}$`;
                this.lastEventTime = Date.now();

            }

            // Move the HERO
            level[playerPos.row][playerPos.col] = mapContent.EMPTY;
            level[tRow][tcol] = mapContent.HERO;

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

            if (currentItem == mapContent.DOOR_1) {
                levelData = readMapFile(levels[secondLevel]);
                level = levelData;
                playerPos.col = 1;        
            } else if (currentItem == mapContent.DOOR_2) {
                levelData = readMapFile(levels[startingLevel]);
                level = levelData;
                playerPos.col = 27;
            } else if (currentItem == mapContent.DOOR_3) {
                levelData = readMapFile(levels[thirdLevel]);
                level = levelData;
                playerPos.row = 1;
                playerPos.col = 17;
            } else if (currentItem == mapContent.DOOR_4) {
                levelData = readMapFile(levels[secondLevel]);
                level = levelData;
                playerPos.row = 14;
                playerPos.col = 16;
            } else if(currentItem == mapContent.TELEPORT) {
                level[playerPos.row][playerPos.col] = mapContent.EMPTY;
                level[tRow][tcol] = mapContent.EMPTY;
                playerPos.row = null;

                if (playerPos.row == null) {
                    for (let row = 0; row < level.length; row++) {
                        for (let col = 0; col < level[row].length; col++) {
                            if (level[row][col] == mapContent.TELEPORT) {
                                tRow = row;
                                tcol = col;
                                level[tRow][tcol] = mapContent.HERO;
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

        let rendering = "";

        rendering += renderHud();

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
            rendering += rowRendering;
        }

        console.log(rendering);
        if (eventText != "" && (Date.now() - this.lastEventTime) < this.eventDuration) {
            console.log(eventText);
        } else {
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