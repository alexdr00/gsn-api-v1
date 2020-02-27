const capitalize = require('../../src/helpers/capitalize');

describe('Helper: capitalize', () => {
  describe('capitalizeWord', () => {
    it('should convert just first letter to uppercase. Rest of the string stays the same', () => {
      const word = 'dog';
      const result = capitalize.capitalizeWord(word);
      const firstLetter = result[0];
      const secondLetter = result[1];
      const thirdLetter = result[2];
      expect(firstLetter).toBe('D');
      expect(secondLetter).toBe('o');
      expect(thirdLetter).toBe('g');
    });
  });

  describe('capitalizePhrase', () => {
    it('should convert just first letter of each word to uppercase.', () => {
      const phrase = 'the dog sings';
      const result = capitalize.capitalizePhrase(phrase);
      const words = result.split(' ');
      const firstWord = words[0];
      const secondWord = words[1];
      const thirdWord = words[2];
      expect(firstWord[0]).toBe('T');
      expect(secondWord[0]).toBe('D');
      expect(thirdWord[0]).toBe('S');
    });
  });
});
