const getHealthNumberProps = (damage: number) => {
  return {
    particleSpriteNames: [`${damage}_i.png`],
    particleCountFinal: 1
  };
};

export default getHealthNumberProps;