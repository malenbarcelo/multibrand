import g from "./globals.js"
import gg from "../globals.js"
import { gu } from "../globalUtils.js"

async function printTable() {
    
    body.innerHTML = ''
    let html = ''
    const data = g.data

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-4-0 body-even' : 'ta-c fs-12 pad-4-0 body-odd'
        
        html += `
            <tr class="pointer" id="tr_${element.id}">                
                <td class="${rowClass}">${element.list_name_data.price_list_name}</td>
                <td class="${rowClass}">${element.category_data.category_name}</td>
                <td class="${rowClass}">${element.supplier_data.supplier}</td>
                <td class="${rowClass}">${element.erp_item == null ? '' : element.erp_item}</td>
                <td class="${rowClass}">${element.supplier_item == null ? '' : element.supplier_item}</td>
                <td class="${rowClass}">${element.price_list_item == null ? '' : element.price_list_item}</td>
                <td class="${rowClass}">${element.description == null ? '' : element.description}</td>
                <td class="${rowClass}">${gg.formatter0.format(element.master_data ? element.master_data.mu_per_box : '')}</td>
                <td class="${rowClass}">${gg.formatter0.format(element.master_details ? element.master_details.sells_price_local_currency : '')}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square fs-12" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can fs-12" id="destroy_${element.id}"></i></td>
            </tr>
            `
    })

    body.innerHTML = html

    //eventListeners(data)
}

// function eventListeners(data) {

//     data.forEach(element => {

//         const edit = document.getElementById('edit_' + element.id)
//         const destroy = document.getElementById('destroy_' + element.id)
//         const tr = document.getElementById('tr_' + element.id)

//         // edit
//         edit.addEventListener('click',async()=>{
//             g.action = 'edit'
//             g.elementToEdit = element
//             ceippTitle.innerText = 'EDITAR ITEM'
//             ceipp.style.display = 'block'
//             ceippContent.scrollTop = 0
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
//             ceippObservations.value = element.observations || ''

//             ceippSupplier.dispatchEvent(new Event('change'))
//             ceippSupplier.focus()
//         })

//         // edit row with double click
//         tr.addEventListener('dblclick',async()=>{
//             if (edit) {
//                 edit.click()
//             }
//         })

//         //destroy
//         destroy.addEventListener('click',async()=>{
//             g.confirmation = 'deleteItem'            
//             g.elementToEdit = element
//             coppText.innerHTML = '¿Confirma que desea eliminar el item <b>' + element.item + '</b> del proveedor <b>' + element.supplier_data.supplier + '</b>?'
//             copp.style.display = 'block'
//         })
//     })
// }

export { printTable }
