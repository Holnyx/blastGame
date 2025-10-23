import { bus, GameEvent } from "../infra/events/gameEvents";

export const gameState = {
	moves: 0,
	score: 0,
	goal: 0,

	setMoves(number: number) {
		const next = Math.max(0, number | 0);
		if (next === this.moves) return;
		this.moves = next;
		bus.emit(GameEvent.MovesChanged, this.moves);
	},

	setScore(number: number) {
		const capped = this.goal > 0 ? Math.min(this.goal, number | 0) : number | 0;
		const next = Math.max(0, capped);
		if (next === this.score) return;
		this.score = next;
		bus.emit(GameEvent.ScoreChanged, this.score);
	},
	addScore(delta: number) {
		this.setScore(this.score + (delta | 0));
	},

	setGoal(number: number) {
		const next = Math.max(0, number | 0);
		if (next === this.goal) return;
		this.goal = next;
		bus.emit(GameEvent.ScoreGoalChanged, this.goal);
	},
};
