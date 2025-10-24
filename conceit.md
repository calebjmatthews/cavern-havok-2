# Cavern Havok MkII
## Description
* JRPG where battle takes place in a 5x5 grid.
* Many attacks hit the first target in a row, but others could target a specific enemy, plus-shaped area, row, or column.
* Importantly, enemies' planned moves appear while choices are being decided, as well as allies who have already selected their moves. This allows players to co-operate and to subvert enemy plans by defending or moving.
* Players can equip a movement ability, a defensive ability, and four main abilities which are displayed in a diamond with movement and defensive above to the left and right corners.
* "Charges" are gained each turn, and 2 - 5 can be expended by using charged moves.
* Moves can push targets around on the battlefield. Units are stunned and skip their current turn if they are pushed into an obstruction or another unit before their turn arrives.
* Spaces on the battlefield can have 

## Classes
* Raider: equips ax, attacks first target in row; 9 Health, 3 Speed, 1 Charm
  * Head: ax power +2 if user is in front column
  * Top: Defense +3
  * Bottom: Move 1-2
  * Hatchet: 2 damage to first target in row
  * Sweep Ax: 1 damage to first column
  * Cleaving Ax: 3 charge; 5 damage to first target in row
* Javalin: equips spears, attacks any target; 10 Health, 4 Speed, 2 Charm
  * Head: bow power +1 if user is in back column
  * Top: Defense +2, or +4 if in back column
  * Bottom: Move 1-2
  * Sparrow: 1 damage to target
  * Yellowthroat: 2 damage to target at end of round
  * Heron: 2 charge | 1 damage to all targets on opposite side
* Bulwark: equips barricade, defends self and allies; 15 Health, 2 Speed, 3 Charm
  * Head: Defense persists between turns
  * Top: Defense +4
  * Bottom: Move 1-2
  * Pillar: Defense +3 to all allies in row
  * Basher: Deal half of current defense as damage to first target in row
  * Implacable: 4 charge | Defense +20
* Eathshaker: equips hammer, drops stone obstructions; 12 Health, 1 Speed, 1 Charm
  * Head: Stone health +3
* Chemist: equips herbs, throws bottles primarily for healing
  * Head: Bottle throw distance +2
  * Top: Defense +2, Charge +1
  * Bottom: Move 1-2
  * Empty bottle: 1 damage to throwing target
  * Kerosine: Cover throwing target with oil
  * Philter: 2 charge | Cure one curse on throwing target, if target was cursed also heal 5
  * Molotov: 2 charge | 3 fire damage to throwing target
* Pyrotechnic: equips fireworks which deal damage and curses to areas; 7 Health, 3 Speed, 3 Charm
  * Head: Firework area of effect +1
* Artificer: equips tools to create constructs, these are placed on the battlefield and cause various effects; 6 Health, 4 Speed, 4 Charm
  * Head: Construct health +1
* Blue mage: equips water rod; heals any target and deal damage with charge; 9 Health, 1 Speed, 4 Charm
  * Head: Water rod power +1
* Green mage: equips cloud rod; push and damage targets and heal with charge; 7 Health, 5 Speed, 3 Charm
  * Head: Cloud rod range +2
* Red mage: equips fire rod; damage targets with slow, powerful attacks; 6 Health, 1 Speed, 1 Charm
  * Head: Fire rod charge time -1
* Violet mage: equips shroom rod; curse targets with negative effects; 8 Health, 3 Speed, 1 Charm
  * Head: curse duration +1
* Black mage: equips bomb rod; damage targets with bomb objects; 8 Health, 1 Speed, 4 Charm
  * Head: bomb throw distance +2
* White mage: equips gem rod; bless allies with defense and positive effects; 11 Health, 2 Speed, 5 Charm
  * Head: blessing duration +1

## Technical Considerations
* Battlefield state is passed to each client each turn, with user/enemy actions acting as deltas that are applied to the battlefield state.
* Websockets should be used to pass this data in real time, with logic to register deltas that have been successfully recieved by each client, and to retry each with potentially multiple deltas at once until transer succeeds.
* Gzip or similar tool should be used to minimize data transfer load.
* When a round is complete, battle animations and UI elements should update according to the duration of each animation step. These steps should be unitless, so that the user can use a setting or press a button to speed them up.