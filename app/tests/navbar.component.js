import { Selector, t } from 'testcafe';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class NavBar {

  /* If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout() {
    const loggedInUser = await Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await t.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
      await t.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoSignInPage() {
    await this.ensureLogout(t);
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN}`);
  }

  /* Check that the specified user is currently logged in. */
  async isLoggedIn(username) {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    const loggedInUser = Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).innerText;
    await t.expect(loggedInUser).eql(username);
  }

  /* Check that someone is logged in, then click items to logout. */
  async logout() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_SIGN_OUT}`);
  }

  /* Pull down login menu, go to sign up page. */
  async gotoSignUpPage() {
    await this.ensureLogout(t);
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP}`);
  }

  /* Go to the volunteer opportunities page. */
  async gotoOpportunitiesPage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t
      .click(`#${COMPONENT_IDS.NAVBAR_FIND_DROPDOWN}`)
      .click('#opportunities-page');
  }

  /* Go to the Map Search page. */
  async gotoMapsearchPage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t
      .click(`#${COMPONENT_IDS.NAVBAR_FIND_DROPDOWN}`)
      .click('#map-page');
  }

  /* Go to the FAQ page. */
  async gotoFAQ(testController) {
    await testController.click('#faq');
  }

  /* Go to the add stuff page. */
  async gotoAddStuffPage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_ADD_STUFF}`);
  }

  /* Go to the list stuff page. */
  async gotoListStuffPage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LIST_STUFF}`);
  }

  /* Go to the list stuff admin page. */
  async gotoListStuffAdminPage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_LIST_STUFF_ADMIN}`);
  }

  /* Go to the manage database page. Must be adimin. */
  async gotoManageDatabasePage() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t.expect(Selector(`#${COMPONENT_IDS.NAVBAR_CURRENT_USER}`).exists).ok();
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN}`);
    await t.click(`#${COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE}`);
  }

  /* Go to the list nonprofits page. Must be a logged in user. */
  async gotoListNonprofit() {
    const visible = await Selector(`#${COMPONENT_IDS.NAVBAR_COLLAPSE}`).visible;
    if (!visible) {
      await t.click('button.navbar-toggler');
    }
    await t
      .click(`#${COMPONENT_IDS.NAVBAR_FIND_DROPDOWN}`)
      .click(`#${COMPONENT_IDS.NAVBAR_LIST_NONPROFIT}`);
  }
}

export const navBar = new NavBar();
