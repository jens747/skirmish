import { qs, ce, setClick, rmClick } from "./utils.mjs";
import { getHeroImg } from "./pokebank.mjs";

export function displayBanner(match, round, t1, t2, trainer1, trainer2, t1Score, t2Score) {
  // Get the selector for main
  const smain = qs("#skirmishMain");
  // Check for the matchSec selector
  let matchSec = qs("#matchSec");
  // If matchSec does not exist
  if (!matchSec) {
    // Create the matchSec section and append it to main
    matchSec = ce("section");
    matchSec.id = "matchSec";
    smain.appendChild(matchSec);
  } else {
    // Clear the contents of matchSec
    matchSec.innerHTML = "";
  }

  // Create the banner to display the current match and round
  const matchh2 = ce("h2");
  matchh2.id = "matchh2";
  matchh2.textContent = `Match ${match + 1} Round ${round}`;

  // Create the banner to display the current skiremon skirmishing
  const matchScore = ce("h3");
  matchScore.id = "matchScore";
  console.log(t2Score);
  // if (t1Score.wins === undefined) {
  //   matchScore.textContent = `${trainer1.name} 0 : ${trainer2.name} 0`;
  // } else {
    matchScore.textContent = `${trainer1.name} ${t1Score} : ${trainer2.name} ${t2Score}`;
  // }
  

  // Create the banner to display the current skiremon skirmishing
  const matchVs = ce("h3");
  matchVs.id = "matchVs";
  matchVs.textContent = `${t1.name} vs. ${t2.name}`;

  // Append the banner and skiremon names to the matchSec section
  matchSec.appendChild(matchh2);
  matchSec.appendChild(matchScore);
  matchSec.appendChild(matchVs);
}

