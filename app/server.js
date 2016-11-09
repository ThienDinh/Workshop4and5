import {readDocument, writeDocument, addDocument} from './database.js';

/**
 * Emulates how a REST call is *asynchronous* -- it calls your function back
 * some time in the future with data.
 */
function emulateServerReturn(data, cb) {
  setTimeout(() => {
    cb(data);
  }, 4);
}

function getFeedItemSync(feedItemId) {
	var feedItem = readDocument('feedItems', feedItemId);
	feedItem.likeCounter = feedItem.likeCounter.map((id)=> readDocument('users', id));
	feedItem.contents.author = readDocument('users', feedItem.contents.author);
	feedItem.comments.forEach((comment) => {
		comment.author = readDocument('users', comment.author);
		comment.likeCounter.map((id)=> readDocument('users', id));
	});
	return feedItem;
}

export function getFeedData(user, cb) {
	var userData = readDocument('users', user);
	var feedData = readDocument('feeds', userData.feed);
	feedData.contents = feedData.contents.map(getFeedItemSync);
	emulateServerReturn(feedData, cb);
}

/**
* Adds a new status update to the database.
*/
export function postStatusUpdate(user, location, contents, cb) {
	// If we were implementing this for real on an actual server,
	// we would check that the user ID is correct & matches the
	// authenticated user. But since we're mocking it, we can
	// be less strict.
	// Get the current UNIX time.
	var time = new Date().getTime();
	// The new status update. The database will assign the ID for us.
	var newStatusUpdate = {
		"likeCounter": [],
		"type": "statusUpdate",
		"contents": {
			"author": user,
			"postDate": time,
			"location": location,
			"contents": contents
		},
		// List of comments on the post
		"comments": []
	};
	// Add the status update to the database.
	// Returns the status update w/ an ID assigned.
	newStatusUpdate = addDocument('feedItems', newStatusUpdate);
	// Add the status update reference to the front of the
	// current user's feed.
	var userData = readDocument('users', user);
	var feedData = readDocument('feeds', userData.feed);
	feedData.contents.unshift(newStatusUpdate._id);
	// Update the feed object.
	writeDocument('feeds', feedData);
	// Return the newly-posted object.
	emulateServerReturn(newStatusUpdate, cb);
}

/**
* Adds a new comment to the database on the given feed item.
* Returns the updated FeedItem object.
*/
export function postComment(feedItemId, author, contents, cb) {
	// Since a CommentThread is embedded in a FeedItem object,
	// we don't have to resolve it. Read the document,
	// update the embedded object, and then update the
	// document in the database.
	var feedItem = readDocument('feedItems', feedItemId);
	feedItem.comments.push({
		"author": author,
		"contents": contents,
		"postDate": new Date().getTime(),
		"likeCounter": []
	});
	writeDocument('feedItems', feedItem);
	// Return a resolved version of the feed item so React can
	// render it.
	emulateServerReturn(getFeedItemSync(feedItemId), cb);
}
/**
* Updates a feed item's likeCounter by adding the
* user to the likeCounter. Provides an updated likeCounter
* in the response.
*/
export function likeFeedItem(feedItemId, userId, cb) {
	var feedItem = readDocument('feedItems', feedItemId);
	// Normally, we would check if the user already
	// liked this comment. But we will not do that
	// in this mock server. ('push' modifies the array
	// by adding userId to the end)
	feedItem.likeCounter.push(userId);
	writeDocument('feedItems', feedItem);
	// Return a resolved version of the likeCounter
	emulateServerReturn(feedItem.likeCounter.map((userId) =>
	readDocument('users', userId)), cb);
}

/**
* Updates a feed item's likeCounter by removing
* the user from the likeCounter.
* Provides an updated likeCounter in the response.
*/
export function unlikeFeedItem(feedItemId, userId, cb) {
	var feedItem = readDocument('feedItems', feedItemId);
	// Find the array index that contains the user's ID.
	// (We didn't *resolve* the FeedItem object, so
	// it is just an array of user IDs)
	var userIndex = feedItem.likeCounter.indexOf(userId);
	// -1 means the user is *not* in the likeCounter,
	// so we can simply avoid updating
	// anything if that is the case: the user already
	// doesn't like the item.
	if (userIndex !== -1) {
		// 'splice' removes items from an array. This
		// removes 1 element starting from userIndex.
		feedItem.likeCounter.splice(userIndex, 1);
		writeDocument('feedItems', feedItem);
	}
	// Return a resolved version of the likeCounter
	emulateServerReturn(feedItem.likeCounter.map((userId) =>
	readDocument('users', userId)), cb);
}

// LikeComment function.
export function likeComment(feedItemId, commentIdx, userId, cb) {
	var feedItem = readDocument('feedItems', feedItemId);
	feedItem.comments[commentIdx].likeCounter.push(userId);
	writeDocument('feedItems', feedItem);
	// Return updated comment.
	emulateServerReturn(feedItem.comments[commentIdx].likeCounter.map((userId) =>
	readDocument('users', userId)), cb);
}

// UnlikeComment function.
export function unlikeComment(feedItemId, commentIdx, userId, cb) {
	var feedItem = readDocument('feedItems', feedItemId);
	var userIndex = feedItem.comments[commentIdx].likeCounter.indexOf(userId);
	// Remove user from comment's like list.
	if (userIndex !== -1) {
		feedItem.comments[commentIdx].likeCounter.splice(userIndex, 1);
		writeDocument('feedItems', feedItem);
	}
	// Return updated comment.
	emulateServerReturn(feedItem.comments[commentIdx].likeCounter.map((userId) =>
	readDocument('users', userId)), cb);
}