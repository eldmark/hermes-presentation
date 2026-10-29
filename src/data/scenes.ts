import type { Beat, Line, QuizQuestion, SceneData } from './types'
import { asignarReparto } from './reparto'

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
    lines: [x("Bienvenidos al Olimpo. Somos [nombres] y hoy les vamos a contar la historia de un mensajero."), h("Encantado: Hermes, para servirles. Si alguien tiene algo que decirle a Zeus, hagan fila.")], onScreen: 'Hermes, mensajero de los dioses', label: { place: 'Las puertas del Olimpo' } },
  { id: 'red', stage: 'Se iluminan las conexiones entre distintos lugares del Olimpo.',
    lines: [x("Detrás de estas puertas el mundo entero está conectado. Cada línea de luz es un camino, y por cada camino viaja alguien con una orden, una advertencia o un grito de ayuda.")],
    onScreen: 'Un mundo conectado' },
  { id: 'conexiones', stage: 'Las líneas se apagan. Hermes observa un mensaje que acaba de recibir.',
    lines: [x("Ahora imaginen que un día esas luces se apagan. ¿Quién avisa del peligro? ¿Quién entrega una orden? ¿Quién se entera de que alguien pide ayuda?")] },
  { id: 'puertas-abren', stage: 'Hermes abre las puertas. La cámara entra tras él.',
    lines: [h("Me acaba de llegar un mensaje, pero puede esperar un momento. Antes quiero que conozcan de dónde vengo. Pasen.")] },
]

const S2: Beat[] = [
  { id: 'descenso', stage: 'Tras cruzar las puertas, la cámara no llega todavía a la sala de Zeus. Sigue a Hermes mientras desciende hacia una cueva en la montaña. Él entra con familiaridad; los narradores toman la palabra.',
    lines: [n("Todo empezó en una cueva del monte Cilene, al amanecer de un día cualquiera. Allí nació Hermes.")],
    label: { place: 'La cueva de Maia, monte Cilene' } },
  { id: 'familia', stage: 'Aparece el árbol genealógico sobre la escena: Zeus y Maia como padres de Hermes, y Apolo como su hermano por parte de padre. Hermes espera junto a la entrada.',
    lines: [n("Su padre era Zeus, rey del Olimpo. Su madre, Maia, una de las Pléyades e hija del titán Atlas. Y tenía un hermano por parte de padre: Apolo, dios de la luz y de la música.")],
    panel: { kind: 'genealogia' } },
  { id: 'cuna', stage: 'La cámara se acerca a una cuna vacía. Hermes mira hacia ella. Un cambio de luz nos lleva al recuerdo: la cuna vuelve a estar ocupada y el pequeño Hermes sale de ella.',
    lines: [n("El *Himno homérico a Hermes* lo cuenta así: al amanecer nació; al mediodía ya tocaba la lira, que había fabricado con el caparazón de una tortuga; y al caer la tarde ya le había robado el ganado a Apolo. Todo en un solo día.")],
    flashback: true },
  { id: 'huellas', stage: 'En lugar de mostrar todo el robo todavía, aparecen huellas extrañas que se alejan de la cueva. Hermes adulto sonríe al verlas.',
    lines: [n("Un recién nacido que inventa, observa, engaña y encuentra la salida. Esas habilidades lo acompañarán en cada viaje. Los romanos lo llamarían Mercurio.")],
    onScreen: ['Inventar', 'observar', 'engañar', 'encontrar una salida'] },
  { id: 'llamado', stage: 'Se escucha a lo lejos un llamado desde el Olimpo. Una luz señala el camino hacia la sala de Zeus. Hermes sale de la cueva y la cámara lo sigue hacia la escena 3.',
    lines: [n("Pero el mensaje que Hermes dejó esperando ya no puede esperar más: desde el Olimpo, Zeus lo llama.")] },
]

const S3: Beat[] = [
  { id: 'mapa', stage: 'Hermes llega desde la cueva de Maia. La cámara lo sigue hasta una sala donde brilla un mapa del mundo.',
    lines: [n("Zeus lo espera en su trono, frente a un mapa del mundo. Los dioses han decidido: Odiseo, el héroe que lleva años lejos de su casa, debe volver a Ítaca. Pero una decisión así no sirve de nada si nadie la lleva hasta donde importa.")],
    label: { place: 'Sala de Zeus' } },
  { id: 'orden', stage: 'Una luz señala a Hermes. En el mapa aparece la isla de Calipso.',
    lines: [{ speaker: 'zeus', text: "Hermes, tú que llevas mis palabras adonde yo no llego: ve a la isla de Calipso y dile que Odiseo debe partir." }],
    onScreen: 'Misión: Odiseo debe partir' },
  { id: 'mision', stage: 'Hermes mira la distancia que muestra el mapa y toma el mensaje.',
    lines: [n("Es un viaje largo, sobre un mar sin ciudades, para dar una noticia que nadie quiere oír. Hermes toma el mensaje.")] },
  { id: 'ruta', stage: 'El mapa dibuja la ruta hacia la isla. Hermes parte y la cámara lo sigue hacia la siguiente escena.',
    lines: [n("Y se lanza al cielo, rumbo al mar.")] },
]

