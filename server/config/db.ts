import config from 'config';
import pgp from 'pg-promise';

// TODO: Heroku setting: process.env.DATABASE_URL
// DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
export const connectDB = () => {
  return pgp()(config.get('pg'));
};