export function displayT1Cards(t1, trainer) {
  console.log(t1);

  // Get the selector for main
  const smain = qs("#skirmishMain");
  // Check for the t1Sec selector
  let t1Sec = qs("#t1Sec");
  // Check for the vsSec selector
  let vsSec = qs("#vsSec");

  // If t1Sec does not exist
  if (!t1Sec) {
    // Create the t1Sec section and append it to main
    t1Sec = ce("section");
    t1Sec.className = "skireSec";
    t1Sec.id = "t1Sec";
    smain.appendChild(t1Sec);
  } else {
    // Clear the contents of matchSec
    t1Sec.innerHTML = "";
    t1Sec.style.background = "var(--light-color)";
  }

  // Create the div for the id, type, & lv
  const skireDivTop1 = ce("div");
  skireDivTop1.className = "skireDivTop";
  t1Sec.appendChild(skireDivTop1);

  // p tag for skiremon id
  const skireId1 = ce("p");
  skireId1.className = "skireId";
  skireId1.textContent = `id: ${t1.id}`;
  skireDivTop1.appendChild(skireId1);

  // p tags for the skiremon's types
  t1.types.map(type => {
    const stt1 = ce("p");
    stt1.className = `skireTopType ${type}`;
    stt1.textContent = `${type}`;
    skireDivTop1.appendChild(stt1);
  });

  // p tag for skiremon level
  const skireLevel1 = ce("p");
  skireLevel1.className = "skireLevel";
  skireLevel1.textContent = `Lv: ${t1.level}`;
  skireDivTop1.appendChild(skireLevel1);

  // Create picture tag
  const skirePic1 = ce("picture");
  skirePic1.className = "skirePic";
  t1Sec.appendChild(skirePic1);

  // Create img tag
  const skireImg1 = ce("img");
  skireImg1.setAttribute("src", getHeroImg(t1));
  skireImg1.setAttribute("alt", `Image of a ${t1.name}`);
  skireImg1.className = "skireImg";
  skirePic1.appendChild(skireImg1);

  // Add h3 tag for skiremon name
  const t1Name = ce("h3");
  t1Name.className = "skireName";
  // t1Name.id = "t1Name";
  t1Name.textContent = t1.name;
  t1Sec.appendChild(t1Name);

  // Create div for hp & dmg tags
  const skireLife1 = ce("div");
  skireLife1.className = "skireLife";
  t1Sec.appendChild(skireLife1);

  // Creat p & span tags for hp
  const skireHp1 = ce("p");
  skireHp1.className = "skireHp";
  skireHp1.textContent = `HP: `;
  skireLife1.appendChild(skireHp1);

  const skireHpSpan1 = ce("span");
  skireHpSpan1.className = "skireSpan spanHp";
  skireHpSpan1.textContent = `${trainer.hp1}`;
  skireHp1.appendChild(skireHpSpan1);

  // Create p & span tags for damage
  const skireDmg1 = ce("p");
  skireDmg1.className = "skireDmg";
  skireLife1.appendChild(skireDmg1);

  const skireDmgSpan1 = ce("span");
  skireDmgSpan1.className = "skireSpan spanDmg";
  // skireDmgSpan1.textContent = "";
  skireDmg1.appendChild(skireDmgSpan1);

  // Create p & span tags for speed
  const skireSpd1 = ce("p");
  skireSpd1.className = "skireSpd";
  skireSpd1.textContent = "Spd: ";
  skireLife1.appendChild(skireSpd1);

  const skireSpdSpan1 = ce("span");
  skireSpdSpan1.className = "skireSpan";
  skireSpdSpan1.textContent = `${t1.speed}`;
  skireSpd1.appendChild(skireSpdSpan1);

  // Create a list for the skiremon record
  const skireRecord1 = ce("ul");
  skireRecord1.className = "skireRecord";
  t1Sec.appendChild(skireRecord1);

  // Add list item for wins
  const skireWins1 = ce("li");
  skireWins1.className = "skireWins";
  skireWins1.textContent = `Wins: ${t1.wins}`;
  skireRecord1.appendChild(skireWins1);

  // Add list item for losses
  const skireLosses1 = ce("li");
  skireLosses1.className = "skireLosses";
  skireLosses1.textContent = `Losses: ${t1.losses}`;
  skireRecord1.appendChild(skireLosses1);

  // Add list item for draws
  const skireDraws1 = ce("li");
  skireDraws1.className = "skireDraws";
  skireDraws1.textContent = `Draws: ${t1.draws}`;
  skireRecord1.appendChild(skireDraws1);

  // Create div for action buttons
  const skireAction1 = ce("div");
  skireAction1.className = "skireAction";
  t1Sec.appendChild(skireAction1);

  // Create button for Attack action
  const skireAtkBtn1 = ce("button");
  skireAtkBtn1.className = "prime-btn skireAtkBtn";
  // skireAtkBtn1.id = "skireAtkBtn";
  skireAtkBtn1.setAttribute("type", "button");
  skireAtkBtn1.textContent = "Attack";
  skireAction1.appendChild(skireAtkBtn1);

  // Create button for Sp. Attack action
  const skireSpAtkBtn1 = ce("button");
  skireSpAtkBtn1.className = "prime-btn skireSpAtkBtn";
  // skireSpAtkBtn1.id = "skireSpAtkBtn";
  skireSpAtkBtn1.setAttribute("type", "button");
  skireSpAtkBtn1.textContent = "Special";
  skireAction1.appendChild(skireSpAtkBtn1);

  // Create div for the skiremon types
  const skireTypes1 = ce("div");
  skireTypes1.className = "skireTypes";
  t1Sec.appendChild(skireTypes1);

  // Create Strengths list
  const strongHeaders1 = ce("p");
  strongHeaders1.className = "skireHeaders";
  strongHeaders1.textContent = "Strong: ";
  skireTypes1.appendChild(strongHeaders1);

  // Create ul tag for Strengths list
  const skireStrength1 = ce("ul");
  skireStrength1.className = "skireStrength";
  skireTypes1.appendChild(skireStrength1);

  t1.doubleDamageTo.map(type => {
    const li1 = ce("li");
    skireStrength1.appendChild(li1);
    const stp1 = ce("p");
    stp1.className = `${type}`;
    stp1.textContent = `${type}`;
    li1.appendChild(stp1);
  });

  // Create Weaknesses list
  const weakHeaders1 = ce("p");
  weakHeaders1.className = "skireHeaders";
  weakHeaders1.textContent = "Weak: ";
  skireTypes1.appendChild(weakHeaders1);

  // Create ul tag for Weaknesses list
  const skireWeakness1 = ce("ul");
  skireWeakness1.className = "skireWeakness";
  skireTypes1.appendChild(skireWeakness1);

  t1.doubleDamageFrom.map(type => {
    const li1 = ce("li");
    skireWeakness1.appendChild(li1);
    const wtp1 = ce("p");
    wtp1.className = `${type}`;
    wtp1.textContent = `${type}`;
    li1.appendChild(wtp1);
  });

  // Create div to show attack and sp. attack level
  const skireAtkTypes1 = ce("div");
  skireAtkTypes1.className = "skireAtkTypes"
  t1Sec.appendChild(skireAtkTypes1);

  // Create Attack p tag
  const skireAtk1 = ce("p");
  skireAtk1.className = "skireAtk t1Atk";
  skireAtk1.textContent = "atk: ";
  skireAtkTypes1.appendChild(skireAtk1);

  // Create Attack span tag
  const skireAtkSpan1 = ce("span");
  skireAtkSpan1.className = "skireSpan";
  skireAtkSpan1.textContent = `${t1.attack}`;
  skireAtk1.appendChild(skireAtkSpan1);

  // Create Special Attack p tag
  const skireSpAtk1 = ce("p");
  skireSpAtk1.className = "skireSpAtk t1SpAtk";
  skireSpAtk1.textContent = "sp. atk: ";
  skireAtkTypes1.appendChild(skireSpAtk1);

  // Create Special Attack span tag
  const skireSpAtkSpan1 = ce("span");
  skireSpAtkSpan1.className = "skireSpan";
  skireSpAtkSpan1.textContent = `${t1.specialAttack}`;
  skireSpAtk1.appendChild(skireSpAtkSpan1);

  // Create div to show defense and sp. defense level
  const skireDefTypes1 = ce("div");
  skireDefTypes1.className = "skireDefTypes"
  t1Sec.appendChild(skireDefTypes1);

  // Create Attack p tag
  const skireDef1 = ce("p");
  skireDef1.className = "skireDef t1Def";
  skireDef1.textContent = "def: ";
  skireDefTypes1.appendChild(skireDef1);

  // Create Attack span tag
  const skireDefSpan1 = ce("span");
  skireDefSpan1.className = "skireSpan";
  skireDefSpan1.textContent = `${t1.defense}`;
  skireDef1.appendChild(skireDefSpan1);

  // Create Special Attack p tag
  const skireSpDef1 = ce("p");
  skireSpDef1.className = "skireSpDef t1SpDef";
  skireSpDef1.textContent = "sp. def: ";
  skireDefTypes1.appendChild(skireSpDef1);

  // Create Special Attack span tag
  const skireSpDefSpan1 = ce("span");
  skireSpDefSpan1.className = "skireSpan";
  skireSpDefSpan1.textContent = `${t1.specialDefense}`;
  skireSpDef1.appendChild(skireSpDefSpan1);

  // If vsSec does not exist
  if (!vsSec) {
    // Create the vsSec section and append it to main
    vsSec = ce("section");
    vsSec.id = "vsSec";
    smain.appendChild(vsSec);
  } else {
    // Clear the contents of matchSec
    vsSec.innerHTML = "";
  }

  const vsh2 = ce("h2");
  vsh2.id = "vsh2";
  vsh2.textContent = "vs.";
  vsSec.appendChild(vsh2);

  // export function waitForPlayer(trainer) {
  return new Promise(resolve => {
    function handleMove(event) {
      // Check if trainer1 uses regular or special attack
      const moveType = event.target.className.includes("Sp") ? false : true;
      event.target.style.background = "var(--mid-green)";
      console.log(event);
      console.log(`Player ${t1.name} chose ${moveType}`);

      // Clear to stop other events from triggering
      rmClick(skireAtkBtn1, handleMove);
      rmClick(skireSpAtkBtn1, handleMove);
      
      // Resolve promise with move type
      resolve(moveType);
    }
    // Add eventlisteners for trainer1 buttons
    gameClick(skireAtkBtn1, handleMove);
    gameClick(skireSpAtkBtn1, handleMove);
  });
}

