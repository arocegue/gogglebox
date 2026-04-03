const countryCode = "US";
const tvmazeAPI = `https://api.tvmaze.com/schedule`;
const cardLimit = 24;
function formatTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    //Add one for tomorrow's day, and for month's zero index
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

$(function () {
    const $loginForm = $("#login-form");

    $loginForm.dialog({
            title: "Login Form",
            modal: true,
            autoOpen: false,
            resizable: false,
            draggable: false,
            close: function (){
                $loginForm[0].reset();
            },
            classes: {
                "ui-dialog": "dialog",
                "ui-dialog-titlebar": "dialog-titlebar",
                "ui-dialog-content": "dialog-content",
                "ui-dialog-buttonpane": "dialog-buttonpane",
                "ui-dialog-buttonset": "dialog-buttonset"
            },
            buttons: [
                {
                    text: "Login",
                    icon: "ui-icon-key",
                    click: function () {
                        $loginForm.submit();
                    }
                }
            ]
        });

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
                    <img src="${img}" alt="Poster art for ${name}" />
                  </a>
              </li>`;
            })
            .join('');

        $(".cards").html(html);
    }).fail(function () {
        $(".schedule-scroll").append(`
            <div style="display:grid; justify-content:center;">
                <p>We are unable to load Tomorrow's Schedule at this time.</p>
                <p>Please try again later.</p>
            </div>
        `);
     });

    $("#login-button").on("click", function (event) {
        event.preventDefault();
        $loginForm.dialog("open");
    });
    const recenterDialog = debounce(function() {
        $(".ui-dialog-content:visible").dialog("option", "position", { 
                my: "center", 
                at: "center", 
                of: window 
        });
    }, 150); 
    $(window).on("resize scroll", recenterDialog);

    $loginForm.on("submit", function(e) {
        e.preventDefault();

        const credentials = {
            username: $("#username").val(),
            password: $("#password").val()
        };

        //API Call

        //For now, do nothing
        $loginForm.dialog("close");
    });
});