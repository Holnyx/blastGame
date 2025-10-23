export function fisherYates<T>(arr: T[]) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = (Math.random() * (i + 1)) | 0; // |0 === Math.floor()
		const tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
