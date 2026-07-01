import { useEffect, useMemo, useState } from "react";

import type Fighter from "@common/models/fighter";
import type Creation from "@common/models/creation";
import type Obstacle from "@common/models/obstacle";
import type BattleState from "@common/models/battleState";
import type Artist from "@client/models/artist/artist";
import type { PixiEvent } from "@common/models/pixiEvent";
import clss from "@client/functions/clss";
import getPositionFromSpot from "@client/functions/artist/getPositionFromSpot";
import { CHARGE_DISPLAY_MAX, HEALTH_DANGER_THRESHOLD } from "@common/constants";

export default function BarsGrid(props: {
  battleState: BattleState,
  battleStateFuture: BattleState | null,
  artistRef: React.RefObject<Artist>,
  pixiEventsUI: PixiEvent[] | null
}) {
  const { battleState, battleStateFuture, artistRef, pixiEventsUI } = props;
  const artist = artistRef.current;
  const pixiChildren = artist.pixiChildrenRef.current;

  const [state, setState] = useState('clean');
  const [pixiEventsUIID, setPixiEventsUIID] = useState<string | null>(null);
  const [occupants, setOccupants] = useState<{[id: string] : (Fighter | Obstacle | Creation)}>({});

  useEffect(() => {
    if (state === 'clean' || state === 'eventsDone') {
      const occupantsNext: {[id: string] : (Fighter | Obstacle | Creation)} = {};
      [
        ...Object.values(battleState.fighters),
        ...Object.values(battleState.obstacles),
        ...Object.values(battleState.creations),
      ].forEach((occupant) => occupantsNext[occupant.id] = occupant);
      setOccupants(occupantsNext);
      setState('occupantsLoaded');
    }
    
  }, [state, battleState]);

  useEffect(() => {
    const nextPixiEventsUIID = (pixiEventsUI ?? []).map((pe) => pe.id).join(',');
    if (
      (state === 'eventsDone' || state === 'occupantsLoaded')
      && (nextPixiEventsUIID !== pixiEventsUIID)
    ) {
      if (pixiEventsUI && pixiEventsUI.length > 0) {
        setState('eventsApplying');
        setPixiEventsUIID(nextPixiEventsUIID);
        pixiEventsUI.forEach((pixiEventUI) => {
          if (pixiEventUI.functionName !== 'changeStat') return;
          const { targetsId, statName, quantity } = pixiEventUI.args;
          setTimeout(() => {
            const target = occupants[targetsId];
            if (!target) return;

            if (statName === 'health') target.health += quantity;
            if (target.health >= target.healthMax) target.health === target.healthMax;

            if (statName === 'charge' && 'charge' in target) target.charge += quantity;
            setOccupants((currentOccupants) => ({
              ...currentOccupants,
              [target.id]: target
            }));
            setState('eventsDone');
          }, pixiEventUI.delay);
        });
      }
      else {
        setState('eventsDone');
        setPixiEventsUIID(null);
      }
    }
  }, [state, pixiEventsUI, occupants, pixiEventsUIID]);

  return useMemo(() => (Object.values(occupants).map((occupant) => {
    let occupantFuture: Fighter | Obstacle | Creation | undefined;
    if (battleStateFuture) {
      let of: Fighter | Obstacle | Creation | undefined;
      if (occupant.occupantKind === 'fighter') of = battleStateFuture.fighters[occupant.id];
      if (occupant.occupantKind === 'obstacle') of = battleStateFuture.obstacles[occupant.id];
      if (occupant.occupantKind === 'creation') of = battleStateFuture.creations[occupant.id];
      if (of) occupantFuture = of;
    };
    const layeredAnimated = artist.layeredAnimateds[occupant.id];
    let occupantLAHeight = 0;
    (layeredAnimated?.cycleLayers ?? []).forEach((cl) => (
      occupantLAHeight += cl.heightExplicit ?? 0
    ));

    const tileWidth = 25 * artist.pixelScale;
    // ToDo: getSpriteHeightAfterHat
    const height = occupantLAHeight * artist.pixelScale;
    const tileHeight = 21 * artist.pixelScale;
    const verticalBuffer = occupant.occupantKind !== 'obstacle' ? 21 : 17;

    const position = getPositionFromSpot(
      { artist, occupant, size: { width: tileWidth, height: 0 }  }
    ) ?? { x: -10000, y: -10000 };
    position.y -= (tileHeight + (height + verticalBuffer - tileHeight));

    return (
      <Bars
        key={`bars-${occupant.id}`}
        occupant={occupant}
        occupantFuture={occupantFuture}
        artist={artist}
        position={position}
      />
    );
  })), [occupants]);
};

