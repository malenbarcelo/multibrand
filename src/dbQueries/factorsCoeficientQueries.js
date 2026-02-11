const db = require('../../database/models')
const { Op,fn,col, literal } = require('sequelize')
const model = db.Data_factors_coeficient

const factorsCoeficientQueries = {
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

        if (filters.id_suppliers) {
            where.id_suppliers = filters.id_suppliers
        }

        const data = await model.findAll({
            order,
            where,
            raw:true
        })

        return data
    },
    
}       

module.exports = factorsCoeficientQueries