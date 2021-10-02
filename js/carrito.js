class Carrito {
  //Añadir producto al carrito
  comprarProducto(e) {
    e.preventDefault();
    //Delegado para agregar al carrito
    if (e.target.classList.contains("agregar-carrito")) {
      const producto = e.target.parentElement.parentElement;

      this.leerDatosProducto(producto);
    }
  }

  //Leer datos del producto
  leerDatosProducto(producto) {
    const infoProducto = {
      imagen: producto.querySelector("img").src,
      titulo: producto.querySelector("h4").textContent,
      precio: producto.querySelector(".precio span").textContent,
      id: producto.querySelector("a").getAttribute("data-id"),
      cantidad: 1,
    };
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (productoLS) {
      if (productoLS.id === infoProducto.id) {
        productosLS = productoLS.id;
      }
    });

    if (productosLS === infoProducto.id) {
      Swal.fire({
        type: "info",
        title: "Oops...",
        text: "El producto ya está agregado",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      this.insertarCarrito(infoProducto);
    }
  }

  //muestra producto seleccionado en carrito
  insertarCarrito(producto) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
    listaProductos.appendChild(row);
    this.guardarProductosLocalStorage(producto);
  }

  //Eliminar el producto del carrito en el DOM
  eliminarProducto(e) {
    e.preventDefault();
    let producto, productoID;
    if (e.target.classList.contains("borrar-producto")) {
      e.target.parentElement.parentElement.remove();
      producto = e.target.parentElement.parentElement;
      productoID = producto.querySelector("a").getAttribute("data-id");
    }
    this.eliminarProductoLocalStorage(productoID);
    this.calcularTotal();
  }

  //Elimina todos los productos
  vaciarCarrito(e) {
    e.preventDefault();
    while (listaProductos.firstChild) {
      listaProductos.removeChild(listaProductos.firstChild);
    }
    this.vaciarLocalStorage();

    return false;
  }

  //Almacenar en el LS
  guardarProductosLocalStorage(producto) {
    let productos;

    productos = this.obtenerProductosLocalStorage();

    productos.push(producto);

    localStorage.setItem("productos", JSON.stringify(productos));
  }

  //Comprobar que hay elementos en el LS
  obtenerProductosLocalStorage() {
    let productoLS;

    //Comprobar si hay algo en LS
    if (localStorage.getItem("productos") === null) {
      productoLS = [];
    } else {
      productoLS = JSON.parse(localStorage.getItem("productos"));
    }
    return productoLS;
  }

  //Mostrar los productos guardados en el LS
  leerLocalStorage() {
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (producto) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
      listaProductos.appendChild(row);
    });
  }

  //Mostrar los productos guardados en el LS en compra.html
  leerLocalStorageCompra() {
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function (producto) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <p> ${producto.cantidad}</p>
                </td>
                <td id='subtotales'>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
      listaCompra.appendChild(row);
    });
  }

  //Eliminar producto por ID del LS
  eliminarProductoLocalStorage(productoID) {
    let productosLS;

    productosLS = this.obtenerProductosLocalStorage();

    productosLS.forEach(function (productoLS, shop) {
      if (productoLS.id === productoID) {
        productosLS.splice(shop, 1);
      }
    });

    //Añadimos el arreglo actual al LS
    localStorage.setItem("productos", JSON.stringify(productosLS));
  }

  //Eliminar todos los datos del LS
  vaciarLocalStorage() {
    localStorage.clear();
  }

  //Procesar pedido
  procesarPedido(e) {
    e.preventDefault();

    if (this.obtenerProductosLocalStorage().length === 0) {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: "El carrito está vacío, agrega algún producto",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      location.href = "../paginas/compra.html";
    }
  }

  //Calcular montos
  calcularTotal() {
    let productosLS;
    let subtotal = 0,
      total = 0,
      iva = 0;
    productosLS = this.obtenerProductosLocalStorage();
    for (let i = 0; i < productosLS.length; i++) {
      let element = Number(productosLS[i].precio * productosLS[i].cantidad);
      subtotal = subtotal + element;
    }

    iva = parseFloat(subtotal * (21 / 100)).toFixed(2);

    total = parseFloat(subtotal + subtotal * (21 / 100)).toFixed(2);
    document.getElementById("subtotal").innerHTML = "$ " + subtotal;
    document.getElementById("iva").innerHTML = "$" + iva;
    document.getElementById("total").value = "$ " + total;
  }
}

