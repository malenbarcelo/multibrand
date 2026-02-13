import g from "./globals.js"
import gg from "../globals.js"
import { gu } from "../globalUtils.js"
import { printDetails } from "./printDetails.js"
import { domain } from "../domain.js"

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
                <td class="${rowClass}">${(element.calculated_data.estimated_cost == null || element.calculated_data.estimated_cost == 0) ? '' : gg.formatter2.format(element.calculated_data.estimated_cost)}</td>
                <td class="${rowClass}">${''}</td>                
                <td class="${rowClass}"><i class="fa-regular fa-pen-to-square fs-12" id="edit_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-solid fa-truck-ramp-box fs-12" id="receive_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-file-excel fs-12" id="excel_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-solid fa-magnifying-glass-plus fs-12" id="details_${element.id}"></i></td>
                <td class="${rowClass}"><i class="fa-regular fa-trash-can fs-12" id="destroy_${element.id}"></i></td>
            </tr>
            `
    })

    body.innerHTML = html

    eventListeners(data)
}

function eventListeners(data) {

    data.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const destroy = document.getElementById('destroy_' + element.id)
        const excel = document.getElementById('excel_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        // edit
        edit.addEventListener('click',async()=>{
            
            // action and title
            g.action = 'edit'
            g.importToEdit = element
            g.supplierData = g.suppliers.find( s => s.id == element.id_suppliers)
            
            // supplieritems
            const supplierItems = await (await fetch(`${domain}get/master?id_suppliers=${element.id_suppliers}&enabled=1`)).json()
            g.supplierItems = supplierItems.rows

            ceippTitle.innerText = 'EDITAR ORDEN DE COMPRA - ' + g.supplierData.supplier.toUpperCase()

            // complete poNumber
            ceippPo.value = element.purchase_order

            // hide errors and clear data
            ceippError.innerText = ''
            gu.clearInputs([ceippItem, ceippQty])

            // check
            const payDuties = element.details.filter( d => d.pays_duties_tarifs == 1)
            if (payDuties.length == element.details.length) {
                ceippCheck.checked = true
            }else{
                ceippCheck.checked = false
            }
            
            // get details
            g.details = []
            element.details.forEach(detail => {
                
                const boxes = Number(detail.mu_quantity) / Number(detail.mu_per_box)

                g.details.push({
                    idx: detail.id,
                    id_master: detail.id_master,
                    item: detail.item,
                    description: detail.description,
                    id_measurement_units: detail.id_measurement_units,
                    mu_per_box: Number(detail.mu_per_box),
                    mu_quantity: Number(detail.mu_quantity),
                    fob: Number(detail.fob),
                    volume_m3: Number(detail.volume_m3),
                    weight_kg: Number(detail.weight_kg),
                    pays_duties_tarifs: detail.pays_duties_tarifs,
                    estimated_unit_cost: detail.estimated_unit_cost,
                    mu: detail.mu_data.measurement_unit,
                    totalFob: Number(detail.fob) * Number(detail.mu_quantity),
                    totalVolume: Number(detail.volume_m3) * boxes,
                    totalWeight: Number(detail.weight_kg) * boxes,
                    boxes: boxes,
                })
                
            })

            // print table
            printDetails()

            // show popup
            ceipp.style.display = 'block'
            ceippItem.focus()
        })

        // edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        //destroy
        destroy.addEventListener('click',async()=>{
            g.action = 'delete'            
            g.importToEdit = element
            coppText.innerHTML = '¿Confirma que desea eliminar la orden de compra <b>' + element.purchase_order + '</b> del proveedor <b>' + element.supplier_data.supplier + '</b>?'
            copp.style.display = 'block'
        })

        // download excel
        excel.addEventListener('click',async()=>{
            
            // download price list
            loader.style.display = 'block'

            const data = {id: element.id}

            const response = await fetch(domain + 'composed/download-purchase-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = element.purchase_order + ' - ' + element.supplier_data.supplier + '.xlsx'
                document.body.appendChild(a)
                a.click()
                a.remove()
            } else {
                console.error('Error al descargar el archivo:', response.statusText);
            }

            loader.style.display = 'none'
        })
    })
}

export { printImports }