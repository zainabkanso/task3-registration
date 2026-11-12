
// =====================================
// IMPROVE AC - SEARCH BY PRICE
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Get search inputs
    const minInput = document.getElementById("minPrice");
    const maxInput = document.getElementById("maxPrice");

    // Get reset button
    const resetBtn = document.getElementById("resetPrice");

    // Get pricing course cards
    const courses = document.querySelectorAll(".pricing-course");

    // Get results elements
    const results = document.getElementById("priceResults");
    const noResults = document.getElementById("noPriceResults");

    // Filter courses
    function filterCourses() {

        const minPrice = minInput.value === ""
            ? 0
            : Number(minInput.value);

        const maxPrice = maxInput.value === ""
            ? Infinity
            : Number(maxInput.value);

        let visibleCount = 0;

        courses.forEach(function (course) {

            // Read price from HTML
            const price = Number(course.dataset.price);

            // Check if price fits the range
            const matches =
                price >= minPrice && price <= maxPrice;

            // Show or hide card
            course.hidden = !matches;

            if (matches) {
                visibleCount++;
            }

        });

        // Update result count
        results.textContent =
            `Showing ${visibleCount} ` +
            (visibleCount === 1 ? "course" : "courses");

        // Show message if no courses match
        noResults.hidden = visibleCount !== 0;
    }

    // Filter automatically while typing
    minInput.addEventListener("input", filterCourses);
    maxInput.addEventListener("input", filterCourses);

    // Reset price filters
    resetBtn.addEventListener("click", function () {

        minInput.value = "";
        maxInput.value = "";

        filterCourses();

    });

});
