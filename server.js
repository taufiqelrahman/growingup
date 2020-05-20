const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const path = require('path');
const helmet = require('helmet');
const app = express();
const axios = require('axios');
require('dotenv').config();

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.get('/ping', function (req, res) {
  return res.send('pong');
});

const requestValidation = (req) => {
  const userCookie = req.headers.cookie.split(';').filter((cookie) => cookie.includes('user='));
  cryptedToken = userCookie[0].split('=')[1];
  token = cryptedToken ? decryptTokenServer(cryptedToken) : '';
  const secureOptions = Object.assign({}, options, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return axios.get('/is-admin', secureOptions);
};
const redirectNonAdmin = (res, next) => {
  res.redirect(process.env.CLIENT_URL);
  next();
};
const proceedAdmin = (res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};
const validateAuth = async (req, res, next) => {
  try {
    if (req.cookies['isAdmin']) {
      proceedAdmin(res);
      return;
    }
    if (req.cookies['user']) {
      const { data } = await requestValidation(req);
      if (!data.is_admin) redirectNonAdmin(res, next);
      res.cookie('isAdmin', data, { maxAge: 1440000 });
      proceedAdmin(res);
      return;
    }
    redirectNonAdmin(res, next);
  } catch (err) {
    redirectNonAdmin(res, next);
  }
};
app.get('/', validateAuth);
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', validateAuth);
app.listen(process.env.PORT || 80);
