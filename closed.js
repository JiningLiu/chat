window.onload = function() {
  const date = new Date();
  $('#loadPanel').fadeOut(250);
  // if ((date.getHours() >= 18 || date.getHours() < 8 || date.getDay() >= 6) && document.cookie.includes('- Dev') == false && document.cookie.includes('- Dev') == false) {
  //   document.querySelector('html').innerHTML = '<!DOCTYPE html> <html lang="en">   <head>     <meta charset="UTF-8">     <meta name="viewport" content="width=device-width, initial-scale=1.0">     <title>CLOSED Chat for School</title>     <link rel="stylesheet" href="closed.css">   </head>   <body>     <h1>Chat for School is currently closed!</h1>    <h3>Schedule: </h3>     <ul>    <li>Workdays: 8:00 AM - 6:00 PM CST</li>    <li>Weekend/Holidays: Closed</li>    </ul>   </body> </html>';
  // }
}