export interface IConfig {
	readonly rows: number;
	readonly cols: number;
	readonly cellSize: number;
	readonly minCluster: number;
	readonly colorsLimit: number;
	readonly fallDurationPerCell: number;
	readonly shuffleDuration: number;
	readonly shuffleCountStart: number;
	readonly scoreGoal: number;
	readonly totalMoves: number;
}
