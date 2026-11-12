
// ======================================
// IMPROVE AC - STUDENT ENROLLMENT DEMO
// ======================================

// Browser storage key
const STORAGE_KEY = "improveAC_demo_student";

// Available courses
const COURSES = {
    "web-development": {
        title: "Web Development",
        duration: "8 Weeks",
        level: "Beginner",
        image: "images/webc.PNG",
        link: "web-development.html"
    },

    "graphic-design": {
        title: "Graphic Design",
        duration: "6 Weeks",
        level: "Beginner",
        image: "images/graphic.PNG",
        link: "graphic-design.html"
    },

    "data-analysis": {
        title: "Data Analysis",
        duration: "10 Weeks",
        level: "Intermediate",
        image: "images/data.PNG",
        link: "data-analysis.html"
    }
};


// ========== READ SAVED STUDENT ==========

function getStudent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const student = saved ? JSON.parse(saved) : null;

        if (
            student &&
            typeof student.email === "string" &&
            Array.isArray(student.courses)
        ) {
            return student;
        }
    } catch (error) {
        console.error("Cannot read saved student.", error);
    }

    return null;
}


// ========== REGISTRATION PAGE ==========

function setupRegistration() {

    const form = document.getElementById(
        "studentRegistrationForm"
    );

    if (!form) return;

    // Load existing student information
    const savedStudent = getStudent();

    if (savedStudent) {
        form.elements["name"].value =
            savedStudent.name || "";

        form.elements["email"].value =
            savedStudent.email || "";
    }

    // Automatically select a course from URL
    // Example: register.html?course=graphic-design
    const params = new URLSearchParams(
        window.location.search
    );

    const selectedCourse = params.get("course");

    if (selectedCourse && COURSES[selectedCourse]) {
        form.elements["course"].value = selectedCourse;
    }

    // Handle form submission
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!form.reportValidity()) return;

        const name =
            form.elements["name"].value.trim();

        const email =
            form.elements["email"].value.trim().toLowerCase();

        const courseId =
            form.elements["course"].value;

        if (!name || !email || !COURSES[courseId]) {
            alert("Please complete the required fields.");
            return;
        }

        const previousStudent = getStudent();

        // This demo supports one student per browser.
        if (
            previousStudent &&
            previousStudent.email !== email
        ) {
            const replace = window.confirm(
                "This browser already has a demo student. " +
                "Replace that student and their saved courses?"
            );

            if (!replace) return;
        }

        // Keep courses only for the same email.
        const courses =
            previousStudent &&
            previousStudent.email === email
                ? [...previousStudent.courses]
                : [];

        // Prevent duplicate course registrations
        const alreadyRegistered = courses.some(
            item => item.id === courseId
        );

        if (!alreadyRegistered) {
            courses.push({
                id: courseId,
                registeredAt: new Date().toISOString()
            });
        }

        const student = {
            name: name,
            email: email,
            courses: courses
        };

        // Save locally on this device
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(student)
            );

            // Open My Courses
            window.location.href = "my-courses.html";

        } catch (error) {
            alert(
                "Unable to save your courses. " +
                "Check your browser storage settings."
            );
        }
    });
}


// ========== MY COURSES PAGE ==========

function showMyCourses() {

    const grid = document.getElementById("myCoursesGrid");

    if (!grid) return;

    const student = getStudent();

    const summary = document.getElementById(
        "studentSummary"
    );

    const emptyState = document.getElementById(
        "emptyCourses"
    );

    // No saved student or no courses
    if (!student || student.courses.length === 0) {
        summary.hidden = true;
        emptyState.hidden = false;
        return;
    }

    summary.hidden = false;
    emptyState.hidden = true;

    // Student information
    document.getElementById("studentWelcome").textContent =
        `Welcome back, ${student.name}!`;

    document.getElementById("studentEmail").textContent =
        student.email;

    const validCourses = student.courses.filter(
        item => COURSES[item.id]
    );

    document.getElementById("courseCount").textContent =
        `${validCourses.length} Registered Course` +
        (validCourses.length === 1 ? "" : "s");

    grid.innerHTML = "";

    // Create course cards
    validCourses.forEach(function (enrollment) {

        const course = COURSES[enrollment.id];

        const date = new Date(
            enrollment.registeredAt
        );

        const registeredDate = isNaN(date.getTime())
            ? "Not available"
            : date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        const column = document.createElement("div");
        column.className = "col-md-6 col-lg-4";

        // Course information comes from our fixed
        // COURSES object, not user-supplied HTML.
        column.innerHTML = `
            <article class="my-course-card h-100">

                <img src="${course.image}"
                     alt="${course.title}">

                <div class="my-course-body">

                    <span class="my-course-status">
                        <i class="bi bi-check-circle"></i>
                        Registered
                    </span>

                    <h2>${course.title}</h2>

                    <div class="my-course-meta">
                        <span>
                            <i class="bi bi-clock"></i>
                            ${course.duration}
                        </span>

                        <span>
                            <i class="bi bi-bar-chart"></i>
                            ${course.level}
                        </span>
                    </div>

                    <p>
                        Registered on ${registeredDate}
                    </p>

                    <a href="${course.link}"
                       class="my-course-btn">
                        View Course Details
                        <i class="bi bi-arrow-up-right"></i>
                    </a>

                </div>
            </article>
        `;

        grid.appendChild(column);
    });
}


// ========== INITIALIZE ==========

document.addEventListener("DOMContentLoaded", () => {
    setupRegistration();
    showMyCourses();
});
