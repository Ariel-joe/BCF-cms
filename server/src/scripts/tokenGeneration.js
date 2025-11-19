import { randomInt } from "crypto";

export const TokenGenerator = async () => {
    const length = 7;

    // start with digits
    const chars = Array.from({ length }, () => String(randomInt(0, 10)));

    // choose how many letters to insert: at least 3, up to length
    const minLetters = 3;
    const lettersCount = randomInt(minLetters, length + 1); // randomInt is [min, max)

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // pick unique positions to replace with letters
    const positions = new Set();
    while (positions.size < lettersCount) {
        positions.add(randomInt(0, length));
    }

    for (const pos of positions) {
        chars[pos] = letters.charAt(randomInt(0, letters.length));
    }

    return chars.join("");
};
