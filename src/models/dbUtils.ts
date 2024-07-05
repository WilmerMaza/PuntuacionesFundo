import { Client } from 'pg';
import { dbConfig } from '../config/configposgret';

export const getDataFromPostgres = async () => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const res = await client.query('SELECT "Id", "Name", "LastName", "Numero_Sorteo" FROM "Athletes"');
    return res.rows;
  } finally {
    await client.end();
  }
};
