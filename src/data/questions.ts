import type { Question } from "../types/game";

// ─── Configurable ───────────────────────────────────────────────────
// Hide team scores in ranking screens after this question index (0-based)
export const HIDE_TEAMS_AFTER_QUESTION = 15;

// ─── Preguntas ──────────────────────────────────────────────────────
export const QUESTIONS: Question[] = [
  {
    id: 0,
    text: "¿Cuándo es el cumpleaños de Jorge?",
    options: ["12 de abril", "14 de abril", "16 de abril", "19 de abril"],
    correctIndex: 1, // 14 de abril
    timeLimit: 20,
    imageAfter: null,
  },
  {
    id: 1,
    text: "¿Cuándo es el santo de Jorge?",
    options: ["19 de abril", "3 de marzo", "14 de abril", "23 de abril"],
    correctIndex: 3, // 23 de abril
    timeLimit: 20,
    imageAfter: null,
  },
  {
    id: 2,
    text: "¿Quién quiere llevar a Jorge a hacer un Ironman?",
    options: ["Nacho", "Guille", "Ricardo", "Charly"],
    correctIndex: 3, // Charly
    timeLimit: 20,
    imageAfter: '/images/Pregunta 3.PNG', // Public folder reference
  },
  {
    id: 3,
    text: "¿Quién estuvo a punto de dejar a Jorge encerrado en otro país?",
    options: ["Nacho", "Carla", "Paula", "Ninguna es correcta"],
    correctIndex: 2, // Paula
    timeLimit: 20,
    imageAfter: '/images/Pregunta 4.PNG',
  },
  {
    id: 4,
    text: "¿Quién parece más tranquilo… pero es el más peligroso?",
    options: ["Ricardo", "Tío Fernando", "Cecilia", "Yiyo"],
    correctIndex: 2, // Cecilia
    timeLimit: 20,
    imageAfter: null,
  },
  {
    id: 5,
    text: "¿Cuántas preguntas quedan?",
    options: ["5", "10", "15", "Las que yo quiera"],
    correctIndex: 3, // Las que yo quiera
    timeLimit: 20,
    imageAfter: null,
  },
  {
    id: 6,
    text: "¿Quién sería capaz de meter a Jorge en un lío sin darse cuenta?",
    options: ["Paula", "Carla", "Marta Madre", "Elena"],
    correctIndex: 1, // Carla
    timeLimit: 20,
    imageAfter: '/images/Pregunta 7.png',
  },
  {
    id: 7,
    text: "¿Con quién fue Jorge llevado al calabozo por la policía?",
    options: ["Paula", "Nacho", "Charly", "Ricardo", "Paula y Nacho"],
    correctIndex: 4, // Paula y Nacho
    timeLimit: 20,
    imageAfter: '/images/Pregunta 8.PNG',
  },
  {
    id: 8,
    text: "¿Con qué vehículo Jorge y Nacho casi se quedan tirados en mitad de la nada durante uno de sus viajes?",
    options: ["Un 4x4", "Una Vespa", "Una lancha a motor", "Una moto"],
    correctIndex: 0, // Un 4x4
    timeLimit: 20,
    imageAfter: null,
  },
  {
    id: 9,
    text: "¿Cuál de estas historias de Jorge en la carretera es cierta?",
    options: [
      "En Australia se metió en dirección contraria, llegó a un semáforo al revés y se chocó de frente contra otro coche",
      "Se metió con una moto a 40 km/h por la autovía, con todos pitándole y casi le atropella un camión",
      "Iba de excursión con Nacho, se equivocaron y acabaron yendo en bici por mitad de la autovía",
      "Todas son correctas",
      "Solo una es falsa"
    ],
    correctIndex: 4, // Solo una es falsa
    timeLimit: 30,
    imageAfter: null,
  },
  {
    id: 10,
    text: "Entrando en una calle para aparcar el coche… ¿qué hizo Jorge realmente?",
    options: [
      "Se bajó del coche aún en marcha y se tiró al suelo como si nada",
      "Bajó la ventanilla y empezó a vomitar en mitad de la calle",
      "Le tiró una botella a otro coche"
    ],
    correctIndex: 0, // Se bajó del coche aún en marcha...
    timeLimit: 25,
    imageAfter: '/images/Pregunta 11.PNG',
  },
  {
    id: 11,
    text: "¿Cuál de estas cosas hacía Jorge cuando era pequeño?",
    options: [
      "Dejaba que Paula y Marta le vistieran de mujer en ocasiones especiales",
      "Se subió al tejado del cole para recuperar un balón y llamaron al conserje para bajarlo",
      "Se comió el bocadillo de un compañero por error y fingió durante semanas que no había sido él"
    ],
    correctIndex: 0, // Le vistieran de mujer
    timeLimit: 30,
    imageAfter: null,
  },
  {
    id: 12,
    text: "¿Cuál de estas historias del recreo es real?",
    options: [
      "Un niño pegó a Marta de pequeña y Jorge le persiguió por el recreo un par de días",
      "Se perdió en una excursión del cole y apareció una hora después comiéndose las galletas del monitor",
      "Convenció a toda la clase de que no había deberes… y nadie los hizo"
    ],
    correctIndex: 0, // Jorge le persiguió por el recreo
    timeLimit: 30,
    imageAfter: '/images/Pregunta 13.PNG',
  },
  {
    id: 13,
    text: "¿Cuál de estas historias con Marta es real?",
    options: [
      "Retó a Marta a probar jabón diciendo que nadie lo había hecho para ser la mujer más fuerte del universo... y ella lo probó",
      "Convenció a Marta de que si enterraban una moneda en el patio crecería un árbol de dinero",
      "Le dijo que podía hablar con los gatos y estuvo semanas traduciéndole 'mensajes' suyos"
    ],
    correctIndex: 0, // Probar jabón
    timeLimit: 35,
    imageAfter: '/images/Pregunta 14.PNG',
  },
  {
    id: 14,
    text: "¿Cuál de estas cosas hacía Jorge con Marta y Paula?",
    options: [
      "Les hacía 'masajes de la tortura' para que ganasen flexibilidad, y ellas se lo creían y le dejaban mucho rato",
      "Les dijo que si corrían alrededor del árbol del patio 10 veces podrían pedir un deseo",
      "Las convenció de un 'club secreto' al que solo se entraba si aguantaban un minuto sin hablar"
    ],
    correctIndex: 0, // Masajes de la tortura
    timeLimit: 35,
    imageAfter: null,
  },
  {
    id: 15,
    text: "¿Cuál de estas cosas es real sobre Jorge y Elena?",
    options: [
      "Jorge quería que Elena se llamase literalmente 'Inma del comedor', no solo Inma",
      "Jorge le decía que por ser la pequeña tenía que sentarse siempre a su lado en el comedor para no perderse",
      "Le hizo creer que los hermanos mayores elegían el sitio de los pequeños en clase"
    ],
    correctIndex: 0, // Inma del comedor
    timeLimit: 30,
    imageAfter: '/images/Pregunta 16.PNG',
  },
  {
    id: 16,
    text: "¿Qué hizo Jorge con Yiyo?",
    options: [
      "Se colaron en un campo de fútbol, le dio un apretón, cagó en unas plantas y se limpió con una hoja",
      "Con un skate rayaron un coche gigante intentando un truco y huyeron",
      "Lanzaron un boomerang a la cabeza de una señora que les persiguió por la calle",
      "Todas son reales",
      "Solo una es falsa"
    ],
    correctIndex: -1, // PENDIENTE: El host elegirá la respuesta correcta en directo
    timeLimit: 30,
    imageAfter: '/images/Pregunta 17.PNG',
  },
  {
    id: 17,
    text: "¿Cuál de estas historias de Jorge pequeño es real?",
    options: [
      "De excursión llevaba cacas de cabra en los bolsillos y las iba dando a los demás como caramelos",
      "Los primos siempre le revisaban los bolsillos porque intentaba llevarse algún juguete escondido",
      "En el parque se escondía en la casita y mordía a quien subía al tobogán, bajando con cara de ángel",
      "Todas son reales",
      "Solo una es falsa"
    ],
    correctIndex: 4, // e) solo una es falsa (las correctas son la b y c)
    timeLimit: 35,
    imageAfter: ['/images/Pregunta 18.png', '/images/Pregunta 18.1.png'],
  }
];
