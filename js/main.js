(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });

    // Fetch Jadwal Sholat
    if ($('#jadwal-sholat-container').length > 0) {
        $.ajax({
            url: 'https://api.aladhan.com/v1/timingsByCity?city=Purwakarta&country=Indonesia&method=20',
            method: 'GET',
            success: function(response) {
                if (response.code === 200) {
                    var timings = response.data.timings;
                    var hijri = response.data.date.hijri;
                    var gregorian = response.data.date.gregorian;
                    
                    var dateStr = hijri.day + ' ' + hijri.month.en + ' ' + hijri.year + ' H / ' + gregorian.day + ' ' + gregorian.month.en + ' ' + gregorian.year;
                    $('#tanggal-hijriah').text(dateStr);
                    
                    var sholatList = [
                        { name: 'Imsak', time: timings.Imsak },
                        { name: 'Subuh', time: timings.Fajr },
                        { name: 'Dzuhur', time: timings.Dhuhr },
                        { name: 'Ashar', time: timings.Asr },
                        { name: 'Maghrib', time: timings.Maghrib },
                        { name: 'Isya', time: timings.Isha }
                    ];
                    
                    var html = '';
                    sholatList.forEach(function(sholat) {
                        html += `
                        <div class="col-6 col-sm-4 col-md-4 mb-2">
                            <div class="rounded p-3 text-center shadow-sm" style="background: rgba(255,255,255,0.45); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4);">
                                <h6 class="mb-2 text-dark" style="font-size: 0.95rem;">${sholat.name}</h6>
                                <h4 class="mb-0 text-primary" style="font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.15);">${sholat.time}</h4>
                            </div>
                        </div>
                        `;
                    });
                    
                    $('#jadwal-sholat-container').html(html);
                }
            },
            error: function() {
                $('#tanggal-hijriah').text('Gagal memuat jadwal sholat');
            }
        });
    }

})(jQuery);

