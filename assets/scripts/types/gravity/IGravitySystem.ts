import { IGridLayout } from "../../core/board/GridLayout";
import { ICubeFactory } from "../ICubeFactory";

export interface IGravitySystem {
	board: (cc.Node | null)[][];
	layout: IGridLayout;
	factory: ICubeFactory;
	scheduleOnce(callback: (deltaTime?: number) => void, delay?: number): void;
	onBoardStabilized?: () => void;
}