// Obtener todo el arbol de categorias (nivel 1, 2 y 3). de cms_categories?
/*const categories = {
    "id_level_3": {
       "id_level_2": {
    }
}*/

// Recorrer cada fila del excel usando streams.
// - Obtener las categorias del producto a partir del id de la categoria de nivel 3.
// - Si no existe la categoria de nivel 3, entonces añadir a un archivo json los productos que no se pudieron procesar.
// - A partir del stream ir insertando en mongodb los productos.
// - Después de terminar de leer todo el excel, responder con el total de productos insertados y los productos que no se pudieron procesar.
// - También insertar el archivo json con los productos que no se pudieron procesar en mongodb.
