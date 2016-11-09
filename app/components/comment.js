import React from 'react';
import {unixTimeToString} from '../util';
import {Link} from 'react-router';
import {unlikeComment, likeComment} from '../server';

export default class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state = props;
	}
	handleLikeClick(clickEvent) {
		// Stop the event from propagating up the DOM
		// tree, since we handle it here. Also prevents
		// the link click from causing the page to scroll to the top.
		clickEvent.preventDefault();
		// 0 represents the 'main mouse button' --
		// typically a left click
		// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
		if (clickEvent.button === 0) {
			// Callback function for both the like and unlike cases.
			var callbackFunction = (updatedLikeCounter) => {
				// setState will overwrite the 'likeCounter'
				// field on the current state, and will keep
				// the other fields in-tact. This is called a
				// shallow merge:
				// https://facebook.github.io/react/docs/component-api.html#setstate
				this.setState({likeCounter: updatedLikeCounter});
			};
			if (this.didUserLike()) {
				// User clicked 'unlike' button.
				unlikeComment(this.props._id, this.props.idx, 4, callbackFunction);
			} else {
				// User clicked 'like' button.
				likeComment(this.props._id, this.props.idx, 4, callbackFunction);
			}
		}
	}
	didUserLike() {
		var likeCounter = this.state.likeCounter;
		var liked = false;
		// Look for a likeCounter entry with userId 4 -- which is the
		// current user.
		for (var i = 0; i < likeCounter.length; i++) {
			if (likeCounter[i]._id === 4) {
				liked = true;
				break;
			}
		}
		return liked;
	}
	render() {
		// var data = this.state;
		var likeButtonText = "Like";
		if (this.didUserLike()) {
			likeButtonText = "Unlike";
		}
		return (
			<div>
				<div className="media-left media-top">
				PIC
				</div>
				<div className="media-body">
					<Link to={"/profile/" + this.state.author._id}>
					{this.state.author.fullName}
					</Link>
					{this.state.children}
					<br/><a href="#" onClick={(e) => this.handleLikeClick(e)}>
						<span className="glyphicon glyphicon-thumbs-up"></span>
						{likeButtonText}
					</a> · <a href="#">Reply</a> · {unixTimeToString(this.state.postDate)}
				</div>
			</div>
		)
	}
}