// *****TRAINER 2 CARDS*****
export function displayT2Cards(t2, trainer) {
  console.log(t2);

  // Get the selector for main
  const smain = qs("#skirmishMain");
  // Check for the t2Sec selector
  let t2Sec = qs("#t2Sec");

  if (!t2Sec) {
    // Create the t2Sec section and append it to main
    t2Sec = ce("section");
    t2Sec.className = "skireSec";
    t2Sec.id = "t2Sec";
    smain.appendChild(t2Sec);
  } else {
    // Clear the contents of matchSec
    t2Sec.innerHTML = "";
    t2Sec.style.background = "var(--light-color)";
  }

  // Create the div for the id, type, & lv
  const skireDivTop2 = ce("div");
  skireDivTop2.className = "skireDivTop";
  t2Sec.appendChild(skireDivTop2);

  // p tag for skiremon id
  const skireId2 = ce("p");
  skireId2.className = "skireId";
  skireId2.textContent = `id: ${t2.id}`;
  skireDivTop2.appendChild(skireId2);

  // p tags for the skiremon's types
  t2.types.map(type => {
    const stt2 = ce("p");
    stt2.className = `skireTopType ${type}`;
    stt2.textContent = `${type}`;
    skireDivTop2.appendChild(stt2);
  });

  // p tag for skiremon level
  const skireLevel2 = ce("p");
  skireLevel2.className = "skireLevel";
  skireLevel2.textContent = `Lv: ${t2.level}`;
  skireDivTop2.appendChild(skireLevel2);

  // Create picture tag
  const skirePic2 = ce("picture");
  skirePic2.className = "skirePic";
  t2Sec.appendChild(skirePic2);

  // Create img tag
  const skireImg2 = ce("img");
  skireImg2.setAttribute("src", getHeroImg(t2));
  skireImg2.setAttribute("alt", `Image of a ${t2.name}`);
  skireImg2.className = "skireImg";
  skirePic2.appendChild(skireImg2);

  // Add h3 tag for skiremon name
  const t2Name = ce("h3");
  t2Name.className = "skireName";
  // t2Name.id = "t2Name";
  t2Name.textContent = t2.name;
  t2Sec.appendChild(t2Name);

  // Create div for hp & dmg tags
  const skireLife2 = ce("div");
  skireLife2.className = "skireLife";
  t2Sec.appendChild(skireLife2);

  // Creat p & span tags for hp
  const skireHp2 = ce("p");
  skireHp2.className = "skireHp";
  skireHp2.textContent = `HP: `;
  skireLife2.appendChild(skireHp2);

  const skireHpSpan2 = ce("span");
  skireHpSpan2.className = "skireSpan spanHp";
  skireHpSpan2.textContent = `${trainer.hp2}`;
  skireHp2.appendChild(skireHpSpan2);

  // Create p & span tags for damage
  const skireDmg2 = ce("p");
  skireDmg2.className = "skireDmg";
  skireLife2.appendChild(skireDmg2);

  const skireDmgSpan2 = ce("span");
  skireDmgSpan2.className = "skireSpan spanDmg";
  // skireDmgSpan2.textContent = "";
  skireDmg2.appendChild(skireDmgSpan2);

  // Create p & span tags for speed
  const skireSpd2 = ce("p");
  skireSpd2.className = "skireSpd";
  skireSpd2.textContent = "Spd: ";
  skireLife2.appendChild(skireSpd2);

  const skireSpdSpan2 = ce("span");
  skireSpdSpan2.className = "skireSpan";
  skireSpdSpan2.textContent = `${t2.speed}`;
  skireSpd2.appendChild(skireSpdSpan2);

  // Create a list for the skiremon record
  const skireRecord2 = ce("ul");
  skireRecord2.className = "skireRecord";
  t2Sec.appendChild(skireRecord2);

  // Add list item for wins
  const skireWins2 = ce("li");
  skireWins2.className = "skireWins";
  skireWins2.textContent = `Wins: ${t2.wins}`;
  skireRecord2.appendChild(skireWins2);

  // Add list item for losses
  const skireLosses2 = ce("li");
  skireLosses2.className = "skireLosses";
  skireLosses2.textContent = `Losses: ${t2.losses}`;
  skireRecord2.appendChild(skireLosses2);

  // Add list item for draws
  const skireDraws2 = ce("li");
  skireDraws2.className = "skireDraws";
  skireDraws2.textContent = `Draws: ${t2.draws}`;
  skireRecord2.appendChild(skireDraws2);

  // Create div for action buttons
  const skireAction2 = ce("div");
  skireAction2.className = "skireAction";
  t2Sec.appendChild(skireAction2);

  // Create button for Attack action
  const skireAtkBtn2 = ce("button");
  skireAtkBtn2.className = "prime-btn skireAtkBtn";
  // skireAtkBtn2.id = "skireAtkBtn";
  skireAtkBtn2.setAttribute("type", "button");
  skireAtkBtn2.textContent = "Attack";
  skireAction2.appendChild(skireAtkBtn2);

  // Create button for Sp. Attack action
  const skireSpAtkBtn2 = ce("button");
  skireSpAtkBtn2.className = "prime-btn skireSpAtkBtn";
  // skireSpAtkBtn2.id = "skireSpAtkBtn";
  skireSpAtkBtn2.setAttribute("type", "button");
  skireSpAtkBtn2.textContent = "Special";
  skireAction2.appendChild(skireSpAtkBtn2);

  // Create div for the skiremon types
  const skireTypes2 = ce("div");
  skireTypes2.className = "skireTypes";
  t2Sec.appendChild(skireTypes2);

  // Create Strengths list
  const strongHeaders2 = ce("p");
  strongHeaders2.className = "skireHeaders";
  strongHeaders2.textContent = "Strong: ";
  skireTypes2.appendChild(strongHeaders2);

  // Create ul tag for Strengths list
  const skireStrength2 = ce("ul");
  skireStrength2.className = "skireStrength";
  skireTypes2.appendChild(skireStrength2);

  t2.doubleDamageTo.map(type => {
    const li2 = ce("li");
    skireStrength2.appendChild(li2);
    const stp2 = ce("p");
    stp2.className = `${type}`;
    stp2.textContent = `${type}`;
    li2.appendChild(stp2);
  });

  // Create Weaknesses list
  const weakHeaders2 = ce("p");
  weakHeaders2.className = "skireHeaders";
  weakHeaders2.textContent = "Weak: ";
  skireTypes2.appendChild(weakHeaders2);

  // Create ul tag for Weaknesses list
  const skireWeakness2 = ce("ul");
  skireWeakness2.className = "skireWeakness";
  skireTypes2.appendChild(skireWeakness2);

  t2.doubleDamageFrom.map(type => {
    const li2 = ce("li");
    skireWeakness2.appendChild(li2);
    const wtp2 = ce("p");
    wtp2.className = `${type}`;
    wtp2.textContent = `${type}`;
    li2.appendChild(wtp2);
  });

  // Create div to show attack and sp. attack level
  const skireAtkTypes2 = ce("div");
  skireAtkTypes2.className = "skireAtkTypes"
  t2Sec.appendChild(skireAtkTypes2);

  // Create Attack p tag
  const skireAtk2 = ce("p");
  skireAtk2.className = "skireAtk t2Atk";
  skireAtk2.textContent = "atk: ";
  skireAtkTypes2.appendChild(skireAtk2);

  // Create Attack span tag
  const skireAtkSpan2 = ce("span");
  skireAtkSpan2.className = "skireSpan";
  skireAtkSpan2.textContent = `${t2.attack}`;
  skireAtk2.appendChild(skireAtkSpan2);

  // Create Special Attack p tag
  const skireSpAtk2 = ce("p");
  skireSpAtk2.className = "skireSpAtk t2SpAtk";
  skireSpAtk2.textContent = "sp. atk: ";
  skireAtkTypes2.appendChild(skireSpAtk2);

  // Create Special Attack span tag
  const skireSpAtkSpan2 = ce("span");
  skireSpAtkSpan2.className = "skireSpan";
  skireSpAtkSpan2.textContent = `${t2.specialAttack}`;
  skireSpAtk2.appendChild(skireSpAtkSpan2);

  // Create div to show defense and sp. defense level
  const skireDefTypes2 = ce("div");
  skireDefTypes2.className = "skireDefTypes"
  t2Sec.appendChild(skireDefTypes2);

  // Create Attack p tag
  const skireDef2 = ce("p");
  skireDef2.className = "skireDef t2Def";
  skireDef2.textContent = "def: ";
  skireDefTypes2.appendChild(skireDef2);

  // Create Attack span tag
  const skireDefSpan2 = ce("span");
  skireDefSpan2.className = "skireSpan";
  skireDefSpan2.textContent = `${t2.defense}`;
  skireDef2.appendChild(skireDefSpan2);

  // Create Special Attack p tag
  const skireSpDef2 = ce("p");
  skireSpDef2.className = "skireSpDef t2SpDef";
  skireSpDef2.textContent = "sp. def: ";
  skireDefTypes2.appendChild(skireSpDef2);

  // Create Special Attack span tag
  const skireSpDefSpan2 = ce("span");
  skireSpDefSpan2.className = "skireSpan";
  skireSpDefSpan2.textContent = `${t2.specialDefense}`;
  skireSpDef2.appendChild(skireSpDefSpan2);

// }

// export function waitForPlayer(trainer) {
  return new Promise(resolve => {
    function handleMove(event) {
      // Assuming the button's ID contains the move and player's number (p1Attack, p2Special, etc.)
      const moveType = event.target.className.includes("Sp") ? false : true;
      event.target.style.background = "var(--mid-green)";
      console.log(`Player ${t2.name} chose ${moveType}`);

      // Clear to stop other events from triggering
      rmClick(skireAtkBtn2, handleMove);
      rmClick(skireSpAtkBtn2, handleMove);
      
      // Resolve promise with move type
      resolve(moveType);
    }

    // Add eventlisteners for player two
    gameClick(skireAtkBtn2, handleMove);
    gameClick(skireSpAtkBtn2, handleMove);
  });
}