/*function Producto(nombre, precio, img) {
  this.nombre = nombre;
  this.precio = precio;
  this.img = img;
}

const arrayProducto = [];

const samsungA02 = new Producto("Samsung Galaxy A02", 20000, "../imagenes/Samsung-Galaxy-A02.jpg");
const samsungA21s = new Producto("Samsung Galaxy A21s", 35000, "../imagenes/a21s.jpg");
const xiaomiRedmi9C = new Producto("Xiaomi Redmi 9C", 30000, "../imagenes/redmi.jpg");
const samsungS20 = new Producto("Samsung Galaxy S20", 75000, "../imagenes/s20.jpg");
const alcatel1 = new Producto("Alcatel 1", 10000, "../imagenes/alcatel.jpg");
const iphone12Pro = new Producto("iPhone 12 Pro", 257599, "../imagenes/iPhone-12-estándar-1.jpg");
const motoG30 = new Producto("Motorola Moto G30", 34999, "../imagenes/motog30.png");
const motoG20 = new Producto("Motorola Moto G20", 27999, "../imagenes/moto-g20-1.png" );

arrayProducto.push(
  samsungA02,
  samsungA21s,
  xiaomiRedmi9C,
  samsungS20,
  alcatel1,
  iphone12Pro,
  motoG30,
  motoG20
);

console.log (JSON.stringify (samsungA02)); 
console.log (JSON.stringify(samsungA21s));
console.log (JSON.stringify(xiaomiRedmi9C));
console.log (JSON.stringify( alcatel1));
console.log (JSON.stringify(iphone12Pro));
console.log (JSON.stringify(motoG30));
console.log (JSON.stringify(motoG20));

$("#btn").click ( () => {
  let var1 = $("#cuotas2").val();
 let final = precio2 / var1;
 $("#precioFinal").append(`<div <h1> El precio total es de $${precio2}, en ${var1} cuotas de $${final} </h1>
</div>`)
} )

$("#carrito").click (function () {
 Swal.fire({
   position: 'top-end',
   title: 'Carrito de compras',
   html: `<div id="carrito2"></div>`,
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
 }).then((result) => {
 if (result.isConfirmed) {
   Swal.fire({
     position: 'top-end',
      title:'Deleted!',
    text:'Your file has been deleted.',
   icon: 'success'
 })
}  
 })
});


let seleccion
let precio2=0;
$("#1").click ( () => {
  seleccion = arrayProducto[0].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[0].img} alt="Galaxy A02" />
                          <h4>${arrayProducto[0].nombre} $${arrayProducto[0].precio} </h4> 
                          </div>`) 
  precio2=precio2 + seleccion;
  console.log(precio2)
})

$("#2").click ( () => {
  seleccion = arrayProducto[1].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[1].img} alt="Galaxy A21s" />
                          <h4>${arrayProducto[1].nombre} $${arrayProducto[1].precio} </h4> 
                        </div>`)          
  precio2=precio2 + seleccion;
  console.log(precio2)         
})

$("#3").click ( () => {
  seleccion = arrayProducto[2].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[2].img} alt="Redmi 9C" />
  <h4>${arrayProducto[2].nombre} $${arrayProducto[2].precio} </h4> 
</div>`)          
  precio2=precio2 + seleccion;
  console.log(precio2)             
})

$("#4").click ( () => {
  seleccion = arrayProducto[3].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[3].img} alt="Galaxy S20" />
  <h4>${arrayProducto[3].nombre} $${arrayProducto[3].precio} </h4> 
</div>`)    
  precio2=precio2 + seleccion;
  console.log(precio2)                   
})

$("#5").click ( () => {
  seleccion = arrayProducto[4].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[4].img} alt="Alcatel 1" />
  <h4>${arrayProducto[4].nombre} $${arrayProducto[4].precio} </h4> 
</div>`)      
  precio2=precio2 + seleccion;
  console.log(precio2)                 
})

$("#6").click ( () => {
  seleccion = arrayProducto[5].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[5].img} alt="Iphone 12 PRO" />
  <h4>${arrayProducto[5].nombre} $${arrayProducto[5].precio} </h4> 
</div>`)     
  precio2=precio2 + seleccion;
  console.log(precio2)                  
})
$("#7").click ( () => {
  seleccion = arrayProducto[6].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[6].img} alt="Moto G30" />
  <h4>${arrayProducto[6].nombre} $${arrayProducto[6].precio} </h4> 
</div>`)      
  precio2=precio2 + seleccion;
  console.log(precio2)                 
})
$("#8").click ( () => {
  seleccion = arrayProducto[7].precio;
  $("#seleccion").append(`<div class="flex-carro"> <img class="imagen-carro" src=${arrayProducto[7].img} alt="Moto G20" />
  <h4>${arrayProducto[7].nombre} $${arrayProducto[7].precio} </h4> 
</div>`)     
  precio2=precio2 + seleccion;
  console.log(precio2)                  
})

*/
