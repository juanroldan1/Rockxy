//Dom
document.addEventListener('DOMContentLoaded',function(){
    const agregarCarrito = this.getElementsByClassName("AñadirCarrito");
    


    //Variables de estado
    let productosAñadidosCarrito = [];

    //Funcion para añadir elementos al carrito
    function AñadirCarrito(){
        agregarCarrito.innerHTML = AñadirCarrito.slice(-10).join('<br>');
    }

});