export function gameClick(selector, callback, e) {
  selector.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(e);
  });
  selector.addEventListener("click", callback);
}

export function endOfAnimation(elm, tag) {
  return new Promise(resolve => {
    const handleAnimationEnd = () => {
      elm.removeEventListener("animationend", handleAnimationEnd);
      // elm.classList.remove(elm.classList.contains("upAtk") ? "upAtk" : "downAtk");
      elm.classList.remove(tag);
      resolve();
    };

    elm.addEventListener("animationend", handleAnimationEnd);
  });
}

// Function to starts the vertical attack animation
export async function vtAtk(t1, t2) {
  const s1 = document.querySelector("#t1Sec");
  const s2 = document.querySelector("#t2Sec");

  console.log(s1);
  console.log(s2);

  console.log(t1);
  console.log(t2);

  // Apply classes to start the animation
  s1.classList.add("upAtk");
  s2.classList.add("downAtk");

  await Promise.all([endOfAnimation(s1, "upAtk"), endOfAnimation(s2, "downAtk")]);
}

// Function to starts the horizontal attack animation
export async function hzAtk() {
  const s1 = document.querySelector("#t1Sec");
  const s2 = document.querySelector("#t2Sec");

  // Apply classes to start the animation
  s1.classList.add("rightAtk");
  s2.classList.add("leftAtk");

  await Promise.all([endOfAnimation(s1, "rightAtk"), endOfAnimation(s2, "leftAtk")]);
}

