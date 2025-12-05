<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card wide">
      <h3>Gestión de Usuarios</h3>
      
      <div v-if="loading" class="loading">Cargando usuarios...</div>
      
      <div v-else class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.username }}</td>
              <td>{{ u.rol?.nombre || 'Sin Rol' }}</td>
              <td>
                <span :class="u.activo ? 'status-active' : 'status-inactive'">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn-icon">✏️</button> 
                </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const usuarios = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/usuarios/');
    // Si usas paginación en Django, los resultados vienen en 'results'
    usuarios.value = res.results || res; 
  } catch (error) {
    console.error("Error cargando usuarios", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.modal-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-card.wide { width: 700px; max-width: 95%; }

.table-container { max-height: 400px; overflow-y: auto; margin: 20px 0; }
.user-table { width: 100%; border-collapse: collapse; }
.user-table th { text-align: left; padding: 10px; background: #f9f9f9; color: #666; }
.user-table td { padding: 10px; border-bottom: 1px solid #eee; }
.status-active { color: #4CAF50; font-weight: bold; font-size: 0.9rem; }
.status-inactive { color: #F44336; font-weight: bold; font-size: 0.9rem; }
.btn-icon { border: none; background: none; cursor: pointer; font-size: 1.2rem; }
.modal-footer { display: flex; justify-content: flex-end; }
.btn-cancel { background: #ccc; color: #333; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
</style>