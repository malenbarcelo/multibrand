const db = require('../../database/models')
const { Op,literal,fn,col } = require('sequelize')
const model = db.Model

const modelQueries = { // same name as file
    get: async({ limit,offset,filters }) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where
        const where = {}

        if (filters.id) { // one for each field in Model.js
            where.id = filters.id
        }

        const data = await model.findAndCountAll({ // find and count !
            include:[ // one for each association included un Model.js
                {
                    association:'',
                }
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

module.exports = modelQueries