const shuffleArray = <T>(array: T[]): T[] => {
  // Create a copy of the original array to preserve it
  const shuffled: T[] = [...array]; 
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    const shuffledI = shuffled[i];
    const shuffledJ = shuffled[j];
    if (shuffledJ) shuffled[i] = shuffledJ;
    if (shuffledI) shuffled[j] = shuffledI;
  }
  
  return shuffled;
};

export default shuffleArray;