import type { Beat, Line, QuizQuestion, SceneData } from './types'

// El número de mesas NO está en los datos: se ingresa durante la presentación.
export const QUIZ: { questions: QuizQuestion[]; reserve: QuizQuestion } = {
  questions: [
    { prompt: '¿Con el caparazón de qué animal fabricó Hermes su lira?', options: ['Tortuga', 'Tórtola', 'Toro', 'Tritón'], correct: 0, fromScene: 2 },
    { prompt: '¿A qué ninfa llevó Hermes el mensaje de Zeus?', options: ['Calipso', 'Calisto', 'Calíope', 'Casandra'], correct: 0, fromScene: 5 },
    { prompt: '¿Cómo se llamaba la planta que Hermes dio a Odiseo?', options: ['Moly', 'Moira', 'Mirra', 'Morfeo'], correct: 0, fromScene: 6 },
    { prompt: '¿A quiénes guía Hermes al mundo de los muertos?', options: ['Almas', 'Alas', 'Armas', 'Aras'], correct: 0, fromScene: 7 },
    { prompt: '¿Cómo llamaron los romanos a Hermes?', options: ['Mercurio', 'Marte', 'Minerva', 'Mercado'], correct: 0, fromScene: 8 },
  ],
  reserve: { prompt: '¿Cómo se llaman los pilares de piedra que se colocaban junto a los caminos?', options: ['Hermas', 'Hermanas', 'Hermes', 'Hermione'], correct: 0, fromScene: 8 },
}

type L = Line
const n = (text: string): L => ({ speaker: 'narrador', text })
const x = (text: string): L => ({ speaker: 'expositor', text })
const p = (text: string): L => ({ speaker: 'presentador', text })
const h = (text: string): L => ({ speaker: 'hermes', text })

const S1: Beat[] = [
  { id: 'llegada', stage: 'La cámara se acerca a las puertas del Olimpo. Se oyen pasos rápidos. Hermes aparece, frena ante el público y saluda.',
    lines: [
      x("Bienvenidos al Olimpo. Somos [nombres] y hoy vamos a hablar de Hermes."),
      h("Mensajero de los dioses. Encantado. Si alguien necesita decirle algo a Zeus, hagan fila."),
    ], onScreen: 'Hermes: ¿el dios más importante del mundo?', label: { place: 'Las puertas del Olimpo' } },
  { id: 'pregunta', stage: 'Pausa breve. Se iluminan las conexiones entre distintos lugares del Olimpo.',
    lines: [x("Pero antes queremos hacerles una pregunta: ¿podría Hermes ser el dios más importante de todos?")],
    onScreen: '¿Podría Hermes ser el dios más importante de todos?', interaction: 'Pausa breve; dejar que el público piense la pregunta.' },
  { id: 'conexiones', stage: 'Las líneas se apagan. Hermes observa un mensaje que acaba de recibir.',
    lines: [
      x("Imaginen que esas conexiones desaparecen. ¿Cómo se transmite una orden? ¿Cómo llega una advertencia? ¿Cómo sabe alguien que necesita ayuda?")] },
  { id: 'puertas-abren', stage: 'Hermes abre las puertas. La cámara entra tras él.',
    lines: [h("Parece que vamos a tener que comprobarlo.")] },
]

const S2: Beat[] = [
  { id: 'descenso', stage: 'Tras cruzar las puertas, la cámara no llega todavía a la sala de Zeus. Sigue a Hermes mientras desciende hacia una cueva en la montaña. Él entra con familiaridad; los narradores toman la palabra.',
    lines: [n("Antes de convertirse en el mensajero del Olimpo, Hermes fue hijo de Zeus y de Maia. Aquí, en la cueva de su madre, comenzó una historia que dice mucho sobre él.")],
    label: { place: 'La cueva de Maia, monte Cilene' } },
  { id: 'cuna', stage: 'La cámara se acerca a una cuna vacía. Hermes mira hacia ella. Un cambio de luz nos lleva al recuerdo: la cuna vuelve a estar ocupada y el pequeño Hermes sale de ella.',
    lines: [n("Según el *Himno homérico a Hermes*, no tardó en abandonar la cuna. Encontró una tortuga y fabricó con su caparazón una lira. Ese mismo día se llevó el ganado de su hermano Apolo.")],
    flashback: true },
  { id: 'huellas', stage: 'En lugar de mostrar todo el robo todavía, aparecen huellas extrañas que se alejan de la cueva. Hermes adulto sonríe al verlas.',
    lines: [n("Inventar, observar, engañar y encontrar una salida: esas habilidades aparecerán una y otra vez en sus viajes. Los romanos lo conocerían como Mercurio.")],
    onScreen: ['Inventar', 'observar', 'engañar', 'encontrar una salida'] },
  { id: 'llamado', stage: 'Se escucha a lo lejos un llamado desde el Olimpo. Una luz señala el camino hacia la sala de Zeus. Hermes sale de la cueva y la cámara lo sigue hacia la escena 3.',
    lines: [n("Pero ese pasado tendrá que esperar. Zeus lo ha llamado.")] },
]