function Bars(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture?: Fighter | Obstacle | Creation | null,
  artist: Artist,
  position: { x: number, y: number }
}) {
  const { occupant, artist, position } = props;

  let proportion = (occupant.health / occupant.healthMax);
  let downed = false;
  if (proportion <= 0) {
    downed = true;
    proportion = Math.abs(proportion);
  };
  const width = 24 * artist.pixelScale;

  return (
    <div
      className={clss([ 'bars-container', occupant.occupantKind === 'fighter' && 'can-charge'])}
      style={{
        backgroundColor: (downed ? "var(--c-grey-dark)" : "var(--c-white)"),
        left: position.x,
        top: position.y,
        minWidth: width,
        maxWidth: width
      }}
    >
      <HealthBar {...props} width={width} downed={downed} proportion={proportion} />
      <ChargeBar {...props} width={width} />
    </div>
  );
};

function HealthBar(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture?: Fighter | Obstacle | Creation | null,
  width: number,
  downed: boolean,
  proportion: number
}) {
  const { occupant, occupantFuture, width, downed, proportion } = props;

  const proportionToLose = (occupantFuture && occupantFuture.health < occupant.health)
    ? ((occupant.health - occupantFuture.health) / occupantFuture.healthMax)
    : null;
  const proportionToGain = (occupantFuture && occupantFuture.health > occupant.health)
    ? ((occupantFuture.health - occupant.health) / occupantFuture.healthMax)
    : null;
  let proportionDefense = occupantFuture?.defense
    ? (occupantFuture.defense / occupantFuture.healthMax)
    : null;

  let bgColor = "var(--c-green)";
  if (occupant.occupantKind === 'obstacle') {
    bgColor = "var(--c-grey)";
  }
  else if (downed) bgColor = "var(--c-red-dark)";
  else if (proportion >= 1) bgColor = "var(--c-green-bold)";
  else if (proportion >= 0.5) bgColor = "var(--c-green)";
  else if (proportion >= HEALTH_DANGER_THRESHOLD) bgColor = "var(--c-yellow)";
  else bgColor = "var(--c-red)";

  return (
    <>
      <div
        className="health-bar-inner"
        style={{ width: `${(width * proportion)}px`, backgroundColor: bgColor }}
      />
      {proportionDefense && (
        <div
          className="health-bar-inner pulse-opacity"
          style={{ width: `${(width * proportionDefense)}px`, backgroundColor: "var(--c-blue-light)" }}
        />
      )}
      {proportionToLose && (
        <div
          className="health-bar-inner pulse-opacity"
          style={{
            width: `${(width * proportionToLose)}px`,
            left: `${(width * (proportion - proportionToLose))}px`,
            backgroundColor: "var(--c-white)"
          }}
        />
      )}
      {proportionToGain && (
        <div
          className="health-bar-inner pulse-opacity"
          style={{
            width: `${(width * proportionToGain)}px`,
            left: `${(width * proportion)}px`,
            backgroundColor: bgColor
          }}
        />
      )}
      <span className="health-bar-text" style={{ color: (downed ? "var(--c-white)" : "var(--c-black)") }}>
        {`${Math.round(occupant.health)}/${occupant.healthMax}`}
      </span>
    </>
  );
};

function ChargeBar(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture?: Fighter | Obstacle | Creation | null,
  width: number
}) {
  const { occupant, occupantFuture, width } = props;
  if (occupant.occupantKind !== 'fighter') return null;
  if (occupantFuture !== null && occupantFuture?.occupantKind !== 'fighter') return null;

  const proportion = Math.floor(occupant.charge) / CHARGE_DISPLAY_MAX;
  const proportionToLose = (occupantFuture && occupantFuture.charge < occupant.charge)
    ? ((occupant.charge - occupantFuture.charge) / CHARGE_DISPLAY_MAX)
    : null;

  return (
    <div className="charge-bar-wrapper">
      <div
        className="charge-bar-inner"
        style={{ width: `${(width * proportion)}px`, backgroundColor: 'var(--c-yellow' }}
      />
      {proportionToLose && (
        <div
          className="charge-bar-inner pulse-opacity"
          style={{
            width: `${(width * proportionToLose)}px`,
            left: `${(width * (proportion - proportionToLose))}px`,
            backgroundColor: "var(--c-black)"
          }}
        />
      )}
    </div>
  );
};