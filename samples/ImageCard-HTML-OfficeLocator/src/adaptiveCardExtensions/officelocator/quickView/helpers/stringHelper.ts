class StringHelper {
    static shortenCityName(cityName: string): string {
      const words = cityName.split(" ");
      let abbreviation = "";
  
      if (words.length >= 3) {
        // If the city name has at least 3 words, take the first letter of each of the first 3 words
        abbreviation = words[0][0] + words[1][0] + words[2][0];
      } else if (words.length === 2) {
        // If the city name has 2 words, take the first 2 letters of the first word and the first letter of the second word
        abbreviation = words[0].slice(0, 2) + words[1][0];
      } else {
        // If the city name has 1 word, take the first 3 letters of that word
        abbreviation = words[0].slice(0, 3);
      }
  
      return abbreviation.toUpperCase();
    }
  }
  
  export default StringHelper;