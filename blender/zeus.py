exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/lib.py").read())

MARBLE = mat("zeus_marmol", (0.93, 0.91, 0.86), 0.55)
MARBLE2 = mat("zeus_marmol_sombra", (0.78, 0.75, 0.68), 0.6)
GOLD = mat("zeus_oro", (0.88, 0.70, 0.20), 0.30, 0.85)
BLUE = mat("zeus_azul", (0.15, 0.26, 0.55), 0.6)
SKIN = mat("zeus_piel", (0.83, 0.83, 0.90), 0.7)
HAIR = mat("zeus_pelo", (0.88, 0.88, 0.92), 0.85)
DARK = mat("zeus_oscuro", (0.06, 0.06, 0.10), 0.5)
BOLT = mat("zeus_rayo", (1.0, 0.88, 0.25), 0.3, 0.3)

col = new_col("zeus_trono")
P = []


def limb(p1, p2, r1, r2, m, v=12):
    a, b = Vector(p1), Vector(p2)
    d = b - a
    rot = d.to_track_quat("Z", "Y").to_euler()
    return prim(col, P, "cone", tuple((a + b) / 2), (r1, r1, d.length), m, rot=tuple(rot), v=v, r2=r2 / r1)


def lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def bolt(x, y, z0, h, w=1.0, thick=0.25, m=None):
    base = [(0.0, 5.0), (-0.9, 2.6), (-0.1, 2.6), (-0.7, 0.0), (0.9, 3.0), (0.1, 3.0), (0.8, 5.0)]
    pts = [(px * w * h / 5.0, pz * h / 5.0) for px, pz in base]
    return extrude_poly(col, P, pts, thick, m or BOLT, loc=(x, y, z0))


# ---------- TRONO (frente = -Y, asiento a z=3.9, escalones hasta z=2.1) ----------
box(col, P, (0, -0.8, 0.35), (16, 14, 0.7), MARBLE2)
box(col, P, (0, -0.5, 1.05), (13, 12, 0.7), MARBLE)
box(col, P, (0, -0.2, 1.75), (10.5, 10, 0.7), MARBLE2)
box(col, P, (0, 1.0, 2.7), (8.6, 6.2, 1.2), MARBLE)                  # base del trono
box(col, P, (0, -2.1, 2.7), (8.9, 0.22, 1.0), GOLD)                  # friso dorado frontal
box(col, P, (0, 0.9, 3.6), (6.2, 4.8, 0.6), BLUE)                    # cojín azul
for sx in (-1, 1):
    box(col, P, (sx * 3.95, 0.8, 4.45), (1.5, 5.0, 2.3), MARBLE)    # brazos
    box(col, P, (sx * 3.95, 0.8, 5.72), (1.75, 5.25, 0.25), GOLD)
    # voluta enrollada al frente del reposabrazos (como en la referencia)
    prim(col, P, "cyl", (sx * 3.95, -1.85, 5.55), (0.78, 0.78, 1.75), MARBLE, rot=(0, PI / 2, 0), v=20)
    prim(col, P, "cyl", (sx * 4.86, -1.85, 5.55), (0.55, 0.55, 0.10), GOLD, rot=(0, PI / 2, 0), v=20)
    prim(col, P, "sphere", (sx * 4.92, -1.85, 5.55), (0.22, 0.22, 0.22), GOLD, seg=10, rings=6)
# respaldo
box(col, P, (0, 3.2, 7.8), (9.2, 1.2, 9.0), MARBLE)
box(col, P, (0, 3.2, 10.8), (5.8, 1.0, 15.0), MARBLE2)
prim(col, P, "cyl", (0, 3.2, 18.3), (2.9, 2.9, 1.0), MARBLE2, rot=(PI / 2, 0, 0), v=40)
box(col, P, (0, 2.62, 10.8), (4.2, 0.08, 12.4), BLUE)                # panel azul
prim(col, P, "cyl", (0, 2.62, 17.9), (2.0, 2.0, 0.08), BLUE, rot=(PI / 2, 0, 0), v=32)
prim(col, P, "cyl", (0, 2.58, 17.9), (1.1, 1.1, 0.08), GOLD, rot=(PI / 2, 0, 0), v=32)
for k in range(9):                                                   # tachuelas doradas
    prim(col, P, "sphere", (-4.0 + k, 2.55, 11.9), (0.18, 0.18, 0.18), GOLD, seg=8, rings=6)
