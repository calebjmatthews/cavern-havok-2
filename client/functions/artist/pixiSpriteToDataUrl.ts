import * as PIXI from 'pixi.js';

const pixiSpriteToDataURL = (args: {
  pixiApp: PIXI.Application | null,
  pixiSprite: PIXI.Sprite
}): string | undefined => {
  const { pixiApp, pixiSprite } = args;
  if (!pixiApp) return;

  const renderTexture = PIXI.RenderTexture.create({
    width: pixiSprite.width,
    height: pixiSprite.height,
  });

  pixiApp.renderer.render({
    container: pixiSprite,
    target: renderTexture,
  });
  
  const canvas = pixiApp.renderer.extract.canvas(renderTexture);
  const dataURL = (canvas as HTMLCanvasElement).toDataURL();

  renderTexture.destroy();
  pixiSprite.destroy();

  return dataURL;
};

export default pixiSpriteToDataURL;