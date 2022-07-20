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
        saleTotal += (item.price.sale * item.quantity.ordered);
    })
    return saleTotal ;
}

function calOriginal(checkouts) { 
    let originalTotal = 0;
    checkouts.forEach(item => {
        originalTotal += (item.price.original * item.quantity.ordered);
    })
    return originalTotal ;
}

export { priceFormat, calSale, calOriginal}