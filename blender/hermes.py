exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/figura.py").read())

col = new_col("hermes")

GOLD = mat("hermes_oro", (0.88, 0.70, 0.22), 0.30, 0.85)
CREAM = mat("hermes_crema", (0.95, 0.90, 0.78), 0.65)
BLUE = mat("hermes_azul", (0.10, 0.28, 0.50), 0.65)
BLUE2 = mat("hermes_azul_claro", (0.18, 0.42, 0.62), 0.65)
LEATHER = mat("hermes_cuero", (0.38, 0.22, 0.12), 0.75)
HAIR = mat("hermes_pelo", (0.93, 0.86, 0.62), 0.8)
STAFF = mat("hermes_vara", (0.55, 0.40, 0.22), 0.5, 0.2)
WING = mat("hermes_ala", (0.98, 0.97, 0.94), 0.6)
SIDES = (-1, 1)


def head_x(parts, c):
    # cabello corto rubio
    prim(col, parts, "ico", (0, 0.015, 1.745), (0.118, 0.122, 0.085), HAIR, sub=2)
    prim(col, parts, "ico", (0, 0.07, 1.70), (0.10, 0.07, 0.10), HAIR, sub=2)
    for sx in SIDES:
        prim(col, parts, "ico", (sx * 0.10, 0.0, 1.71), (0.03, 0.06, 0.07), HAIR, sub=1)
    # petaso: ala, copa, cinta y alas
    prim(col, parts, "cyl", (0, 0.0, 1.79), (0.235, 0.235, 0.012), CREAM, v=28, rot=(math.radians(-6), 0, 0))
    prim(col, parts, "sphere", (0, 0.0, 1.835), (0.125, 0.125, 0.075), CREAM, seg=16, rings=8)
    prim(col, parts, "torus", (0, 0.0, 1.80), (0.128, 0.128, 0.128), GOLD, minor=0.011, seg=24)
    for sx in SIDES:
        for k, (dz, ln, ang) in enumerate(((0.00, 0.20, 18), (0.045, 0.17, 38), (0.085, 0.13, 58))):
            prim(col, parts, "sphere", (sx * (0.15 + 0.035 * k), 0.02, 1.90 + dz + 0.03),
                 (0.012, 0.035, ln / 2), WING, rot=(0, math.radians(sx * ang), math.radians(sx * 8)), seg=8, rings=6)


def torso_x(parts, c):
    # banda de cuero en diagonal y bolsa en la cadera
    limb(col, parts, (-0.17, -0.105, 1.52), (0.19, -0.095, 1.06), 0.028, 0.028, LEATHER, v=8)
    prim(col, parts, "sphere", (-0.17, -0.09, 1.50), (0.032, 0.02, 0.032), GOLD, seg=10, rings=6)
    box(col, parts, (0.255, -0.03, 1.02), (0.10, 0.075, 0.13), LEATHER)
    prim(col, parts, "cyl", (0.255, -0.03, 1.10), (0.028, 0.028, 0.14), CREAM, rot=(0, PI / 2, 0), v=10)  # rollo de papiro
    box(col, parts, (0.255, -0.075, 1.02), (0.06, 0.012, 0.045), GOLD)


def pelvis_x(parts, c):
    # túnica azul bajo la falda y falda de tiras (pteruges)
    prim(col, parts, "cone", (0, 0, 0.80), (0.255, 0.20, 0.30), BLUE, v=18, r2=0.74)
    prim(col, parts, "cyl", (0, 0, 1.0), (0.225, 0.155, 0.05), GOLD, v=24)                  # cinturón
    prim(col, parts, "cyl", (0, -0.152, 1.0), (0.04, 0.04, 0.012), BLUE2, rot=(PI / 2, 0, 0), v=14)
    n = 14
    for k in range(n):
        a = 2 * PI * k / n
        rx, ry = 0.265, 0.21
        x, y = math.sin(a) * rx, -math.cos(a) * ry
        box(col, parts, (x, y, 0.84), (0.062, 0.012, 0.30), GOLD if k % 2 else CREAM,
            rot=(math.radians(-8) * (-math.cos(a)), math.radians(8) * math.sin(a), -a))


def cape_x(parts, c):
    prim(col, parts, "sphere", (0, 0.13, 1.42), (0.27, 0.12, 0.10), BLUE, seg=14, rings=8)        # cuello de la capa
    prim(col, parts, "sphere", (0, 0.20, 1.02), (0.27, 0.035, 0.50), BLUE, rot=(math.radians(8), 0, 0), seg=14, rings=10)
    prim(col, parts, "sphere", (0, 0.26, 0.62), (0.22, 0.03, 0.30), BLUE2, rot=(math.radians(12), 0, 0), seg=12, rings=8)
    for sx in SIDES:
        prim(col, parts, "sphere", (sx * 0.20, 0.07, 1.40), (0.10, 0.09, 0.06), BLUE, seg=10, rings=6)


