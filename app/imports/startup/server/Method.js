import { Meteor } from 'meteor/meteor';
import cloudinary from 'cloudinary';
import { HTTP } from 'meteor/http';

cloudinary.config({
  cloud_name: 'djoahlpoc',
  api_key: '513547556632438',
  api_secret: 'Fp6cEWLBdbmAfrQlshHfA-jOgXs',
});

Meteor.methods({
  // eslint-disable-next-line meteor/audit-argument-checks
  async uploadImage(imageData) {
    this.unblock();

    try {
      const result = await cloudinary.v2.uploader.upload(imageData, { resource_type: 'auto' });
      return result.secure_url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading to Cloudinary:', error);
      throw new Meteor.Error('cloudinary-upload-failed', 'Error uploading to Cloudinary');
    }
  },
  // eslint-disable-next-line meteor/audit-argument-checks
  async textCheck(text) {
    try {
      const response = await HTTP.call('POST', 'https://api.openai.com/v1/moderations', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'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'}`,
        },
        data: {
          input: text,
          model: 'text-moderation-latest',
        },
      });

      const moderationResult = response.data.results[0];
      if (moderationResult.flagged) {
        throw new Meteor.Error('text-not-allowed', 'Text violates content policy');
      }
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error calling OpenAI Moderation API:', error);
      throw new Meteor.Error('moderation-api-call-failed', `Failed to call OpenAI Moderation API: ${error.message}`);
    }
  },
});
