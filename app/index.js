const app = express();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env') });
const indexRouter = require('./routes');
const cors = require('cors');
const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

// cors
app.use(cors());
app.options('*', cors());

// application/json 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//front end chat app
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

//route for api broadcasting
app.use('/api', indexRouter);

// error handling api not found
app.use((req, res, next) => {
  next(createError(404, 'api not found'));
});
/* error handler */
app.use(function (err, req, res, next) {
  /* set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  res.send({ message: err.message || 'error' });
});

module.exports = app;
