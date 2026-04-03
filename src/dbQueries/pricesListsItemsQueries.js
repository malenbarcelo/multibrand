const db = require('../../database/models')
const { Op } = require('sequelize')
const model = db.Prices_lists_items

const pricesListsItemsQueries = {

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

        if (filters.id_prices_lists_categories) {
            where.id_prices_lists_categories = filters.id_prices_lists_categories
        }

        if (filters.erp) {
            where.erp = filters.erp
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        let data = await model.findAll({
            include:[
                {association: 'category_data'}
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

module.exports = pricesListsItemsQueries
