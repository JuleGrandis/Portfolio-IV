import * as CONST from "../constants.mjs";
import Player from "./playerLogic.mjs";

class NPCLogic {
    constructor(level) {
        this.level = level;
        this.npcs = [];
        this.playerLogic = new Player();
        this.directions = [
            { dRow: -1, dCol: 0},
            { dRow: 1, dCol: 0},
            { dRow: 0, dCol: -1},
            { dRow: 0, dCol: 1}
        ];

        this.findNPCs();
    }

    findNPCs() {
        this.npcs = [];
        for (let row = 0; row < this.level.length; row++) {
            for (let col = 0; col < this.level[row].length; col++) {
                if (this.level[row][col] === "X") {
                    this.npcs.push({ row, col});
                }
            }
        }
    }

    removeNPC(row, col) {
        for (let i = 0; i < this.npcs.length; i++) {
            let npc = this.npcs[i];
            if (npc.row === row && npc.col === col) {
                this.npcs.splice(i, 1);
                break;
            }
        }
    }

    isValidMove (row, col) {
        if (
            row < 0 || row >= this.level.length ||
            col < 0 || col >= this.level[0].length
        ) {
            return false;
        }

        const target = this.level[row][col];
        if (target === CONST.MAP_CONTENT.EMPTY || target === " ") {
            return true;
        }

        if (target === "X" || target === "█" || target === "◀︎" || target == "►" || target === CONST.MAP_CONTENT.TELEPORT) {
            return false;
        }

        return false;
    }

    moveNPCs() {
        for (let npc of this.npcs) {
            let moved = false;

            const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            const newRow = npc.row + direction.dRow;
            const newCol = npc.col + direction.dCol;

            if (this.isValidMove(newRow, newCol)) {
                this.level[npc.row][npc.col] = CONST.MAP_CONTENT.EMPTY;
                this.level[newRow][newCol] = "X";

                npc.row = newRow;
                npc.col = newCol;
                moved = true;                
            }
        }
    }

    updateLevel(newLevel) {
        this.level = newLevel;
        this.findNPCs();
    }

    update() {
        this.moveNPCs();
    }
}

export default NPCLogic;