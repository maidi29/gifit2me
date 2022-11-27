import {
  ActionReducer,
  ActionReducerMap, createAction,
  createFeatureSelector, createReducer,
  createSelector,
  MetaReducer, on, props
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {Player} from "../model/player.model";
import {Answer, Round} from "../model/round.model";

export interface State {
  players: Player[],
  activeRound?: Round,
  room?: string
}

export const initialState: State = {
  players: [],
};

export const selectPlayers = (state: State) => state.players;
export const selectRound = (state: State) => state.activeRound;

export const addPlayers = createAction('Add Players', props<{nPlayer: Player[]}>());
export const addPlayer = createAction('Add Player', props<{nPlayer: Player}>());
export const changeScore = createAction('Change Score', props<{name: string, value: number}>());
export const setNewRound = createAction('Set New Round', props<{nRound: Round}>());
export const setSituation = createAction('Set Situation', props<{situation: string}>());
export const addAnswerGif = createAction('Add Answer Gif', props<{answer: Answer}>());
export const updateWinner = createAction('Update Winner', props<{name: string}>());
export const setRoom = createAction('Set Room', props<{room: string}>());
export const flipAnswer = createAction('Flip Answer', props<{playerName: string}>());

export const playersReducer = createReducer(
  initialState.players,
  on(addPlayers, (state, {nPlayer}) => ([ ...state, ...nPlayer] )),
  on(addPlayer, (state, {nPlayer}) => ([ ...state.filter(
    (player) => player.name !== nPlayer.name
  ), nPlayer] )),
  on(changeScore, (state, {name, value}) => {
    const playerToUpdate = state.find((playerState) => playerState.name === name);
    if (playerToUpdate) {
      playerToUpdate.score = playerToUpdate.score + value;
    }
    return [...state];
  }
));

export const roundsReducer = createReducer(
  initialState.activeRound,
  on(setNewRound, (state, {nRound}) => ({
    ...nRound,
      index: state?.index? state.index + 1 : 1
  })),
  on(setSituation, (state, {situation}) => {
    return { ...state, situation };
  }),
  on(addAnswerGif, (state, {answer}) => {
    const answers = state?.answers?.filter(({playerName}) => playerName !== answer.playerName) || [];
    return { ...state, answers: [...answers, answer ] };
  }),
  on(flipAnswer, (state, {playerName}) => {
    const answers = state?.answers?.filter(({playerName: pN}) => playerName !== pN) || [];
    const answerToUpdate = state?.answers?.find(({playerName: pN}) => playerName === pN);
    if (answerToUpdate) {
      const flippedAnswer = {...answerToUpdate};
      flippedAnswer.flipped = true;
      return { ...state, answers: [...answers, flippedAnswer ] };
    } else {
      return state;
    }
  }),
  on(updateWinner, (state, {name}) => {
      return { ...state, winner: name };
  })
);

export const roomReducer = createReducer(
  initialState.room,
  on(setRoom, (state, {room}) => room),
);

export const reducers: ActionReducerMap<State> = {
  players: playersReducer,
  activeRound: roundsReducer,
  room:  roomReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
