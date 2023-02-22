const socket = io()

const botonChat = document.getElementById("botonChat")
const parrafoMensajes = document.getElementById("parrafoMensajes")
const val = document.getElementById("chatBox")

let user
Swal.fire({
    title: "Identificacion de Usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un valor valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user)
})

botonChat.addEventListener("click", () => {
    
    if(val.value.trim().length > 0) {
        socket.emit("mensaje", {usuario: user, mensaje: val.value})
        val.value = "" //Limpiar el input
    }
})

socket.on("mensajes", arrayMensajes => {
    parrafoMensajes.innerHTML = "" //Limpio lo que serian los parrafos
    arrayMensajes.forEach(mensaje => {
        parrafoMensajes.innerHTML += `<p>${mensaje.usuario} : ${mensaje.mensaje} </p>`
    });
})

// socket.emit("mensaje", "Hola primer msj server") //Enviar informacion a mi servidor

// socket.on("mensaje-gral", info => {
//     console.log(info)
// })

// socket.on("mensaje-ppio", info => {
//     console.log(info)
// })