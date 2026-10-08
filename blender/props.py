exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/figura.py").read())
import random

GOLD = mat("prop_oro", (0.88, 0.70, 0.22), 0.30, 0.85)
WOOD = mat("prop_madera", (0.45, 0.28, 0.14), 0.75)
WOOD2 = mat("prop_madera_clara", (0.62, 0.45, 0.26), 0.75)
CLOTH = mat("prop_tela", (0.94, 0.90, 0.80), 0.85)
STONE = mat("prop_piedra", (0.72, 0.69, 0.62), 0.8)
DARK = mat("prop_oscuro", (0.07, 0.06, 0.06), 0.6)
SHELL = mat("prop_caparazon", (0.36, 0.30, 0.15), 0.7)
SHELL2 = mat("prop_caparazon_placa", (0.55, 0.46, 0.22), 0.7)
SKINT = mat("prop_piel_tortuga", (0.50, 0.52, 0.30), 0.8)
GREEN = mat("prop_verde", (0.25, 0.52, 0.22), 0.75)
WHITE = mat("prop_blanco", (0.97, 0.96, 0.92), 0.7)
RED = mat("prop_rojo", (0.70, 0.12, 0.10), 0.5)
BLUEL = mat("prop_azul_tela", (0.20, 0.34, 0.62), 0.8)
CLOUD = mat("prop_nube", (0.98, 0.98, 1.0), 0.9)

made = []


def done(col, parts, name, x):
    o = finish(col, parts, name, name + ".glb")
    o.location = (x, 0, 0)       # solo para la vista previa
    made.append(o)
    return o


# ---------- LIRA (0,55 m de alto; cara hacia -Y) ----------
col = new_col("lira"); P = []
prim(col, P, "sphere", (0, 0, 0.16), (0.14, 0.09, 0.15), SHELL, seg=16, rings=10)                     # caparazón
for dx, dz in ((0, 0.04), (-0.07, 0.15), (0.07, 0.15), (0, 0.22)):
    prim(col, P, "cyl", (dx, -0.075, 0.12 + dz * 0.5), (0.04, 0.04, 0.012), SHELL2, rot=(PI / 2, 0, 0), v=6)
prim(col, P, "cyl", (0, -0.088, 0.16), (0.115, 0.115, 0.012), CLOTH, rot=(PI / 2, 0, 0), v=20)          # tapa (piel)
for sx in (-1, 1):
    limb(col, P, (sx * 0.10, 0, 0.22), (sx * 0.16, 0, 0.36), 0.016, 0.016, WOOD2)                    # cuernos curvos
    limb(col, P, (sx * 0.16, 0, 0.36), (sx * 0.14, 0, 0.52), 0.016, 0.014, WOOD2)
    prim(col, P, "sphere", (sx * 0.14, 0, 0.53), (0.02, 0.02, 0.02), GOLD, seg=8, rings=6)
box(col, P, (0, 0, 0.50), (0.30, 0.02, 0.02), GOLD)                                                   # travesaño
for k in range(7):
    x = -0.12 + k * 0.04
    limb(col, P, (x, -0.02, 0.50), (x * 0.55, -0.075, 0.20), 0.003, 0.003, GOLD, v=4)                 # cuerdas
done(col, P, "lira", -3.0)

# ---------- TORTUGA (0,45 m de largo; mira hacia -Y) ----------
col = new_col("tortuga"); P = []
prim(col, P, "sphere", (0, 0, 0.11), (0.15, 0.21, 0.10), SHELL, seg=16, rings=10)
prim(col, P, "cyl", (0, 0, 0.065), (0.17, 0.23, 0.03), SKINT, v=16)
prim(col, P, "cyl", (0, 0, 0.205), (0.055, 0.055, 0.016), SHELL2, v=6)
for k in range(6):
    a = 2 * PI * k / 6
    prim(col, P, "cyl", (math.sin(a) * 0.095, -math.cos(a) * 0.13, 0.17), (0.05, 0.05, 0.012), SHELL2, v=6, rot=(0.4 * math.cos(a), 0.4 * math.sin(a), 0))
