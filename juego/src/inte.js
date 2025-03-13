import Swal from 'sweetalert2';
import Game from './Game.js';

let btn_player1 = document.getElementById("btn_player1");
let btn_player2 = document.getElementById("btn_player2");
let player1, player2, pj1 = "", pj2 = "", aceptar = 0;
let turno = 1;
let turnosDesdeUltimoAtaqueEspecial = 0;

// Historial de combates
let historial = {
    jugador1: { victorias: 0, derrotas: 0 },
    jugador2: { victorias: 0, derrotas: 0 }
};

// Configuración global de SweetAlert2
const customSwal = Swal.mixin({
    background: 'linear-gradient(135deg, #FF8C00 0%, #FF4500 100%)', // Fondo degradado naranja
    color: '#000', // Texto en negro
    iconColor: '#FF4500', // Color del ícono
    confirmButtonColor: '#FF8C00', // Color del botón de confirmación
    cancelButtonColor: '#FF4500', // Color del botón de cancelación
    buttonsStyling: true, // Aplicar estilos a los botones
    customClass: {
        confirmButton: 'swal2-confirm-btn', // Clase personalizada para el botón de confirmación
        cancelButton: 'swal2-cancel-btn', // Clase personalizada para el botón de cancelación
        title: 'swal2-title', // Clase personalizada para el título
        htmlContainer: 'swal2-html', // Clase personalizada para el contenido HTML
    },
});

// Función para actualizar el historial en la interfaz
const actualizarHistorial = () => {
    document.getElementById("historial").innerHTML = `
        <strong>Historial:</strong>
        ${player1.getUser_name()}: ${historial.jugador1.victorias} victorias, ${historial.jugador1.derrotas} derrotas |
        ${player2.getUser_name()}: ${historial.jugador2.victorias} victorias, ${historial.jugador2.derrotas} derrotas
    `;
};

// Función para iniciar el combate
const iniciarCombate = () => {
    document.getElementById('iniciar_juego').classList.remove('d-none');
    let timerInterval;
    customSwal.fire({
        title: "INICIAR COMBATE",
        html: "EN <b>3</b> segundos",
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            customSwal.showLoading();
            const timer = customSwal.getPopup().querySelector("b");
            let secondsLeft = Math.floor(customSwal.getTimerLeft() / 1000);
            timer.textContent = secondsLeft;
            timerInterval = setInterval(() => {
                secondsLeft = Math.floor(customSwal.getTimerLeft() / 1000);
                timer.textContent = secondsLeft;
            }, 1000);
        },
        willClose: () => {
            clearInterval(timerInterval);
            customSwal.fire({
                title: "Inicia el jugador 1",
                html: "El jugador 2 no podrá hacer nada hasta que el jugador 1 haga un movimiento",
                icon: "success",
            });
            // Desactivar el botón de ataque especial al inicio del combate
            document.getElementById("btn_esp_py1").disabled = true;
            document.getElementById("btn_esp_py2").disabled = true;
            actualizarTurno();
        }
    });
};

// Función para iniciar el jugador 1
const iniciar_player1 = () => {
    document.getElementById("player1").classList.add("d-none");
    aceptar++;
    if (aceptar === 2) {
        iniciarCombate();
    }
};

// Función para iniciar el jugador 2
const iniciar_player2 = () => {
    document.getElementById("player2").classList.add("d-none");
    aceptar++;
    if (aceptar === 2) {
        iniciarCombate();
    }
};

// Función para actualizar el turno
const actualizarTurno = () => {
    if (turno === 1) {
        habilitarBotonesJugador(1);
        deshabilitarBotonesJugador(2);
    } else {
        habilitarBotonesJugador(2);
        deshabilitarBotonesJugador(1);
    }
    turnosDesdeUltimoAtaqueEspecial++; // Incrementar el contador de turnos
    actualizarBotonesAtaqueEspecial(); // Actualizar estado del botón de ataque especial
};

// Función para habilitar los botones de un jugador
const habilitarBotonesJugador = (jugador) => {
    document.querySelectorAll(`#player${jugador}_avatar button`).forEach(btn => btn.disabled = false);
};

