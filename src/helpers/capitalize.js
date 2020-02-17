function capitalizePhrase(phrase) {
  const words = phrase.split(' ');
  const capitalizedWords = words.map((word) => (
    capitalizeWord(word)
  ));
  const capitalizedPhrase = capitalizedWords.join(' ');

  return capitalizedPhrase.trim();
}

function capitalizeWord(word) {
  if (word.length === 1) {
    return word.toUpperCase();
  }
  return word.charAt(0).toUpperCase() + word.substring(1);
}

module.exports = { capitalizePhrase, capitalizeWord };
