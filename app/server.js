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
	});
	return feedItem;
}

export function getFeedData(user, cb) {
	var userData = readDocument('users', user);
	var feedData = readDocument('feeds', userData.feed);
	feedData.contents = feedData.contents.map(getFeedItemSync);
	emulateServerReturn(feedData, cb);
}