// Función para deshabilitar los botones de un jugador
const deshabilitarBotonesJugador = (jugador) => {
    document.querySelectorAll(`#player${jugador}_avatar button`).forEach(btn => btn.disabled = true);
};

// Función para actualizar los botones de ataque especial
const actualizarBotonesAtaqueEspecial = () => {
    if (turnosDesdeUltimoAtaqueEspecial >= 2) {
        document.getElementById("btn_esp_py1").disabled = false;
        document.getElementById("btn_esp_py2").disabled = false;
    } else {
        document.getElementById("btn_esp_py1").disabled = true;
        document.getElementById("btn_esp_py2").disabled = true;
    }
};

// Función para verificar la victoria
const verificarVictoria = () => {
    if (player1.getVida() <= 0) {
        historial.jugador2.victorias++; // Incrementar victorias del Jugador 2
        historial.jugador1.derrotas++; // Incrementar derrotas del Jugador 1
        actualizarHistorial(); // Actualizar el historial en la interfaz
        customSwal.fire({
            title: "¡Victoria!",
            text: `${player2.getUser_name()} ha ganado la partida.`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Revancha",
            cancelButtonText: "Reiniciar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Revancha: Reiniciar valores pero conservar personajes
                player1 = new Game(player1.getUser_name());
                player2 = new Game(player2.getUser_name());
                actualizarBarras();
                document.getElementById("btn_esp_py1").disabled = true;
                document.getElementById("btn_esp_py2").disabled = true;
                turnosDesdeUltimoAtaqueEspecial = 0;
                turno = 1;
                actualizarTurno();
            } else {
                // Reiniciar todo y eliminar el historial
                historial = {
                    jugador1: { victorias: 0, derrotas: 0 },
                    jugador2: { victorias: 0, derrotas: 0 }
                };
                actualizarHistorial(); // Limpiar el historial en la interfaz
                location.reload(); // Recargar la página
            }
        });
        return true; // Indicar que hay un ganador
    } else if (player2.getVida() <= 0) {
        historial.jugador1.victorias++; // Incrementar victorias del Jugador 1
        historial.jugador2.derrotas++; // Incrementar derrotas del Jugador 2
        actualizarHistorial(); // Actualizar el historial en la interfaz
        customSwal.fire({
            title: "¡Victoria!",
            text: `${player1.getUser_name()} ha ganado la partida.`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Revancha",
            cancelButtonText: "Reiniciar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Revancha: Reiniciar valores pero conservar personajes
                player1 = new Game(player1.getUser_name());
                player2 = new Game(player2.getUser_name());
                actualizarBarras();
                document.getElementById("btn_esp_py1").disabled = true;
                document.getElementById("btn_esp_py2").disabled = true;
                turnosDesdeUltimoAtaqueEspecial = 0;
                turno = 1;
                actualizarTurno();
            } else {
                // Reiniciar todo y eliminar el historial
                historial = {
                    jugador1: { victorias: 0, derrotas: 0 },
                    jugador2: { victorias: 0, derrotas: 0 }
                };
                actualizarHistorial(); // Limpiar el historial en la interfaz
                location.reload(); // Recargar la página
            }
        });
        return true; // Indicar que hay un ganador
    }
    return false; // No hay ganador aun
};

// Eventos para seleccionar personajes
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

// Eventos para aceptar jugadores
btn_player1.addEventListener('click', () => {
    let user_name1 = document.getElementById('user_name1').value;
    if (!user_name1) return customSwal.fire({ title: "Advertencia", text: "Ingresa un nombre", icon: "warning" });
    if (!pj1) return customSwal.fire({ title: "Advertencia", text: "Selecciona un personaje", icon: "warning" });

    player1 = new Game(user_name1);
    document.getElementById("p1").innerText = user_name1.toUpperCase();
    document.getElementById("avatar1").src = `./public/img/${pj1}/base.png`;
    iniciar_player1();
});

btn_player2.addEventListener('click', () => {
    let user_name2 = document.getElementById('user_name2').value;
    if (!user_name2) return customSwal.fire({ title: "Advertencia", text: "Ingresa un nombre", icon: "warning" });
    if (!pj2) return customSwal.fire({ title: "Advertencia", text: "Selecciona un personaje", icon: "warning" });

    player2 = new Game(user_name2);
    document.getElementById("p2").innerText = user_name2.toUpperCase();
    document.getElementById("avatar2").src = `./public/img/${pj2}/base.png`;
    iniciar_player2();
});

