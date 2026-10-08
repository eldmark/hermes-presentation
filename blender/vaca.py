import bpy, os, math

OUT = "/home/dmark123/Documents/homework/mitologia/hermes_presentation/public/models/ganado.glb"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Colección propia: no se toca nada de lo que ya existe en la escena.
name = "ganado"
if name in bpy.data.collections:
    old = bpy.data.collections[name]
    for o in list(old.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.collections.remove(old)
col = bpy.data.collections.new(name)
bpy.context.scene.collection.children.link(col)

def mat(nm, rgb, rough=0.8):
    m = bpy.data.materials.get(nm) or bpy.data.materials.new(nm)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    return m

CREAM = mat("vaca_crema", (0.92, 0.86, 0.74))
BROWN = mat("vaca_manchas", (0.30, 0.17, 0.09))
PINK = mat("vaca_hocico", (0.86, 0.58, 0.55), 0.6)
DARK = mat("vaca_oscuro", (0.08, 0.06, 0.05), 0.5)
HORN = mat("vaca_cuerno", (0.88, 0.84, 0.72), 0.5)

parts = []

def add(kind, loc, scale, material, rot=(0, 0, 0), smooth=True, **kw):
    if kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=1, location=loc, rotation=rot, **kw)
    elif kind == "cyl":
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=1, depth=1, location=loc, rotation=rot, **kw)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=1, radius2=0.1, depth=1, location=loc, rotation=rot, **kw)
    else:
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot, **kw)
    o = bpy.context.active_object
    o.scale = scale
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    o.data.materials.append(material)
    if smooth:
        bpy.ops.object.shade_smooth()
    for c in o.users_collection:
        c.objects.unlink(o)
    col.objects.link(o)
    parts.append(o)
    return o

# Convención: pies en z=0, frente hacia -Y de Blender (= +Z en glTF).
# Cuerpo
add("sphere", (0, 0.0, 1.05), (0.50, 0.95, 0.46), CREAM)            # tronco
add("sphere", (0, 0.55, 1.12), (0.46, 0.55, 0.44), CREAM)           # anca
add("sphere", (0, -0.55, 1.15), (0.44, 0.50, 0.44), CREAM)          # pecho
# Cabeza (hacia -Y)
add("sphere", (0, -1.20, 1.28), (0.27, 0.36, 0.26), CREAM)          # cráneo
add("sphere", (0, -1.50, 1.18), (0.19, 0.24, 0.17), PINK)           # hocico
add("sphere", (-0.07, -1.72, 1.20), (0.035, 0.03, 0.03), DARK)      # narina
add("sphere", (0.07, -1.72, 1.20), (0.035, 0.03, 0.03), DARK)
add("sphere", (-0.2, -1.12, 1.36), (0.04, 0.04, 0.04), DARK)        # ojos
add("sphere", (0.2, -1.12, 1.36), (0.04, 0.04, 0.04), DARK)
# Orejas
add("sphere", (-0.34, -1.05, 1.36), (0.13, 0.05, 0.07), CREAM, rot=(0, 0, math.radians(-20)))
add("sphere", (0.34, -1.05, 1.36), (0.13, 0.05, 0.07), CREAM, rot=(0, 0, math.radians(20)))
# Cuernos
add("cone", (-0.23, -1.12, 1.52), (0.05, 0.05, 0.22), HORN, rot=(0, math.radians(-35), 0))
add("cone", (0.23, -1.12, 1.52), (0.05, 0.05, 0.22), HORN, rot=(0, math.radians(35), 0))
# Patas
for sx in (-1, 1):
    for y in (-0.62, 0.62):
        add("cyl", (sx * 0.27, y, 0.38), (0.10, 0.10, 0.76), CREAM)
        add("cyl", (sx * 0.27, y, 0.04), (0.115, 0.115, 0.10), DARK)  # pezuña
# Ubre
add("sphere", (0, 0.55, 0.72), (0.17, 0.22, 0.13), PINK)
# Cola
add("cyl", (0, 1.50, 1.05), (0.03, 0.03, 0.75), CREAM, rot=(math.radians(18), 0, 0))
add("sphere", (0, 1.58, 0.66), (0.07, 0.07, 0.13), DARK)
# Manchas
add("sphere", (0.28, 0.1, 1.35), (0.28, 0.40, 0.18), BROWN)
add("sphere", (-0.32, 0.45, 1.20), (0.22, 0.34, 0.28), BROWN)
add("sphere", (-0.18, -0.50, 1.43), (0.22, 0.26, 0.12), BROWN)
add("sphere", (0.0, -1.22, 1.50), (0.12, 0.14, 0.05), BROWN)

# Unir y limpiar
bpy.ops.object.select_all(action="DESELECT")
for o in parts:
    o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
cow = bpy.context.active_object
cow.name = "ganado"
bpy.ops.object.origin_set(type="ORIGIN_CURSOR") if False else None
cow.location = (0, 0, 0)

bpy.ops.object.select_all(action="DESELECT")
cow.select_set(True)
bpy.context.view_layer.objects.active = cow
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
)
size = os.path.getsize(OUT)
print("OK", OUT, size, "bytes; vertices:", len(cow.data.vertices))
