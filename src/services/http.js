import axios from 'axios'
import { NO_DATA } from '@/utils/constantes' // Quitado OK

import { obtenerSesion, verificarSesion } from '@/seguridad/session'
import ENV from '@/services/config/env'

export default class Http {
  constructor() {
    this.apiUrl = ENV.API
  }

  
  applySecurity() {
    if (verificarSesion()) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + obtenerSesion()
    }
  }

  get(url, params = null, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (params) {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`, { params: params }))
    } else {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`))
    }
  }

  post(url, payload, secure = false, config = {}) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return Promise.reject('Payload requerido.')
    }
    return this.handlePromise(axios.post(`${this.apiUrl}${url}`, payload, config))
  }

  put(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return Promise.reject('Payload requerido.')
    }
    return this.handlePromise(axios.put(`${this.apiUrl}${url}`, payload))
  }

  patch(url, payload = null, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return this.handlePromise(axios.patch(`${this.apiUrl}${url}`))
    }
    return this.handlePromise(axios.patch(`${this.apiUrl}${url}`, payload))
  }

  delete(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    let urls = `${this.apiUrl}${url}/${payload}`
    return this.handlePromise(axios.delete(urls))
  }

  postWithFiles(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    return this.handlePromise(
      axios.post(`${this.apiUrl}${url}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  }
}
