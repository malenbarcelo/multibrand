import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { utils } from "./utils.js"
import gg from "../globals.js"

// create edit item popup (ceipp)
async function ceippEventListeners() {

    const elementsToChange = [ceippSupplier, ceippFob, ceippMu, ceippMuPerBox, ceippVolume, ceippSpecialPriceFactor]
    let elementsForCosting = [ceippSupplier, ceippFob, ceippMu, ceippMuPerBox]
    let supplierData
    let row

    // view factors
    ceippViewFactors.addEventListener('click',async()=>{

        ceippLoader.style.display = 'block'

        const costCalculation = supplierData.cost_calculation

        const factors = costCalculation == 'volume' ? supplierData.factors_volume.find( fv => fv.id_branches == g.branchData.id) : supplierData.factors_coeficient.find( fc => fc.id_branches == g.branchData.id)
        const currency = supplierData.currency_data.currency
        const currencyExchange = g.currenciesExchanges.find( ce => ce.id == supplierData.id_currencies)


        // currency and margin data
        fappSubtitle.innerText = supplierData.supplier
        fappCurrency.innerText = currency
        fappCurrencyExchange.innerText = gg.formatter2.format(currencyExchange.currency_exchange)

        if (costCalculation == 'volume') {
            fappStandardVolume.innerText = gg.formatter0.format(factors.std_volume) + ' ' + factors.volume_mu
            fappStandardContainer.innerText = gg.formatter0.format(factors.std_container) + ' ft3'
            //fappFreight.innerText = gg.formatter0.format(factors.std_freight) + ' ' + 
            fappFactorsVolume.style.display = 'block'
            fappFactorsCoeficient.style.display = 'none'
            
        }else{
            fappFactorsVolume.style.display = 'none'
            fappFactorsCoeficient.style.display = 'block'
        }

        fapp.style.display = 'block'

        ceippLoader.style.display = 'none'
    })

    // delete item
    ceippDestroy.addEventListener('click',async()=>{
        const destroy = document.getElementById('destroy_' + g.elementToEdit.id)
        destroy.click()
    })

    // change element
    elementsToChange.forEach(element => {

        element.addEventListener('change',async()=>{

            // get data
            supplierData = g.suppliers.find( s => s.id == ceippSupplier.value)
            const idBranch = g.branchData.id
            const currency = supplierData ? supplierData.currency_data : undefined
            const costCalculation = supplierData ? supplierData.cost_calculation : undefined

            // show factors if applies
            if (ceippSupplier.value != '') {
                ceippViewFactors.classList.remove('not-visible')                
            }else{
                ceippViewFactors.classList.add('not-visible')
            }

            // add volume to elementsToChange if applies
            if (supplierData && supplierData.cost_calculation == 'volume') {
                 elementsForCosting.push(ceippVolume)
            }else{
                 elementsForCosting =  elementsForCosting.filter( nel => nel != ceippVolume)
            }

            // get empty elements
            const emptyElements =  elementsForCosting.filter( nel => nel.value == '')

            // get data if applies
            if (emptyElements == 0) {
                
                const data = {
                    idBranch: idBranch,
                    rows:[{
                        id_suppliers: Number(supplierData.id),
                        volume_m3: Number(ceippVolume.value.replace(',','.')),
                        supplier_data: supplierData,
                        id_currencies: supplierData.id_currencies,
                        fob: Number(ceippFob.value.replace(',','.')),
                        mu_data: g.mus.find( mu => mu.id == ceippMu.value),
                        mu_per_box: Number(ceippMuPerBox.value.replace(',','.')),
                        special_price_factor: ceippSpecialPriceFactor.value == '' ? null : Number(ceippSpecialPriceFactor.value.replace(',','.'))
                    }]
                }

                const response = await fetch(domain + 'composed/get-master',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                const responseData = await response.json()
                row = responseData.data.rows[0]
            }

            // complete inputs
            ceippFreight.value = row ? (row.freight == null ? '' : row.freight.toFixed(3).replace('.',',')) : ''
            ceippCif.value = row ? (row.cif == null ? '' : row.cif.toFixed(3).replace('.',',')) : ''
            ceippDispatchExpenses.value = row ? (row.dispatch_expenses == null ? '' : row.dispatch_expenses.toFixed(3).replace('.',',')) : ''
            ceippVolumeExpenses.value = row ? (row.volume_expenses == null ? '' : row.volume_expenses.toFixed(3).replace('.',',')) : ''
            ceippPriceExpenses.value = row ? (row.price_expenses == null ? '' : row.price_expenses.toFixed(3).replace('.',',')) : ''
            ceippMuCost.value = row ? (row.mu_cost.toFixed(3).replace('.',',')) : ''
            ceippUnitCost.value = row ? (row.unit_cost.toFixed(3).replace('.',',')) : ''
            ceippSuggestedPrice.value = row ? (row.unit_cost.toFixed(3).replace('.',',')) : ''
            ceippExchange.value = row ? (Number(row.currency_exchange)) : ''
            ceippSuggestedPriceArs.value = row ? (row.suggested_price_ars) : ''
            ceippSellsPriceArs.value = row ? (row.sells_price_ars) : ''
            ceippCoefFactor.value = row ? (row.factors.factor ? (Number(row.factors.factor) * 100).toFixed(2).replace('.',',') : '') : ''
            ceippMargin.value = row ? (row.margin.toFixed(3).replace('.',',')) : ''
            
            // complete lables
            ceippFobLabel.innerText = `Precio por UM ${ currency ? '(' + currency.currency + ')' : ''} *`
            ceippMuCostLabel.innerText = `Costo estimado / UM ${ currency ? '(' + currency.currency + ')' : ''}`
            ceippUnitCostLabel.innerText = `Costo estimado / Unidad ${ currency ? '(' + currency.currency + ')' : ''}`
            ceippVolumeLabel.innerText = costCalculation == 'volume' ? 'Volumen por caja (m3) *' : 'Volumen por caja (m3)'
            ceippSuggestedPriceLabel.innerText = `Precio por UM ${ currency ? '(' + currency.currency + ')' : ''}`

            // show inputs -- Volume factors
            if (costCalculation == "volume") {
                ceippCoefFactorBox.style.display = 'none'
                ceippVolumeFactorsBox.style.display = 'flex'
            }

            // show inputs -- Coeficient factors
            if (costCalculation == "coeficient") {
                ceippCoefFactorBox.style.display = 'flex'
                ceippVolumeFactorsBox.style.display = 'none'
            }

            // show inputs -- No supplier
            if (!supplierData) {
                ceippCoefFactorBox.style.display = 'flex'
                ceippVolumeFactorsBox.style.display = 'flex'
            }

        })
    })

    // confirm popup
    ceippAccept.addEventListener('click',async()=>{
        
        let errors = 0
        ceippLoader.style.display = 'block'
        
        // empty elements
        const requiredElements = g.ceippInputs.filter( i => i != ceippSpecialPriceFactor && i != ceippWeight)
        const emptyElement = requiredElements.filter( re => re.value == '')
        if (emptyElement.length > 0) {
            errors += 1
            ceippError.innerText = 'Debe completar todos los campos marcados con *'
        }else{
            // existing item
            const findItem = await (await fetch(`${domain}get/master?item=${ceippItem.value}&id_suppliers=${ceippSupplier.value}`)).json()
            if (findItem.rows.length > 0 && (g.action == 'create' || (g.action == 'edit' && findItem.rows[0].item != g.elementToEdit.item))) {
                errors += 1
                ceippError.innerText = 'El item ' + ceippItem.value + ' ya existe en la lista de precios de ' + supplierData.supplier
            }
        }

        if (errors > 0) {
            ceippError.classList.remove('not-visible')
            ceippLoader.style.display = 'none'
        }else{
            ceippError.classList.add('not-visible')

            // add data to row
            row.id_branches = g.branchData.id
            row.item = ceippItem.value
            row.description = ceippDescription.value
            row.id_measurement_units = row.mu_data.id
            row.weight_kg = ceippWeight.value == '' ? null : Number(ceippWeight.value.replace(',','.'))
            row.brand = ceippBrand.value
            row.has_breaks = ceippBreaks.value
            row.origin = ceippOrigin.value

            // create
            let response
            let responseData
            
            if (g.action == 'create') {

                okText.innerText = 'Item creado con éxito'
                errorText.innerText = 'Error al crear el item'

                response = await fetch(domain + 'create/master',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(row)
                })
                responseData = await response.json()                
            }

            // edit
            if (g.action == 'edit') {

                okText.innerText = 'Item editado con éxito'
                errorText.innerText = 'Error al editar el item'

                const data = {
                    condition: 'id',
                    data:[{
                        id: g.elementToEdit.id,
                        dataToUpdate: row
                    }]
                }

                response = await fetch(domain + 'update/master',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                responseData = await response.json()                
            }

            // show result
            if (responseData.response == 'ok') {
                gu.showResultPopup(okPopup)                
            }else{
                gu.showResultPopup(errorPopup)
            }

            // reset data
            await utils.resetData()
            ceipp.style.display = 'none'
            ceippLoader.style.display = 'none'
        }
    })  
}

export { ceippEventListeners }