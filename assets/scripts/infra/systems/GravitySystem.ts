import { animation } from "../animation/animations";

import { IGravity } from "../../types/gravity/IGravity";
import { IGravityStore } from "../../types/gravity/IGravityStore";
import { IGravitySystem } from "../../types/gravity/IGravitySystem";
import { IUtils } from "../../types/IUtils";
import { TGridNode } from "../../types/types";

export class GravitySystem implements IGravity {
	constructor(
		private gameBoard: IGravitySystem,
		private store: IGravityStore,
		private utils: IUtils,
		private onSpawn?: (n: cc.Node) => void
	) {}
	private get rows() {
		return this.gameBoard.board.length;
	}
	private get cols() {
		return this.gameBoard.board[0]?.length ?? 0;
	}
	private gravityParams() {
		const rows = this.rows;
		const layout = this.gameBoard.layout;

		const y0 = layout.cellPosition(0, 0).y;
		const y1 = layout.cellPosition(1, 0).y;
		const downIsIncreasing = y1 < y0;

		const bottom = downIsIncreasing ? rows - 1 : 0;
		const top = downIsIncreasing ? 0 : rows - 1;
		const step = downIsIncreasing ? -1 : 1;

		return { downIsIncreasing, bottom, top, step };
	}

	applyGravityAndFill() {
		this.store.isBoardAnimating = true;
		const { bottom, top, step } = this.gravityParams();
		const board = this.gameBoard.board;
		const layout = this.gameBoard.layout;
		const factory = this.gameBoard.factory;
		const cols = this.cols;
		const last = top + step;
		const PAD = 0.2; //скорость падения кубиков на поле
		const SAFETY = 1; //таймер, ждем пока все анимации закончатся

		const fall = (node: cc.Node, toRow: number, col: number) => {
			const position = layout.cellPosition(toRow, col);
			animation(node, position, {
				duration: PAD,
				easing: "quadIn",
				bringToFront: true,
			});
		};

		for (let col = 0; col < cols; col++) {
			// прижать к дну
			let write = bottom;
			for (let row = bottom; row !== last; row += step) {
				const node = board[row][col] as TGridNode;
				if (!node) continue;

				if (row !== write) {
					board[row][col] = null;
					board[write][col] = node;
					node.__row = write;
					node.__col = col;
					fall(node, write, col);
				}
				node.zIndex = 0;
				write += step;
			}

			// новые сверху
			for (let row = write; row !== last; row += step) {
				const node = factory.create(row, col);
				this.utils.setCell(node, row, col);
				board[row][col] = node;
				this.onSpawn?.(node);
			}
		}

		this.gameBoard.scheduleOnce(() => {
			this.store.isBoardAnimating = false;
			this.gameBoard.onBoardStabilized?.();
		}, SAFETY);
	}
}
