interface Answer {
  playerName: string,
  gifId: string
}

export interface Round {
  situation: string,
  answers: Answer[],
  winner?: string
}
