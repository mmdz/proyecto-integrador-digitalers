// script.js

// Estructura para clientes y cuentas (almacenadas en memoria)
let clientes = [];
let cuentas = [];

// Registrar Cliente
document.getElementById('formCliente').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni = document.getElementById('dni').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    // Crear un nuevo cliente
    const cliente = {
        id: clientes.length + 1,
        nombre,
        apellido,
        dni,
        correo,
        password,
    };

    // Guardar cliente
    clientes.push(cliente);
    alert('Cliente registrado exitosamente.');
    document.getElementById('formCliente').reset();
});

// Crear Cuenta
document.getElementById('formCuenta').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener datos del formulario
    const codigoCuenta = document.getElementById('codigoCuenta').value;
    const saldoInicial = parseFloat(document.getElementById('saldoInicial').value);

    // Crear una nueva cuenta
    const cuenta = {
        codigo: codigoCuenta,
        saldo: saldoInicial,
    };

    // Guardar cuenta
    cuentas.push(cuenta);
    alert('Cuenta creada exitosamente.');
    document.getElementById('formCuenta').reset();
});

// Consultar saldo
document.getElementById('consultarSaldo').addEventListener('click', function() {
    const saldo = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0); // Suma de todos los saldos
    document.getElementById('saldoActual').textContent = `Saldo Total: $${saldo.toFixed(2)}`;
});

// Realizar Depósito
document.getElementById('depositar').addEventListener('click', function() {
    const monto = parseFloat(document.getElementById('monto').value);
    if (monto > 0) {
        cuentas[0].saldo += monto; // Se agrega a la primera cuenta
        alert(`Depósito de $${monto} realizado exitosamente.`);
    } else {
        alert('Por favor, ingresa un monto válido.');
    }
});

// Realizar Retiro
document.getElementById('retirar').addEventListener('click', function() {
    const monto = parseFloat(document.getElementById('monto').value);
    if (monto > 0 && cuentas[0].saldo >= monto) {
        cuentas[0].saldo -= monto; // Se resta de la primera cuenta
        alert(`Retiro de $${monto} realizado exitosamente.`);
    } else if (monto > 0) {
        alert('Saldo insuficiente.');
    } else {
        alert('Por favor, ingresa un monto válido.');
    }
});
