import g from "./globals.js"
import gg from "../globals.js"

async function printImports() {
    
    body.innerHTML = ''
    let html = ''
    const data = g.imports

    data.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'ta-c fs-12 pad-6-0 body-even' : 'ta-c fs-12 pad-6-0 body-odd'
        const date = element.date.split('-')[2].split('T')[0] + '/' + element.date.split('-')[1] + '/' + element.date.split('-')[0]
        
        html += `
            <tr class="pointer" id="tr_${element.id}">
                <td class="${rowClass}">${element.purchase_order}</td>
                <td class="${rowClass}">${element.supplier_data.supplier}</td>
                <td class="${rowClass}">${date}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.calculated_data.fob)}</td>
                <td class="${rowClass}">${element.supplier_data.currency_data.currency}</td>
                <td class="${rowClass}">${element.calculated_data.volume_m3 == null ? '' : gg.formatter3.format(element.calculated_data.volume_m3)}</td>
                <td class="${rowClass}">${gg.formatter0.format(element.calculated_data.boxes)}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${''}</td>
                <td class="${rowClass}">${gg.formatter2.format(element.calculated_data.estimated_cost)}</td>
                <td class="${rowClass}">${''}</td>                
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square fs-12" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-solid fa-truck-ramp-box fs-12" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-file-excel fs-12" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-solid fa-magnifying-glass-plus fs-12" id="edit_${element.id}"></i></td>
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
//             ceippAccept.innerText = 'EDITAR'
//             ceipp.style.display = 'block'
//             ceippContent.scrollTop = 0
//             ceippError.classList.add('not-visible')
//             ceippDgas.classList.remove('not-visible')
            
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
//             ceippVolume.value = Number(element.volume_m3).toFixed(3).replace('.',',')
//             ceippBrand.value = element.brand
//             ceippOrigin.value = element.origin
//             ceippBreaks.value = element.has_breaks
//             ceippSpecialPriceFactor.value = element.special_price_factor == null ? '' : Number(element.special_price_factor).toFixed(3).replace('.',',')

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

export { printImports }