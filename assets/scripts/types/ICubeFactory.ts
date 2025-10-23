export interface ICubeFactory {
	create(row: number, col: number): cc.Node;
}
