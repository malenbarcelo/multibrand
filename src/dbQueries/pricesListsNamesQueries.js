const db = require('../../database/models')
const { Op,literal,fn,col } = require('sequelize')
const model = db.Prices_lists_names

const pricesListsQueries = {
    get: async({ limit,offset,filters }) => {

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

        if (filters.price_list_name) {
            where.price_list_name = filters.price_list_name
        }

        if (filters.image) {
            where.image = filters.image
        }

        const data = await model.findAndCountAll({
            include:[],
            order,
            where,
            limit,
            offset,
            nest:true,
        })

        data.rows = data.rows.map(r => r.get({ plain: true }))

        return data
    },

    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },

    update: async (condition, data) => {

        for (const d of data) {

            let whereCondition = {}

            if (condition == 'id') {
                whereCondition = { id: d.id }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },

    delete: async(id) => {
        const deletedData = await model.destroy({ where: { id } })
        return deletedData
    },
}

module.exports = pricesListsQueries
