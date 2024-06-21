import { displayBackground, displayBanner, displayT1Cards, displayT2Cards, dmgTaken, popCards, vtAtk, hzAtk } from "./gamelayout.mjs";
import { getTrainerDeck } from "./trainer.mjs";
import { getLocalStorage, setLocalStorage, playCallAudio, preloadCalls } from "./utils.mjs";
import { searchDB, updateTrainerObj } from "../db/indexdb";

export default async function skirmishLoop() {
  // Set a random background for the skirmish
  displayBackground();

  // Get names of trainers for this game
  const ct = getLocalStorage("currentTrainers");

  // Reset trainer stats from previous game
  const t1 = await resetTrainer(ct[0]);
  const t2 = await resetTrainer(ct[1]);

  // Set stats to local storage
  // setLocalStorage(ct[0], t1);
  // setLocalStorage(ct[1], t2);
  await updateTrainerObj(ct[0], t1);
  await updateTrainerObj(ct[1], t2);

  // Constants for Round and match count
  const GAMEROUNDS = 1;
  const GAMEMATCHES = 9;
  // Get trainer data
  const t1Deck = await getTrainerDeck(ct[0]);
  const t2Deck = await getTrainerDeck(ct[1]);

  // Variables for trainer's Win/Loss Round record
  let t1Record = [0, 0, 0, {"win": [], "lose": [], "draw": []}];
  let t2Record = [0, 0, 0, {"win": [], "lose": [], "draw": []}];

  window.trainerAtkdmg;

  let skireCalls = preloadCalls(t1Deck, t2Deck);

  // Cycle through trainer card data
  // for (let i = t1Deck.length - 1; i > 0; i--) {
  // for (let i = 0; i <= t1Deck.length - 1; i++) {
  for (let i = 0; i <= GAMEMATCHES; i++) {
    // Preload Skiremon cries
    console.log(t2);
    console.log(t2Deck);

    // set temp trainer cards for hp, damage, and damage taken
    let trainer1 = {
      "hp1": t1Deck[i].hp,
      "dmg1": t1Deck[i].hp,
      "diff1": 0
    }

    let trainer2 = {
      "hp2": t2Deck[i].hp,
      "dmg2": t2Deck[i].hp,
      "diff2": 0
    }
    // continue the skirmish for 3 rounds
    for (let round = 1; round <= GAMEROUNDS; round++) {
      // Display & update skirmish round banner
      displayBanner(i, round, t1Deck[i], t2Deck[i], t1, t2, t1Record[0], t2Record[0]);

      // Wait for both players to move
      const t1move = displayT1Cards(t1Deck[i], trainer1);
      const t2move = displayT2Cards(t2Deck[i], t1Deck[i], trainer2, t2);

      if (round === 1) popCards();

      const t1Card = document.querySelector("#t1Sec");
      const t2Card = document.querySelector("#t2Sec");
      
      // Promise.all waits for promises to resolve
      const moves = await Promise.all([t1move, t2move]);
      

      // Get the viewing width to determine which animation to run
      const viewWidth = window.innerWidth;

      (viewWidth < 720) ? await vtAtk(trainer1, trainer2) : await hzAtk(trainer1, trainer2);

      // If trainer2 speed is higher than trainer1
      if (t1Deck[i].speed < t2Deck[i].speed) {
        trainer1.hp1 = planAttack(t2Deck, t1Deck, trainer1.hp1, i, moves[1], t1Card);
        await dmgTaken(t1Card, window.trainerAtkdmg);
        if (trainer1.hp1 > 0) {
          trainer2.hp2 = planAttack(t1Deck, t2Deck, trainer2.hp2, i, moves[0], t2Card);
          await dmgTaken(t2Card, window.trainerAtkdmg);
        }
      // If trainer1 speed is higher than trainer2
      } else {
        trainer2.hp2 = planAttack(t1Deck, t2Deck, trainer2.hp2, i, moves[0], t2Card);
        await dmgTaken(t2Card, window.trainerAtkdmg);
        if (trainer2.hp2 > 0) {
          trainer1.hp1 = planAttack(t2Deck, t1Deck, trainer1.hp1, i, moves[1], t1Card);
          await dmgTaken(t1Card, window.trainerAtkdmg);
        }
      }
      
      // get the current damage and add it to total damage taken
      trainer1.diff1 += (trainer1.dmg1 - trainer1.hp1);
      trainer2.diff2 += (trainer2.dmg2 - trainer2.hp2);
      // set damage equal to hp for next round
      trainer1.dmg1 = trainer1.hp1;
      trainer2.dmg2 = trainer2.hp2;


      // Update round record for trainer1 if they lose
      if (trainer1.hp1 <= 0 && trainer2.hp2 > 0) { 
        // Play the audio for the Skiremon that faints
        playCallAudio(skireCalls, t1Deck[i].name);
        // add a loss to trainer1 and a win to trainer2
        t1Record[1] = updateRecord(t1Record[1]);
        t2Record[0] = updateRecord(t2Record[0]);
        // add t1's Skiremon to their "lose" list & t2's to thier "win" list
        t1Record[3].lose.push(t1Deck[i].name);
        t2Record[3].win.push(t2Deck[i].name);
        // update the trainer's current poke card t2 won, t1 lost
        updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "win");
        updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "lose");
        // Pop new cards into view
        popCards();
        break;
      }
      // Update round record for trainer2 if they lose
      if (trainer2.hp2 <= 0 && trainer1.hp1 > 0) {
        // Play the audio for the Skiremon that faints
        playCallAudio(skireCalls, t2Deck[i].name);
        // add a loss to trainer2 and a win to trainer1
        t2Record[1] = updateRecord(t2Record[1]);
        t1Record[0] = updateRecord(t1Record[0]);
        // add t1's Skiremon to their "win" list & t2's to thier "lose" list
        t2Record[3].lose.push(t2Deck[i].name);
        t1Record[3].win.push(t1Deck[i].name);
        // update the trainer's current poke card t1 won, t2 lost
        updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "win");
        updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "lose");
        // Pop new cards into view
        popCards();
        break;
      }
    }

    // After 3 turns if no one faints, check if trainer1 did more damage
    if (trainer1.hp1 > trainer2.hp2 && trainer2.hp2 > 0 && trainer1.diff1 !== trainer2.diff2) { 
      t1Record[0] = updateRecord(t1Record[0]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "win");
      t2Record[1] = updateRecord(t2Record[1]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "lose");
      // add t1's Skiremon to their "win" list & t2's to thier "lose" list
      t2Record[3].lose.push(t2Deck[i].name);
      t1Record[3].win.push(t1Deck[i].name);
    }
    // After 3 turns if no one faints, check if trainer2 did more damage
    if (trainer2.hp2 > trainer1.hp1 && trainer1.hp1 > 0 && trainer1.diff1 !== trainer2.diff2) {
      t2Record[0] = updateRecord(t2Record[0]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "win");
      t1Record[1] = updateRecord(t1Record[1]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "lose");
      // add t1's Skiremon to their "lose" list & t2's to thier "win" list
      t1Record[3].lose.push(t1Deck[i].name);
      t2Record[3].win.push(t2Deck[i].name);
    }
    // Game is a draw if both players do equal/no damage
    if (trainer1.diff1 === trainer2.diff2) {
      console.log("Draw!");
      t1Record[2] = updateRecord(t1Record[2]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord);
      t2Record[2] = updateRecord(t2Record[2]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord);
      // add t1's & t2's Skiremon to their "draw" list
      t2Record[3].draw.push(t2Deck[i].name);
      t1Record[3].draw.push(t1Deck[i].name);
    }
    // Pop new cards into view
    popCards();
  }

  // update win/loss/draw for trainer 1 & 2
  t1.wins = updateRecord(t1.wins, t1Record[0]);
  t2.wins = updateRecord(t2.wins, t2Record[0]);
  t1.losses = updateRecord(t1.losses, t1Record[1]);
  t2.losses = updateRecord(t2.losses, t2Record[1]);
  t1.draws = updateRecord(t1.draws, t1Record[2]);
  t2.draws = updateRecord(t2.draws, t2Record[2]);
  t1.currentGame = t1Record[3];
  t2.currentGame = t2Record[3];

  // setLocalStorage(ct[0], t1);
  // setLocalStorage(ct[1], t2);

  await updateTrainerObj(ct[0], t1);
  await updateTrainerObj(ct[1], t2, false, true);

  // console.log(`${ct[0]}'s Record: Wins ${t1Record[0]}, Losses ${t1Record[1]}, Draws ${t1Record[2]}`);
  // console.log(`${ct[1]}'s Record: Wins ${t2Record[0]}, Losses ${t2Record[1]}, Draws ${t2Record[2]}`);
}

