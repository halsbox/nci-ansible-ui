const React = require('react');
const Reflux = require('reflux');
const Router = require('react-router');
const _ = require('underscore');
const ProjectActions = require('../../../actions/project');
const projectsStore = require('../../../stores/projects');
const template = require('./index.jade');

require('../../../stores/projects');

module.exports = React.createClass({
	mixins: [
		Reflux.connect(projectsStore, 'projects'),
		Router.Navigation
	],
	statics: {
		willTransitionTo() {
			ProjectActions.readAll();
		}
	},
	onProjectNameChange(event) {
		this.setState({
			projectName: event.target.value,
			scmRev: '',
			playbookName: '',
			inventoryNames: [],
			limit: '',
			mandatoryVars: {},
			extraVars: ''
		});
	},
	onScmBranchChange(event) {
		this.setState({scmBranch: event.target.value});
	},
	onScmRevChange(event) {
		this.setState({scmRev: event.target.value});
	},
	onPlaybookNameChange(event) {
		this.setState({
			playbookName: event.target.value,
			inventoryNames: [],
			limit: '',
			mandatoryVars: {},
			extraVars: ''
		});
	},
	onInventoryNamesChange(event) {
		const input = event.target;
		const inventoryName = input.value;

		const inventoryNames = this.state.inventoryNames || [];

		if (input.checked) {
			inventoryNames.push(inventoryName);
		} else {
			const index = inventoryNames.indexOf(inventoryName);
			if (index !== -1) {
				inventoryNames.splice(index, 1);
			}
		}

		this.setState({inventoryNames});
	},
	onUnselectAllInventoryNames() {
		this.setState({inventoryNames: []});
	},
	onSelectAllInventoryNames() {
		const project = _(this.state.projects).findWhere({
			name: this.state.projectName
		});
		const playbook = _(project.playbooks).findWhere({
			name: this.state.playbookName
		});
		this.setState({inventoryNames: _(playbook.inventories).pluck('name')});
	},
	onLimitChange(event) {
		this.setState({limit: event.target.value});
	},
	onMandatoryVarChange(event) {
		const input = event.target;
		const mandatoryVar = input.dataset.fieldKey;
		var mandatoryVars = this.state.mandatoryVars || {};
		if (input.value) {
			mandatoryVars[mandatoryVar] = input.value;
		} else {
			if (mandatoryVars[mandatoryVar]) {
				delete mandatoryVars[mandatoryVar];
			}
		}
		this.setState({mandatoryVars: mandatoryVars});
	},
	onExtraVarsChange(event) {
		this.setState({extraVars: event.target.value});
	},
	onCancel() {
		this.transitionTo('root');
	},
	onRunProject() {
		const buildParams = {};

		if (this.state.playbookName) {
			buildParams.playbook = {
				name: this.state.playbookName,
				inventoryNames: this.state.inventoryNames
			};

			if (this.state.limit) {
				buildParams.playbook.limit = this.state.limit;
			}

			if (this.state.mandatoryVars) {
				buildParams.playbook.extraVars = Object.keys(this.state.mandatoryVars).map(k => `${k}=${this.state.mandatoryVars[k]}`).join(" ");
			}
			if (this.state.extraVars) {
				buildParams.playbook.extraVars = buildParams.playbook.extraVars ? `${buildParams.playbook.extraVars} ${this.state.extraVars}` : this.state.extraVars;
			}
		}

		const project = _(this.state.projects).findWhere({
			name: this.state.projectName
		});

		const {scmBranch} = this.state;
		const scmRev = scmBranch === '-1' ? this.state.scmRev : scmBranch;
		const projectScmRev = project.scm ? project.scm.rev : '';

		if (scmRev && scmRev !== projectScmRev) {
			buildParams.scmRev = scmRev;
		}

		ProjectActions.run(project.name, buildParams);

		// TODO: go to last build in a durable way
		const self = this;
		setTimeout(() => {
			self.transitionTo('root');
		}, 500);
	},
	render: template.locals({
		_
	})
});
