const db = require('../../database/models')
const { Op,literal,fn,col } = require('sequelize')
const utils = require('../utils/utils')
const model = db.Prices_lists_details

const pricesListsDetailsQueries = {
    get: async({ limit,offset,filters }) => {

        // order
        let order = ''
        if (filters.order) {
            const orderMap = {
                'list_name': (dir) => [{ model: db.Prices_lists_names, as: 'list_name_data' }, 'price_list_name', dir],
                'list_category': (dir) => [{ model: db.Prices_lists_categories, as: 'category_data' }, 'category_name', dir],
            }
            order = filters.order.map(([field, dir]) => {
                return orderMap[field] ? orderMap[field](dir) : [field, dir]
            })
        }

        // where
        const where = {}

        if (filters.id) {
            where.id = filters.id
        }

        if (filters.id_branches) {
            where.id_branches = filters.id_branches
        }

        if (filters.id_suppliers) {
            where['$supplier_data.supplier$'] = {
                [Op.like]: `%${utils.specialChars(filters.id_suppliers)}%`
            }
        }

        if (filters.list_name) {
            where['$list_name_data.price_list_name$'] = {
                [Op.like]: `%${utils.specialChars(filters.list_name)}%`
            }
        }

        if (filters.category_name) {
            where['$category_data.category_name$'] = {
                [Op.like]: `%${utils.specialChars(filters.category_name)}%`
            }
        }

        if (filters.item_string) {
            const searchTerm = `%${utils.specialChars(filters.item_string)}%`
            where[Op.or] = [
                { erp_item: { [Op.like]: searchTerm } },
                { supplier_item: { [Op.like]: searchTerm } },
                { price_list_item: { [Op.like]: searchTerm } }
            ]
        }

        if (filters.description) {
            where.description = {
                [Op.like]: `%${utils.specialChars(filters.description)}%`
            }
        }

        if (filters.erp_item) {
            where.erp_item = filters.erp_item
        }

        if (filters.supplier_item) {
            where.supplier_item = filters.supplier_item
        }

        if (filters.price_list_item) {
            where.price_list_item = filters.price_list_item
        }

        if (filters.id_prices_lists_names) {
            where.id_prices_lists_names = filters.id_prices_lists_names
        }

        if (filters.id_prices_lists_categories) {
            where.id_prices_lists_categories = filters.id_prices_lists_categories
        }

        if (filters.enabled) {
            where.enabled = filters.enabled
        }

        if (filters.price_list_item_null === false) {
            where.price_list_item = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
        }

        if (filters.erp_item_null === false) {
            where.erp_item = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
        }

        if (filters.supplier_item_null === false) {
            where.supplier_item = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
        }

        const data = await model.findAndCountAll({
            include:[
                {association: 'supplier_data'},
                {association: 'list_name_data'},
                {association: 'category_data'},
                {
                    association: 'master_data',
                    required: false,
                    where: {
                        id_suppliers: { [Op.col]: 'Prices_lists_details.id_suppliers' }
                    }
                }
            ],
            order: order,
            where,
            limit,
            offset,
            subQuery: false,
            nest:true,
        })

        data.rows = data.rows.map(r => {
            const plain = r.get({ plain: true })
            if (plain.master_data && plain.master_data.length > 0) {
                plain.master_data = plain.master_data.sort((a, b) => b.id - a.id)[0]
            } else {
                plain.master_data = null
            }
            return plain
        })

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

    getListsToPrint: async(idBranch) => {

        const data = await model.findAll({
            attributes: [[fn('DISTINCT', col('Prices_lists_details.id_prices_lists_names')), 'id_prices_lists_names']],
            include: [{
                association: 'list_name_data',
                attributes: ['price_list_name']
            }],
            where: { id_branches: idBranch },
            raw: true,
            nest: true,
        })

        return data.map(r => ({
            id: r.id_prices_lists_names,
            price_list_name: r.list_name_data.price_list_name
        }))
    },
}

module.exports = pricesListsDetailsQueries
