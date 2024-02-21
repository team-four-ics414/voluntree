// import { Selector, t } from 'testcafe';
// import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';
//
// class AddNonprofitPage {
//   constructor() {
//     this.pageId = `#${PAGE_IDS.ADD_NONPROFIT}`;
//     this.pageSelector = Selector(this.pageId);
//     // Selectors for the form's fields.
//     this.type = Selector('#add-nonprofit [name="type"]');
//     this.name = Selector('#add-nonprofit [name="name"]');
//     this.mission = Selector('#add-nonprofit [name="mission"]');
//     this.contactInfo = Selector('#add-nonprofit [name="contactInfo"]');
//     this.location = Selector('#add-nonprofit [name="location"]');
//     // this.picture = Selector('#add-nonprofit [name="picture"]');
//     // this.pictureUrl = 'https://banner2.cleanpng.com/20180628/eoy/kisspng-charitable-organization-habitat-for-humanity-compu-commercial-business-card-5b3509ef581089.6657184215302026073607.jpg';
//   }
//
//   /** Checks that this page is currently displayed. */
//   async isDisplayed() {
//     await t.expect(this.pageSelector.exists).ok();
//   }
//
//   /** Fills out and submits the form to add nonprofit, then checks to see that the nonprofit was added successfully */
//   async addNonprofit() {
//     await t
//       .click(this.type)
//       .click(this.type.find('option').withText('Schools'))
//       .expect(this.type.value).eql('Schools')
//       .typeText(this.name, 'Caring Hearts')
//       .typeText(this.mission, 'Help other people.')
//       .typeText(this.contactInfo, '808-808-8080')
//       .typeText(this.location, 'Kailua, HI')
//       // .typeText(this.picture, this.pictureUrl)
//       .click(Selector(`#${COMPONENT_IDS.NONPROFIT_ADD_SUBMIT_BTN} input`))
//       .click(Selector('button').withText('OK'));
//   }
// }
//
// export const addNonprofitPage = new AddNonprofitPage();
