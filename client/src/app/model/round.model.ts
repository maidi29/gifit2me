export interface Answer {
  playerName: string,
  gifUrl: string
}

export interface Round {
  situation?: string,
  answers?: Answer[],
  winner?: string,
  index?: number,
}
