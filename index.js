const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const connectDB = require('./databse/db');
const authRouter = require('./routes/api/auth');
const postRouter = require('./routes/api/posts');
const profileRouter = require('./routes/api/profiles');
const userRouter = require('./routes/api/users');
// const morgan = require('morgan');
connectDB();
app.use(cors());
// app.use(morgan('combined'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', postRouter);
app.use('/api', profileRouter);

app.listen(process.env.PORT || port);
