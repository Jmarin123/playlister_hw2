import React from "react";

export default class SidebarHeading extends React.Component {
    handleClick = (event) => {
        const { createNewListCallback } = this.props;
        createNewListCallback();
    };
    render() {
        const { canAddList, currentInModal, currentIn } = this.props;
        let toolBarClass = 'toolbar-button';
        if (canAddList || currentInModal || currentIn) toolBarClass += " disabled";
        return (
            <div id="sidebar-heading">
                <input
                    type="button"
                    id="add-list-button"
                    className={toolBarClass}
                    onClick={this.handleClick}
                    disabled={canAddList || currentInModal || currentIn}
                    value="+" />
                Your Playlists
            </div>
        );
    }
}