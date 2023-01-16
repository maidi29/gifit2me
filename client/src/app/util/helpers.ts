export const generateRandom = (max: number, exclude: number[]) => {
  let random;
  if(exclude.length >= max-1) {
    return 0;
  }
  while (!random) {
    const x = Math.floor(Math.random() * max+1);
    if (exclude.indexOf(x) === -1) random = x;
  }
  return random;
}
