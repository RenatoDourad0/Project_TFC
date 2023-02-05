export interface Igame {
  id: number,
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface IHomeTeam {
  id: number,
  teamName: string,
  homeTeamId: Igame[]
}

export interface IAwayTeam {
  id: number,
  teamName: string,
  awayTeamId: Igame[],
}
