<template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const espacioSeleccionado = ref(null)
const vehiculo = ref({
  placa: '',
  marca: '',
  modelo: '',
  color: ''
})
const espacios = ref([])
const API_URL = 'https://estacionamiento-backend.onrender.com'

// ...existing methods...

async function registrarVehiculo() {
  try {
    const espacioId = espacioSeleccionado.value.id
    const datosVehiculo = {
      placa: vehiculo.value.placa,
      marca: vehiculo.value.marca,
      modelo: vehiculo.value.modelo,
      color: vehiculo.value.color,
      espacioId: espacioId
    }

    await axios.post(`${API_URL}/vehiculos`, datosVehiculo)

    // Marcar el lugar como ocupado localmente
    const espacio = espacios.value.find(e => e.id === espacioId)
    if (espacio) espacio.estado = 'Ocupado'

    // Recargar las placas ocupadas
    await cargarPlacasOcupadas()

    cerrarRegistroVehiculo()
  } catch (error) {
    console.error('Error al registrar vehículo:', error)
  }
}

async function registrarPago() {
  try {
    const placa = pago.value.placa

    // Registrar el pago (el backend calcula el monto)
    await axios.post(`${API_URL}/pagos`, {
      placa: pago.value.placa,
      metodo: pago.value.metodo
    })

    // Buscar el vehículo en placasOcupadas para obtener el espacio_id
    const vehiculo = placasOcupadas.value.find(v => v.placa === placa)

    if (vehiculo) {
      // Marcar como salida en el backend (PATCH /vehiculos/salida/:id)
      await axios.patch(`${API_URL}/vehiculos/salida/${vehiculo.id}`)

      // Liberar el espacio localmente
      const espacio = espacios.value.find(e => e.id === vehiculo.espacio_id)
      if (espacio) espacio.estado = 'Disponible'

      // Actualizar lista de vehículos ocupados
      await cargarPlacasOcupadas()
    }

    pagos.value.push({ ...pago.value, id: Date.now() })
    mostrarPago.value = false
    pago.value = { placa: '', monto: '', metodo: '' }
  } catch (error) {
    console.error('Error al registrar pago:', error)
  }
}

// ...existing code...
</script>

<style scoped>
/* ...existing styles... */
</style>