const S3: Beat[] = [
  { id: 'mapa', stage: 'Hermes llega desde la cueva de Maia. La cámara lo sigue hasta una sala donde brilla un mapa del mundo.',
    lines: [n("Al entrar al Olimpo preguntamos qué ocurriría si se cortaran las comunicaciones. En una guerra, perderlas puede impedir que lleguen órdenes o avisos. En los mitos griegos, alguien tenía que llevar mensajes incluso entre lugares separados por el mar, el Olimpo y el mundo de los muertos.")],
    label: { place: 'Sala de Zeus' } },
  { id: 'orden', stage: 'Una luz señala a Hermes. En el mapa aparece la isla de Calipso.',
    lines: [{ speaker: 'zeus', text: "Hermes, ve a la isla de Calipso. Dile que Odiseo debe partir y continuar su regreso a casa." }],
    onScreen: 'Misión: Odiseo debe partir' },
  { id: 'mision', stage: 'Hermes mira la distancia que muestra el mapa y toma el mensaje.',
    lines: [n("Es una orden de Zeus, un viaje sobre el mar y un mensaje que Calipso probablemente no quiera escuchar. Para Hermes, es el comienzo de otra travesía.")] },
  { id: 'ruta', stage: 'El mapa dibuja la ruta hacia la isla. Hermes parte y la cámara lo sigue hacia la siguiente escena.',
    lines: [n("Hermes parte hacia la isla de Calipso.")] },
]

const S4: Beat[] = [
  { id: 'lira-suena', stage: 'Hermes sale de la sala de Zeus. Lleva el mensaje para Calipso. Al pasar junto a un patio del Olimpo, escucha una lira. Se detiene. La cámara descubre a Apolo tocándola.',
    lines: [n("Hermes tiene una misión urgente. Pero esa música pertenece a una historia anterior: la de su primer encuentro con Apolo, otro hijo de Zeus.")],
    label: { place: 'Patio del Olimpo' } },
  { id: 'entra-recuerdo', stage: 'La cámara se acerca a las cuerdas de la lira. Cada cuerda se convierte visualmente en una línea del paisaje; entramos al recuerdo.',
    lines: [n("En la cueva de Maia vimos a Hermes fabricar este instrumento. Todavía no contamos qué hizo después.")] },
  { id: 'robo', stage: 'Atardece en los pastos de Apolo. El pequeño Hermes observa el ganado desde una roca. La música se interrumpe; solo se oyen los animales y sus pasos.',
    lines: [n("Ese mismo día, Hermes se llevó parte del ganado de Apolo. Para dificultar que lo siguieran, condujo a los animales de manera que sus huellas señalaran una dirección engañosa.")],
    flashback: true, label: { place: 'Los pastos de Apolo' } },
  { id: 'robo-huellas', stage: 'Vista desde arriba: los animales avanzan, pero las huellas parecen contar otra historia. Hermes mira atrás, satisfecho.',
    lines: [n("Las huellas parecen contar otra historia.")], flashback: true,
    interaction: 'Antes de revelar el truco, el público ve las huellas y señala hacia dónde cree que fue el ganado; → revela. La cámara se eleva y muestra lo que ocurrió.' },
  { id: 'investigacion', stage: 'Amanece. Apolo encuentra que falta el ganado. Sigue las marcas en el suelo, se detiene y examina una huella.',
    lines: [n("Apolo sabe que ocurrió algo, pero el camino no coincide con lo que ve. Busca más indicios hasta llegar a la cueva de Maia.")],
    flashback: true },
  { id: 'cuna-finge', stage: 'La cámara sigue a Apolo. Al entrar en la cueva, encuentra a Hermes envuelto como un recién nacido. Hermes aparenta dormir; la lira está escondida junto a él. Detalle: Hermes abre apenas un ojo para comprobar si Apolo sigue mirándolo y lo cierra cuando Apolo gira la cabeza.',
    lines: [n("Hermes vuelve a la cuna y finge que un recién nacido no podría haber recorrido semejante distancia. Apolo no le cree.")],
    flashback: true, label: { place: 'La cueva de Maia' } },
  { id: 'ante-zeus', stage: 'El suelo de la cueva se funde con el de la sala de Zeus. Apolo y Hermes comparecen ante él. La escena puede resolverse con la sombra y la voz de Zeus.',
    lines: [n("La disputa llega hasta Zeus. Apolo exige una respuesta por su ganado; Hermes intenta sostener su versión de los hechos. Zeus los conduce hacia una solución.")],
    flashback: true, label: { place: 'Sala de Zeus' } },
  { id: 'devolucion', stage: 'Hermes guía a Apolo hasta el ganado. Hay una pausa: recuperar lo robado resuelve una parte del problema, pero aún queda la desconfianza entre los hermanos.',
    lines: [n("Recuperar lo robado resuelve una parte del problema, pero aún queda la desconfianza entre los hermanos.")],
    flashback: true },
  { id: 'lira-acuerdo', stage: 'Hermes toma la lira y empieza a tocar. La iluminación, tensa hasta ahora, cambia gradualmente. Apolo escucha, primero sorprendido y después fascinado.',
    lines: [n("Entonces Hermes muestra su otra habilidad. Había creado algo que Apolo nunca había oído. Le entrega la lira y los hermanos llegan a un acuerdo.")],
    flashback: true },
  { id: 'regreso-patio', stage: 'Hermes ofrece el instrumento. Apolo lo acepta. Los dos quedan por un momento en el mismo encuadre; regresamos al patio del Olimpo, en el presente.',
    lines: [n("En el Himno, Apolo recibe la lira y confía a Hermes el cuidado de los rebaños; el encuentro termina en amistad entre ambos.")],
    label: { place: 'Patio del Olimpo' } },
  { id: 'pregunta-filosofica', stage: 'Apolo sigue tocando. Hermes recuerda el mensaje que lleva para Calipso y se dispone a partir.',
    lines: [n("Hermes fue capaz de ocultar un robo y también de resolver una disputa. Por eso la pregunta no es solo si era inteligente. Es: ¿para qué usó su inteligencia en cada momento?")],
    onScreen: '¿Para qué usó su inteligencia en cada momento?' },
  { id: 'salida', stage: 'Aparece brevemente en pantalla: «Astucia · verdad · reparación». La música acompaña a Hermes mientras retoma su ruta. La cámara sigue a Hermes hacia el mar.',
    lines: [n("Ahora debe llevar un mensaje que otra persona quizá tampoco quiera escuchar.")],
    onScreen: ['Astucia', 'verdad', 'reparación'] },
]

