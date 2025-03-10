import Swal from 'sweetalert2';
import Game from './Game.js';

let btn_player1 = document.getElementById("btn_player1");
let btn_player2 = document.getElementById("btn_player2");
let player1, player2, pj1 = "", pj2 = "", aceptar = 0;
let turno = 1;

const iniciar_player1 = () => {
    document.getElementById("player1").classList.add("d-none");
    aceptar++;
    if (aceptar === 2) {
        document.getElementById('iniciar_juego').classList.remove('d-none');
        let timerInterval;
        Swal.fire({
            title: "INICIAR COMBATE",
            html: "EN <b>3</b> segundos",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                let secondsLeft = Math.floor(Swal.getTimerLeft() / 1000);
                timer.textContent = secondsLeft;
                timerInterval = setInterval(() => {
                    secondsLeft = Math.floor(Swal.getTimerLeft() / 1000);
                    timer.textContent = secondsLeft;
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
                Swal.fire({
                    title: "Inicia el jugador 1",
                    html: "El jugador 2 no podrá hacer nada hasta que el jugador 1 haga un movimiento",
                    icon: "success",
                });
                actualizarTurno();
            }
        });
    }
};

const iniciar_player2 = () => {
    document.getElementById("player2").classList.add("d-none");
    aceptar++;
    if (aceptar === 2) {
        document.getElementById('iniciar_juego').classList.remove('d-none');
        iniciar_player1();
    }
};

const actualizarTurno = () => {
    if (turno === 1) {
        habilitarBotonesJugador(1);
        deshabilitarBotonesJugador(2);
    } else {
        habilitarBotonesJugador(2);
        deshabilitarBotonesJugador(1);
    }
};

const habilitarBotonesJugador = (jugador) => {
    document.querySelectorAll(`#player${jugador}_avatar button`).forEach(btn => btn.disabled = false);
};

const deshabilitarBotonesJugador = (jugador) => {
    document.querySelectorAll(`#player${jugador}_avatar button`).forEach(btn => btn.disabled = true);
};


document.getElementById('player1_seleccion').addEventListener('click', (e) => {
    pj1 = e.target.alt || "";
    document.querySelectorAll("#player1_seleccion img").forEach(img => {
        img.classList.remove("btn-warning");
        img.classList.add("btn-danger");
    });
    e.target.classList.add("btn-warning");
});

document.getElementById('player2_seleccion').addEventListener('click', (e) => {
    pj2 = e.target.alt || "";
    document.querySelectorAll("#player2_seleccion img").forEach(img => {
        img.classList.remove("btn-warning");
        img.classList.add("btn-primary");
    });
    e.target.classList.add("btn-warning");
});

btn_player1.addEventListener('click', () => {
    let user_name1 = document.getElementById('user_name1').value;
    if (!user_name1) return Swal.fire({ title: "Advertencia", text: "Ingresa un nombre", icon: "warning" });
    if (!pj1) return Swal.fire({ title: "Advertencia", text: "Selecciona un personaje", icon: "warning" });

    player1 = new Game(user_name1);
    document.getElementById("p1").innerText = user_name1.toUpperCase();
    document.getElementById("avatar1").src = `./public/img/${pj1}/base.png`;
    iniciar_player1();
});

btn_player2.addEventListener('click', () => {
    let user_name2 = document.getElementById('user_name2').value;
    if (!user_name2) return Swal.fire({ title: "Advertencia", text: "Ingresa un nombre", icon: "warning" });
    if (!pj2) return Swal.fire({ title: "Advertencia", text: "Selecciona un personaje", icon: "warning" });

    player2 = new Game(user_name2);
    document.getElementById("p2").innerText = user_name2.toUpperCase();
    document.getElementById("avatar2").src = `./public/img/${pj2}/base.png`;
    iniciar_player2();
});

const realizarAccion = (jugador, accion, objetivo, mensaje, img) => {
    if (turno !== jugador) return;

    accion(objetivo);
    actualizarBarras();
    verificarVictoria();
    turno = turno === 1 ? 2 : 1;
    actualizarTurno();

    Swal.fire({
        title: mensaje,
        text: "¡Acción realizada!",
        width: 600,
        color: "rgba(60, 8, 8, 0.78)",
        imageUrl: `./public/img/${img}`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: mensaje,
        backdrop: "rgba(255, 255, 255, 0.29)"
    });
};

document.getElementById("btn_atk_py1").addEventListener('click', () => realizarAccion(1, player1.atk_basico.bind(player1), player2, "Ataque Básico", `${pj1}/basico.png`));
document.getElementById("btn_esp_py1").addEventListener('click', () => realizarAccion(1, player1.atk_especial.bind(player1), player2, "Ataque Especial", `${pj1}/especial.png`));
document.getElementById("btn_ermi_py1").addEventListener('click', () => realizarAccion(1, player1.usarSemilla.bind(player1), player1, "Semilla Aumentada", `${pj1}/curar.png`));
document.getElementById("btn_ki_py1").addEventListener('click', () => realizarAccion(1, player1.aumentarKi.bind(player1), player1, "Ki Aumentado", `${pj1}/energia.png`));
document.getElementById("btn_atk_py2").addEventListener('click', () => realizarAccion(2, player2.atk_basico.bind(player2), player1, "Ataque Básico", `${pj2}/basico.png`));
document.getElementById("btn_esp_py2").addEventListener('click', () => realizarAccion(2, player2.atk_especial.bind(player2), player1, "Ataque Especial", `${pj2}/especial.png`));
document.getElementById("btn_ermi_py2").addEventListener('click', () => realizarAccion(2, player2.usarSemilla.bind(player2), player2, "Semilla Aumentada", `${pj2}/curar.png`));
document.getElementById("btn_ki_py2").addEventListener('click', () => realizarAccion(2, player2.aumentarKi.bind(player2), player2, "Ki Aumentado", `${pj2}/energia.png`));

const actualizarBarras = () => {
    actualizarBarra("vida_py1", player1.getVida(), 100);
    actualizarBarra("ki_py1", player1.getKi(), 80);
    actualizarBarra("energia_py1", player1.getEnergia(), 90);
    actualizarBarra("vida_py2", player2.getVida(), 100);
    actualizarBarra("ki_py2", player2.getKi(), 80);
    actualizarBarra("energia_py2", player2.getEnergia(), 90);
};

const actualizarBarra = (id, valor, max) => {
    let porcentaje = Math.max(0, parseInt((valor * 100) / max));
    document.getElementById(id).style.width = `${porcentaje}%`;
    document.getElementById(id).innerText = `${porcentaje}%`;
};
const verificarVictoria = () => {
    console.log(`Verificando victoria: Vida P1 = ${player1.getVida()}, Vida P2 = ${player2.getVida()}`);

    if (player1.getVida() <= 0) {
        Swal.fire({
            title: "¡Victoria!",
            text: `${player2.getUser_name()} ha ganado la partida.`,
            icon: "success"
        }).then(() => location.reload());
    } else if (player2.getVida() <= 0) {
        Swal.fire({
            title: "¡Victoria!",
            text: `${player1.getUser_name()} ha ganado la partida.`,
            icon: "success"
        }).then(() => location.reload());
    }
};


actualizarTurno();
