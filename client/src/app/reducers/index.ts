import {
  ActionReducer,
  ActionReducerMap, createAction,
  createFeatureSelector, createReducer,
  createSelector,
  MetaReducer, on, props
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {Player} from "../model/player.model";
import {Round} from "../model/round.model";

export interface State {
  players: Player[],
  activeRound?: Round,
  room?: string
}

export const initialState: State = {
  players: []
};

export const selectPlayers = (state: State) => state.players;
export const selectRound = (state: State) => state.activeRound;

export const addPlayers = createAction('Add Players', props<{nPlayer: Player[]}>());
export const changeScore = createAction('Change Score', props<{name: string, value: number}>());
export const setNewRound = createAction('Set New Round', props<{nRound: Round}>());
export const updateWinner = createAction('UpdateWinner', props<{name: string}>());
export const setRoom = createAction('setRoom', props<{room: string}>());

export const playersReducer = createReducer(
  initialState.players,
  on(addPlayers, (state, {nPlayer}) => ([ ...state, ...nPlayer] )),
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
  on(setNewRound, (state, {nRound}) => nRound),
  on(updateWinner, (state, {name}) => {
    if(state) {
      return { ...state, winner: name };
    }
    return {
      situation: "",
      answers: [],
      winner: name
    };
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