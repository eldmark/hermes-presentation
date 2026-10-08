exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/lib.py").read())

MARBLE = mat("olimpo_marmol", (0.93, 0.91, 0.86), 0.55)
MARBLE2 = mat("olimpo_marmol_sombra", (0.80, 0.77, 0.70), 0.6)
GOLD = mat("olimpo_oro", (0.85, 0.68, 0.20), 0.35, 0.85)
BLUE = mat("olimpo_azul", (0.16, 0.28, 0.52), 0.6)
FIRE = mat("olimpo_fuego", (1.0, 0.55, 0.12), 0.4)
BRONZE = mat("olimpo_bronce", (0.55, 0.36, 0.14), 0.5, 0.6)


def column(col, parts, x, y, z0, h):
    """Columna jónica estilizada con base en (x, y, z0). Altura total h."""
    prim(col, parts, "cyl", (x, y, z0 + 0.15), (0.78, 0.78, 0.30), MARBLE2, v=16, smooth=False)       # plinto
    prim(col, parts, "torus", (x, y, z0 + 0.38), (0.60, 0.60, 0.60), MARBLE, minor=0.10, seg=20)         # toro
    shaft_h = h - 1.15
    prim(col, parts, "cone", (x, y, z0 + 0.45 + shaft_h / 2), (0.52, 0.52, shaft_h), MARBLE, v=20, r2=0.82, smooth=False)  # fuste acanalado
    zc = z0 + 0.45 + shaft_h
    prim(col, parts, "cyl", (x, y, zc + 0.08), (0.50, 0.50, 0.16), GOLD, v=16)                           # collarín dorado
    prim(col, parts, "cyl", (x, y, zc + 0.30), (0.62, 0.62, 0.28), MARBLE, v=16)                         # equino
    for sx in (-1, 1):                                                                                   # volutas
        prim(col, parts, "cyl", (x + sx * 0.62, y, zc + 0.36), (0.22, 0.22, 0.95), MARBLE, rot=(PI / 2, 0, 0), v=14)
        prim(col, parts, "torus", (x + sx * 0.62, y - 0.48, zc + 0.36), (0.20, 0.20, 0.20), GOLD, rot=(PI / 2, 0, 0), minor=0.045, seg=14)
    box(col, parts, (x, y, zc + 0.58), (1.55, 1.15, 0.16), MARBLE)                                       # ábaco


def pediment(col, parts, x_half, z0, depth, rise, y=0):
    """Frontón triangular con tímpano azul y disco solar dorado."""
    extrude_poly(col, parts, [(-x_half, 0), (x_half, 0), (0, rise)], depth, MARBLE, loc=(0, y, z0))
    extrude_poly(col, parts, [(-x_half * 0.82, 0.12), (x_half * 0.82, 0.12), (0, rise * 0.80)], depth * 0.30, BLUE, loc=(0, y - depth * 0.40, z0))
    prim(col, parts, "cyl", (0, y - depth * 0.58, z0 + rise * 0.36), (0.55, 0.55, 0.10), GOLD, rot=(PI / 2, 0, 0), v=20)
    for a in range(12):                                                                                   # rayos del sol
        ang = a * PI / 6
        prim(col, parts, "cone", (math.cos(ang) * 0.85, y - depth * 0.58, z0 + rise * 0.36 + math.sin(ang) * 0.85),
             (0.08, 0.08, 0.40), GOLD, rot=(0, -(ang - PI / 2), 0), v=4, smooth=False)
    prim(col, parts, "sphere", (0, y, z0 + rise + 0.2), (0.28, 0.28, 0.36), GOLD, seg=10, rings=6)       # acrótera


# ---------------- PUERTAS: MARCO ----------------
col = new_col("olimpo_puertas_marco")
parts = []
for x in (-4.2, 4.2):
    box(col, parts, (x, 0, 0.3), (1.9, 1.9, 0.6), MARBLE2)
    prim(col, parts, "cone", (x, 0, 4.4), (0.74, 0.74, 7.6), MARBLE, v=20, r2=0.88, smooth=False)
    prim(col, parts, "cyl", (x, 0, 8.18), (0.80, 0.80, 0.18), GOLD, v=16)
    prim(col, parts, "cyl", (x, 0, 8.45), (0.95, 0.95, 0.36), MARBLE, v=16)
    box(col, parts, (x, 0, 8.75), (2.2, 2.0, 0.24), MARBLE)
box(col, parts, (0, 0, 9.35), (11.0, 2.0, 0.95), MARBLE)                    # arquitrabe
box(col, parts, (0, -1.02, 9.35), (10.2, 0.06, 0.28), GOLD)                 # friso dorado
pediment(col, parts, 5.6, 9.82, 2.0, 2.2)
marco = finish(col, parts, "olimpo_puertas_marco", "olimpo_puertas_marco.glb")

