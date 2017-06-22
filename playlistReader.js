const xlsx = require('xlsx');

document.onload = () => {
  $('input.playlist-input').on('change', (event) => {
    console.log('changed');
  });
};
