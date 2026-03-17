const countryCode = "US";
const tvmazeAPI = `https://api.tvmaze.com/schedule`;
const cardLimit = 24;
function formatTomorrowDate () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    //Add one for tomorrow's day, and for month's zero index
    const day = String(tomorrow.getDate() + 1).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      
    return `${year}-${month}-${day}`;
}
  
  
$(function () {
  $.ajax({
    url: tvmazeAPI,
    data: {
      country: countryCode,
      date: formatTomorrowDate()
    },
    type: "GET",
    dataType: "json",
  }).done(function (result) {
      const html = result
          .filter(item => item?.show?.image?.medium)
          .slice(0, cardLimit)
          .map(item => {
              const url = item.show.url || "https://www.tvmaze.com/shows";
              const img = item.show.image.medium;
              const name = item.show.name || "TV maze show listing";
              return `<li class="card flex column">
                  <a href="${url}" target="_blank" rel="noopener noreferrer">
                    <img src="${img}" alt="${name}" />
                  </a>
              </li>`;
          })
          .join('');

      $(".cards").html(html);
    })
    .fail(function () {
        $(".schedule-scroll").append(`
            <div style="display:grid; justify-content:center;">
                <p>We are unable to load Tomorrow's Schedule at this time.</p>
                <p>Please try again later.</p>
            </div>
        `);
    });

});