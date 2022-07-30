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
import SQLite from 'tauri-plugin-sqlite-api'

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
      db: '',
    }
  },
  async mounted() {
    this.db = await SQLite.open('./database.db');
    this.resultConsole.push({'db': this.db});
    //const rows = await this.db.select<Array<{ count: number }>>('SELECT * FROM users')
    //console.log(rows);
  },

  methods: {
    async searchdb() {
      const key = this.keyword;
      const rows = await this.db.select(
        "SELECT * FROM products WHERE model LIKE '%" + key + "%' OR name LIKE '%" + key + "%' OR barcode LIKE '%" + key + "%' "
      )
      this.resultConsole.push({'db': rows});


      console.log(rows);

    },
    isNumber(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      //if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    async addProduct() {
      var item = this.addItem;
      if(item.quantity > 0) {
        item.status = "inStock"
      }

      try {
        await this.db.execute(
        'INSERT INTO products VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)', 
          [item.barcode,
            item.name,
            item.model,
            item.price_original,
            item.price_sale,
            item.quantity,
            item.status]
        )
      } catch(err) {
        console.log(err)
      }
      
    },
    async createdb () { 
      await this.db.execute(`
        create TABLE if not EXISTS products (
          barcode text NOT NULL UNIQUE,
          name TEXT NOT NULL,
          model text NOT NULL,
          price_original FLOAT NOT NULL,
          price_sale FLOAT NOT NULL,
          quantity_amount INT DEFAULT 0,
          quantity_status varCHar(10) DEFAULT 'outOfStock'
        );
    `) 
    },
    async dropdb() {
      await this.db.execute(`
        drop TABLE if exists products
      `)
    },
    async showdb() {
      const rows = await this.db.select(
        'SELECT * FROM products'
      )
      this.resultConsole.push({'db': rows});

      console.log(rows);
    },
    async countdb() {
      const rows = await this.db.select(
        'SELECT COUNT(*) as count FROM products'
      )
      this.resultConsole.push({'db': rows});

      console.log(rows);
    },
    
  },
})
</script>