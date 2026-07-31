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
            url: 'https://api.aladhan.com/v1/timings?latitude=-7.653772&longitude=109.046875&method=20',
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
                        <div class="col-6 col-sm-4 col-md-4 mb-3">
                            <div class="prayer-card">
                                <h6>${sholat.name}</h6>
                                <h4>${sholat.time}</h4>
                            </div>
                        </div>
                        `;
                    });
                    
                    $('#jadwal-sholat-container').html(html);
                    $('#countdown-container').fadeIn();
                    
                    function updateCountdown() {
                        var now = new Date();
                        var nextPrayer = null;
                        var nextPrayerTime = null;

                        for (var i = 0; i < sholatList.length; i++) {
                            if (sholatList[i].name === 'Imsak') continue; // Optional: skip imsak for main countdown
                            
                            var timeParts = sholatList[i].time.split(':');
                            var pTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeParts[0], timeParts[1], 0);
                            
                            if (pTime > now) {
                                nextPrayer = sholatList[i].name;
                                nextPrayerTime = pTime;
                                break;
                            }
                        }

                        if (!nextPrayer) {
                            nextPrayer = 'Subuh';
                            var subuhParts = timings.Fajr.split(':');
                            nextPrayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, subuhParts[0], subuhParts[1], 0);
                        }

                        $('#next-prayer-name').text('Menjelang ' + nextPrayer);

                        var diff = nextPrayerTime - now;
                        if (diff < 0) diff = 0;
                        
                        var hours = Math.floor(diff / (1000 * 60 * 60));
                        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        var secs = Math.floor((diff % (1000 * 60)) / 1000);

                        hours = (hours < 10) ? "0" + hours : hours;
                        mins = (mins < 10) ? "0" + mins : mins;
                        secs = (secs < 10) ? "0" + secs : secs;

                        $('#prayer-countdown').text('-' + hours + ':' + mins + ':' + secs);
                    }

                    updateCountdown();
                    setInterval(updateCountdown, 1000);
                }
            },
            error: function() {
                $('#tanggal-hijriah').text('Gagal memuat jadwal sholat');
            }
        });
    }

    // Islamic Event Calendar (for 404 page)
    let currentCalendarYear, currentCalendarMonth;

    if ($('#event-calendar-container').length > 0) {
        const today = new Date();
        currentCalendarYear = today.getFullYear();
        currentCalendarMonth = today.getMonth() + 1;
        fetchAndRenderCalendar(currentCalendarYear, currentCalendarMonth);
    }

    function fetchAndRenderCalendar(year, month) {
        $('#event-calendar-container').html(`
            <div class="text-center">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-dark">Memuat Kalender Event...</p>
            </div>
        `);
        
        $.ajax({
            url: `https://api.aladhan.com/v1/calendarByCity?city=Purwakarta&country=Indonesia&method=20&month=${month}&year=${year}`,
            method: 'GET',
            success: function(response) {
                if (response.code === 200 && response.data) {
                    renderCalendar(response.data, year, month);
                } else {
                    $('#event-calendar-container').html('<p class="text-danger text-center">Gagal memuat kalender.</p>');
                }
            },
            error: function() {
                $('#event-calendar-container').html('<p class="text-danger text-center">Terjadi kesalahan koneksi.</p>');
            }
        });
    }

    $(document).on('click', '.calendar-prev-month', function() {
        currentCalendarMonth--;
        if (currentCalendarMonth < 1) {
            currentCalendarMonth = 12;
            currentCalendarYear--;
        }
        fetchAndRenderCalendar(currentCalendarYear, currentCalendarMonth);
    });

    $(document).on('click', '.calendar-next-month', function() {
        currentCalendarMonth++;
        if (currentCalendarMonth > 12) {
            currentCalendarMonth = 1;
            currentCalendarYear++;
        }
        fetchAndRenderCalendar(currentCalendarYear, currentCalendarMonth);
    });

    function renderCalendar(data, year, month) {
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        
        let html = `
            <div class="calendar-wrapper">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <button class="btn btn-sm btn-outline-primary calendar-prev-month"><i class="fa fa-chevron-left"></i></button>
                    <h4 class="text-dark text-center mb-0 fw-bold">${monthNames[month - 1]} ${year}</h4>
                    <button class="btn btn-sm btn-outline-primary calendar-next-month"><i class="fa fa-chevron-right"></i></button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px;">
        `;
        
        dayNames.forEach(d => {
            html += `<div class="text-center fw-bold text-primary py-1" style="font-size: 0.9rem;">${d}</div>`;
        });
        
        const firstDay = new Date(year, month - 1, 1).getDay(); 
        
        for (let i = 0; i < firstDay; i++) {
            html += `<div></div>`;
        }
        
        data.forEach(day => {
            const gDay = day.date.gregorian.day;
            const hDay = day.date.hijri.day;
            const holidays = day.date.hijri.holidays || [];
            const hasHoliday = holidays.length > 0;
            
            let bgClass = "bg-white";
            let tooltip = "";
            let holidayIndicator = "";
            let textClass = "text-dark";
            
            if (hasHoliday) {
                bgClass = "bg-primary text-white border-primary";
                textClass = "text-white";
                tooltip = `title="${holidays.join(', ')}"`;
                holidayIndicator = `<div style="font-size: 0.55rem; line-height: 1; margin-top: 3px; width: 100%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${holidays[0]}</div>`;
            }
            
            html += `
                <div class="rounded p-1 shadow-sm ${bgClass} d-flex flex-column justify-content-center align-items-center" style="height: 55px; border: 1px solid rgba(0,0,0,0.05); cursor: pointer; min-width: 0;" ${tooltip} data-bs-toggle="tooltip" data-bs-placement="top">
                    <span class="fw-bold ${textClass}" style="font-size: 1rem; line-height: 1;">${parseInt(gDay)}</span>
                    <span class="${hasHoliday ? 'text-white-50' : 'text-muted'}" style="font-size: 0.65rem; line-height: 1; margin-top: 2px;">${parseInt(hDay)}</span>
                    ${holidayIndicator}
                </div>
            `;
        });
        
        html += `</div></div>`;
        $('#event-calendar-container').html(html);
        
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

})(jQuery);

