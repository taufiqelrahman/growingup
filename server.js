const express = require('express');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const api = require('./src/services/api');
app.use(cookieParser());
require('dotenv').config();

app.get('/ping', function (req, res) {
 return res.send('pong');
});

const redirectNonAdmin = (res, next) => {
  res.redirect(process.env.CLIENT_URL);
  next();
}
const proceedAdmin = (res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};
const validateAuth = async (req, res, next) => {
  try {
    if (req.cookies['isAdmin']) {
      proceedAdmin(res);
      return
    }
    if (req.cookies['user']) {
      const { data } = await api.default(req).users.isAdmin()
      if (!data.is_admin) redirectNonAdmin(res, next);
      res.cookie('isAdmin', data, { maxAge: 1440000 });
      proceedAdmin(res);
      return;
    }
    redirectNonAdmin(res, next);
  } catch (err) {
    redirectNonAdmin(res, next);
  }
}
app.get('/', function (req, res, next) {
  validateAuth(req, res, next);
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function (req, res, next) {
  validateAuth(req, res, next);
});
app.listen(process.env.PORT || 8080);