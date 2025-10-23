import { bus, GameEvent } from "../../infra/events/gameEvents";

const { ccclass } = cc._decorator;

@ccclass
export class MovesCount extends cc.Component {
	private label: cc.Label | null = null;
	private movesLeft: number = 0;

	onLoad() {
		this.label = this.getComponent(cc.Label);
		if (!this.label) {
			cc.error("[MovesCount] На той же ноде должен быть cc.Label");
		} else {
			this.render();
		}
	}

	onEnable() {
		bus.on(GameEvent.MovesChanged, this.onMovesChanged, this);
	}
	onDisable() {
		bus.off(GameEvent.MovesChanged, this.onMovesChanged, this);
	}

	private onMovesChanged(value: number) {
		this.movesLeft = value;
		this.render();
	}

	private render() {
		if (!this.label) return;
		if (this.label) this.label.string = String(this.movesLeft);
	}
}
