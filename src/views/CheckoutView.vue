<template>
    <main id="dashboard">
        <div class="dashboard" >
            <div class="top">
                <h3 class="dashboard-title">Sales Product</h3>
                <form class="search-form"  @keydown.enter.prevent="search">
                    <button type="submit" @click.prevent="search">
                        <img src="../../public/img/search.svg" alt="">
                    </button>
                    <input type="text" placeholder="Search Products, bar code ..." v-model="keyword">
                </form>
            </div>
            <div class="middle">
                <div class="tabs">
                    <span class="product-name">Product name</span>
                    <span class="original-price">Original Price</span>
                    <span class="product-quantity">Quantity</span>
                    <span class="sale-price">Sale price</span>
                </div>
                <div class="items" >
                    <div class="card"  v-for="(product, index) in products" :key="index" @click="addToCheckout(product)">
                         <div class="sale-price">
                            <span>{{ product.price.sale }}</span>
                        </div>
                        <div class="product-quantity">
                            <div class="amount outOfStock" :class="{ inStock: product.quantity.amount >= 1 }">
                                <span>{{ product.quantity.amount }}</span>
                            </div>
                            <div class="status outOfStock" :class="{ inStock: product.quantity.amount >= 1 }">
                                <span>{{ product.quantity.status }}</span>
                            </div>
                        </div>
                        <div class="original-price">
                            <div class="price-bordered">
                                <span>{{ product.price.original }}</span>
                            </div>
                        </div>
                        <div class="product-name">
                            <span class="barcode">{{ product.details.barcode }}</span>
                            <span class="item-title">{{ product.details.name }}</span>
                            <span class="item-model">{{ product.details.model }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        <div class="checkout">
            <div class="top">
                <h4 class="date">Friday, 08 July 2022</h4>
                <h2>Checkout</h2>
                <div class="items">
                    <div class="card" v-for="(item, index) in checkouts" :key="index">
                        <div class="title">{{ item.details.name }}</div>
                        <div class="row">
                            <div class="price">{{ item.price.sale }}</div>
                            <div class="quantity-selector">
                                <button @click="deleteFromCheckout(index)">del</button>
                                <button @click="removeQtn(index)"> - </button>
                                <div class="input-amount">
                                    <input type="number" :value="item.quantity.ordered" min="1" :max="item.quantity.amount">
                                </div>
                                <button @click="addQtn(index)"> + </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div class="checkout-total">
                <div class="row original">
                    <span>Original Total</span>
                    <span>{{ priceFormat(pay.original) }}</span>
                </div>
                <div class="row gained">
                    <span>Gained Total</span>
                    <span>{{ priceFormat(pay.gained) }}</span>
                </div>
                <div class="row total-pay">
                    <span>Total to Pay</span>
                    <span>{{ priceFormat(pay.sale) }}</span>
                </div>
                </div>
                <button class="process-payment" @click="processPayment">
                    Pay Now
                </button>
            </div>
        </div>
        <div class="popup-container" v-show="popup.payment">
            <div class="popup-layer" >
            </div>
            <div class="popup" >
                <img src="../../public/img/success.svg" alt="">
                <h2>Payment Successful</h2>
                <p>orders successfully processed, and saved in the database</p>
                <a href="#" @click="reloadPage" class="new-order">New Orders!</a>
            </div>
        </div>
    </main>
    
</template>

<style lang="scss">
  @import "../../public/styles/checkout.scss";
</style>

<script>
// @ is an alias to /src
import SQLite from 'tauri-plugin-sqlite-api'
import json from '../../public/database.json'
import { priceFormat, calSale, calOriginal } from '../functions/helper'
export default {
    data () {
        return {
            db: '',
            keyword: '',
            products: [],
            checkouts: [],
            pay: {
                original: 0,
                gained: 0,
                sale: 0,
            },
            popup: {
                payment: false
            }
        }
    },
    async mounted() {
        this.db = await SQLite.open('./database.db');
        const rows = await this.db.select(
            'SELECT * FROM products'
        )
        rows.forEach(item => {
            var temp = {
                "details":{
                    "barcode": item.barcode,
                    "name": item.name,
                    "model": item.model
                },
                "price": {
                    "original": item.price_original,
                    "sale": item.price_sale
                },
                "quantity": {
                    "amount": item.quantity_amount,
                    "status": item.quantity_status
                }
            }
            this.products.push(temp);
        });
    },
    watch: {
        checkouts: {
            // eslint-disable-next-line
            handler(newValue){
                this.pay.original = this.calOriginal()
                this.pay.sale = this.calSale()
                this.pay.gained = this.pay.sale - this.pay.original;
            }, deep: true
        }
    },

    methods: {
        reloadPage() {
            window.location.reload();
        },
        processPayment () { 
            this.checkouts.forEach( item => {
                this.getData(item).then(result => {console.log(result)})
            })
            //this.popup.payment = true;
        },
        async getData(item) {
            const row = await this.db.select(
                'UPDATE products SET quantity_amount = (?1) WHERE barcode = (?2)',
                [item.quantity.amount, item.details.barcode]
                )
            return row;
        },
        priceFormat(price) {
            return priceFormat(price);
        },
        calSale() { 
            return calSale(this.checkouts) ;
        },
        calOriginal () { 
            return calOriginal(this.checkouts) ;
        },
        deleteFromCheckout (index) { 
            this.checkouts[index].quantity.amount += this.checkouts[index].quantity.ordered;
            this.checkouts.pop(index);
        },
        addQtn(index) { 
           var available = this.checkouts[index].quantity.amount;
           if(available != 0) {
                this.checkouts[index].quantity.amount--;
                this.checkouts[index].quantity.ordered++;
           }
        },
        removeQtn(index) { 
           var available = this.checkouts[index].quantity.amount;
           var maxQtb = this.checkouts[index].quantity.maxQtb;
           if(available != maxQtb) {
                this.checkouts[index].quantity.amount++;
                this.checkouts[index].quantity.ordered--;
           }
        },
        addToCheckout (product) { 
            var exists = this.checkouts.includes(product);
            if(product.quantity.amount == 0) { return; }
            if (!exists) {
                var temp = product;
                product.quantity.amount--;
                temp.quantity.ordered = 1;
                temp.quantity.maxQtb = product.quantity.amount;
                this.checkouts.push(temp);
                //console.log(this.checkouts); 
            }
        },
        searchJson () { 
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
        },
        async search() {
            const key = this.keyword;
            const rows = await this.db.select(
                "SELECT * FROM products WHERE model LIKE '%" + key + "%' OR name LIKE '%" + key + "%' OR barcode LIKE '%" + key + "%' "
            )
            this.products = [];
            rows.forEach(item => {
                this.products.push(this.putDataInJson(item));
            });
            console.log(rows);
        },
        putDataInJson(item) {
            var temp = {
                "details":{
                    "barcode": item.barcode,
                    "name": item.name,
                    "model": item.model
                },
                "price": {
                    "original": item.price_original,
                    "sale": item.price_sale
                },
                "quantity": {
                    "amount": item.quantity_amount,
                    "status": item.quantity_status
                }
            }
            return temp;
        }
    },
    name: 'CheckoutView',
    components: {

    }
}
</script>
