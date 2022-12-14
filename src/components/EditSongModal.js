import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const { listKeyPair, editSongCallback, hideEditSongModalCallback } = this.props;
        //let name = "";
        let youtubeID = "";
        let title = "";
        let artist = "";
        if (listKeyPair) {
            title = listKeyPair.title;
            youtubeID = listKeyPair.youTubeId
            artist = listKeyPair.artist;
        }
        return (
            <div
                className="modal"
                id="edit-song-modal"
                data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-edit-song-root'>
                    <div className="modal-north">
                        Edit Song
                    </div>
                    <div className="modal-center">

                        <label htmlFor="title" id="labelForTitle">Title</label>
                        <input name="title" type="text" id="title" height="20px" defaultValue={title} />

                        <label htmlFor="artist" id="labelForArtist">Artist</label>
                        <input type="text" name="artist" id="artist" defaultValue={artist} />

                        <label htmlFor="youTubeId" id="labelForYoutube">YoutubeID</label>
                        <input type="text" name="youTubeId" id="youTubeId" defaultValue={youtubeID} />

                    </div>
                    <div className="modal-south">
                        <input type="button"
                            id="edit-song-confirm-button"
                            className="modal-button"
                            onClick={editSongCallback}
                            value='Confirm' />
                        <input type="button"
                            id="edit-song-cancel-button"
                            className="modal-button"
                            onClick={hideEditSongModalCallback}
                            value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
}