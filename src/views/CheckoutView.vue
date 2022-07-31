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
                            <span>{{ product.price_sale }}</span>
                        </div>
                        <div class="product-quantity">
                            <div class="amount outOfStock" :class="{ inStock: product.qtn_amount >= 1 }">
                                <span>{{ product.qtn_amount }}</span>
                            </div>
                            <div class="status outOfStock" :class="{ inStock: product.qtn_amount >= 1 }">
                                <span>{{ product.qtn_status }}</span>
                            </div>
                        </div>
                        <div class="original-price">
                            <div class="price-bordered">
                                <span>{{ product.price_original }}</span>
                            </div>
                        </div>
                        <div class="product-name">
                            <span class="barcode">{{ product.barcode }}</span>
                            <span class="item-title">{{ product.name }}</span>
                            <span class="item-model">{{ product.model }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        <div class="checkout">
            <div class="top">
                <h4 class="date">{{ date }}</h4>
                <h2>Checkout</h2>
                <div class="items">
                    <div class="card" v-for="(item, index) in checkouts" :key="index">
                        <div class="title">{{ item.name }}</div>
                        <div class="row">
                            <div class="price">{{ item.price_sale }}</div>
                            <div class="quantity-selector">
                                <button @click="deleteFromCheckout(index)">del</button>
                                <button @click="removeQtn(index)"> - </button>
                                <div class="input-amount">
                                    <input type="number" :value="item.qtn_ordered" min="1" :max="item.qtn_amount">
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
import { priceFormat, calSale, calOriginal, wrapDataInJson, todayDate } from '../functions/helper'
import { showAll, updateQtn, searchDB } from '../functions/database';
export default {
    data () {
        return {
            date: 'Friday, 08 July 2022',
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
        const rows = await showAll();
        rows.forEach(item => {
            this.products.push(wrapDataInJson(item));
        });
        this.date = todayDate();
        
    },
    watch: {
        checkouts: {
            handler(){
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
            this.popup.payment = true;
        },
        async getData(item) {
            const row = await updateQtn(item.qtn_amount, item.barcode);
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
        addQtn(index) { 
           var available = this.checkouts[index].qtn_amount;
           if(available != 0) {
                this.checkouts[index].qtn_amount--;
                this.checkouts[index].qtn_ordered++;
           }
        },
        removeQtn(index) { 
           var available = this.checkouts[index].qtn_amount;
           var maxQtb = this.checkouts[index].qtn_maxQtb;
           if(available != maxQtb) {
                this.checkouts[index].qtn_amount++;
                this.checkouts[index].qtn_ordered--;
           }
        },
        addToCheckout (product) { 
            var exists = this.checkouts.includes(product);
            if(product.qtn_amount == 0) { return; }
            if (!exists) {
                var temp = product;
                product.qtn_amount--;
                temp.qtn_ordered = 1;
                temp.qtn_maxQtb = product.qtn_amount;
                this.checkouts.push(temp);
                //console.log(this.checkouts); 
            }
        },
        deleteFromCheckout (index) { 
            this.checkouts[index].qtn_amount += this.checkouts[index].qtn_ordered;
            this.checkouts.pop(index);
        },
        
        async search() {
            const key = this.keyword;
            const rows = await searchDB(key);
            this.products = [];
            rows.forEach(item => {
                this.products.push(wrapDataInJson(item));
            });
        },

    },
    name: 'CheckoutView',
    components: {

    }
}
</script>