const S4: Beat[] = [
  { id: 'lira-suena', stage: 'Hermes sale de la sala de Zeus. Lleva el mensaje para Calipso. Al pasar junto a un patio del Olimpo, escucha una lira. Se detiene. La cámara descubre a Apolo tocándola.',
    lines: [n("Pero en el camino lo detiene una melodía. Es Apolo, tocando una lira. Hermes sonríe: conoce muy bien ese instrumento.")],
    label: { place: 'Patio del Olimpo' } },
  { id: 'entra-recuerdo', stage: 'La cámara se acerca a las cuerdas de la lira. Cada cuerda se convierte visualmente en una línea del paisaje; entramos al recuerdo.',
    lines: [n("Porque esa lira nació de una tortuga y de una travesura que casi termina en pelea entre hermanos.")] },
  { id: 'robo', stage: 'Atardece en los pastos de Apolo. El pequeño Hermes observa el ganado desde una roca. La música se interrumpe; solo se oyen los animales y sus pasos.',
    lines: [n("Volvamos a aquella tarde. Con la lira recién estrenada, el pequeño Hermes baja a los pastos de Apolo y se lleva parte de su ganado.")],
    flashback: true, label: { place: 'Los pastos de Apolo' } },
  { id: 'robo-huellas', stage: 'Vista desde arriba: los animales avanzan, pero las huellas parecen contar otra historia. Hermes mira atrás, satisfecho.',
    lines: [n("No quiere que lo sigan, así que hace caminar a los animales de modo que las huellas cuenten otra historia. Miren: ¿hacia dónde creen que se fue el ganado?")], flashback: true,
    interaction: 'Antes de revelar el truco, el público ve las huellas y señala hacia dónde cree que fue el ganado; → revela. La cámara se eleva y muestra lo que ocurrió.' },
  { id: 'investigacion', stage: 'Amanece. Apolo encuentra que falta el ganado. Sigue las marcas en el suelo, se detiene y examina una huella.',
    lines: [n("Al amanecer, Apolo descubre el robo y sigue las marcas. Pero el camino no coincide con lo que ve: una prueba también puede engañar. Apolo no se rinde y sigue buscando indicios hasta la cueva de Maia.")],
    flashback: true },
  { id: 'cuna-finge', stage: 'La cámara sigue a Apolo. Al entrar en la cueva, encuentra a Hermes envuelto como un recién nacido. Hermes aparenta dormir; la lira está escondida junto a él. Detalle: Hermes abre apenas un ojo para comprobar si Apolo sigue mirándolo y lo cierra cuando Apolo gira la cabeza.',
    lines: [n("Allí, en la cuna, un bebé duerme… o finge dormir. Apolo lo mira con desconfianza."), h("¿Yo? Si acabo de nacer. Solo sé de leche y de dormir.")],
    flashback: true, label: { place: 'La cueva de Maia' } },
  { id: 'ante-zeus', stage: 'El suelo de la cueva se funde con el de la sala de Zeus. Apolo y Hermes comparecen ante él. La escena puede resolverse con la sombra y la voz de Zeus.',
    lines: [n("Apolo lo lleva ante Zeus. Hermes jura que es inocente, con cara de ángel. Zeus, que lo ve todo, casi no puede contener la risa, y le ordena devolver lo robado.")],
    flashback: true, label: { place: 'Sala de Zeus' } },
  { id: 'devolucion', stage: 'Hermes guía a Apolo hasta el ganado. Hay una pausa: recuperar lo robado resuelve una parte del problema, pero aún queda la desconfianza entre los hermanos.',
    lines: [n("Hermes cumple y lleva a Apolo hasta el ganado. Pero devolver las vacas no borra la desconfianza entre los hermanos. Algo falta para reparar el daño.")],
    flashback: true },
  { id: 'lira-acuerdo', stage: 'Hermes toma la lira y empieza a tocar. La iluminación, tensa hasta ahora, cambia gradualmente. Apolo escucha, primero sorprendido y después fascinado.',
    lines: [n("Entonces Hermes toma la lira y toca. Apolo, el dios de la música, nunca había oído algo así. Se queda en silencio… y Hermes se la entrega.")],
    flashback: true },
  { id: 'regreso-patio', stage: 'Hermes ofrece el instrumento. Apolo lo acepta. Los dos quedan por un momento en el mismo encuadre; regresamos al patio del Olimpo, en el presente.',
    lines: [n("Así terminó el pleito: Apolo se quedó con la lira y le confió a Hermes el cuidado de sus rebaños. Dos hermanos que empezaron peleados terminaron como amigos.")],
    label: { place: 'Patio del Olimpo' } },
  { id: 'pregunta-filosofica', stage: 'Apolo sigue tocando. Hermes recuerda el mensaje que lleva para Calipso y se dispone a partir.',
    lines: [n("Hermes fue capaz de ocultar un robo y también de resolver una disputa. Por eso la pregunta no es si era inteligente, sino para qué usó su inteligencia en cada momento.")],
    onScreen: '¿Para qué usó su inteligencia en cada momento?' },
  { id: 'salida', stage: 'Aparece brevemente en pantalla: «Astucia · verdad · reparación». La música acompaña a Hermes mientras retoma su ruta. La cámara sigue a Hermes hacia el mar.',
    lines: [n("Pero la música ya sonó demasiado: Hermes todavía lleva un mensaje que otra persona tampoco querrá oír.")],
    onScreen: ['Astucia', 'verdad', 'reparación'] },
]