export function planAttack(trainer, rival, hp, idx, trainermove, card) {
  // console.log(`*****NEXT TURN*****`);
  let rivalHp = hp;

  // variables to set trainer attack and defense stats
  let trainerAtk, rivalDef;
    
  // const trainermove = prompt("Press 'a' for attack, or 's' for sp. attack: ");

  // Attack if true
  if (trainermove) {
    trainerAtk = trainer[idx].attack;
    // console.log("Trainer Atack");
    // console.log(trainerAtk);
    trainerAtk = addTypeEffectsModifier(trainer[idx], rival[idx], trainerAtk);
    console.log(trainerAtk);
    // trainerAtk = trainer[idx].attack;
    rivalDef = rival[idx].defense;
    // console.log("Rival Defense");
    // console.log(rivalDef);
    // rivalDef = addTypeEffectsModifier(rival[idx], trainer[idx], rivalDef, false);
    // console.log(rivalDef);
  }

  // Special attack if false
  if (!trainermove) {
    trainerAtk = trainer[idx].specialAttack;
    trainerAtk = addTypeEffectsModifier(trainer[idx], rival[idx], trainerAtk);
    rivalDef = rival[idx].specialDefense;
  }

  // ***add animation***
  
  console.log(`${rival[idx].name} HP: ${rivalHp} Defense: ${rivalDef}`);
  console.log(`${trainer[idx].name} Attack: ${trainerAtk}`);
  // Create variable for damage level of the current attack
  // let trainerAtkdmg;

  // If the attack is greater than defense 
  // Subtract the defense from the attack 
  if(trainerAtk > rivalDef) {
    window.trainerAtkdmg = trainerAtk - rivalDef;
    // dmgTaken(card, trainerAtkdmg);
    console.log(`${rival[idx].name} damage: ${window.trainerAtkdmg}`);
  } else {
    // If attack is less than defense, player takes no damage
    window.trainerAtkdmg = 0;
    // dmgTaken(card, trainerAtkdmg);
    console.log("no damage");
  }
  
  // Subtract any remaining attack from the rival hp
  rivalHp -= window.trainerAtkdmg;
  console.log(`${rival[idx].name} HP: ${rivalHp}`);

  // If the rival's hp is less than or equal to zero
  if (rivalHp <= 0) {
    // Set rival's hp to zero
    rivalHp = 0;
    // trainer[idx].wins = updateRecord(trainer[idx].wins);
    // rival[idx].losses = updateRecord(rival[idx].losses);
    console.log(`${rival[idx].name} loses HP: ${rivalHp}.`);
    console.log(`Winner: ${trainer[idx].name}`);
    console.log(`Wins: ${trainer[idx].wins}, Losses: ${trainer[idx].losses}, Lv. ${trainer[idx].level}, Next: ${trainer[idx].nextLevel}`);
    console.log(`Loser: ${rival[idx].name}`);
    console.log(`Wins: ${rival[idx].wins}, Losses: ${rival[idx].losses}, Lv. ${rival[idx].level}, Next: ${rival[idx].nextLevel}`);
  } else {
    console.log(`${rival[idx].name} HP: ${rivalHp}. Keep fighting!!!`);
  }
  return rivalHp;
}

