const numberCharacters = "0123456789";
const lowerCaseAlphabetCharacters = "abcdefghijklmnopqrstuvwxyz";
const upperCaseAlphabetCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const specialCharacters = "!@#$%^&*()_+-=<>,.?:;'[]{}|";
const hexCharacters = "0123456789abcdef";
const allCharacters = 
    numberCharacters + 
    lowerCaseAlphabetCharacters + 
    upperCaseAlphabetCharacters + 
    specialCharacters;

export function rand(l, r) {
    l = +l;
    r = +r;
    const ans = Math.floor(Math.random() * (r - l + 2));
    return Math.min(Math.max(l + ans, l), r);
}

export function randChar() {
    return allCharacters[rand(0, allCharacters.length - 1)];
}

export function randLowerCaseAlphabet() {
    return lowerCaseAlphabetCharacters[rand(0, lowerCaseAlphabetCharacters.length - 1)];
}

export function randUpperCaseAlphabet() {
    return upperCaseAlphabetCharacters[rand(0, upperCaseAlphabetCharacters.length - 1)];
}

export function randSpecialChar() {
    return specialCharacters[rand(0, specialCharacters.length - 1)];
}

export function randHexColor() {
    function randHex() {
        return hexCharacters[rand(0, hexCharacters.length - 1)];
    }
    return "#" + randHex() + randHex() + randHex() + randHex() + randHex() + randHex();
}