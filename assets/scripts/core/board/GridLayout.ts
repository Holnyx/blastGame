import { IBoardConfig } from "../../types/IBoardConfig";

export interface IGridLayout {
	cellPosition(row: number, col: number): cc.Vec2;
}

export class GridLayout implements IGridLayout {
	constructor(private config: IBoardConfig) {}

	cellPosition(row: number, col: number): cc.Vec2 {
		const totalW = this.config.cols * this.config.cellSize;
		const totalH = this.config.rows * this.config.cellSize;

		const startX = -totalW / 2 + this.config.cellSize / 2;
		const startY = -totalH / 2 + this.config.cellSize / 2;

		const x = startX + col * this.config.cellSize;
		const y = startY + row * this.config.cellSize;
		return cc.v2(x, y);
	}
}
