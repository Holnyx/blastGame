const { ccclass, property } = cc._decorator;

import { animation } from "../../infra/animation/animations";

@ccclass
export class ResultPanelView extends cc.Component {
	@property({ type: cc.Node }) container: cc.Node = null;
	@property({ type: cc.Label }) titleLabel: cc.Label = null;
	@property victoryTitle: string = "Победа";
	@property defeatTitle: string = "Поражение";

	private ensureInit() {
		if (!this.container || !cc.isValid(this.container))
			this.container = this.node;
		if (!this.container.getComponent(cc.BlockInputEvents)) {
			this.container.addComponent(cc.BlockInputEvents);
		}
	}

	public show(isWin: boolean) {
		this.ensureInit();
		if (this.titleLabel) {
			this.titleLabel.string = isWin ? this.victoryTitle : this.defeatTitle;
		}

		const parent = this.container.parent;
		if (parent) this.container.setSiblingIndex(parent.childrenCount - 1);

		animation(this.container, "show");
	}

	public hide() {
		this.ensureInit();
		if (!this.container.active) return;

		animation(this.container, "hide");
	}

	public onRestartClicked() {
		const scene = cc.director.getScene()?.name;
		if (scene) cc.director.loadScene(scene);
	}
}
