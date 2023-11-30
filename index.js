// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/weather_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', {
  username: String,
  password: String,
});

app.use(cors({
  origin: ['http://localhost:3000']
}));

app.use(bodyParser.json());


app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Incorrect password');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});