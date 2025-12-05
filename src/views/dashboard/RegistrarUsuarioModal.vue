<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h3>Registrar Nuevo Usuario</h3>
      
      <form @submit.prevent="handleSubmit" class="form-grid">
        <div class="form-group">
          <label>Nombre de usuario</label>
          <input v-model="form.username" type="text" required class="input-field" />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required class="input-field" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" required class="input-field" />
        </div>

        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input v-model="confirmPassword" type="password" required class="input-field" />
        </div>
        
        <div class="form-group full-width">
          <label>Rol</label>
          <select v-model="form.rol" class="input-field" required>
            <option :value="1">Administrador</option>
            <option :value="2">Contador</option>
            <option :value="3">Encargado</option>
          </select>
        </div>

        <p v-if="error" class="error-text full-width">{{ error }}</p>

        <div class="modal-footer full-width">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Crear Usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import api from '@/services/api';

const emit = defineEmits(['close']);
const loading = ref(false);
const error = ref('');
const confirmPassword = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
  rol: 3 // Default Encargado
});

const handleSubmit = async () => {
  if (form.password !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden";
    return;
  }
  
  loading.value = true;
  error.value = '';

  try {
    // Usamos el endpoint de tu API en Django
    // Nota: Tu serializer de escritura espera 'rol_id' o 'rol' según como lo configuraste.
    // Como en tu UsuarioSerializer tienes: rol_id = PrimaryKeyRelatedField(source='rol'...), 
    // mandamos 'rol_id' para asegurar.
    await api.post('/usuarios/', {
      ...form,
      rol_id: form.rol 
    });
    alert('Usuario creado con éxito');
    emit('close');
  } catch (err) {
    console.error(err);
    // Intentamos mostrar el error que manda Django
    error.value = err.response?.data?.detail || 'Error al crear usuario. Verifica los datos.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.modal-card { background: white; padding: 30px; border-radius: 15px; width: 500px; max-width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
.full-width { grid-column: span 2; }
.input-field { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
.btn-save { background: #7C5CFF; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
.btn-cancel { background: #ccc; color: #333; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
.error-text { color: red; font-size: 0.9rem; text-align: center; }
</style>