for sx in (-1, 1):
    for z in (4.6, 6.4, 8.2, 10.0):
        prim(col, P, "sphere", (sx * 4.3, 2.55, z), (0.18, 0.18, 0.18), GOLD, seg=8, rings=6)
    prim(col, P, "cone", (sx * 4.75, 3.2, 8.0), (0.65, 0.65, 11.0), MARBLE, v=14, r2=0.8, smooth=False)   # pilastras
    prim(col, P, "cyl", (sx * 4.75, 3.2, 13.7), (0.9, 0.9, 0.5), GOLD, v=14)
    prim(col, P, "sphere", (sx * 4.75, 3.2, 14.6), (0.7, 0.7, 0.7), GOLD, seg=12, rings=8)
# halo solar detrás de la cabeza
HZ = 9.8
prim(col, P, "torus", (0, 2.5, HZ), (2.55, 2.55, 2.55), GOLD, rot=(PI / 2, 0, 0), minor=0.10, seg=40)
for a in range(16):
    ang = a * 2 * PI / 16
    prim(col, P, "cone", (math.cos(ang) * 3.35, 2.5, HZ + math.sin(ang) * 3.35), (0.17, 0.17, 1.5), GOLD,
         rot=(0, PI / 2 - ang, 0), v=4, smooth=False)

# ---------- ZEUS (sentado; asiento Z0 = 3.9) ----------
Z0 = 3.9
H = Z0 + 5.75                      # centro de la cabeza (deja cuello visible)

for sx in (-1, 1):
    x = sx * 0.75
    hip, knee, ankle = (x, 0.6, Z0 + 0.58), (x, -2.9, Z0 + 0.60), (x, -3.35, 2.40)
    limb(hip, lerp(hip, knee, 0.5), 0.70, 0.66, GOLD)                       # falda dorada sobre el muslo
    limb(lerp(hip, knee, 0.42), knee, 0.58, 0.50, SKIN)                     # muslo
    prim(col, P, "sphere", knee, (0.52, 0.52, 0.52), SKIN, seg=12, rings=8)  # rodilla
    limb(knee, ankle, 0.50, 0.36, SKIN)                                     # espinilla
    prim(col, P, "sphere", (x, -3.55, 2.27), (0.42, 0.72, 0.20), SKIN, seg=12, rings=8)     # pie
    box(col, P, (x, -3.50, 2.14), (0.80, 1.55, 0.14), GOLD)                 # sandalia
    for k in range(3):
        box(col, P, (x, -3.0 - k * 0.25, 2.45), (0.82, 0.07, 0.07), GOLD)   # correas
    limb((x, -3.2, 2.55), (x, -3.3, 2.75), 0.40, 0.38, GOLD)                # tobillera
prim(col, P, "ico", (0, -0.3, Z0 + 0.95), (1.6, 1.6, 0.55), GOLD, sub=2)    # regazo / paño dorado
prim(col, P, "ico", (0, 0.3, Z0 + 1.35), (1.55, 1.0, 0.85), GOLD, sub=2)    # cadera
prim(col, P, "sphere", (0, 0.3, Z0 + 2.75), (1.40, 0.90, 1.55), SKIN, seg=18, rings=12)   # torso
prim(col, P, "cyl", (0, 0.3, Z0 + 1.50), (1.42, 0.92, 0.34), GOLD, v=28)    # cinturón
prim(col, P, "cyl", (0, -0.62, Z0 + 1.50), (0.34, 0.34, 0.06), BLUE, rot=(PI / 2, 0, 0), v=20)
prim(col, P, "cyl", (0, -0.66, Z0 + 1.50), (0.20, 0.20, 0.05), GOLD, rot=(PI / 2, 0, 0), v=20)
limb((-1.25, -0.30, Z0 + 4.05), (0.95, -0.68, Z0 + 1.75), 0.30, 0.30, GOLD)  # banda dorada en diagonal
prim(col, P, "ico", (-1.45, 0.15, Z0 + 3.85), (0.78, 0.72, 0.62), GOLD, sub=2)  # manto sobre el hombro
# cuello y cabeza
prim(col, P, "cyl", (0, 0.2, Z0 + 4.55), (0.52, 0.52, 0.80), SKIN, v=14)
prim(col, P, "sphere", (0, 0.0, H), (0.85, 0.90, 1.00), SKIN, seg=20, rings=14)
prim(col, P, "cone", (0, -0.92, H - 0.12), (0.17, 0.17, 0.42), SKIN, rot=(PI / 2, 0, 0), v=8, r2=0.5)  # nariz
for sx in (-1, 1):
    prim(col, P, "sphere", (sx * 0.34, -0.80, H + 0.12), (0.12, 0.06, 0.09), DARK, seg=8, rings=6)      # ojos
    prim(col, P, "sphere", (sx * 0.37, -0.80, H + 0.34), (0.30, 0.15, 0.10), HAIR, rot=(0, math.radians(sx * -14), 0), seg=10, rings=6)  # cejas
    prim(col, P, "sphere", (sx * 0.28, -0.90, H - 0.40), (0.34, 0.16, 0.12), HAIR, seg=10, rings=6)     # bigote
    prim(col, P, "sphere", (sx * 0.92, 0.05, H - 0.05), (0.10, 0.20, 0.30), SKIN, seg=8, rings=6)       # orejas
