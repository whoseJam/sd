const numberCharacters = "0123456789";
const lowerCaseAlphabetCharacters = "abcdefghijklmnopqrstuvwxyz";
const upperCaseAlphabetCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const specialCharacters = "!@#$%^&*()_+-=<>,.?:;'[]{}|";
const allCharacters =
  numberCharacters +
  lowerCaseAlphabetCharacters +
  upperCaseAlphabetCharacters +
  specialCharacters;

export function rand(l: number, r: number): number {
  const l_ = +l;
  const r_ = +r;
  const ans = Math.floor(Math.random() * (r_ - l_ + 1));
  return Math.min(Math.max(l_ + ans, l_), r_);
}

export function randChar(): string {
  return allCharacters[rand(0, allCharacters.length - 1)];
}

export function randLowerCaseAlphabet(): string {
  return lowerCaseAlphabetCharacters[
    rand(0, lowerCaseAlphabetCharacters.length - 1)
  ];
}

export function randUpperCaseAlphabet(): string {
  return upperCaseAlphabetCharacters[
    rand(0, upperCaseAlphabetCharacters.length - 1)
  ];
}

export function randSpecialChar(): string {
  return specialCharacters[rand(0, specialCharacters.length - 1)];
}
