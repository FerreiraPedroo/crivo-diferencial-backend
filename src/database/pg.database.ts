import { Client, Pool } from "pg";

// const pool = new Pool({
//   connectionString: "postgres://postgres:crivo@localhost:5432/crivo"
// });
// // host: process.env.PGHOST,
// // port: 5432,
// // user: process.env.PGUSER,
// // password: process.env.PGPASSWORD,
// // database: process.env.PGDATABASE,
// // max: 20,
// // idleTimeoutMillis: 30000,
// // console.log("PG POLL", await pool.connect())


// pool.on("connect", () => {
//   console.log("✅ Conectado ao PostgreSQL via Pool");
// });

// pool.on("error", (err) => {
//   console.error("❌ Erro no pool do PostgreSQL", err);
// });
// export { pool };
