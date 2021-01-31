# Resolvedor de cubos de rubik

## Introducción
El tradicional cubo de rubik es un cubo de 3x3x3 piezas con colores en ellas. Contiene 6 centros de colores, fijos que rotan sobre sí mismos; 12 aristas, adyacentes a 2 centros, y con sus mismos colores; y 8 esquinas, de 3 colores, que son adyacentes a 3 aristas. Esto da como resultado un cubo con 6 caras de distintos colores:
- Rojo al frente
- Naranja detrás
- Blanco arriba
- Amarillo abajo
- Verde a la izquierda
- Azul a la derecha

## Tecnologías

Este proyecto está hecho con:
- node.js
- Sistema de gestión de paquetes npm
- Framework express
- View engine JADE
- CSS
- Vanilla JS

### Explicación del funcionamiento del cubo de rubik
En un cubo de rubik hay 20 piezas moviles
12 aristas, que tienen 2 colores y pueden estar en 2 posiciones
8 vertices, que tienen 3 colores y pueden estar en 3 posiciones
Esto nos da 12! * 2^12 * 8! * 3^8 = 2515205230010826752

Para buscar el camino mas corto al cubo resuelto, se hace un bfs buscando el cubo terminado.

Al buscar de forma ciega, se mueve en todas las direcciones posibles (12 direcciones), ya que hay 12 posibles jugadas. Si lo vieramos lo veríamos como una n-esfera en R^12. Sin embargo, Si se busca desde el cubo sin terminar y desde el cubo terminado, tenemos dos esferas mas chicas que se unen en un único punto.

Vn(n,R) = V(12) * R^n

V(n) = V(S(n-1)) / n
S(n) = 2*pi*V(n-1)
V(0) = 2
S(0) = 2

Dado esto, al separar la esfera en 2, tenemos 2 r/2 que equivalen a R
Por lo tanto:
Mejora = (Vn(12, R)) / (2 * Vn(12,R/2)) = 2^11 = 2048

Por lo tanto, es 2048 veces mas rapido

Aplicando la inversa para buscar R,
Sabemos que Vn(12,R) = posibildiades = 2515205230010826752

Dado que V(12) = se aproxima a = 5.9190874
Entonces R^12 = 2515205230010826752 / 5.9190874
         29 < R < 30

Por lo tanto, todo cubo se puede resolver en, como maximo, 30 movimientos.

### Lentitud del código
Sin embargo, una recursión con tan alta multiplicidad da como resultado, una complejidad algorirmica de O(f(n)) = O(n^12), sin tener en cuenta la complejidad de cada intancia de recursión. Sea esta O(g(n)), entonces la verdadera complejidad sería (g . f (n)), o, expresado de otra manera, O(f(g(n))) = O(f(n)^12).

Por esto, es posible considerar conveniente desarrollar un algoritmo que ya no busque la manera más corta de resolverlo, sino una manera de resolverlo, cualquiera sea. Luego, se podría optimizar para eliminar los pasos repetidos.