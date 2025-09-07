  const apiURL = 'http://localhost:3333/pacientes';
  const tabla = document.getElementById('tabla-pacientes');
  const modal = document.getElementById('modal');
  const tituloModal = document.getElementById('modal-titulo');

  let modo = 'crear';
  let pacienteEditando = null;

  async function cargarPacientes() {
    tabla.innerHTML = '';
    const res = await fetch(apiURL);
    const pacientes = await res.json();

    pacientes.forEach(paciente => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${paciente.idpaciente}</td>
        <td>${paciente.documento}</td>
        <td>${paciente.nombres}</td>
        <td>${paciente.telefono}</td>
        <td>${paciente.correo}</td>
        <td>${paciente.direccion}</td>
        <td>
          <button class="btn-editar" onclick="abrirModalEditar(${paciente.idpaciente})">✏️</button>
          <button class="btn-eliminar" onclick="eliminarPaciente(${paciente.idpaciente})">🗑️</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }
  
  function abrirModalCrear() {
    modo = 'crear';
    pacienteEditando = null;
    tituloModal.textContent = 'Crear Paciente';
    limpiarFormulario();
    modal.style.display = 'flex';
  }

  async function abrirModalEditar(id) {
    modo = 'editar';
    const res = await fetch(`${apiURL}/${id}`);
    const paciente = await res.json();
    pacienteEditando = id;

    tituloModal.textContent = 'Editar paciente';
    document.getElementById('documento').value = paciente.documento;
    document.getElementById('nombre').value = paciente.nombres;
    document.getElementById('telefono').value = paciente.telefono;
    document.getElementById('correo').value = paciente.correo;
    document.getElementById('direccion').value = paciente.direccion;

    modal.style.display = 'flex';
  }

  function cerrarModal() {
    modal.style.display = 'none';
  }

  function limpiarFormulario() {
    document.getElementById('documento').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('direccion').value = '';
  }

async function guardarPaciente() {
  const documento = document.getElementById('documento').value;
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const direccion = document.getElementById('direccion').value;

  const datos = {
    t1: documento,
    t2: nombre,
    t3: telefono,
    t4: correo,
    t5: direccion
  };

  if (modo === 'crear') {
    await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } else if (modo === 'editar') {
    await fetch(`${apiURL}/${pacienteEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)  // <== USAMOS MISMA ESTRUCTURA
    });
  }

  cerrarModal();
  cargarPacientes();
}

  async function eliminarPaciente(id) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este paciente?');
    if (!confirmar) return;

    await fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    });

    cargarPacientes();
  }

  // Inicializa
  cargarPacientes();