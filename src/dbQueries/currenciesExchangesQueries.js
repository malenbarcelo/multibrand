const db = require('../../database/models')
const { Op,fn,col, literal } = require('sequelize')
const model = db.Data_currencies_exchanges

const currenciesExchangesQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        if (filters.id_branches) {
            where.id_branches = filters.id_branches
        }

        const data = await model.findAll({
            order,
            where,
            raw:true
        })

        return data
    },

    getLastExchange: async(idBranch) => {

        const data = await model.findAll({
            where: {
                id_branches: idBranch,
                id: {
                [Op.in]: literal(`(
                    SELECT MAX(id)
                    FROM data_currencies_exchanges
                    WHERE id_branches = ${idBranch}
                    GROUP BY id_currencies
                )`)
                }
            },
            raw: true
        })

        return data
    },
    
}       

module.exports = currenciesExchangesQueries