const S5: Beat[] = [
  { id: 'mar', stage: 'La música de la lira queda atrás. Hermes se eleva y la cámara lo sigue sobre el mar. Las rutas luminosas del mapa de Zeus aparecen un instante bajo la superficie y luego desaparecen.',
    lines: [n("Zeus ya tomó una decisión. Pero una decisión en el Olimpo no cambia nada en una isla lejana hasta que alguien la comunica.")] },
  { id: 'isla', stage: 'Hermes alcanza una isla verde. Desde arriba se ve una cueva rodeada de árboles y agua; a cierta distancia, una figura permanece sentada frente al mar.',
    lines: [n("Esta es la isla de Calipso. Podría parecer un lugar donde cualquiera querría quedarse. Odiseo, sin embargo, mira hacia el mar porque quiere volver a Ítaca.")],
    label: { place: 'Isla de Calipso' } },
  { id: 'cueva', stage: 'Dentro de la cueva, Calipso trabaja en su telar. Hermes llega, pero no interrumpe de inmediato. Ella lo reconoce y lo recibe como visitante.',
    lines: [n("Calipso reconoce a Hermes. Su llegada es inesperada: nadie cruza tanto mar por una visita casual.")] },
  { id: 'mensaje', stage: 'La cámara muestra el mensaje en manos de Hermes. La luz cálida de la cueva se atenúa cuando él comienza a hablar. Calipso deja de tejer. El sonido del telar se detiene.',
    lines: [h("Zeus ha decidido que Odiseo debe continuar su regreso. Tienes que dejarlo partir.")] },
  { id: 'respuesta', stage: 'Calipso mira hacia la costa. La cámara encuadra a Odiseo a lo lejos, todavía frente al mar.',
    lines: [
      n("Calipso no recibe la noticia con alegría. Recuerda que salvó a Odiseo tras su naufragio y protesta ante la decisión de los dioses. Pero acepta dejarlo marchar."),
      { speaker: 'calipso', text: "Lo salvé cuando llegó solo a esta isla. Ahora quieren que lo envíe otra vez al mar." },
    ] },
  { id: 'a-odiseo', stage: 'Hermes se marcha. Calipso camina hacia la costa. La cámara permanece a cierta distancia mientras habla con Odiseo; vemos que él se levanta y mira el mar de otra manera.',
    lines: [n("Hermes ya entregó el mensaje. Calipso es quien comunica a Odiseo que podrá partir y le ofrece ayuda para preparar el viaje. Volver a casa seguirá siendo difícil, pero ahora puede intentarlo.")] },
  { id: 'ruta-itaca', stage: 'En pantalla, la ruta hacia Ítaca comienza a iluminarse. No aparece como un trayecto directo: el mar continúa oscuro y agitado.',
    lines: [n("La ruta hacia Ítaca comienza a iluminarse.")], onScreen: 'Ítaca' },
  { id: 'cierre', stage: 'La cámara vuelve a Hermes sobre el mar. Por un momento se superponen tres imágenes: Zeus dando la orden, Calipso escuchándola y Odiseo mirando hacia casa.',
    lines: [n("El mensaje tenía pocas palabras. Sus consecuencias alcanzaron a tres personas en lugares distintos. Hermes no decidió el destino de Odiseo, pero hizo posible que la decisión llegara hasta él.")] },
  { id: 'pregunta', stage: 'Hermes continúa su vuelo. La siguiente parada recuperará otro episodio de Odiseo, en el que Hermes le brinda ayuda antes de enfrentarse a Circe.',
    lines: [n("Pregunta al público: Si Hermes hubiera cambiado el mensaje para evitar el disgusto de Calipso, ¿habría ayudado a alguien?")],
    onScreen: 'Si Hermes hubiera cambiado el mensaje para evitar el disgusto de Calipso, ¿habría ayudado a alguien?',
    interaction: 'Pregunta breve al público; escuchar una o dos respuestas y avanzar.' },
]