prim(col, P, "sphere", (0, -0.26, 0.085), (0.045, 0.06, 0.04), SKINT, seg=10, rings=8)                    # cabeza
for sx in (-1, 1):
    prim(col, P, "sphere", (sx * 0.02, -0.30, 0.095), (0.008, 0.008, 0.008), DARK, seg=6, rings=4)
    for dy in (-0.13, 0.13):
        prim(col, P, "sphere", (sx * 0.14, dy, 0.035), (0.05, 0.065, 0.035), SKINT, seg=10, rings=8)
prim(col, P, "cone", (0, 0.24, 0.06), (0.025, 0.025, 0.07), SKINT, rot=(-PI / 2, 0, 0), v=6, r2=0.2)
done(col, P, "tortuga", -2.2)

# ---------- CUNA (1 m) ----------
col = new_col("cuna"); P = []
for sx in (-1, 1):                                                                                      # balancines en arco
    pts = [(math.sin(math.radians(a)) * 0.62, 0.62 - math.cos(math.radians(a)) * 0.62 + 0.02) for a in range(-42, 43, 14)]
    for (y1, z1), (y2, z2) in zip(pts, pts[1:]):
        limb(col, P, (sx * 0.30, y1, z1), (sx * 0.30, y2, z2), 0.028, 0.028, WOOD, v=8)
    limb(col, P, (sx * 0.30, pts[0][0], pts[0][1]), (sx * 0.28, pts[0][0] * 0.8, 0.16), 0.02, 0.02, WOOD, v=6)
    limb(col, P, (sx * 0.30, pts[-1][0], pts[-1][1]), (sx * 0.28, pts[-1][0] * 0.8, 0.16), 0.02, 0.02, WOOD, v=6)
box(col, P, (0, 0, 0.16), (0.56, 0.95, 0.04), WOOD)
for sx in (-1, 1):
    box(col, P, (sx * 0.28, 0, 0.30), (0.04, 0.95, 0.28), WOOD2)
for sy in (-1, 1):
    box(col, P, (0, sy * 0.475, 0.32), (0.56, 0.04, 0.32 if sy > 0 else 0.24), WOOD2)
prim(col, P, "sphere", (0, 0, 0.23), (0.25, 0.43, 0.07), CLOTH, seg=14, rings=8)
for sx in (-1, 1):
    for sy in (-1, 1):
        prim(col, P, "sphere", (sx * 0.28, sy * 0.475, 0.50), (0.035, 0.035, 0.035), GOLD, seg=8, rings=6)
done(col, P, "cuna", -1.2)

# ---------- HERMA (1,5 m) ----------
col = new_col("herma"); P = []
box(col, P, (0, 0, 0.08), (0.46, 0.46, 0.16), STONE)
prim(col, P, "cone", (0, 0, 0.62), (0.18, 0.15, 1.05), STONE, v=4, r2=0.82, rot=(0, 0, PI / 4), smooth=False)
for sx in (-1, 1):
    box(col, P, (sx * 0.17, -0.06, 0.95), (0.07, 0.10, 0.07), STONE)                                  # muñones de brazos
prim(col, P, "sphere", (0, 0, 1.30), (0.15, 0.16, 0.18), STONE, seg=14, rings=10)                     # cabeza
prim(col, P, "cone", (0, -0.15, 1.28), (0.03, 0.03, 0.07), STONE, rot=(PI / 2, 0, 0), v=6, r2=0.5)
for loc, sc_ in [((0, -0.11, 1.15), (0.10, 0.07, 0.08)), ((0, -0.12, 1.05), (0.07, 0.06, 0.09)), ((0, 0.04, 1.40), (0.16, 0.15, 0.08))]:
    prim(col, P, "ico", loc, sc_, STONE, sub=1)                                                        # barba y cabello
