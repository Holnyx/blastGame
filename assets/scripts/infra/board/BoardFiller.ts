import { NodeGrid } from "./NodeGrid";

import { ICubeFactory } from "../../types/ICubeFactory";

export class BoardFiller {
	constructor(
		private grid: NodeGrid,
		private factory: ICubeFactory
	) {}

	fill() {
		for (let r = 0; r < this.grid.rows; r++) {
			for (let c = 0; c < this.grid.cols; c++) {
				const node = this.factory.create(r, c);
				this.grid.set(r, c, node);
			}
		}
	}
}
