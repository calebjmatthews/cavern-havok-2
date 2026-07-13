import range from "@common/functions/utils/range";

const getHealthNumberProps = (damage: number, options?: { inverted?: boolean }) => {
  const damageString = `${Math.round(damage)}`;
  const particleSpriteNames: string[] = [];
  let particleCountFinal = 0;
  const powerOfTen = Math.floor(Math.log10(damage));
  const invertedPiece = options?.inverted ? '_i' : '';
  range(0, powerOfTen).forEach((power) => {
    particleSpriteNames.push(`${damageString[power]}${invertedPiece}.png`);
    particleCountFinal++;
  });
  return { particleSpriteNames, particleCountFinal };
};

export default getHealthNumberProps;