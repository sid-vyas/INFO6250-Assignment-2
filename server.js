const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5500" }));

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false}));

const questions = ['Q1. What is your name?', 'Q2. What is your favourite animal?', 'Q3. What is your birth place?'];

app.get('/api/questions', (req, res) => {
  req.session.index = req.session.index || 0;

  if (req.session.index >= questions.length) {
      return res.json({ question: 'No more questions', status: true, index: req.session.index, total: questions.length });
  }

  const question = questions[req.session.index];

  return res.json({ question, status: false, index: req.session.index, total: questions.length });
});

app.post('/api/submit', (req, res) => {
  const answer = req.body.answer;
  req.session.index = req.session.index || 0;
  req.session.answers = req.session.answers || [];

  if (req.session.index >= questions.length) {
      return res.json({ question: 'No more questions', status: true, index: req.session.index, total: questions.length });
  }
  req.session.answers.push(answer);

  req.session.index++;


  const totalQuestions = questions.length;
  const count = req.session.answers.length;

  const sentResponse = {
      status: count >= totalQuestions,
      question: questions[req.session.index] || 'No more questions',
      index: req.session.index,
      total: totalQuestions,
  };

  return res.json(sentResponse);
});

app.get('/api/review', (req, res) => {
  const sessionAnswers = req.session.answers || [];
  const review = questions.map((question, index) => ({ question, answer: sessionAnswers[index] }));
  res.json({ review });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});