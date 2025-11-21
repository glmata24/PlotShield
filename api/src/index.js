require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const profilesRouter = require('./routes/profiles');
const booksRouter = require('./routes/books');
const followsRouter = require('./routes/follows');
const reviewsRouter = require('./routes/reviews');
const readingHistoryRouter = require('./routes/readingHistory');
const recommendationsRouter = require('./routes/recommendations');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API base path from OpenAPI servers: /v1
app.use('/v1/health', healthRouter);
app.use('/v1/profiles', profilesRouter);
app.use('/v1/books', booksRouter);
app.use('/v1/follows', followsRouter);
app.use('/v1/reviews', reviewsRouter);
app.use('/v1/reading-history', readingHistoryRouter);
app.use('/v1/recommendations', recommendationsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
