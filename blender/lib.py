import bpy, os, math
from mathutils import Vector

BASE = "/home/dmark123/Documents/homework/mitologia/hermes_presentation/public/models/"
PREV = "/home/dmark123/Documents/homework/mitologia/hermes_presentation/blender/previews/"
os.makedirs(BASE, exist_ok=True)
os.makedirs(PREV, exist_ok=True)
PI = math.pi


def new_col(name):
    """Colección propia (se recrea si ya existía). No toca el resto de la escena."""
    if name in bpy.data.collections:
        old = bpy.data.collections[name]
        for o in list(old.objects):
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.collections.remove(old)
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col


def mat(nm, rgb, rough=0.8, metal=0.0):
    m = bpy.data.materials.get(nm) or bpy.data.materials.new(nm)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    m.diffuse_color = (*rgb, 1)  # para el render de revisión
    return m


def prim(col, parts, kind, loc, scale, material, rot=(0, 0, 0), smooth=True, **kw):
    if kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=kw.get("seg", 16), ring_count=kw.get("rings", 10), radius=1, location=loc, rotation=rot)
    elif kind == "ico":
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=kw.get("sub", 2), radius=1, location=loc, rotation=rot)
    elif kind == "cyl":
        bpy.ops.mesh.primitive_cylinder_add(vertices=kw.get("v", 12), radius=1, depth=1, location=loc, rotation=rot)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(vertices=kw.get("v", 12), radius1=1, radius2=kw.get("r2", 0.0), depth=1, location=loc, rotation=rot)
    elif kind == "torus":
        bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=kw.get("minor", 0.1), major_segments=kw.get("seg", 32), minor_segments=8, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = scale
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    o.data.materials.append(material)
    if smooth:
        bpy.ops.object.shade_smooth()
    else:
        bpy.ops.object.shade_flat()
    for c in list(o.users_collection):
        c.objects.unlink(o)
    col.objects.link(o)
    parts.append(o)
    return o


def box(col, parts, loc, size, material, rot=(0, 0, 0)):
    return prim(col, parts, "cube", loc, size, material, rot=rot, smooth=False)


def extrude_poly(col, parts, pts, thickness, material, loc=(0, 0, 0), plane="XZ"):
    """Polígono 2D (puede ser cóncavo) extruido: p.ej. un rayo. plane XZ: mira hacia -Y."""
    me = bpy.data.meshes.new("poly")
    if plane == "XZ":
        verts = [(x, 0, z) for x, z in pts]
    else:
        verts = [(x, y, 0) for x, y in pts]
    me.from_pydata(verts, [], [list(range(len(verts)))])
    me.update()
    o = bpy.data.objects.new("poly", me)
    col.objects.link(o)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    md = o.modifiers.new("solid", "SOLIDIFY")
    md.thickness = thickness
    md.offset = 0
    bpy.ops.object.modifier_apply(modifier="solid")
    o.location = loc
    bpy.ops.object.transform_apply(location=True)
    o.data.materials.append(material)
    parts.append(o)
    return o


def finish(col, parts, name, filename):
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name
    out = BASE + filename
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=True, export_apply=True, export_yup=True)
    print("OK", filename, os.path.getsize(out), "bytes; vértices:", len(obj.data.vertices))
    return obj


def preview(target_names, views, center, tag, res=(900, 600)):
    """Renderiza los objetos indicados con colores de material; oculta el resto y restaura todo."""
    sc = bpy.context.scene
    saved = (sc.render.engine, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.camera)
    hidden = []
    for o in bpy.data.objects:
        if o.name not in target_names and o.type == "MESH" and not o.hide_render:
            hidden.append(o)
            o.hide_render = True
            o.hide_viewport = True
    cam = bpy.data.objects.new("tmp_cam", bpy.data.cameras.new("tmp_cam"))
    cam.data.clip_end = 1000
    sc.collection.objects.link(cam)
    sun = bpy.data.objects.new("tmp_sun", bpy.data.lights.new("tmp_sun", "SUN"))
    sun.data.energy = 3
    sun.rotation_euler = (math.radians(50), 0, math.radians(30))
    sc.collection.objects.link(sun)
    sc.render.engine = "BLENDER_WORKBENCH"
    sc.display.shading.light = "STUDIO"
    sc.display.shading.color_type = "MATERIAL"
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.camera = cam
    c = Vector(center)
    for nm, loc in views.items():
        cam.location = loc
        cam.rotation_euler = (c - cam.location).to_track_quat("-Z", "Y").to_euler()
        sc.render.filepath = PREV + "prev_%s_%s.png" % (tag, nm)
        bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam, do_unlink=True)
    bpy.data.objects.remove(sun, do_unlink=True)
    for o in hidden:
        o.hide_render = False
        o.hide_viewport = False
    sc.render.engine, sc.render.resolution_x, sc.render.resolution_y, sc.render.filepath, sc.camera = saved
    print("render", tag, "listo")