// Function to animate damage taken
export async function dmgTaken(trainer, dmg) {
  const span = qs(".spanDmg", trainer);
  const hp = qs(".spanHp", trainer);
  const pic = qs(".skirePic", trainer);
  let life, faint;
  // If the card takes damage display the damage taken
  if (dmg) {
    // Update the current hp after taking damage
    life = hp.textContent - dmg;
    // Set hp to zero if it goes below zero
    if (life <= 0) { 
      hp.textContent = 0; 
      faint = ce("div");
      faint.textContent = "fainted";
      faint.classList.add("fainted");
      pic.appendChild(faint);
      // const faint = ce("div");
      // faint.textContent = "fainted";
      // faint.classList.add("fainted");
      // skirePic2.appendChild(faint);
    } else {
      hp.textContent -= dmg;
    }
    // Show how much damage is taken for the card
    span.textContent = `-${dmg}`;
    trainer.style.background = "radial-gradient(transparent, rgba(255, 0, 0, 0.3))";
  } else {
    // Show that no damage is taken
    span.textContent = `${dmg}`;
  }
  const spanBox = qs(".skireDmg", trainer);
  console.log(trainer);
  console.log(span);
  console.log(hp);

  spanBox.classList.add("showDmg");

  // await Promise.all([endOfAnimation(trainer, "showDmg")]);
  await endOfAnimation(trainer, "showDmg");
  if (life <= 0) {
    await endOfAnimation(trainer, "fainted");
  }
}

// Function to run pop animation on cards
export async function popCards() {
  const s1 = document.querySelector("#t1Sec");
  const s2 = document.querySelector("#t2Sec");

  // Apply classes to start the animation
  s1.classList.add("popSec");
  s2.classList.add("popSec");

  await Promise.all([endOfAnimation(s1, "popSec"), endOfAnimation(s2, "popSec")]);
}