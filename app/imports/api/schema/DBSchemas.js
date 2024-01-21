import SimpleSchema from 'simpl-schema';

const DBSchemaNonprofit = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['Business', 'Organization', 'Individual'],
    required: true,
  },
  name: String,
  mission: String,
  contactInfo: String,
  location: String,
  createdAt: Date,
  picture: {
    type: String,
    optional: true,
  },
});

export { DBSchemaNonprofit };
