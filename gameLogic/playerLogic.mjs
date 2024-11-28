import * as CONST from "../constants.mjs";

class Player {
    constructor() {
        this.position = {row: null, col: null};
        this.stats = {
            hp: 10,
            cash: 0
        };
    }

    setPosition(row, col) {
        this.position.row = row;
        this.position.col = col;
    }

    getPosition() {
        return this.position;
    }

    move(dRow, dCol) {
        this.position.row += dRow;
        this.position.col += dCol;
    }

    gainLoot(amount) {
        this.stats.cash += amount;
    }

    teleport(newRow, newCol) {
        this.setPosition(newRow, newCol);
    }

    getStats() {
        return this.stats;
    }
}

export default Player;