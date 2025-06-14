<template>
  <div style="max-width: 400px; margin: 80px auto;">
    <v-card elevation="8" class="pa-6" style="border-radius: 18px;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Parking" style="width: 80px; margin-bottom: 20px;" />
        <h2 style="margin-bottom: 24px;">Iniciar Sesión</h2>
        <v-text-field v-model="usuario" label="Usuario" style="width: 100%; margin-bottom: 12px;" />
        <v-text-field v-model="contrasenia" label="Contraseña" type="password" style="width: 100%; margin-bottom: 12px;" />
        <v-btn @click="login" color="primary" style="margin-top: 16px; width: 100%;">Entrar</v-btn>
        <div v-if="error" style="color:red; margin-top: 10px;">{{ error }}</div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const usuario = ref('')
const contrasenia = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/login`, {
      usuario: usuario.value,
      contrasenia: contrasenia.value
    })

    if (res.data && res.data.rol) {
      localStorage.setItem('usuario', JSON.stringify(res.data))

      if (res.data.rol === 'admin') {
        router.push('/admin')
      } else if (res.data.rol === 'empleado') {
        router.push('/empleado')
      } else {
        error.value = 'Rol no reconocido'
      }
    } else {
      error.value = 'Respuesta inválida del backend'
    }
  } catch (e) {
    error.value = 'Credenciales incorrectas'
  }
}
</script>

