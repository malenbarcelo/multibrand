import g from "./globals.js"
import gg from "../globals.js"
import { gu } from "../globalUtils.js"

async function printTable() {
    
    body.innerHTML = ''
    let html = ''
    const data = g.master

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-7-0 body-even' : 'ta-c fs-12 pad-7-0 body-odd'
        
        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass}">${element.supplier_data.supplier}</td>
                <td class="${rowClass}">${element.item}</td>
                <td class="${rowClass}">${element.description}</td>
                <td class="${rowClass}">${element.mu_data.measurement_unit}</td>
                <td class="${rowClass}">${element.mu_per_box == null ? '' : gg.formatter1.format(element.mu_per_box)}</td>
                <td class="${rowClass}">${element.weight_kg == null ? '' : gg.formatter3.format(element.weight_kg)}</td>
                <td class="${rowClass}">${element.volume_m3 == null ? '' : gg.formatter4.format(element.volume_m3)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.fob)}</td>
                <td class="${rowClass}">${gg.formatter3.format(element.unit_fob)}</td>
                <td class="${rowClass}">${element.supplier_data.currency_data.currency}</td>
                <td class="${rowClass}">${element.estimated_unit_cost == null ? '' : gg.formatter3.format(element.estimated_unit_cost)}</td>
                <td class="${rowClass}">${element.sells_price_local_currency == null ? '' : gg.formatter0.format(element.sells_price_local_currency)}</td>
                <td class="${rowClass}">${element.margin == null ? '' : gg.formatter1.format(element.margin) + ' %'}</td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)
}

function eventListeners(data) {

    data.forEach(element => {

        const tr = document.getElementById('tr_' + element.id)

        // edit
        tr.addEventListener('click',async()=>{
            g.action = 'edit'
            g.elementToEdit = element
            ceippTitle.innerText = 'EDITAR ITEM'
            ceipp.style.display = 'block'
            ceippScrollBody.scrollTop = 0
            ceippError.classList.add('not-visible')
            ceippDestroy.classList.remove('not-visible')
            
            // complete inputs
            ceippSupplier.value = element.id_suppliers
            ceippSupplier.disabled = true
            ceippSupplierLabel.style.display = 'none'
            ceippSupplier.dispatchEvent(new Event('change'))
            ceippItem.value = element.item
            ceippDescription.value = element.description
            ceippFob.value = Number(element.fob).toFixed(3).replace('.',',')
            ceippMu.value = element.id_measurement_units
            ceippMuPerBox.value = Number(element.mu_per_box).toFixed(3).replace('.',',')
            ceippWeight.value = element.weight_kg == null ? '' : Number(element.weight_kg).toFixed(3).replace('.',',')
            ceippVolume.value = element.volume_m3 == null ? '' : Number(element.volume_m3).toFixed(4).replace('.',',')
            ceippBrand.value = element.brand
            ceippOrigin.value = element.origin
            ceippBreaks.value = element.has_breaks
            ceippSpecialPriceFactor.value = element.special_price_factor == null ? '' : Number(element.special_price_factor).toFixed(3).replace('.',',')
            ceippCfFactor.value = element.end_consumer_factor == null ? '' : Number(element.end_consumer_factor).toFixed(3).replace('.',',')
            ceippMeLiFactor.value = element.meli_factor == null ? '' : Number(element.meli_factor).toFixed(3).replace('.',',')
            ceippObservations.value = element.observations || ''

            ceippSupplier.dispatchEvent(new Event('change'))
            ceippSupplier.focus()

        })

    })
}

export { printTable }