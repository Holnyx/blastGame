export interface IUtils {
    colorOf(node: cc.Node): string;
    getCell(node: cc.Node): { row: number; col: number } | null;
    getColor?(node: cc.Node): string;
    neighbors4(row: number, col: number): Array<{ row: number; col: number }>;
    setCell(node: cc.Node, row: number, col: number): void;
}