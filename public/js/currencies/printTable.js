import g from "./globals.js"
import gg from "../globals.js"
import { gu } from "../globalUtils.js"

async function printTable() {
    
    body.innerHTML = ''
    let html = ''
    const data = g.currencies

    data.forEach((element,index) => {

        console.log(element)

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-9-0 body-even' : 'ta-c fs-12 pad-9-0 body-odd'
        
        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass}">${element.currency_data.currency}</td>
                <td class="${rowClass}">${gg.formatter0.format(element.currency_exchange)}</td>
                <td class="${rowClass}"><i class="fa-solid fa-chevron-right fs-12" style="color:#999"></i></td>
                
            </tr>
            `
    })

    body.innerHTML = html

    //eventListeners(data)
}

// function eventListeners(data) {

//     data.forEach(element => {

//         const tr = document.getElementById('tr_' + element.id)

//         // edit
//         tr.addEventListener('click',async()=>{
//             g.action = 'edit'
//             g.elementToEdit = element
//             ceippTitle.innerText = 'EDITAR ITEM'
//             ceipp.style.display = 'block'
//             ceippScrollBody.scrollTop = 0
//             ceippError.classList.add('not-visible')
//             ceippDestroy.classList.remove('not-visible')
            
//             // complete inputs
//             ceippSupplier.value = element.id_suppliers
//             ceippSupplier.disabled = true
//             ceippSupplierLabel.style.display = 'none'
//             ceippSupplier.dispatchEvent(new Event('change'))
//             ceippItem.value = element.item
//             ceippDescription.value = element.description
//             ceippFob.value = Number(element.fob).toFixed(3).replace('.',',')
//             ceippMu.value = element.id_measurement_units
//             ceippMuPerBox.value = Number(element.mu_per_box).toFixed(3).replace('.',',')
//             ceippWeight.value = element.weight_kg == null ? '' : Number(element.weight_kg).toFixed(3).replace('.',',')
//             ceippVolume.value = element.volume_m3 == null ? '' : Number(element.volume_m3).toFixed(4).replace('.',',')
//             ceippBrand.value = element.brand
//             ceippOrigin.value = element.origin
//             ceippBreaks.value = element.has_breaks
//             ceippSpecialPriceFactor.value = element.special_price_factor == null ? '' : Number(element.special_price_factor).toFixed(3).replace('.',',')
//             ceippCfFactor.value = element.end_consumer_factor == null ? '' : Number(element.end_consumer_factor).toFixed(3).replace('.',',')
//             ceippMeLiFactor.value = element.meli_factor == null ? '' : Number(element.meli_factor).toFixed(3).replace('.',',')
//             ceippObservations.value = element.observations || ''

//             ceippSupplier.dispatchEvent(new Event('change'))
//             ceippSupplier.focus()

//         })

//     })
// }

export { printTable }