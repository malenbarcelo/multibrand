const db = require('../../database/models')
const model = db.Branches

const branchesQueries = {
    get: async({ filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        const data = await model.findAll({
            include:[{association: 'currency_data'}],            
            order,
            where,
            raw:true
        })

        return data

    },
}

module.exports = branchesQueries