exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/lib.py").read())

BARK = mat("arbol_corteza", (0.34, 0.24, 0.16), 0.9)
BARK2 = mat("arbol_corteza_clara", (0.45, 0.35, 0.24), 0.9)
LEAF1 = mat("arbol_hoja_oliva", (0.30, 0.42, 0.20), 0.8)
LEAF2 = mat("arbol_hoja_clara", (0.50, 0.60, 0.32), 0.8)
LEAF3 = mat("arbol_hoja_plata", (0.62, 0.70, 0.50), 0.8)
DARKG = mat("cipres_verde", (0.12, 0.26, 0.15), 0.85)
DARKG2 = mat("cipres_verde_claro", (0.18, 0.34, 0.20), 0.85)

# ---------- ÁRBOL (olivo estilizado, ~5 m) ----------
col = new_col("arbol")
parts = []
# tronco retorcido en tres tramos
prim(col, parts, "cone", (0, 0, 0.55), (0.42, 0.42, 1.1), BARK, v=9, r2=0.7)
prim(col, parts, "cone", (0.10, 0, 1.45), (0.30, 0.30, 1.0), BARK, rot=(0, math.radians(8), 0), v=9, r2=0.7)
prim(col, parts, "cone", (0.32, 0, 2.15), (0.24, 0.24, 0.9), BARK2, rot=(0, math.radians(22), 0), v=8, r2=0.6)
# ramas
prim(col, parts, "cone", (-0.45, 0, 2.2), (0.15, 0.15, 1.3), BARK2, rot=(0, math.radians(-42), 0), v=7, r2=0.4)
prim(col, parts, "cone", (0.15, 0.45, 2.5), (0.14, 0.14, 1.2), BARK2, rot=(math.radians(-38), math.radians(10), 0), v=7, r2=0.4)
# copa: varios bloques facetados
blobs = [
    ((0.35, 0.0, 3.55), (1.55, 1.45, 1.05), LEAF1),
    ((-0.95, 0.15, 3.35), (1.10, 1.05, 0.80), LEAF2),
    ((1.35, -0.25, 3.25), (1.00, 0.95, 0.75), LEAF2),
    ((0.1, 0.9, 3.35), (1.05, 1.00, 0.78), LEAF1),
    ((0.0, -0.95, 3.40), (1.05, 1.00, 0.78), LEAF1),
    ((0.35, 0.05, 4.20), (1.05, 1.00, 0.70), LEAF3),
    ((-0.5, -0.4, 4.0), (0.80, 0.75, 0.55), LEAF2),
]
for loc, sc_, m in blobs:
    prim(col, parts, "ico", loc, sc_, m, smooth=False, sub=2)
arbol = finish(col, parts, "arbol", "arbol.glb")

# ---------- CIPRÉS (~8 m) ----------
col2 = new_col("cipres")
parts2 = []
prim(col2, parts2, "cyl", (0, 0, 0.45), (0.20, 0.20, 0.9), BARK, v=8)
for z, rx, h, m in [(1.7, 0.95, 2.2, DARKG), (3.0, 0.95, 2.4, DARKG2), (4.4, 0.78, 2.4, DARKG), (5.8, 0.55, 2.2, DARKG2), (7.0, 0.30, 1.6, DARKG)]:
    prim(col2, parts2, "sphere", (0, 0, z), (rx, rx, h * 0.62), m, smooth=False, seg=10, rings=6)
cipres = finish(col2, parts2, "cipres", "cipres.glb")
cipres.location = (8, 0, 0)  # solo para la vista previa

preview(["arbol", "cipres"], {"frente": (4, -22, 5), "tres_cuartos": (-14, -16, 8)}, (4, 0, 3.8), "arboles")
