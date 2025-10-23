export class NodeGrid {
	private grid: cc.Node[][];

	constructor(
		public readonly rows: number,
		public readonly cols: number
	) {
		this.grid = Array.from({ length: rows }, () => new Array<cc.Node>(cols));
	}

	set(row: number, col: number, node: cc.Node) {
		this.grid[row][col] = node;
	}

	get(row: number, col: number): cc.Node {
		return this.grid[row][col];
	}

	toArray(): cc.Node[][] {
		return this.grid.map(row => row.slice());
	}
}