def arm_x(s):
    sx = -1 if s == "R" else 1

    def f(parts, c):
        limb(col, parts, lerp((sx * 0.235, 0, 1.47), (sx * 0.25, 0, 1.19), 0.40), lerp((sx * 0.235, 0, 1.47), (sx * 0.25, 0, 1.19), 0.62), 0.072, 0.072, GOLD)
    return f


def forearm_x(s):
    sx = -1 if s == "R" else 1

    def f(parts, c):
        limb(col, parts, lerp((sx * 0.25, 0, 1.19), (sx * 0.26, 0, 0.93), 0.45), lerp((sx * 0.25, 0, 1.19), (sx * 0.26, 0, 0.93), 0.95), 0.058, 0.05, GOLD)
        if s == "L":     # caduceo en la mano izquierda
            hx, hy = 0.27, -0.02
            limb(col, parts, (hx, hy, 0.30), (hx, hy, 2.12), 0.014, 0.014, STAFF, v=8)
            prim(col, parts, "sphere", (hx, hy, 2.16), (0.026, 0.026, 0.026), GOLD, seg=10, rings=8)
            for t in range(28):                    # dos serpientes entrelazadas
                z = 1.55 + t * 0.0175
                for ph in (0, PI):
                    ang = (t / 28) * 4 * PI + ph
                    prim(col, parts, "sphere", (hx + 0.030 * math.sin(ang), hy + 0.030 * math.cos(ang), z), (0.0125, 0.0125, 0.0125), GOLD, seg=6, rings=4)
            for sg in SIDES:                       # alas del caduceo
                for k, (dz, ln) in enumerate(((0.0, 0.11), (0.035, 0.09), (0.065, 0.07))):
                    prim(col, parts, "sphere", (hx + sg * (0.05 + 0.02 * k), hy, 2.115 + dz), (ln / 2, 0.006, 0.016),
                         WING, rot=(0, math.radians(sg * -12), math.radians(sg * 14)), seg=8, rings=4)
    return f


def leg_x(s):
    def f(parts, c):
        pass
    return f


def shin_x(s):
    sx = -1 if s == "R" else 1

    def f(parts, c):
        # greba dorada con voluta en la rodilla
        limb(col, parts, (sx * 0.10, -0.004, 0.50), (sx * 0.10, -0.004, 0.17), 0.085, 0.066, GOLD, v=14)
        prim(col, parts, "torus", (sx * 0.10, -0.082, 0.50), (0.046, 0.046, 0.046), GOLD, minor=0.012, seg=16, rot=(PI / 2, 0, 0))
        prim(col, parts, "sphere", (sx * 0.10, -0.088, 0.50), (0.015, 0.012, 0.015), GOLD, seg=8, rings=6)
        # sandalia con correas
        box(col, parts, (sx * 0.10, -0.062, 0.012), (0.12, 0.27, 0.024), LEATHER)
        for z in (0.06, 0.10, 0.14):
            prim(col, parts, "torus", (sx * 0.10, 0.0, z), (0.062, 0.062, 0.062), LEATHER, minor=0.008, seg=14)
        prim(col, parts, "sphere", (sx * 0.10, -0.01, 0.09), (0.052, 0.052, 0.052), GOLD, seg=8, rings=6)
        # alas en los tobillos
        for sg in SIDES:
            for k in range(3):
                prim(col, parts, "sphere", (sx * 0.10 + sg * 0.075, 0.035 + 0.025 * k, 0.12 + 0.02 * k), (0.007, 0.075 - 0.012 * k, 0.026),
                     WING, rot=(math.radians(-20 - 8 * k), 0, math.radians(sg * 14)), seg=8, rings=4)
    return f


extras = {
    "head": head_x, "torso": torso_x, "pelvis": pelvis_x, "cape": cape_x,
    "arm_L": arm_x("L"), "arm_R": arm_x("R"), "forearm_L": forearm_x("L"), "forearm_R": forearm_x("R"),
    "leg_L": leg_x("L"), "leg_R": leg_x("R"), "shin_L": shin_x("L"), "shin_R": shin_x("R"),
}
objs = build_figure(col, "hermes", skin=(0.68, 0.46, 0.33), base_cloth=(0.10, 0.28, 0.50), extras=extras)
export_hierarchy(col, "hermes.glb")

names = [o.name for o in col.objects if o.type == "MESH"]
preview(names, {"frente": (0, -4.6, 1.2), "tres_cuartos": (-3.0, -3.4, 1.5), "atras": (2.5, 3.6, 1.4)}, (0, 0, 0.98), "hermes", res=(700, 900))
preview(names, {"cabeza": (-0.8, -1.5, 1.85)}, (0, 0, 1.75), "hermes_cabeza", res=(800, 700))
