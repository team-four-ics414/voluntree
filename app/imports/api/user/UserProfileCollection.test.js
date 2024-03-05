import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { UserProfiles } from './UserProfileCollection';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = UserProfiles.getCollectionName();

if (Meteor.isServer) {
  describe(collectionName, function testSuite() {
    const collection = MATPCollections.getCollection(collectionName);

    before(async function setup() {
      await removeAllEntities();
    });

    after(async function teardown() {
      await removeAllEntities();
    });

    it('Can define and removeIt', async function test1() {
      await fc.assert(
        fc.asyncProperty(
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          async (firstName, lastName) => {
            const email = faker.internet.email();
            const definitionData = { email, firstName, lastName };
            await testDefine(collection, definitionData);
          },
        ),
      );
    });

    it('Cannot define duplicates', async function test2() {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const docID1 = await collection.define({ email, firstName, lastName });
      try {
        await collection.define({ email, firstName, lastName });
        throw new Error('Duplicate definition did not throw an error');
      } catch (error) {
        expect(error.message).not.to.equal('Duplicate definition did not throw an error');
      }
      await collection.removeIt(docID1);
    });

    it('Can update', async function test3() {
      await fc.assert(
        fc.asyncProperty(
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          async (fName, lName) => {
            const email = faker.internet.email();
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const password = faker.internet.password();
            const docID = await collection.define({ email, firstName, lastName, password });
            const updateData = { firstName: fName, lastName: lName };
            await testUpdate(collection, docID, updateData);
          },
        ),
      );
    });
  });
}
