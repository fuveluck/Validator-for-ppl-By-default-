<template>
  <div class="login-page">
    <h2>Вхід</h2>
    <input
      type="text"
      placeholder="Логін"
      v-model="username"
    />
    <input
      type="password"
      placeholder="Пароль"
      v-model="password"
    />
    <button @click="login">Увійти</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        alert("Успішний вхід!");
        this.$emit("login-success");
      } else {
        alert("Будь ласка, введіть логін і пароль.");
      }
    },
  },
};
</script>

<style>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
input {
  margin: 10px 0;
  padding: 10px;
  width: 200px;
}
button {
  padding: 10px 20px;
}
</style>
