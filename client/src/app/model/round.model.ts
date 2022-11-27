export interface Answer {
  playerName: string,
  gifUrl: string,
  flipped: boolean,
}

export interface Round {
  situation?: string,
  answers?: Answer[],
  winner?: string,
  index?: number,
}
