// Function to generate a time-ago string with controlled update frequency
function createTimeAgoGenerator() {
  const historySize = 3; // Maximum history records to prevent frequent update
  const updateThreshold = 60; // Minimum seconds to wait before updating the time-ago message again
  const history = []; // Stores the history of time-ago strings

  const GetTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000; // 365 * 24 * 60 * 60
    if (interval > 1) {
      return `${Math.floor(interval)} years`;
    }
    interval = seconds / 2592000; // 30 * 24 * 60 * 60
    if (interval > 1) {
      return `${Math.floor(interval)} months`;
    }
    interval = seconds / 86400; // 24 * 60 * 60
    if (interval > 1) {
      return `${Math.floor(interval)} days`;
    }
    interval = seconds / 3600; // 60 * 60
    if (interval > 1) {
      return `${Math.floor(interval)} hours`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      return `${Math.floor(interval)} minutes`;
    }
    return `${Math.floor(seconds)} seconds`;
  };

  return function (date) {
    const lastEntry = history.length > 0 ? history[history.length - 1] : null;
    const newTimeSince = GetTimeSince(date);

    // If the new time-ago string is different or enough time has passed, update it
    if (!lastEntry || lastEntry.text !== newTimeSince || (new Date() - lastEntry.timestamp) / 1000 > updateThreshold) {
      if (history.length >= historySize) {
        history.shift(); // Remove the oldest record
      }
      history.push({ text: newTimeSince, timestamp: new Date() }); // Add the new record
      return newTimeSince;
    }

    // Otherwise, return the most recent time-ago string
    return lastEntry.text;
  };
}

// Create the getTimeSince function with controlled update frequency
const getTimeSince = createTimeAgoGenerator();

export { getTimeSince };
