import React from "react";

export default class SongCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDragging: false,
            draggedTo: false,
        }
    }
    handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id);
        this.setState(prevState => ({
            isDragging: true,
            draggedTo: prevState.draggedTo
        }));
    }
    handleDragOver = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragEnter = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: false
        }));
    }
    handleDrop = (event) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);

        this.setState(prevState => ({
            isDragging: false,
            draggedTo: false
        }));

        // ASK THE MODEL TO MOVE THE DATA
        this.props.moveCallback(sourceId, targetId);
    }
    handleClick = (event) => {
        event.preventDefault();
        this.props.deleteSongCallback(this.props.song, this.getItemNum());
    }
    handleDbClick = (event) => {
        event.preventDefault();
        this.props.editSongCallback(this.props.song, this.getItemNum());
    }

    getItemNum = () => {
        return this.props.id.substring("playlist-song-".length);
    }

    render() {
        const { song } = this.props;
        let num = this.getItemNum();
        //console.log("num: " + num);
        let itemClass = "playlister-song unselected-list-card";
        if (this.state.draggedTo) {
            itemClass = "playlister-song-dragged-to";
        }
        let youtubeURL = `https://www.youtube.com/watch?v=${song.youTubeId}`
        return (
            <div
                id={'song-' + num}
                className={itemClass}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                draggable="true"
                onDoubleClick={this.handleDbClick}
            >
                <span id={'song-' + num}>
                    {num}.
                    <a href={youtubeURL} className="song-span" id={'song-' + num}>{song.title} by {song.artist}</a>
                </span>
                <div>
                    <input type="button" value="✕" id={'song-' + num} onClick={this.handleClick} />
                </div>
            </div>
        )
    }
}