"""Hermes (versión detallada). Misma jerarquía de nodos y pivotes que figura.py para que Character lo anime igual.
Ejecutar con Blender (puente en el puerto 9876) o sin interfaz: blender -b --factory-startup -P blender/hermes.py
"""
exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/loft.py").read())
import random

random.seed(5)
V = lambda *a: Vector(a)
col = new_col("hermes")

# ---------- materiales ----------
SKIN = mat("h_piel", (0.56, 0.34, 0.22), 0.55)
LIP = mat("h_labio", (0.46, 0.22, 0.18), 0.5)
EYEW = mat("h_ojo", (0.96, 0.95, 0.92), 0.3)
IRIS = mat("h_iris", (0.20, 0.34, 0.40), 0.3)
PUPIL = mat("h_pupila", (0.03, 0.03, 0.04), 0.3)
HAIR = mat("h_pelo", (0.88, 0.76, 0.48), 0.7)
BROW = mat("h_ceja", (0.60, 0.46, 0.25), 0.8)
HAT = mat("h_petaso", (0.96, 0.93, 0.84), 0.6)
WING = mat("h_ala", (0.99, 0.99, 0.97), 0.5)
GOLD = mat("h_oro", (0.90, 0.72, 0.24), 0.28, 0.9)
CREAM = mat("h_crema", (0.95, 0.90, 0.78), 0.65)
BLUE = mat("h_azul", (0.09, 0.28, 0.50), 0.6)
BLUE_D = mat("h_azul_oscuro", (0.06, 0.20, 0.38), 0.65)
LEATHER = mat("h_cuero", (0.34, 0.20, 0.10), 0.7)
STAFF = mat("h_vara", (0.66, 0.50, 0.24), 0.4, 0.5)

SIDES = {"R": -1, "L": 1}

# anillos del torso: (z, rx, ry, ox, oy)  (oy<0 adelanta el centro hacia el frente)
TORSO = [
    (1.02, .150, .098, 0, 0), (1.10, .143, .096, 0, 0), (1.20, .158, .103, 0, -.003),
    (1.30, .180, .114, 0, -.007), (1.38, .192, .111, 0, -.005), (1.45, .196, .097, 0, 0),
    (1.49, .155, .086, 0, 0), (1.525, .092, .072, 0, 0), (1.55, .056, .058, 0, 0),
]
X_SH, X_EL, X_WR, X_HA = .215, .228, .238, .242   # hombro, codo, muñeca y mano (x de cada lado)


def front_y(z):
    pts = TORSO
    for a, b in zip(pts, pts[1:]):
        if a[0] <= z <= b[0]:
            t = (z - a[0]) / (b[0] - a[0])
            return (a[4] + (b[4] - a[4]) * t) - (a[2] + (b[2] - a[2]) * t)
    return -0.1


def fuse(P, voxel, smooth=2, post=None, ratio=.5):
    """Une todas las piezas de piel de la parte en una sola superficie orgánica (remallado por vóxeles + suavizado)."""
    skin = [o for o in P if o.data.materials and o.data.materials[0].name == SKIN.name]
    if len(skin) < (1 if post else 2):
        return
    P[:] = [o for o in P if all(o is not k for k in skin)]
    bpy.ops.object.select_all(action="DESELECT")
    for o in skin:
        o.select_set(True)
    bpy.context.view_layer.objects.active = skin[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    md = o.modifiers.new("rm", "REMESH")
    md.mode = "VOXEL"
    md.voxel_size = voxel
    md.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier="rm")
    md = o.modifiers.new("sm", "SMOOTH")
    md.factor = 0.55
    md.iterations = smooth
    bpy.ops.object.modifier_apply(modifier="sm")
    if post:
        post(o)
    md = o.modifiers.new("dc", "DECIMATE")
    md.ratio = ratio
    bpy.ops.object.modifier_apply(modifier="dc")
    o.select_set(False)
    P.insert(0, o)


