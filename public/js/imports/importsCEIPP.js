import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { printDetails } from "./printDetails.js"
import { utils } from "./utils.js"

// create edit item popup (ceipp)
async function ceippEventListeners() {

    // check
    ceippCheck.addEventListener('click', async () => {
        g.details = g.details.map(d => ({
            ...d,
            pays_duties_tarifs: ceippCheck.checked ? 1 : 0
        }))

        printDetails()
    })

    // add item
    ceippAddItem.addEventListener('click',async()=>{

        if (ceippItem.value != '' && ceippQty.value != '') {

            const itemData = g.supplierItems.find( i => i.item.toLowerCase() == ceippItem.value)
            const findItem = g.details.find( i => i.item.toLowerCase() == ceippItem.value)

            if (itemData && !findItem) {
                
                let nextIndex = 1

                if (g.details.length > 0) {
                    const maxIndex = Math.max(...g.details.map(d => d.idx || 0))
                    nextIndex = maxIndex + 1
                }

                g.details.push({
                    idx: nextIndex,
                    id_master: itemData.id,
                    item: ceippItem.value,
                    description: itemData.description,
                    id_measurement_units: itemData.id_measurement_units,
                    mu_per_box: Number(itemData.mu_per_box),
                    mu_quantity: Number(ceippQty.value),
                    fob: Number(itemData.fob),
                    volume_m3: Number(itemData.volume_m3),
                    weight_kg: Number(itemData.weight_kg),
                    pays_duties_tarifs: 0,
                    estimated_unit_cost: itemData.estimated_unit_cost,
                    mu: itemData.mu_data.measurement_unit
                })

                // update data
                utils.updateDetailsData()

                // print details
                printDetails()

                // clear inputs
                gu.clearInputs([ceippItem, ceippQty])

                // focus
                ceippItem.focus()

                // hide error
                const errorText = ''
                ceippError.innerText = errorText
            }else{
                const errorText = findItem ? 'El item ingresado ya se encuentra en la OC' : 'No se encuentra el item en la lista del proveedor'
                ceippError.innerText = errorText
            }
        }
    })

    // save po
    ceippSave.addEventListener('click',async()=>{
        coppText.innerHTML = '¿Confirma que desea guardar la <b>OC ' + ceippPo.value + ' </b>del proveedor <b>' + g.supplierData.supplier + '</b>?'
        copp.style.display = 'block'
    })

    
}

export { ceippEventListeners }