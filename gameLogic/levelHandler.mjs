import { readMapFile, readRecordFile } from "../utils/fileHelpers.mjs";
import * as CONST from "../constants.mjs"

class LevelManager {
    constructor() {
        this.levels = this.loadLevelListings();
        this.currentLevel = null;
    }

    loadLevelListings(source = CONST.LEVEL_LISTING_FILE) {
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

    loadLevel(levelName) {
        const levelData = readMapFile(this.levels[levelName]);
        this.currentLevel = levelData;
        return levelData;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }
}

export default LevelManager;