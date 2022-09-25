import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const { listKeyPair, editSongCallback, hideEditSongModalCallback } = this.props;
        let name = "";
        if (listKeyPair) {
            name = listKeyPair.name;
        }
        return (
            <div
                class="modal"
                id="edit-song-modal"
                data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-edit-song-root'>
                    <div class="modal-north">
                        Edit Song
                    </div>
                    <div class="modal-center">

                        <label for="title" id="labelForTitle">Title</label>
                        <input name="title" type="text" id="title" height="20px"> </input>

                        <label for="artist" id="labelForArtist">Artist</label>
                        <input type="text" name="artist" id="artist"></input>

                        <label for="youTubeId" id="labelForYoutube">YoutubeID</label>
                        <input type="text" name="youTubeId" id="youTubeId"></input>

                    </div>
                    {/* <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently delete the {name} playlist?
                        </div>
                    </div> */}
                    <div class="modal-south">
                        <input type="button"
                            id="edit-song-confirm-button"
                            class="modal-button"
                            onClick={editSongCallback}
                            value='Confirm' />
                        <input type="button"
                            id="edit-song-cancel-button"
                            class="modal-button"
                            onClick={hideEditSongModalCallback}
                            value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
}