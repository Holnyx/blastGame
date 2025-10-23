export interface ITapEvent {
	node: cc.Node;
	native?: cc.Event.EventTouch | cc.Event.EventMouse;
}
