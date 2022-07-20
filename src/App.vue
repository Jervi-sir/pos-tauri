<template>
  <div class="body">
    <header class="side-menu">
      <router-link to="/" class="logo" >
          <img  v-if="this.$route.name === ''" src="../public/img/logo_active.svg" alt="">
          <img  v-else src="../public/img/logo.svg" alt="">
      </router-link>

      <div class="menu">
        <router-link to="/accueil" class="item" >
            <img  v-if="this.$route.name === 'accueil'" src="../public/img/home_active.svg" alt="">
            <img  v-else src="../public/img/home.svg" alt="">
        </router-link>
        <router-link to="/checkout" class="item" >
            <img  v-if="this.$route.name === 'checkout'" src="../public/img/checkout_active.svg" alt="">
            <img  v-else src="../public/img/checkout.svg" alt="">
        </router-link>
        <router-link to="/inventory" class="item" >
            <img  v-if="this.$route.name === 'inventory'" src="../public/img/inventory_active.svg" alt="">
            <img  v-else src="../public/img/inventory.svg" alt="">
        </router-link>
      </div>
      
    </header>
    <router-view/>
  </div>
</template>

