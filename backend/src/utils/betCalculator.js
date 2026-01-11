/**
 * Calculate bet outcome based on "Under X" logic
 * @param {Object} bet - The bet object with matches and betType
 * @param {Array} allMatches - Array of all matches with their results
 * @returns {string|null} - "won", "lost", or null if cannot be determined
 */
export function calculateBetOutcome(bet, allMatches) {
  // Extract threshold from bet type (e.g., "Under 3" -> 3)
  const threshold = parseInt(bet.betType.replace("Under ", ""), 10);
  
  if (isNaN(threshold)) {
    return null;
  }

  // Check if all matches are finished
  for (const matchId of bet.matches) {
    // Handle both ObjectId and populated match objects
    const matchIdStr = matchId._id ? matchId._id.toString() : matchId.toString();
    const match = allMatches.find((m) => {
      const mId = m._id ? m._id.toString() : m.id ? m.id.toString() : m.toString();
      return mId === matchIdStr;
    });
    
    if (!match) {
      return null; // Match not found
    }
    
    if (match.status !== "finished") {
      return null; // Not all matches finished yet
    }
    
    if (match.score === undefined || match.score.home === undefined || match.score.away === undefined) {
      return null; // Score not available
    }
  }

  // All matches are finished, calculate outcome
  for (const matchId of bet.matches) {
    const matchIdStr = matchId._id ? matchId._id.toString() : matchId.toString();
    const match = allMatches.find((m) => {
      const mId = m._id ? m._id.toString() : m.id ? m.id.toString() : m.toString();
      return mId === matchIdStr;
    });
    
    const totalGoals = (match.score.home || 0) + (match.score.away || 0);
    
    // If any match has total goals >= threshold, bet loses
    if (totalGoals >= threshold) {
      return "lost";
    }
  }

  // All matches have total goals < threshold, bet wins
  return "won";
}

