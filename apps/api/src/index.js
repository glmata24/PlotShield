const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
