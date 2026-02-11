const db = require('../../database/models')
const model = db.Data_suppliers

const suppliersQueries = {

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

        let data = await model.findAll({
            include:[
                {association: 'currency_data'},
                {association: 'factors_coeficient'},
                {association: 'factors_volume'}
            ],            
            order,
            where,
        })

        return data

    },
}

module.exports = suppliersQueries