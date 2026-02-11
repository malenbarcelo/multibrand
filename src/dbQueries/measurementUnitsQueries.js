const db = require('../../database/models')
const model = db.Data_measurement_units

const measurementUnitsQueries = {
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
            order,
            where,
            raw:true
        })

        return data

    },
}

module.exports = measurementUnitsQueries