import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';
import AddSong_Transaction from './transactions/AddSong_Transaction';
import EditSong_Transaction from './transactions/EditSong_Transaction';
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';
// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal.js';
import EditSongModal from './components/EditSongModal';
import DeleteSongModal from './components/DeleteSongModal';
// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            listKeyPairMarkedForDeletion: null,
            currentList: null,
            sessionData: loadedSessionData,
            markedSong: null,
            currentSong: null
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            songs: []
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            },
            markedSong: null,
            currentSong: null
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList = null;
        if (this.state.currentList) {
            if (this.state.currentList.key !== key) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList = this.state.currentList;
            }
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs
            },
            markedSong: null,
            currentSong: null
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    editSong = (songToEdit, indexOfOriginal) => {
        let getSongs = this.state.currentList;
        getSongs.songs[indexOfOriginal - 1].title = songToEdit.title;
        getSongs.songs[indexOfOriginal - 1].artist = songToEdit.artist;
        getSongs.songs[indexOfOriginal - 1].youTubeId = songToEdit.youTubeId;
        this.setStateWithUpdatedList(getSongs);
    }
    deleteSong = (setIndex) => {
        let getCurrentList = this.state.currentList;
        //if (getCurrentList) {
        getCurrentList.songs = getCurrentList.songs.filter((getSong, index) => index !== setIndex);
        this.setStateWithUpdatedList(getCurrentList);
        //}
    }
    moveEdit = (newEditSong, index) => {
        let getCurrentList = this.state.currentList;
        getCurrentList.songs.splice(index, 0, newEditSong);
        this.setStateWithUpdatedList(getCurrentList);
    }
    editMarkedSong = () => {
        let newTitle = document.getElementById("title").value;
        let newArtist = document.getElementById("artist").value;
        let newYoutube = document.getElementById("youTubeId").value;
        let transaction = new EditSong_Transaction(this, this.state.markedSong.title, this.state.markedSong.artist, this.state.markedSong.youTubeId, newTitle, newArtist, newYoutube, this.state.currentSong); //app, oldsong, newsong, index
        this.tps.addTransaction(transaction);
        //THIS WILL BE PUT INTO THE TRANSACTION THIS INFO NEEDS TO BE SAVED AND THEN
        this.hideEditSongModal();
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
        this.hideDeleteListModal();
    }
    deleteMarkedSong = () => {
        //this.deleteSong(this.state.markedSong);
        let transaction = new DeleteSong_Transaction(this, this.state.markedSong.title, this.state.markedSong.artist, this.state.markedSong.youTubeId, this.state.currentSong)
        this.tps.addTransaction(transaction);
        this.hideDeleteSongModal();
    }
    // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            },
            markedSong: null,
            currentSong: null
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData,
            markedSong: null,
            currentSong: null
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {

        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData,
            markedSong: null,
            currentSong: null
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED

        });
    }
    setStateWithUpdatedList(list) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            currentList: list,
            sessionData: this.state.sessionData,
            markedSong: null,
            currentSong: null
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
        });
    }
    getPlaylistSize = () => {
        return this.state.currentList.songs.length;
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start, end) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list);
    }
    addSong = () => {
        let defaultSong = {
            title: 'Untitled',
            artist: 'Unknown',
            youTubeId: 'dQw4w9WgXcQ'
        }
        let currentList = this.state.currentList;
        currentList.songs.push(defaultSong);
        this.setStateWithUpdatedList(currentList);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }
    addSongTransaction = () => {
        let transaction = new AddSong_Transaction(this);
        this.tps.addTransaction(transaction);
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    markListForDeletion = (keyPair) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: keyPair,
            sessionData: prevState.sessionData,
            currentSong: null,
            markedSong: null
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
        });
    }
    markSongForEdit = (song, index) => {
        //console.log(song);
        document.getElementById("title").value = song.title
        document.getElementById("artist").value = song.artist
        document.getElementById("youTubeId").value = song.youTubeId
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            sessionData: prevState.sessionData,
            markedSong: song,
            currentSong: index
        }), () => {
            this.showEditSongModal();
        });
    }

    markSongForDeletion = (song, index) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: null,
            sessionData: prevState.sessionData,
            currentSong: index,
            markedSong: song
        }), () => {
            // PROMPT THE USER
            this.showDeleteSongModal();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    //If they reall wanna delete the modal
    showEditSongModal() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    //Hiding the modal
    hideEditSongModal() {
        // PROMPT THE USER
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    //If they really wanna delete the song
    showDeleteSongModal() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    //Hide the delete song
    hideDeleteSongModal() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    handleKeyPress = (e) => {
        if (e.ctrlKey && e.code === 'KeyZ') {
            console.log("Hey i made cntrl z!");
        } else if (e.ctrlKey && e.code === 'KeyY') {
            console.log("Hey I made it for cntrl y!");
        }
    }

    render() {
        let canAddSong = this.state.currentList !== null;
        let canUndo = this.tps.hasTransactionToUndo();
        let canRedo = this.tps.hasTransactionToRedo();
        let canClose = this.state.currentList !== null;
        return (
            <div id="root" onKeyDown={this.handleKeyPress} tabIndex="0">
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <EditToolbar
                    canAddSong={canAddSong}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    canClose={canClose}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList}
                    addSongCallback={this.addSongTransaction}
                />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction}
                    editSongCallback={this.markSongForEdit}
                    deleteSongCallback={this.markSongForDeletion} />
                <Statusbar
                    currentList={this.state.currentList} />
                <DeleteListModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList}
                />
                <DeleteSongModal
                    listKeyPair={this.state.markedSong}
                    hideDeleteSongModalCallback={this.hideDeleteSongModal}
                    deleteSongCallback={this.deleteMarkedSong}
                />
                <EditSongModal
                    listKeyPair={this.state.markedSong}
                    hideEditSongModalCallback={this.hideEditSongModal}
                    editSongCallback={this.editMarkedSong}
                />
            </div>
        );
    }
}

export default App;
