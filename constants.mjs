import { ANSI } from "./utils/ANSI.mjs";
// Files and folders
const LEVEL_LISTING_FILE = "./data/levels.txt";
const MAP_DIRECTORY = "./data/maps/";
const DATA_DIR = "./data/";


// Game specific constants.
const START_LEVEL_ID = "start";
const A_SHARP_PLACE = "aSharpPlace";
const ROOM_3 = "room3"

const MAP_CONTENT = {
    EMPTY: " ",
    HERO: "H",
    LOOT: "$",
    DOOR_1: "1",
    DOOR_2: "2",
    DOOR_3: "3",
    DOOR_4: "4",
    TELEPORT: "\u2668"
};

const PALLET = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
    "X": ANSI.COLOR.BLACK
};

const THINGS = [
    MAP_CONTENT.LOOT, 
    MAP_CONTENT.EMPTY
];

const PLAYER_TRANSPORTATION = [
    MAP_CONTENT.DOOR_1,
    MAP_CONTENT.DOOR_2,
    MAP_CONTENT.DOOR_3,
    MAP_CONTENT.DOOR_4,
    MAP_CONTENT.TELEPORT
];

// Scalar constants 
const NEWLINE = "\n";



export { LEVEL_LISTING_FILE, MAP_DIRECTORY, NEWLINE, DATA_DIR, START_LEVEL_ID, A_SHARP_PLACE, ROOM_3, PLAYER_TRANSPORTATION, THINGS, PALLET, MAP_CONTENT };