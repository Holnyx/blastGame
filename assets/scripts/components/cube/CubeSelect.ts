const { ccclass } = cc._decorator;

@ccclass
export  class CubeSelect extends cc.Component {
	static readonly Events = {
		TAP: "cube:tap",
		SELECTED: "cube:selected",
		DESELECTED: "cube:deselected",
	};

	colorKey: string = "";
	private target: cc.Node | null = null;

	onEnable() {
		this.target = this.node;
		this.target.on(cc.Node.EventType.TOUCH_END, this.onTap, this);
	}

	onDisable() {
		this.target.off(cc.Node.EventType.TOUCH_END, this.onTap, this);
	}

	private onTap = (e: cc.Event.EventTouch | cc.Event.EventMouse) => {
		const event = new cc.Event.EventCustom(CubeSelect.Events.TAP, true);
		event.setUserData({ node: this.node, component: this, native: e });
		this.node.dispatchEvent(event);
	};
}
