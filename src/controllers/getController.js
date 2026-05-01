const masterQueries = require("../dbQueries/masterQueries")
const importsQueries = require("../dbQueries/importsQueries")
const suppliersQueries = require("../dbQueries/suppliersQueries")
const musQueries = require("../dbQueries/measurementUnitsQueries")
const pricesListsDetailsQueries = require("../dbQueries/pricesListsDetailsQueries")
const { getMaster } = require("../utils/getMaster")
const { addMasterData } = require("../utils/addMasterData")
const { getImports } = require("../utils/getImports")
const { getDevSession } = require("../utils/getDevSession")

const getController = {

    master: async(req,res) =>{
        try{

            const { page, size, order, id_suppliers, item_string, item, description, enabled, last_list_number  } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // branch id
            getDevSession(req)
            const idBranch = req.session.branch.id
            filters.id_branches = idBranch
            
            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id_suppliers) {
                filters.id_suppliers = id_suppliers
            }

            if (item) {
                filters.item = item
            }

            if (item_string) {
                filters.item_string = item_string
            }

            if (description) {
                filters.description = description
            }

            if (enabled) {
                filters.enabled = enabled
            }

            if (last_list_number) {
                filters.last_list_number = last_list_number
            }

            // get data
            let data = await masterQueries.get({ limit, offset, filters })
            
            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            // add data
            data = await getMaster(data, idBranch)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    suppliers: async(req,res) =>{
        try{

            const { supplier_name, id, order} = req.query
            const filters = {}

            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            // get data
            let data = await suppliersQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    measurementUnits: async(req,res) =>{
        try{

            const { id, order} = req.query
            const filters = {}

            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            // get data
            let data = await musQueries.get({ filters })

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    imports: async(req,res) =>{
        try{

            const { page, size, id, order, po_string, id_suppliers, item_string, import_status, enabled  } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // branch id
            getDevSession(req)
            const idBranch = req.session.branch.id
            filters.id_branches = idBranch
            
            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id) {
                filters.id = id
            }

            if (po_string) {
                filters.po_string = po_string
            }

            if (id_suppliers) {
                filters.id_suppliers = id_suppliers
            }

            if (item_string) {
                filters.item_string = item_string
            }

            if (import_status) {
                filters.import_status = import_status
            }

            if (enabled) {
                filters.enabled = enabled
            }

            // get data
            let data = await importsQueries.get({ limit, offset, filters })

            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            // add data
            data = await getImports(data, idBranch)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
    pricesLists: async(req,res) =>{
        try{

            const { page, size, order, id_prices_lists_categories, erp_item, supplier_item, price_list_item, enabled, price_list_item_null, erp_item_null, supplier_item_null  } = req.query
            const limit = size ? parseInt(size) : undefined
            const offset = page ? (parseInt(page) - 1) * limit : undefined
            const filters = {}

            // branch id
            getDevSession(req)
            const idBranch = req.session.branch.id
            filters.id_branches = idBranch
            
            // add filters
            if (order) {
                filters.order = JSON.parse(order)
            }

            if (id_prices_lists_categories) {
                filters.id_prices_lists_categories = id_prices_lists_categories
            }

            if (erp_item) {
                filters.erp_item = erp_item
            }

            if (supplier_item) {
                filters.supplier_item = supplier_item
            }

            if (price_list_item) {
                filters.price_list_item = price_list_item
            }

            if (enabled) {
                filters.enabled = enabled
            }

            if (price_list_item_null === 'false') {
                filters.price_list_item_null = false
            }

            if (erp_item_null === 'false') {
                filters.erp_item_null = false
            }

            if (supplier_item_null === 'false') {
                filters.supplier_item_null = false
            }

            // get data
            let data = await pricesListsDetailsQueries.get({ limit, offset, filters })
            
            // get pages
            const pages = Math.ceil(data.count / limit)
            data.pages = pages

            // add master details
            data = await addMasterData(data, idBranch)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },
}
module.exports = getController

