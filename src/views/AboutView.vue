<template>
  <div class="about">
    <h1>dThis is an about page</h1>
    <button @click="createdb()">Create database</button>
    <button @click="dropdb()">Drop database</button>
    <button @click="showdb()">Show database</button>
    <button @click="countdb()">Count database</button>
    <br>
    <button @click="searchdb()">Search in database</button>
    <input type="text" v-model="keyword" placeholder="search"><br>


    <br>
    <button @click="addProduct()">add record in database</button><br>
    <input type="text" v-model="addItem.barcode" placeholder="barcode"><br>
    <input type="text" v-model="addItem.name" placeholder="name"><br>
    <input type="text" v-model="addItem.model" placeholder="model"><br>
    <input type="text" v-model="addItem.price_original" placeholder="original price" @keypress="isNumber($event)"><br>
    <input type="text" v-model="addItem.price_sale" placeholder="sale price" @keypress="isNumber($event)"><br>
    <input type="text" v-model="addItem.quantity" placeholder="quantity" @keypress="isNumber($event)"><br>
    {{addItem}}
    <br>
    <h1>console log</h1>
    {{resultConsole}}

  </div>
</template>


<script>
import { createDB, dropDB } from '../functions/initDB'
import { countProducts, showAll, addProduct, searchDB } from '../functions/database'
import { acceptNumber } from '../functions/helper'

export default ({
  name: "app",
  data() {
    return {
      resultConsole: [],
      keyword: '',
      addItem: {
        barcode: '',
        name: '',
        model: '',
        price_original: '',
        price_sale: '',
        quantity: '',
        status: 'oufOfStock',
      },
    }
  },

  methods: {
    async searchdb() {
      const search = await searchDB(this.keyword);
      this.resultConsole.push({'search': search});
    },
    isNumber(evt) {
      acceptNumber(evt);
    },
    async addProduct() {
      const added = await addProduct(this.addItem);
      this.resultConsole.push({'added': added});
    },
    async createdb () { 
      await createDB();
    },
    async dropdb() {
      await dropDB();
    },
    async showdb() {
      const result = await showAll();
      this.resultConsole.push({'show': result});
    },
    async countdb() {
      const total = await countProducts();
      this.resultConsole.push({'count': total});
    },
    
  },
})
</script>