/*
  WOODRA booking configuration
  ----------------------------
  LIVE booking configuration
  --------------------------
  This site is connected to the deployed WOODRA Google Apps Script Web App.
  The endpoint below powers live availability, Google Calendar blocking,
  booking confirmation and reservation emails.
*/
window.WOODRA_CONFIG = {
  bookingEndpoint: "https://script.google.com/macros/s/AKfycbxM4CvG0r4XhYn_ZcldjQIUvwFAdePpYl5nFZQ8Vbr8lBC-eZ-LBsRKJRR74ivDsUu0/exec",
  minNights: 1,
  singleHouseMaxGuests: 8,
  availabilityMonthsAhead: 18
};