const S5: Beat[] = [
  { id: 'mar', stage: 'La música de la lira queda atrás. Hermes se eleva y la cámara lo sigue sobre el mar. Las rutas luminosas del mapa de Zeus aparecen un instante bajo la superficie y luego desaparecen.',
    lines: [n("Hermes cruza el mar rozando las olas, como una gaviota. Una decisión del Olimpo no cambia nada en una isla lejana hasta que alguien la lleva hasta allá.")] },
  { id: 'isla', stage: 'Hermes alcanza una isla verde. Desde arriba se ve una cueva rodeada de árboles y agua; a cierta distancia, una figura permanece sentada frente al mar.',
    lines: [n("Al fondo aparece una isla verde, un lugar donde cualquiera querría quedarse. Pero en la orilla hay un hombre sentado, mirando el horizonte con los ojos llenos de lágrimas. Es Odiseo, y lleva años queriendo volver a Ítaca.")],
    label: { place: 'Isla de Calipso' } },
  { id: 'cueva', stage: 'Dentro de la cueva, Calipso trabaja en su telar. Hermes llega, pero no interrumpe de inmediato. Ella lo reconoce y lo recibe como visitante.',
    lines: [n("Hermes entra en la cueva. Calipso, la dueña de la isla, trabaja en su telar y lo reconoce enseguida. Nadie cruza tanto mar sin un buen motivo.")] },
  { id: 'mensaje', stage: 'La cámara muestra el mensaje en manos de Hermes. La luz cálida de la cueva se atenúa cuando él comienza a hablar. Calipso deja de tejer. El sonido del telar se detiene.',
    lines: [h("Zeus lo ha decidido: Odiseo debe continuar su regreso. Tienes que dejarlo partir.")] },
  { id: 'respuesta', stage: 'Calipso mira hacia la costa. La cámara encuadra a Odiseo a lo lejos, todavía frente al mar.',
    lines: [n("Calipso deja de tejer y guarda silencio. Después protesta, porque sabe que no puede desobedecer a Zeus, pero le duele."), { speaker: 'calipso', text: "Lo salvé cuando llegó solo a esta isla. Ahora quieren que lo envíe otra vez al mar." }] },
  { id: 'a-odiseo', stage: 'Hermes se marcha. Calipso camina hacia la costa. La cámara permanece a cierta distancia mientras habla con Odiseo; vemos que él se levanta y mira el mar de otra manera.',
    lines: [n("Hermes no le dirá nada a Odiseo: su trabajo ya terminó. Es Calipso quien camina hasta la orilla y le da la noticia: puede partir, y ella lo ayudará a preparar el viaje. Por primera vez en años, el mar deja de ser una prisión.")] },
  { id: 'ruta-itaca', stage: 'En pantalla, la ruta hacia Ítaca comienza a iluminarse. No aparece como un trayecto directo: el mar continúa oscuro y agitado.',
    lines: [n("La ruta hacia Ítaca se ilumina, aunque el mar sigue oscuro y agitado: volver a casa nunca fue un camino recto.")], onScreen: 'Ítaca' },
  { id: 'cierre', stage: 'La cámara vuelve a Hermes sobre el mar. Por un momento se superponen tres imágenes: Zeus dando la orden, Calipso escuchándola y Odiseo mirando hacia casa.',
    lines: [n("Un mensaje de pocas palabras y tres vidas cambiadas: Zeus decidió, Calipso obedeció y Odiseo recuperó su camino. Hermes no decidió nada. Pero sin él, la decisión se habría quedado en el Olimpo.")] },
  { id: 'pregunta', stage: 'Hermes continúa su vuelo. La siguiente parada recuperará otro episodio de Odiseo, en el que Hermes le brinda ayuda antes de enfrentarse a Circe.',
    lines: [n("Ahora imaginen que Hermes, para ahorrarle un disgusto a Calipso, hubiera suavizado el mensaje. ¿Habría ayudado a alguien?")],
    onScreen: 'Si Hermes hubiera cambiado el mensaje para evitar el disgusto de Calipso, ¿habría ayudado a alguien?',
    interaction: 'Pregunta breve al público; escuchar una o dos respuestas y avanzar.' },
]

