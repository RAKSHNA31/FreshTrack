/* =====================================
   FRESHTRACK
   Smart Food Expiry Manager
===================================== */


/* ---------- STORAGE ---------- */

const STORAGE_KEY = "foodExpiryItems";


let foods = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];


let editingId = null;


/* ---------- DOM ELEMENTS ---------- */

const foodForm = document.getElementById("foodForm");

const categoryInput =
    document.getElementById("category");

const foodNameInput =
    document.getElementById("foodName");

const expiryDateInput =
    document.getElementById("expiryDate");

const editingIdInput =
    document.getElementById("editingId");

const submitText =
    document.getElementById("submitText");

const formTitle =
    document.getElementById("formTitle");

const cancelEditButton =
    document.getElementById("cancelEdit");

const foodList =
    document.getElementById("foodList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const foodCount =
    document.getElementById("foodCount");


/* ---------- CATEGORY ICONS ---------- */

const categoryIcons = {

    "Dairy": "🥛",

    "Meat": "🥩",

    "Vegetables": "🥦",

    "Fruits": "🍎",

    "Bakery": "🍞",

    "Canned / Packaged": "🥫",

    "Beverages": "🥤",

    "Frozen Food": "🧊",

    "Snacks": "🍪",

    "Grains & Cereals": "🌾",

    "Spices & Condiments": "🧂",

    "Other Food": "🍱"

};


/* ---------- SAVE DATA ---------- */

function saveFoods() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(foods)
    );
}


/* ---------- DATE ---------- */

function getTodayString() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ---------- DAYS LEFT ---------- */

function getDaysLeft(expiryDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const expiry =
        new Date(`${expiryDate}T00:00:00`);


    const difference =
        expiry.getTime() -
        today.getTime();


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );
}


/* ---------- STATUS ---------- */

function getStatus(food) {

    if (food.status === "used") {

        return {

            text: "Used / Discarded",

            card: "used",

            badge: "badge-used"

        };

    }


    const days =
        getDaysLeft(food.expiryDate);


    if (days < 0) {

        return {

            text: "Expired",

            card: "expired",

            badge: "badge-expired"

        };

    }


    if (days === 0) {

        return {

            text: "Expires Today",

            card: "urgent",

            badge: "badge-urgent"

        };

    }


    if (days === 1) {

        return {

            text: "Expires Tomorrow",

            card: "urgent",

            badge: "badge-urgent"

        };

    }


    if (days <= 3) {

        return {

            text: "Within 3 Days",

            card: "urgent",

            badge: "badge-urgent"

        };

    }


    if (days <= 7) {

        return {

            text: "Within 7 Days",

            card: "warning",

            badge: "badge-warning"

        };

    }


    return {

        text: "Safe",

        card: "",

        badge: "badge-safe"

    };

}


/* ---------- DAYS TEXT ---------- */

function getDaysText(food) {

    if (food.status === "used") {

        return "Item has been used or discarded.";

    }


    const days =
        getDaysLeft(food.expiryDate);


    if (days < 0) {

        const expiredDays =
            Math.abs(days);

        return `❌ Expired ${expiredDays} day${expiredDays === 1 ? "" : "s"} ago`;

    }


    if (days === 0) {

        return "🚨 Expires today!";

    }


    if (days === 1) {

        return "⚠️ Expires tomorrow";

    }


    return `📅 ${days} days remaining`;

}


/* ---------- DATE FORMAT ---------- */

