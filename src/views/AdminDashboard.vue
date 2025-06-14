<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f4f4f7 80%, #e9e9ee 100%); background-color: #f4f4f7;">
    <div>
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Admin Parking" style="width: 60px;" />
        <h1>Panel Administrador</h1>
      </div>

      <!-- Gestión de Empleados -->
      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Empleados" style="width: 36px;" />
            <h2>Gestión de Empleados</h2>
          </div>
          <v-btn @click="mostrarAgregarEmpleado = true" color="primary" class="mb-4">Agregar Empleado</v-btn>
          <v-table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="empleado in empleados" :key="empleado.id">
                <td>{{ empleado.usuario }}</td>
                <td>{{ empleado.rol }}</td>
                <td>
                  <v-btn size="small" @click="abrirEditarEmpleado(empleado)">Editar</v-btn>
                  <v-btn size="small" color="error" @click="eliminarEmpleado(empleado)">Eliminar</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- Dialogo agregar empleado -->
          <v-dialog v-model="mostrarAgregarEmpleado" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Agregar Empleado</v-card-title>
              <v-card-text>
                <v-text-field v-model="nuevoEmpleado.usuario" label="Usuario" />
                <v-text-field v-model="nuevoEmpleado.contrasenia" label="Contraseña" type="password" />
                <v-select v-model="nuevoEmpleado.rol" :items="['empleado', 'admin']" label="Rol" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="agregarEmpleado">Guardar</v-btn>
                <v-btn @click="mostrarAgregarEmpleado = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Dialogo editar empleado -->
          <v-dialog v-model="mostrarEditarEmpleado" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Editar Empleado</v-card-title>
              <v-card-text>
                <v-text-field v-model="empleadoEdit.usuario" label="Usuario" />
                <v-select v-model="empleadoEdit.rol" :items="['empleado', 'admin']" label="Rol" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="guardarEdicionEmpleado">Guardar</v-btn>
                <v-btn @click="mostrarEditarEmpleado = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </section>

      <!-- Gestión de Espacios -->
      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Espacios" style="width: 36px;" />
            <h2>Gestión de Espacios</h2>
          </div>
          <v-btn @click="mostrarAgregarEspacio = true" color="primary" class="mb-4">Agregar Espacio</v-btn>
          <v-table>
            <thead>
              <tr>
                <th># Lugar</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="espacio in espacios" :key="espacio.id">
                <td>{{ espacio.numero }}</td>
                <td>{{ espacio.estado }}</td>
                <td>
                  <v-btn size="small" @click="abrirEditarEspacio(espacio)">Editar</v-btn>
                  <v-btn size="small" @click="cambiarEstado(espacio)">Cambiar Estado</v-btn>
                  <v-btn size="small" color="error" @click="eliminarEspacio(espacio)">Eliminar</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- Dialogo agregar espacio -->
          <v-dialog v-model="mostrarAgregarEspacio" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Agregar Espacio</v-card-title>
              <v-card-text>
                <v-text-field v-model="nuevoEspacio.numero" label="Número" type="number" />
                <v-select v-model="nuevoEspacio.estado" :items="['Disponible', 'Ocupado', 'Reservado']" label="Estado" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="agregarEspacio">Guardar</v-btn>
                <v-btn @click="mostrarAgregarEspacio = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Dialogo editar espacio -->
          <v-dialog v-model="mostrarEditarEspacio" persistent>
            <v-card style="background:#f4f4f7;">
              <v-card-title>Editar Espacio</v-card-title>
              <v-card-text>
                <v-text-field v-model="espacioEdit.numero" label="Número" type="number" />
                <v-select v-model="espacioEdit.estado" :items="['Disponible', 'Ocupado', 'Reservado']" label="Estado" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="guardarEdicionEspacio">Guardar</v-btn>
                <v-btn @click="mostrarEditarEspacio = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </section>

      <!-- Botón para ver todos los registros de autos -->
      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/744/744465.png" alt="Autos" style="width: 36px;" />
            <span style="font-weight: bold;">Ver todos los autos</span>
          </div>
          <v-btn @click="mostrarAutos = true" color="primary" class="mt-4">Ver Registros</v-btn>
          <v-dialog v-model="mostrarAutos" persistent max-width="800px">
            <v-card style="background:#f4f4f7;">
              <v-card-title>Todos los registros de autos</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Color</th>
                      <th>Espacio</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="auto in autos" :key="auto.id">
                      <td>{{ auto.placa }}</td>
                      <td>{{ auto.marca }}</td>
                      <td>{{ auto.modelo }}</td>
                      <td>{{ auto.color }}</td>
                      <td>{{ auto.espacio_id }}</td>
                      <td>{{ auto.entrada }}</td>
                      <td>{{ auto.salida }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="mostrarAutos = false">Cerrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </section>

      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Reportes" style="width: 36px;" />
            <h2>Reportes y Pagos</h2>
          </div>
          <v-btn @click="consultarReporte" color="primary" class="mb-4">Consultar Reporte</v-btn>
          <v-table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entradas</th>
                <th>Salidas</th>
                <th>Exportar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reporte in reportes" :key="reporte.fecha">
                <td>{{ reporte.fecha }}</td>
                <td>{{ reporte.entradas }}</td>
                <td>{{ reporte.salidas }}</td>
                <td>
                  <v-btn size="small" @click="exportar(reporte, 'pdf')">PDF</v-btn>
                  <v-btn size="small" @click="exportar(reporte, 'excel')">Excel</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <h3 class="mt-4">Historial de Pagos</h3>
          <v-table>
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagos" :key="pago.id">
                <td>{{ pago.placa }}</td>
                <td>{{ pago.monto }}</td>
                <td>{{ pago.fecha }}</td>
                <td>{{ pago.metodo }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </section>

      <section>
        <v-card class="pa-4 mb-6" elevation="4" style="background:#f4f4f7;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Tarifa" style="width: 36px;" />
            <h2>Configuración de Tarifas</h2>
          </div>
          <v-text-field
            label="Tarifa por hora"
            v-model="tarifa"
            type="number"
            min="0"
            step="any"
            class="mb-4"
          />
          <v-btn @click="guardarTarifa" color="primary">Guardar Tarifa</v-btn>
        </v-card>
      </section>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

// Empleados
const empleados = ref([])
const mostrarAgregarEmpleado = ref(false)
const mostrarEditarEmpleado = ref(false)
const nuevoEmpleado = ref({ usuario: '', contrasenia: '', rol: '' })
const empleadoEdit = ref({ id: null, usuario: '', contrasenia: '', rol: '' })

async function cargarEmpleados() {
  const res = await axios.get(`${API_URL}/usuarios`)
  empleados.value = res.data
}

async function agregarEmpleado() {
  try {
    await axios.post(`${API_URL}/usuarios`, {
      usuario: nuevoEmpleado.value.usuario,
      contrasenia: nuevoEmpleado.value.contrasenia,
      rol: nuevoEmpleado.value.rol
    })
    mostrarAgregarEmpleado.value = false
    nuevoEmpleado.value = { usuario: '', contrasenia: '', rol: '' }
    cargarEmpleados()
  } catch (e) {
    alert('Error al registrar empleado')
  }
}

function abrirEditarEmpleado(empleado) {
  empleadoEdit.value = { ...empleado }
  mostrarEditarEmpleado.value = true
}

async function guardarEdicionEmpleado() {
  try {
    await axios.put(`${API_URL}/usuarios/${empleadoEdit.value.id}`, {
      usuario: empleadoEdit.value.usuario,
      contrasenia: empleadoEdit.value.contrasenia,
      rol: empleadoEdit.value.rol
    })
    mostrarEditarEmpleado.value = false
    cargarEmpleados()
  } catch (e) {
    alert('Error al editar empleado')
  }
}

async function eliminarEmpleado(empleado) {
  try {
    await axios.delete(`${API_URL}/usuarios/${empleado.id}`)
    cargarEmpleados()
  } catch (e) {
    alert('Error al eliminar empleado')
  }
}

// Espacios
const espacios = ref([])
const mostrarAgregarEspacio = ref(false)
const mostrarEditarEspacio = ref(false)
const nuevoEspacio = ref({ numero: '', estado: 'Disponible' })
const espacioEdit = ref({ id: null, numero: '', estado: '' })

async function cargarEspacios() {
  const res = await axios.get(`${API_URL}/espacios`)
  espacios.value = res.data
}

async function agregarEspacio() {
  try {
    await axios.post(`${API_URL}/espacios`, {
      numero: nuevoEspacio.value.numero,
      estado: nuevoEspacio.value.estado
    })
    mostrarAgregarEspacio.value = false
    nuevoEspacio.value = { numero: '', estado: 'Disponible' }
    cargarEspacios()
  } catch (e) {
    alert('Error al agregar espacio')
  }
}

function abrirEditarEspacio(espacio) {
  espacioEdit.value = { ...espacio }
  mostrarEditarEspacio.value = true
}

async function guardarEdicionEspacio() {
  try {
    await axios.put(`${API_URL}/espacios/${espacioEdit.value.id}`, {
      numero: espacioEdit.value.numero,
      estado: espacioEdit.value.estado
    })
    mostrarEditarEspacio.value = false
    cargarEspacios()
  } catch (e) {
    alert('Error al editar espacio')
  }
}

async function cambiarEstado(espacio) {
  try {
    const nuevoEstado = espacio.estado === 'Disponible' ? 'Ocupado' : 'Disponible'
    await axios.patch(`${API_URL}/espacios/${espacio.id}`, { estado: nuevoEstado })
    cargarEspacios()
  } catch (e) {
    alert('Error al cambiar estado')
  }
}

async function eliminarEspacio(espacio) {
  try {
    await axios.delete(`${API_URL}/espacios/${espacio.id}`)
    cargarEspacios()
  } catch (e) {
    alert('Error al eliminar espacio')
  }
}

// Reportes y pagos
const reportes = ref([])
const pagos = ref([])
// Inicializar tarifa como string para evitar problemas de binding con v-text-field
const tarifa = ref('')

async function consultarReporte() {
  try {
    const fecha = new Date().toISOString().slice(0, 10)
    const res = await axios.get(`${API_URL}/reportes/semana?fecha=${fecha}`)
    reportes.value = res.data
  } catch (e) {
    alert('Error al consultar reporte')
  }
}

async function exportar(reporte, formato) {
  try {
    const url = `${API_URL}/reportes/export?fecha=${reporte.fecha}&formato=${formato}`
    window.open(url, '_blank')
  } catch (e) {
    alert('Error al exportar reporte')
  }
}

async function cargarPagos() {
  const res = await axios.get(`${API_URL}/pagos`)
  pagos.value = res.data
}

// Corregir carga de tarifa para asegurar que sea string (para v-text-field)
async function cargarTarifa() {
  try {
    const res = await axios.get(`${API_URL}/configuracion/tarifas`)
    tarifa.value = res.data.tarifa !== undefined ? String(res.data.tarifa) : ''
  } catch (e) {
    tarifa.value = ''
  }
}

// Corregir guardado de tarifa para asegurar que se envía como número
async function guardarTarifa() {
  try {
    const valorTarifa = Number(tarifa.value)
    if (isNaN(valorTarifa) || valorTarifa < 0) {
      alert('La tarifa debe ser un número válido y positivo')
      return
    }
    await axios.put(`${API_URL}/configuracion/tarifas`, { tarifa: valorTarifa }, {
      headers: { 'Content-Type': 'application/json' }
    })
    alert('Tarifa actualizada')
    cargarTarifa()
  } catch (e) {
    alert('Error al guardar tarifa: ' + JSON.stringify(e.response?.data || e.message))
  }
}

// Autos
const mostrarAutos = ref(false)
const autos = ref([])

async function cargarAutos() {
  const res = await axios.get(`${API_URL}/vehiculos/historial`)
  autos.value = res.data
}

watch(mostrarAutos, (val) => {
  if (val) cargarAutos()
})

onMounted(() => {
  cargarEmpleados()
  cargarEspacios()
  cargarPagos()
  cargarTarifa()
})
</script>
