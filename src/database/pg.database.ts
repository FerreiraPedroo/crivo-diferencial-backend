import { Pool } from "pg";
import { config } from "../config/config.js";

const connectionString = "postgresql://postgres@localhost:5432/crivo";

const pool = new Pool({
  host: config.pgHost,
  port: 5432,
  user: config.pgUser,
  password: config.pgPassword,
  database: config.pgDatabase,
});

pool.on("connect", () => {
  console.log("Base de Dados conectado com sucesso!");
});

pool.on("error", (err) => {
  console.error("❌ Erro no pool do PostgreSQL", err);
});
export { pool };
