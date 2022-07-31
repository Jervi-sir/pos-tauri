function priceFormat(price) {
    const formatter = new Intl.NumberFormat('ar-DZ', {
        style: 'currency',
        currency: 'DZD',
    });
    return formatter.format(price);
}

function calSale(checkouts) { 
    let saleTotal = 0;
    checkouts.forEach(item => {
        saleTotal += (item.price_sale * item.qtn_ordered);
    })
    return saleTotal ;
}

function calOriginal(checkouts) { 
    let originalTotal = 0;
    checkouts.forEach(item => {
        originalTotal += (item.price_original * item.qtn_ordered);
    })
    return originalTotal ;
}

function acceptNumber(evt) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    //if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
      evt.preventDefault();
    } else {
      return true;
    }
}

function wrapDataInJson(item) {
    return {
        "barcode": item.barcode,
        "name": item.name,
        "model": item.model,
        "price_original": item.price_original,
        "price_sale": item.price_sale,
        "qtn_amount": item.quantity_amount,
        "qtn_status": item.quantity_status
    }
}

function todayDate() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const today = new Date();
    const dayName = today.toLocaleDateString('en-En', { weekday: 'long' });
    const monthName = monthNames[today.getMonth()];
    const year = today.getFullYear();
    const day = today.getDate();
    //Friday, 08 July 2022
    return dayName + ', ' + day + ' ' + monthName + ' ' + year;
}

export { 
    calSale, 
    acceptNumber,
    priceFormat, 
    calOriginal,
    wrapDataInJson,
    todayDate
}



/*
function searchInJson () { 
    this.products = [];
    this.keyword = this.keyword.replace(/\s+/g, ' ').trim();
    json.filter(product => {
        var found = product.details.barcode.toLowerCase().includes(this.keyword.toLowerCase()) ||
                    product.details.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
                    product.details.model.toLowerCase().includes(this.keyword.toLowerCase()) ;
        if(found) {
            this.products.push(product)
        }
    });
    //console.log('search fired up');
}
*/