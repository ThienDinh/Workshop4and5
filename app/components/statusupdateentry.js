import React from 'react';
export default class StatusUpdateEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ""
		};
	}
	handlePost(e) {
		e.preventDefault();
		var statusUpdateText = this.state.value.trim();
		if (statusUpdateText !== "") {
			this.props.onPost(statusUpdateText);
			this.setState({
				value: ""
			});
		}
	}
	handleChange(e) {
		e.preventDefault();
		this.setState({
			value: e.target.value
		});
	}
	render() {
		return (
			<div className="fb-status-update-entry panel panel-default">
				<div className="panel-body">
					<ul className="nav nav-pills">
						<li role="presentation" className="active">
							<a href="#"><span className="glyphicon glyphicon-pencil">
							</span> <strong>Update Status</strong></a>
						</li>
						<li role="presentation">
							<a href="#"><span className="glyphicon glyphicon-picture">
							</span> <strong>Add Photos/Video</strong></a>
						</li>
						<li role="presentation">
							<a href="#"><span className="glyphicon glyphicon-th">
							</span> <strong>Create Photo Album</strong></a>
						</li>
					</ul>
					<div className="media">
						<div className="media-left media-top">
							PIC
						</div>
						<div className="media-body">
							<div className="form-group">
								<textarea className="form-control" rows="2"
									placeholder="What's on your mind?"
									value={this.state.value}
									onChange={(e) => this.handleChange(e)}>
								</textarea>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="btn-group" role="group">
								<button type="button" className="btn btn-default">
									<span className="glyphicon glyphicon-camera"></span>
								</button>
								<button type="button" className="btn btn-default">
									<span className="glyphicon glyphicon-user"></span>
								</button>
								<button type="button" className="btn btn-default">
									￿
								</button>
								<button type="button" className="btn btn-default">
									<span className="glyphicon glyphicon-pushpin"></span>
								</button>
							</div>
						</div>
						<div className="col-md-6">
							<div className="pull-right">
								<button type="button" className="btn btn-default">
									<span className="glyphicon glyphicon-user"></span>
									Friends <span className="caret"></span>
								</button>
								<button type="button" className="btn btn-default"
									onClick={(e) => this.handlePost(e)}>
									Post
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			)
	}
}