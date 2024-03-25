import { getTrainerDeck } from "./trainer.mjs";
import { getLocalStorage, setLocalStorage, shuffleCards } from "./utils.mjs";

// Get trainer data
const t1 = getTrainerDeck("Jim");
const t2 = getTrainerDeck("Pam");

const ONE = 1;
const COIN = 2;
const BOOST = 5;

// Variables for trainer's Win/Loss Round record
let t1Record = [0, 0];
let t2Record = [0, 0];

console.log(t1);
console.log(t2);

// Cycle through trainer card data
// for (let i = t1.length - 1; i > 0; i--) {
for (let i = 0; i < t1.length - 1; i++) {
  console.log("*****Next Skirmish*****");
  console.log(`Round ${i}: ${t1[i].name} vs. ${t2[i].name}\n`);
  // set temp trainer card hp
  // let hp1 = t1[i].hp;
  // let dmg1 = t1[i].hp;
  // let hp2 = t2[i].hp;
  // let dmg2 = t2[i].hp;
  // let diff1 = 0;
  // let diff2 = 0;

  let trainer1 = {
    "hp1": t1[i].hp,
    "dmg1": t1[i].hp,
    "diff1": 0
  }

  let trainer2 = {
    "hp2": t2[i].hp,
    "dmg2": t2[i].hp,
    "diff2": 0
  }
  // continue the round as long as both players are not at 0 hp
  // while (hp1 > 0 && hp2 > 0) {
  for (let round = 1; round <= 3; round++) {
    trainer2.hp2 = planAttack(t1, t2, trainer2.hp2, i);
    trainer1.hp1 = planAttack(t2, t1, trainer1.hp1, i);
    trainer1.diff1 += (trainer1.dmg1 - trainer1.hp1);
    trainer2.diff2 += (trainer2.dmg2 - trainer2.hp2);
    // Update round record for trainer1
    if (trainer1.hp1 <= 0 && trainer2.hp2 > 0) { 
      t1Record[1] = updateRecord(t1Record[1]);
      t2Record[0] = updateRecord(t2Record[0]);
      break;
    }
    // Update round record for trainer2
    if (trainer2.hp2 <= 0 && trainer1.hp1 > 0) {
      t2Record[1] = updateRecord(t2Record[1]);
      t1Record[0] = updateRecord(t1Record[0]);
      break;
    }
  }
  if (trainer1.hp1 > trainer2.hp2 && trainer2.hp2 > 0 && trainer1.diff1 !== trainer2.diff2) { 
    t1Record[0] = updateRecord(t1Record[0]);
    t2Record[1] = updateRecord(t2Record[1]);
  }
  // Update round record for trainer2
  if (trainer2.hp2 > trainer1.hp1 && trainer1.hp1 > 0 && trainer1.diff1 !== trainer2.diff2) {
    t2Record[0] = updateRecord(t2Record[0]);
    t1Record[1] = updateRecord(t1Record[1]);
  }
  // Game is a draw if both players do no damage
  if (trainer1.diff1 === trainer2.diff2) {
    console.log("Draw!");
  }
}

console.log(`Jim's Record: Wins ${t1Record[0]}, Losses ${t1Record[1]}`);
console.log(`Pam's Record: Wins ${t2Record[0]}, Losses ${t2Record[1]}`);

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
    trainer[idx].wins = updateRecord(trainer[idx].wins);
    rival[idx].losses = updateRecord(rival[idx].losses);
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
  console.log(trainer.types);
  console.log("Double/half/no: ");
  console.log(trainer.doubleDamageTo);
  console.log(trainer.halfDamageTo);
  console.log(trainer.noDamageTo);
  console.log(rival.types);
  // if (actionAttack) {
    for (let ttype of trainer.doubleDamageTo) {
      for (let rtype of rival.types) {
        if (ttype == rtype) { 
          console.log("Double damage to: ");
          return typeModifier * 2 }
      }
    }

    for (let ttype of trainer.halfDamageTo) {
      for (let rtype of rival.types) {
        if (ttype == rtype) { 
          console.log("Half damage to: ");
          return typeModifier / 2 }
      }
    }

    for (let ttype of trainer.noDamageTo) {
      for (let rtype of rival.types) {
        if (ttype == rtype) { 
          console.log("No damage to: ");
          return 0 }
      }
    }
  // } else {
  //   for (let ttype of trainer.doubleDamageFrom) {
  //     for (let rtype of rival.types) {
  //       if (ttype == rtype) { 
  //         console.log("Double damage from: ");
  //         return typeModifier * 2 }
  //     }
  //   }

  //   for (let ttype of trainer.halfDamageFrom) {
  //     for (let rtype of rival.types) {
  //       if (ttype == rtype) { 
  //         console.log("Half damage from: ");
  //         return typeModifier / 2 }
  //     }
  //   }

  //   for (let ttype of trainer.noDamageFrom) {
  //     for (let rtype of rival.types) {
  //       if (ttype == rtype) { 
  //         console.log("No damage from: ");
  //         return 0 }
  //     }
  //   }
  // }
  return trainerAction;
}

export function updateRecord(name, amount = 1, add = true) {
  let record = name;
  (add) ? record += amount : record -= amount;
  return record;
}