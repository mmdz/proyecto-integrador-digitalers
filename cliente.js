class Cliente {
  #id;
  #nombre;
  #apellido;
  #dni;
  #email;
  #password;
  #cuenta;

  constructor(nombre, apellido, dni, email, password) {
    this.#id = Date.now();
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#dni = dni;
    this.#email = email;
    this.#password = password;
    this.#cuenta = new Cuenta(this.#id);
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get apellido() { return this.#apellido; }
  get dni() { return this.#dni; }
  get email() { return this.#email; }
  get cuenta() { return this.#cuenta; }

  verificarPassword(input) {
    return input === this.#password;
  }

  cambiarPassword(actual, nueva) {
    if (this.verificarPassword(actual)) {
      this.#password = nueva;
      return true;
    }
    return false;
  }
}
