import range from "@common/functions/utils/range";

const getHealthNumberProps = (damage: number) => {
  const damageString = `${Math.round(damage)}`;
  const particleSpriteNames: string[] = [];
  let particleCountFinal = 0;
  const powerOfTen = Math.floor(Math.log10(damage));
  range(0, powerOfTen).forEach((power) => {
    particleSpriteNames.push(`${damageString[power]}_i.png`);
    particleCountFinal++;
  });
  return { particleSpriteNames, particleCountFinal };
};

export default getHealthNumberProps;