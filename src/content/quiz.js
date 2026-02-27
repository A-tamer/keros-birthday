export const MONEY_LADDER = [
  '$100',
  '$200',
  '$500',
  '$1,000',
  '$2,000',
  '$5,000',
  '$10,000',
  '$25,000',
  '$50,000',
  '$1,000,000',
  '$1,000,000',
]

export const TIMER_SECONDS = 30

export const quizQuestions = [
  {
    id: 'q1',
    question: '"Of of x"?',
    options: ['sayooda', 'mahmoud Khalil', '3am 3eed'],
    correctIndex: 0,
  },
  {
    id: 'q2',
    question: '"Tosss"?',
    options: ['Abdelnasser', 'Moataz', 'Ahmed refaat'],
    correctIndex: 0,
  },
  {
    id: 'q3',
    question: '"Belmaraaa"?',
    options: ['Keroo', 'Temoo', 'Boudyy'],
    correctIndex: 0,
  },
  {
    id: 'q4',
    question: '"Elgaw 7elw awyyy elnaharda"?',
    options: ['Temoo', 'Temoo', 'Temoo'],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
  },
  {
    id: 'q5',
    question: '"Eshta 3lyaaa"?',
    options: ['Keroo', 'Keroo', 'Keroo'],
    correctIndex: 0,
    correctIndices: [0, 1, 2],
  },
  {
    id: 'q6',
    question: '"Masalannn"?',
    options: ['Temoo', 'Keroo', 'loll'],
    correctIndex: 1,
  },
  {
    id: 'q7',
    question: '"Hat ely f batnakk"?',
    options: ['el3egl', 'Keroo', 'eslam kabonga'],
    correctIndex: 0,
  },
  {
    id: 'q8',
    question: '"3ayz aroo7 el toilette"?',
    options: ['Keroo', 'Boudyy', 'All of the above'],
    correctIndex: 2,
  },
  {
    id: 'q9',
    question: '"Lw 3andena Airbagg"?',
    options: ['Moataz', 'doctoor el agile ely msh batee2o', 'karim emara'],
    correctIndex: 0,
  },
  {
    id: 'q10',
    question: '"Ed3ak elfanooos"?',
    options: ['3ala2 eldin', '3ala2 elteneen', '3ala2 bss'],
    correctIndex: 2,
  },
  {
    id: 'q11',
    question: '"Ya 7omaaaar"?',
    options: ['el7ag Temoo', 'el7ag koura', 'el7ag Bassem'],
    correctIndex: 0,
  },
]

/** Finish the sentence – free-text answers. correctAnswers: array of accepted answers (trimmed, case-insensitive match). */
export const finishSentenceQuestions = [
  { id: 'fs1', question: '3ayez arkab …….', correctAnswers: ['el 3agala', 'el3agala', '3agala'] },
  { id: 'fs2', question: '3ayez at3lm ……', correctAnswers: ['zyber  zecurityyyyy'] },
  { id: 'fs3', question: 'Elfanana bt2ool " ado2 ado2 Ana elkamoon w malish kalam m3 ……', correctAnswers: ['elyansoon'] },
  { id: 'fs4', question: '"Takol ehhh"……', correctAnswers: ['3alaaaaaa2'] },
]

/** Feen (where?) – blurred image, answer revealed on button. No input, no sounds. */
export const feenQuestions = [
  { id: 'feen1', questionImage: '/feen/quiz1.png', answerImage: '/feen/quiz1-answer.png' },
  { id: 'feen2', questionImage: '/feen/quiz2.png', answerImage: '/feen/quiz2-answer.png' },
  { id: 'feen3', questionImage: '/feen/quiz3.png', answerImage: '/feen/quiz3-answer.png' },
]
