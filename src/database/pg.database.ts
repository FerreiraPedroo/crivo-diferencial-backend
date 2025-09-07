import { Pool } from "pg";

const connectionString = "postgresql://postgres@localhost:5432/crivo";

const pool = new Pool();

pool.on("connect", () => {
  console.log("Base de Dados conectado com sucesso!");
});

pool.on("error", (err) => {
  console.error("❌ Erro no pool do PostgreSQL", err);
});
export { pool };
