import { useMemo } from "react";

import OccupantSprite from "../OccupantSprite/OccupantSprite";
import type Fighter from "@common/models/fighter";
import type Creation from "@common/models/creation";
import type Obstacle from "@common/models/obstacle";
import type Outcome from "@common/models/outcome";
import clss from "@client/functions/clss";
import getPixelScale from "@client/functions/getPixelScale";
import { HEALTH_DANGER_THRESHOLD } from "@common/constants";

export default function SpotOccupant(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture: Fighter | Obstacle | Creation | null,
  occupantAffectedFuture: Outcome[] | null,
  occupantActingFuture: Outcome[] | null,
  battlefieldSize: [number, number],
  canTarget: boolean,
  isTargetSelected: boolean
}) {
  const {
    occupant, occupantFuture, occupantAffectedFuture, occupantActingFuture, battlefieldSize,
    canTarget, isTargetSelected
  } = props;

  // const occupantChargeLabel = useMemo(() => {
  //   if (!("charge" in occupant)) return null;
  //   return `C: ${occupant.charge}`;
  // }, [occupant]);

  const futureLabel = useMemo(() => {
    if (!occupantFuture || !occupantAffectedFuture || !occupantActingFuture) return null;
    
    let matches: string[] = [];
    occupantAffectedFuture.forEach((outcome) => {
      if (outcome.becameDowned) matches.push('becameDowned');
      if (outcome.skippedBecauseStunned) matches.push('skippedBecauseStunned');
      if (outcome.defense && outcome.defense > 0) matches.push('defenseGained');
      if (outcome.moveTo) matches.push('moveTo');
    });
    occupantActingFuture.forEach((outcome) => {
      if (outcome.damage) matches.push('dealtDamage');
      if (outcome.healing) matches.push('gaveHealing');
      if (outcome.makeObstacle) matches.push('makeObstacle');
    });
    
    if (matches.includes('becameDowned')) return 'becameDowned';
    if (matches.includes('skippedBecauseStunned')) return 'skippedBecauseStunned';
    if (matches.includes('dealtDamage')) return 'dealtDamage';
    if (matches.includes('gaveHealing')) return 'gaveHealing';
    if (matches.includes('defenseGained')) return 'defenseGained';
    if (matches.includes('moveTo')) return 'moveTo';
    if (matches.includes('makeObstacle')) return 'makeObstacle';
    return null;
  }, [occupantAffectedFuture, occupantFuture]);

  const downed = Math.round(occupant.health) <= 0;

  return (
    <div className={clss([ "spot-occupant", (downed ? "text-muted" : null) ])} >
      <HealthBar occupant={occupant} occupantFuture={occupantFuture} />
      <OccupantSprite occupant={occupant} battlefieldSize={battlefieldSize} 
        canTarget={canTarget} isTargetSelected={isTargetSelected} />
      <FutureIcon futureLabel={futureLabel} battlefieldSize={battlefieldSize} coords={occupant.coords}
        canTarget={canTarget} />
    </div>
  );
};

function HealthBar(props: {
  occupant: Fighter | Obstacle | Creation,
  occupantFuture: Fighter | Obstacle | Creation | null
}) {
  const { occupant, occupantFuture } = props;

  let proportion = (occupant.health / occupant.healthMax);
  let downed = false;
  if (proportion <= 0) {
    downed = true;
    proportion = Math.abs(proportion);
  };

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
  if (downed) bgColor = "var(--c-red-dark)";
  else if (proportion >= 1) bgColor = "var(--c-green-bold)";
  else if (proportion >= 0.5) bgColor = "var(--c-green)";
  else if (proportion >= HEALTH_DANGER_THRESHOLD) bgColor = "var(--c-yellow)";
  else bgColor = "var(--c-red)";
  const pixelScale = getPixelScale(window.innerWidth);
  const width = 25 * pixelScale;

  return (
    <div
      className="health-bar-outer"
      style={{
        backgroundColor: (downed ? "var(--c-grey-dark)" : "var(--c-white)"),
        minWidth: width,
        maxWidth: width
      }}
    >
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
    </div>
  );
};

function FutureIcon(props: {
  futureLabel: string | null,
  battlefieldSize: [number, number],
  coords: [number, number],
  canTarget: boolean,
}) {
  const { futureLabel, battlefieldSize, coords, canTarget } = props;

  if (futureLabel === null) return null;

  const icons: { [iconName: string] : string } = {
    'becameDowned':          "/public/icons/skull.png",
    'skippedBecauseStunned': "/public/icons/blast.png",
    'dealtDamage':           "/public/icons/blast.png",
    'gaveHealing':           "/public/icons/pluses.png",
    'defenseGained':         "/public/icons/shield.png",
    'makeObstacle':          "/public/icons/shield.png",
    'moveTo':                "/public/icons/boot.png",
  };
  const icon = icons[futureLabel];
  if (!icon) return null;

  const sideB = coords[0] > (battlefieldSize[0] - 1);

  return <img
    className={clss([
      'future-icon', 
      canTarget && 'can-target',
      sideB && 'mirror side-b'
    ])}
    src={icon}
  />;
};