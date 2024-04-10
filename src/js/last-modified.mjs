// Array to format months of the year
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Get new date
const currentDateAndTime = new Date();

// Variables for day, month, date, year, and time
let currentMonth = months[currentDateAndTime.getMonth()];
let currentDayOf = currentDateAndTime.getDate();
let currentYear = currentDateAndTime.getFullYear();
let currentDateTime = `${currentMonth} ${currentDayOf}, ${currentYear}`;

// Variable used to insert date into webpage
// const copyrightYear = document.querySelector("#copyrightYear");
// copyrightYear.textContent = currentYear;

// Variable to update the lastModified div
const lastModified = document.querySelector("#lastModified");

// Update the lastModified div with the current date
lastModified.textContent += currentDateTime;

function updateTime() {
  const submitDateTime = new Date();
  currentMonth = months[submitDateTime.getMonth()];
  currentDayOf = submitDateTime.getDate();
  currentYear = submitDateTime.getFullYear();
  currentDateTime = `${currentMonth} ${currentDayOf}, ${currentYear}`;
}

updateTime();