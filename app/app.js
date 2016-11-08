import React from 'react';
import ReactDOM from 'react-dom';
import Feed from './components/feed';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';


class ProfilePage extends React.Component {
	render() {
		return (
			<p>This is the profile page for a user with ID {this.props.params.id}.</p>
			);
	}
}

class FeedPage extends React.Component {
	render() {
		return <Feed user={4} />;
	}
}

class App extends React.Component {
	render() {
		return (
			<div>{this.props.children}</div>
			);
	}
}

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path='/' component={App}>
			{/*Show the Feed */}
			<IndexRoute component={FeedPage} />
			<Route path='profile/:id' component={ProfilePage} />
		</Route>
	</Router>),
	document.getElementById('fb-feed')
	);
// ReactDOM.render(
// 	<Feed user={4}/>,
// 	document.getElementById('fb-feed')
// 	)