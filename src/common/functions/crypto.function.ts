import * as crypto from 'crypto';

export function randomNumber(length: number): string {
  let randomNumber = '';
  for (let i = 0; i < length; i++) {
    randomNumber += crypto.randomInt(0, 10).toString();
  }
  return randomNumber;
}

export function alphaNumeric(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
