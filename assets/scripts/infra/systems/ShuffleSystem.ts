import { fisherYates } from "../../core/board/shuffle/fisherYates";
import { animation } from "../animation/animations";

import { IGravitySystem } from "../../types/gravity/IGravitySystem";
import { IUtils } from "../../types/IUtils";
import { TStore } from "../../types/types";

export class ShuffleSystem {
	constructor(
		private gameBoard: IGravitySystem,
		private utils: IUtils,
		private store: TStore
	) {}

	shuffleBoard(done?: (ok: boolean) => void) {
		if (this.store.isBoardAnimating) return done?.(false);
		this.store.isBoardAnimating = true;
		const { rows, cols, cellSize, shuffleDuration } = this.store;
		const { layout } = this.gameBoard;
		const board = this.gameBoard.board;
		const cells: { node: cc.Node; row: number; col: number; color: string }[] =
			[];

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const node = board[r][c];
				if (node)
					cells.push({
						node: node,
						row: r,
						col: c,
						color: this.utils.colorOf(node),
					});
			}
		}
		if (!cells.length) {
			this.store.isBoardAnimating = false;
			return;
		}

		const targets = cells.map(({ row, col }) => ({ row, col }));
		fisherYates(targets);

		for (let i = 0; i < cells.length; i++) {
			const node = cells[i].node;
			const { row, col } = targets[i];
			const position = layout.cellPosition(row, col);
			const durationX = node.x - position.x;
			const durationY = node.y - position.y;
			const dist = Math.sqrt(durationX * durationX + durationY * durationY);
			const duration = Math.max(
				0.12,
				Math.min(shuffleDuration, dist / (cellSize * 10))
			);

			node.zIndex = row * cols + col;
			animation(node, position, { duration, easing: "quadInOut" });

			this.utils.setCell(node, row, col);
			board[row][col] = node;
		}

		this.gameBoard.scheduleOnce(() => {
			this.store.isBoardAnimating = false;
			done?.(true);
		}, 0.02);
	}
}
