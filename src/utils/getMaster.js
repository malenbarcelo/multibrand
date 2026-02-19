const factorsCoeficientQueries = require("../dbQueries/factorsCoeficientQueries")
const factorsVolumeQueries = require("../dbQueries/factorsVolumeQueries")
const currenciesExchangesQueries = require("../dbQueries/currenciesExchangesQueries")
const utils = require("../utils/utils")

async function getMaster(data, idBranch) {

    // get factors 
    const filters = {id_branches: idBranch, enabled:1}
    const factorsCoeficient = await factorsCoeficientQueries.get({filters})
    const factorsVolume = await factorsVolumeQueries.get({filters})

    // get currencies
    const currenciesExchanges = await currenciesExchangesQueries.getLastExchange(idBranch)

    // add data
    data.rows.forEach(row => {

        // add volume ft3
        row.volume_ft3 = Math.round(Number(row.volume_m3) * 35.3147 * 1000) / 1000 // 3 decimals

        // add currency exchange
        row.currency_exchange = currenciesExchanges.find( c => c.id_currencies == row.supplier_data.id_currencies).currency_exchange

        // add factors
        const factors = row.supplier_data.cost_calculation == 'volume' ? factorsVolume.find( f => f.id_suppliers == row.id_suppliers) : factorsCoeficient.find( f => f.id_suppliers == row.id_suppliers)
        row.factors = factors ?? null

        // add data 
        const volume = factors ? (factors.volume_mu == 'm3' ? parseFloat(row.volume_m3) : row.volume_ft3) : null
        const margin = factors ? (parseFloat(factors.sales_margin_percentage)/100) : null
        const muPerBox = parseFloat(row.mu_per_box)
        const fob = parseFloat(row.fob)
        const unitsPerMu = parseInt(row.mu_data.units_per_mu)
        const specialPriceFactor = row.special_price_factor == null ? null : parseFloat(row.special_price_factor)

        // unit fob
        row.unit_fob = utils.round(fob / unitsPerMu,3)
        
        // volume factors data
        const freight = (factors && row.supplier_data.cost_calculation == 'volume')  ? parseFloat(factors.freight) : null
        const insurance = (factors && row.supplier_data.cost_calculation == 'volume') ? parseFloat(factors.insurance) : null
        const dispatchExpenses = (factors && row.supplier_data.cost_calculation == 'volume') ? parseFloat(factors.dispatch_expenses) : null
        const customAgent = (factors && row.supplier_data.cost_calculation == 'volume') ? parseFloat(factors.custom_agent) : null
        const transference = (factors && row.supplier_data.cost_calculation == 'volume') ? parseFloat(factors.transference) : null
        const volumeExpenses = (factors && row.supplier_data.cost_calculation == 'volume') ? parseFloat(factors.total_volume_expenses) : null
        row.freight = (factors && row.supplier_data.cost_calculation == 'volume') ? utils.round(freight * volume / muPerBox,3) : null
        row.cif = (factors && row.supplier_data.cost_calculation == 'volume') ? utils.round((fob + row.freight) * ( 1 + insurance),3) : null
        row.dispatch_expenses = (factors && row.supplier_data.cost_calculation == 'volume') ? utils.round(row.cif * dispatchExpenses,3) : null
        row.volume_expenses = (factors && row.supplier_data.cost_calculation == 'volume') ? utils.round(volumeExpenses * volume / muPerBox,3) : null
        row.price_expenses = (factors && row.supplier_data.cost_calculation == 'volume') ? utils.round(row.cif * (customAgent + transference),3) : null

        if (row.supplier_data.cost_calculation == 'volume') {            
            row.estimated_mu_cost = factors ? utils.round(row.cif + row.dispatch_expenses + row.volume_expenses + row.price_expenses,3) : null
            row.estimated_unit_cost = factors ? utils.round(row.estimated_mu_cost / unitsPerMu,3) : null
        }else{
            const coeficient = factors ? Number(row.factors.factor) : null
            row.estimated_mu_cost = factors ? utils.round(fob * (1 + coeficient),3) : null
            row.estimated_unit_cost = factors ? utils.round(row.estimated_mu_cost / unitsPerMu,3) : null
        }

        // other data
        row.cost_vs_fob = factors ? utils.round((row.estimated_unit_cost / row.unit_fob),3) : null

        // sell price
        row.suggested_price = factors ? utils.round(row.estimated_unit_cost * (1 + margin),3)  : null
        row.suggested_price_ars = factors ? Math.ceil(row.suggested_price * row.currency_exchange)  : null
        row.sells_price = factors ? utils.round((specialPriceFactor == null ? row.suggested_price : (row.suggested_price * specialPriceFactor)),3) : null
        row.sells_price_ars = factors ? Math.ceil(row.sells_price * row.currency_exchange) : null
        row.margin = factors ? utils.round(((row.sells_price_ars / (row.estimated_unit_cost * row.currency_exchange)) - 1) * 100,3) : null

    })

    return data
    
}

module.exports = { getMaster }
