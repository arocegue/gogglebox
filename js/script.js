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
    //URL: https://api.tvmaze.com/schedule?
    //Test error with any string 
    let tvmazeAPI = `https://api.tvmaze.com/schedule?`;
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
        console.log("Result: ", result);
        // $(".schedule-scroll").show()
        $.each(result, function(index, item){
          console.log("Index: "+ index + 
          " Item: " + item);

          //Check if we have image and anchor URL otherwise skip to the next show
          let anchorURL = item?.show?.url;
          let imageSrc = item?.show?.image?.medium;
          if(imageSrc){
            $(`<li class="card"><a href="${anchorURL}" target="_blank" rel="noopener noreferrer" ><img src="${imageSrc}" alt="TV maze show listing" /></a></li>`)
            .appendTo(".cards");
          }else{
            limit++;
          }



          if(index == limit){
            return false;
          }
        });

        console.log("Status: ", status);
        console.log("xhr: ", xhr);
      },
      error: function(xhr, status, error){
        $(".schedule-scroll").append("<p>We are unable to load Tomorrow's Schedule for you at this time.</p><p> Please try again later.</p>")
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