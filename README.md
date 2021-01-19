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

Por lo tanto, todo cubo se puede resolver en, como maximo, 30 movimientos