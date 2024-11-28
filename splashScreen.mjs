import { ANSI } from "./utils/ANSI.mjs";
import oscillate from "./utils/oscilate.mjs";


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
        this.colorOscillator = oscillate(0, 255, 5);
        this.colRef = OUTPUT_GRAPHICS;
    }

    update () {
        const intensity = Math.round(this.colorOscillator());
        const currentColor = `\u001b[38;2;${intensity};${intensity};${intensity}m`;

        const redGradient = (charIndex) => {
            const intensity = 100 + (charIndex % 155);
            return `\u001b[38;2;${intensity};0;0m`;
        };


        this.colRef = Array.from(OUTPUT_GRAPHICS)
            .map((char, index) => {
                if (char === "█") {
                    return `${currentColor}█${ANSI.RESET}`;
                }
                return `${redGradient(index)}${char}${ANSI.RESET}`;
            })
            .join("");
    }

    draw() {
        console.log(ANSI.CLEAR_SCREEN, this.colRef, ANSI.CURSOR_HOME);
    }
}

export default SplashScreen;