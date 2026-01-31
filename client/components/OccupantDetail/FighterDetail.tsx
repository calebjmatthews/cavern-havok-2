import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import equipments from "@common/instances/equipments";
import alterations from "@common/instances/alterations";
import "./fighterDetail.css";
import OccupantSprite from "../OccupantSprite/OccupantSprite";
import IntentionText from "../Battle/IntentionText";

export default function FighterDetail(props: {
  battleState?: BattleState,
  battleStateFuture?: BattleState,
  fighter: Fighter
}) {
  const { battleState, battleStateFuture, fighter } = props;

  const alterationsActive = Object.values(battleState?.alterationsActive ?? {})
  .filter((alterationActive) => (
    alterationActive.ownedBy === fighter.id
  ));

  const command = Object.values(
    battleStateFuture?.commandsPending ?? battleState?.commandsPending ?? {}
  ).filter((command) => (
    command.fromId === fighter.id
  ))?.[0];

  return (
    <article className='fighter-detail'>
      <header>
        <span className='text-title'>{fighter.name}</span>
      </header>
      <div className='body'>
        <section className='section-primary'>
          <span className='text-subtitle'>{`Class: ${fighter.characterClass}`}</span>
          <div className='sprite-and-stats'>
            <OccupantSprite
              occupant={fighter}
              battlefieldSize={battleState?.size ?? [5, 5]}
              scale={1.5}
            />
            <div className='stats'>
              <span>{`Health: ${fighter.health}/${fighter.healthMax}`}</span>
              <span>{`Charge: ${fighter.charge}`}</span>
              <span>{`Speed: ${fighter.speed}`}</span>
              <span>{`Cinders: ${fighter.cinders}c`}</span>
            </div>
          </div>
          {alterationsActive.length > 0 && (
            <div>
              <span className='text-subtitle'>{`Effects active:`}</span>
              {alterationsActive.map((alterationActive) => {
                const alteration = alterations[alterationActive.alterationId];
                if (!alteration) return null;
                return (
                  <div key={`fighter-detail-alteration-${alterationActive.id}`}>
                    {`${alteration.id} (x${alterationActive.extent})`}
                  </div>
                );
              })}
            </div>
          )}
          {(command && battleState) && (
            <div>
              <span className='text-subtitle'>{`Intentions:`}</span>
              <IntentionText command={command} battleState={battleState} />
            </div>
          )}
        </section>
        <section className='section-equipment'>
          <span className='text-subtitle'>{`Equipment:`}</span>
          {fighter.equipped.map((equip) => {
            const equipment = equipments[equip.equipmentId];
            if (!equipment) return null;
            return (
              <div key={`fighter-detail-equipment-${equipment.id}`} className='equipment'>
                <span className='text-title'>{equipment.id}</span>
                <span>{equipment.description}</span>
              </div>
            );
          })}
        </section>
      </div>
    </article>
  );
};