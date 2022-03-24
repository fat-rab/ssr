<template>
  <div>
    <span v-for="item in list" :key="item.id">{{ item.name }}</span>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {}
  },
  // 通过组件暴露函数，由于在组件实例化之前就会调用，所以无法调用this，所以需要将store和router作为参数传入
  asyncData({store, route}) {
    return store.dispatch('GET_LIST', route)
  },
  computed: {
    list() {
      return this.$store.state.list
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
