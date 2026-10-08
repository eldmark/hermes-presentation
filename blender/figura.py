"""Sistema de figuras humanas con articulaciones como nodos con nombre.

Convenciones (Blender): frente = -Y, de pie sobre z=0, ~1,8 m. «R» es la derecha del personaje (x negativo)
y «L» la izquierda (x positivo). En three.js el modelo mira hacia +Z.
Nodos exportados: root > pelvis > torso > (head, arm_L > forearm_L > hand_L, arm_R > forearm_R > hand_R, cape?)
y pelvis > (leg_L > shin_L, leg_R > shin_R). `hand_L` y `hand_R` son empties para sujetar objetos.
"""
exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/lib.py").read())
from mathutils import Matrix
import json, struct, re

PREFIX = ""   # evita choques de nombres entre personajes; se quita del .glb al exportar


def part(col, name, pivot, build):
    """build(parts) crea primitivas en coordenadas de mundo; se unen y el origen pasa al pivote."""
    parts = []
    build(parts)
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    if len(parts) > 1:
        bpy.ops.object.join()
    obj = bpy.context.active_object
    bpy.ops.object.transform_apply(location=True)
    obj.name = PREFIX + name
    obj.data.name = PREFIX + name
    obj.data.transform(Matrix.Translation(-Vector(pivot)))
    obj.location = pivot
    return obj


def emp(col, name, loc):
    o = bpy.data.objects.new(PREFIX + name, None)
    o.location = loc
    col.objects.link(o)
    return o


def adopt(child, par):
    bpy.context.view_layer.update()
    child.parent = par
    child.matrix_parent_inverse = par.matrix_world.inverted()


def limb(col, parts, p1, p2, r1, r2, m, v=12):
    a, b = Vector(p1), Vector(p2)
    d = b - a
    rot = d.to_track_quat("Z", "Y").to_euler()
    return prim(col, parts, "cone", tuple((a + b) / 2), (r1, r1, d.length), m, rot=tuple(rot), v=v, r2=r2 / r1)


def lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def build_figure(col, name, skin, base_cloth, extras=None, hair=None):
    """Crea la figura con jerarquía. `extras`: {nombre_de_pieza: fn(parts, ctx)} añade ropa/accesorios.
    Devuelve dict nombre → objeto."""
    global PREFIX
    PREFIX = name + "__"
    extras = extras or {}
    DARK = mat(name + "_oscuro", (0.05, 0.04, 0.04), 0.5)
    SK = mat(name + "_piel", skin, 0.7)
    CL = mat(name + "_tela_base", base_cloth, 0.8)
    ctx = dict(skin=SK, cloth=CL, dark=DARK, col=col)
    H = {"R": -1, "L": 1}
    objs = {}

    def ex(nm, parts):
        if nm in extras:
            extras[nm](parts, ctx)

    root = emp(col, "root", (0, 0, 0))
    objs["root"] = root

    def pelvis(parts):
        prim(col, parts, "sphere", (0, 0, 1.0), (0.20, 0.13, 0.12), CL, seg=14, rings=8)
        ex("pelvis", parts)
    objs["pelvis"] = part(col, "pelvis", (0, 0, 0.98), pelvis)

    def torso(parts):
        prim(col, parts, "sphere", (0, 0, 1.31), (0.21, 0.125, 0.26), SK, seg=16, rings=10)
        prim(col, parts, "cyl", (0, 0, 1.12), (0.17, 0.11, 0.16), SK, v=14)
        ex("torso", parts)
    objs["torso"] = part(col, "torso", (0, 0, 1.05), torso)

    def head(parts):
        prim(col, parts, "cyl", (0, 0, 1.57), (0.055, 0.055, 0.10), SK, v=10)
        prim(col, parts, "sphere", (0, 0, 1.69), (0.105, 0.115, 0.125), SK, seg=16, rings=12)
        prim(col, parts, "cone", (0, -0.118, 1.67), (0.022, 0.022, 0.05), SK, rot=(PI / 2, 0, 0), v=8, r2=0.5)
        for sx in (-1, 1):
            prim(col, parts, "sphere", (sx * 0.042, -0.108, 1.70), (0.012, 0.008, 0.012), DARK, seg=8, rings=6)
            prim(col, parts, "sphere", (sx * 0.106, 0.0, 1.68), (0.012, 0.025, 0.035), SK, seg=8, rings=6)
        ex("head", parts)
    objs["head"] = part(col, "head", (0, 0, 1.52), head)

    for s, sx in H.items():
        def arm(parts, sx=sx, s=s):
            prim(col, parts, "sphere", (sx * 0.235, 0, 1.47), (0.075, 0.075, 0.075), SK, seg=12, rings=8)
            limb(col, parts, (sx * 0.235, 0, 1.47), (sx * 0.25, 0, 1.19), 0.062, 0.052, SK)
            ex("arm_" + s, parts)
        objs["arm_" + s] = part(col, "arm_" + s, (sx * 0.235, 0, 1.47), arm)

        def forearm(parts, sx=sx, s=s):
            prim(col, parts, "sphere", (sx * 0.25, 0, 1.19), (0.052, 0.052, 0.052), SK, seg=10, rings=8)
            limb(col, parts, (sx * 0.25, 0, 1.19), (sx * 0.26, 0, 0.93), 0.05, 0.04, SK)
            prim(col, parts, "sphere", (sx * 0.265, 0, 0.88), (0.045, 0.034, 0.058), SK, seg=10, rings=8)
            ex("forearm_" + s, parts)
        objs["forearm_" + s] = part(col, "forearm_" + s, (sx * 0.25, 0, 1.19), forearm)
        objs["hand_" + s] = emp(col, "hand_" + s, (sx * 0.265, 0, 0.86))

        def leg(parts, sx=sx, s=s):
            limb(col, parts, (sx * 0.10, 0, 0.96), (sx * 0.10, 0, 0.52), 0.095, 0.07, SK)
            ex("leg_" + s, parts)
        objs["leg_" + s] = part(col, "leg_" + s, (sx * 0.10, 0, 0.96), leg)

        def shin(parts, sx=sx, s=s):
            prim(col, parts, "sphere", (sx * 0.10, 0, 0.52), (0.07, 0.07, 0.07), SK, seg=10, rings=8)
            limb(col, parts, (sx * 0.10, 0, 0.52), (sx * 0.10, 0, 0.09), 0.065, 0.045, SK)
            prim(col, parts, "sphere", (sx * 0.10, -0.06, 0.05), (0.055, 0.12, 0.045), SK, seg=10, rings=8)
            ex("shin_" + s, parts)
        objs["shin_" + s] = part(col, "shin_" + s, (sx * 0.10, 0, 0.52), shin)

    if "cape" in extras:
        objs["cape"] = part(col, "cape", (0, 0.08, 1.50), lambda parts: ex("cape", parts))

    # jerarquía
    adopt(objs["pelvis"], root)
    adopt(objs["torso"], objs["pelvis"])
    adopt(objs["head"], objs["torso"])
    if "cape" in objs:
        adopt(objs["cape"], objs["torso"])
    for s in ("L", "R"):
        adopt(objs["arm_" + s], objs["torso"])
        adopt(objs["forearm_" + s], objs["arm_" + s])
        adopt(objs["hand_" + s], objs["forearm_" + s])
        adopt(objs["leg_" + s], objs["pelvis"])
        adopt(objs["shin_" + s], objs["leg_" + s])
    return objs


def export_hierarchy(col, filename):
    bpy.ops.object.select_all(action="DESELECT")
    for o in col.objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = col.objects[0]
    out = BASE + filename
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=True, export_apply=True, export_yup=True)
    fix_glb_names(out)
    nverts = sum(len(o.data.vertices) for o in col.objects if o.type == "MESH")
    print("OK", filename, os.path.getsize(out), "bytes; piezas:", len(col.objects), "vértices:", nverts)


def fix_glb_names(path):
    """Quita el prefijo «personaje__» y sufijos «.001» de los nombres de nodo/malla del .glb."""
    data = open(path, "rb").read()
    magic, ver, total = struct.unpack("<4sII", data[:12])
    jlen, jtype = struct.unpack("<I4s", data[12:20])
    js = json.loads(data[20:20 + jlen].decode("utf-8"))
    clean = lambda n: re.sub(r"\.\d{3}$", "", n.split("__", 1)[-1])
    for key in ("nodes", "meshes"):
        for item in js.get(key, []):
            if "name" in item:
                item["name"] = clean(item["name"])
    raw = json.dumps(js, separators=(",", ":")).encode("utf-8")
    raw += b" " * ((4 - len(raw) % 4) % 4)
    rest = data[20 + jlen:]
    out = struct.pack("<4sII", magic, ver, 12 + 8 + len(raw) + len(rest)) + struct.pack("<I4s", len(raw), jtype) + raw + rest
    open(path, "wb").write(out)
