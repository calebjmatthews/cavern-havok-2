# Cavern Havok MkII
## Description
* JRPG where battle takes place in a 5x5 grid.
* Many attacks hit the first target in a row, but others could target a specific enemy, plus-shaped area, row, or column.
* Importantly, enemies' planned moves appear while choices are being decided, as well as allies who have already selected their moves. This allows players to co-operate and to subvert enemy plans by defending or moving.
* Players can equip a movement ability, a defensive ability, and four main abilities which are displayed in a diamond with movement and defensive above to the left and right corners.
* "Charges" are gained each round, and 2 - 5 can be expended by using charged moves.
* moves can push targets around on the battlefield. Units are stunned and skip their current turn if they are pushed into an obstruction or another unit before their turn arrives.
* Spaces on the battlefield have their own terrain effects; for example, lava deals 1 damage to anyone standing on it, and shining ground gives 2 defense.

## Classes
* Raider: equips ax, attacks first target in enemy row; 11 Health, 3 Speed, 1 Charm
  * Flint Helmet (Head): +2 Damage if target is in column directly in front of user
  * Hide Vest (Top): 3 Defense
  * Hob-nailed Boots (Bottom): 1-2 move, Bless user with 1 Power
  * Rage Stomping Boots (Bottom): 1-2 move, Bless user with 2 Rage
  * Hatchet: 3 damage to first target in enemy row
  * Sweep Ax: 2 damage to an entire column
  * Cleaver: 3 charge | 6 damage to first target in enemy row
  * Scrappy Ax: 2 charge | User's Injury in damage to first target in enemy row
  * Stub Ax: 6 damage to space immediately in front of user
  * Tantrum: 2 damage to first target in enemy row | Bless user with 2 Rage
  * Provocation: 1 damage to first target in enemy row | Bless user with 3 Power, Bless target with 6 Power
* Javalin: equips spears, attacks any target; 14 Health, 4 Speed, 2 Charm
  * Feather Cap (Head): +1 damage if target is 6 or more columns away
  * Down Vest (Top): 2 Defense, an additional 2 Defense if all spaces around user are empty
  * Tufted Sandals: 1-2 move, Bless user with 1 Speed
  * Swallow: 2 damage to target
  * Blackbird: 3 damage to target at end of round
  * Heron: 2 charge | 1 damage to all targets on opposite side
  * Eagle: 3 charge | 2 damage to target for each empty space around them
  * Starling: 1 damage to all enemy targets in the back two rows
  * Hawk: 2 damage to target | Pull target forward 1 space
  * Swift: 1 damage to target | Bless user with 3 Speed
* Bulwark: equips barricade, defends self and allies; 18 Health, 2 Speed, 3 Charm
  * Head: Defense granted +2
  * Top: Defense +4
  * Light Greaves: 1-2 move, 1 Defense
  * Rescuer Greaves: Move to the space immediately in front of any ally
  * Pillar: 3 Defense to user and all allies in row
  * Basher: 2 Defense to user | 2 damage to first target in enemy row
  * Implacable: 4 charge | 20 Defense to user and all adjacent targets
* Eathshaker: equips hammer, drops stone obstructions; 14 Health, 1 Speed, 1 Charm
  * Head: +3 Obstruction health
  * Tremor: Push a boulder backwards 1 space, if occupied instead damage 3 and stun
* Chemist: equips herbs, throws bottles primarily for healing; 10 Health, 3 Speed, 2 Charm
  * Head: +2 Throw distance
  * Top: Defense +2, +1 Charge
  * Bottom: 1-2 move, +1 Charge
  * Empty bottle: 1 damage to throwing target
  * Kerosine: Curse throwing target with Oil
  * Philter: 2 charge | Cure one curse on throwing target, if target was cursed also heal 5
  * Molotov: 2 charge | 3 fire damage to throwing target
* Pyrotechnic: equips fireworks which deal damage and curses to areas; 9 Health, 3 Speed, 3 Charm
  * Head: Areas of effect +1 when user's health is full
* Artificer: equips tools to create constructs, these are placed on the battlefield and cause various (mostly aggressive) effects; 6 Health, 4 Speed, 4 Charm
  * Head: Creation health +2
* Tamer: rally a monster to your cause; 8 Health, 3 Speed, 5 Charm
  * Head: Healing to you affects your monster as well
* Dancer: equips cloths which move the user and deal damage simultaneously; 9 Health, 6 Speed, 5 Charm
  * Head: Damage +1 if acting first
* Blue mage: equips water rod; bless distant targets with regen and deal damage with charge; 9 Health, 1 Speed, 4 Charm
  * Head: Healing and regen effects +1
* Orange mage: equips cloud rod; push and damage targets and heal with charge; 10 Health, 5 Speed, 3 Charm
  * Head: Rod range +2
* Red mage: equips fire rod; damage targets with slow, powerful attacks; 8 Health, 1 Speed, 1 Charm
  * Head: Charge cost -1
* Violet mage: equips shroom rod; curse targets with negative effects; 10 Health, 3 Speed, 1 Charm
  * Head: Curse power +1
* Black mage: equips bomb rod; damage targets with bomb objects; 8 Health, 1 Speed, 4 Charm
  * Head: Throw distance +2
* White mage: equips gem rod; support allies with defense and blessings; 14 Health, 2 Speed, 5 Charm
  * Head: Blessing power +1