const S6: Beat[] = [
  { id: 'recuerdo', stage: 'Hermes abandona la isla de Calipso. Bajo él, la ruta de Odiseo se dibuja sobre el mar y retrocede hasta un momento anterior. La pantalla indica: «Antes de Calipso». El mar se funde con un bosque.',
    lines: [n("Pero esa no fue la primera vez que Hermes ayudó a Odiseo. Retrocedamos: mucho antes de Calipso, los compañeros de Odiseo habían entrado en la casa de la hechicera Circe.")],
    label: { time: 'Antes de Calipso', place: 'Casa de Circe' }, flashback: true },
  { id: 'cerdos', stage: 'Vemos a los hombres entrar. Un cambio de luz muestra su transformación en cerdos. Odiseo avanza solo hacia la casa.',
    lines: [n("Circe los convirtió en cerdos. Odiseo, solo y sin protección, fue a rescatarlos.")], flashback: true },
  { id: 'advertencia', stage: 'Hermes, con apariencia de joven, aparece en el camino. Entrega a Odiseo una planta de flor blanca y raíz oscura.',
    lines: [h("Tus compañeros siguen ahí. Toma esto y escucha con atención antes de entrar."), n("Hermes, con aspecto de joven, le da una planta de raíz negra y flor blanca, el *moly*, y le explica qué esperar de Circe.")], onScreen: 'Moly', flashback: true },
  { id: 'umbral', stage: 'Primer plano de la planta. La cámara sigue a Odiseo hasta el umbral de la casa, pero se detiene antes de entrar.',
    lines: [n("Con el *moly* en la mano, Odiseo llega al umbral. ¿Saber del peligro significa estar a salvo?"), n("La advertencia le da una oportunidad. Lo que haga con ella depende de él.")], onScreen: '¿Conocer el peligro significa que Odiseo ya está a salvo?', flashback: true,
    interaction: 'Pregunta breve al público; luego leer la respuesta del narrador.' },
  { id: 'salto', stage: 'La imagen del bosque vuelve a ser el mar. Los narradores anuncian un salto hacia adelante; la ruta temporal avanza más allá del episodio de Calipso y del regreso de Odiseo. En pantalla: «Tiempo después».',
    lines: [n("Demos ahora un salto en el tiempo, hasta el final de la historia de Odiseo.")], label: { time: 'Tiempo después' } },
]

const S7: Beat[] = [
  { id: 'itaca', stage: 'Una secuencia breve marca el paso del tiempo: una balsa sobre el mar, la costa de Ítaca, el palacio de Odiseo. No se representan los sucesos intermedios en detalle.',
    lines: [n("Años después, Odiseo vuelve por fin a Ítaca. En su palacio se enfrenta a los pretendientes que lo habían ocupado, y los pretendientes mueren. Entonces aparece Hermes, con un último encargo.")],
    label: { place: 'Palacio de Ítaca', time: 'Tiempo después' } },
  { id: 'almas-siguen', stage: 'El palacio queda en penumbra. Las figuras de los pretendientes ya no tienen cuerpo sólido. Hermes entra con su vara. No los juzga ni discute lo que hicieron: señala el camino y el grupo empieza a seguirlo.',
    lines: [n("Con su vara dorada llama a las almas de los pretendientes. No las juzga ni les reprocha nada: señala el camino, y ellas lo siguen murmurando, como murciélagos en una cueva.")] },
  { id: 'ruta-hitos', stage: 'La arquitectura del palacio se disuelve en una ruta oscura. Vemos, como hitos visuales, el agua de Océano, una roca blanca, las puertas del Sol y la región de los Sueños. Hermes camina delante del grupo.',
    lines: [n("El poema nombra el camino: las aguas del Océano, la Roca Blanca, las puertas del Sol, el país de los Sueños. Hermes lo conoce y lo recorre con ellos.")],
    label: { place: 'El camino al mundo de los muertos' } },
  { id: 'vacila', stage: 'Una de las almas vacila en el umbral. Hermes se detiene y espera. No hace falta darle un diálogo inventado: el gesto basta.',
    lines: [n("En el umbral, una de las almas duda. Hermes se detiene y espera. Hasta ahora lo vimos llevar órdenes y advertencias; ahora acompaña a quienes no pueden recorrer solos este último tramo.")] },
  { id: 'asfodelos', stage: 'El grupo sigue avanzando. A lo lejos aparece el prado de asfódelos, sobrio y silencioso. La cámara permanece junto a Hermes; no presenta el lugar como un castigo universal ni inventa un juicio.',
    lines: [n("Al fondo se abre el prado de asfódelos, silencioso y sereno.")] },
  { id: 'pausa', stage: 'Hermes queda junto al umbral. A un lado se entrevé el mundo de los vivos; al otro, el camino recorrido por las almas.',
    lines: [n("Para los griegos, Hermes era el dios de los pasos entre lugares que parecen separados: ciudades, islas, el Olimpo, el mundo de los muertos. ¿Qué necesita alguien cuando atraviesa un cambio que ya no se puede deshacer?")],
    interaction: 'Dejar la pregunta en el aire un momento antes de avanzar.' },
  { id: 'palabras', stage: 'En pantalla aparecen tres palabras, una a una: «Orientación · confianza · compañía».',
    lines: [n("Nuestra lectura del mito: acompañar también es una forma de ayudar. Hermes no evita la muerte ni cambia lo ocurrido, pero conoce el camino y no deja que nadie lo recorra solo.")],
    onScreen: ['Orientación', 'confianza', 'compañía'] },
  { id: 'salida', stage: 'La cámara se eleva. La ruta oscura se transforma gradualmente en una de las líneas luminosas vistas en la portada. Hermes vuelve a quedar en el centro del mapa de conexiones. La línea luminosa conduce hacia la siguiente escena, dedicada al contexto histórico, religioso y cultural.',
    lines: [n("El mensajero del Olimpo es también el guía de la última frontera. Ahora salgamos de los mitos para mirar el mundo donde se contaron: ¿por qué un dios de los caminos importaba tanto a griegos y romanos?")] },
]

