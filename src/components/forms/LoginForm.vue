<template>
  <div class="login-bg">
    <div class="login-container">
      <img src="@/assets/images/LogoTransparenteBlancoRedi.png" alt="Logo" class="logo" />
      <h2>CONNOS PARK</h2>
      <h1>INICIAR SESIÓN</h1>
      <form @submit.prevent="handleLogin" class="form">
        <div class="input-box">
          <input type="text" v-model="username" placeholder="Usuario o correo" required />
        </div>
        <div class="input-box">
          <input type="password" v-model="password" placeholder="Contraseña" required />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="btn-primary">Iniciar Sesión</button>
        <button type="button" class="btn-secondary" @click="toForgotPassword">
          ¿Olvidaste tu contraseña?
        </button>
      </form>
      <p class="terms">By registering you with our <a href="#">Terms and Conditions</a></p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  error.value = ''
  try {
    const response = await axios.post(
      'https://connos-park-backend-d10312bcbd87.herokuapp.com/api/token/',
      {
        username: username.value,
        password: password.value
      }
    )
    const accessToken = response.data.access
    const refreshToken = response.data.refresh
    // Guardar en localStorage
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    // Redirige a dashboard o página protegida
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Usuario o contraseña incorrectos'
  }
}

function toForgotPassword() {
  router.push('/forgot-password')
}
</script>

<style scoped>
.login-bg {
  background-image: url('@/assets/images/fondoLogin_OlvCont.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background: rgba(34, 18, 56, 0.75);
  border-radius: 24px;
  padding: 40px 32px;
  width: 420px;
  max-width: 92vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 112px;
  margin-bottom: 14px;
}

h1 {
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 20px;
  font-weight: bold;
  letter-spacing: 1px;
  /* Corrige separación con el logo y subtítulo */
}
.error-message{
  color: #c106ff;
  font-size: 1rem;
  margin-bottom: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}

h2 {
  color: #fff;
  margin-bottom: -14px;
  font-size: 1.2rem;
  font-weight: normal;
}

.input-box input {
  width: 90%;
  padding: 12px 18px;
  background: #2d174b;
  color: #fff;
  border: none;
  border-radius: 7px;
  margin-bottom: 18px;
  font-size: 1rem;
}

.btn-primary, .btn-secondary {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 7px;
  font-size: 1.12rem;
  margin-bottom: 10px;
  margin-top: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(90deg, #8754e7 0%, #599ee9 100%);
  color: #fff;
}

.btn-secondary {
  background: linear-gradient(90deg, #9659c3 0%, #699bc4 100%);
  color: #fff;
}

.terms {
  margin-top: 24px;
  color: #d4d0fa;
  font-size: 0.85rem;
}
.terms a {
  color: #aa95e8;
  text-decoration: underline;
}

@media (max-width: 520px) {
  .login-container {
    width: 95vw;
    padding: 28px 12px;
  }
  h1 {
    font-size: 1.3rem;
  }
  .logo {
    width: 75px;
  }
}
</style>
