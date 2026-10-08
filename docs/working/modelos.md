# Modelos 3D (Blender)

Los modelos se generan con scripts de `blender/` mediante el puente de Blender (puerto 9876, addon `blender-mcp`) y se exportan a `public/models/*.glb`. Se registran en `src/components/three/assets.ts` y se usan con `<Model name="…" fallback={…} scale yaw />`.

## Convenciones

- Origen en el suelo, en el centro de la pieza. Unidades en metros.
- El frente mira hacia **+Z** en three.js (en Blender es -Y). Para que mire hacia -Z usa `yaw={Math.PI}`.
- Estilo: formas limpias y colores planos, paleta mármol, azul y dorado (referencia: ilustración vectorial de Hermes).
- `Model` clona el glb una sola vez por instancia. `scale` y `yaw` solo afectan al modelo cargado; el `fallback` se dibuja tal cual.
- Si el glb falla o `ASSETS[name]` es `null`, se dibuja el `fallback` (el placeholder de formas simples).

## Catálogo

| Clave en `ASSETS` | Archivo | Medidas aproximadas (m) | Notas |
|---|---|---|---|
| `ganado` | `ganado.glb` | 3,3 de largo, 1,7 de alto | Mira hacia +Z. En la escena 4 se usa con `scale 0.5` y `yaw π`. |
| `arbol` | `arbol.glb` | 5 de alto, copa de ~4 de ancho | Olivo. |
| `cipres` | `cipres.glb` | 8 de alto, 2 de ancho | Ciprés. |
| `olimpo_marco` | `olimpo_puertas_marco.glb` | 12 de ancho, 12 de alto | Pilares en x=±4,2 (8,2 de alto), arquitrabe y frontón con sol dorado. El vano mide 8,4 de ancho. |
| `olimpo_hoja` | `olimpo_hoja.glb` | 4,2 de ancho, 7,6 de alto | Bisagra en x=0; se extiende hacia +x. Para la hoja derecha, ponla en x=+4,2 con `scale={[-1,1,1]}`. |
| `olimpo_columna` | `olimpo_columna.glb` | 6 de alto, ~1,6 de ancho | Columna jónica. |
| `olimpo_templo` | `olimpo_templo.glb` | 24 × 16 de planta, ~12 de alto | Plataforma con escalones al frente (+Z), medallón central, columnata y frontón al fondo (-Z), dos pebeteros. |
| `zeus` | `zeus.glb` | 16 × 14 de planta (escalones hasta 9 m al frente), ~19 de alto | Trono enorme con Zeus sentado (corona, barba larga, toga dorada, cetro a su izquierda y rayo a su derecha), halo solar y tachuelas doradas. Asiento a 3,9 m de altura, Zeus ~7 m sentado. Mira hacia +Z. |

### Objetos y escenarios adicionales

| Clave | Archivo | Medidas aproximadas (m) | Notas |
|---|---|---|---|
| `lira` | `lira.glb` | 0,55 de alto | Caparazón de tortuga, dos cuernos curvos, travesaño dorado y 7 cuerdas. Cara hacia -Y de Blender (+Z en three). |
| `tortuga` | `tortuga.glb` | 0,45 de largo | Caparazón con placas, cabeza y 4 patas. Mira hacia +Z. |
| `cuna` | `cuna.glb` | 1 de largo | Cuna de madera con balancines, manta y remates dorados. |
| `herma` | `herma.glb` | 1,5 de alto | Pilar de piedra con brazos cortos y cabeza barbada. |
| `carta` | `carta.glb` | 0,3 de largo | Papiro enrollado con sello rojo. |
| `moly` | `moly.glb` | 0,5 de alto | Planta de raíz negra y flor blanca. |
| `telar` | `telar.glb` | 1,9 de alto, 1,2 de ancho | Telar vertical con tejido a franjas. |
| `nube` | `nube.glb` | ~6 de ancho | Grupo de bultos blancos. |
| `cueva` | `cueva.glb` | exterior 19 × 17, interior ~12 × 11 y ~3,7 de alto | Roca facetada con entrada hacia +Z (en Blender -Y), suelo de tierra, estalactitas, rocas y un lecho de paja. Se puede entrar con la cámara. |

### Personajes (con articulaciones)

`hermes.glb`, `apolo.glb`, `odiseo.glb`, `calipso.glb`, `maia.glb` y `humano.glb` (genérico, para compañeros de Odiseo, pretendientes y almas). Miden ~1,8 m de alto, de pie sobre el origen, mirando hacia +Z.

Cada uno es una jerarquía de nodos con nombre, para que el código los mueva:

```
root > pelvis > torso > head
                      > arm_L > forearm_L > hand_L (empty)
                      > arm_R > forearm_R > hand_R (empty)
                      > cape            (solo Hermes, Odiseo y Maia)
       pelvis > leg_L > shin_L
              > leg_R > shin_R
```

`L` es la izquierda del personaje (x positivo) y `R` la derecha (x negativo). Los pivotes están en las articulaciones, así que basta con rotar cada nodo. `hand_L` y `hand_R` son empties donde se pueden sujetar objetos. El caduceo de Hermes va en su mano izquierda, dentro de la malla de `forearm_L`.

**Todavía no están registrados en `ASSETS`**: hace falta que `Character` aprenda a animarlos por nombre de nodo. Hasta entonces se usan los personajes de formas simples.

## Regenerar

Con Blender abierto y el addon conectado (puerto 9876):

```
python3 -I blender/send.py blender/trees.py
python3 -I blender/send.py blender/olimpo.py
python3 -I blender/send.py blender/zeus.py
python3 -I blender/send.py blender/vaca.py
python3 -I blender/send.py blender/hermes.py
python3 -I blender/send.py blender/personajes.py
python3 -I blender/send.py blender/props.py
```

Cada script crea su colección en Blender (no toca el resto de la escena), exporta el glb y, salvo la vaca, deja imágenes de revisión en `blender/previews/` (ignorada por git).

## Pendiente

- Integrar los personajes en `Character` (animación por nodos).
- Rematar a mano lo que lo necesite: el estilo es limpio y esquemático, no realista.
- Comprimir con `gltf-transform` (meshopt) antes del despliegue: el exportador de Blender no tiene meshopt.
