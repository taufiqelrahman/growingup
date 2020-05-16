import axios from 'axios';
import Cookies from 'js-cookie';
import Users from './users';
import { decryptTokenClient, decryptTokenServer } from '../../lib/crypto';
require('dotenv').config();

const options = {
  baseURL: `${process.env.API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
}
const createAdapter = () => {
  return axios.create(options);
}

const createSecureAdapter = (req) => {
  let token;
  if (req) {
    // if server-side
    const userCookie = req.headers.cookie.split(';').filter(cookie => cookie.includes('user='));
    const cryptedToken = userCookie[0].split('=')[1];
    token = !!cryptedToken ? decryptTokenServer(cryptedToken) : '';
  } else {
    // if client-side
    const cryptedToken = Cookies.get('user');
    token = !!cryptedToken ? decryptTokenClient(cryptedToken) : '';
  }
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }
  return axios.create(secureOptions);
}

export default (req) => {
  const instance = createAdapter();
  const secure = createSecureAdapter(req);
  const adapter = {
    default: instance,
    secure: secure,
  }
  return {
    users: new Users(adapter),
  }
};
