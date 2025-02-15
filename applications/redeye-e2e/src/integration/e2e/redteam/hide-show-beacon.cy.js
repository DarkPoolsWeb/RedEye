/// <reference types="cypress" />

function hideUnhideBeacon(beaconName) {
	// Hide a beacon
	cy.get('[cy-test=beacons-row]').contains(beaconName).click();
	cy.clickDetailsTab();
	// cy.contains('[cy-test=beacon-display-name]', beaconName);
	cy.showHideBeaconDetailsTab();
}

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Hide beacon via Details tab using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// // Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the name of the last beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.last()
			.invoke('text')
			.then((beaconName) => {
				// Hide a beacon
				hideUnhideBeacon(beaconName);
				cy.reload();

				// Verify beacon no longer shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify beacon now shows again
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Unhide the beacon
				hideUnhideBeacon(beaconName);
				cy.reload();

				// Toggle off switch for hidden beacons
				cy.doNotShowHiddenItems();

				// Verify beacon shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	it('Hide beacon via Details tab using toggle on main page', () => {
		// Toggle off switch for hidden beacons
		cy.doNotShowHiddenItems();

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the last beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.last()
			.invoke('text')
			.then((beaconName) => {
				// Hide a beacon
				hideUnhideBeacon(beaconName);
				cy.reload();

				// Verify beacon no longer shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Toggle switch back on
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Verify beacon now shows again
				cy.selectCampaign(camp);
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Unhide the beacon
				hideUnhideBeacon(beaconName);
				cy.reload();

				// Toggle off switch for hidden beacons
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();

				// Verify beacon shows
				cy.selectCampaign(camp);
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	it('Hide beacon using the kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the last beacon
		cy.clickBeaconsTab();

		cy.get('[cy-test=beacon-display-name]')
			.last()
			.invoke('text')
			.then((beaconName) => {
				// Hide the last beacon in the list
				cy.showHideItem(4);

				// Verify confirmation modal appears
				cy.get('.bp5-dialog-body').should('be.visible').and('contain.text', 'Hiding this beacon');

				// Confirm that you want to hide the beacon
				cy.confirmShowHide();

				// Navigate back to beacons list
				cy.clickBeaconsTab();

				// Verify hidden beacon does not show in the list
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Go to settings and toggle swtich to show hidden
				cy.returnToCampaignCard();
				cy.showHiddenItems();
				cy.selectCampaign(camp);

				// Verify hidden beacon now shows in the list again
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Set beacon to show again
				cy.showHideItem(4);

				// Verify confirmation modal appears
				cy.get('.bp5-dialog-body').should('exist');

				// Confirm that you want to show the beacon
				cy.confirmShowHide();

				// Go to settings and toggle switch to not show hidden
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();
				cy.selectCampaign(camp);

				// Verify host still appears in the list
				cy.clickBeaconsTab();

				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	it('Verify Cancel button works from Details tab', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Go to Beacons tab and select the first one
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		// Go to Details tab and click show/hide link
		cy.clickDetailsTab();
		cy.get('[cy-test=show-hide-this-beacon]').click();

		// Verify modal shows; click Cancel
		cy.verifyDialogBoxAppears();

		cy.cancelShowHide();

		// Verify modal disappears
		cy.verifyDialogBoxDisappears();

		// Verify the Details tab link says "Hide this beacon" vs. "Show"
		cy.get('[cy-test=show-hide-this-beacon]').invoke('text').should('eq', 'Hide this beacon');
	});

	it('Verify Cancel button works from kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Go to Beacons tab
		cy.clickBeaconsTab();

		// Click first kebab menu to bring up options; click "Hide Beacon"
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').click();

		// Verify modal shows; click Cancel
		cy.verifyDialogBoxAppears();

		cy.cancelShowHide();

		// Verify modal disappears
		cy.verifyDialogBoxDisappears();

		// Verify the kebab menu link still says "Hide Beacon" vs. "Show"
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').invoke('text').should('eq', 'Hide  Beacon');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
