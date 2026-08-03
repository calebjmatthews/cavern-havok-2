import range from "@common/functions/utils/range";

const getHealthNumberProps = (health: number, options?: { inverted?: boolean }) => {
  const healthString = `${Math.round(health)}`;
  const particleSpriteNames: string[] = [];
  let particleCountFinal = 0;
  const powerOfTen = Math.floor(Math.log10(health));
  const invertedPiece = options?.inverted ? '_i' : '';
  range(0, powerOfTen).forEach((power) => {
    particleSpriteNames.push(`${healthString[power]}${invertedPiece}.png`);
    particleCountFinal++;
  });
  return { particleSpriteNames, particleCountFinal };
};

export default getHealthNumberProps;