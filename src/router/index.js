import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Login', component: () => import('../views/LoginView.vue') },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/empleado',
    name: 'EmpleadoDashboard',
    component: () => import('../views/EmpleadoDashboard.vue'),
    meta: { requiresAuth: true, role: 'empleado' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Simulación de sesión (reemplaza por tu store real)
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario'))
  } catch {
    return null
  }
}

router.beforeEach((to, from, next) => {
  const user = getUser()
  const isLoggedIn = !!user

  // Redirigir si no está autenticado y la ruta lo requiere
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login' })
  }

  // Si está en Login y ya está logueado, redirigir al dashboard
  if (to.name === 'Login' && isLoggedIn) {
    if (user.role === 'admin') return next({ name: 'AdminDashboard' })
    if (user.role === 'empleado') return next({ name: 'EmpleadoDashboard' })
  }

  // Si intenta acceder a un dashboard que no es de su rol
  if (to.meta.role && user && to.meta.role !== user.role) {
    if (user.role === 'admin') return next({ name: 'AdminDashboard' })
    if (user.role === 'empleado') return next({ name: 'EmpleadoDashboard' })
  }

  return next()
})

export default router
