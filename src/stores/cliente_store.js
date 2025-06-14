import { defineStore } from 'pinia'
import { ClienteService } from '@/services'
import { OK } from '@/utils/constantes'

export const useClienteStore = defineStore('cliente_store', {
  state: () => ({}),
  getters: {},
  actions: {
    crearCliente(payload) {
      console.log('crearCliente')
      return ClienteService.instance.registrar(payload)
    },
    obtenerCliente() {
      return ClienteService.instance
        .obtener()
        .then((resp) => {
          this.usuarios = resp
          return Promise.resolve(OK)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },
  },
  persist: true,
})
