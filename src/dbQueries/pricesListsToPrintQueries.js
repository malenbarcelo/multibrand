const db = require('../../database/models')
const { Op,literal,fn,col } = require('sequelize')
const model = db.Prices_lists_to_print

const pricesListsToPrintQueries = {
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

        if (filters.id_prices_lists) {
            where.id_prices_lists = filters.id_prices_lists
        }

        if (filters.price_list_name) {
            where.price_list_name = filters.price_list_name
        }

        if (filters.include_in_consolidated_list) {
            where.include_in_consolidated_list = filters.include_in_consolidated_list
        }

        const data = await model.findAndCountAll({
            include:[
                {
                    association: 'price_list_data',
                include:{association:'prices_lists_categories'}}
            ],
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

module.exports = pricesListsToPrintQueries
