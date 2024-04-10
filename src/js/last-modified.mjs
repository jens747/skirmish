// // Array to format weekday names
// const weekdays = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// // Array to format months of the year
// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// // Get new date
// const currentDateAndTime = new Date();

// // Function to format current time
// const getCurrentTime = (currentDateAndTime) => {
//   // Get current hours
//   let currentHour = currentDateAndTime.getHours();

//   // Add leading zero to minutes if necessary
//   // Source: https://bobbyhadz.com/blog/javascript-get-minutes-with-leading-zero
//   // const currentMinute = String(currentDateAndTime.getMinutes()).padStart(2, "0");
//   let currentMinute = currentDateAndTime.getMinutes();
//   currentMinute = currentMinute <= 9 ? "0" + currentMinute : currentMinute;

//   // Check for AM or PM
//   const currentAMPM = currentHour >= 11 ? "PM" : "AM";

//   // Convert hours to 12 hour format
//   if (currentHour > 12) {
//     currentHour -= 12;
//   }

//   if (currentHour === 0) {
//     currentHour = 12;
//   }

//   // Return formatted string of time
//   return `${currentHour}:${currentMinute} ${currentAMPM}`;
// };

// // Variables for day, month, date, year, and time
// let currentDay = weekdays[currentDateAndTime.getDay()];
// let currentMonth = months[currentDateAndTime.getMonth()];
// let currentDayOf = currentDateAndTime.getDate();
// let currentYear = currentDateAndTime.getFullYear();
// let currentTime = getCurrentTime(currentDateAndTime);
// let currentModDateTime = ` ${currentDay}, ${currentMonth} ${currentDayOf}, ${currentYear} ${currentTime}`;
// let currentDateTime = `${currentDay}, ${currentMonth} ${currentDayOf}, ${currentYear}`;

// // Variable used to insert date into webpage
// const copyrightYear = document.querySelector("#copyrightYear");
// copyrightYear.textContent = currentYear;

// // Variable to update the lastModified div
// const lastModified = document.querySelector("#lastModified");

// // Update the lastModified div with the current date
// lastModified.textContent += currentDateTime;

// // Variable to update the lastModified div
// const lastModDateTime = document.querySelector("#lastModDateTime");

// // Update the lastModified div with the current date
// lastModDateTime.textContent += currentModDateTime;

// // Create a variable for the meeting banner
// const meetingBanner = document.querySelector(".meeting-banner");

// // Add an event listener to run when the website has loaded
// window.addEventListener("load", () => {
//   // displays the banner on Monday's and Tuesday's
//   if (currentDateAndTime.getDay() < 3 && 
//     currentDateAndTime.getDay() > 0) {
//     meetingBanner.style.display = "block";
//   }
// }, false);

// function updateTime() {
//   const submitDateTime = new Date();
//   currentDay = weekdays[submitDateTime.getDay()];
//   currentMonth = months[submitDateTime.getMonth()];
//   currentDayOf = submitDateTime.getDate();
//   currentYear = submitDateTime.getFullYear();
//   currentTime = getCurrentTime(submitDateTime);
//   currentModDateTime = ` ${currentDay}, ${currentMonth} ${currentDayOf}, ${currentYear} ${currentTime}`;
//   currentDateTime = `${currentDay}, ${currentMonth} ${currentDayOf}, ${currentYear}`;
// }
