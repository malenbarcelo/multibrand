let g = {
    data:[],
    popups:[sppp],
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        order:'[["list_name","ASC"],["list_category","ASC"],["price_list_item","ASC"]]',
        list_name:'',
        category_name:'',
        id_suppliers:'',
        item_string:'',
        description: '',
        enabled: 1
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
}

export default g