prim(col, P, "cyl", (0, 0, 1.47), (0.12, 0.12, 0.03), STONE, v=12)
done(col, P, "herma", -0.4)

# ---------- CARTA / PAPIRO sellado (0,3 m) ----------
col = new_col("carta"); P = []
prim(col, P, "cyl", (0, 0, 0.0), (0.035, 0.035, 0.30), CLOTH, rot=(0, PI / 2, 0), v=14)
for sx in (-1, 1):
    prim(col, P, "cyl", (sx * 0.155, 0, 0.0), (0.045, 0.045, 0.012), WOOD2, rot=(0, PI / 2, 0), v=14)
prim(col, P, "torus", (0, 0, 0.0), (0.04, 0.04, 0.04), RED, minor=0.007, seg=14, rot=(0, PI / 2, 0))
prim(col, P, "cyl", (0, -0.04, 0.0), (0.022, 0.022, 0.01), RED, rot=(PI / 2, 0, 0), v=14)
done(col, P, "carta", 0.4)

# ---------- MOLY (planta 0,5 m) ----------
col = new_col("moly"); P = []
prim(col, P, "sphere", (0, 0, 0.03), (0.04, 0.04, 0.045), DARK, seg=10, rings=8)
for dx in (-0.025, 0.0, 0.025):
    limb(col, P, (dx, 0, 0.0), (dx * 2.2, 0.01, -0.06), 0.006, 0.002, DARK, v=5)
limb(col, P, (0, 0, 0.04), (0.01, 0, 0.36), 0.009, 0.007, GREEN, v=6)
for sx, z in ((-1, 0.14), (1, 0.22)):
    prim(col, P, "sphere", (sx * 0.055, 0, z), (0.07, 0.012, 0.022), GREEN, rot=(0, math.radians(sx * -25), 0), seg=8, rings=6)
for k in range(5):
    a = 2 * PI * k / 5
    prim(col, P, "sphere", (0.01 + math.sin(a) * 0.032, -0.0, 0.40 + math.cos(a) * 0.032), (0.02, 0.01, 0.034), WHITE, rot=(0, a, 0), seg=8, rings=6)
prim(col, P, "sphere", (0.01, -0.01, 0.40), (0.012, 0.012, 0.012), GOLD, seg=6, rings=4)
done(col, P, "moly", 1.0)

# ---------- TELAR (1,9 m) ----------
col = new_col("telar"); P = []
for sx in (-1, 1):
    box(col, P, (sx * 0.55, 0, 0.95), (0.07, 0.07, 1.9), WOOD)
    box(col, P, (sx * 0.55, 0, 0.02), (0.10, 0.5, 0.04), WOOD)
box(col, P, (0, 0, 1.82), (1.2, 0.07, 0.07), WOOD)
box(col, P, (0, 0, 0.55), (1.0, 0.05, 0.05), WOOD2)
for k in range(22):
    x = -0.46 + k * 0.042
    limb(col, P, (x, 0, 1.78), (x, 0, 0.62), 0.004, 0.004, CLOTH, v=4)
for i, (z, c) in enumerate(((0.66, BLUEL), (0.74, RED), (0.82, GOLD), (0.90, BLUEL), (0.98, CLOTH))):
    box(col, P, (0, 0.012, z), (0.95, 0.025, 0.07), c)
for dx in (-0.22, 0.22):
    prim(col, P, "cyl", (dx, -0.05, 1.1), (0.012, 0.012, 0.5), WOOD2, v=6)
done(col, P, "telar", 2.0)

# ---------- NUBE (grupo de bultos, ~6 m) ----------
col = new_col("nube"); P = []
random.seed(7)
for loc, sc_ in [((0, 0, 0.9), (2.0, 1.7, 1.0)), ((-2.0, 0.3, 0.7), (1.5, 1.3, 0.8)), ((2.1, -0.2, 0.7), (1.6, 1.4, 0.85)),
                 ((-0.6, 1.2, 1.2), (1.3, 1.1, 0.8)), ((0.9, -1.1, 1.0), (1.3, 1.1, 0.8)), ((3.4, 0.1, 0.5), (1.0, 0.9, 0.6)), ((-3.4, 0.0, 0.5), (1.0, 0.9, 0.6))]:
    prim(col, P, "ico", loc, sc_, CLOUD, sub=2)
