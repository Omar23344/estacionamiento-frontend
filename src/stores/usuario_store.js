// archivo para hacer las peticiones
import { crearSesion } from '@/seguridad/session'
import { OK } from '@/utils/constantes'
import { defineStore } from 'pinia'
import { UsuariosService } from '../services'

export const useUsuarioStore = defineStore('usuario_store', {
  state: () => ({
    usuarios: [],
    logueado: false,
    user: null,
    isLoggedIn: false,
    empleados: [{ usuario: 'empleado1', contrasenia: 'empleado1' }],
  }),

  getters: {
    esUsuarioLogueado: (state) => state.logueado === true,
  },

  actions: {
    login1(payload) {
      return UsuariosService.instance
        .login(payload)
        .then((data) => {
          crearSesion(data.token, { id: data.id })
          this.logueado = true
          return Promise.resolve(data)
        })
        .catch((err) => {
          this.logueado = false
          return Promise.reject(err)
        })
    },

    crearUsuario(payload) {
      return UsuariosService.instance.registrar(payload)
    },

    obtenerUsuarios() {
      return UsuariosService.instance
        .obtener()
        .then((resp) => {
          this.usuarios = resp
          return Promise.resolve(OK)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },

    eliminarUsuario(id) {
      return UsuariosService.instance
        .eliminar(id)
        .then((resp) => {
          return Promise.resolve(resp)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },

    activarUsuario(id, activo) {
      return UsuariosService.instance
        .activar(id, activo)
        .then((resp) => {
          return Promise.resolve(resp)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },

    sucursalesUsuario(id, payload = []) {
      return UsuariosService.instance
        .sucursales(id, payload)
        .then((resp) => {
          return Promise.resolve(resp)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },

    // Nuevas acciones para la gestión de empleados
    login({ usuario, contrasenia }) {
      // Simulación: admin/admin es admin, cualquier otro es empleado
      if (usuario === 'admin' && contrasenia === 'admin') {
        this.user = { usuario, role: 'admin' }
        this.isLoggedIn = true
        return Promise.resolve({ mensaje: 'Bienvenido admin', role: 'admin' })
      } else if (usuario && contrasenia) {
        // Buscar en empleados
        const empleado = this.empleados.find(
          (e) => e.usuario === usuario && e.contrasenia === contrasenia,
        )
        if (empleado) {
          this.user = { usuario, role: 'empleado' }
          this.isLoggedIn = true
          return Promise.resolve({ mensaje: 'Bienvenido empleado', role: 'empleado' })
        }
      }
      return Promise.reject({ mensaje: 'Credenciales inválidas' })
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
    },
    addEmpleado(empleado) {
      this.empleados.push(empleado)
    },
    editEmpleado(index, empleado) {
      this.empleados[index] = empleado
    },
    removeEmpleado(index) {
      this.empleados.splice(index, 1)
    },
  },

  persist: true,
})
