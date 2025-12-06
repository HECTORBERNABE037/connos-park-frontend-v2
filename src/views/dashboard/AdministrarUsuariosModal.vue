<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    
    <div class="modal-card wide">
      <div class="modal-header">
        <h3>Administrar Personal</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <table class="user-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td class="username-cell">@{{ u.username }}</td>
              <td>{{ u.first_name || '---' }}</td>
              <td>
                <span :class="['role-badge', getRolClass(u.rol?.nombre)]">
                  {{ u.rol?.nombre || 'Sin Rol' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon edit" @click="editar(u)" title="Editar">✏️</button>
                <button class="btn-icon delete" @click="eliminar(u)" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="editUser" class="edit-overlay">
        <div class="edit-card">
          <h4>Editar a {{ editUser.username }}</h4>
          
          <div class="form-group">
            <label>Nombre Completo:</label>
            <input v-model="editForm.first_name" class="input-field" placeholder="Nombre" />
          </div>
          
          <div class="form-group">
            <label>Rol:</label>
            <select v-model="editForm.rol" class="input-field">
              <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.nombre }}
              </option>
            </select>
          </div>

          <div class="edit-actions">
            <button class="btn-cancel" @click="editUser = null">Cancelar</button>
            <button class="btn-save" @click="guardarCambios">Guardar Cambios</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import usuarioService from '@/services/usuarioService';

const emit = defineEmits(['close']); // Definir emits para cerrar

const usuarios = ref([]);
const roles = ref([]);
const editUser = ref(null);
const editForm = reactive({ first_name: '', rol: '' });

// Cargar datos
const cargarDatos = async () => {
  try {
    const [resUsers, resRoles] = await Promise.all([
      usuarioService.getUsuarios(),
      usuarioService.getRoles()
    ]);
    usuarios.value = resUsers.results || resUsers;
    roles.value = resRoles.results || resRoles;
  } catch (error) {
    console.error(error);
  }
};

onMounted(cargarDatos);

// Helpers visuales
const getRolClass = (nombreRol) => {
  if (nombreRol === 'Administrador') return 'role-admin';
  if (nombreRol === 'Contador') return 'role-contador';
  return 'role-encargado';
};

// Acciones
const eliminar = async (usuario) => {
  if (confirm(`¿Eliminar a ${usuario.username}? Esta acción no se puede deshacer.`)) {
    try {
      await usuarioService.deleteUsuario(usuario.id);
      await cargarDatos();
    } catch (e) { alert("Error al eliminar"); }
  }
};

const editar = (usuario) => {
  editUser.value = usuario;
  editForm.first_name = usuario.first_name;
  // Ojo: usuario.rol es un objeto, pero el select espera un ID.
  // Usamos el operador opcional ?.id por si acaso viene nulo.
  editForm.rol = usuario.rol?.id || ''; 
};

const guardarCambios = async () => {
  try {
    // Enviamos 'rol_id' o 'rol' dependiendo de como lo espere tu backend.
    // Tu serializer usa 'rol_id' para escritura.
    await usuarioService.updateUsuario(editUser.value.id, {
      first_name: editForm.first_name,
      rol_id: editForm.rol 
    });
    alert("Usuario actualizado");
    editUser.value = null;
    await cargarDatos();
  } catch (e) {
    console.error(e);
    alert("Error al actualizar");
  }
};
</script>

<style scoped>
/* 1. Backdrop: Fondo oscuro fijo que cubre toda la pantalla */
.modal-backdrop { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  background-color: rgba(0,0,0,0.6); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 3000; /* Z-index alto para estar encima de todo */
  backdrop-filter: blur(2px); /* Efecto borroso elegante */
}

/* 2. Modal Card: La caja blanca centrada */
.modal-card { 
  background: white; 
  padding: 25px; 
  border-radius: 16px; 
  box-shadow: 0 15px 50px rgba(0,0,0,0.3); 
  display: flex; 
  flex-direction: column;
  max-height: 90vh; /* Evita que sea más alto que la pantalla */
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

/* Animación de entrada */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-card.wide { 
  width: 800px; 
  max-width: 95%; 
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.modal-header h3 { margin: 0; color: #333; }

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
}
.close-btn:hover { color: #333; }

/* Tabla */
.modal-body { overflow-y: auto; }

.user-table { width: 100%; border-collapse: collapse; }
.user-table th { text-align: left; padding: 12px; color: #666; border-bottom: 2px solid #f0f0f0; font-size: 0.9rem; }
.user-table td { padding: 12px; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }

.username-cell { font-weight: bold; color: #333; }

/* Badges de Roles */
.role-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.role-admin { background-color: #F3E5F5; color: #7B1FA2; } /* Morado */
.role-contador { background-color: #E3F2FD; color: #1976D2; } /* Azul */
.role-encargado { background-color: #E8F5E9; color: #388E3C; } /* Verde */

/* Botones de acción */
.btn-icon { border: none; background: none; cursor: pointer; font-size: 1.1rem; margin-right: 8px; transition: transform 0.2s; }
.btn-icon:hover { transform: scale(1.2); }

/* --- EDIT OVERLAY (Mini modal dentro del modal) --- */
.edit-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255,255,255,0.95);
  display: flex; justify-content: center; align-items: center;
  border-radius: 16px;
  z-index: 10;
}

.edit-card {
  width: 350px;
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 12px;
}

.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: bold; color: #555; margin-bottom: 5px; }
.input-field { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; }

.edit-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-save { background: #7C5CFF; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-cancel { background: #eee; color: #333; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>