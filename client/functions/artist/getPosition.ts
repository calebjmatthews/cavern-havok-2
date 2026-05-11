import type Artist from "@client/models/artist/artist";

const getPosition = (args: {
  sprite: { width: number, height: number },
  artist: Artist,
  gravity: 'center'
}) => {
  const { sprite, artist, gravity } = args;

  const spriteSize: [number, number] = [sprite.width, sprite.height];
  const offset: [number, number] = [spriteSize[0] / 2, spriteSize[1] / 2];
  const ws: [number, number] = [ artist.windowSize[0], artist.windowSize[1] ];

  switch(gravity) {
    case 'center':
      return {
        x: Math.round((ws[0] / 2) - offset[0]),
        y: Math.round((ws[1] / 2) - offset[1])
      };
  }
};

export default getPosition;