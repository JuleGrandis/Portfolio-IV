import { ANSI } from "./utils/ANSI.mjs";
import KeyBoardManager from "./utils/KeyBoardManager.mjs";
import LevelManager from "./gameLogic/levelHandler.mjs";
import Player from "./gameLogic/playerLogic.mjs";
import * as CONST from "./constants.mjs";
import { isSetIterator } from "util/types";

const levelManager = new LevelManager();
const player = new Player();
const startingLevel = CONST.START_LEVEL_ID;
const secondLevel = CONST.A_SHARP_PLACE;
const thirdLevel = CONST.ROOM_3;
let level = levelManager.loadLevel(startingLevel);

let direction = -1;
let isDirty = true;
let eventText = "";

class Labyrinth {

    constructor() {
        this.lastEventTime = 0;
        this.eventDuration = 2000;
    }

    update() {

        if (player.getPosition().row === null) {
            player.setPosition(6, 4);
        }

        findSymbol(CONST.MAP_CONTENT.HERO);

        let dRow = 0;
        let dCol = 0;

        if (KeyBoardManager.isUpPressed()) dRow = -1;
        if (KeyBoardManager.isDownPressed()) dRow = 1;
        if (KeyBoardManager.isLeftPressed()) dCol = -1;
        if (KeyBoardManager.isRightPressed()) dCol = 1;

        let tRow = player.getPosition().row + dRow;
        let tcol = player.getPosition().col + dCol;

        if (CONST.THINGS.includes(level[tRow][tcol])) { // Is there anything where Hero is moving to
            let currentItem = level[tRow][tcol];

            if (currentItem == CONST.MAP_CONTENT.LOOT) {
                let loot = Math.round(Math.random() * 7) + 3;
                player.gainLoot(loot);
                eventText = `Player gained ${loot}$`;
                this.lastEventTime = Date.now();

            }

            // Move the HERO
            level[player.getPosition().row][player.getPosition().col] = CONST.MAP_CONTENT.EMPTY;
            level[tRow][tcol] = CONST.MAP_CONTENT.HERO;

            // Update the HERO
            player.move(dRow, dCol);

            // Make the draw function draw.
            isDirty = true;
        } else {
            direction *= -1;
        }

        if (CONST.PLAYER_TRANSPORTATION.includes(level[tRow][tcol])) { // Is there anything where Hero is moving to
            let currentItem = level[tRow][tcol];

            if (currentItem == CONST.MAP_CONTENT.DOOR_1) {
                level = levelManager.loadLevel(secondLevel);
                player.setPosition(2, 1);      
            } else if (currentItem == CONST.MAP_CONTENT.DOOR_2) {
                level = levelManager.loadLevel(startingLevel);
                player.setPosition(2, 27);
            } else if (currentItem == CONST.MAP_CONTENT.DOOR_3) {
                level = levelManager.loadLevel(thirdLevel);
                player.setPosition(1, 17);
            } else if (currentItem == CONST.MAP_CONTENT.DOOR_4) {
                level = levelManager.loadLevel(secondLevel);
                player.setPosition(14, 16);
            } else if(currentItem == CONST.MAP_CONTENT.TELEPORT) {
                level[player.getPosition().row][player.getPosition().col] = CONST.MAP_CONTENT.EMPTY;
                level[tRow][tcol] = CONST.MAP_CONTENT.EMPTY;
                player.setPosition(null, null);

                if (player.getPosition().row == null) {
                    for (let row = 0; row < level.length; row++) {
                        for (let col = 0; col < level[row].length; col++) {
                            if (level[row][col] == CONST.MAP_CONTENT.TELEPORT) {
                                tRow = row;
                                tcol = col;
                                level[tRow][tcol] = CONST.MAP_CONTENT.HERO;
                                player.setPosition(tRow, tcol);
                                isDirty = true;
                                break;
                            }
                        }
                        if (player.getPosition().row != undefined) {
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

        if (!isDirty) {
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
                if (CONST.PALLET[symbol] != undefined) {
                    rowRendering += CONST.PALLET[symbol] + symbol + ANSI.COLOR_RESET;
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
    let hpBar = `Life:[${ANSI.COLOR.RED + pad(player.getStats().hp, "♥︎") + ANSI.COLOR_RESET}${ANSI.COLOR.LIGHT_GRAY + pad(10 - player.getStats().hp, "♥︎") + ANSI.COLOR_RESET}]`
    let cash = `$:${player.getStats().cash}`;
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
    if (player.getPosition().row == null) {
        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                if (level[row][col] == symbol) {
                    player.setPosition(row, col);
                    break;
                }
            }
            if (player.getPosition().row != undefined) {
                break;
            }
        }
    }
}
               
export default Labyrinth;