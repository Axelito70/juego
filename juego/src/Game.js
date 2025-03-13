class Game {
    #vida = 100;
    #ki = 80;
    #energia = 90;
    #semilla = 3;
    #user_name = "";

    constructor(user_name) {
        this.#user_name = user_name;
    }

    getVida() {
        return this.#vida;
    }
    getKi() {
        return this.#ki;
    }
    getEnergia() {
        return this.#energia;
    }
    getSemilla() {
        return this.#semilla;
    }
    getUser_name() {
        return this.#user_name;
    }

    setVida(decremento) {
        this.#vida -= decremento;
    }

    atk_basico(jugador) {
        this.#ki = Math.max(this.#ki - 5, 0);
        this.#energia = Math.max(this.#energia - 10, 0);
        jugador.setVida(15);
    }

    atk_especial(jugador) {
        this.#ki = Math.max(this.#ki - 10, 0);
        this.#energia = Math.max(this.#energia - 20, 0);
        jugador.setVida(30);
    }

    usarSemilla() {
        if (this.#semilla > 0) {
            this.#vida = Math.min(this.#vida + 50, 100);
            this.#ki = Math.min(this.#ki + 40, 100);
            this.#energia = Math.min(this.#energia + 45, 100);
            this.#semilla--;
        }
    }

    aumentarKi() {
        if (this.#ki < 100) {
            let aumento = Math.floor(this.#ki * 0.15);
            this.#ki = Math.min(this.#ki + aumento, 100);
        }
    }
}

export default Game;