export function addTypeEffectsModifier(trainer, rival, trainerAction) {
  let typeModifier = trainerAction;
  console.log(`${trainer.name} types: ${trainer.types}`);
  console.log(`${rival.name} types: ${rival.types}`);

  // if (actionAttack) {
  for (let ttype of trainer.doubleDamageTo) {
    for (let rtype of rival.types) {
      if (ttype == rtype) { 
        console.log(`${trainer.name} damage doubled against ${rtype}`);
        console.log(trainer.doubleDamageTo);
        return typeModifier * 2 
      }
    }
  }

  for (let ttype of trainer.halfDamageTo) {
    for (let rtype of rival.types) {
      if (ttype == rtype) { 
        console.log(`${trainer.name} damage reduced by half against ${rtype}`);
        console.log(trainer.halfDamageTo);
        return typeModifier / 2 
      }
    }
  }

  for (let ttype of trainer.noDamageTo) {
    for (let rtype of rival.types) {
      if (ttype == rtype) { 
        console.log(`${trainer.name} does no damage to ${rtype}`);
        console.log(trainer.noDamageTo);
        return 0 
      }
    }
  }
  return trainerAction;
}

export function updateRecord(name, amount = 1, add = true) {
  let record = name;
  (add) ? record += amount : record -= amount;
  return record;
}

