const db = require('../../database/models')
const { Op,fn,col } = require('sequelize')
const utils = require("../utils/utils")
const model = db.Master

const masterQueries = {
    get: async({ limit,offset,filters }) => {

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

        if (filters.item_string) {
            where.item = {
                [Op.like]: `%${utils.specialChars(filters.item_string)}%`
            }
        }

        if (filters.item) {
            where.item = filters.item
        }

        if (filters.description) {
            where.description = {
                [Op.like]: `%${utils.specialChars(filters.description)}%`
            }
        }

        const data = await model.findAndCountAll({
            include:[
                {
                    association:'supplier_data',
                    include:[{association:'currency_data'}]
                },
                {association:'mu_data'}
            ],
            order,
            where,
            limit,
            offset,
            nest:true
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

            if (condition == 'id_suppliers') {
                whereCondition = { id_suppliers: d.id_suppliers }
            }

            await model.update(
                d.dataToUpdate,
                { where: whereCondition }
            )
        }
    },
}       

module.exports = masterQueries