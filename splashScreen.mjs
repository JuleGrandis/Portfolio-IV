import { ANSI } from "./utils/ANSI.mjs";


const OUTPUT_GRAPHICS = `
 ██▓    ▄▄▄       ▄▄▄▄ ▓██   ██▓ ██▀███   ██▓ ███▄    █ ▄▄▄█████▓ ██░ ██
▓██▒   ▒████▄    ▓█████▄▒██  ██▒▓██ ▒ ██▒▓██▒ ██ ▀█   █ ▓  ██▒ ▓▒▓██░ ██▒
▒██░   ▒██  ▀█▄  ▒██▒ ▄██▒██ ██░▓██ ░▄█ ▒▒██▒▓██  ▀█ ██▒▒ ▓██░ ▒░▒██▀▀██░
▒██░   ░██▄▄▄▄██ ▒██░█▀  ░ ▐██▓░▒██▀▀█▄  ░██░▓██▒  ▐▌██▒░ ▓██▓ ░ ░▓█ ░██
░██████▒▓█   ▓██▒░▓█  ▀█▓░ ██▒▓░░██▓ ▒██▒░██░▒██░   ▓██░  ▒██▒ ░ ░▓█▒░██▓
░ ▒░▓  ░▒▒   ▓▒█░░▒▓███▀▒ ██▒▒▒ ░ ▒▓ ░▒▓░░▓  ░ ▒░   ▒ ▒   ▒ ░░    ▒ ░░▒░▒
░ ░ ▒  ░ ▒   ▒▒ ░▒░▒   ░▓██ ░▒░   ░▒ ░ ▒░ ▒ ░░ ░░   ░ ▒░    ░     ▒ ░▒░ ░
  ░ ░    ░   ▒    ░    ░▒ ▒ ░░    ░░   ░  ▒ ░   ░   ░ ░   ░       ░  ░░ ░
    ░  ░     ░  ░ ░     ░ ░        ░      ░           ░           ░  ░  ░
                       ░░ ░
`;



class SplashScreen {

    constructor() {
        this.color = ANSI.COLOR.WHITE;
        this.number = 0;
        this.isAscending = false;
        this.colRef = OUTPUT_GRAPHICS;
    }

    updateColor() {
        const step = 30;
        const max = 300;
        const min = 0;

        if (this.isAscending) {
            this.number += step / 3;
            if (this.number >= max) this.isAscending = false;
        } else {
            this.number -= step;
            if(this.number <= min) this.isAscending = true;
        }

        this.color = `\u001b[38;2;${this.number};${this.number};${this.number}m`;
    }

    generateBuffer() {
        this.colRef = Array.from(OUTPUT_GRAPHICS)
            .map((char) =>
                char === "█"
                    ? `${this.color}█${ANSI.RESET}`
                    : `\x1b[38;5;57m${char}${ANSI.RESET}`
            )
            .join("");
    }

    update() {
        this.updateColor();
        this.generateBuffer();
    }

    draw() {
        console.log(ANSI.CLEAR_SCREEN, this.colRef, ANSI.CURSOR_HOME);
    }


}

export default SplashScreen;