done(col, P, "nube", 3.0 + 4.0)

# ---------- CUEVA DE MAIA (interior ~10 m de ancho; entrada hacia -Y) ----------
col = new_col("cueva"); P = []
ROCK = mat("cueva_roca", (0.50, 0.44, 0.38), 0.9)
ROCK2 = mat("cueva_roca_oscura", (0.34, 0.30, 0.26), 0.9)
EARTH = mat("cueva_tierra", (0.45, 0.35, 0.24), 0.95)
random.seed(11)


def jitter(o, amt):
    me = o.data
    for v in me.vertices:
        v.co.x += random.uniform(-amt, amt)
        v.co.y += random.uniform(-amt, amt)
        v.co.z += random.uniform(-amt, amt)


outer = prim(col, P, "ico", (0, 0, 0.0), (9.5, 8.5, 5.6), ROCK, smooth=False, sub=4)
jitter(outer, 0.22)
cav = prim(col, P, "ico", (0, 0.4, 0.0), (6.0, 5.4, 3.7), ROCK2, smooth=False, sub=4)
jitter(cav, 0.18)
ent = prim(col, P, "ico", (0, -6.0, 0.0), (2.9, 4.0, 2.6), ROCK2, smooth=False, sub=3)
jitter(ent, 0.15)
cut = prim(col, P, "cube", (0, 0, -7.0), (30, 30, 14), ROCK2, smooth=False)   # elimina lo que queda bajo el suelo
P.clear()
for o in (cav, ent, cut):
    md = outer.modifiers.new("b", "BOOLEAN")
    md.operation = "DIFFERENCE"
    md.solver = "EXACT"
    md.object = o
    bpy.context.view_layer.objects.active = outer
    bpy.ops.object.modifier_apply(modifier="b")
for o in (cav, ent, cut):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.object.select_all(action="DESELECT")
outer.select_set(True)
bpy.context.view_layer.objects.active = outer
bpy.ops.object.shade_flat()
P.append(outer)
prim(col, P, "cyl", (0, 0.3, 0.02), (6.0, 5.4, 0.06), EARTH, v=32)                                 # suelo de tierra
for k in range(9):                                                                                 # estalactitas
    a = random.uniform(0, 2 * PI)
    r = random.uniform(0.6, 0.9)
    x, y = math.cos(a) * 4.2 * r, 0.4 + math.sin(a) * 3.8 * r
    h = random.uniform(0.5, 1.3)
    prim(col, P, "cone", (x, y, 3.0 - h / 2), (0.22, 0.22, h), ROCK, rot=(PI, 0, 0), v=6, r2=0.0, smooth=False)
for loc, sc_ in [((-3.2, 2.0, 0.25), (0.8, 0.6, 0.35)), ((3.0, 1.5, 0.3), (0.7, 0.7, 0.4)), ((2.2, -1.8, 0.15), (0.5, 0.4, 0.2)), ((-2.0, -2.2, 0.15), (0.6, 0.4, 0.2))]:
    prim(col, P, "ico", loc, sc_, ROCK2, sub=1, smooth=False)                                       # rocas sueltas
box(col, P, (-3.4, 2.8, 0.08), (1.6, 1.0, 0.16), mat("cueva_paja", (0.78, 0.66, 0.34), 0.9))       # lecho de paja
done(col, P, "cueva", 7.0 + 10.0)

names = [o.name for o in made]
preview(names, {"frente": (0.0, -9.5, 1.1)}, (-0.6, 0, 0.4), "props", res=(1300, 600))
preview(["cueva"], {"fuera": (17, -26, 9), "dentro": (17, -3.2, 2.0)}, (17, 2.5, 1.8), "cueva", res=(900, 600))
