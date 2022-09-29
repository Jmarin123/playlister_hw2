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
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, deletedTitle, deletedArtist, deletedYoutube, index) {
        super();
        this.app = initApp;
        this.deletedTitle = deletedTitle;
        this.deletedArtist = deletedArtist;
        this.deletedYoutube = deletedYoutube;
        this.index = index;
    }

    doTransaction() {
        // let createOld = {
        //     title: this.deletedTitle,
        //     artist: this.deletedArtist,
        //     youTubeId: this.deletedYoutube
        // }
        // console.log('Supposed to delete!');
        // console.log(createOld);
        this.app.deleteSong(this.index - 1);
    }

    undoTransaction() {
        //this.app.addSong();
        //let getLastIndex = this.app.getPlaylistSize();
        let createOld = {
            title: this.deletedTitle,
            artist: this.deletedArtist,
            youTubeId: this.deletedYoutube
        }
        //this.app.editSong(createOld, getLastIndex);
        this.app.moveEdit(createOld, this.index - 1)
    }
}