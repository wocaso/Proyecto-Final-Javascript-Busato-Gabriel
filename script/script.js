//Variables utilizadas
const btnCatalogo = document.querySelector("#btnCatalogo"),
    btnCarrito = document.querySelector("#btnCarrito"),
    btnCompra = document.querySelector("#btnCompra"),
    listaCatalogo = document.querySelector("#listaCatalogo");


let carro = [];
let carroID = [];


//Render de los elementos del html.

function renderCatalogo(html, array) {
    html.innerHTML = "";
    array.forEach(element => {
        let render = `  
                        <div class="card text-center me-3" style="width: 18rem;">
                        <img src=${element.img} class="card-img-top" alt=${element.nombre}>
                        <div class="card-body">
                          <h5 class="card-title">${element.nombre}</h5>
                          <p class="card-text">$${element.precio}</p>
                          <button class="agregar" id="${element.nombre}">Agregar al Carrito</button>
                        </div>
                      </div>`
        html.innerHTML += render;
    });

}


function renderCarrito(html, array) {
    html.innerHTML = "";
    let render = `<h1 class="textoPrecio">El total de su compra es de: ${totalDeCompra(array)}$`
    html.innerHTML += render;
    array.forEach(element => {
        render = `     
                      <div class="card text-center me-3 mb-3" style="width: 18rem;">
                        <img src=${element.img} class="card-img-top" alt=${element.nombre}>
                        <div class="card-body">
                          <h5 class="card-title">${element.nombre}</h5>
                          <p class="card-text">$${element.precio}</p>
                          <button class="remover" id="${element.nombre}">Quitar</button>
                        </div>
                      </div>`
        html.innerHTML += render;
    })
}

function renderCompra(html) {
    html.innerHTML = "";
    let render = `
    <div class="container mt-5">
    <form>
    <div class="row">

    <div class="col-3"></div>
    <div class="col-4">
    
    <div class="mb-1">
        <label for="inputNombre" class="form-label">Nombre</label>
        <input type="text" class="form-control" id="inputNombre" aria-describedby="emailHelp">
        <div id="emailHelp" class="form-text">Nunca compartiremos tus datos con nadie.</div>
      </div>
      <div class="mb-3">
        <label for="inputNumeroTarjeta" class="form-label">Numero de tarjeta</label>
        <input type="number" class="form-control" id="inputNumeroTarjeta">
      </div>
      <div class="mb-3">
        <label for="inputFondos" class="form-label">Fondos</label>
        <input type="number" class="form-control" id="inputFondos">
        <div id="emailHelp" class="form-text">Vivimos en un mundo ideal donde el usuario decide sus fondos al momento de la compra.</div>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="checkGuardar">
        <label class="form-check-label" for="exampleCheck1">Guardar mis datos para futuras compras.</label>
      </div>
      <button type="button" class="btn btn-primary" id="btnConfirmarCompra">Comprar</button>
      <button type="button" class="btn btn-primary" id="btnCargarUsuario">Ya tengo datos guardados.</button>
    </form>
    
    </div>

    
    </div>
      
  </div>`
    html.innerHTML += render;
}
//Clase constructora de usuarios y funciones del usuario.

class contructorUsuarios {
    constructor(nombre, tarjeta, fondos) {
        this.nombre = nombre;
        this.tarjeta = parseInt(tarjeta);
        this.fondos = parseFloat(fondos);
    }
}

function guardarUsuarioLocal(data) {
    localStorage.setItem("usuario", JSON.stringify(data))
}

function cargarUsuarioLocal(key) {
    let datoCargado = (JSON.parse(localStorage.getItem(key)) || false)
    return datoCargado;



}

function datosOK(nombre, tarjeta, fondos) {
    if (nombre == "") {
        Swal.fire("Error", "Falto Ingresar nombre.", "error")
        return false;
    }
    if (tarjeta == 0) {
        Swal.fire("Error", "Falto Ingresar tarjeta.", "error")
        return false;
    }
    if (fondos == 0) {
        Swal.fire("Error", "Falto Ingresar fondos.", "error")
        return false;
    }
    return true;
}