const S6: Beat[] = [
  { id: 'recuerdo', stage: 'Hermes abandona la isla de Calipso. Bajo él, la ruta de Odiseo se dibuja sobre el mar y retrocede hasta un momento anterior. La pantalla indica: «Antes de Calipso». El mar se funde con un bosque.',
    lines: [n("Hermes acaba de llevar a Calipso la orden de dejar partir a Odiseo. Pero no era la primera vez que ayudaba al viajero. Tiempo antes, sus compañeros habían entrado en la casa de Circe.")],
    label: { time: 'Antes de Calipso', place: 'Casa de Circe' }, flashback: true },
  { id: 'cerdos', stage: 'Vemos a los hombres entrar. Un cambio de luz muestra su transformación en cerdos. Odiseo avanza solo hacia la casa.',
    lines: [n("Odiseo fue a buscarlos sin saber cómo protegerse del poder de Circe.")], flashback: true },
  { id: 'advertencia', stage: 'Hermes, con apariencia de joven, aparece en el camino. Entrega a Odiseo una planta de flor blanca y raíz oscura.',
    lines: [
      h("Tus compañeros siguen ahí. Toma esto y escucha con atención antes de entrar."),
      n("Hermes le entrega una planta llamada *moly* y le explica qué esperar de Circe. Odiseo tendrá que entrar y actuar por sí mismo."),
    ], onScreen: 'Moly', flashback: true },
  { id: 'umbral', stage: 'Primer plano de la planta. La cámara sigue a Odiseo hasta el umbral de la casa, pero se detiene antes de entrar.',
    lines: [
      n("Pregunta al público: ¿Conocer el peligro significa que Odiseo ya está a salvo?"),
      n("La advertencia le da una oportunidad. La decisión y el riesgo siguen siendo suyos."),
    ], onScreen: '¿Conocer el peligro significa que Odiseo ya está a salvo?', flashback: true,
    interaction: 'Pregunta breve al público; luego leer la respuesta del narrador.' },
  { id: 'salto', stage: 'La imagen del bosque vuelve a ser el mar. Los narradores anuncian un salto hacia adelante; la ruta temporal avanza más allá del episodio de Calipso y del regreso de Odiseo. En pantalla: «Tiempo después».',
    lines: [n("Tiempo después.")], label: { time: 'Tiempo después' } },
]