const S8: Beat[] = [
  { id: 'camino-griego', stage: 'La línea luminosa de la escena anterior se convierte en un camino de tierra. Al borde hay un pilar de piedra coronado por una cabeza: una herma. Hermes se detiene junto a él mientras pasan unos viajeros.',
    lines: [n("Salimos del mito y llegamos a un camino de tierra en la antigua Grecia. Hermes no vivía solo en los poemas: estaba en los caminos, en las entradas, en el límite de cada comunidad.")],
    label: { place: 'Grecia' } },
  { id: 'herma', stage: 'La cámara se acerca al pilar. Al tocarlo, aparecen brevemente otros lugares donde podía situarse: una puerta, un cruce y un límite.',
    lines: [n("Por eso se levantaban junto a los caminos pilares de piedra con una cabeza: las *hermas*. Marcaban puertas, cruces y límites, y los ponían bajo la protección del dios.")],
    onScreen: 'Herma', interaction: 'El público puede tocar el pilar para ver otros lugares donde se situaba.' },
  { id: 'mercado', stage: 'Hermes sigue a los viajeros hasta una ciudad. La cámara pasa de la puerta al mercado: alguien ofrece un producto, otra persona compara lo recibido y una tercera se dispone a partir de nuevo.',
    lines: [n("El camino lleva a la ciudad. En el mercado, los viajeros cruzan límites, tratan con desconocidos, compran, venden y negocian. Es el lugar perfecto para un dios que mueve personas, bienes y palabras.")] },
  { id: 'ruta-mercado', stage: 'Una ruta se ilumina desde el mercado hacia otra ciudad. El público puede tocarla para ver adónde se dirige un viajero.',
    lines: [n("Y de ese mercado parten nuevas rutas: con cada viajero viajan mercancías y también noticias.")],
    interaction: 'El público puede tocar la ruta para ver adónde se dirige un viajero.' },
  { id: 'roma', stage: 'Hermes sale por la puerta de la ciudad. El camino se transforma mediante una transición visible: cambia la arquitectura, aparece el rótulo «Roma» y una representación del dios con una bolsa de dinero.',
    lines: [n("Pasan los siglos y el camino llega a Roma. Aquí el dios cambia de nombre: es Mercurio. Sigue siendo mensajero y viajero, pero se destaca otra de sus caras: el comercio.")],
    label: { place: 'Roma' }, onScreen: 'Mercurio' },
  { id: 'estatua', stage: 'Hermes observa una pequeña estatua romana de Mercurio. La cámara compara por un instante su vara con la de la estatua y después destaca la bolsa.',
    lines: [n("Por eso lleva una bolsa: es la señal de que cuida el intercambio.")] },
  { id: 'cierre', stage: 'La cámara se eleva sobre ambas ciudades. Sus caminos se iluminan junto a las rutas imposibles que vimos en los mitos: la isla de Calipso y el mundo de los muertos.',
    lines: [n("Un mito no nos dice exactamente cómo vivía cada persona en Grecia o en Roma. Pero estas imágenes muestran que Hermes y Mercurio tenían un lugar en la forma de pensar los viajes, los límites y el intercambio.")] },
  { id: 'pregunta', stage: 'Aparece la pregunta en pantalla. La ruta conduce hacia la siguiente escena: la pervivencia de Hermes en el arte y la cultura contemporánea.',
    lines: [n("Y si un dios cuida los caminos, ¿qué necesita una comunidad para mantenerse conectada? Esa pregunta nos acompaña hasta hoy.")],
    onScreen: '¿Qué necesita una comunidad para mantenerse conectada?' },
]

