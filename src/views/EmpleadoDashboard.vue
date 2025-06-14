<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f4f4f7 80%, #e9e9ee 100%); background-color: #f4f4f7;">
    <div>
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Empleado Parking" style="width: 60px;" />
        <h1>Panel Empleado</h1>
      </div>

      <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Espacios" style="width: 36px;" />
          <h2>Espacios de Estacionamiento</h2>
        </div>
        <v-btn @click="cargarEspacios" color="primary" size="small" style="margin-bottom: 8px;">Refrescar Espacios</v-btn>
        <v-table>
          <thead>
            <tr>
              <th># Lugar</th>
              <th>Estado</th>
              <th>Registrar Vehículo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="espacio in espacios" :key="espacio.id">
              <td>{{ espacio.numero }}</td>
              <td>{{ espacio.estado }}</td>
              <td>
                <v-btn size="small" @click="abrirRegistroVehiculo(espacio)">Registrar</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Diálogo para registro de vehículo -->
      <v-dialog v-model="mostrarRegistroVehiculo" persistent>
        <v-card style="background:#f4f4f7;">
          <v-card-title>Registrar Vehículo</v-card-title>
          <v-card-text>
            <v-text-field v-model="vehiculo.placa" label="Placa" />
            <v-text-field v-model="vehiculo.marca" label="Marca" />
            <v-text-field v-model="vehiculo.modelo" label="Modelo" />
            <v-text-field v-model="vehiculo.color" label="Color" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="registrarVehiculo">Guardar</v-btn>
            <v-btn @click="cerrarRegistroVehiculo">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Gestión de pagos -->
      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Pagos" style="width: 36px;" />
            <h2>Gestión de Pagos</h2>
          </div>
          <v-btn @click="mostrarPago = true">Registrar Pago</v-btn>
          <v-dialog v-model="mostrarPago" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Registrar Pago</v-card-title>
              <v-card-text>
                <v-text-field v-model="pago.placa" label="Placa" />
                <v-text-field v-model="pago.monto" label="Monto" type="number" />
                <v-select v-model="pago.metodo" :items="['Efectivo', 'Tarjeta']" label="Método" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="registrarPago">Guardar</v-btn>
                <v-btn @click="mostrarPago = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Monto</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pagos" :key="p.id">
                <td>{{ p.placa }}</td>
                <td>{{ p.monto }}</td>
                <td>{{ p.metodo }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </section>

      <!-- Reservaciones -->
      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Reservaciones" style="width: 36px;" />
            <h2>Reservaciones</h2>
          </div>
          <v-btn @click="mostrarReservacion = true">Nueva Reservación</v-btn>
          <v-dialog v-model="mostrarReservacion" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Nueva Reservación</v-card-title>
              <v-card-text>
                <v-text-field v-model="reservacion.placa" label="Placa" />
                <v-text-field v-model="reservacion.fecha" label="Fecha" type="date" />
                <v-text-field v-model="reservacion.hora" label="Hora" type="time" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="registrarReservacion">Guardar</v-btn>
                <v-btn @click="mostrarReservacion = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reservaciones" :key="r.id">
                <td>{{ r.placa }}</td>
                <td>{{ r.fecha }}</td>
                <td>{{ r.hora }}</td>
                <td>
                  <v-btn size="small" color="error" @click="cancelarReservacion(r)">Cancelar</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const tarifa = ref(0)
const placasOcupadas = ref([])

const espacios = ref([])

const mostrarRegistroVehiculo = ref(false)
const espacioSeleccionado = ref(null)
const vehiculo = ref({ placa: '', marca: '', modelo: '', color: '' })

function abrirRegistroVehiculo(espacio) {
  espacioSeleccionado.value = espacio
  mostrarRegistroVehiculo.value = true
}

function cerrarRegistroVehiculo() {
  mostrarRegistroVehiculo.value = false
  vehiculo.value = { placa: '', marca: '', modelo: '', color: '' }
}

async function registrarVehiculo() {
  if (espacioSeleccionado.value) {
    try {
      await axios.post(`${API_URL}/vehiculos`, {
        placa: vehiculo.value.placa,
        marca: vehiculo.value.marca,
        modelo: vehiculo.value.modelo,
        color: vehiculo.value.color,
        espacioId: espacioSeleccionado.value.id
      })
      await cargarEspacios()
      await cargarPlacasOcupadas()
      cerrarRegistroVehiculo()
    } catch (e) {
      alert('Error al registrar vehículo')
    }
  }
}

// Pagos
const mostrarPago = ref(false)
const pago = ref({ placa: '', monto: '', metodo: '' })
const pagos = ref([])

async function registrarPago() {
  try {
    // Asegura que el método sea en minúsculas y válido
    const metodo = pago.value.metodo.toLowerCase()
    await axios.post(`${API_URL}/pagos`, {
      placa: pago.value.placa,
      metodo
    })
    await cargarPagos()
    mostrarPago.value = false
    pago.value = { placa: '', monto: '', metodo: '' }
  } catch (e) {
    alert('Error al registrar pago: ' + (e.response?.data?.message || e.message))
  }
}

async function cargarPagos() {
  const res = await axios.get(`${API_URL}/pagos`)
  pagos.value = res.data
}

// Reservaciones
const mostrarReservacion = ref(false)
const reservacion = ref({ placa: '', fecha: '', hora: '' })
const reservaciones = ref([])

async function registrarReservacion() {
  try {
    await axios.post(`${API_URL}/reservaciones`, {
      placa: reservacion.value.placa,
      fecha: reservacion.value.fecha,
      hora: reservacion.value.hora,
      espacioId: espacios.value.length > 0 ? espacios.value[0].id : null // O selecciona el espacio de alguna manera
    })
    await cargarReservaciones()
    mostrarReservacion.value = false
    reservacion.value = { placa: '', fecha: '', hora: '' }
  } catch (e) {
    alert('Error al registrar reservación')
  }
}

async function cargarReservaciones() {
  const res = await axios.get(`${API_URL}/reservaciones`)
  reservaciones.value = res.data
}

async function cancelarReservacion(r) {
  try {
    await axios.delete(`${API_URL}/reservaciones/${r.id}`)
    await cargarReservaciones()
  } catch (e) {
    alert('Error al cancelar reservación')
  }
}

// Cargar tarifa y placas ocupadas al montar el componente
onMounted(async () => {
  await cargarTarifa()
  await cargarPlacasOcupadas()
  await cargarEspacios()
  await cargarPagos()
  await cargarReservaciones()
})

// Cargar tarifa desde la API
async function cargarTarifa() {
  const res = await axios.get(`${API_URL}/configuracion/tarifas`)
  tarifa.value = res.data.tarifa
}

// Cargar placas ocupadas desde la API
async function cargarPlacasOcupadas() {
  const res = await axios.get(`${API_URL}/vehiculos/historial`)
  placasOcupadas.value = res.data.filter(v => !v.salida).map(v => ({
    placa: v.placa,
    entrada: v.entrada,
    espacio_id: v.espacio_id
  }))
}

// Cargar espacios desde la API
async function cargarEspacios() {
  try {
    const res = await axios.get(`${API_URL}/espacios`)
    espacios.value = res.data
  } catch (e) {
    alert('Error al cargar espacios')
    espacios.value = []
  }
}

// Cálculo automático del monto al seleccionar placa
watch(() => pago.value.placa, async (nuevaPlaca) => {
  if (!nuevaPlaca) {
    pago.value.monto = ''
    return
  }
  const vehiculo = placasOcupadas.value.find(v => v.placa === nuevaPlaca)
  if (vehiculo) {
    const entrada = new Date(vehiculo.entrada)
    const ahora = new Date()
    let horas = Math.ceil((ahora - entrada) / (1000 * 60 * 60)) // Redondea hacia arriba
    if (horas < 1) horas = 1 // Cobro mínimo: 1 hora
    pago.value.monto = (horas * tarifa.value).toFixed(2)
  }
})
</script>
