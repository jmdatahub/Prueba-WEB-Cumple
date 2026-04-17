import type { Player, Team } from "../types/game";

export const TEAMS: Record<string, Team> = {
  templarios: {
    id: "templarios",
    name: "Templarios",
    color: "#22c55e",
    totalScore: 0,
  },
  racistas: {
    id: "racistas",
    name: "Racistas",
    color: "#3b82f6",
    totalScore: 0,
  },
  machistas: {
    id: "machistas",
    name: "Machistas",
    color: "#f97316",
    totalScore: 0,
  },
};

export const PLAYERS: Record<string, Player> = {
  nacho:           { id: "nacho",           name: "Nacho",           teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  cecilia:         { id: "cecilia",         name: "Cecilia",         teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  ricardo:         { id: "ricardo",         name: "Ricardo",         teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  marta_madre:     { id: "marta_madre",     name: "Marta Madre",     teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  yiyo:            { id: "yiyo",            name: "Yiyo",            teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  cardenas:        { id: "cardenas",        name: "Cardenas",        teamId: "templarios", isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  paula:           { id: "paula",           name: "Paula",           teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  guille:          { id: "guille",          name: "Guille",          teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  papa:            { id: "papa",            name: "Papá",            teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  leiva:           { id: "leiva",           name: "Leiva",           teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  marta_yiyo:      { id: "marta_yiyo",      name: "Marta Yiyo",      teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  teresa:          { id: "teresa",          name: "Teresa",          teamId: "racistas",   isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  martita_pequena: { id: "martita_pequena", name: "Martita pequeña", teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  elena:           { id: "elena",           name: "Elena",           teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  charly:          { id: "charly",          name: "Charly",          teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  carla:           { id: "carla",           name: "Carla",           teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  martita_parera:  { id: "martita_parera",  name: "Martita Parera",  teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
  tia_tere:        { id: "tia_tere",        name: "Tía Tere",        teamId: "machistas",  isTaken: false, score: 0, correct: 0, wrong: 0, unanswered: 0, lastAnswerTime: 0 },
};
