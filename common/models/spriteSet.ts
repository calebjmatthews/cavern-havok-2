export interface Sprite {
  src: string;
  width: number;
  height: number;
};

export type SpriteSet = { [spriteState: string] : Sprite };