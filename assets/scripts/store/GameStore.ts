const { ccclass, property } = cc._decorator;

import { gameState } from "../app/gameState";
import { ResultPanelView } from "../components/panels/ResultPanelView";

import { IGameRuntime } from "../types/IGameRuntime";

@ccclass
export class GameStore extends cc.Component implements IGameRuntime {
	@property rows: number = 9;
	@property cols: number = 9;
	@property cellSize: number = 100;
	@property minCluster: number = 3;
	@property totalMoves: number = 25;
	@property scoreGoal: number = 500;
	@property shuffleDuration: number = 0.25;
	@property shuffleCountStart: number = 3;
	@property({ type: cc.Integer, range: [1, 5, 1], slide: true })
	colorsLimit: number = 5;

	resultPanel: ResultPanelView;
	autoShuffleLeft: number = 0;
	fallDurationPerCell: number = 0.06;
	isAutoShuffling: boolean = false;
	gameEnded: boolean = false;
	isBoardAnimating: boolean = false;

	get movesLeft() {
		return gameState.moves;
	}
	get score() {
		return gameState.score;
	}

	get scoreGoalRO() {
		return gameState.goal;
	}

	set movesLeft(value: number) {
		gameState.setMoves(value | 0);
	}
	set score(value: number) {
		gameState.setScore(value | 0);
	}

	initLevelState() {
		this.score = 0;
		this.movesLeft = this.totalMoves;
		gameState.setGoal(this.scoreGoal);
		this.gameEnded = false;
		this.isBoardAnimating = false;
		this.isAutoShuffling = false;
		this.autoShuffleLeft = Math.max(0, this.shuffleCountStart | 0);
	}
}