const S9: Beat[] = [
  { id: 'hoy', stage: 'La línea luminosa de la escena 8 sale de la ciudad romana y atraviesa siglos en un instante. El paisaje se vuelve un calendario, un cielo nocturno y una calle actual. Aparece el rótulo: «Hoy».',
    lines: [n("Hermes no se quedó en los templos ni en los poemas: sigue escondido en cosas que usamos sin pensar en el mito.")],
    label: { place: 'Hoy' } },
  { id: 'cielo', stage: 'Hermes recorre tres estaciones. En cada una, un elemento se ilumina y se coloca en el borde de la pantalla.',
    lines: [n("Primero, en el cielo: el planeta Mercurio, nombrado por el dios romano.")], onScreen: 'Mercurio' },
  { id: 'semana', lines: [n("Después, en la semana: *miércoles* viene del latín *dies Mercurii*, «día de Mercurio»; en francés, *mercredi*; en italiano, *mercoledì*.")], onScreen: 'Miércoles' },
  { id: 'simbolo', lines: [n("Y en la calle: el caduceo, la vara con serpientes, marca negocios y también hospitales, aunque en medicina suele confundirse con la vara de Asclepio."), n("El dios que unía lugares terminó dándole nombre a un planeta, a un día de la semana y a un símbolo que reconocemos en cualquier ciudad.")], onScreen: ['Mercurio', 'miércoles', 'caduceo'] },
  { id: 'pregunta', stage: 'Hermes queda en el centro del mapa de conexiones, igual que en la escena 1. Las líneas están apagadas.',
    lines: [n("Después de este viaje, una pregunta: ¿podría Hermes ser el dios más importante? Zeus tenía el poder de decidir. Hermes no. Pero veamos qué ocurrió cada vez que su camino quedó cortado.")],
    onScreen: '¿Podría Hermes ser el dios más importante del mundo?' },
  { id: 'lineas', stage: 'Las líneas se encienden una por una, cada una ligada a una escena anterior: Olimpo → isla de Calipso (que la decisión llegara a quien debía cumplirla); camino de Odiseo → casa de Circe (que supiera qué esperar y llevara el moly); palacio de Ítaca → lugar de los muertos (que alguien los acompañara); Grecia → Roma (que el dios siguiera reconocible).',
    lines: [n("Sin Hermes, la decisión de Zeus se habría quedado en el Olimpo; Odiseo habría entrado sin protección en la casa de Circe; y las almas habrían caminado solas. Hermes no mandaba, pero sin él las decisiones se quedaban donde se tomaban, las advertencias no llegaban y los caminos no se conectaban.")],
    onScreen: ['Decisión: que llegara', 'Advertencia: que se supiera', 'Tránsito: que alguien acompañara', 'Nombre: que siguiera reconocible'] },
  { id: 'respuesta', stage: 'Las líneas forman de nuevo la red de la portada, ahora brillante y completa.',
    lines: [n("Nuestra respuesta: quizá no sea el más poderoso, pero sí uno sin el cual el resto no funciona. Su importancia está en que el mensaje llegue.")],
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

const S11: Beat[] = [
  { id: 'intro', stage: 'Hermes sostiene una carta con el sello de Zeus.',
    lines: [p("Hermes siempre entregaba el mensaje tal como lo recibía. Ahora les toca a ustedes: son cinco preguntas, y las cuatro opciones de cada una suenan parecido. Cuando empiece la cadena, las opciones desaparecen.")],
    onScreen: 'El mensaje que no debe cambiar', label: { place: 'La actividad' } },
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
      p('Él no decidía lo que Zeus mandaba, pero era la razón de que llegara completo. Por eso la pregunta sobre su importancia tiene una respuesta: sin comunicación, no hay a quién obedecer, advertir ni acompañar. Gracias.'),
    ], onScreen: QUIZ.questions.map(q => q.options[q.correct]) },
]