// Función para realizar acciones (ataques, cargar ki, etc.)
const realizarAccion = (jugador, accion, objetivo, mensaje, img) => {
    if (turno !== jugador) return;

    accion(objetivo);
    actualizarBarras();

    // Verificar si hay un ganador después de cada acción
    if (verificarVictoria()) {
        return; // Si hay un ganador, no continuar con el turno
    }

    turno = turno === 1 ? 2 : 1;
    actualizarTurno();

    customSwal.fire({
        title: mensaje,
        text: "¡Acción realizada!",
        width: 600,
        color: "#000", // Texto en negro
        imageUrl: `./public/img/${img}`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: mensaje,
        backdrop: "rgba(255, 255, 255, 0.29)"
    });
};

// Eventos para los botones de acciones
document.getElementById("btn_atk_py1").addEventListener('click', () => realizarAccion(1, player1.atk_basico.bind(player1), player2, "Ataque Básico", `${pj1}/basico.png`));
document.getElementById("btn_esp_py1").addEventListener('click', () => {
    if (turnosDesdeUltimoAtaqueEspecial >= 2) {
        realizarAccion(1, player1.atk_especial.bind(player1), player2, "Ataque Especial", `${pj1}/especial.png`);
        turnosDesdeUltimoAtaqueEspecial = 0; // Reiniciar el contador de turnos
        actualizarBotonesAtaqueEspecial(); // Desactivar ambos botones de ataque especial
    }
});
document.getElementById("btn_ermi_py1").addEventListener('click', () => {
    if (player1.getSemilla() > 0) {
        player1.usarSemilla(); 
        document.getElementById("se_p1").innerText = player1.getSemilla(); 
        actualizarBarras(); 
        customSwal.fire({
            title: "Semilla Aumentada",
            text: "¡Has usado una semilla del ermitaño!",
            icon: "success",
        }).then(() => {
            turno = 2; 
            actualizarTurno(); 
        });
    }
});
document.getElementById("btn_ki_py1").addEventListener('click', () => {
    player1.aumentarKi(); 
    actualizarBarras(); 
    customSwal.fire({
        title: "Ki Aumentado",
        text: "¡Has aumentado tu ki!",
        icon: "success",
    }).then(() => {
        turno = 2; 
        actualizarTurno(); 
    });
});

document.getElementById("btn_atk_py2").addEventListener('click', () => realizarAccion(2, player2.atk_basico.bind(player2), player1, "Ataque Básico", `${pj2}/basico.png`));
document.getElementById("btn_esp_py2").addEventListener('click', () => {
    if (turnosDesdeUltimoAtaqueEspecial >= 2) {
        realizarAccion(2, player2.atk_especial.bind(player2), player1, "Ataque Especial", `${pj2}/especial.png`);
        turnosDesdeUltimoAtaqueEspecial = 0; // Reiniciar el contador de turnos
        actualizarBotonesAtaqueEspecial(); // Desactivar ambos botones de ataque especial
    }
});
document.getElementById("btn_ermi_py2").addEventListener('click', () => {
    if (player2.getSemilla() > 0) {
        player2.usarSemilla(); // Usar la semilla (ya limita los valores a 100)
        document.getElementById("se_p2").innerText = player2.getSemilla(); 
        actualizarBarras(); // Actualizar las barras de estado
        customSwal.fire({
            title: "Semilla Aumentada",
            text: "¡Has usado una semilla del ermitaño!",
            icon: "success",
        }).then(() => {
            turno = 1; // Cambiar el turno al jugador 1
            actualizarTurno(); // Actualizar el estado de los botones
        });
    }
});
document.getElementById("btn_ki_py2").addEventListener('click', () => {
    player2.aumentarKi(); // Aumentar ki (ya limita el valor a 100)
    actualizarBarras(); // Actualizar las barras de estado
    customSwal.fire({
        title: "Ki Aumentado",
        text: "¡Has aumentado tu ki!",
        icon: "success",
    }).then(() => {
        turno = 1; // Cambiar el turno al jugador 1
        actualizarTurno(); // Actualizar el estado de los botones
    });
});


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