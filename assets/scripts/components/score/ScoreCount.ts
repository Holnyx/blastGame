const { ccclass } = cc._decorator;

import { bus, GameEvent } from "../../infra/events/gameEvents";
import { gameState } from "../../app/gameState";

@ccclass
export class ScoreCount extends cc.Component {
	private label: cc.Label | null = null;
	private score = 0;
	private goal = 0;

	onLoad() {
		this.label = this.getComponent(cc.Label);
		this.score = gameState.score;
		this.goal = gameState.goal;
		this.render();
	}

	onEnable() {
		bus.on(GameEvent.ScoreChanged, this.onScore, this);
		bus.on(GameEvent.ScoreGoalChanged, this.onGoal, this);
	}
	onDisable() {
		bus.off(GameEvent.ScoreChanged, this.onScore, this);
		bus.off(GameEvent.ScoreGoalChanged, this.onGoal, this);
	}

	private onScore = (n: number) => {
		this.score = n;
		this.render();
	};
	private onGoal = (g: number) => {
		this.goal = g;
		this.render();
	};

	private render() {
		if (!this.label) return;
		this.label.string = `${this.score}/${this.goal}`;
	}
}
