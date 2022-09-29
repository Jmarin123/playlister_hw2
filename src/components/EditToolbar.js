import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { canAddSong, canUndo, canRedo, canClose,
            undoCallback, redoCallback, closeCallback, addSongCallback, currentInModal, currentIn } = this.props;
        let addSongClass = "toolbar-button";
        let undoClass = "toolbar-button";
        let redoClass = "toolbar-button";
        let closeClass = "toolbar-button";
        if (!canAddSong || currentInModal || currentIn) addSongClass += " disabled";
        if (!canUndo || currentInModal || currentIn) undoClass += " disabled";
        if (!canRedo || currentInModal || currentIn) redoClass += " disabled";
        if (!canClose || currentInModal || currentIn) closeClass += " disabled";
        return (
            <div id="edit-toolbar">
                <input
                    type="button"
                    id='add-song-button'
                    value="+"
                    className={addSongClass}
                    disabled={!canAddSong || currentInModal || currentIn}
                    onClick={addSongCallback}
                />
                <input
                    type="button"
                    id='undo-button'
                    value="⟲"
                    className={undoClass}
                    onClick={undoCallback}
                    disabled={!canUndo || currentInModal || currentIn}
                />
                <input
                    type="button"
                    id='redo-button'
                    value="⟳"
                    className={redoClass}
                    onClick={redoCallback}
                    disabled={!canRedo || currentInModal || currentIn}
                />
                <input
                    type="button"
                    id='close-button'
                    value="&#x2715;"
                    className={closeClass}
                    onClick={closeCallback}
                    disabled={!canClose || currentInModal || currentIn}
                />
            </div>
        )
    }
}