# barba larga y en punta
for loc, sc_ in [((0, -0.62, H - 0.6), (0.85, 0.55, 0.75)), ((-0.42, -0.58, H - 1.0), (0.50, 0.45, 0.70)),
                 ((0.42, -0.58, H - 1.0), (0.50, 0.45, 0.70)), ((0, -0.72, H - 1.4), (0.70, 0.50, 0.90)),
                 ((0, -0.75, H - 2.0), (0.60, 0.45, 0.90)), ((0, -0.75, H - 2.6), (0.45, 0.38, 0.80)),
                 ((0, -0.72, H - 3.1), (0.28, 0.28, 0.55))]:
    prim(col, P, "ico", loc, sc_, HAIR, sub=2)
# cabello
for loc, sc_ in [((0, 0.55, H + 0.2), (0.90, 0.60, 0.85)), ((-0.78, 0.50, H + 0.08), (0.28, 0.52, 0.62)),
                 ((0.78, 0.50, H + 0.08), (0.28, 0.52, 0.62)), ((0, 0.10, H + 0.80), (0.80, 0.70, 0.35)),
                 ((-0.55, 0.20, H + 0.62), (0.45, 0.50, 0.40)), ((0.55, 0.20, H + 0.62), (0.45, 0.50, 0.40))]:
    prim(col, P, "ico", loc, sc_, HAIR, sub=2)
# corona dorada
prim(col, P, "torus", (0, 0.0, H + 0.82), (0.88, 0.92, 0.88), GOLD, minor=0.08, seg=28)
for k in range(9):
    ang = k * 2 * PI / 9
    hgt = 0.95 if k % 2 == 0 else 0.62
    prim(col, P, "cone", (math.cos(ang) * 0.82, math.sin(ang) * 0.86, H + 0.82 + hgt / 2), (0.15, 0.15, hgt), GOLD, v=4, r2=0.0, smooth=False)
# brazos
for sx in (-1, 1):
    sh = (sx * 1.75, 0.25, Z0 + 3.70)
    el = (sx * 2.90, -0.20, Z0 + 2.25)
    hd = (sx * 3.70, -0.90, Z0 + 2.45)
    prim(col, P, "sphere", sh, (0.62, 0.62, 0.62), SKIN, seg=12, rings=8)
    limb(sh, el, 0.50, 0.42, SKIN)
    limb(lerp(sh, el, 0.35), lerp(sh, el, 0.55), 0.52, 0.52, GOLD)           # brazalete del bíceps
    prim(col, P, "sphere", el, (0.44, 0.44, 0.44), SKIN, seg=10, rings=8)
    limb(el, hd, 0.42, 0.33, SKIN)
    limb(lerp(el, hd, 0.62), lerp(el, hd, 0.82), 0.38, 0.38, GOLD)           # muñequera dorada
    prim(col, P, "sphere", hd, (0.40, 0.40, 0.40), SKIN, seg=12, rings=8)
# cetro (mano izquierda de Zeus = -x)
sx0, sy0 = -3.70, -0.90
limb((sx0, sy0, 5.75), (sx0, sy0, 14.6), 0.13, 0.13, GOLD, v=10)
for z in (13.4, 13.9, 14.4):
    prim(col, P, "torus", (sx0, sy0, z), (0.24, 0.24, 0.24), GOLD, minor=0.06, seg=14)
prim(col, P, "cone", (sx0, sy0, 15.6), (0.55, 0.55, 2.1), GOLD, v=10, r2=0.18)
prim(col, P, "sphere", (sx0, sy0, 16.7), (0.2, 0.2, 0.2), GOLD, seg=10, rings=6)
# rayo (mano derecha = +x)
bolt(3.70, -0.90, 5.8, 6.0, 1.0, 0.30)

zeus = finish(col, P, "zeus_trono", "zeus.glb")

preview(["zeus_trono"], {"completo": (0, -55, 11), "detalle": (-9, -18, 8.5), "frente": (0, -24, 8.5)}, (0, -1, 7.5), "zeus", res=(760, 900))