const S7: Beat[] = [
  { id: 'itaca', stage: 'Una secuencia breve marca el paso del tiempo: una balsa sobre el mar, la costa de Ítaca, el palacio de Odiseo. No se representan los sucesos intermedios en detalle.',
    lines: [n("Mucho después de la visita a Calipso, Odiseo vuelve a Ítaca. En su palacio se enfrenta a los pretendientes que lo habían ocupado. Tras la muerte de los pretendientes, Hermes aparece para conducir sus almas.")],
    label: { place: 'Palacio de Ítaca', time: 'Tiempo después' } },
  { id: 'almas-siguen', stage: 'El palacio queda en penumbra. Las figuras de los pretendientes ya no tienen cuerpo sólido. Hermes entra con su vara. No los juzga ni discute lo que hicieron: señala el camino y el grupo empieza a seguirlo.',
    lines: [n("En el canto XXIV de la *Odisea*, Hermes reúne a las almas de los pretendientes y las guía hacia el lugar de los muertos.")] },
  { id: 'ruta-hitos', stage: 'La arquitectura del palacio se disuelve en una ruta oscura. Vemos, como hitos visuales, el agua de Océano, una roca blanca, las puertas del Sol y la región de los Sueños. Hermes camina delante del grupo.',
    lines: [n("El poema nombra los lugares que atraviesan antes de llegar al prado de asfódelos. Hermes conoce la ruta y la recorre con ellos.")],
    label: { place: 'El camino al mundo de los muertos' } },
  { id: 'vacila', stage: 'Una de las almas vacila en el umbral. Hermes se detiene y espera. No hace falta darle un diálogo inventado: el gesto basta.',
    lines: [n("Hasta aquí vimos a Hermes llevar órdenes y advertencias. Ahora guía a quienes no pueden recorrer solos esta última frontera.")] },
  { id: 'asfodelos', stage: 'El grupo sigue avanzando. A lo lejos aparece el prado de asfódelos, sobrio y silencioso. La cámara permanece junto a Hermes; no presenta el lugar como un castigo universal ni inventa un juicio.',
    lines: [n("El grupo sigue avanzando hacia el prado de asfódelos.")] },
  { id: 'pausa', stage: 'Hermes queda junto al umbral. A un lado se entrevé el mundo de los vivos; al otro, el camino recorrido por las almas.',
    lines: [n("Los griegos le atribuyeron a Hermes el paso entre lugares que parecen separados: ciudades, islas, el Olimpo y el mundo de los muertos. ¿Qué necesita alguien al atravesar un cambio que no puede deshacer?")],
    interaction: 'Dejar la pregunta en el aire un momento antes de avanzar.' },
  { id: 'palabras', stage: 'En pantalla aparecen tres palabras, una a una: «Orientación · confianza · compañía».',
    lines: [n("Nuestra lectura del mito es que acompañar también es una forma de ayudar. Hermes no elimina la muerte ni cambia lo ocurrido: conoce el camino y guía a otros por él.")],
    onScreen: ['Orientación', 'confianza', 'compañía'] },
  { id: 'salida', stage: 'La cámara se eleva. La ruta oscura se transforma gradualmente en una de las líneas luminosas vistas en la portada. Hermes vuelve a quedar en el centro del mapa de conexiones. La línea luminosa conduce hacia la siguiente escena, dedicada al contexto histórico, religioso y cultural.',
    lines: [n("El mensajero del Olimpo también es guía en su última frontera. Ahora podemos mirar el mundo donde se contaron estas historias y preguntarnos por qué un dios de los caminos fue tan importante para griegos y romanos.")] },
]

const S8: Beat[] = [
  { id: 'camino-griego', stage: 'La línea luminosa de la escena anterior se convierte en un camino de tierra. Al borde hay un pilar de piedra coronado por una cabeza: una herma. Hermes se detiene junto a él mientras pasan unos viajeros.',
    lines: [n("En los mitos, Hermes podía cruzar del Olimpo a una isla o al mundo de los muertos. Para los griegos también estaba presente en fronteras mucho más cercanas: un camino, una entrada, el límite de una comunidad.")],
    label: { place: 'Grecia' } },
  { id: 'herma', stage: 'La cámara se acerca al pilar. Al tocarlo, aparecen brevemente otros lugares donde podía situarse: una puerta, un cruce y un límite.',
    lines: [n("Estas representaciones, llamadas *hermas*, se colocaban junto a caminos, entradas y límites. Nos muestran que Hermes formaba parte de la vida religiosa fuera de los poemas.")],
    onScreen: 'Herma', interaction: 'El público puede tocar el pilar para ver otros lugares donde se situaba.' },
  { id: 'mercado', stage: 'Hermes sigue a los viajeros hasta una ciudad. La cámara pasa de la puerta al mercado: alguien ofrece un producto, otra persona compara lo recibido y una tercera se dispone a partir de nuevo.',
    lines: [n("Para viajar o comerciar había que cruzar límites y tratar con desconocidos. Por eso los caminos, las entradas y el intercambio encajan con las funciones que se atribuían a Hermes.")] },
  { id: 'ruta-mercado', stage: 'Una ruta se ilumina desde el mercado hacia otra ciudad. El público puede tocarla para ver adónde se dirige un viajero.',
    lines: [n("El Hermes ingenioso del mito también se asociaba con el espacio donde circulaban personas, bienes y palabras.")],
    interaction: 'El público puede tocar la ruta para ver adónde se dirige un viajero.' },
  { id: 'roma', stage: 'Hermes sale por la puerta de la ciudad. El camino se transforma mediante una transición visible: cambia la arquitectura, aparece el rótulo «Roma» y una representación del dios con una bolsa de dinero.',
    lines: [n("La historia continúa en Roma. Allí se le conoce como Mercurio. Sigue siendo reconocible como mensajero, viajero y protector del intercambio; sus imágenes destacan también su relación con el comercio.")],
    label: { place: 'Roma' }, onScreen: 'Mercurio' },
  { id: 'estatua', stage: 'Hermes observa una pequeña estatua romana de Mercurio. La cámara compara por un instante su vara con la de la estatua y después destaca la bolsa.',
    lines: [n("La bolsa es la señal de su vínculo con el comercio.")] },
  { id: 'cierre', stage: 'La cámara se eleva sobre ambas ciudades. Sus caminos se iluminan junto a las rutas imposibles que vimos en los mitos: la isla de Calipso y el mundo de los muertos.',
    lines: [n("Un mito no nos dice exactamente cómo vivía cada persona en Grecia o Roma. Pero estas imágenes y lugares muestran algo concreto: Hermes y Mercurio tenían un lugar en la forma en que esas sociedades pensaban los viajes, los límites y el intercambio.")] },
  { id: 'pregunta', stage: 'Aparece la pregunta en pantalla. La ruta conduce hacia la siguiente escena: la pervivencia de Hermes en el arte y la cultura contemporánea.',
    lines: [n("Hasta ahora hemos visto al dios en sus relatos y en el mundo antiguo. Queda descubrir por qué seguimos reconociéndolo hoy.")],
    onScreen: '¿Qué necesita una comunidad para mantenerse conectada?' },
]