function formatDate(dateString) {

    const date =
        new Date(`${dateString}T00:00:00`);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ---------- ESCAPE HTML ---------- */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ---------- UPDATE DATE ---------- */

function updateCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


/* ---------- UPDATE DASHBOARD ---------- */

function updateDashboard() {

    const activeFoods =
        foods.filter(
            food => food.status !== "used"
        );


    const total =
        activeFoods.length;


    const withinSeven =
        activeFoods.filter(
            food => {

                const days =
                    getDaysLeft(food.expiryDate);

                return days >= 0 && days <= 7;

            }
        ).length;


    const withinThree =
        activeFoods.filter(
            food => {

                const days =
                    getDaysLeft(food.expiryDate);

                return days >= 0 && days <= 3;

            }
        ).length;


    const expired =
        activeFoods.filter(
            food =>
                getDaysLeft(food.expiryDate) < 0
        ).length;


    document.getElementById("totalFood").textContent =
        total;


    document.getElementById("withinSeven").textContent =
        withinSeven;


    document.getElementById("withinThree").textContent =
        withinThree;


    document.getElementById("expiredFood").textContent =
        expired;


    /* TIMELINE */

    const today =
        activeFoods.filter(
            food =>
                getDaysLeft(food.expiryDate) === 0
        ).length;


    const threeDays =
        activeFoods.filter(
            food => {

                const days =
                    getDaysLeft(food.expiryDate);

                return days >= 1 && days <= 3;

            }
        ).length;


    const fourToSeven =
        activeFoods.filter(
            food => {

                const days =
                    getDaysLeft(food.expiryDate);

                return days >= 4 && days <= 7;

            }
        ).length;


    const safe =
        activeFoods.filter(
            food =>
                getDaysLeft(food.expiryDate) > 7
        ).length;


    document.getElementById("todayCount").textContent =
        today;


    document.getElementById("threeDayCount").textContent =
        threeDays;


    document.getElementById("sevenDayCount").textContent =
        fourToSeven;


    document.getElementById("safeCount").textContent =
        safe;


    document.getElementById("expiredTimelineCount").textContent =
        expired;


    updateExpiryAlert();

    updateCategoryOverview();

    updateAnalytics();

}


/* ---------- EXPIRY ALERT ---------- */

function updateExpiryAlert() {

    const alertBox =
        document.getElementById("expiryAlert");

    const alertTitle =
        document.getElementById("alertTitle");

    const alertMessage =
        document.getElementById("alertMessage");


    const urgentFoods =
        foods.filter(
            food => {

                if (food.status === "used") {
                    return false;
                }

                const days =
                    getDaysLeft(food.expiryDate);

                return days >= 0 && days <= 3;

            }
        );


    if (urgentFoods.length === 0) {

        alertBox.classList.add("hidden");

        return;

    }


    alertBox.classList.remove("hidden");


    alertTitle.textContent =
        "Food Expiry Alert";


    if (urgentFoods.length === 1) {

        alertMessage.textContent =
            `${urgentFoods[0].name} is expiring soon.`;

    } else {

        alertMessage.textContent =
            `${urgentFoods.length} food items are expiring within 3 days.`;

    }

}


/* ---------- CATEGORY OVERVIEW ---------- */

function updateCategoryOverview() {

    const container =
        document.getElementById("categoryOverview");


    const activeFoods =
        foods.filter(
            food =>
                food.status !== "used"
        );


    if (activeFoods.length === 0) {

        container.innerHTML = `
            <p class="category-name">
                No food items available.
            </p>
        `;

        return;

    }


    const categories = {};


    activeFoods.forEach(
        food => {

            categories[food.category] =
                (categories[food.category] || 0) + 1;

        }
    );


    const maxCount =
        Math.max(
            ...Object.values(categories)
        );


    container.innerHTML =
        Object.entries(categories)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

            .map(
                ([category, count]) => {

                    const percentage =
                        (count / maxCount) * 100;


                    return `

                        <div class="category-row">

                            <span
                                class="category-name"
                                title="${escapeHTML(category)}"
                            >
                                ${category}
                            </span>

                            <div class="category-bar">

                                <div
                                    class="category-bar-fill"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                            <span class="category-number">
                                ${count}
                            </span>

                        </div>

                    `;

                }
            )

            .join("");

}


/* ---------- ANALYTICS ---------- */

function updateAnalytics() {

    const used =
        foods.filter(
            food =>
                food.status === "used"
        ).length;


    const expired =
        foods.filter(
            food => {

                if (food.status === "used") {
                    return false;
                }

                return getDaysLeft(food.expiryDate) < 0;

            }
        ).length;


    const stored =
        foods.filter(
            food =>
                food.status !== "used"
        ).length;


    const totalTracked =
        used + expired + stored;


    const waste =
        totalTracked === 0
            ? 0
            : (expired / totalTracked) * 100;


    document.getElementById("usedCount").textContent =
        used;


    document.getElementById("analyticsExpired").textContent =
        expired;


    document.getElementById("storedCount").textContent =
        stored;


    document.getElementById("wasteRate").textContent =
        `${waste.toFixed(1)}%`;

}


/* ---------- RENDER FOODS ---------- */

function renderFoods() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const sortValue =
        sortFilter.value;


    let filteredFoods =
        foods.filter(
            food => {

                const matchesSearch =
                    food.name
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCategory =
                    selectedCategory === "all" ||
                    food.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    /* SORT */

    if (sortValue === "expiryAsc") {

        filteredFoods.sort(
            (a, b) =>
                getDaysLeft(a.expiryDate) -
                getDaysLeft(b.expiryDate)
        );

    }


    if (sortValue === "expiryDesc") {

        filteredFoods.sort(
            (a, b) =>
                getDaysLeft(b.expiryDate) -
                getDaysLeft(a.expiryDate)
        );

    }


    if (sortValue === "nameAsc") {

        filteredFoods.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    if (sortValue === "nameDesc") {

        filteredFoods.sort(
            (a, b) =>
                b.name.localeCompare(a.name)
        );

    }


    if (sortValue === "category") {

        filteredFoods.sort(
            (a, b) =>
                a.category.localeCompare(
                    b.category
                )
        );

    }


    updateFoodCount(
        filteredFoods.length
    );


    if (filteredFoods.length === 0) {

        foodList.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;

    }


    emptyState.classList.add("hidden");


    foodList.innerHTML =
        filteredFoods
            .map(
                createFoodCard
            )
            .join("");

}


/* ---------- CREATE FOOD CARD ---------- */

function createFoodCard(food) {

    const status =
        getStatus(food);


    const icon =
        categoryIcons[food.category] ||
        "🍱";


    const days =
        getDaysLeft(food.expiryDate);


    let daysClass =
        "days-safe";


    if (days < 0) {

        daysClass =
            "days-expired";

    } else if (days <= 3) {

        daysClass =
            "days-urgent";

    } else if (days <= 7) {

        daysClass =
            "days-warning";

    }


    const usedButton =
        food.status === "used"

            ? `
                <button
                    class="card-action use"
                    onclick="restoreFood('${food.id}')"
                >
                    Restore
                </button>
            `

            : `
                <button
                    class="card-action use"
                    onclick="markFoodUsed('${food.id}')"
                >
                    Mark Used
                </button>
            `;


    return `

        <article class="food-card ${status.card}">

            <div class="food-status-line"></div>

            <div class="food-card-content">

                <div class="food-card-top">

                    <div class="food-main">

                        <div class="food-icon">
                            ${icon}
                        </div>

                        <div>

                            <div
                                class="food-name"
                                title="${escapeHTML(food.name)}"
                            >
                                ${escapeHTML(food.name)}
                            </div>

                            <div class="food-category">
                                ${escapeHTML(food.category)}
                            </div>

                        </div>

                    </div>


                    <span
                        class="status-badge ${status.badge}"
                    >
                        ${status.text}
                    </span>

                </div>


                <div class="food-details">

                    <span class="expiry-text">
                        📅 ${formatDate(food.expiryDate)}
                    </span>

                    <span class="days-text ${daysClass}">
                        ${getDaysText(food)}
                    </span>

                </div>


                <div class="card-actions">

                    <button
                        class="card-action"
                        onclick="editFood('${food.id}')"
                    >
                        Edit
                    </button>

                    ${usedButton}

                    <button
                        class="card-action delete"
                        onclick="deleteFood('${food.id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ---------- FOOD COUNT ---------- */

function updateFoodCount(count) {

    foodCount.textContent =
        `${count} item${count === 1 ? "" : "s"}`;

}


/* ---------- ADD / EDIT FOOD ---------- */

foodForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        clearErrors();


        const category =
            categoryInput.value.trim();


        const name =
            foodNameInput.value.trim();


        const expiryDate =
            expiryDateInput.value;


        let valid = true;


        if (!category) {

            document.getElementById(
                "categoryError"
            ).textContent =
                "Please select a category.";

            valid = false;

        }


        if (!name) {

            document.getElementById(
                "nameError"
            ).textContent =
                "Please enter the food item name.";

            valid = false;

        }


        if (!expiryDate) {

            document.getElementById(
                "dateError"
            ).textContent =
                "Please select an expiry date.";

            valid = false;

        }


        if (!valid) {
            return;
        }


        if (editingId) {

            const food =
                foods.find(
                    item =>
                        item.id === editingId
                );


            if (food) {

                food.category =
                    category;

                food.name =
                    name;

                food.expiryDate =
                    expiryDate;

            }


            editingId = null;

            editingIdInput.value = "";


            formTitle.textContent =
                "Add Food Item";


            submitText.textContent =
                "Add Item";


            cancelEditButton.classList.add(
                "hidden"
            );

        } else {

            const newFood = {

                id:
                    Date.now().toString(),

                name:
                    name,

                category:
                    category,

                expiryDate:
                    expiryDate,

                status:
                    "active",

                createdAt:
                    new Date().toISOString()

            };


            foods.push(newFood);

        }


        saveFoods();

        foodForm.reset();

        renderFoods();

        updateDashboard();


        document.getElementById(
            "my-food"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* ---------- EDIT FOOD ---------- */

function editFood(id) {

    const food =
        foods.find(
            item =>
                item.id === id
        );


    if (!food) {
        return;
    }


    editingId =
        id;


    editingIdInput.value =
        id;


    categoryInput.value =
        food.category;


    foodNameInput.value =
        food.name;


    expiryDateInput.value =
        food.expiryDate;


    formTitle.textContent =
        "Edit Food Item";


    submitText.textContent =
        "Save Changes";


    cancelEditButton.classList.remove(
        "hidden"
    );


    document.getElementById(
        "add-food"
    ).scrollIntoView({
        behavior: "smooth"
    });


    foodNameInput.focus();

}


/* ---------- CANCEL EDIT ---------- */

cancelEditButton.addEventListener(
    "click",
    function () {

        editingId =
            null;


        editingIdInput.value =
            "";


        foodForm.reset();


        formTitle.textContent =
            "Add Food Item";


        submitText.textContent =
            "Add Item";


        cancelEditButton.classList.add(
            "hidden"
        );


        clearErrors();

    }
);


/* ---------- DELETE FOOD ---------- */

function deleteFood(id) {

    const food =
        foods.find(
            item =>
                item.id === id
        );


    if (!food) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${food.name}"?`
        );


    if (!confirmed) {
        return;
    }


    foods =
        foods.filter(
            item =>
                item.id !== id
        );


    saveFoods();

    renderFoods();

    updateDashboard();

}


/* ---------- MARK USED ---------- */

function markFoodUsed(id) {

    const food =
        foods.find(
            item =>
                item.id === id
        );


    if (!food) {
        return;
    }


    food.status =
        "used";


    saveFoods();

    renderFoods();

    updateDashboard();

}


/* ---------- RESTORE ---------- */

function restoreFood(id) {

    const food =
        foods.find(
            item =>
                item.id === id
        );


    if (!food) {
        return;
    }


    food.status =
        "active";


    saveFoods();

    renderFoods();

    updateDashboard();

}


/* ---------- CLEAR ERRORS ---------- */

function clearErrors() {

    document.getElementById(
        "categoryError"
    ).textContent = "";


    document.getElementById(
        "nameError"
    ).textContent = "";


    document.getElementById(
        "dateError"
    ).textContent = "";

}


/* ---------- SEARCH ---------- */

searchInput.addEventListener(
    "input",
    renderFoods
);


/* ---------- CATEGORY FILTER ---------- */

categoryFilter.addEventListener(
    "change",
    renderFoods
);


/* ---------- SORT ---------- */

sortFilter.addEventListener(
    "change",
    renderFoods
);


/* ---------- EXPORT CSV ---------- */

document.getElementById(
    "exportCsv"
).addEventListener(
    "click",
    exportCSV
);


function exportCSV() {

    if (foods.length === 0) {

        alert(
            "There are no food items to export."
        );

        return;

    }


    const headers = [
        "Food Name",
        "Category",
        "Expiry Date",
        "Status",
        "Days Remaining"
    ];


    const rows =
        foods.map(
            food => {

                const status =
                    getStatus(food);


                const days =
                    food.status === "used"
                        ? "N/A"
                        : getDaysLeft(
                            food.expiryDate
                        );


                return [

                    food.name,

                    food.category,

                    food.expiryDate,

                    status.text,

                    days

                ];

            }
        );


    const csv = [

        headers,

        ...rows

    ]

        .map(
            row =>
                row
                    .map(
                        value =>
                            `"${String(value)
                                .replace(/"/g, '""')}"`
                    )
                    .join(",")
        )

        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "freshtrack-food-items.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* ---------- DARK MODE ---------- */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const themeIcon =
    document.getElementById(
        "themeIcon"
    );


const themeText =
    document.getElementById(
        "themeText"
    );


function updateThemeButton() {

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        themeIcon.textContent =
            "☀️";

        themeText.textContent =
            "Light Mode";

    } else {

        themeIcon.textContent =
            "🌙";

        themeText.textContent =
            "Dark Mode";

    }

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "freshTrackTheme",
            isDark
                ? "dark"
                : "light"
        );


        updateThemeButton();

    }
);


/* ---------- LOAD THEME ---------- */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "freshTrackTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeButton();

}


/* ---------- SIDEBAR ACTIVE LINK ---------- */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );

            }
        );

    }
);


/* ---------- SET MINIMUM DATE ---------- */

function setMinimumDate() {

    expiryDateInput.min =
        getTodayString();

}


/* ---------- INITIAL LOAD ---------- */

function initializeApp() {

    updateCurrentDate();

    setMinimumDate();

    loadTheme();

    renderFoods();

    updateDashboard();

}


/* ---------- REFRESH EXPIRY STATUS ---------- */

setInterval(
    function () {

        renderFoods();

        updateDashboard();

    },
    60000
);


/* ---------- START ---------- */

initializeApp();