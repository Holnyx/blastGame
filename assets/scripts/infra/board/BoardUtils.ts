import { CubeSelect } from "../../components/cube/CubeSelect";

import { TGridNode } from "../../types/types";

interface IBoardUtils {
	rows: number;
	cols: number;
}

export class BoardUtils {
	constructor(private gameBoard: IBoardUtils) {}

	colorOf(node: cc.Node): string {
		return node.getComponent(CubeSelect)?.colorKey ?? "";
	}

	getCell(node: TGridNode): { row: number; col: number } | null {
		const row = node.__row;
		const col = node.__col;
		return Number.isInteger(row) && Number.isInteger(col) ? { row, col } : null;
	}

	setCell(node: cc.Node, row: number, col: number) {
		const gridNode = node as TGridNode;
		gridNode.__row = row;
		gridNode.__col = col;
	}

	neighbors4(row: number, col: number) {
		const out: { row: number; col: number }[] = [];
		if (row > 0) out.push({ row: row - 1, col });
		if (row < this.gameBoard.rows - 1) out.push({ row: row + 1, col });
		if (col > 0) out.push({ row, col: col - 1 });
		if (col < this.gameBoard.cols - 1) out.push({ row, col: col + 1 });
		return out;
	}
}
