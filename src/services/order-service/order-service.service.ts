// import { pool } from "../../database/pg.database.ts";

import { Pool } from "pg";

export class orderServiceService {
    constructor() {

    }

    async hasNewOrderService({ userLogerd, osIDs }) {

        const pool = new Pool({
            connectionString: "postgres://postgres:crivo@127.0.0.1:5432/crivo"
        });
        console.log(pool)
        console.log(pool.connect((e) => {
            console.log(e)
        }))



        try {
            const result = await pool.query("SELECT * FROM os");
            console.log("result")
            console.log(result)
            console.log(pool)
        } catch (error) {

        }

    }
}