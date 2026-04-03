const db = require('../../database/models')
const { Op } = require('sequelize')
const model = db.Prices_lists

const pricesListsQueries = {

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

        if (filters.id_branches) {
            where.id_branches = filters.id_branches
        }

        if (filters.price_list) {
            where.price_list = filters.price_list
        }

        let data = await model.findAll({
            include:[
                {association: 'prices_lists_to_print'},
                {association: 'prices_lists_categories'}
            ],
            order,
            where,
        })

        return data
    },

    create: async(data) => {
        const createdData = await model.create(data)
        return createdData
    },

    update: async(id, data) => {
        const updatedData = await model.update(data, { where: { id } })
        return updatedData
    },

    delete: async(id) => {
        const deletedData = await model.destroy({ where: { id } })
        return deletedData
    },
}

module.exports = pricesListsQueries
