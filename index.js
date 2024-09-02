/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * @param {object} pubsubMessage The Cloud Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.helloPubSub = (pubsubMessage, context) => {
    const message = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(`Received message: ${message}`);
  };
  