import {
  ActionReducerMap, createAction, createReducer,
  MetaReducer, on, props
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {Player} from "../model/player.model";
import {Answer, Round} from "../model/round.model";
import {randomInt} from "../util";

export interface State {
  players: Player[],
  activeRound?: Round,
  room?: string,
}

export const initialState: State = {
  players: [],
};

/*export const selectPlayers = (state: State) => state.players;
export const selectRound = (state: State) => state.activeRound;*/

export const addPlayers = createAction('Add Players', props<{nPlayer: Player[]}>());
export const addPlayer = createAction('Add Player', props<{nPlayer: Player}>());
export const removePlayer = createAction('Remove Player', props<{name: string}>());
export const changeScore = createAction('Change Score', props<{name: string, value: number}>());
export const updateMaster = createAction('Update Master', props<{name: string}>());
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
  on(removePlayer, (state, {name}) => {
    const newState = [...state.filter((player) => player.name !== name)];
    const toRemoveIndex = state.findIndex((pl) => name === pl.name);
    if(state[toRemoveIndex]?.isMaster) {
      const newMaster = state[(toRemoveIndex + 1) % state.length];
      const newMasterIndex = newState.findIndex((pl) => newMaster.name === pl.name);
      newState[newMasterIndex].isMaster = true;
    }
    return newState;
  }),
  on(changeScore, (state, {name, value}) => {
    const newState = [...state];
    const playerToUpdate = state.findIndex((playerState) => playerState.name === name);
    newState[playerToUpdate] = {
      ...state[playerToUpdate],
      score: state[playerToUpdate].score + value
    };
    return newState;
  }),
  on(updateMaster, (state, {name}) => {
    const newState = [...state];
    const currentMasterIndex = state.findIndex((playerState) => playerState.isMaster);
    const newMasterIndex =  state.findIndex((playerState) => playerState.name === name);
    newState[currentMasterIndex] = {
      ...state[currentMasterIndex],
      isMaster: false
    }
    newState[newMasterIndex] = {
      ...state[newMasterIndex],
      isMaster: true
    };
    return newState;
    }
));

export const roundsReducer = createReducer(
  initialState.activeRound,
  on(setNewRound, (state, {nRound}) => {
    console.log("set new round", nRound);
    return{
    ...nRound,
      index: state?.index? state.index + 1 : 1
  }}),
  on(setSituation, (state, {situation}) => {
    return { ...state, situation };
  }),
  on(addAnswerGif, (state, {answer}) => {
    const answers = state?.answers?.filter(({playerName}) => playerName !== answer.playerName) || [];
    answers.splice(randomInt(0,answers.length), 0, answer);
    return { ...state, answers };
  }),
  on(flipAnswer, (state, {playerName}) => {
      return { ...state, flippedAnswers: state?.flippedAnswers?.add(playerName) ?? new Set([playerName]) };
  }),
  on(updateWinner, (state, {name}) => {
    console.log(name);
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
