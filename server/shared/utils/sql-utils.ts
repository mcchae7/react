import { connectDB } from '../../config/db';

// connect db
const db = connectDB();

// TODO order by "ORDER BY id ASC"
export const generateWhere = (params: any) => {
  if (params) {
    const where = Object.keys(params).map(
      (field) => `${field} = ${typeof params[field] === 'string' ? "'" + params[field] + "'" : params[field]}`,
    );
    return ' WHERE ' + where.join(' ');
  }
  return '';
};

export const generateSelect = (table: string, where: any, columns: string[] = []) => {
  const strColumns = columns.length ? columns.join(', ') : '*';
  const query = `SELECT ${strColumns} FROM public.${table} ${generateWhere(where)}`;
  console.log(query);
  return query;
};

export const generateInsert = (table: string, data: any) => {
  const columns: string[] = [];
  const values: string[] = [];
  Object.keys(data).forEach((column) => {
    columns.push(column);
    const val = data[column];
    values.push(typeof val === 'string' ? `'${val}'` : val);
  });
  return `INSERT INTO public.${table}(${columns.join(', ')}) VALUES(${values.join(', ')})`;
};

export const select = (table: string, where: any = null, columns: string[] = []) =>
  db.any(generateSelect(table, where, columns));

export const insert = (table: string, data: any) => db.none(generateInsert(table, data));
