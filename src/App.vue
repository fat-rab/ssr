<template>
  <div id="app">
    <router-link to="/" exact>
    </router-link>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>

</style>