* Green mage: equips verdant rod to create plants and cause various (mostly supportive) effects; 11 Health, 2 Speed, 3 Charm
  * Head: Creation speed +2
* Brown mage: equips resonant rod to modify and utilize the terrain; 14 Health, 3 Speed, 1 Charm
  * Head: Ignore negative terrain effects

## Monsters
* Bubble: Mostly weak, but don't underestimate it's sacrificial attack; 6 Health, 2 Speed, 5 Charm
  * Wobbly Membrane (Top): 2 Defense
  * Drifting on the Breeze (Bottom): 1 - 3 move
  * Foamy Dash: 3 damage to first target in enemy row
  * Goodbye!: 3 charge | 6 damage to first taret in row, destroy self
* Boulder Mole: powerful defense, but less aggressive; 10 Health, 1 Speed, 2 Charm
  * Rocky Hide (Top): 6 Defense
  * Scrabbling Legs (Bottom): 1 move
  * Rubble Toss: 2 damage to first target in enemy row and a 1 space area around them
  * Stony Defense: Charge 2 | Defense +8 to a target within 4 spaces
  * Boulder Drop: Drop a 3 HP boulder anywhere on the user's side
* Sky Snake Ball: Don't look too closely; 16 Health, 2 Speed, 1 Charm
  * Tighten Up (Top): 4 Defense
  * Wiggle Out: A Sky Snake wiggles out onto a neighboring space
  * Many Teeth: 4 damage and a Curse of 1 Venom to first target in enemy row
* Sky Snake: Low health, but venomous; 2 Health, 5 Speed, 2 Charm
  * Curl Up (Top): 3 Defense
  * Sky Slither (Bottom): 1 - 3 move
  * Headbonk: 1 damage to first target in enemy row
  * Venomous Bite: 1 damage and a Curse of 1 Venom to first target in enemy row
* Sacristician: Water healing through regen.
* Bubblegorgon: A mystical monster that blows living bubbles; 30 Health, 2 Speed, 1 Charm
* Waterfall Pillar: When its health is filled it unleashes a terrible wave; 100 Health, 1 Speed, 1 Charm
* Caddisdragon: A small dragon that shields itself with boulders; 18 Health, 6 Speed, 1 Charm

## Blessings and Curses
* Many blessings have an equal and opposite curse. A blessing or curse will override its opposite when applied. Many also have effects which diminish over time.
* Regen/Venom: X healing/damage at the end of each round, diminishes by 1 at the end of each round.
* Power/Weakness: Deal X more/less damage or healing, diminishes by 1 at the end of each round.
* Shell/Fragile: Gain/lose X defense at the beginning of each round, diminishes by 1 at the end of each round.
* Fast/Slow: X more/less speed, diminishes by 1 at the end of each round.
* Weightless/Pinned: X more/less move, diminishes by 1 at the end of each round.
* Oil (Curse): Fire damage is doubled but removes this curse, expires in X rounds.
* Annointed (Blessing): Water healing is doubled but removes this blessing, expires in X rounds.
* Invisible (Blessing): Cannot be intentionally targeted, expires in X rounds.
* Magnetic (Blessing): Must be targeted by enemies if in range, expires in X rounds.
* Hex (Curse): Healing deals damage instead but removes this curse, expires in X rounds.
* Rebirth (Blessing): When downed, return to X health at the beginning of the next round and remove this blessing.
* Talisman (Blessing): Ignore the next X curses.
* Rage (Blessing): When damaged gain 1 Power, expires in X rounds.

## Enchantments
* Equipment can have an associated enchantment, which gives it a new passive or active effect.
* Vampiric: Heal 1 after dealing damage.
* Heavy: Slow priority, but +2 to Damage or +1 to Healing, Curse, or Blessing.
* Weightless: Fast priority.
* Sturdy: 2 Defense to user.
* Lacquered: 1 Shell to user.
* Venomous: 1 Venom to target.
* Holy: 1 Regen to target.
* Powerful: 1 Power to user.

## Adventuring
* Broken up into several encounters, with more generic "chambers" in between that contain helpful or neutral characters.
* Chamber characters: Wandering Salamanders, Mysterious Figures who make "predictions", a ghost fountain to enchant existing ephemeral equipment, some Character who gives you something burdensome that is valuable later, wandering chef who gives free food
  * Wandering Salamanders eat cinders, in exchange for equipment. "The Salamander looked at you. Something in her bearing suggested if you gave her cinders to eat, she might spit out useful equipment. The Salamander had very expressive eyes."

## Technical Considerations
* Battlefield state is passed to each client each round, with user/enemy comands creating outcomes that are applied to the battlefield state.
* Websockets should be used to pass this data in real time, with logic to register payloads that have been successfully recieved by each client, and to retry each with potentially multiple payloads at once until transer succeeds.
* Gzip or similar tool should be used to minimize data transfer load.
* When a round is complete, battle animations and UI elements should update according to the duration of each animation step. These steps should be unitless, so that the user can use a setting or press a button to speed them up.
* Commands will need to be split into actions before being translated into performed actions, in order to correctly sort higher priority parts of commands. Specifically, some abilities will involve adding defense in addition to other effects (such as dealing damage or moving). Defense increase needs to happen at the very beginning of a round, with the rest of the effects happening in normal fighter-speed order.