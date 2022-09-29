import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, oldTitle, oldArtist, oldYoutube, newTitle, newArtist, newYoutube, index) {
        super();
        this.app = initApp;
        this.oldTitle = oldTitle;
        this.oldArtist = oldArtist;
        this.oldYoutube = oldYoutube;
        this.newTitle = newTitle;
        this.newArtist = newArtist;
        this.newYoutube = newYoutube;
        this.index = index;
    }

    doTransaction() {
        // console.log('Doing transaction with new song');
        // console.log(this.new);
        // this.app.editSong(this.new, this.ind);
        let item = {
            title: this.newTitle,
            artist: this.newArtist,
            youTubeId: this.newYoutube
        }
        this.app.editSong(item, this.index);
    }

    undoTransaction() {
        let item = {
            title: this.oldTitle,
            artist: this.oldArtist,
            youTubeId: this.oldYoutube
        }
        this.app.editSong(item, this.index);
    }
}