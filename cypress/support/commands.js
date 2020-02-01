const _ = require('underscore');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('fillProjectRunForm', ({
	projectName,
	branchName,
	customRevision,
	playbookName,
	inventories
}) => {
	if (projectName) {
		cy.get('#project-name').select(projectName);
	}
	if (branchName) {
		cy.get('#scm-branch').select(branchName);
	} else if (customRevision) {
		cy.get('#scm-branch').select('Custom revision');
		cy.get('#scm-branch').siblings('input').type(customRevision);
	}
	if (playbookName) {
		cy.get('#playbook-name').select(playbookName);
	}
	if (inventories) {
		_(inventories).each((inventory) => {
			cy.get(`input[type=checkbox][value=${inventory}]`).check();
		});
	}
});

Cypress.Commands.add('expectBuildPageInfo', ({
	projectName,
	branchName,
	customRevision,
	playbookName,
	inventories
}) => {
	if (projectName) {
		cy.contains('.page-header', projectName);
	}
	if (branchName || customRevision) {
		const scmTarget = branchName || customRevision;
		cy.contains('.build-view_info', `Scm target is ${scmTarget}`);
	}
	if (playbookName) {
		cy.contains(`Playbook: ${playbookName}`);
	}
	if (inventories) {
		cy.contains(`Inventories: ${inventories.join(', ')}`);
	}
});
