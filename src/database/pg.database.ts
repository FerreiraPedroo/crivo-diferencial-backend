import { Pool } from "pg";

const connectionString = "postgresql://postgres:crivo@localhost:5432/crivo";

const pool = new Pool({
  connectionString,
});

pool.on("connect", () => {
  console.log("Base de Dados conectado com sucesso!");
});

pool.on("error", (err) => {
  console.error("❌ Erro no pool do PostgreSQL", err);
});
export { pool };