export function updateTrainerCard(trainer, trainerCard, rivalCard, callback, outcome = "draw") {
  const COIN = 2;
  const BONUS = 5;
  // check both card levels
  // update coins, update card wins, losses, draws, level, stats
  try {
    // Depending on the outcome add 1 to card win/lose/draw stats
    if (outcome === "win") {
      trainerCard.wins = updateRecord(trainerCard.wins);
      trainer.roundsWon = updateRecord(trainer.roundsWon);
      // If trainer won...
      if (trainerCard.level >= rivalCard.level) {
        // If level is greater than rival, give 2 coins, decrease nextLevel by 1
        trainer.coins = updateRecord(trainer.coins, COIN);
        // Update current game coin count
        trainer.coinsEarned = updateRecord(trainer.coinsEarned, COIN);

        trainerCard.nextLevel = updateRecord(trainerCard.nextLevel, 1, false);
      // If level is less than rival, give 5 coins, decrease nextLevel by 2
      } else {
        trainer.coins = updateRecord(trainer.coins, BONUS);
        // Update current game coin count
        trainer.coinsEarned = updateRecord(trainer.coinsEarned, BONUS);
        
        trainerCard.nextLevel = updateRecord(trainerCard.nextLevel, COIN, false);
      }
      // If nextLevel reaches 0, trainerCard levels up, resets nextLevel
      if (trainerCard.nextLevel <= 0) {
        trainerCard.level = updateRecord(trainerCard.level);
        trainerCard.nextLevel = trainerCard.level;
        levelUpCard(trainerCard);
      }
    // If player loses update trainerCard losses
    } else if (outcome === "lose") {
      trainerCard.losses = updateRecord(trainerCard.losses);
      trainer.roundsLost = updateRecord(trainer.roundsLost);
    // If round is a draw, update trainerCard draws
    } else {
      trainerCard.draws = updateRecord(trainerCard.draws);
      trainer.roundDraws = updateRecord(trainer.roundDraws);
    }
    // Update the poke card in the trainer's hand
    trainer.skirmishCards[[trainerCard.name]] = { 
      [[trainerCard.name]] : trainerCard
    };
  } catch (error) {
    console.error(`Can not update card: ${error}`);
  }
  // console.log(trainer.skirmishCards[[trainerCard.name]]);
  // console.log(trainerCard);
}

export function levelUpCard(card) {
  const STATS = Array.from({ length: 6 }, () => Math.floor(Math.random() * 3));
  // console.log(STATS);

  // console.log(`
  //   Name: ${card.name},
  //   HP: ${card.hp} + ${STATS[0]},
  //   Attack: ${card.attack} + ${STATS[1]},
  //   Defense: ${card.defense} + ${STATS[2]}, 
  //   Sp. Attack: ${card.specialAttack} + ${STATS[3]},
  //   Sp. Defense: ${card.specialDefense} + ${STATS[4]},
  //   Speed: ${card.speed} + ${STATS[5]}
  // `);

  card.levelUp = {
    hp: STATS[0],
    attack: STATS[1],
    defense: STATS[2],
    specialAttack: STATS[3],
    specialDefense: STATS[4],
    speed: STATS[5]
  }

  card.hp += STATS[0];
  card.attack += STATS[1];
  card.defense += STATS[2];
  card.specialAttack += STATS[3];
  card.specialDefense += STATS[4];
  card.speed += STATS[5];

  // console.log(`
  //   Name: ${card.name},
  //   HP: ${card.hp},
  //   Attack: ${card.attack},
  //   Defense: ${card.defense}, 
  //   Sp. Attack: ${card.specialAttack},
  //   Sp. Defense: ${card.specialDefense},
  //   Speed: ${card.speed}
  // `);
  // console.log(card);
  return card;
}

export async function resetTrainer(record) {
  // let trainer = getLocalStorage(record);
  const trainer = await searchDB(record);
  console.log(trainer);

  trainer.roundDraws = 0;
  trainer.roundsLost = 0;
  trainer.roundsWon = 0;
  trainer.coinsEarned = 0;

  Object.values(trainer.skirmishCards).map(card => {
    const keys = Object.keys(card)[0];
    // card[keys].levelUp = {};
    // console.log(card[keys].levelUp);
    trainer.skirmishCards[keys][keys].levelUp = {};
    // console.log(trainer.skirmishCards[keys][keys]);
  });

  return trainer;
}