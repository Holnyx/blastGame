type BlobOpts = {
	colorsLimit?: number;
};

export  class ZoneBlobIconProvider {
	private icons: cc.SpriteFrame[];
	private limit: number;

	constructor(allIcons: cc.SpriteFrame[], opts: BlobOpts) {
		const maxWanted = opts.colorsLimit ?? allIcons.length;
		this.limit = Math.max(1, Math.min(allIcons.length, maxWanted));
		this.icons = allIcons.slice(0, this.limit);
	}

	random(): cc.SpriteFrame {
		const i = Math.floor(Math.random() * this.limit);
		return this.icons[i];
	}
}
