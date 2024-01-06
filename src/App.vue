<template>
  <div id="app">
    <div class="logoHeader">
      <img class="logo" src="./assets/logo.png" alt="logo" />
      <span class="title">前端监控</span>
    </div>
    <router-view />
  </div>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // padding: 0 10px;
}
.logoHeader {
  // width: 100%;
  padding: 10px 20px;
  text-align: left;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 99;
  .logo {
    width: 70px;
    height: 42px;
  }
  .title {
    margin-left: 10px;
    font-weight: bold;
  }
}
nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.home {
  padding: 0 10px;
}

* {
  margin: 0;
}
</style>
