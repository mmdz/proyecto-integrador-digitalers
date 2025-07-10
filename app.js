
class Cliente {
  constructor(nombre, apellido, dni, email, password) {
    this.id = Date.now();
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.email = email;
    this.password = password;
    this.cuenta = new Cuenta(this.id);
  }

  verificarPassword(input) {
    return input === this.password;
  }

  cambiarPassword(actual, nueva) {
    if (this.verificarPassword(actual)) {
      this.password = nueva;
      return true;
    }
    return false;
  }
}


class Cuenta {
  constructor(clienteId) {
    this.codigo = 'CTA-' + clienteId;
    this.saldo = 0;
    this.movimientos = [];
  }

  operar(tipo, monto, detalle = '') {
    if (tipo === 'retiro' && monto > this.saldo) return false;
    this.saldo += tipo === 'deposito' ? monto : -monto;
    this.movimientos.push({ tipo, monto, detalle, fecha: new Date().toLocaleString() });
    return true;
  }
}

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let clienteActual = null;

function guardarClientes() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
}

function mostrarLogin() {
  document.getElementById('registro').style.display = 'none';
  document.getElementById('login').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
}

function mostrarRegistro() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('registro').style.display = 'block';
}

function registrar() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const dni = document.getElementById('dni').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const nuevoCliente = new Cliente(nombre, apellido, dni, email, password);
  clientes.push(nuevoCliente);
  guardarClientes();
  alert('¡Registrado correctamente!');
  mostrarLogin();
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const cliente = clientes.find(c => c.email === email && c.password === password);
  if (cliente) {
    clienteActual = cliente;
    mostrarDashboard();
  } else {
    alert('Credenciales inválidas.');
  }
}

function mostrarDashboard() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('registro').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';

  document.getElementById('nombreUsuario').innerText = clienteActual.nombre;
  mostrarSeccion('cuenta');
  actualizarCuenta();
  cargarDestinatarios();
}

function mostrarSeccion(id) {
  ['cuenta', 'operaciones', 'movimientos', 'transferencias'].forEach(seccion => {
    document.getElementById(seccion).style.display = seccion === id ? 'block' : 'none';
  });
  if (id === 'movimientos') cargarMovimientos();
  if (id === 'transferencias') cargarDestinatarios();
}

function actualizarCuenta() {
  document.getElementById('codigoCuenta').innerText = clienteActual.cuenta.codigo;
  document.getElementById('saldoCuenta').innerText = clienteActual.cuenta.saldo.toFixed(2);
}

function realizarOperacion() {
  const tipo = document.getElementById('tipo').value;
  const monto = parseFloat(document.getElementById('monto').value);
  if (!monto || monto <= 0) return alert('Ingrese un monto válido');

  const exito = clienteActual.cuenta.operar(tipo, monto);
  if (!exito) return alert('Saldo insuficiente');

  guardarClientes();
  actualizarCuenta();
  alert('Operación realizada con éxito');
}

function cargarMovimientos() {
  const lista = document.getElementById('listaMovimientos');
  lista.innerHTML = '';
  clienteActual.cuenta.movimientos.forEach(m => {
    const li = document.createElement('li');
    const detalle = m.detalle ? ` (${m.detalle})` : '';
    li.textContent = `${m.fecha}: ${m.tipo.toUpperCase()} de $${m.monto}${detalle}`;
    lista.appendChild(li);
  });
}

function cargarDestinatarios() {
  const select = document.getElementById('destinatario');
  select.innerHTML = '';
  clientes
    .filter(c => c.email !== clienteActual.email)
    .forEach(c => {
      const option = document.createElement('option');
      option.value = c.email;
      option.textContent = `${c.nombre} ${c.apellido} (${c.email})`;
      select.appendChild(option);
    });
}

function realizarTransferencia() {
  const emailDestino = document.getElementById('destinatario').value;
  const monto = parseFloat(document.getElementById('montoTransferencia').value);

  if (!monto || monto <= 0) return alert('Ingrese un monto válido');

  const destinatario = clientes.find(c => c.email === emailDestino);
  if (!destinatario) return alert('Destinatario no encontrado');

  if (clienteActual.cuenta.saldo < monto) return alert('Saldo insuficiente para transferir');

  // Retiro del emisor
  clienteActual.cuenta.operar('retiro', monto, `Transferencia a ${destinatario.nombre}`);

  // Depósito al receptor
  destinatario.cuenta.operar('deposito', monto, `Transferencia de ${clienteActual.nombre}`);

  guardarClientes();
  actualizarCuenta();
  alert('Transferencia realizada con éxito');
}

function logout() {
  clienteActual = null;
  mostrarLogin();
}

mostrarLogin();
