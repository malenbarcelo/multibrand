const db = require('../../database/models')
const { Op,literal,fn,col } = require('sequelize')
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

        if (filters.id) {
            where.id = Array.isArray(filters.id) ? { [Op.in]: filters.id } : filters.id
        }

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

        if (filters.last_list_number) {
            where[Op.and] = literal(`master.list_number = (
                SELECT MAX(t2.list_number)
                FROM master AS t2
                WHERE t2.id_suppliers = master.id_suppliers
                AND t2.id_branches = master.id_branches
            )`)
        }

        const data = await model.findAndCountAll({
            include:[
                {association:'branch_data'},
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
            nest:true,
            logging: console.log
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

    delete: async(id) => {
        const deletedData = await model.destroy({ where: { id } })
        return deletedData
    },
}       

module.exports = masterQueries