const S9: Beat[] = [
  { id: 'hoy', stage: 'La línea luminosa de la escena 8 sale de la ciudad romana y atraviesa siglos en un instante. El paisaje se vuelve un calendario, un cielo nocturno y una calle actual. Aparece el rótulo: «Hoy».',
    lines: [n("Hermes y Mercurio no se quedaron en los templos ni en los poemas. Todavía aparecen en cosas que usamos sin pensar en el mito.")],
    label: { place: 'Hoy' } },
  { id: 'cielo', stage: 'Hermes recorre tres estaciones. En cada una, un elemento se ilumina y se coloca en el borde de la pantalla.',
    lines: [n("El cielo: el planeta Mercurio, nombrado por el dios romano.")], onScreen: 'Mercurio' },
  { id: 'semana', lines: [n("La semana: el miércoles. En latín, dies Mercurii, día de Mercurio; de ahí miércoles, mercredi en francés y mercoledì en italiano.")], onScreen: 'Miércoles' },
  { id: 'simbolo', lines: [
      n("El símbolo: el caduceo, la vara con serpientes, se usa hoy en símbolos asociados al comercio y también a la salud, aunque en la medicina suele confundirse con la vara de Asclepio."),
      n("El dios que unía lugares terminó dándole nombre a un planeta, a un día de la semana y a un símbolo que reconocemos en la calle."),
    ], onScreen: ['Mercurio', 'miércoles', 'caduceo'] },
  { id: 'pregunta', stage: 'Hermes queda en el centro del mapa de conexiones, igual que en la escena 1. Las líneas están apagadas.',
    lines: [n("Al empezar preguntamos si Hermes podía ser el dios más importante. Zeus tenía el poder de decidir. Hermes no. Pero veamos qué ocurrió cada vez que su camino quedó cortado.")],
    onScreen: '¿Podría Hermes ser el dios más importante del mundo?' },
  { id: 'lineas', stage: 'Las líneas se encienden una por una, cada una ligada a una escena anterior: Olimpo → isla de Calipso (que la decisión llegara a quien debía cumplirla); camino de Odiseo → casa de Circe (que supiera qué esperar y llevara el moly); palacio de Ítaca → lugar de los muertos (que alguien los acompañara); Grecia → Roma (que el dios siguiera reconocible).',
    lines: [n("Hermes no mandaba. Pero sin él, las decisiones se quedaban donde se tomaban, las advertencias no llegaban y los caminos no se conectaban.")],
    onScreen: ['Decisión: que llegara', 'Advertencia: que se supiera', 'Tránsito: que alguien acompañara', 'Nombre: que siguiera reconocible'] },
  { id: 'respuesta', stage: 'Las líneas forman de nuevo la red de la portada, ahora brillante y completa.',
    lines: [n("Nuestra respuesta: puede que no sea el más poderoso, pero sí uno sin el cual el resto no funciona. Su importancia está en que el mensaje llegue.")],
    onScreen: 'Su importancia está en que el mensaje llegue' },
  { id: 'carta', stage: 'Hermes sostiene una carta. La cámara se acerca. Una palabra aparece sobre el sello y empieza a cambiar de letras. La carta se disuelve en la animación de reglas de la escena 10.',
    lines: [n("Hermes entrega el mensaje tal como lo recibió. ¿Y nosotros? Vamos a comprobar cuánto cuesta que una sola palabra llegue completa de una persona a otra.")] },
]

