const db = require("../connection");
async function MysqlQueryExecute(query) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(query);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  module.exports = MysqlQueryExecute;