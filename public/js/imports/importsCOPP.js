import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { utils } from "./utils.js"

// confirm popup (copp)
async function coppEventListeners() {

    coppAccept.addEventListener('click',async()=>{
        console.log('hola')

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