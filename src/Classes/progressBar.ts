export class ProgressBar {
	private barLength: number;
	private barChar: string;
	private bar: string;
	private value: number;
	private total: number;
	private filename: string;

	constructor(
		filename: string,
		total: number,
		barLength: number = 20,
		barChar: string = "█",
	) {
		this.barLength = barLength;
		this.barChar = barChar;
		this.bar = "";
		this.value = 0;
		this.total = total;
		this.filename = filename;
	}

	public update(value: number) {
		this.value = value;
		const progress = Math.round((this.value / this.total) * this.barLength);
		this.bar = `${this.barChar.repeat(progress)}${" ".repeat(this.barLength - progress)}`;
	}

	public toString() {
		return `${this.bar} ${Math.round((this.value / this.total) * 100)}%\n${this.filename}`;
	}
}
