async function getImports(data, idBranch) {

    // add data to details
    data.rows.forEach(row => {

        row.calculated_data = {}

        // get data
        const volumeExpenses = row.reception_date == null ? null : (Number(row.forwarder_local_currency) + Number(row.domestic_freight_local_currency) + Number(row.port_expenses_local_currency) + Number(row.container_insurance_local_currency) + Number(row.port_contribution_local_currency) + Number(row.other_expenses_local_currency))

        const priceExpenses = row.reception_date == null ? null : (Number(row.dispatch_expenses_local_currency) + Number(row.office_fees_local_currency) + Number(row.container_costs_local_currency))
        
        const tariffsDuties = row.reception_date == null ? null : (Number(row.duties_tariffs_local_currency))

        const freightAndInsurance = row.reception_date == null ? null : (Number(row.freight_local_currency) + Number(row.insurance_local_currency))

        const totalExpenses = row.reception_date == null ? null : (freightAndInsurance + volumeExpenses + priceExpenses + tariffsDuties)

        const currencyExchange = row.reception_date == null ? null : (Number(row.currency_exchange))

        // complete row data
        row.calculated_data.volume_expenses_local_currency = volumeExpenses
        row.calculated_data.price_expenses_local_currency = priceExpenses
        row.calculated_data.total_expenses_local_currency = totalExpenses  

        row.details.forEach(detail => {

            detail.calculated_data = {}

            // fob
            const fob = Number(detail.fob)
            const qty = Number(detail.mu_quantity)
            const totalFob = fob * qty
            detail.calculated_data.fob = totalFob

            // boxes
            const muPerBox = Number(detail.mu_per_box)
            const boxes = qty / muPerBox
            detail.calculated_data.boxes = boxes

            // units
            detail.calculated_data.units = qty * Number(detail.mu_data.units_per_mu)

            // volume
            const volume = detail.volume_m3 == null ? null : Number(detail.volume_m3)
            detail.calculated_data.volume_m3 = volume == null ? null : volume * boxes

            // estimated cost
            const estimatedUnitCost = detail.estimated_unit_cost == null ? null : Number(detail.estimated_unit_cost)
            detail.calculated_data.estimated_cost = estimatedUnitCost == null ? null : detail.calculated_data.units * estimatedUnitCost

            // freight and insurance
            const freightAndInsuranceItem = row.reception_date == null ? null : (freightAndInsurance * detail.calculated_data.volume_m3)
            detail.calculated_data.freight_and_insurance = freightAndInsuranceItem

            // cif
            const cif = row.reception_date == null ? null : (totalFob * currencyExchange + freightAndInsuranceItem)
            detail.calculated_data.cif = cif
        })

        // complete row data
        row.calculated_data.fob = row.details.reduce((acc, item) => acc + item.calculated_data.fob, 0)
        row.calculated_data.boxes = row.details.reduce((acc, item) => acc + item.calculated_data.boxes, 0)
        row.calculated_data.units = row.details.reduce((acc, item) => acc + item.calculated_data.units, 0)
        row.calculated_data.volume_m3 = row.details.find( d => d.calculated_data.volume_m3 == null) ? null : row.details.reduce((acc, item) => acc + item.calculated_data.volume_m3, 0)
        row.calculated_data.estimated_cost = row.details.find( d => d.calculated_data.estimated_cost == null) ? null : row.details.reduce((acc, item) => acc + item.calculated_data.estimated_cost, 0)

        row.calculated_data.fob_local_currency = row.reception_date == null ? null : (row.calculated_data.fob * currencyExchange)
        row.calculated_data.cif = row.reception_date == null ? null : (row.calculated_data.fob_local_currency + freightAndInsurance)
        row.calculated_data.cost_local_currency = row.reception_date == null ? null : (row.calculated_data.fob_local_currency + totalExpenses)
        row.calculated_data.cost = row.reception_date == null ? null : (row.calculated_data.cost_local_currency / currencyExchange)
        row.calculated_data.cost_vs_fob = row.reception_date == null ? null : (row.calculated_data.cost / row.calculated_data.fob - 1)
        row.calculated_data.real_vs_estimated = row.reception_date == null ? null : (row.calculated_data.cost / row.calculated_data.estimated_cost - 1)
        row.calculated_data.freight_and_insurance = freightAndInsurance

    })


    return data
    
}

module.exports = { getImports }