const S10: Beat[] = [
  { id: 'intro', stage: 'Hermes llega a un salón abierto con seis pedestales vacíos. Cada pedestal se iluminará con una idea.',
    lines: [n("Antes de la actividad, una pausa. Mientras seguíamos a Hermes aparecieron seis ideas con las que los griegos pensaban el mundo. Vamos a ponerles nombre.")],
    onScreen: 'Seis ideas para pensar a Hermes', label: { place: 'El salón de las ideas' } },
  { id: 'metis', stage: 'Se ilumina el primer pedestal. Aparece la tarjeta con la definición. Atrás se ven, tenues, las huellas del ganado.',
    lines: [n("Primero, la *mêtis*: la inteligencia práctica que ve la salida donde otros no la ven y actúa a tiempo. Hermes la usa al desviar las huellas y al fingir que duerme. Por eso la astucia no es buena ni mala por sí misma: depende de para qué se usa.")],
    panel: { kind: 'concepto', term: 'Mêtis', greek: 'μῆτις', gloss: 'Inteligencia práctica y astuta: ver la salida donde otros no la ven y actuar a tiempo.',
      myth: 'Hermes desvía las huellas del ganado y finge dormir en la cuna.' } },
  { id: 'dike', stage: 'Se ilumina el segundo pedestal. La lira aparece sobre él.',
    lines: [n("Segundo, la *díkē*, la justicia como reparación: que el daño se arregle y cada quien reciba lo que le corresponde. Hermes devuelve el ganado y le entrega la lira a Apolo. Ser hábil no basta: hay que reparar.")],
    panel: { kind: 'concepto', term: 'Díkē', greek: 'δίκη', gloss: 'Justicia como reparación: que el daño se arregle y cada quien reciba lo que le corresponde.',
      myth: 'Hermes devuelve el ganado y entrega la lira a Apolo; los hermanos hacen las paces.' } },
  { id: 'libertad', stage: 'Se ilumina el tercer pedestal. Aparece una pequeña isla y una ruta que se aleja sobre el mar.',
    lines: [n("Tercero, la *eleuthería*, la libertad. Odiseo desea volver a casa y Calipso lo retiene. Hermes no decide por ellos: hace posible que la decisión llegue. La libertad de uno también depende de que alguien la comunique.")],
    panel: { kind: 'concepto', term: 'Eleuthería', greek: 'ἐλευθερία', gloss: 'Libertad: poder decidir sobre el propio camino, incluso cuando otro quiere retenerte.',
      myth: 'Odiseo desea volver a Ítaca y Calipso lo retiene, hasta que llega el mensaje de Zeus.' } },
  { id: 'destino', stage: 'Se ilumina el cuarto pedestal. Un rayo ilumina la sala un instante.',
    lines: [n("Cuarto, la *moira*, el destino: la parte que le toca a cada quien. En la *Odisea*, Zeus dice que no es el destino de Odiseo morir lejos de los suyos, y manda a Hermes a decirlo. Hermes no cambia lo decidido: lo hace llegar.")],
    panel: { kind: 'concepto', term: 'Moira', greek: 'μοῖρα', gloss: 'Destino: la parte que le toca a cada quien dentro del orden del mundo (kósmos), que Zeus sostiene.',
      myth: 'Zeus declara que Odiseo no está destinado a morir lejos de los suyos y envía a Hermes a decirlo.' } },
  { id: 'etica', stage: 'Se ilumina el quinto pedestal. Una carta sellada aparece sobre él.',
    lines: [n("Quinto, la *areté*, la virtud: hacer bien la función propia. Para un mensajero, es la fidelidad. Hermes no suaviza la orden para evitar el disgusto de Calipso, y por eso su mensaje sirve. La ética del mensajero es no cambiar lo que le confiaron.")],
    panel: { kind: 'concepto', term: 'Areté', greek: 'ἀρετή', gloss: 'Virtud: hacer bien la función propia. En un mensajero, la fidelidad al mensaje.',
      myth: 'Hermes entrega la orden sin alterarla, aunque Calipso proteste.' } },
  { id: 'conocimiento', stage: 'Se ilumina el sexto pedestal. Aparece la planta moly.',
    lines: [n("Y sexto, el conocimiento. Hermes sabe qué espera en la casa de Circe y le da a Odiseo el *moly*. Saber del peligro le da una oportunidad, pero la decisión sigue siendo suya.")],
    panel: { kind: 'concepto', term: 'Gnôsis', greek: 'γνῶσις', gloss: 'Conocimiento: saber qué viene permite actuar, pero no decide por nosotros.',
      myth: 'Hermes da el moly a Odiseo y le explica qué esperar de Circe; Odiseo entra y decide por sí mismo.' } },
  { id: 'cierre', stage: 'Los seis pedestales brillan a la vez. Hermes recoge su carta y mira hacia las puertas del Olimpo.',
    lines: [n("Astucia, justicia, libertad, destino, virtud y conocimiento: seis maneras de preguntar lo mismo, qué hace un dios que no manda, pero conecta. Ahora vamos a ponerlo a prueba.")],
    onScreen: ['Astucia', 'Justicia', 'Libertad', 'Destino', 'Virtud', 'Conocimiento'] },
]

