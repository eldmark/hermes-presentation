exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/figura.py").read())

GOLD = mat("pers_oro", (0.88, 0.70, 0.22), 0.30, 0.85)
LEATHER = mat("pers_cuero", (0.38, 0.22, 0.12), 0.75)
LEAF = mat("pers_laurel", (0.30, 0.50, 0.20), 0.7)
SIDES = (-1, 1)


def C(nm, rgb, rough=0.75):
    return mat(nm, rgb, rough)


def costume(key, s):
    """Devuelve el dict de extras de la figura según la especificación s."""
    HAIR = C(key + "_pelo", s["hair"], 0.8)
    TOP = C(key + "_top", s["top"]) if s.get("top") else None
    SKIRT = C(key + "_falda", s["skirt"])
    TRIM = C(key + "_ribete", s.get("trim", (0.88, 0.70, 0.22)), 0.5)
    BELT = C(key + "_cinto", s.get("belt", (0.38, 0.22, 0.12)), 0.6)
    CAPE = C(key + "_capa", s["cape"]) if s.get("cape") else None
    HAT = C(key + "_sombrero", s["hat_color"]) if s.get("hat_color") else None
    BEARD = C(key + "_barba", s["beard"], 0.85) if s.get("beard") else None

    def head_x(parts, c):
        style = s["hair_style"]
        if style in ("short", "long"):
            prim(col, parts, "ico", (0, 0.015, 1.745), (0.118, 0.122, 0.085), HAIR, sub=2)
            prim(col, parts, "ico", (0, 0.07, 1.70), (0.10, 0.07, 0.10), HAIR, sub=2)
            for sx in SIDES:
                prim(col, parts, "ico", (sx * 0.10, 0.0, 1.71), (0.03, 0.06, 0.07), HAIR, sub=1)
        if style == "curly":
            for loc, sc_ in [((0, 0.0, 1.78), (0.11, 0.11, 0.07)), ((-0.08, 0.04, 1.75), (0.06, 0.07, 0.06)), ((0.08, 0.04, 1.75), (0.06, 0.07, 0.06)),
                             ((0, 0.09, 1.70), (0.10, 0.06, 0.09)), ((-0.10, 0.0, 1.69), (0.04, 0.06, 0.07)), ((0.10, 0.0, 1.69), (0.04, 0.06, 0.07))]:
                prim(col, parts, "ico", loc, sc_, HAIR, sub=1)
        if style == "long":
            prim(col, parts, "cone", (0, 0.095, 1.46), (0.125, 0.075, 0.62), HAIR, rot=(PI, 0, 0), v=14, r2=0.5)
        if BEARD:
            for loc, sc_ in [((0, -0.075, 1.625), (0.085, 0.06, 0.06)), ((-0.05, -0.07, 1.66), (0.04, 0.05, 0.05)), ((0.05, -0.07, 1.66), (0.04, 0.05, 0.05)),
                             ((0, -0.07, 1.575), (0.06, 0.05, 0.06))]:
                prim(col, parts, "ico", loc, sc_, BEARD, sub=1)
        hat = s.get("hat")
        if hat == "laurel":
            prim(col, parts, "torus", (0, 0.0, 1.775), (0.125, 0.128, 0.125), LEAF, minor=0.012, seg=24)
            for k in range(10):
                a = 2 * PI * k / 10
                prim(col, parts, "sphere", (math.sin(a) * 0.128, -math.cos(a) * 0.13, 1.79), (0.012, 0.03, 0.012), GOLD if k % 3 == 0 else LEAF,
                     rot=(0.4, 0, -a), seg=6, rings=4)
        elif hat == "pilos":
            prim(col, parts, "cone", (0, 0.0, 1.84), (0.125, 0.125, 0.16), HAT, v=14, r2=0.28, rot=(math.radians(-8), 0, 0))
            prim(col, parts, "torus", (0, 0.0, 1.775), (0.125, 0.128, 0.125), HAT, minor=0.012, seg=20)
        elif hat == "veil":
            prim(col, parts, "sphere", (0, 0.04, 1.74), (0.135, 0.14, 0.11), HAT, seg=16, rings=10)
            prim(col, parts, "sphere", (0, 0.12, 1.55), (0.14, 0.05, 0.22), HAT, seg=12, rings=8)
        elif hat == "flower":
            for k in range(5):
                a = 2 * PI * k / 5
                prim(col, parts, "sphere", (0.11 + math.sin(a) * 0.022, -0.06, 1.76 + math.cos(a) * 0.022), (0.012, 0.012, 0.012), GOLD if k == 0 else C(key + "_flor", (0.95, 0.55, 0.55)), seg=6, rings=4)

    def torso_x(parts, c):
        if s["top_style"] == "full" and TOP:
            prim(col, parts, "sphere", (0, 0, 1.31), (0.222, 0.132, 0.268), TOP, seg=16, rings=10)
            prim(col, parts, "cyl", (0, 0, 1.12), (0.176, 0.116, 0.16), TOP, v=14)
        elif s["top_style"] == "sash" and TOP:
            limb(col, parts, (-0.17, -0.10, 1.52), (0.20, -0.10, 1.10), 0.05, 0.05, TOP, v=8)
            prim(col, parts, "ico", (-0.17, 0.0, 1.50), (0.09, 0.08, 0.06), TOP, sub=1)
            prim(col, parts, "sphere", (-0.17, -0.10, 1.50), (0.03, 0.02, 0.03), GOLD, seg=8, rings=6)
        if s.get("necklace"):
            prim(col, parts, "torus", (0, -0.02, 1.50), (0.15, 0.10, 0.15), GOLD, minor=0.008, seg=20, rot=(PI / 2, 0, 0))

    def pelvis_x(parts, c):
        if s["skirt_style"] == "long":
            prim(col, parts, "cone", (0, 0, 0.50), (0.31, 0.25, 0.96), SKIRT, v=20, r2=0.72)
            prim(col, parts, "torus", (0, 0, 0.04), (0.31, 0.25, 0.31), TRIM, minor=0.012, seg=24)
        else:
            prim(col, parts, "cone", (0, 0, 0.78), (0.26, 0.205, 0.40), SKIRT, v=18, r2=0.80)
            prim(col, parts, "torus", (0, 0, 0.60), (0.26, 0.205, 0.26), TRIM, minor=0.012, seg=24)
        prim(col, parts, "cyl", (0, 0, 1.0), (0.222, 0.152, 0.045), BELT, v=24)
        prim(col, parts, "cyl", (0, -0.150, 1.0), (0.034, 0.034, 0.012), GOLD, rot=(PI / 2, 0, 0), v=12)

    def cape_x(parts, c):
        prim(col, parts, "sphere", (0, 0.13, 1.42), (0.26, 0.11, 0.10), CAPE, seg=14, rings=8)
        prim(col, parts, "sphere", (0, 0.19, 1.00), (0.26, 0.03, 0.50), CAPE, rot=(math.radians(7), 0, 0), seg=14, rings=10)

    def arm_x(side):
        sx = -1 if side == "R" else 1

        def f(parts, c):
            A, B = (sx * 0.235, 0, 1.47), (sx * 0.25, 0, 1.19)
            if s["top_style"] == "full" and TOP and s.get("sleeves"):
                limb(col, parts, A, lerp(A, B, 0.55), 0.072, 0.066, TOP)
            if s.get("bands"):
                limb(col, parts, lerp(A, B, 0.62), lerp(A, B, 0.80), 0.068, 0.068, GOLD)
        return f

    def shin_x(side):
        sx = -1 if side == "R" else 1

        def f(parts, c):
            box(col, parts, (sx * 0.10, -0.062, 0.012), (0.12, 0.27, 0.024), LEATHER)
            for z in (0.06, 0.10, 0.14):
                prim(col, parts, "torus", (sx * 0.10, 0.0, z), (0.062, 0.062, 0.062), LEATHER, minor=0.008, seg=14)
            if s.get("boots"):
                limb(col, parts, (sx * 0.10, -0.004, 0.40), (sx * 0.10, -0.004, 0.10), 0.076, 0.062, LEATHER, v=12)
        return f

    ex = {"head": head_x, "torso": torso_x, "pelvis": pelvis_x,
          "arm_L": arm_x("L"), "arm_R": arm_x("R"), "shin_L": shin_x("L"), "shin_R": shin_x("R")}
    if CAPE:
        ex["cape"] = cape_x
    return ex