def _ss(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def _bump(x, z, cx, cz, rx, rz):
    """Montículo suave elíptico (0 en el borde, 1 en el centro)."""
    d = math.sqrt(((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2)
    return 1 - _ss(0.35, 1.0, d)


def relief_torso(o):
    """Textura muscular en el frente del torso: la silueta queda plana y el relieve solo se nota en luz y sombra."""
    me = o.data
    me.update()
    for v in me.vertices:
        x, y, z = v.co
        n = Vector((x / .19 ** 2, y / .105 ** 2, 0)).normalized()      # normal elíptica lisa (la del remallado es ruidosa)
        if n.y > -0.35 or not (1.04 < z < 1.50) or abs(x) > .20:
            continue
        sx = 1 if x >= 0 else -1
        ax = abs(x)
        h = 0.0
        h += .0095 * _bump(ax, z, .088, 1.352, .088, .052)                      # pectoral
        h -= .0042 * _bump(ax, z, .090, 1.282, .105, .014)                     # pliegue bajo el pectoral
        h -= .0030 * _bump(ax, z, .0, 1.30, .011, .20) * _ss(1.06, 1.14, z)     # surco central
        for zc, hh in ((1.236, .0042), (1.170, .0042), (1.104, .0040)):         # abdominales
            h += hh * _bump(ax, z, .034, zc, .031, .030)
        h += .0030 * _bump(ax, z, .140, 1.215, .030, .070)                      # serrato
        v.co = v.co + n * h
    me.update()
    bpy.context.view_layer.objects.active = o
    md = o.modifiers.new('sm2', 'SMOOTH')
    md.factor = .5
    md.iterations = 2
    bpy.ops.object.modifier_apply(modifier='sm2')


def skirt(P, mat_, z0, z1, rx0, ry0, rx1, ry1, t0=0.0, t1=1.0, folds=9, amp=.05, thick=.007, name="falda"):
    """Falda con pliegues verticales y dobladillo ondulado. t0..t1 recorta una franja (para el ribete)."""
    rows, seg = 14, 84
    bm = bmesh.new()
    vs = []
    for i in range(rows):
        t = t0 + (t1 - t0) * i / (rows - 1)
        row = []
        for k in range(seg):
            a = 2 * math.pi * k / seg
            f = 1 + amp * (t ** 0.8) * math.sin(folds * a + .9 * math.sin(2 * a))
            z = z0 + (z1 - z0) * t - .035 * (t ** 3) * (.5 + .5 * math.sin(folds * a + 1.2))
            rx = (rx0 + (rx1 - rx0) * t) * f
            ry = (ry0 + (ry1 - ry0) * t) * f
            row.append(bm.verts.new((rx * math.sin(a), -ry * math.cos(a), z)))
        vs.append(row)
    for i in range(rows - 1):
        for k in range(seg):
            bm.faces.new((vs[i][k], vs[i][(k + 1) % seg], vs[i + 1][(k + 1) % seg], vs[i + 1][k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    col.objects.link(o)
    o.data.materials.append(mat_)
    for poly in me.polygons:
        poly.use_smooth = True
    bpy.context.view_layer.update()
    md = o.modifiers.new("solid", "SOLIDIFY")
    md.thickness = thick
    md.offset = 1
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.modifier_apply(modifier="solid")
    o.select_set(False)
    P.append(o)
    return o


# ======================================================================
# PELVIS: cadera, túnica azul, falda de tiras (pteruges), cinturón
# ======================================================================
def pelvis_b(P):
    loft(col, P, [V(0, 0, z) for z in (.84, .94, 1.04)], [(.152, .102), (.168, .110), (.154, .102)], SKIN, sub=1, name="cadera")
    skirt(P, BLUE, 1.02, .66, .182, .130, .252, .186, name="tunica")
    skirt(P, CREAM, 1.02, .66, .182, .130, .252, .186, t0=.90, t1=1.0, thick=.010, name="ribete")
    skirt(P, GOLD, 1.02, .66, .182, .130, .252, .186, t0=.985, t1=1.0, thick=.012, name="orla")
    prim(col, P, "cyl", (0, 0, 1.032), (.190, .140, .048), GOLD, v=48)
    prim(col, P, "cyl", (0, -.142, 1.032), (.034, .034, .012), GOLD, rot=(math.pi / 2, 0, 0), v=24)
    prim(col, P, "cyl", (0, -.1495, 1.032), (.022, .022, .008), BLUE, rot=(math.pi / 2, 0, 0), v=24)
    bpy.context.view_layer.update()


# ======================================================================
# TORSO: pectorales, abdomen, banda de cuero y bolsa con papiro
# ======================================================================
def torso_b(P):
    pts = [V(0, 0, r[0]) for r in TORSO]
    loft(col, P, pts, [r[1:] for r in TORSO], SKIN, seg=28, sub=1, cap=(True, True), name="torso")
    # banda de cuero en diagonal (hombro derecho -> cadera izquierda)
    pts, rad = [], []
    for i in range(9):
        t = i / 8
        z = 1.505 - 0.485 * t
        x = .150 - .335 * t
        pts.append(V(x, front_y(z) - .005, z))
        rad.append((.0165, .0045))
    loft(col, P, pts, rad, LEATHER, seg=8, ref=(0, -1, 0), name="banda")
    prim(col, P, "sphere", (.150, front_y(1.505) - .008, 1.505), (.017, .007, .017), GOLD, seg=14, rings=8)  # hebilla
    fuse(P, .0062, 3, post=relief_torso)
    # bolsa en la cadera izquierda
    bx, by, bz = -.232, .070, 1.0
    prim(col, P, "cube", (bx, by, bz), (.052, .100, .112), LEATHER, smooth=False)
    prim(col, P, "cube", (bx - .003, by, bz + .054), (.058, .106, .036), LEATHER, rot=(0, -0.12, 0), smooth=False)
    prim(col, P, "sphere", (bx - .030, by - .040, bz + .036), (.006, .012, .014), GOLD, seg=10, rings=8)
    for i, dy in enumerate((-.024, 0.0, .026)):                                                          # rollos de papiro
        loft(col, P, [V(bx + .006 - i * .002, by + dy, bz + .052), V(bx + .006 - i * .002, by + dy, bz + .150)], [(.016, .016), (.016, .016)], CREAM, seg=14, ref=(0, -1, 0), name="papiro")
        prim(col, P, "torus", (bx + .006 - i * .002, by + dy, bz + .150), (.016, .016, .016), WING, minor=0.22, seg=18)
    bpy.context.view_layer.update()


# ======================================================================
# CABEZA: rostro, cabello rizado, petaso con alas
# ======================================================================
HEAD = [  # z, rx, ry, ox, oy
    (1.598, .028, .035, 0, -.045), (1.612, .048, .059, 0, -.039), (1.635, .066, .0765, 0, -.0245),
    (1.665, .083, .091, 0, -.009), (1.700, .092, .100, 0, 0), (1.735, .094, .102, 0, .003),
    (1.770, .088, .0925, 0, .0075), (1.800, .066, .066, 0, .016), (1.818, .036, .0325, 0, .0175),
]


def head_b(P):
    # cuello
    loft(col, P, [V(0, 0, z) for z in (1.49, 1.54, 1.60)], [(.066, .066, 0, .010), (.056, .060, 0, .012), (.052, .056, 0, .004)], SKIN, sub=1, name="cuello")
    loft(col, P, [V(0, 0, r[0]) for r in HEAD], [r[1:] for r in HEAD], SKIN, seg=28, sub=1, name="craneo")
    # nariz
    loft(col, P, [V(0, -.098, 1.722), V(0, -.109, 1.696), V(0, -.121, 1.670)], [(.0085, .0085), (.0110, .0110), (.0140, .0135)], SKIN, ref=(1, 0, 0), sub=1, name="nariz")
    blob(col, P, (0, -.1235, 1.6665), (.0125, .0125, .0115), SKIN, seg=14, rings=10)
    for sx in (-1, 1):
        blob(col, P, (sx * .0135, -.1135, 1.6645), (.0095, .0095, .0090), SKIN, seg=12, rings=8)         # alas de la nariz
        # ojos
        blob(col, P, (sx * .0375, -.0925, 1.7085), (.0140, .0100, .0098), EYEW, seg=16, rings=12)
        blob(col, P, (sx * .0375, -.1022, 1.7085), (.0068, .0030, .0068), IRIS, seg=14, rings=10)
        blob(col, P, (sx * .0375, -.1048, 1.7085), (.0034, .0016, .0034), PUPIL, seg=10, rings=8)
        blob(col, P, (sx * .0375, -.0955, 1.7172), (.0158, .0108, .0070), SKIN, seg=16, rings=10)       # párpado superior
        blob(col, P, (sx * .0375, -.0945, 1.7005), (.0150, .0100, .0052), SKIN, seg=16, rings=10)        # párpado inferior
        # cejas
        path_tube(col, P, [V(sx * .012, -.101, 1.7345), V(sx * .035, -.1045, 1.7395), V(sx * .060, -.0995, 1.7350), V(sx * .074, -.0905, 1.7270)],
                  .0050, .0030, BROW, seg=8, ref=(0, 0, 1), name="ceja")
        # orejas
        blob(col, P, (sx * .0935, .012, 1.690), (.0105, .0195, .0310), SKIN, rot=(0, 0, sx * 0.15), seg=16, rings=12)
        # pómulos
        blob(col, P, (sx * .054, -.073, 1.682), (.020, .0075, .015), SKIN, seg=14, rings=10)
    # boca y mentón
    path_tube(col, P, [V(-.026, -.0955, 1.6395), V(-.012, -.1035, 1.6425), V(0, -.1055, 1.6405), V(.012, -.1035, 1.6425), V(.026, -.0955, 1.6395)],
              .0050, .0050, LIP, seg=10, ref=(0, 0, 1), name="labio_sup")
    path_tube(col, P, [V(-.022, -.0965, 1.6305), V(-.010, -.1040, 1.6275), V(.010, -.1040, 1.6275), V(.022, -.0965, 1.6305)],
              .0058, .0058, LIP, seg=10, ref=(0, 0, 1), name="labio_inf")
    blob(col, P, (0, -.0985, 1.6115), (.0205, .0140, .0160), SKIN, seg=14, rings=10)
    # cabello rizado
    cx, cy, cz = 0.0, .006, 1.712
    ax, ay, az = .097, .106, .104
    fuse(P, .0050, 3)
    for i in range(130):
        th = random.uniform(0, 2 * math.pi)
        ph = math.acos(random.uniform(0.18, 0.94))   # 0 = coronilla
        x = cx + ax * math.sin(ph) * math.cos(th)
        y = cy + ay * math.sin(ph) * math.sin(th)
        z = cz + az * math.cos(ph)
        if y < -.03 and z < 1.745:      # despeja la frente y la cara
            continue
        if z < 1.62 or z > 1.752:       # el petaso cubre la parte alta
            continue
        r = random.uniform(.020, .030)
        prim(col, P, "ico", (x * 1.04, y * 1.04, z * 1.0 + .004), (r, r, r * .95), HAIR, sub=1)
    for sx in (-1, 1):                    # patillas y rizos sobre las orejas
        prim(col, P, "ico", (sx * .088, -.012, 1.690), (.012, .020, .030), HAIR, sub=1)
        for dz, dy in ((.0, -.02), (.03, .0), (.055, -.015)):
            prim(col, P, "ico", (sx * .098, dy, 1.700 + dz), (.016, .020, .018), HAIR, sub=1)
    # petaso: casquete ajustado con reborde fino y alas grandes que barren hacia atrás
    loft(col, P, [V(0, .004, z) for z in (1.742, 1.772, 1.815, 1.862, 1.898, 1.916)],
         [(.101, .109), (.105, .113), (.100, .108), (.082, .090), (.050, .056), (.016, .018)], HAT, seg=40, sub=1, name="copa")
    prim(col, P, "torus", (0, .004, 1.746), (.1035, .1115, .1035), HAT, minor=0.040, seg=56)
    prim(col, P, "torus", (0, .004, 1.762), (.1050, .1130, .1050), GOLD, minor=0.030, seg=48)
    blob(col, P, (0, -.103, 1.790), (.020, .008, .024), GOLD, seg=16, rings=10)            # emblema frontal
    for sx in (-1, 1):
        blob(col, P, (sx * .1005, .016, 1.808), (.017, .020, .017), GOLD, seg=14, rings=10)    # cubo del ala
        wings = ((.22, .22, .90, .34, .038), (.40, .30, .80, .32, .038), (.58, .36, .66, .29, .036),
                 (.76, .40, .46, .25, .033), (.88, .42, .26, .20, .029))
        for i, (dx, dy, dz, ln, w) in enumerate(wings):
            feather(col, P, (sx * .100, .016 + i * .002, 1.808 - i * .005), (sx * dx, dy, dz), ln, w, .13 - i * .012, (0, 1, 0), WING, thick=.0045, n=10, name="pluma")
    bpy.context.view_layer.update()


# ======================================================================
# BRAZOS Y ANTEBRAZOS (con manos; el izquierdo lleva el caduceo)
# ======================================================================
def arm_b(sx):
    def f(P):
        s, e = V(sx * X_SH, 0, 1.47), V(sx * X_EL, 0, 1.19)
        blob(col, P, (sx * (X_SH + .004), 0, 1.462), (.057, .055, .062), SKIN, seg=22, rings=16)                        # deltoides
        tube(col, P, s, e, [(0, .050, .049), (.15, .056, .056), (.35, .054, .055), (.70, .046, .047), (1, .040, .041)], SKIN, sub=1, name="brazo")
        a, b = s.lerp(e, .50), s.lerp(e, .67)
        tube(col, P, a, b, [(0, .056, .056), (.5, .060, .060), (1, .056, .056)], GOLD, sub=1, name="brazalete")
        fuse(P, .0080)
    return f


def hand_open(P, sx):
    wrist = V(sx * X_WR, 0, .936)
    tube(col, P, wrist, V(sx * X_HA, 0, .864), [(0, .022, .030), (.3, .018, .038), (1, .015, .036)], SKIN, sub=1, name="palma")
    lens = {-.027: .070, -.009: .078, .009: .074, .027: .060}
    for y, L in lens.items():
        pts = [V(sx * X_HA, y, .868)]
        angs = (0.10, 0.28, 0.50)
        for a_, f_ in zip(angs, (.46, .30, .24)):
            d = V(-sx * math.sin(a_), 0, -math.cos(a_))
            pts.append(pts[-1] + d * (L * f_))
        path_tube(col, P, pts, .0090, .0058, SKIN, seg=8, ref=(0, -1, 0), name="dedo", taper=lambda t: .0092 - .0036 * t)
    th = [V(sx * X_WR, -.030, .906), V(sx * (X_WR - .006), -.044, .880), V(sx * (X_WR - .012), -.050, .850)]
    path_tube(col, P, th, .0120, .0075, SKIN, seg=8, ref=(0, 0, 1), name="pulgar")


def hand_fist(P, sx, C=V(X_HA + .010, -.020, 0)):
    tube(col, P, V(sx * X_WR, 0, .936), V(sx * X_HA, 0, .864), [(0, .022, .030), (.3, .019, .040), (1, .017, .038)], SKIN, sub=1, name="palma")
    for i, z in enumerate((.905, .882, .859, .836)):
        pts = []
        for k in range(7):
            th = math.radians(172 + 28 * k)
            r_ = .0245
            pts.append(V(C.x + r_ * math.cos(th), C.y + r_ * math.sin(th), z - .0035 * k / 6))
        path_tube(col, P, pts, .0095, .0078, SKIN, seg=8, ref=(0, 0, 1), name="dedo_puno", taper=lambda t: .0098 - .0026 * t)
    pts = [V(C.x - .020, C.y - .008, .925 + 0.004 * k) for k in range(1)]
    pts = []
    for k in range(6):
        th = math.radians(200 + 20 * k)
        pts.append(V(C.x + .027 * math.cos(th), C.y + .027 * math.sin(th), .926 - .003 * k))
    path_tube(col, P, pts, .0125, .0095, SKIN, seg=8, ref=(0, 0, 1), name="pulgar_puno")


def caduceo(P, C=V(X_HA + .010, -.020, 0)):
    top = 1.80
    path_tube(col, P, [V(C.x, C.y, z) for z in (.30, .70, 1.10, 1.50, top)], .0125, .0105, STAFF, seg=14, ref=(0, -1, 0), name="vara")
    for z in (1.20, 1.245):
        prim(col, P, "torus", (C.x, C.y, z), (.0200, .0200, .0200), GOLD, minor=0.20, seg=24)
    prim(col, P, "sphere", (C.x, C.y, top + .020), (.0230, .0230, .0230), GOLD, seg=16, rings=12)
    for s in (0.0, math.pi):
        pts = []
        for i in range(48):
            t = i / 47
            ang = s + 4 * math.pi * t
            r_ = .0245 + .002 * math.sin(6 * t)
            pts.append(V(C.x + r_ * math.cos(ang), C.y + r_ * math.sin(ang), 1.26 + .50 * t))
        path_tube(col, P, pts, .0090, .0070, GOLD, seg=10, ref=(0, 0, 1), name="serpiente", taper=lambda t: .0086 - .0020 * t)
        e = pts[-1]
        blob(col, P, (e.x, e.y, e.z + .004), (.0100, .0140, .0090), GOLD, seg=12, rings=8)
    for sx_ in (-1, 1):
        for i, (ang, ln, w) in enumerate(((8, .095, .0145), (24, .105, .0155), (40, .098, .0150), (56, .082, .0135), (72, .062, .0120))):
            a = math.radians(ang)
            feather(col, P, (C.x + sx_ * .010, C.y, top + .006 + i * .006), (sx_ * math.cos(a), 0, math.sin(a) * .8), ln, w, -.012, (0, 1, 0), WING, thick=.0030, name="pluma_cad")


def forearm_b(sx, side):
    def f(P):
        e, wr = V(sx * X_EL, 0, 1.19), V(sx * X_WR, 0, .936)
        blob(col, P, (sx * X_EL, 0, 1.19), (.043, .043, .043), SKIN, seg=16, rings=12)
        tube(col, P, e, wr, [(0, .040, .041), (.12, .045, .047), (.30, .046, .048), (.70, .034, .034), (1, .027, .025)], SKIN, sub=1, name="antebrazo")
        if side == "L":
            hand_fist(P, sx)
        else:
            hand_open(P, sx)
        fuse(P, .0055, 2)
        a, b = e.lerp(wr, .40), e.lerp(wr, .90)
        tube(col, P, a, b, [(0, .0475, .0495), (.5, .0390, .0405), (1, .0295, .0285)], LEATHER, sub=0, name="muñequera")
        for t in (.40, .62, .90):
            c = e.lerp(wr, t)
            r_ = {.40: .0505, .62: .0405, .90: .0310}[t]
            prim(col, P, "torus", (c.x, c.y, c.z), (r_, r_, r_), GOLD, minor=0.07, seg=24)
        if side == "L":
            caduceo(P)
        bpy.context.view_layer.update()
    return f


# ======================================================================
# PIERNAS: muslo, rodilla, pantorrilla, pie con sandalia, greba dorada y alas
# ======================================================================
def leg_b(sx):
    def f(P):
        tube(col, P, V(sx * .10, 0, .96), V(sx * .10, 0, .52),
             [(0, .090, .092), (.10, .098, .100), (.30, .095, .098), (.62, .078, .082), (.88, .060, .064), (1, .056, .060)], SKIN, sub=1, name="muslo")
        fuse(P, .0080)
    return f


def shin_b(sx):
    def f(P):
        x = sx * .10
        blob(col, P, (x, -.040, .527), (.040, .030, .044), SKIN, seg=16, rings=12)
        tube(col, P, V(x, 0, .52), V(x, 0, .092),
             [(0, .056, .060), (.08, .058, .063), (.26, .060, .070, 0, .012), (.55, .049, .054, 0, .006), (.85, .037, .040), (1, .034, .036)], SKIN, sub=1, name="pantorrilla")
        # pie
        yz = [(.058, .052), (.010, .046), (-.050, .036), (-.110, .026), (-.168, .018)]
        rr = [(.030, .040), (.036, .040), (.042, .031), (.046, .023), (.040, .016)]
        loft(col, P, [V(x, y, z) for y, z in yz], rr, SKIN, seg=18, ref=(0, 0, 1), sub=1, name="pie")
        for i, (off, sz) in enumerate(((.030, .0115), (.015, .0095), (0.0, .0085), (-.013, .0075), (-.025, .0065))):
            blob(col, P, (x - sx * off, -.1785 - i * .0008, .0125), (sz, sz * 1.25, sz * .95), SKIN, seg=10, rings=8)
        fuse(P, .0055, 2)
        # sandalia
        loft(col, P, [V(x, y, .0065) for y in (.066, .010, -.060, -.120, -.192)], [(.034, .007), (.042, .007), (.048, .007), (.051, .007), (.044, .007)],
             LEATHER, seg=16, ref=(0, 0, 1), name="suela")
        for (y, zc, ax_, az_) in ((.008, .052, .040, .046), (-.050, .034, .048, .037), (-.108, .027, .050, .029)):
            pts = [V(x + ax_ * math.cos(math.radians(a)), y, zc + az_ * math.sin(math.radians(a))) for a in range(0, 181, 20)]
            path_tube(col, P, pts, .0036, .0036, LEATHER, seg=8, ref=(0, 1, 0), name="correa")
        prim(col, P, "torus", (x, .002, .104), (.0405, .0405, .0405), LEATHER, minor=0.12, seg=28)
        prim(col, P, "sphere", (x, -.040, .106), (.0085, .0050, .0085), GOLD, seg=10, rings=8)
        prim(col, P, "torus", (x, .002, .118), (.0395, .0395, .0395), GOLD, minor=0.10, seg=28)
        # alas del tobillo
        for s_ in (-1, 1):
            for i, (dxx, dyy, dzz, ln, w) in enumerate(((.25, .90, .45, .115, .021), (.18, .78, .62, .125, .023), (.10, .62, .78, .105, .020))):
                feather(col, P, (x + s_ * .044, .030 + i * .004, .112 + i * .010), (s_ * dxx, dyy, dzz), ln, w, -.012, (s_, 0, 0), WING, thick=.0028, name="ala_tobillo")
        # greba dorada y adornos
        tube(col, P, V(x, 0, .500), V(x, 0, .132),
             [(0, .0585, .063), (.10, .0610, .067), (.40, .0620, .072, 0, .010), (.70, .0500, .054, 0, .005), (.92, .0390, .042), (1, .0372, .040)], GOLD, sub=1, name="greba")
        path_tube(col, P, [V(x, -.067, .492), V(x, -.073, .40), V(x, -.062, .28), V(x, -.050, .16)], .0050, .0040, GOLD, seg=8, ref=(1, 0, 0), name="cresta")
        prim(col, P, "torus", (x, -.072, .532), (.030, .030, .030), GOLD, minor=0.26, seg=28, rot=(math.pi / 2, 0, 0))
        prim(col, P, "sphere", (x, -.0775, .532), (.0085, .0050, .0085), GOLD, seg=10, rings=8)
        bpy.context.view_layer.update()
    return f


# ======================================================================
# CAPA
# ======================================================================
def cape_b(P):
    rows, colsn = 26, 17

    def fn(i, j):
        t = i / (rows - 1)
        u = j / (colsn - 1) * 2 - 1
        z = 1.505 - t * 1.050
        w = .165 + .275 * t ** 0.85
        x = u * w
        y = .108 + .095 * t + .040 * t * (1 - u * u)
        y += .030 * t * math.sin(u * math.pi * 3.3 + t * 2.2)
        return (x, y, z)
    sheet(col, P, rows, colsn, fn, BLUE, thickness=.007, name="capa")
    blob(col, P, (0, .040, 1.500), (.100, .066, .030), BLUE, seg=24, rings=16)
    blob(col, P, (-.118, -.060, 1.495), (.020, .006, .020), GOLD, seg=16, rings=10)
    bpy.context.view_layer.update()


# ======================================================================
# ENSAMBLE
# ======================================================================
build_extra = None
PREFIX = "hermes__"
objs = {}
root = emp(col, "root", (0, 0, 0))
objs["root"] = root
objs["pelvis"] = part(col, "pelvis", (0, 0, 0.98), pelvis_b)
objs["torso"] = part(col, "torso", (0, 0, 1.05), torso_b)
objs["head"] = part(col, "head", (0, 0, 1.52), head_b)
for s, sx in SIDES.items():
    objs["arm_" + s] = part(col, "arm_" + s, (sx * X_SH, 0, 1.47), arm_b(sx))
    objs["forearm_" + s] = part(col, "forearm_" + s, (sx * X_EL, 0, 1.19), forearm_b(sx, s))
    objs["hand_" + s] = emp(col, "hand_" + s, (sx * (X_HA + .003), 0, .86))
    objs["leg_" + s] = part(col, "leg_" + s, (sx * .10, 0, .96), leg_b(sx))
    objs["shin_" + s] = part(col, "shin_" + s, (sx * .10, 0, .52), shin_b(sx))
objs["cape"] = part(col, "cape", (0, .08, 1.50), cape_b)

# la cabeza algo más grande: proporciones más heroicas
h_ = objs["head"]
h_.scale = (1.12, 1.12, 1.12)
bpy.context.view_layer.objects.active = h_
h_.select_set(True)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
h_.select_set(False)
adopt(objs["pelvis"], root)
adopt(objs["torso"], objs["pelvis"])
adopt(objs["head"], objs["torso"])
adopt(objs["cape"], objs["torso"])
for s in ("L", "R"):
    adopt(objs["arm_" + s], objs["torso"])
    adopt(objs["forearm_" + s], objs["arm_" + s])
    adopt(objs["hand_" + s], objs["forearm_" + s])
    adopt(objs["leg_" + s], objs["pelvis"])
    adopt(objs["shin_" + s], objs["leg_" + s])

# suavizado final de las piezas (la capa y las plumas ya son suaves por construcción)
export_hierarchy(col, "hermes.glb")

names = [o.name for o in col.objects if o.type == "MESH"]
preview(names, {"frente": (0, -4.4, 1.0), "tres_cuartos": (-2.9, -3.3, 1.3), "lado": (4.2, 0.0, 1.0), "atras": (2.6, 3.5, 1.3)}, (0, 0, .95), "hermes", res=(700, 950))
preview(names, {"cabeza": (-0.55, -1.15, 1.80), "cabeza_frente": (0, -1.1, 1.72)}, (0, 0, 1.70), "hermes_cabeza", res=(800, 800))
preview(names, {"manos": (.95, -1.15, .95), "pies": (-.75, -1.0, .35)}, (.0, 0, .55), "hermes_det", res=(800, 800))

for o in sorted([o for o in col.objects if o.type == "MESH"], key=lambda o: -len(o.data.vertices))[:8]:
    print("VERTS", o.name, len(o.data.vertices))
preview(names, {"torso": (0.0, -1.3, 1.30), "torso_3q": (-0.8, -1.1, 1.35)}, (0, 0, 1.28), "hermes_torso", res=(800, 800))
