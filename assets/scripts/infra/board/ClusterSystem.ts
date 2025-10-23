import { IGravitySystem } from "../../types/gravity/IGravitySystem";
import { IConfig } from "../../types/IConfig";
import { IUtils } from "../../types/IUtils";

export class ClusterSystem {
	constructor(
		private gameBoard: IGravitySystem,
		private utils: IUtils,
		private store: IConfig
	) {}

	private countComponent(
		startRow: number,
		startCol: number,
		key: string,
		out: Array<{ row: number; col: number }>
	): number {
		const rows = this.store.rows;
		const cols = this.store.cols;
		const board = this.gameBoard.board;
		const colorOf = (node: cc.Node) => this.utils.colorOf(node);
		const start = board[startRow]?.[startCol];
		const seen = new Uint8Array(rows * cols);
		const queue: Array<{ row: number; col: number }> = [
			{ row: startRow, col: startCol },
		];
		const indexOf = (row: number, col: number) => row * cols + col;
		let count = 0;

		if (!start || colorOf(start) !== key) return 0;
		seen[indexOf(startRow, startCol)] = 1;

		for (let i = 0; i < queue.length; i++) {
			const { row, col } = queue[i];
			out?.push({ row, col });
			count++;
			for (const neighbor of this.utils.neighbors4(row, col)) {
				const neighborRow = neighbor.row;
				const neighborCol = neighbor.col;
				const node = board[neighborRow][neighborCol];
				const k = indexOf(neighborRow, neighborCol);

				if (seen[k]) continue;

				if (!node || colorOf(node) !== key) continue;

				seen[k] = 1;
				queue.push({ row: neighborRow, col: neighborCol });
			}
		}

		return count;
	}

	collectCluster(start: cc.Node): cc.Node[] {
		const colorOf = (node: cc.Node) => this.utils.colorOf(node);
		const getCell = (node: cc.Node) => this.utils.getCell(node);
		const neighbors = (row: number, col: number) =>
			this.utils.neighbors4(row, col);
		const key = colorOf(start);
		const res: cc.Node[] = [];
		const seen = new Set<cc.Node>([start]);
		const queue: cc.Node[] = [start];

		if (!key) return [start];

		for (let i = 0; i < queue.length; i++) {
			const node = queue[i];
			res.push(node);
			const { row, col } = getCell(node)!;

			for (const cell of neighbors(row, col)) {
				const { row, col } = cell;
				const node = this.gameBoard.board[row][col];

				if (!node || seen.has(node) || colorOf(node) !== key) continue;
				seen.add(node);
				queue.push(node);
			}
		}

		return res;
	}

	hasAnyMove(): boolean {
		const need = Math.max(3, this.store.minCluster | 0);
		const rows: number = this.store.rows;
		const cols: number = this.store.cols;
		const processed: boolean[][] = Array.from({ length: rows }, () =>
			Array(cols).fill(false)
		);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (processed[r][c]) continue;
				const node = this.gameBoard.board[r][c];
				const key = this.utils.colorOf(node);

				if (!node) {
					processed[r][c] = true;
					continue;
				}

				if (!key) {
					processed[r][c] = true;
					continue;
				}

				const comp: Array<{ row: number; col: number }> = [];
				const count = this.countComponent(r, c, key, comp);

				for (const p of comp) processed[p.row][p.col] = true;

				if (count >= need) return true;
			}
		}
		return false;
	}
}
