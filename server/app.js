const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const PORT = process.env.PORT || 5000;
const User = require('./models/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(cors());

app.use((req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  jwt.verify(
    token,
    'kishan sheth super secret key',
    async (err, decodedToken) => {
      if (err) {
        return next();
      }
      await User.findById(decodedToken.id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => console.log(err));
    }
  );
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(authRoutes);
app.use('/api', userRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {});
  })
  .catch(err => console.log(err));
