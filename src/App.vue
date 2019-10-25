<template>
  <div id="app">
    hello
    {{this.$store.state.age}}
    {{this.$store.getters.getName}}
    {{this.$store.getters.getAge}}
    {{this.$store.state.a1}}
    <button @click="changeAge">更改年龄</button>
    <button @click="changeName">更改姓名</button>
    <button @click="syncChangeAge">异步更改年龄</button>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      testMutationNum: 0
    }
  },
  methods: {
    changeAge() {
      this.$store.commit('addAge', 20)
    },
    changeName() {
      this.$store.commit('changeName', '你好')
    },
    syncChangeAge() {
      setTimeout(() => {
        this.$store.dispatch('minusAge', 5)
      }, 3000)
    }
  },
  mounted() {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
