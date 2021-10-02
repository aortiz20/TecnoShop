const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById("carrito");
const procesarCompraBtn = document.getElementById("procesar-compra");
const datosTarjeta = document.querySelector(`#tarjeta`);

cargarEventos();
prueba();
function guardarTarjetaLocalStorage() {
  let ndeTarjeta = document.getElementById("NdeTarjeta").value;
  let nombreYApellido = document.getElementById("NombreYApellido").value;
  let fecha = document.getElementById("Fecha").value;
  let codigo = document.getElementById("Codigo").value;
  let dni = document.getElementById("DNI").value;
  validarDatos(ndeTarjeta, nombreYApellido, fecha, codigo, dni);
}

function prueba() {
  let ndeTarjeta = (document.getElementById("NdeTarjeta").value =
    localStorage.getItem("NdeTarjeta"));
  let nombreYApellido = (document.getElementById("NombreYApellido").value =
    localStorage.getItem("Nombre Y Apellido"));
  let fecha = (document.getElementById("Fecha").value =
    localStorage.getItem("Fecha"));
  let codigo = (document.getElementById("Codigo").value =
    localStorage.getItem("Codigo"));
  let dni = (document.getElementById("DNI").value =
    localStorage.getItem("DNI"));
}

function validarDatos(ndeTarjeta, fecha, nombreYApellido, codigo, dni) {
  if (
    ndeTarjeta.length == 16 ||
    nombreYApellido != "" ||
    codigo.length == 3 ||
    dni.length >= 8
  ) {
    console.log(ndeTarjeta);
    Swal.fire({
      type: "success",
      title: "Tarjeta agregada",
      showConfirmButton: false,
      timer: 5000,
    }).then(function () {
      window.location = "compra.html";
    });
    guardarDatos(ndeTarjeta, fecha, nombreYApellido, codigo, dni);
  } else {
    console.log(ndeTarjeta);
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: "Faltan datos o datos erroneos",
      showConfirmButton: false,
      timer: 2000,
    }).then(function () {
      window.location = "compra.html";
    });
  }
}

function guardarDatos(ndeTarjeta, nombreYApellido, fecha, codigo, dni) {
  localStorage.setItem("NdeTarjeta", ndeTarjeta);
  localStorage.setItem("Nombre Y Apellido", nombreYApellido);
  localStorage.setItem("Fecha", fecha);
  localStorage.setItem("Codigo", codigo);
  localStorage.setItem("DNI", dni);
}

function cargarEventos() {
  document.addEventListener(
    "DOMContentLoaded",
    compra.leerLocalStorageCompra()
  );

  //Eliminar productos del carrito
  carrito.addEventListener("click", (e) => {
    compra.eliminarProducto(e);
  });

  compra.calcularTotal();

  //cuando se selecciona procesar Compra
  procesarCompraBtn.addEventListener("click", (e) => {
    procesarCompra();
  });

  carrito.addEventListener("change", (e) => {
    compra.obtenerEvento(e);
  });
  carrito.addEventListener("keyup", (e) => {
    compra.obtenerEvento(e);
  });

  //Almacenar datos tarjeta y usuario en LS
  datosTarjeta.addEventListener("click", function (e) {
    guardarTarjetaLocalStorage();
    validarDatos();
  });
}

function procesarCompra() {
  // e.preventDefault();
  if (compra.obtenerProductosLocalStorage().length === 0) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: "No hay productos, selecciona alguno",
      showConfirmButton: false,
      timer: 2000,
    }).then(function () {
      window.location = "shop.html";
    });
  } else if (
    cliente.value === "" ||
    correo.value === "" ||
    guardarDatos === ""
  ) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: "Ingrese todos los campos requeridos",
      showConfirmButton: false,
      timer: 5000,
    }).then(function () {
      window.location = "compra.html";
    });
  } else {
    Swal.fire({
      type: "success",
      title: "Felicitaciones",
      text: "Compra Realizada",
      showConfirmButton: false,
      timer: 5000,
    }).then(function () {
      window.location = "compra.html";
    });
  }
}