# ---------------- PUERTAS: HOJA (bisagra en x=0, se extiende hacia +x) ----------------
col = new_col("olimpo_hoja")
parts = []
W, H = 4.2, 7.6
box(col, parts, (W / 2, 0, H / 2), (W, 0.30, H), GOLD)
for ix, cx in enumerate((1.05, 3.15)):
    for iz, cz in enumerate((1.55, 3.8, 6.05)):
        box(col, parts, (cx, -0.17, cz), (1.7, 0.08, 1.85), BRONZE)         # paneles en relieve (cara frontal)
        box(col, parts, (cx, 0.17, cz), (1.7, 0.08, 1.85), BRONZE)          # y trasera
prim(col, parts, "cyl", (W / 2, -0.22, 6.9), (0.55, 0.55, 0.06), BLUE, rot=(PI / 2, 0, 0), v=20)
prim(col, parts, "cyl", (W / 2, -0.26, 6.9), (0.30, 0.30, 0.05), GOLD, rot=(PI / 2, 0, 0), v=20)
prim(col, parts, "torus", (W - 0.55, -0.28, 3.6), (0.26, 0.26, 0.26), BRONZE, rot=(PI / 2, 0, 0), minor=0.05, seg=16)
prim(col, parts, "sphere", (W - 0.55, -0.22, 3.9), (0.12, 0.12, 0.12), BRONZE, seg=8, rings=6)
hoja = finish(col, parts, "olimpo_hoja", "olimpo_hoja.glb")
hoja.location = (-4.2, 0, 0)   # solo para la vista previa

# ---------------- COLUMNA SUELTA ----------------
col = new_col("olimpo_columna")
parts = []
column(col, parts, 0, 0, 0, 6.0)
colm = finish(col, parts, "olimpo_columna", "olimpo_columna.glb")
colm.location = (14, 0, 0)

# ---------------- TEMPLO / PATIO ----------------
col = new_col("olimpo_templo")
parts = []
box(col, parts, (0, 0, 0.25), (24, 16, 0.5), MARBLE)
box(col, parts, (0, 0, 0.51), (22.4, 14.4, 0.04), MARBLE2)                   # losa interior
for sx in (-1, 1):                                                           # greca dorada
    box(col, parts, (sx * 11.2, 0, 0.53), (0.18, 14.4, 0.05), GOLD)
for sy in (-1, 1):
    box(col, parts, (0, sy * 7.2, 0.53), (22.4, 0.18, 0.05), GOLD)
prim(col, parts, "cyl", (0, -0.5, 0.53), (3.2, 3.2, 0.05), BLUE, v=32)       # medallón central
prim(col, parts, "cyl", (0, -0.5, 0.56), (2.5, 2.5, 0.05), GOLD, v=32)
prim(col, parts, "cyl", (0, -0.5, 0.59), (1.9, 1.9, 0.05), BLUE, v=32)
for i, (w, yy) in enumerate(((16, -8.6), (14.4, -9.3), (12.8, -10.0))):      # escalones al frente
    box(col, parts, (0, yy, 0.18 - 0.0 * i), (w, 1.2, 0.36 - 0.0 * i), MARBLE2 if i % 2 else MARBLE)
for x in (-9.5, -5.7, -1.9, 1.9, 5.7, 9.5):                                  # columnata trasera
    column(col, parts, x, 6.6, 0.5, 7.0)
box(col, parts, (0, 6.6, 8.3), (22.0, 2.2, 1.0), MARBLE)                     # arquitrabe
box(col, parts, (0, 5.48, 8.3), (21.2, 0.06, 0.30), GOLD)
pediment(col, parts, 11.4, 8.8, 2.4, 2.6, y=6.6)
for sx in (-1, 1):                                                           # pebeteros
    x = sx * 10.4
    prim(col, parts, "cyl", (x, -6.2, 0.9), (0.28, 0.28, 0.9), GOLD, v=10)
    prim(col, parts, "cone", (x, -6.2, 1.55), (0.62, 0.62, 0.50), GOLD, v=14, r2=1.5, smooth=False)
    prim(col, parts, "cone", (x, -6.2, 2.15), (0.40, 0.40, 1.0), FIRE, v=8, r2=0.0, smooth=False)
templo = finish(col, parts, "olimpo_templo", "olimpo_templo.glb")
templo.location = (0, 40, 0)   # solo para la vista previa

preview(["olimpo_puertas_marco", "olimpo_hoja"], {"frente": (0, -30, 6.5), "tres_cuartos": (-16, -22, 9)}, (0, 0, 5.5), "puertas")
preview(["olimpo_columna"], {"frente": (14, -14, 3.5)}, (14, 0, 3.2), "columna", res=(500, 700))
preview(["olimpo_templo"], {"tres_cuartos": (-24, 10, 16), "frente": (0, 14, 10)}, (0, 41, 3.5), "templo")