function compraRealizada(fondos, carrito, carro, carroID) {

    if (fondos <= carrito) {
        Swal.fire("Error", "No tienes fondos suficientes para realizar la compra.", "error")
        return fondos;
    } else {
        Swal.fire("Felicidades!", "Realizaste tu compra.", "success")
        carro.splice(0, carro.length);
        carroID.splice(0, carroID.length);
        return fondos - carrito;
    }
}

//Funciones del carrito.


function agregarCarrito(data, arrayID, arraySalida) {
    arraySalida.splice(0, arraySalida.length);
    for (i = 0; i < arrayID.length; i++) {
        for (j = 0; j < data.length; j++) {
            data[j].nombre === arrayID[i] && arraySalida.push(data[j]);
        }
    }
}


function totalDeCompra(array) {
    let total = 0;
    for (i = 0; i < array.length; i++) {
        total += array[i].precio;
    }
    return total;
}


function removerCarrito(array, arrayID, idProducto) {
    for (i = 0; i < array.length; i++) {
        if (array[i].nombre == idProducto) {
            array.splice(i, 1);
            arrayID.splice(i, 1);
            break;
        }
    }
}

//Funciones para traer los datos del json.


async function traerDatos(datos) {
    const response = await fetch(datos);
    const data = await response.json();
    return data;
}

const timerBD = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(traerDatos("./data/productos.json"))
        }, 200)
    })
}



//Eventos de los botones.

btnCatalogo.addEventListener("click", () => {
    timerBD().then((response) => {
        renderCatalogo(listaCatalogo, response);
    }).then(() => {
        const btnAgregar = document.querySelectorAll("button.agregar");
        btnAgregar.forEach(element => {
            element.onclick = () => {
                carroID.push(element.id);
                Swal.fire("Exito", "Añadiste " +element.id.toLowerCase()+ " a tu carrito.", "success")
            }
        })

    });
})


btnCarrito.addEventListener("click", () => {
    timerBD().then((response) => {
            agregarCarrito(response, carroID, carro);
            renderCarrito(listaCatalogo, carro);
        })
        .then(() => {
            const btnRemover = document.querySelectorAll("button.remover");
            btnRemover.forEach(element => {
                element.onclick = () => {
                    Swal.fire({
                        title: "¿Quitar " + element.id + " del carrito ?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Quitar",
                        cancelButtonText: "Cancelar"

                    }).then((result) => {
                        if (result.isConfirmed) {
                            removerCarrito(carro, carroID, element.id);
                            btnCarrito.click();
                        }
                    })

                }
            })

        })
})

btnCompra.addEventListener("click", () => {
    timerBD().then((response) => {
        renderCompra(listaCatalogo);
        agregarCarrito(response, carroID, carro);
        let nombreUsuario = document.querySelector("#inputNombre");
        let tarjetaUsuario = document.querySelector("#inputNumeroTarjeta");
        let fondosUsuario = document.querySelector("#inputFondos");
        let checkGuardar = document.querySelector("#checkGuardar")
        const btnConfirmarCompra = document.querySelector("#btnConfirmarCompra");
        const btnCargarUsuario = document.querySelector("#btnCargarUsuario");
        btnConfirmarCompra.addEventListener("click", () => {
            if (datosOK(nombreUsuario.value, tarjetaUsuario.value, fondosUsuario.value)) {

                if (totalDeCompra(carro) == 0) {
                    Swal.fire("Alto", "Primero agrega algun producto.", "error")
                } else {
                    fondosUsuario.value = compraRealizada(fondosUsuario.value, totalDeCompra(carro), carro, carroID);
                    if (checkGuardar.checked) {
                        guardarUsuarioLocal(new contructorUsuarios(nombreUsuario.value, tarjetaUsuario.value, fondosUsuario.value))
                        checkGuardar.checked = false;
                    }
                }

            }
        })
        btnCargarUsuario.addEventListener("click", () => {
            let usuario = cargarUsuarioLocal("usuario")
            if (usuario) {
                nombreUsuario.value = usuario.nombre;
                tarjetaUsuario.value = usuario.tarjeta;
                fondosUsuario.value = usuario.fondos;
                checkGuardar.checked = true;
            } else {
                Swal.fire("Error", "No hay datos en el almacenamiento local.", "error")
            }
        })


    })
})