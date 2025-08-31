import { pool } from "../database/pg.database.js";

interface IHasNewOrderService {
    userID: Number
    existOsList: string[]
}
export class OrderServiceRepository {
    static hasNewOrderService({ userID, existOsList }: IHasNewOrderService) {

        const queryIN = existOsList.reduce((acc, id, index) => {
            if (!index) {
                acc += `'${id}'`

            } else {
                acc += `,'${id}'`
            }

            return acc

        }, "")

        try {
            const result = pool.query(`SELECT * FROM os WHERE userID=${userID} AND id IN (${queryIN})`)
        } catch (error) {

        }
    }
}