import { getTrainerDeck } from "./trainer.mjs";
import { getLocalStorage, setLocalStorage, shuffleCards } from "./utils.mjs";

export default function skirmishLoop() {
  const t1 = getLocalStorage("Jim");
  const t2 = getLocalStorage("Pam");
  // Get trainer data
  const t1Deck = getTrainerDeck("Jim");
  const t2Deck = getTrainerDeck("Pam");

  // Variables for trainer's Win/Loss Round record
  let t1Record = [0, 0, 0];
  let t2Record = [0, 0, 0];

  // Cycle through trainer card data
  // for (let i = t1Deck.length - 1; i > 0; i--) {
  for (let i = 0; i < t1Deck.length - 1; i++) {
    console.log("*****Next Skirmish*****");
    console.log(`Round ${i}: ${t1Deck[i].name} vs. ${t2Deck[i].name}\n`);

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
    // while (hp1 > 0 && hp2 > 0) {
    for (let round = 1; round <= 3; round++) {
      if (t1Deck[i].speed < t2Deck[i].speed) {
        trainer1.hp1 = planAttack(t2Deck, t1Deck, trainer1.hp1, i);
        if (trainer1.hp1 > 0) {
          trainer2.hp2 = planAttack(t1Deck, t2Deck, trainer2.hp2, i);
        }
      } else {
        trainer2.hp2 = planAttack(t1Deck, t2Deck, trainer2.hp2, i);
        if (trainer2.hp2 > 0) {
          trainer1.hp1 = planAttack(t2Deck, t1Deck, trainer1.hp1, i);
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
        // add a loss to trainer1 and a win to trainer2
        t1Record[1] = updateRecord(t1Record[1]);
        t2Record[0] = updateRecord(t2Record[0]);
        // update the trainer's current poke card t2 won, t1 lost
        updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "win");
        updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "lose");
        break;
      }
      // Update round record for trainer2 if they lose
      if (trainer2.hp2 <= 0 && trainer1.hp1 > 0) {
        // add a loss to trainer2 and a win to trainer1
        t2Record[1] = updateRecord(t2Record[1]);
        t1Record[0] = updateRecord(t1Record[0]);
        // update the trainer's current poke card t1 won, t2 lost
        updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "win");
        updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "lose");
        break;
      }
    }

    // After 3 turns if no one faints, check if trainer1 did more damage
    if (trainer1.hp1 > trainer2.hp2 && trainer2.hp2 > 0 && trainer1.diff1 !== trainer2.diff2) { 
      t1Record[0] = updateRecord(t1Record[0]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "win");
      t2Record[1] = updateRecord(t2Record[1]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "lose");
    }
    // After 3 turns if no one faints, check if trainer2 did more damage
    if (trainer2.hp2 > trainer1.hp1 && trainer1.hp1 > 0 && trainer1.diff1 !== trainer2.diff2) {
      t2Record[0] = updateRecord(t2Record[0]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord, "win");
      t1Record[1] = updateRecord(t1Record[1]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord, "lose");
    }
    // Game is a draw if both players do equal/no damage
    if (trainer1.diff1 === trainer2.diff2) {
      console.log("Draw!");
      t1Record[2] = updateRecord(t1Record[2]);
      updateTrainerCard(t1, t1Deck[i], t2Deck[i], updateRecord);
      t2Record[2] = updateRecord(t2Record[2]);
      updateTrainerCard(t2, t2Deck[i], t1Deck[i], updateRecord);
    }
  }

  // update win/loss/draw for trainer 1 & 2
  t1.wins = updateRecord(t1.wins, t1Record[0]);
  t2.wins = updateRecord(t2.wins, t2Record[0]);
  t1.losses = updateRecord(t1.losses, t1Record[1]);
  t2.losses = updateRecord(t2.losses, t2Record[1]);
  t1.draws = updateRecord(t1.draws, t1Record[2]);
  t2.draws = updateRecord(t2.draws, t2Record[2]);

  setLocalStorage("Jim", t1);
  setLocalStorage("Pam", t2);
  console.log(`Jim's Record: Wins ${t1Record[0]}, Losses ${t1Record[1]}, Draws ${t1Record[2]}`);
  console.log(`Pam's Record: Wins ${t2Record[0]}, Losses ${t2Record[1]}, Draws ${t2Record[2]}`);

  try {
    endgame(t1Record, t2Record);
  } catch (error) {
    console.error("Error loading page: ", error);
  }
}

export function planAttack(trainer, rival, hp, idx) {
  console.log(`*****NEXT TURN*****`);
  let rivalHp = hp;

  // variables to set trainer attack and defense stats
  let trainerAtk, rivalDef;
    
  const trainermove = prompt("Press 'a' for attack, or 's' for sp. attack: ");

  if (trainermove === "a") {
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

  if (trainermove === "s") {
    trainerAtk = trainer[idx].specialAttack;
    trainerAtk = addTypeEffectsModifier(trainer[idx], rival[idx], trainerAtk);
    rivalDef = rival[idx].specialDefense;
  }

  // ***add animation***
  
  console.log(`${rival[idx].name} HP: ${rivalHp} Defense: ${rivalDef}`);
  console.log(`${trainer[idx].name} Attack: ${trainerAtk}`);
  // Create variable for damage level of the current attack
  let trainerAtkdmg;

  // If the attack is greater than defense 
  // Subtract the defense from the attack 
  if(trainerAtk > rivalDef) {
    trainerAtkdmg = trainerAtk - rivalDef;
    console.log(`${rival[idx].name} damage: ${trainerAtkdmg}`);
  } else {
    // If attack is less than defense, player takes no damage
    trainerAtkdmg = 0;
    console.log("no damage");
  }
  
  // Subtract any remaining attack from the rival hp
  rivalHp -= trainerAtkdmg;
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

function updateTrainerCard(trainer, trainerCard, rivalCard, callback, outcome = "draw") {
  const COIN = 2;
  const BONUS = 5;
  // check both card levels
  // update coins, update card wins, losses, draws, level, stats
  try {
    // Depending on the outcome add 1 to card win/lose/draw stats
    if (outcome === "win") {
      trainerCard.wins = updateRecord(trainerCard.wins);
      // If trainer won...
      if (trainerCard.level >= rivalCard.level) {
        // If level is greater than rival, give 2 coins, decrease nextLevel by 1
        trainer.coins = updateRecord(trainer.coins, COIN);
        trainerCard.nextLevel = updateRecord(trainerCard.nextLevel, 1, false);
      // If level is less than rival, give 5 coins, decrease nextLevel by 2
      } else {
        trainer.coins = updateRecord(trainer.coins, BONUS);
        trainerCard.nextLevel = updateRecord(trainerCard.nextLevel, COIN, false);
      }
      // If nextLevel reaches 0, trainerCard levels up, resets nextLevel
      if (trainerCard.nextLevel <= 0) {
        trainerCard.level = updateRecord(trainerCard.level);
        trainerCard.nextLevel = trainerCard.level;
      }
    // If player loses update trainerCard losses
    } else if (outcome === "lose") {
      trainerCard.losses = updateRecord(trainerCard.losses);
    // If round is a draw, update trainerCard draws
    } else if (outcome) {
      trainerCard.draws = updateRecord(trainerCard.draws);
    }
    // Update the poke card in the trainer's hand
    trainer.skirmishCards[[trainerCard.name]] = { 
      [[trainerCard.name]] : trainerCard
    };
  } catch (error) {
    console.error(`Can not update card: ${error}`);
  }
  console.log(trainer.skirmishCards[[trainerCard.name]]);
  console.log(trainerCard);
}