SPECS = {
    "apolo": dict(skin=(0.82, 0.62, 0.48), hair=(0.95, 0.78, 0.30), hair_style="short", hat="laurel", top=(0.97, 0.95, 0.88), top_style="sash",
                  skirt=(0.97, 0.95, 0.88), skirt_style="short", trim=(0.88, 0.70, 0.22), belt=(0.88, 0.70, 0.22), bands=True, cloth=(0.97, 0.95, 0.88)),
    "odiseo": dict(skin=(0.70, 0.50, 0.37), hair=(0.20, 0.12, 0.08), hair_style="curly", beard=(0.22, 0.14, 0.09), hat="pilos", hat_color=(0.70, 0.60, 0.42),
                   top=(0.55, 0.20, 0.14), top_style="full", sleeves=True, skirt=(0.55, 0.20, 0.14), skirt_style="short", trim=(0.88, 0.70, 0.22),
                   belt=(0.30, 0.18, 0.10), cape=(0.20, 0.30, 0.24), boots=True, cloth=(0.55, 0.20, 0.14)),
    "calipso": dict(skin=(0.82, 0.62, 0.50), hair=(0.14, 0.08, 0.07), hair_style="long", hat="flower", top=(0.15, 0.55, 0.60), top_style="full",
                    skirt=(0.15, 0.55, 0.60), skirt_style="long", trim=(0.88, 0.70, 0.22), belt=(0.88, 0.70, 0.22), bands=True, necklace=True, cloth=(0.15, 0.55, 0.60)),
    "maia": dict(skin=(0.80, 0.60, 0.48), hair=(0.30, 0.18, 0.10), hair_style="short", hat="veil", hat_color=(0.62, 0.74, 0.82),
                 top=(0.86, 0.90, 0.80), top_style="full", sleeves=True, skirt=(0.86, 0.90, 0.80), skirt_style="long", trim=(0.62, 0.74, 0.82),
                 belt=(0.62, 0.74, 0.82), cape=(0.62, 0.74, 0.82), necklace=True, cloth=(0.86, 0.90, 0.80)),
    "humano": dict(skin=(0.74, 0.54, 0.40), hair=(0.25, 0.16, 0.10), hair_style="short", top=(0.72, 0.62, 0.45), top_style="full", sleeves=True,
                   skirt=(0.72, 0.62, 0.45), skirt_style="short", trim=(0.50, 0.38, 0.25), belt=(0.38, 0.22, 0.12), cloth=(0.72, 0.62, 0.45)),
}

built = []
for i, (key, s) in enumerate(SPECS.items()):
    col = new_col(key)
    figura = build_figure(col, key, skin=s["skin"], base_cloth=s["cloth"], extras=costume(key, s))
    export_hierarchy(col, key + ".glb")
    figura["root"].location = (i * 1.4 - 2.8, 0, 0)  # solo para la vista previa
    built.append(col)

names = [o.name for c in built for o in c.objects if o.type == "MESH"]
preview(names, {"frente": (0, -9.5, 1.15)}, (0, 0, 0.95), "personajes", res=(1300, 700))
