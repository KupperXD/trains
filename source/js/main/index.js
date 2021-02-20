
document.addEventListener('DOMContentLoaded', function () {
    const holders = document.querySelectorAll('.js-ps-custom');

    holders.forEach(function (item) {
        new PerfectScrollbar(item);
    });
});