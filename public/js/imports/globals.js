let g = {
    imports:[],
    suppliers:[],
    branchData: null,
    popups: [copp,sspp,eipp,ceipp],
    elementsToFormat: [ceippQty, eippFob, eippQty],
    // imports
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        order:'[["po_number","DESC"]]',
        id_suppliers:'',
        item_string:'',
        enabled: 1
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // main table tooltips
    tooltips: [
        {
            icon:eippIcon,
            right:'17.5%',
        },
        {
            icon:rippIcon,
            right:'14.5%',
        },
        {
            icon:pippIcon,
            right:'11%',
        },
        {
            icon:iippIcon,
            right:'8%',
        },
        {
            icon:dippIcon,
            right:'4.5%',
        },
    ],
    action: null,
    // modify pos
    itemToEdit: null,
    importToEdit: null,
    supplierData: null,
    supplierItems: [],
    details: []
}

export default g