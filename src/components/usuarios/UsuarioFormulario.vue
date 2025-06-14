<template>
  <v-container class="mt-5" max-width="500">
    <v-card>
      <v-card-title>Registro de Vehículo</v-card-title>
      <v-card-text>
        <v-form v-model="frmUsuario">
          <v-text-field
            v-model="usuario.placa"
            label="Placa"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="usuario.dueno"
            label="Dueño"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-select
            v-model="usuario.lugar"
            label="Lugar"
            :items="lugares"
            :rules="[rules.required]"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="limpiar">Limpiar</v-btn>
        <v-btn color="primary" @click="guardarUsuario">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { useClienteStore } from '@/stores/cliente_store'
import { ref } from 'vue'

const clienteStore = useClienteStore()

const frmUsuario = ref(null)
const usuario = ref({
  placa: '',
  dueno: '', // <-- corregido para coincidir con la base de datos
  lugar: '',
})
const rules = {
  required: (value) => !!value || 'Este campo es obligatorio.',
}
const lugares = ['A', 'B', 'C', 'D', 'E', 'F']

function limpiar() {
  usuario.value = { placa: '', dueno: '', lugar: '' }
}

function guardarUsuario() {
  clienteStore
    .crearCliente(usuario.value)
    .then(() => {
      limpiar()
      alert('Registro guardado correctamente')
    })
    .catch((err) => {
      alert('Error al guardar: ' + err)
    })
}
</script>
