import express, { Application, json } from 'express';
import { apiRouter } from './api/api';

const app: Application = express();

app.use(json());
app.post('/api', apiRouter);
app.get('/', (req, res) => res.send('API Running'));

// process.env.PORT is from Heroku
const PORT = process.env.PORT || 8091;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
