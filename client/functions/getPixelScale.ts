const getPixelScale = (windowWidth: number) => {
  let mod = (windowWidth > 650 ? ((windowWidth - 650) / 650) : 0);
  if (mod > 0.5) mod = 0.5;
  return 2 + mod;
};

export default getPixelScale;