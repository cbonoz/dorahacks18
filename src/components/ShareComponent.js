import React, { Component } from 'react';

class ShareComponent extends Component {
    render() {
        return (
            <div className="share-bar">
                <i class="fab fa-facebook-square fa-3x"></i>&nbsp;&nbsp;
                <i class="fab fa-reddit-square fa-3x"></i>&nbsp;&nbsp;
                <i class="fab fa-github-square fa-3x"></i>&nbsp;&nbsp;
                <i class="fab fa-twitter-square fa-3x"></i>&nbsp;&nbsp;
                {/* <i class="fab fa-chrome fa-3x"></i>&nbsp;&nbsp; */}
            </div>
        );
    }
}

export default ShareComponent;