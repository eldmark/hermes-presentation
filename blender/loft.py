"""Modelado orgánico por «lofting»: superficies suaves a partir de anillos elípticos a lo largo de una trayectoria.

Se usa sobre figura.py (que aporta bpy, math, Vector, new_col, mat, prim, part, emp, adopt, export_hierarchy).
"""
exec(open("/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/figura.py").read())
import bmesh


def _frames(pts, ref):
    ref = Vector(ref).normalized()
    out = []
    for i in range(len(pts)):
        a = pts[max(i - 1, 0)]
        b = pts[min(i + 1, len(pts) - 1)]
        T = (b - a).normalized()
        r = ref if abs(T.dot(ref)) < 0.95 else Vector((1, 0, 0))
        U = T.cross(r).normalized()      # eje del radio «rx»
        W = T.cross(U).normalized()      # eje del radio «ry»
        out.append((T, U, W))
    return out


def loft(col, parts, pts, radii, material, seg=20, ref=(0, -1, 0), cap=(True, True), sub=0, name="loft", smooth=True):
    """pts: puntos de la trayectoria. radii: (rx, ry[, ox, oy]) por punto; ox/oy desplazan el centro del anillo."""
    pts = [Vector(p) for p in pts]
    fr = _frames(pts, ref)
    bm = bmesh.new()
    rings = []
    for p, (T, U, W), r in zip(pts, fr, radii):
        rx, ry = r[0], r[1]
        ox = r[2] if len(r) > 2 else 0.0
        oy = r[3] if len(r) > 3 else 0.0
        ring = []
        for k in range(seg):
            a = 2 * math.pi * k / seg
            ring.append(bm.verts.new(p + U * (ox + rx * math.cos(a)) + W * (oy + ry * math.sin(a))))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for k in range(seg):
            k2 = (k + 1) % seg
            bm.faces.new((rings[i][k], rings[i][k2], rings[i + 1][k2], rings[i + 1][k]))
    if cap[0]:
        bm.faces.new(rings[0][::-1])
    if cap[1]:
        bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    col.objects.link(o)
    o.data.materials.append(material)
    for poly in me.polygons:
        poly.use_smooth = smooth
    bpy.context.view_layer.update()
    if sub > 0:
        md = o.modifiers.new("sub", "SUBSURF")
        md.levels = sub
        md.render_levels = sub
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.modifier_apply(modifier="sub")
        o.select_set(False)
    parts.append(o)
    return o


def tube(col, parts, p1, p2, prof, material, seg=20, sub=1, ref=(0, -1, 0), name="tube", cap=(True, True)):
    """Tubo entre p1 y p2 con un perfil [(t, rx, ry[, ox, oy]), ...] con t en 0..1."""
    a, b = Vector(p1), Vector(p2)
    pts = [a.lerp(b, e[0]) for e in prof]
    rad = [tuple(e[1:]) for e in prof]
    return loft(col, parts, pts, rad, material, seg=seg, ref=ref, sub=sub, name=name, cap=cap)


def path_tube(col, parts, pts, r0, r1, material, seg=10, sub=0, ref=(0, 0, 1), name="path", taper=None, cap=(True, True)):
    """Tubo de sección circular por una polilínea, con radio que va de r0 a r1 (o según taper(t))."""
    n = len(pts)
    rad = []
    for i in range(n):
        t = i / (n - 1) if n > 1 else 0
        r = taper(t) if taper else r0 + (r1 - r0) * t
        rad.append((r, r))
    return loft(col, parts, pts, rad, material, seg=seg, ref=ref, sub=sub, name=name, cap=cap)


def feather(col, parts, root, direction, length, width, curve, bend_axis, material, thick=0.004, n=7, name="feather"):
    """Pluma: hoja alargada que se estrecha, con curvatura hacia bend_axis. Su cara ancha mira a lo largo de `ref` ⟂ plano."""
    root = Vector(root)
    d = Vector(direction).normalized()
    ba = Vector(bend_axis).normalized()
    pts, rad = [], []
    for i in range(n):
        t = i / (n - 1)
        pts.append(root + d * (length * t) + ba * (curve * t * t))
        w = max(0.0012, width * (math.sin(math.pi * (0.22 + 0.76 * t)) ** 0.75))
        rad.append((w, thick))
    # el ancho va en el eje ⟂ a la dirección y a bend_axis; el grosor, a lo largo de bend_axis
    ref = ba
    return loft(col, parts, pts, rad, material, seg=8, ref=ref, sub=0, name=name)


def sheet(col, parts, rows, cols, fn, material, thickness=0.006, name="sheet"):
    """Malla de rejilla (rows × cols) con fn(i, j) -> (x, y, z); se engrosa con solidify."""
    bm = bmesh.new()
    vs = [[bm.verts.new(Vector(fn(i, j))) for j in range(cols)] for i in range(rows)]
    for i in range(rows - 1):
        for j in range(cols - 1):
            bm.faces.new((vs[i][j], vs[i][j + 1], vs[i + 1][j + 1], vs[i + 1][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    col.objects.link(o)
    o.data.materials.append(material)
    for poly in me.polygons:
        poly.use_smooth = True
    bpy.context.view_layer.update()
    md = o.modifiers.new("solid", "SOLIDIFY")
    md.thickness = thickness
    md.offset = 0
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.modifier_apply(modifier="solid")
    o.select_set(False)
    parts.append(o)
    return o


def blob(col, parts, center, scale, material, rot=(0, 0, 0), seg=20, rings=14):
    return prim(col, parts, "sphere", center, scale, material, rot=rot, seg=seg, rings=rings)