const REGLAS: { short: string; text: string }[] = [
  { short: 'Se muestra la pregunta con cuatro opciones', text: 'Se muestra la pregunta con cuatro opciones. Todos las leen en la pantalla.' },
  { short: 'Quien sabe la respuesta levanta la mano', text: 'Quien sabe la respuesta levanta la mano. Esa persona inicia la cadena.' },
  { short: 'Las opciones se ocultan', text: 'Las opciones se ocultan. A partir de este momento, la respuesta solo viaja por voz.' },
  { short: 'Se susurra una sola vez', text: 'Se susurra una sola vez. Quien inicia le dice la respuesta, al oído, a la persona que tiene a su izquierda. Cada quien se la pasa a su vecino de la izquierda, sin repetir y sin corregir.' },
  { short: 'Responde el último de la cadena', text: 'Responde el último de la cadena. Es quien estaba a la derecha de quien empezó. Levanta la mano y dice en voz alta lo que le llegó.' },
  { short: 'Gana el punto la primera mesa que diga la respuesta correcta', text: 'Gana el punto la primera mesa que diga la respuesta correcta. Si el último dice una palabra equivocada, esa mesa queda fuera de la ronda.' },
]

function quizBeats(): Beat[] {
  return QUIZ.questions.flatMap((q, i): Beat[] => {
    const k = i + 1
    return [
      { id: `q${k}-pregunta`, quiz: { q: k, phase: 'shown' },
        stage: i === 0 ? 'Aparece la primera pregunta con las cuatro opciones de colores.' : `Aparece la pregunta ${k} con las cuatro opciones de colores.`,
        lines: [p(`Pregunta ${k}: ${q.prompt}`)],
        interaction: 'Leer la pregunta y las cuatro opciones despacio y claras.' },
      { id: `q${k}-cadena`, quiz: { q: k, phase: 'hidden' },
        stage: 'Se oculta el panel de opciones. Las mesas susurran. Quien presenta atiende a las manos levantadas.',
        lines: [p('La primera mesa que diga la respuesta correcta gana el punto.')],
        interaction: 'Sumar el punto a la mesa ganadora con su número; Shift + número lo resta.' },
      { id: `q${k}-respuesta`, quiz: { q: k, phase: 'revealed' },
        stage: 'Se revela la respuesta. El marcador sube.',
        lines: [p(`La respuesta correcta es: ${q.options[q.correct]}.`)] },
    ]
  })
}

const S10: Beat[] = [
  { id: 'intro', stage: 'Hermes sostiene una carta con el sello de Zeus.',
    lines: [p('Hay cinco preguntas. Las cuatro opciones suenan parecido. Cuando la mano levantada empiece la cadena, las opciones desaparecen.')],
    onScreen: 'El mensaje que no debe cambiar', label: { place: 'Las puertas del Olimpo' } },
  ...REGLAS.map((r, i): Beat => ({
    id: `reglas-${i + 1}`,
    stage: i === 0 ? 'Animación de reglas. Vista desde arriba de una mesa redonda con cinco figuras. Cada regla aparece con un icono y una línea breve.' : undefined,
    lines: [p(r.text)],
    onScreen: r.short,
  })),
  { id: 'demo', stage: 'En la animación, un mensaje luminoso recorre la mesa. En cada paso la palabra se deforma un poco, como ejemplo. Al final una figura levanta la mano.',
    lines: [p('Si el mensaje cambia en el camino, quien lo recibe contesta otra cosa. Es lo que Hermes evitaba.')],
    onScreen: ['almas', 'alas', 'armas'] },
  { id: 'mesas', lines: [p('Antes de empezar, ingresen cuántas mesas juegan.')], onScreen: '¿Cuántas mesas?',
    interaction: 'Con + y - se cambia el número de mesas (2 a 12); → para empezar.' },
  ...quizBeats(),
  { id: 'cierre', stage: 'Tras la quinta pregunta, el marcador queda al centro. Una línea luminosa baja desde la carta y recorre las cinco palabras de las respuestas. Al final, la carta se cierra. Hermes saluda, las puertas del Olimpo se abren detrás de él y la cámara se aleja.',
    lines: [
      p('Ganó la mesa [nombre]. Pero fíjense en lo que pasó: la respuesta a veces se deformaba a medio camino, aunque todos quisieran decir lo mismo. Hermes no podía permitírselo.'),
      p('Él no decidía lo que Zeus mandaba, pero era la razón de que llegara completo. Por eso la pregunta con la que empezamos tiene una respuesta: sin comunicación, no hay a quién obedecer, advertir ni acompañar. Gracias.'),
    ], onScreen: QUIZ.questions.map(q => q.options[q.correct]) },
]

