import { Meteor } from 'meteor/meteor';
import cloudinary from 'cloudinary';
import { HTTP } from 'meteor/http';

let api_keys = null;
try {
  // eslint-disable-next-line global-require
  api_keys = require('../../api/api_keys.json');
} catch (Error) {
  console.log('Api keys are not imported');
}

cloudinary.config({
  cloud_name: api_keys ? api_keys.cloudinary.cloud_name : 'YOUR-KEY-HERE',
  api_key: api_keys ? api_keys.cloudinary.api_key : 'YOUR-KEY-HERE',
  api_secret: api_keys ? api_keys.cloudinary.api_secret : 'YOUR-KEY-HERE',
});

Meteor.methods({
  // eslint-disable-next-line meteor/audit-argument-checks
  async uploadImage(imageData) {
    this.unblock();

    try {
      const result = await cloudinary.v2.uploader.upload(imageData, { resource_type: 'auto' });
      return result.secure_url;
    } catch (error) {
      throw new Meteor.Error('cloudinary-upload-failed', 'Error uploading to Cloudinary');
    }
  },
  // eslint-disable-next-line meteor/audit-argument-checks
  async textCheck(text) {
    try {
      const response = await HTTP.call('POST', 'https://api.openai.com/v1/moderations', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api_keys ? api_keys.openAi : 'YOUR-KEY-HERE'}`,
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
      throw new Meteor.Error('moderation-api-call-failed', `Failed to call OpenAI Moderation API: ${error.message}`);
    }
  },
});
