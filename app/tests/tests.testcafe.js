// import { Selector, t, ClientFunction } from 'testcafe';
import { /* manageDatabasePage, */ signOutPage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { navBar } from './navbar.component';
import { listNonprofitPage } from './listNonprofit.page';
import { viewNonprofitPage } from './viewNonprofit.page';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';
import { addNonprofitPage } from './addNonprofit.page';
// import { removeItMethod } from '../imports/api/base/BaseCollection.methods';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const newCredentials = { username: 'jane@foo.com', password: 'changeme' };
// const getWindowLocation = ClientFunction(() => window.location);

fixture('voluntree localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await landingPage.isDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// test('Test that user pages show up', async () => {
//   await navBar.gotoSignInPage();
//   await signInPage.signin(credentials.username, credentials.password);
//   await navBar.isLoggedIn(credentials.username);
//   // await navBar.gotoAddStuffPage();
//   // await addStuffPage.isDisplayed();
//   // await navBar.gotoListStuffPage();
//   await opportunitiesPage.isDisplayed();
//   // want to see if we can get to the editStuffPage
//   // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
//   // await t.click(editLinks.nth(0));
//   // await editStuffPage.isDisplayed();
//   await navBar.logout();
//   await signOutPage.isDisplayed();
// });
//
test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  // await navBar.isLoggedIn(newCredentials.username);
  // await navBar.logout();
  // await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  // await navBar.gotoAddStuffPage();
  // await addStuffPage.isDisplayed();
  // await navBar.gotoListStuffPage();
  // await listStuffPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  // await t.click(editLinks.nth(0));
  // await editStuffPage.isDisplayed();
  // await navBar.gotoListStuffAdminPage();
  // await listStuffAdminPage.isDisplayed();
  // await navBar.gotoManageDatabasePage();
  // await manageDatabasePage.isDisplayed();
});
//
test('Test that opportunities page works', async (testController) => {
  await navBar.gotoOpportunitiesPage(testController);
});

test('Test the list nonprofits page works', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoListNonprofit();
  await listNonprofitPage.isDisplayed();
  await listNonprofitPage.hasNonprofits(3);
});

test('Test the view nonprofit page works', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoListNonprofit();
  await listNonprofitPage.gotoViewNonprofitPage();
  await viewNonprofitPage.isDisplayed();
  await viewNonprofitPage.goBack();
  await listNonprofitPage.isDisplayed();
});

test('Test the AddNonprofit page', async () => {
  // await t.debug();
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoListNonprofit();
  await listNonprofitPage.gotoAddNonprofitPage();
  await addNonprofitPage.isDisplayed();
  await addNonprofitPage.addNonprofit();
  await navBar.gotoListNonprofit();
  await listNonprofitPage.hasNonprofits(4);
  await listNonprofitPage.gotoViewNonprofitPage();
  // const location = getWindowLocation();
  // t.ctx.nonprofitId = location.pathname.split('/view-nonprofit')[0];
});
// .after(async () => {
// await removeItMethod.callPromise('NonprofitsCollection', t.ctx.nonprofitId);