export const SCENES: SceneData[] = [
  { id: 'puertas', number: 1, title: 'Las puertas del Olimpo', minutes: [0.75, 1], place: 'Las puertas del Olimpo',
    question: '¿Podría Hermes ser el dios más importante del mundo?', beats: S1 },
  { id: 'cueva', number: 2, title: 'La cueva de Maia', minutes: [2, 3], place: 'La cueva de Maia, monte Cilene',
    question: '¿La astucia es admirable por sí misma o depende de cómo se utiliza?',
    sources: ['Himno homérico a Hermes (nacimiento, invención de la lira y episodio del ganado).'], beats: S2 },
  { id: 'zeus', number: 3, title: 'El mensaje de Zeus', minutes: [1, 1.25], place: 'Sala de Zeus',
    question: 'Si entregas una orden que cambia una vida, ¿eres solo quien lleva el mensaje o también tienes una responsabilidad?',
    sources: ['Homero, Odisea, canto V. La sala, el mapa y las palabras exactas son recursos del guion, no una reproducción literal del poema.'], beats: S3 },
  { id: 'apolo', number: 4, title: 'Hermes y Apolo', minutes: [3, 4], place: 'Camino a la isla de Calipso',
    question: '¿Para qué usó su inteligencia en cada momento?',
    sources: ['Himno homérico a Hermes, versos 1-580 (traducción de Evelyn-White, 1914). El patio de paso, las transiciones, los gestos y la pregunta filosófica son decisiones de esta adaptación.'], beats: S4 },
  { id: 'calipso', number: 5, title: 'La isla de Calipso', minutes: [3, 4], place: 'Isla de Calipso',
    question: '¿Qué cambia cuando un mensaje, aunque sea breve, permite que otra persona recupere su camino?',
    sources: ['Homero, Odisea, canto V. Los diálogos breves y las transiciones son adaptaciones para esta presentación.'], beats: S5 },
  { id: 'circe', number: 6, title: 'Lo que Hermes sabía de Circe', minutes: [0.75, 1], place: 'Casa de Circe',
    question: '¿Conocer el peligro significa estar a salvo?',
    sources: ['Homero, Odisea, canto X. El diálogo abreviado es creación del guion; el encuentro con Circe ocurre antes de Calipso y aquí es un recuerdo breve.'], beats: S6 },
  { id: 'almas', number: 7, title: 'Hermes, guía de las almas', minutes: [3, 4], place: 'El camino al mundo de los muertos',
    question: '¿Por qué una figura que guía a los viajeros también acompaña a los muertos?',
    sources: ['Homero, Odisea, canto XXIV (Hermes guía a las almas de los pretendientes). No se afirma que guíe a Odiseo en el canto XI. «Orientación, confianza y compañía» es una lectura de la presentación.'], beats: S7 },
  { id: 'caminos', number: 8, title: 'Los caminos de Hermes y Mercurio', minutes: [3, 3], place: 'Grecia y Roma',
    question: '¿Por qué importaba este dios para la gente que contaba sus historias?',
    sources: ['The Metropolitan Museum of Art, Bronze herm (griego arcadio, ca. 490 a. C.; romano imperial) y Bronze statuette of Hermes seated on a rock.', 'British Museum: inscripción a Hermes Agoraios; Gods and goddesses of Roman Britain.'], beats: S8 },
  { id: 'hoy', number: 9, title: 'Lo que queda de Hermes', minutes: [2, 3], place: 'Nuestro mundo',
    question: '¿Podría Hermes ser el dios más importante del mundo?',
    sources: ['Pendiente: citar una fuente (museo, enciclopedia o diccionario etimológico) para los datos de la sección 9.1. La sección 9.2 usa las fuentes de las escenas 4 a 8.'], beats: S9 },
  { id: 'actividad', number: 10, title: 'El mensaje que no debe cambiar', minutes: [4, 6], place: 'Las puertas del Olimpo',
    question: '¿Qué se pierde si el mensaje cambia en el camino?',
    sources: ['Adaptación del teléfono descompuesto con preguntas tipo Kahoot; las palabras parecidas son una decisión de diseño.'], beats: S10 },
]
