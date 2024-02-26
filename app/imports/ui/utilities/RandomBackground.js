// Function that generates a function to get random background paths without repeating the same number consecutively 2 or 3 times
// Think about how we can use tags to generate random background images for the calendar events
function createRandomBackgroundGenerator() {
  const historySize = 3; // Adjust based on how many previous numbers to remember
  const history = []; // Stores the history of generated numbers

  function getRandomNumber(min, max, exclude) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(randomNumber));
    return randomNumber;
  }

  return function () {
    const min = 1;
    const max = 8;
    // Generate a random number excluding the last few numbers from history
    const randomNumber = getRandomNumber(min, max, history);
    // Update the history
    if (history.length >= historySize) {
      history.shift(); // Remove the oldest number if we've reached history size
    }
    history.push(randomNumber); // Add the new number to history

    return `/images/background/${randomNumber}.png`;
  };
}

// Create the getRandomBackground function with history tracking
const getRandomBackground = createRandomBackgroundGenerator();

export { getRandomBackground };
