const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const path = require('path');
const helmet = require('helmet');
const app = express();
const axios = require('axios');
const Crypto = require('crypto');
require('dotenv').config();

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.get('/ping', function (req, res) {
  return res.send('pong');
});

const decryptTokenServer = (cryptedToken) => {
  let result = '';
  const secretKey = process.env.REACT_APP_SECRET_KEY || '';
  const secretIv = process.env.REACT_APP_SECRET_IV || '';
  const decipher = Crypto.createDecipheriv('aes-256-cbc', secretKey, secretIv);
  const dec = decipher.update(cryptedToken, 'hex', 'utf8');
  try {
    result = dec + decipher.final('utf8');
    // eslint-disable-next-line no-empty
  } catch (error) {}
  return result;
};

const requestValidation = (req) => {
  const userCookie = req.headers.cookie.split(';').filter((cookie) => cookie.includes('user='));
  cryptedToken = userCookie[0].split('=')[1];
  token = cryptedToken ? decryptTokenServer(cryptedToken) : '';
  const secureOptions = {
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get('/is-admin', secureOptions);
};
const redirectNonAdmin = (res) => {
  res.redirect(process.env.CLIENT_URL);
};
const renderAdmin = (res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};
const validateAuth = async (req, res) => {
  try {
    if (req.cookies['isAdmin']) {
      renderAdmin(res);
      return;
    }
    if (req.cookies['user']) {
      const { data } = await requestValidation(req);
      if (!data.is_admin) {
        redirectNonAdmin(res);
        return;
      }
      renderAdmin(res);
      res.cookie('isAdmin', data, { maxAge: 1440000 });
    } else {
      redirectNonAdmin(res);
    }
  } catch (err) {
    console.log(err);
    redirectNonAdmin(res);
  }
};
app.get('/', validateAuth);
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', validateAuth);
app.listen(process.env.PORT || 80);
