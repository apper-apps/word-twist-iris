import wordsData from '@/services/mockData/words.json';

class GameService {
  constructor() {
    this.validWords = new Set(wordsData.map(word => word.word.toLowerCase()));
    this.wordPoints = new Map(wordsData.map(word => [word.word.toLowerCase(), word.points]));
  }

  // Generate a random letter grid
  generateGrid(size = 4) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        const grid = [];
        
        for (let i = 0; i < size; i++) {
          const row = [];
          for (let j = 0; j < size; j++) {
            // Bias towards vowels to make word formation more likely
            const isVowel = Math.random() < 0.3;
            const letters = isVowel ? vowels : consonants;
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            row.push(randomLetter);
          }
          grid.push(row);
        }
        
        resolve(grid);
      }, 300);
    });
  }

  // Validate if a word is valid
  validateWord(word) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = this.validWords.has(word.toLowerCase()) && word.length >= 3;
        const points = isValid ? this.wordPoints.get(word.toLowerCase()) || word.length : 0;
        resolve({ isValid, points, word: word.toLowerCase() });
      }, 100);
    });
  }

  // Check if cells form a valid path (adjacent cells)
  isValidPath(cells) {
    if (cells.length < 2) return true;
    
    for (let i = 1; i < cells.length; i++) {
      const [prevRow, prevCol] = cells[i - 1];
      const [currRow, currCol] = cells[i];
      
      const rowDiff = Math.abs(currRow - prevRow);
      const colDiff = Math.abs(currCol - prevCol);
      
      // Cells must be adjacent (including diagonally)
      if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
        return false;
      }
    }
    
    return true;
  }

  // Get word from grid cells
  getWordFromCells(grid, cells) {
    return cells.map(([row, col]) => grid[row][col]).join('');
  }

  // Get high scores from localStorage
  getHighScores() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scores = JSON.parse(localStorage.getItem('wordTwistHighScores') || '[]');
        resolve(scores.sort((a, b) => b.score - a.score).slice(0, 10));
      }, 200);
    });
  }

  // Save high score
  saveHighScore(score, wordsFound, gameMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scores = JSON.parse(localStorage.getItem('wordTwistHighScores') || '[]');
        const newScore = {
          Id: Date.now(),
          score,
          wordsFound,
          gameMode,
          date: new Date().toISOString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        const topScores = scores.slice(0, 10);
        localStorage.setItem('wordTwistHighScores', JSON.stringify(topScores));
        
        resolve(newScore);
      }, 200);
    });
  }

  // Get game statistics
  getGameStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = JSON.parse(localStorage.getItem('wordTwistStats') || JSON.stringify({
          gamesPlayed: 0,
          totalScore: 0,
          totalWordsFound: 0,
          bestScore: 0,
          averageScore: 0
        }));
        resolve(stats);
      }, 200);
    });
  }

  // Update game statistics
  updateGameStats(score, wordsFound) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = JSON.parse(localStorage.getItem('wordTwistStats') || JSON.stringify({
          gamesPlayed: 0,
          totalScore: 0,
          totalWordsFound: 0,
          bestScore: 0,
          averageScore: 0
        }));
        
        stats.gamesPlayed += 1;
        stats.totalScore += score;
        stats.totalWordsFound += wordsFound;
        stats.bestScore = Math.max(stats.bestScore, score);
        stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
        
        localStorage.setItem('wordTwistStats', JSON.stringify(stats));
        resolve(stats);
      }, 200);
    });
  }
}

export default new GameService();