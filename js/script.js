  function formatDate (date) {

    const year = date.getFullYear();
    //Add one for tomorrow's day, and for month's zero index
    const day = String(date.getDate() + 1).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
      
    return `${year}-${month}-${day}`;


  }
  
  
  $(function () {
    let countryCode = "US";
    let tomorrowDate = formatDate(new Date());
    let tvmazeAPI = `https://api.tvmaze.com/schedule`;
    let htmlString = '';
    $.ajax({
      url: tvmazeAPI,
      data: {
        country: countryCode,
        date: tomorrowDate
      },
      type: "GET",
      dataType: "json",
      success: function (result, status, xhr) {
        let limit = 24;
        $.each(result, function(index, item){
          //Check if we have image and anchor URL otherwise skip to the next show
          let anchorURL = item?.show?.url;
          let imageSrc = item?.show?.image?.medium;
          let imageAlt = item?.show?.name;
          if(imageSrc){
            htmlString+=`<li class="card flex column"><a href="${anchorURL ? anchorURL : "https://www.tvmaze.com/shows"}" target="_blank" rel="noopener noreferrer" ><img src="${imageSrc}" alt="${imageAlt ? imageAlt : "TV maze show listing"}" /></a></li>`;
          }else{
            limit++;
          }



          if(index == limit){
            $(".cards").html(htmlString);
            return false;
          }
        });
      },
      error: function(xhr, status, error){
        $(".schedule-scroll").append("<div style = \"display: grid;justify-content: center;\"><p>We are unable to load Tomorrow's Schedule for you at this time.</p><p> Please try again later.</p></div>")
      }

    });


    // $("#login-button").on("click", function () {
    //   console.log("Working")
    // $("#login-form").dialog({
		// 		title : "Sign In", 
		// 		modal: true, 
		// 	});
		// });
		// $("#cancel").on("click", function () {
		// 	$("#login-form").dialog("close");
		// });



  });