import { animation } from "../../infra/animation/animations";
import { CubeSelect } from "../cube/CubeSelect";

import { IGridLayout } from "../../core/board/GridLayout";
import { IBoardConfig } from "../../types/IBoardConfig";
import { TGridNode } from "../../types/types";

type TIconProvider = {
	random(): cc.SpriteFrame;
};

export class PrefabCubeFactory {
	constructor(
		private prefab: cc.Prefab,
		private icons: TIconProvider,
		private layout: IGridLayout,
		private parent: cc.Node,
		private config: IBoardConfig
	) {}

	ensureSprite(cube: cc.Node): cc.Sprite {
		const iconNode = new cc.Node("Icon");
		cube.addChild(iconNode);
		return iconNode.getComponent(cc.Sprite) || iconNode.addComponent(cc.Sprite);
	}

	create(row: number, col: number): cc.Node {
		const cube = cc.instantiate(this.prefab) as TGridNode;
		cube.setContentSize(this.config.cellSize, this.config.cellSize);
		cube.zIndex = 0;
		this.parent.addChild(cube);
		const sprite = this.ensureSprite(cube);
		sprite.spriteFrame = this.icons.random();
		sprite.sizeMode = cc.Sprite.SizeMode.RAW;
		const select =
			cube.getComponent(CubeSelect) ?? cube.addComponent(CubeSelect);
		select.colorKey = sprite.spriteFrame ? sprite.spriteFrame.name : "";

		cube.__row = row;
		cube.__col = col;

		const target = this.layout.cellPosition(row, col);
		animation(cube, target, (row + col) * 0.02);
		return cube;
	}
}
