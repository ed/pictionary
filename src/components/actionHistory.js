export class ActionHistory {
	constructor(clear) {
		this.clear = clear;
		this.list = [];
		this.position = 0;
	}

	undoAction() {
		if( this.position > 0){
			this.clear();
			this.position--;
			for (var i = 0; i < this.position; i++){
				this.list[i].do();
			}
		}
	}

	pushAction(action) {
		this.list = this.list.slice(0,this.position);
		this.list.push(action);
		this.position = this.list.length;
	}

	redoAction() {
		if( this.position < this.list.length ){
			this.list[this.position].do();
			this.position++;
		}
	}
}