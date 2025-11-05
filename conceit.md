# Cavern Havok MkII
## Description
* JRPG where battle takes place in a 5x5 grid.
* Many attacks hit the first target in a row, but others could target a specific enemy, plus-shaped area, row, or column.
* Importantly, enemies' planned moves appear while choices are being decided, as well as allies who have already selected their moves. This allows players to co-operate and to subvert enemy plans by defending or moving.
* Players can equip a movement ability, a defensive ability, and four main abilities which are displayed in a diamond with movement and defensive above to the left and right corners.
* "Charges" are gained each round, and 2 - 5 can be expended by using charged moves.
* Moves can push targets around on the battlefield. Units are stunned and skip their current turn if they are pushed into an obstruction or another unit before their turn arrives.
* Spaces on the battlefield have their own terrain effects; for example, lava deals 1 damage to anyone standing on it, and shining ground gives 2 defense.

## Classes
* Raider: equips ax, attacks first target in row; 9 Health, 3 Speed, 1 Charm
  * Horned Helmet (Head): Damage +2 if target is in column directly in front of user
  * Hide Vest (Top): Defense +3
  * Hob-nailed Boots (Bottom): Move 1-2, Power 1
  * Hatchet: 3 damage to first target in row
  * Sweep Ax: 2 damage to front column
  * Cleaving Ax: 3 charge; 6 damage to first target in row
* Javalin: equips spears, attacks any target; 10 Health, 4 Speed, 2 Charm
  * Feather Cap (Head): Damage +1 if target is 6 or more columns away
  * Down Vest (Top): Defense +2, an additional Defense +2 if all spaces around user are empty
  * Tufted Sandals: Move 1-2, Speed +1
  * Swallow: 1 damage to target
  * Blackbird: 2 damage to target at end of round
  * Heron: 2 charge | 1 damage to all targets on opposite side
* Bulwark: equips barricade, defends self and allies; 15 Health, 2 Speed, 3 Charm
  * Head: Defense granted +2
  * Top: Defense +4
  * Bottom: Move 1-2, Defense +1
  * Pillar: Defense +3 to all allies in row
  * Basher: Defense +2 to user | 2 damage to first target in row
  * Implacable: 4 charge | Defense +20 to user and all adjacent targets
* Eathshaker: equips hammer, drops stone obstructions; 12 Health, 1 Speed, 1 Charm
  * Head: Obstruction health +3
  * Tremor: Push a boulder backwards 1 space, if occupied instead damage 3 and stun
* Chemist: equips herbs, throws bottles primarily for healing
  * Head: Throw distance +2
  * Top: Defense +2, Charge +1
  * Bottom: Move 1-2, Charge +1
  * Empty bottle: 1 damage to throwing target
  * Kerosine: Curse throwing target with Oil
  * Philter: 2 charge | Cure one curse on throwing target, if target was cursed also heal 5
  * Molotov: 2 charge | 3 fire damage to throwing target
* Pyrotechnic: equips fireworks which deal damage and curses to areas; 7 Health, 3 Speed, 3 Charm
  * Head: Areas of effect +1 when user's health is full
* Artificer: equips tools to create constructs, these are placed on the battlefield and cause various effects; 6 Health, 4 Speed, 4 Charm
  * Head: Creation health +1
* Blue mage: equips water rod; bless distant targets with regen and deal damage with charge; 9 Health, 1 Speed, 4 Charm
  * Head: Healing and regen effects +1
* Green mage: equips cloud rod; push and damage targets and heal with charge; 7 Health, 5 Speed, 3 Charm
  * Head: Rod range +2
* Red mage: equips fire rod; damage targets with slow, powerful attacks; 6 Health, 1 Speed, 1 Charm
  * Head: Charge cost -1
* Violet mage: equips shroom rod; curse targets with negative effects; 8 Health, 3 Speed, 1 Charm
  * Head: Curse power +1
* Black mage: equips bomb rod; damage targets with bomb objects; 8 Health, 1 Speed, 4 Charm
  * Head: Throw distance +2
* White mage: equips gem rod; support allies with defense and blessings; 11 Health, 2 Speed, 5 Charm
  * Head: Blessing power +1

## Monsters
* Bubble: mostly weak, but don't underestimate it's sacrificial attack; 4 Health, 2 Speed, 5 Charm
  * Wobbly Membrane (Top): Defense +1
  * Drifting on the Breeze (Bottom): Move 1 - 3
  * Foamy Dash: 2 damage to first target in row
  * Goodbye!: 3 charge | 5 damage to first taret in row, destroy self
* Boulder Mole: powerful defense, but less likely to attack; 8 Health, 1 Speed, 2 Charm
  * Rocky Hide (Top): Defense +6
  * Scrabbling Legs (Bottom): Move 1
  * Rubble Toss: 1 damage to first target in row and a 1 space area around them
  * Stony Defense: Charge 2 | Defense +8 to a target within 4 spaces
  * Boulder Drop: Drop a 3 HP boulder anywhere on the user's side
* Bubblegorgon: A mystical monster that blows living bubbles; 16 Health, 2 Speed, 1 Charm
* Tsunami Pillar: When its health is filled it unleashes a terrible wave; 100 Health, 1 Speed, 1 Charm
* Caddisdragon: A small dragon that shields itself with boulders; 10 Health, 6 Speed, 1 Charm

## Blessings and Curses
* Many blessings have an equal and opposite curse. A blessing or curse will override its opposite when applied. Many also have effects which diminish over time.
* Regen/Poison: X healing/damage at the end of each round, diminishes by 1 at the end of each round.
* Power/Weakness: Deal X more/less damage or healing, diminishes by 1 at the end of each round.
* Shell/Fragile: Gain/lose X defense at the beginning of each round, diminishes by 1 at the end of each round.
* Fast/Slow: X more/less speed, diminishes by 1 at the end of each round.
* Weightless/Pinned: X more/less move, diminishes by 1 at the end of each round.
* Oil (Curse): Fire damage is doubled but removes this curse, expires in X rounds.
* Aspersion (Blessing): Water healing is doubled but removes this blessing, expires in X rounds.
* Invisible (Blessing): Cannot be intentionally targeted, expires in X rounds.
* Magnetic (Blessing): Must be targeted by enemies if in range, expires in X rounds.
* Hex (Curse): Healing deals damage instead but removes this curse, expires in X rounds.
* Rebirth (Blessing): When downed return to X health and remove this blessing.
* Talisman (Blessing): Ignore the next X curses.

## Technical Considerations
* Battlefield state is passed to each client each round, with user/enemy comands creating outcomes that are applied to the battlefield state.
* Websockets should be used to pass this data in real time, with logic to register payloads that have been successfully recieved by each client, and to retry each with potentially multiple payloads at once until transer succeeds.
* Gzip or similar tool should be used to minimize data transfer load.
* When a round is complete, battle animations and UI elements should update according to the duration of each animation step. These steps should be unitless, so that the user can use a setting or press a button to speed them up.
* Commands will need to be split into actions before being translated into performed actions, in order to correctly sort higher priority parts of commands. Specifically, some abilities will involve adding defense in addition to other effects (such as dealing damage or moving). Defense increase needs to happen at the very beginning of a round, with the rest of the effects happening in normal fighter-speed order.