import type Character from "./character";

export default interface Account {
  id: string;
  name?: string;
  character?: Character;
  isGuest?: boolean;
};