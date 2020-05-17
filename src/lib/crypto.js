import CryptoJS from 'crypto-js';
import Crypto from 'crypto';
require('dotenv').config();

// for server
const secretKey = process.env.SECRET_KEY || '';
const secretIv = process.env.SECRET_IV || '';
// for client
const parsedKey = CryptoJS.enc.Utf8.parse(secretKey);
const parsedIv = CryptoJS.enc.Utf8.parse(secretIv);

export function encryptTokenClient(token) {
  const options = { mode: CryptoJS.mode.CBC, iv: parsedIv };
  const json = CryptoJS.AES.encrypt(token, parsedKey, options);
  return json.ciphertext.toString(CryptoJS.enc.Hex);
}

export const decryptTokenClient = (cryptedToken) => {
  let result = '';
  const options = { mode: CryptoJS.mode.CBC, iv: parsedIv };
  try {
    const json = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(cryptedToken),
      },
      parsedKey,
      options,
    );
    result = json.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const decryptTokenServer = (cryptedToken) => {
  let result = '';
  const decipher = Crypto.createDecipheriv('aes-256-cbc', secretKey, secretIv);
  const dec = decipher.update(cryptedToken, 'hex', 'utf8');
  try {
    result = dec + decipher.final('utf8');
  } catch (error) {
    console.log(error);
  }
  return result;
};

export default {
  encryptTokenClient,
  decryptTokenClient,
  decryptTokenServer,
};
