# Cavern Havok MkII
## Description
* JRPG where battle takes place in a 5x5 grid.
* Many attacks hit the first target in a row, but others could target a specific enemy, plus-shaped area, row, or column.
* Importantly, enemies' planned moves appear while choices are being decided, as well as allies who have already selected their moves. This allows players to co-operate and to subvert enemy plans by defending or moving.
* Players can equip a movement ability, a defensive ability, and four main abilities which are displayed in a diamond with movement and defensive above to the left and right corners.
* "Charges" are gained each round, and 2 - 5 can be expended by using charged moves.
* Moves can push targets around on the battlefield. Units are stunned and skip their current turn if they are pushed into an obstruction or another unit before their turn arrives.
* Spaces on the battlefield have their own terrain effects; for example, lava deals 1 damage to anyone standing on it, and shining ground gives 2 defense.
* Story:
  * Sprites are creatures given life by "The spirit of adventure", i.e. the player. They sleep when not being used to play.
  * Other creatures are toys given life by other creators.
  * Cinders are pieces of this life and activity that are broken off and return in a kind of ecosystem, never actually destroyed.
  * Even the levels Sprites journey through are living creations for the purpose of entertainment.
  * Your character, the Sprite, begins silent and without a personality. But as the player journeys and finds certain hidden hot springs the Sprite can bathe in, they start to gain self-awareness, which is reflected in gameplay by the Sprite going on adventures while the player is away.
    * You found [Spritename's] diary. Here's a recent entry: "Sometimes I'm filled with a spirit of adventure. I can't predict when it will happen, it seems to come and go like tremors in the earth. When it's with me, I feel so certain. I feel so confident. Like everything I do is the correct thing to do."
    * A rival Sprite with a past: "A fellow Sprite! Do you know me? ... No, you're just like the other ones, aren't you? You don't know anyone, or anything. ...And you can't even even talk yet? I'm tired of this. Get out of my way."

## Classes
* Raider: equips ax, attacks first target in enemy row; 11 Health, 3 Speed, 1 Charm
  * Visuals: Neutral colored helmets and shoulderguards with contrasting squarish bits; axes often large
  - [X] Shard Helmet (Head): +2 Damage if target is in column directly in front of user
  - [ ] Bartizan Helmet (Head): During battle, when the wearer loses Maximum health gain 5 Defense
  - [ ] Monadnock Helmet (Head): At each round's beginning, set the wearer's Maximum health to 10 if it is less than 10
  * Spire Helmet (Head): During battle, when the wearer gains or loses Maximum health Bless with 1 Power
  - [X] Rookie Shoulderguards (Top): 3 Defense
  - [ ] Heavy Shoulderguards (Top): 5 Defense, Curse user with 2 Lag
  - [X] Hatchet: 3 damage to first target in enemy row
  - [X] Revel: 2 damage to first target in enemy row, if target is Knocked Out +1 Maximum health to user
  - [X] Crescent: 2 damage to closest occupied enemy column
  - [X] Ajax: 3 charge | 6 damage to first target in enemy row
  - [X] Feist: 2 charge | User's Injury in damage to first target in enemy row
  - [ ] Spur: 6 damage to space immediately in front of user
  - [ ] Severian: 6 damage to first target in enemy row, user loses 1 Maximum health
  - [ ] Bardiche: 5 charge | 14 damage to first target in enemy row | User loses 2 Maximum health
  * Tomahawk: 1 charge | 1 damage 4 times to first target in enemy row
  * Tantrum: 2 damage to first target in enemy row | Bless user with 2 Rage
  * Provocation: 2 charge | 1 damage to first target in enemy row | If target isn't Knocked Out Bless user with 3 Power and Bless target with 6 Power
  * Halberd: 4 Break and 2 damage to first target in enemy row
  * Leadarm: 3 damage and Curse of 2 Fragile to first target in enemy row | Slow
  * Labrys: 2 damage to first target in enemy row | 2 Defense
  * Carnelian: 2 damage to first target in enemy row, if target is Knocked Out user is Blessed with 3 Power
  * Malediction: 6 damage to an entire column | User loses 2 Maximum health
  * Jackax: 1 damage, plus 1 damage for each 10 health the target has
* Keeneye: equips spears, attacks any target; 10 Health, 5 Speed, 2 Charm
  * Visuals: Wide, round hats and relatively colorful ponchos; spears are relatively simple but have attached feathers
  - [X] Ragosa (Head): +1 damage if target is 6 or more columns away
  - [ ] Kappa (Head): +2 damage if user didn't deal damage last round
  - [ ] Enko (Head): User is Blessed with 1 Quick at the beginning of each round
  - [X] Greenhorn Poncho (Top): 3 Defense
  - [ ] Loner Poncho (Top): 2 Defense, if all spaces around user are empty gain an additional 3 Defense
  * Seersucker Poncho (Top): 2 Defense, if user gain no Defense last round gain an additional 3 Defense
  - [X] Sparrow: 2 damage to target
  - [X] Starling: 1 damage to all enemy targets in the back two columns
  - [ ] Blackbird: 3 damage to target | Slow
  - [ ] Egret: 3 Shieldbreak, 1 damage
  - [X] Heron: 2 charge | 1 damage to all targets on opposite side
  - [ ] Eagle: 3 charge | 2 damage to target for each empty space around them
  - [ ] Vulture: 1 damage to target | An additional 3 damage to target if it is In Danger
  * Bluejay: 1 charge | 3 damage and Curse of 2 Fragile to target in user's row
  * Hawk: 3 damage to target | Pull target forward 1 space
  * Falcon: 2 damage to target | Push target backward 1 space
  * Swift: 1 damage to target | Bless user with 3 Quick
  * Albatros: 2 damage to target and Curse target with 2 Pinned
  * Petrel: Move backward 2 and 1 damage to target | if Moving was successful, 3 more damage to target
* Bulwark: equips barricade, defends self and allies; 18 Health, 2 Speed, 3 Charm
  * Visuals: Square and visored helmets with large wide-shouldered armor; barricades are huge shields with irregular shapes
  * Head: Defense granted +2
  * Top: 4 Defense
  * Light Greaves: Move 1 - 2 | 1 Defense
  * Rescuer Greaves: Move 1 or Warp to a space immediately in front of any ally
  * Pillar: 3 Defense to user and all allies in row
  * Basher: 2 Defense to user | 2 damage to first target in enemy row
  * Implacable: 4 charge | 20 Defense to user and all adjacent targets
* Eathshaker: equips hammer, drops stone obstructions; 14 Health, 1 Speed, 1 Charm
  * Visuals: Headbands and martial arts gis, hammers are large
  * Head: +2 Obstruction health
  * Head: +3 Obstruction health when placed directly in front of wearer
  * Tremor: Completely Push an obstacle directly in front of the user, if it strikes a target deal the obstacle's health in damage
  * Maul: Destroy an obstacle in the user's row to Bless user with 3 Power
* Chemist: equips herbs, throws bottles for healing and cursing; 10 Health, 3 Speed, 2 Charm
  * Visuals: Pillbox hats and teal smocks
  * Head: +2 Throw distance
  * Top: 2 Defense | 1 Charge Up
  * Bottom: Move 1 - 2 | 1 Charge Up
  * Empty bottle: 1 damage to throwing target
  * Kerosine: 5 Oil to target within 3 Range 
  * Alembic: +2 Charge
  * Philter: 2 charge | 5 Cure to target within 3 Range, if target was Cursed also give 5 healing
  * Incendiary: 2 charge | 4 Fire damage to target within 3 Range
* Pyrotechnic: equips fireworks which deal damage and curses to areas; 9 Health, 3 Speed, 3 Charm
  * Visuals: Caps with sparklers built it and dark aprons
  * Head: Areas of effect +1 when user's health is full
* Artificer: equips tools to create constructs, these are placed on the battlefield and cause various (mostly aggressive) effects; 8 Health, 4 Speed, 4 Charm
  * Visuals: Goggles as headware and overalls
  * Head: Creation health +2
* Tamer: rally a monster to your cause; 8 Health, 3 Speed, 5 Charm
  * Head: Healing to you affects your monster as well
* Dancer: equips cloths which move the user and deal damage simultaneously; 9 Health, 6 Speed, 5 Charm
  * Head: Damage +1 if acting first
* Blue Mage: equips water rod; bless targets with regen and deal damage with charge; 9 Health, 1 Speed, 4 Charm
  * Visuals: Blue hood and robe
  - [X] Rainfall Hood (Head): +1 Healing and regen effects to targets other than user
  - [ ] Protection Hood (Head): +1 Defense given to targets other than user
  - [ ] Aqueous Hood (Head): Water damage and Water healing +1
  - [ ] Charity Hood (Head): 1 Power to wearer after giving Defense to others
  - [X] Droplet Robe (Top): 3 Water Defense
  - [ ] Sacrosanct Robe (Top): 3 Water Defense and 1 Annointed
  - [X] Coldburst: 2 Water damage and Curse with 2 Lag to target within 6 Range
  - [X] Gentle Rain: 1 Water healing and 2 Water Defense to target within 3 Range
  - [o] Current Spiral: 2 Water healing and 3 Water Defense to self and targets within 1 Range
  - [ ] Rushing Helix: 2 Defense  and 1 Charge to self and targets within 1 Range
  - [o] Consecrate: 5 Annointed to self and targets within 1 Range
  - [o] Frost Arc: 3 charge | 6 Water damage to space 5 in front of user
  - [o] Snowbeam: 2 charge | 3 Water damage to all enemy targets in user's row
  * 1 Regen and 2 Shell to self and targets within 1 Range
  * 2 Regen and 1 Shell to target within 3 Range
* Orange Mage: equips cloud rod; push and damage targets and support allies with charge; 10 Health, 5 Speed, 3 Charm
  * Visuals: Triangular orange cloud cap and ruffled shirt
  - [ ] Cloudy Cap (Head): Rod range +2
  - [ ] Cirrus Cap (Head): Rod range +1, Wind damage and Wind healing +1
  - [ ] Stratus Cap (Head): Wearer is Blessed with 1 Power after using a Pushing or Pulling
  - [ ] Ruffled Shirt (Top): 3 Defense
  - [ ] Breezy Shirt (Top): 3 Defense and 3 Weightless
  - [ ] Zephyr: 2 Wind damage and 1 Push to a target within 4 Range
  - [ ] Updraft: 2 Weightless and 2 Defense to target within 5 Range
  - [ ] Cloud Rush: 3 Wind damage to front column and 2 Push
  - [ ] Vacuum Draw: 2 Wind damage to rear column and 1 Pull
  - [ ] Gale: 1 Wind damage to all enemy targets and 1 Push
  - [ ] White Breeze: 2 charge | 3 Wind healing to an ally within 3 Range
  - [ ] White Wind: 3 charge | 2 Wind healing to all allies within 2 Range
  * Pull all targets within 1 space of 4 Range toward the center point
* Red Mage: equips fire rod; damage targets with slow, powerful attacks; 8 Health, 1 Speed, 1 Charm
  * Visuals: Pointed hat and red tunic
  * Head: Charge cost -1
* Violet Mage: equips shroom rod; curse targets with negative effects; 10 Health, 3 Speed, 1 Charm
  * Visuals: Purple shroud hood and cloak with large sleeves
  * Head: Curse power +1
* Black Mage: equips bomb rod; damage targets with bomb objects; 8 Health, 1 Speed, 4 Charm
  * Visuals: Black cowl and vestment (witchy look, e.g. Geno)
  * Head: Throw distance +2
* White Mage: equips gem rod; support allies with defense and blessings; 14 Health, 2 Speed, 5 Charm
  * Visuals: Sparkling diadem and gown
  * Head: Blessing power +1
* Green Mage: equips verdant rod to create plants and cause various (mostly supportive) effects; 11 Health, 2 Speed, 3 Charm
  * Visuals: Hair clips (branches, moss, grapes, etc) and green wrappings
  * Head: Creation speed +2
* Brown Mage: equips resonant rod to modify and utilize the terrain; 14 Health, 3 Speed, 1 Charm
  * Visuals: Headgear (cloth wrap + mask) and tights
  * Head: Ignore negative terrain effects
* Common
  * Grappling Hook: Defend 1 | Pull an enemy 1 space
  * Springboard: Defend 1 | Push an enemy 1 space
  * Enchanted Hammer: Enchant one unenchanted gear for this adventure
  * Smelling Salts: Revive a downed target to 1 health
  * Gleaming Shield: Charge 3 | 6 Defense and 2 Shell to user

## Areas
* Prismatic Falls: Raider, Blue Mage
* Cloud Sea: Javalin, Orange Mage
* Swornwood: Bulwark, Green Mage
* Basalt Cathedral: Earthshaker, Brown Mage
* Golden Waltz: Dancer, White Mage
* Hall of Jars: Chemist, Violet Mage
* Pyroclastic Glasslands: Pyrotechnic, Black Mage
* Sunken University: Artificer, Red Mage

## Monsters
* Bubble: Mostly weak, but don't underestimate its sacrificial attack; 6 Health, 2 Speed, 5 Charm
  * Wobbly Membrane (Top): 2 Defense
  * Drifting on the Breeze (Bottom): Move 1 - 3
  * Foamy Dash: 3 damage to first target in enemy row
  * Goodbye!: 3 charge | 6 damage to first taret in row, destroy self
* Boulder Mole: powerful defense, but less aggressive; 10 Health, 1 Speed, 2 Charm
  * Rocky Hide (Top): 6 Defense
  * Scrabbling Legs (Bottom): Move 1
  * Rubble Toss: 2 damage to first target in enemy row and a 1 space area around them
  * Stony Defense: Charge 2 | Defense +8 to a target within 4 spaces
  * Boulder Drop: Drop a 3 HP boulder anywhere on the user's side
* Flying Snake Ball: Don't look too closely; 16 Health, 2 Speed, 1 Charm
  * Tighten Up (Top): 4 Defense
  * Squirming Heads: 5 damage to first target in enemy row
  * Wiggle Out: A Flying Snake wiggles out onto a neighboring space
* Flying Snake: Low health, but venomous; 2 Health, 5 Speed, 2 Charm
  * Curl Up (Top): 3 Defense
  * Gliding Slither (Bottom): Move 1 - 3
  * Headbonk: 1 damage to first target in enemy row
  * Venomous Fangs: 1 damage and a Curse of 1 Venom to first target in enemy row
* Magic Deer: Water healing
* Waterfall Golem: Made of animated rock and casading water; has only one main move which is significantly damaging but costs 1 Charge; 16 Health, 1 Speed, 4 Charm
* Bubblegorgon: A mystical monster that blows living bubbles; 60 Health, 2 Speed, 1 Charm
* Sacristician: When its health is filled it summons a terrible wave; 100 Health, 1 Speed, 1 Charm
* Caddislizard: A huge lizard that shields itself with boulders; 18 Health, 6 Speed, 1 Charm

## Blessings and Curses
* Many blessings have an equal and opposite curse. A blessing or curse will override its opposite when applied. Many also have effects which diminish over time.
* Regen/Venom: X healing/damage at the end of each round, diminishes by 1 at the end of each round.
* Power/Weakness: Deal X more/less damage or healing (but not less than 1), diminishes by 1 at the end of each round.
* Shell (Blessing): Gain X defense at the beginning of each round, diminishes by 1 at the end of each round.
* Tough/Fragile: When gaining defense gain X more/less (but not less than 1), diminishes by 1 at the end of each round.
* Quick/Lag: X more/less speed, diminishes by 1 at the end of each round.
* Weightless/Pinned: Movement range is expanded/reduced by X, diminishes by 1 at the end of each round.
* Oil (Curse): Fire damage is doubled but removes this curse, expires in X rounds.
* Annointed (Blessing): Water healing or defense is doubled but removes this blessing, expires in X rounds.
* Mutated (Curse): Healing does not affect target but Bio damage is absorbed, expires in X rounds.
* Invisible (Blessing): Cannot be intentionally targeted unless no other targets exist, expires in X rounds.
* Magnetic (Blessing): Must be targeted by enemies if in range, expires in X rounds.
* Hex (Curse): Healing deals damage instead but removes this curse, expires in X rounds.
* Rebirth/Curse: When downed, return to X health at the beginning of the next round and remove this blessing / Target takes their Maximum Health in damage in X rounds.
* Talisman/Poppet: Ignore the next X Curse/Blessing Points.
* Diamondized (Curse): Power, toughness, and movement are lowered to a minimum for X rounds, or until target is damaged.
* Shroom'd (Curse): When possible, harmful moves must target allies and helpful moves must target enemies, expires in X rounds or if target is delt Fire damage.
* Courage/Fear: When damaged gain 1 Power, expires in X rounds / When gaining defense also gain 1 Weakness, expires in X rounds

## Enchantments
* Equipment can have an associated enchantment, which gives it a new passive or active effect.
* Vampiric: Heal 1 after dealing damage.
* Weighty: Slow priority, but +1 to Damage.
* Heavy: Slow priority, but +2 to Damage or +1 to Healing, Curse, or Blessing.
* Fey: A powerful glamour that changes every round.
* Ominous: +2 to Damage or +1 to Healing, Curse, or Blessing but deal 1 damage to user.
* Weightless: Fast priority.
* Sturdy: 2 Defense to user.
* Lacquered: 1 Shell to user.
* Venomous: 1 Venom to target.
* Holy: 1 Regen to target.
* Warding: 1 Talisman to target.
* Powerful: 1 Power to user.
* Dynamic: 1 less Charge cost (but not less than 1).

## Twinning
* Some rare (or late-game) equipment could have an enchantment that is twice as effective as normal (i.e. glamour), but comes with a Bane as well. Banes:
* Bound: Cannot be unequipped for the rest of the adventure.
* Withering: Holder loses 1 health at the end of each round.
* Delicate: Breaks after one use, but is restored at the end of the battle.
* Corrupted: Holder gains 1 Cycling Curse at the end of every third round.
* Febrile: Holder has 2 Starting Weakness.

## Adventuring
* Rather than placing fighters directly at the beginning of each battle, maybe pick "Front", "Middle", or "Back" and be randomly (but deterministically) placed within either the front two rows, the middle three, or the back two.
* Broken up into several encounters, with more generic "scenes" in between that contain helpful or neutral characters.
* Scene characters include:
* Mysterious Figures who are performing research (i.e. giving quests).
* Ghostly hot springs to enchant existing ephemeral equipment.
* A poor poet who gives poetry scrolls that can be traded to other characters. These scrolls take up a main gear slot, don't do anything, and can't be unequipped without breaking them. Other scene characters will trade these for premium versions of their stuff. Over time, the poet can be persuaded that (his? her?) poetry is worthwhile, which makes it more expensive but more compelling to the other characters.
* Wandering chef who prepares cheap food (or free food, if "Chef's choice").
* Knapper (your semi-creator) who will remove a glyph of your choice in exchange for two random glyphs.
* Salamanders who eat cinders in exchange for ephemeral equipment.
  * "The Salamander looked at you. Something in her bearing suggested if you gave her cinders to eat, she might spit out useful equipment. The Salamander had very expressive eyes." Probably not, would want the Salamander to talk.

## Food and Glyphs
* Food (pastries) and glyphs (you engraved the XXXXX Glyph on the stone of your body) are two mid-adventure upgrades.
* Food heals and offers temporary benefits (Become Blessed with 2 Power, or Become Blessed with 5 Regen), whereas glyphs offer rest-of-adventure upgrades (Gain 3 Maximum Health for this adventure, or Gain 1 Fire Aspect for this adventure, or Begin battles Blessed with 2 Shell for this adventure).
* Glyphs could also increase some stat after the user accomplishes something, like Gain 2 Maximum Health for this adventure after every third enemy defeated, or Gain 1 Fire Aspect for this adventure after every other Charge move used, or Gain 1 Speed after every piece of Equipment gained.

## Hats
* Seems like the current benefit of Hats (conditional bonuses) should go to Artifacts.
* Instead, Hats could offer a kind of self-counter. I.e. give some reward (healing, Defense, Blessings, Cinders) when a fighter's action meets some condition.

## Artifacts
* Could be a more fun approach to stat increases and passive effects than glyphs.
* Could be displayed as accessories on the body of the Sprite: capes, belts, wings, necklaces, flags, backpacks, etc.
* Hearts could be rare artifacts that dramatically change their holder. For example, a flame heart could make the user absorb fire damage, be weak to water damage, and have their colorless damage and healing become fire element. Visually, it could change the Sprite's body to be an animated fiery texture. A Sprite could only equip one heart at a time.
* Some artifacts could be growth-themed, and have some beneficial effect at the end of each battle.

## Artifact Brainstorming
- [ ] Red Scarf (Ubiquitous): Gain 3 Maximum Health
- [ ] Red Scroll (Rare): Gain 1 Maximum Health at the end of each battle
- [ ] Green Scarf (Ubiquitous): Gain 3 Speed
- [ ] Green Scroll (Rare): Gain 1 Speed at the end of each battle
- [ ] Black Scarf (Common): Gain 2 Maximum Health and 1 Starting Power
- [ ] Blue Scarf (Common): Gain 2 Maximum Health and 3 Starting Shell
- [ ] Orange Scarf (Common): Gain 2 Maximum Health and 3 Starting Weightless
* Alert Button (Common): Decide precisely where to place your fighter at the start of battle
- [ ] Pointed Badge (Common): +1 Damage when attacking targets in the wearer's row
- [ ] Square Badge (Common): +1 Damage when the four spaces around the wearer are empty
- [ ] Pentagonal Badge (Common): +1 Damage when attacking target exactly 5 columns ahead of the wearer
- [ ] Hunter Flag (Common): 1 additional chest to choose from at the end of a battle
- [ ] Jewel Flag (Common): Twice as likely to find rare treasure
- [ ] Starry Flag (Rare): Each set of chests will include an Enchanted Chest
* Lithium Dowsing Rod (Common): 2 Curative Laylines (3 Healing) created around the wearer at start of each battle
* Lead Dowsing Rod (Common): 2 Dynamic Laylines (2 Power) created around the wearer at start of each battle
* Titanium Dowsing Rod (Common): 2 Steadying Laylines (8 Defense) created around the wearer at start of each battle
* Nitre Dowsing Rod (Common): 2 Cinder Piles created around the wearer at the start of each battle and every third round
* Nitre Salts (Rare): Heal 1 each time the wearer gains Cinders
* Chitenous Claws (Rare): Fast attacks also Curse the target with 2 Fragile
* Glowing Claws (Rare): Fast attacks also Curse the target with 2 Weakness
* Toxic Claws (Rare): Fast attacks also Curse the target with 2 Venom
* Dynamo Belt (Rare): After using a Charge move, gain 1 Charge
* Resolution Mantle (Common): When Defense is broken, gain 2 Shell
* Retribution Mantle (Common): When damaged by an enemy attack, deal 2 damage in response
- [ ] Atlas Gloves (Ubiquitous): Gain 1 Artifact Spot, Gain 2 Main Equipment Spots
- [ ] Padded Gloves (Ubiquitous): Gain 1 Artifact Spot, Gain 2 Maximum Health
- [ ] Quick-Draw Gloves (Ubiquitous): Gain 1 Artifact Spot, Gain 2 Speed
- [ ] Work Gloves (Common): Gain 2 Artifact Spots
- [ ] Power Gloves (Common): Gain 1 Artifact Spot, Gain 1 Starting Power
* Red Prism (Uncommon): Any Non-elemental damage delt by the wearer becomes Fire damage.
* Blue Prism (Uncommon): Any Non-elemental damage delt by the wearer becomes Water damage.
* Green Prism (Uncommon): Any Non-elemental damage delt by the wearer becomes Bio damage.
* Halo (Mythical): Gain 1 Starting Rebirth
* Diaphenous Heart (Mythical): Gain 2 Charge every round rather than 1, but current Maximum Health and future Maximum Health increases are halved.
* Conflagrating Heart (Mythical): Absorb Fire damage and gain 3 Fire Aspect at the start of each round, but take double Water damage.
* Aqueous Heart (Mythical): Absorb Water damage and Gain 3 Water Aspect at the start of each round, but take double Bio damage.
* Phytonic Heart (Mythical): Absorb Bio damage and Gain 3 Bio Aspect at the start of each round, but take double Fire damage.

## Chests
* Could be a choice of three different chests at the end of each battle, unless the player's fighter is downed. Most chests contain three choices of equipment, artifacts, cinders, or food.
* Weaponry Chest: Contains three choices of weapons.
* Armorer's Chest: Includes at least one armor.
* Cobbler's Chest: Includes at least one pair of shoes.
* Hatter's Chest: Includes at least one hat.
* Curio Chest: Includes at least one artifact.
* Cinder Vase: Only contains cinders, but an unusually large amount.
* Huge Chest: Choose two of four different options of equipment, artifacts, cinders, or food.
* Picnic Basket: Three choices of food, with the possibility of rare dishes.
* Enchanted Chest: Three choices of equipment, with at least one being enchanted.
* Supply Cache: More commonplace rewards than other chests, but three of the five options can be chosen.
* Emergency Care Package: Three choices of food that revive a downed fighter.
* Magnificent Flotsam Pile: Choose between five options of permanent equipment, artifacts, cinders, or other special treasures. 

## Tips
* Many attacks strike the first target in a row. Try hiding behind allies or obstacles!
* Healing might be rarer or less powerful than you'd expect. Better to defend and avoid taking damage in the first place!
* Most equipment you find while adventuring is "etherial", and will vanish at the end of your run. However, you can always take cinders with you, as well as 

## Technical Considerations
* Battlefield state is passed to each client each round, with user/enemy comands creating outcomes that are applied to the battlefield state.
* Websockets should be used to pass this data in real time, with logic to register payloads that have been successfully recieved by each client, and to retry each with potentially multiple payloads at once until transer succeeds.
* Gzip or similar tool should be used to minimize data transfer load.
* When a round is complete, battle animations and UI elements should update according to the duration of each animation step. These steps should be unitless, so that the user can use a setting or press a button to speed them up.
* Commands will need to be split into actions before being translated into performed actions, in order to correctly sort higher priority parts of commands. Specifically, some abilities will involve adding defense in addition to other effects (such as dealing damage or moving). Defense increase needs to happen at the very beginning of a round, with the rest of the effects happening in normal fighter-speed order.
* Round start / Battle start: separate performCommands-esque calculation? Probably; data will need to be present for both the client and the server after the previous round's end, but also at the very beginning when no rounds have yet occurred. battleStateLast should be used, even in the first round, to show the state of fighters prior to Battle start effects.
* For pre-submission outcome display, retain battleStateFuture coming from outletContext. But, also create a battleStatePossible that accounts for the possible command following the command creation pattern in submitCommand.
* PixiJS Handling:
  * An "Artist" instance could act as the intermediary between the game logic and sprite handling. It could receive information such as the grid placement and equipment of fighters and transform that into collections of Pixi sprites, determining their animations and pixel positioning.
  * artistRef should be passed between components, and should calculate the visual consequences of click actions in addition to sprite formation and positioning.
  * Non-ideal whole number pixelScale values could be mitigated by setting a CSS zoom value on the body and scaling the pixi canvas size accordingly, e.g. zoom: 0.9, windowSize[0]: window.innerWidth * (1 / 0.9)
* BattleState handling: need to properly handle battleState, battleStateLast, battleStateFuture, and battleStatePossible. When a new battleState with battleStateLast arrives:
  * Round 1:
    1. Before intro text is read => INTRO_TEXT_READING
    2. When intro text is read but own fighter is not yet placed => FIGHTER_PLACEMENT
    3. If any other fighters still need placement => WAITING
    4 Then, onto normal round logic step #6
  * Rount 2+:
    1. When new battleState arrives, setBattleState(fromServer.battleStateLast)
    2. Using battleStateLast, create a set of PixiEvents and calculate their total duration
    3. Pass a flag to the Battle component to hide bars (and other UI? With black bars?) while PixiEvents are animated
    4. When events are finished, setBattleState(fromServer.battleState) and setBattleStateLast(fromServer.battleStateLast)
    5. Recalculate Bars positions and detail buttons, possibly
    6. Battle component generates command selected events for enemies
    7. ACTIONS_RESOLVED_READING, next button sends to
    8. INTENTIONS_READING, next button sends to
    8. EQUIPMENT_SELECT, and so on
  * Concluding round


## Mini ToDo
- [X] Make alterationsActive decline at end of round.
- [X] Fix user-visible outcomes using incorrectly declined alterationsActive.
- [X] Add thin Charge bar UI and fighter detail text.
- [X] Glyphs as rewards.
- [X] Record acquiring glyph in account.
- [X] EquipmentPiece instances to individually track equipment.
- [X] Equipment levels and applyLevel function.
- [X] Equipment-source alterations can have an extent.
- [X] getDescription equipment function.
- [X] Tooltip system.
- [X] Only account IDs in rooms.
- [X] Enchantment battle logic, for most.
- [X] Enchantment description logic.
- [X] Enchantment descriptions for most equipment.
- [X] Enchantment battle logic for priority and defense.
- [X] Enchanted equipment as rewards.
- [X] Improved treasure select display.
- [X] Refactor Battle directory structure and CSS file.
- [X] Fix RichText duplicate keys.
- [X] Disable player acting when downed.
- [X] PIXI sprite handling with some basic effects for treasure selection.
- [X] Mobile / responsive layout.
- [X] PixiEvent creation and handling.
- [X] UI PixiEvents for health and charge bar updating.
- [X] Account for obstacles in PixiEventUI handling.
- [X] Apply new battleState from server only after PixiEvents are finished (but immediately reset battleStateFuture).
- [X] Downed enemy LASs.
- [X] PixiEvents when commands are set.
- [X] moveIntoPixiEvents to handle movement commands.
- [X] Defending PixiEvents.
- [X] Occupant creation PixiEvents.
- [X] Remove battlefield Pixi collections before opening chests.
- [X] Very basic PixiEvent sets for all currently available actions.
- [X] Fix battleStateFuture and battleStatePossible.
  - [X] Generate and handle battleStateFuture within Battle component, not Communication.
  - [X] Also get rid of battleStatePossible, just overwrite battleStateFututre in CONFIRM.
  - [X] Remove UI PixiEvents.
  - [X] Hide bars while animations are playing.
- [X] Equipment sorting for display.
- [X] Handle movement of occupants detail modal buttons.
- [X] Equipment and cinder icons.
  - [X] Top layer Pixi canvas.
  - [X] Icons rendering on Pixi canvas.
  - [X] Icons extracted from Pixi and rendering in HTML.
  - [X] Icons in EquipSelect.
  - [X] Icons in Fighter detail modal.
  - [X] Icons in TreasureSelect.
  - [X] Icons in chest opening effect.
- [X] All Pixi z-indexes to use constants and segment effect z-indexes.
- [ ] Combine target selection and confirmation UIs.
  - [X] Eliminate TARGET_SELECTION state.
  - [X] Preferred targets spot animation.
  - [X] Target selected sprite animated, like crosshairs.
  - [X] Show outcomes and affected spots of static targets.
  - [X] Special outcome description if controlled fighter will miss.
  - [ ] Correctly apply possible command on top of battleStateFuture.
  - [ ] Sort automatically selected target so that the frontmost is first, downrank objects as targets, if healing target lowest health percentage.
- [X] Implement treasure chest types.
  - [X] Chest Pixi cleanup.
  - [X] Placeholder image for each chest type.
  - [X] Placeholder icons for all current treasure.
  - [X] Basic text below each chest.
  - [ ] Draw fighters above chests.
  - [ ] Update fighter health after food selection.
- [ ] Blue Mage class!
  - [X] Make some basic sprites
  - [X] More flexible actionIntoPixiEvents function
  - [X] Roll in action, defend, and move intoPixiEvents functions
  - [X] Fix issue with defaultStates remaining after PixiEvent
  - [X] Fix missing command ready events for final command accepted or when loading from server connection
  - [X] Healing numbers
  - [X] Magic swishFunction
  - [X] Basics of element system
  - [X] Speed and Lag functionality
  - [X] Elemental defense
  - [X] Annoinited functionality
  - [ ] Check equipment actions
- [ ] Artifacts!
- [ ] Make some equipment! (initially with placeholder sprites)
- [ ] Movement based on vector, not destination.
- [ ] Orange Mage class!
- [ ] Implement stunning when pushed or pulled into an occupant.
- [ ] Hand and glove sprites.
- [ ] Shadow sprites.
- [ ] Hold phone sideways please.
- [ ] Deploy! Do some playtesting!