const { ccclass, property } = cc._decorator;

import { GameStore } from "../../store/GameStore";

import { IGravitySystem } from "../../types/gravity/IGravitySystem";
import { IGridLayout } from "../../core/board/GridLayout";
import { IGravity } from "../../types/gravity/IGravity";
import { ICubeFactory } from "../../types/ICubeFactory";

@ccclass
export class GameBoard extends cc.Component implements IGravitySystem {
	@property(cc.Prefab) cubePrefab: cc.Prefab = null;
	@property([cc.SpriteFrame]) cubeIcons: cc.SpriteFrame[] = [];
	@property(GameStore) store: GameStore = null;

	shuffleCount = 0;
	board: cc.Node[][] = [];
	layout: IGridLayout;
	factory: ICubeFactory | null = null;
	gravity: IGravity;
	onBoardStabilized: () => void;

	start() {
		if (!this.cubePrefab) {
			cc.error("Cube Prefab не установлен");
			return;
		}
		if (!this.cubeIcons?.length) {
			cc.error("Список иконок пуст");
			return;
		}
	}

	attachBuilt(value: {
		board: cc.Node[][];
		layout: IGridLayout;
		factory: ICubeFactory;
	}) {
		this.board = value.board;
		this.layout = value.layout;
		this.factory = value.factory;
	}
}
