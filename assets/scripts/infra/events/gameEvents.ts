export enum GameEvent {
	MovesChanged = "moves:changed",
	ScoreChanged = "score:changed",
	ScoreGoalChanged = "score:goal-changed",
}

export const bus = new cc.EventTarget();
