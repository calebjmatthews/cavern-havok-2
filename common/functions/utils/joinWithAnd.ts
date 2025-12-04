const joinWithAnd = (textPieces: string[]): string => {
  if (textPieces.length === 0) return "";
  if (textPieces.length === 1) return textPieces.join("");
  if (textPieces.length === 2) return `${textPieces[0]} and ${textPieces[1]}`;
  return textPieces.map((tp, index) => {
    const isLast = index === (textPieces.length - 1);
    return (isLast ? `and ${tp}` : `${tp}, `);
  }).join('');
};

export default joinWithAnd;