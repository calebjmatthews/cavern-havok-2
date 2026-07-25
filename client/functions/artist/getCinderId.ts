const getCinderId = (quantity: number | undefined) => {
  let id = 'cinders_pinch';
  if ((quantity ?? 0) >= 100) id = 'cinders_pile';
  if ((quantity ?? 0) >= 400) id = 'cinders_mug';
  if ((quantity ?? 0) >= 1600) id = 'cinders_pail';
  return id;
};

export default getCinderId;