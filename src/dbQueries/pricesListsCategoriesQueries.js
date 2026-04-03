const db = require('../../database/models')
const { Op } = require('sequelize')
const model = db.Prices_lists_categories

const pricesListsCategoriesQueries = {

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

        if (filters.id_prices_lists) {
            where.id_prices_lists = filters.id_prices_lists
        }

        if (filters.price_list_category) {
            where.price_list_category = filters.price_list_category
        }

        let data = await model.findAll({
            include:[
                {association: 'price_list_data'}
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

module.exports = pricesListsCategoriesQueries
