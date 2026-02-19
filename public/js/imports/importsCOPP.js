import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { utils } from "./utils.js"

// confirm popup (copp)
async function coppEventListeners() {

    coppAccept.addEventListener('click',async()=>{

        loader.style.display = 'block'
        ceipp.style.display = 'none'
        copp.style.display = 'none'

        // create po
        if (g.action == 'create') {

            const [, month, year] = ceippPo.value.split('.')
            const poNumber = `20${year}${month}`

            const data = {
                purchase_order: ceippPo.value,
                po_number: Number(poNumber),
                id_suppliers: g.supplierData.id,
                details:g.details
            }

            const response = await fetch(domain + 'create/import',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                
            const responseData = await response.json()

            // show result
            if (responseData.response == 'ok') {
                okText.innerText = 'Orden de compra creada con éxito'
                gu.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al crear la orden de compra'
                gu.showResultPopup(errorPopup)
            }

            // reset data
            await utils.resetData()
            loader.style.display = 'none'

        }

        // edit po
        if (g.action == 'edit') {

            const [, month, year] = ceippPo.value.split('.')
            const poNumber = `20${year}${month}`

            const data = {
                condition: 'id',
                updateDetails: true,
                data:[{
                    id: g.importToEdit.id,
                    dataToUpdate: {
                        purchase_order: ceippPo.value,
                        po_number: Number(poNumber),
                        details:g.details
                    }
                }]
            }

            const response = await fetch(domain + 'update/import',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                
            const responseData = await response.json()

            // show result
            if (responseData.response == 'ok') {
                okText.innerText = 'Orden de compra editada con éxito'
                gu.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al editar la orden de compra'
                gu.showResultPopup(errorPopup)
            }

            // reset data
            await utils.resetData()
            loader.style.display = 'none'

        }

        // receive import
        if (g.action == 'receive') {

            const data = {
                condition: 'id',
                updateDetails: false,
                data:[{
                    id: g.importToEdit.id,
                    dataToUpdate: {
                        reception_date: rippDate.value,
                        currency_exchange: Number(rippTc.value.replace(',','.')),
                        freight_local_currency: Number(rippFreight.value.replace(',','.')),
                        insurance_local_currency: Number(rippInsurance.value.replace(',','.')),
                        forwarder_local_currency: Number(rippForwarder.value.replace(',','.')),
                        domestic_freight_local_currency: Number(rippDomesticFreight.value.replace(',','.')),
                        dispatch_expenses_local_currency: Number(rippDispatchExpenses.value.replace(',','.')),
                        office_fees_local_currency: Number(rippOfficeFees.value.replace(',','.'))   ,
                        container_costs_local_currency: Number(rippContainerCosts.value.replace(',','.')),
                        port_expenses_local_currency: Number(rippPortExpenses.value.replace(',','.')),
                        duties_tariffs_local_currency: Number(rippDutiesTariffs.value.replace(',','.')),
                        container_insurance_local_currency: Number(rippContainerInsurance.value.replace(',','.')),
                        port_contribution_local_currency: Number(rippPortContribution.value.replace(',','.')),
                        other_expenses_local_currency: Number(rippOtherExpenses.value.replace(',','.')),
                    }
                }]
            }

            const response = await fetch(domain + 'update/import',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                
            const responseData = await response.json()

            // show result
            if (responseData.response == 'ok') {
                okText.innerText = 'Orden recibida con éxito'
                gu.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al recibir la orden de compra'
                gu.showResultPopup(errorPopup)
            }

            // reset data
            ripp.style.display = 'none'
            await utils.resetData()
            loader.style.display = 'none'

        }

        // delete po
        if (g.action == 'delete') {

            const data = {
                condition: 'id',
                data:[{
                    id: g.importToEdit.id,
                    dataToUpdate: { enabled: 0}
                }],
                updateDetails: false
            }

            const response = await fetch(domain + 'update/import',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                
            const responseData = await response.json()

            // show result
            if (responseData.response == 'ok') {
                okText.innerText = 'Orden de compra eliminada con éxito'
                gu.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al eliminar la orden de compra'
                gu.showResultPopup(errorPopup)
            }

            // reset data
            await utils.resetData()
            loader.style.display = 'none'

        }
    })
}

export { coppEventListeners }