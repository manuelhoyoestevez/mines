v(x) Entero.   Valor de la casilla x => [0, 8]
P(x) Conjunto. Adyacentes de la casilla x pulsados => indican un número.
M(x) Conjunto. Adyacentes de la casilla x marcados => indican una mina.
F(x) Conjunto. Adyacentes de la casilla x libres   => no están pulsados ni marcados.
r(x) Entero.   Número de minas restantes en los adyacentes de la casilla x.
    => r(x) = v(x) - m(x).
    => r(x) <= f(x) => R(x) es contenido por (o igual a) F(x).

Casillas confluentes: la máxima distancia cartesiana entre ellas es <= 2.
c(x, y) = x e y son distintos, confluentes, F(x) contiene a F(y), y f(x) > f(y)

Casilla agotada x: f(x) = 0, r(x) = 0 (todos sus adyacentes están pulsados o marcados).

# Para una casilla descubierta y no agotada a
1) Si v(a) = m(a)        -> pulsar F(a).
2) Si v(a) = m(a) + f(a) -> marcar F(a).

# Para dos casillas a y b descubiertas, confluentes y no agotadas
3) Si c(a, b) y r(a) = r(b)               -> pulsar F(a) / F(b).
4) Si c(a, b) y r(a) = r(b) + f(a) - f(b) -> marcar F(a) / F(b).

# Probabilidades
5) Pulsar la casilla con la probabilidad mínima -> Preguntar al usuario



============================================================================
t = m + p + l (total de adyacentes = marcados + pulsados + libres)
v = m + r     (valor = marcados + restantes) -> r = v - m
