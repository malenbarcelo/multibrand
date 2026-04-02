
const { getDevSession } = require("../utils/getDevSession")
const { getMaster } = require("../utils/getMaster")
const currenciesExchangesQueries = require("../dbQueries/currenciesExchangesQueries")
const importsQueries = require("../dbQueries/importsQueries")
const branchesQueries = require("../dbQueries/branchesQueries")
const masterQueries = require("../dbQueries/masterQueries")
const excelJs = require('exceljs')

const composedController = {

    getBranch: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            const branch = req.session.branch
            res.status(200).json(branch)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    getMaster: async(req,res) =>{
        try{

            const data = req.body

            const mapData = await getMaster(data, data.idBranch)

            res.status(200).json({data: mapData})

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    downloadMaster: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            const filters = req.body
            const idBranch = req.session.branch.id
            const currency = req.session.branch.currency_data.currency
            const fileName = 'Lista de precios ' + req.session.branch.branch + '.xlsx'
            filters.id_branches = idBranch
            
            // get data
            let data = await masterQueries.get({ undefined, undefined, filters })
            
            // add data
            data = await getMaster(data, idBranch)
            dataToPrint = data.rows

            // create woorkbook
            const workbook = new excelJs.Workbook()
            const worksheet = workbook.addWorksheet('Lista de precios ' + req.session.branch.branch)
      
            const columns = [
                { header: 'PROVEEDOR', key: 'supplier', width: 25, style: {alignment:{horizontal: 'center'}}},
                { header: 'ITEM', key: 'item', width: 15, style: {alignment:{horizontal: 'center'}}},
                { header: 'DESCRIPTION', key: 'description', width: 50, style: {alignment:{horizontal: 'center'}}},
                { header: 'UM', key: 'mu', width: 10, style: {alignment:{horizontal: 'center'}}},
                { header: 'UM / CAJA', key: 'muPerBox', width: 12, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.0'}},
                { header: 'PESO NETO (kg)', key: 'weight', width: 15, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.000'}},
                { header: 'VOLUMEN / CAJA (m3)', key: 'volume', width: 20, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.0000'}},
                { header: 'FOB', key: 'fob', width: 12, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.000'}},
                { header: 'MONEDA', key: 'currency', width: 12, style: {alignment:{horizontal: 'center'}}},
                { header: 'COSTO / UN', key: 'unitCost', width: 15, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.000'}},
                { header: 'PRECIO / UN', key: 'unitPrice', width: 15, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.000'}},
                { header: 'TC', key: 'exchangeRate', width: 10, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.0'}},
                { header: 'PRECIO / UN (' + currency.toUpperCase() + ')', key: 'unitPriceLocalCurrency', width: 20, style: {alignment:{horizontal: 'center'}, numFmt: '#,##0.00'}},
            ]
      
            worksheet.columns = columns

            console.log(dataToPrint)
      
            dataToPrint.forEach(element => {
                const data = {
                    'supplier': element.supplier_data.supplier,
                    'item': element.item,
                    'description': element.description,
                    'mu': element.mu_data.measurement_unit,
                    'muPerBox': element.mu_per_box == null ? null : Number(element.mu_per_box),
                    'weight': element.weight_kg == null ? '' : Number(element.weight_kg),
                    'volume': element.volume_m3 == null ? '' : Number(element.volume_m3),
                    'fob': element.fob == null ? '' : Number(element.fob),
                    'currency': element.supplier_data.currency_data.currency,
                    'unitCost': element.estimated_unit_cost == null ? '' : Number(element.estimated_unit_cost),
                    'unitPrice': element.sells_price == null ? '' : Number(element.sells_price),
                    'exchangeRate': element.currency_exchange == null ? '' : Number(element.currency_exchange),
                    'unitPriceLocalCurrency': element.sells_price_local_currency == null ? '' : Number(element.sells_price_local_currency),

                }
        
                worksheet.addRow(data)
            
          }) 
      
           res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
           res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
        
           await workbook.xlsx.write(res)
          
           res.end()
          
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },

    getLastCurrenciesExchanges: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            const idBranch = req.session.branch.id

            // get currencies
            const currenciesExchanges = await currenciesExchangesQueries.getLastExchange(idBranch)

            res.status(200).json(currenciesExchanges)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    getPoNumber: async(req,res) =>{
        try{

            // get session if DEV
            getDevSession(req)

            // get year
            const date = new Date()
            const year = date.getFullYear()

            // get branch data
            const idBranch = req.session.branch.id
            const branchData = await branchesQueries.get({filters:{id:idBranch}})
            const suffix = branchData[0].pos_suffix

            // get year
            const maxPo = await importsQueries.getMaxPo(idBranch)
            const maxPoYear = Number(String(maxPo.po_number).slice(0, 4))

            // get po number
            let poNumber
            if (year == maxPoYear) {
                const number = maxPo.po_number + 1
                poNumber = suffix + '.' + String(number).slice(-2) + '.' + String(number).slice(2, 4)
            }else{
                poNumber = suffix + '.01.' + String(year).slice(2, 4)
            }
            
            res.status(200).json(poNumber)

        }catch(error){
            console.log(error)
            res.status(200).json({error:'Error al obtener datos'})
        }
    },

    downloadPoExcel: async(req,res) =>{
        try{

            const data = req.body
            const importData = await importsQueries.get({undefined,undefined,filters:{id:data.id}})
            const po = importData.rows[0].purchase_order
            const supplier = importData.rows[0].supplier_data.supplier
            const fileName = po + ' - ' + supplier + '.xlsx'
            const dataToPrint = importData.rows[0].details
                        .sort((a, b) => a.item - b.item)
            const currency = importData.rows[0].supplier_data.currency_data.currency    
            const workbook = new excelJs.Workbook()
            const worksheet = workbook.addWorksheet(po)
      
            const columns = [
                { header: 'ITEM', key: 'item', width: 15, style: {alignment:{horizontal: 'center'}}},
                { header: 'DESCRIPTION', key: 'description', width: 50, style: {alignment:{horizontal: 'center'}}},
                { header: 'QUANTITY', key: 'quantity', width: 12, style: {alignment:{horizontal: 'center'},numFmt: '#,##0.00'}},
                { header: 'MU', key: 'mu', width: 10, style: {alignment:{horizontal: 'center'}}},
                { header: 'UNIT PRICE', key: 'price', width: 12, style: {alignment:{horizontal: 'center'},numFmt: '#,##0.00'}},
                { header: 'CURRENCY', key: 'currency', width: 12, style: {alignment:{horizontal: 'center'}}},
                { header: 'EXTENDED PRICE', key: 'extendedPrice', width: 17, style: {alignment:{horizontal: 'center'},numFmt: '#,##0.00'}},
            ]
      
             worksheet.columns = columns
      
            dataToPrint.forEach(element => {
                console.log(element)
                const data = {
                    'item': element.item,
                    'description': element.description,
                    'quantity': Number(element.mu_quantity),
                    'mu': element.mu_data.measurement_unit,
                    'price': Number(element.fob),
                    'currency': currency,
                    'extendedPrice': Number(element.mu_quantity) * Number(element.fob),
                }
        
                worksheet.addRow(data)
            
          }) 
      
           res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
           res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
        
           await workbook.xlsx.write(res)
          
           res.end()
          
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    }

}
module.exports = composedController

