import Swal from 'sweetalert2';
import Game from './Game.js';

let btn_player1 = document.getElementById("btn_player1")
let btn_player2 = document.getElementById("btn_player2")
let player1, player2, pj1 = "", pj2 = "", aceptar = 0;

const iniciar_player1 = () => {
    document.getElementById("player1").classList.add("d-none");
    aceptar++;
    if(aceptar == 2){
        document.getElementById('iniciar_juego').classList.remove('d-none');
        let timerInterval;
        Swal.fire({
            title: "INICIAR COMABTE",
            html: "EN <b>3</b> segundos", // Aquí se agrega un <b> donde se mostrará el tiempo
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                let timeLeft = Swal.getTimerLeft(); // Obtienes el tiempo restante en milisegundos
                let secondsLeft = Math.floor(timeLeft / 1000); // Convertimos a segundos
                timer.textContent = secondsLeft; // Actualizamos el temporizador en segundos
    
                // Actualizamos el temporizador cada segundo
                timerInterval = setInterval(() => {
                    timeLeft = Swal.getTimerLeft(); // Vuelves a obtener el tiempo restante
                    secondsLeft = Math.floor(timeLeft / 1000); // Lo conviertes a segundos
                    if (timer) {
                        timer.textContent = secondsLeft; // Actualizas el valor
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval); // Limpiamos el intervalo cuando el modal se cierre
                Swal.fire({
                    title: "Inicia el jugador 1",
                    html: "El jugador 2 no podra hacer nada hasta que el jugador 1 haga un movimiento", // Aquí se agrega un <b> donde se mostrará el tiempo
                    icon: "success",
                })
            }
        });
    }
}
const iniciar_player2 = () => {
    document.getElementById("player2").classList.add("d-none");
    aceptar++
    if(aceptar == 2){
        document.getElementById('iniciar_juego').classList.remove('d-none');
        let timerInterval;
        Swal.fire({
            title: "INICIAR COMABTE",
            html: "EN <b>3</b> segundos", // Aquí se agrega un <b> donde se mostrará el tiempo
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                let timeLeft = Swal.getTimerLeft(); // Obtienes el tiempo restante en milisegundos
                let secondsLeft = Math.floor(timeLeft / 1000); // Convertimos a segundos
                timer.textContent = secondsLeft; // Actualizamos el temporizador en segundos
    
                // Actualizamos el temporizador cada segundo
                timerInterval = setInterval(() => {
                    timeLeft = Swal.getTimerLeft(); // Vuelves a obtener el tiempo restante
                    secondsLeft = Math.floor(timeLeft / 1000); // Lo conviertes a segundos
                    if (timer) {
                        timer.textContent = secondsLeft; // Actualizas el valor
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval); // Limpiamos el intervalo cuando el modal se cierre
                Swal.fire({
                    title: "Inicia el jugador 1",
                    html: "El jugador 2 no podra hacer nada hasta que el jugador 1 haga un movimiento", // Aquí se agrega un <b> donde se mostrará el tiempo
                    icon: "success",
                })
            }
        });
    }
}

let seleccion1 = document.getElementById('player1_seleccion')
seleccion1.addEventListener('click', (e) => {
    pj1 = e.target.alt == undefined ? "" :e.target.alt;
    
    seleccion1.querySelectorAll("img").forEach(temp_img => {
        temp_img.classList.remove("btn-warning");
        temp_img.classList.add('btn-danger');
    })  

    e.target.classList.remove("btn-danger");
    e.target.classList.add("btn-warning");
})

let seleccion2 = document.getElementById('player2_seleccion')
seleccion2.addEventListener('click', (e) => {
    pj2 = e.target.alt == undefined ? "" :e.target.alt;
    
    seleccion2.querySelectorAll("img").forEach(temp_img => {
        temp_img.classList.remove("btn-warning");
        temp_img.classList.add('btn-primary');
    })  

    e.target.classList.remove("btn-primary");
    e.target.classList.add("btn-warning");
})

btn_player1.addEventListener('click', () => {
    let user_name1 = document.getElementById('user_name1').value;
    if (user_name1 == "") {
        Swal.fire({
            title: "Advertencias para el jugador 1",
            text: 'Tienes que ingresar un nombre de usuario',
            icon: 'warning'
        })
    }else {
        player1 = new Game(user_name1)
        if (pj1 == "") {
            Swal.fire({
                title: "Advertencias para el jugador 1",
                text: 'Tienes que elejir un personaje',
                icon: 'warning'
            })
        }else {
            document.getElementById("p1").innerText = user_name1.toUpperCase();
            document.getElementById("avatar1").src = `./public/img/${pj1}/base.png`;
            iniciar_player1()
        }
    }
})

btn_player2.addEventListener('click', () => {
    let user_name2 = document.getElementById('user_name2').value;
    if (user_name2 == "") {
        Swal.fire({
            title: "Advertencias para el jugador 2",
            text: 'Tienes que ingresar un nombre de usuario',
            icon: 'warning'
        })
    }else {
        player2 = new Game(user_name2)
        if (pj2 == "") {
            Swal.fire({
                title: "Advertencias para el jugador 2",
                text: 'Tienes que elejir un personaje',
                icon: 'warning'
            })   
        }else {
            document.getElementById("p2").innerText = user_name2.toUpperCase();
            document.getElementById("avatar2").src = `./public/img/${pj2}/base.png`;
            iniciar_player2();
        }
    }
})

document.getElementById("btn_atk_py1").addEventListener('click',() => {
    player1.atk_basico(player2);
    let porcentaje = parseInt((parseInt(player1.getKi()) * 100 /80));
    document.getElementById('ki_py1').style.width = `${porcentaje}%`;
    document.getElementById('ki_py1').innerText = `${porcentaje}%`;
    
    porcentaje = parseInt((parseInt(player1.getEnergia()) * 100 /90));
    document.getElementById('energia_py1').style.width = `${porcentaje}%`;
    document.getElementById('energia_py1').innerText = `${porcentaje}%`;
    
    porcentaje = parseInt((parseInt(player2.getVida()) * 100 /100));
    document.getElementById('vida_py2').style.width = `${porcentaje}%`;
    document.getElementById('vida_py2').innerText = `${porcentaje}%`;

    Swal.fire({
        title: "Ataque basico",
        text: "AHHH!!",
        width: 600,
        color: "rgba(60, 8, 8, 0.78)",
        imageUrl: `./public/img/${pj1}/basico.png`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Ataque basico",
        backdrop: "rgba(255, 255, 255, 0.29)"
      });
})
document.getElementById("btn_esp_py1").addEventListener('click',() => {
    player1.atk_especial(player2);
    let porcentaje = parseInt((parseInt(player1.getKi()) * 100 /80));
    document.getElementById('ki_py1').style.width = `${porcentaje}%`;
    document.getElementById('ki_py1').innerText = `${porcentaje}%`;
    
    porcentaje = parseInt((parseInt(player1.getEnergia()) * 100 /90));
    document.getElementById('energia_py1').style.width = `${porcentaje}%`;
    document.getElementById('energia_py1').innerText = `${porcentaje}%`;
    
    porcentaje = parseInt((parseInt(player2.getVida()) * 100 /100));
    document.getElementById('vida_py2').style.width = `${porcentaje}%`;
    document.getElementById('vida_py2').innerText = `${porcentaje}%`;
    Swal.fire({
        title: "Ataque Especial",
        text: "AHHH!!",
        width: 600,
        color: "rgba(60, 8, 8, 0.78)",
        imageUrl: `./public/img/${pj1}/basico.png`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Ataque Especial",
        backdrop: "rgba(255, 255, 255, 0.29)"
      });
})
document.getElementById("btn_ermi_py1").addEventListener('click', () => {
    player1.usarSemilla(player1); 

    let porcentaje = parseInt((parseInt(player1.getKi()) * 100 / 80));
    document.getElementById('ki_py1').style.width = `${porcentaje}%`;
    document.getElementById('ki_py1').innerText = `${porcentaje}%`;

    porcentaje = parseInt((parseInt(player1.getEnergia()) * 100 / 90));
    document.getElementById('energia_py1').style.width = `${porcentaje}%`;
    document.getElementById('energia_py1').innerText = `${porcentaje}%`;

    porcentaje = parseInt((parseInt(player2.getVida()) * 100 / 100));
    document.getElementById('vida_py2').style.width = `${porcentaje}%`;
    document.getElementById('vida_py2').innerText = `${porcentaje}%`;

    Swal.fire({
        title: "Semilla Aumentada",
        text: "¡Has aumentado tu semilla en 50!",
        width: 600,
        color: "rgba(60, 8, 8, 0.78)",
        imageUrl: `./public/img/${pj1}/basico.png`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Semilla Aumentada",
        backdrop: "rgba(255, 255, 255, 0.29)"
    });
});
document.getElementById("btn_ki_py1").addEventListener('click',() => {
    player1.aumentarki(player1); 

    let porcentaje = parseInt((parseInt(player1.getKi()) * 100 / 80));
    document.getElementById('ki_py1').style.width = `${porcentaje}%`;
    document.getElementById('ki_py1').innerText = `${porcentaje}%`;
    Swal.fire({
        title: "Ki aumentado",
        text: "¡Has aumentado tu semilla en 15!",
        width: 600,
        color: "rgba(60, 8, 8, 0.78)",
        imageUrl: `./public/img/${pj1}/basico.png`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Ki aumentado",
        backdrop: "rgba(255, 255, 255, 0.29)"
    });
});


