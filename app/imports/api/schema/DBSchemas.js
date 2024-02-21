import SimpleSchema from 'simpl-schema';

const DBSchemaNonprofit = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['501(c) Nonprofits', 'Govt, Hospice, State-Level', 'Schools', 'Non-US NGO', 'Other'],
    required: true,
  },
  name: String,
  mission: String,
  contactInfo: String,
  location: String,
  createdAt: { type: Date, required: true, defaultValue: new Date() },
  owner: String,
  picture: {
    type: String,
    optional: true,
  },
}, { requiredByDefault: false });

export { DBSchemaNonprofit };