const S12: Beat[] = [
  { id: 'gracias', stage: 'Hermes se despide frente a las puertas del Olimpo, ahora abiertas. La cámara se aleja y aparecen las referencias.',
    lines: [p("Y así termina el viaje. Gracias por acompañarnos. Estas son las fuentes en las que nos apoyamos.")],
    onScreen: 'Gracias', label: { place: 'Las puertas del Olimpo' } },
  { id: 'ref-antiguas', stage: 'Lista de fuentes antiguas (1 de 2).', lines: [],
    interaction: 'Sin texto: dejar la lista a la vista y abrir la ronda de preguntas.',
    panel: { kind: 'referencias', title: 'Fuentes antiguas', items: [
      'Hesíodo. (1914). *Teogonía* (H. G. Evelyn-White, Trad.). Loeb Classical Library. Theoi Classical Texts Library. https://www.theoi.com/Text/HesiodTheogony.html',
      'Himno homérico a Hermes [Himno 4]. (1914). En H. G. Evelyn-White (Trad.), *Hesiod, the Homeric Hymns, and Homerica*. Loeb Classical Library. Mythopedia. https://mythopedia.com/library/homeric-hymns-evelyn-white-1914/4-to-hermes/',
    ] } },
  { id: 'ref-homero', stage: 'Lista de fuentes antiguas (2 de 2) y estudios.', lines: [],
    panel: { kind: 'referencias', title: 'Homero y estudios', items: [
      'Homero. (1919). *Odisea*, cantos V, X y XXIV (A. T. Murray, Trad.). Loeb Classical Library. Theoi Classical Texts Library. https://www.theoi.com/Text/HomerOdyssey5.html · …/HomerOdyssey10.html · …/HomerOdyssey24.html',
      'Detienne, M., & Vernant, J.-P. (1978). *Cunning intelligence in Greek culture and society* (J. Lloyd, Trad.). Harvester Press. (Obra original publicada en 1974).',
      'Friedlander, W. J. (1992). *The golden wand of medicine: A history of the caduceus symbol in medicine*. Greenwood Press.',
    ] } },
  { id: 'ref-consulta', stage: 'Obras de consulta.', lines: [],
    panel: { kind: 'referencias', title: 'Obras de consulta', items: [
      'Real Academia Española. (s. f.). Miércoles. En *Diccionario de la lengua española* (23.ª ed.). Recuperado el 29 de octubre de 2026, de https://dle.rae.es/miércoles',
      'NASA. (s. f.). *Mercury*. NASA Science. Recuperado el 29 de octubre de 2026, de https://science.nasa.gov/mercury/',
    ] } },
  { id: 'ref-met', stage: 'Objetos del Metropolitan Museum of Art.', lines: [],
    panel: { kind: 'referencias', title: 'Metropolitan Museum of Art', items: [
      'The Metropolitan Museum of Art. (s. f.). *Bronze herm* [Herma de bronce, griego arcadio, ca. 490 a. C.]. https://www.metmuseum.org/art/collection/search/255933',
      'The Metropolitan Museum of Art. (s. f.). *Bronze herm* [Herma de bronce, romano, siglos I–II d. C.]. https://www.metmuseum.org/art/collection/search/250735',
      'The Metropolitan Museum of Art. (s. f.). *Bronze statuette of Hermes seated on a rock* [Estatuilla de bronce de Hermes sentado sobre una roca, romano, siglos I–II d. C.]. https://www.metmuseum.org/art/collection/search/250955',
    ], note: 'Las descripciones entre corchetes en español son traducciones nuestras de los títulos de los museos.' } },
  { id: 'ref-bm', stage: 'Objetos del British Museum.', lines: [],
    panel: { kind: 'referencias', title: 'British Museum', items: [
      'British Museum. (s. f.). *Inscripción dedicada a Hermes Agoraios* [Objeto G_1864-0220-100]. https://www.britishmuseum.org/collection/object/G_1864-0220-100',
      'British Museum. (s. f.). *Gods and goddesses of Roman Britain*. https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-rome/gods-and-goddesses-roman-britain',
    ] } },
  { id: 'ref-imagenes', stage: 'Créditos de los modelos y de las referencias visuales.', lines: [],
    panel: { kind: 'referencias', title: 'Imágenes y modelos', items: [
      'Modelos 3D, escenas y animaciones: elaboración propia con Blender y three.js. Código en https://github.com/eldmark/hermes-presentation',
      'Yliade. (s. f.). *Hermes* [Ilustración digital]. Usada solo como referencia visual para el diseño del personaje; no se reproduce.',
      'Ilustración 3D de Zeus en un trono dorado [Imagen de un banco de imágenes, autoría no identificada]. Usada solo como referencia visual para el diseño del trono; no se reproduce.',
    ] } },
]

const GUION: SceneData[] = [
  { id: 'puertas', number: 1, title: 'Las puertas del Olimpo', minutes: [0.75, 1], place: 'Las puertas del Olimpo',
    question: '¿Qué pasa si las conexiones entre los lugares desaparecen?', beats: S1 },
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
    sources: ['Real Academia Española, Diccionario de la lengua española, «miércoles» (del lat. [dies] Mercuri, «día de Mercurio»); NASA Science, Mercury («named for the swiftest of the ancient Roman gods»); Friedlander, W. J. (1992), The golden wand of medicine, sobre el caduceo y la medicina. La sección 9.2 usa las fuentes de las escenas 4 a 8.'], beats: S9 },
  { id: 'conceptos', number: 10, title: 'Seis ideas para pensar a Hermes', minutes: [2, 3], place: 'El salón de las ideas',
    question: '¿Qué hace un dios que no manda, pero conecta?',
    sources: ['Detienne, M., & Vernant, J.-P. (1978), Cunning intelligence in Greek culture and society, para mêtis. Las demás definiciones (díkē, eleuthería, moira, areté, gnôsis) son glosas breves de esta presentación, ligadas a Homero, Odisea V y X, y al Himno homérico a Hermes.'], beats: S10 },
  { id: 'actividad', number: 11, title: 'El mensaje que no debe cambiar', minutes: [4, 6], place: 'La actividad',
    question: '¿Qué se pierde si el mensaje cambia en el camino?',
    sources: ['Adaptación del teléfono descompuesto con preguntas tipo Kahoot; las palabras parecidas son una decisión de diseño.'], beats: S11 },
  { id: 'referencias', number: 12, title: 'Referencias', minutes: [0.5, 1], place: 'Las puertas del Olimpo',
    sources: ['Lista completa en la propia escena (formato APA 7.ª edición, adaptado al español).'], beats: S12 },
]

/** El guion con quién dice cada línea (ver reparto.ts). */
export const SCENES: SceneData[] = asignarReparto(GUION)
