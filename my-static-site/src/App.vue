<template>
  <div id="app">
    <LoginPage v-if="!loggedIn" @login-success="loggedIn = true" />
    <MainPage v-else />
  </div>
</template>

<script>
import LoginPage from "./components/LoginPage.vue";
import MainPage from "./components/MainPage.vue";

export default {
  components: { LoginPage, MainPage },
  data() {
    return {
      loggedIn: false,
    };
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
</style>
