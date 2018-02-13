/*
  Useful in calculating the width of the container of the cards grid...
*/
export const getContainerMaxWidth = (cardWidth, spacing, noOfCards) => {
  return (spacing * noOfCards) + (cardWidth * noOfCards);
}
