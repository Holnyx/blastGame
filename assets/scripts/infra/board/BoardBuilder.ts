import { PrefabCubeFactory } from "../../components/factories/PrefabCubeFactory";
import { ZoneBlobIconProvider } from "../resources/ZoneBlobIconProvider";
import { BoardFiller } from "./BoardFiller";
import { NodeGrid } from "./NodeGrid";

import { IGridLayout, GridLayout } from "../../core/board/GridLayout";
import { IBoardConfig } from "../../types/IBoardConfig";
import { ICubeFactory } from "../../types/ICubeFactory";

type TBoardBuilder = {
	config: IBoardConfig;
	cubePrefab: cc.Prefab;
	cubeIcons: cc.SpriteFrame[];
	parent: cc.Node;
	colorsLimit: number;
};

export class BoardBuilder {
	constructor(private depend: TBoardBuilder) {}

	build(): {
		layout: IGridLayout;
		factory: ICubeFactory;
		board: cc.Node[][];
	} {
		const { config, cubePrefab, cubeIcons, parent, colorsLimit } = this.depend;

		const layout = new GridLayout(config);
		const icons = new ZoneBlobIconProvider(cubeIcons, { colorsLimit });

		const factory: ICubeFactory = new PrefabCubeFactory(
			cubePrefab,
			icons,
			layout,
			parent,
			config
		);

		const grid = new NodeGrid(config.rows, config.cols);
		new BoardFiller(grid, factory).fill();

		return {
			layout,
			factory,
			board: grid.toArray(),
		};
	}
}
