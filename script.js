document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navButtons = document.querySelectorAll('nav button');
    const profileForm = document.getElementById('profile-form');
    const addMealGroupBtn = document.getElementById('add-meal-group-btn');
    const mealGroupsContainer = document.getElementById('meal-groups-container');
    const saveCheckinBtn = document.getElementById('save-checkin-btn');
    const checkinCheckboxes = document.querySelectorAll('#checkin-page input[type="checkbox"]');
    const checkinHistoryList = document.getElementById('checkin-history-list');
    const weightHistoryList = document.getElementById('weight-history-list');
    const addWeightEntryBtn = document.getElementById('add-weight-entry-btn');
    const newCurrentWeightInput = document.getElementById('new-current-weight');
    const newWeightDateInput = document.getElementById('new-weight-date');
    const addCustomFoodForm = document.getElementById('add-custom-food-form');
    const customFoodList = document.getElementById('custom-food-list');
    const pastMealsList = document.getElementById('past-meals-list');
    const dietFeedbackMessage = document.getElementById('diet-feedback-message');

    // Home Page Progress Elements
    const userNameSpan = document.getElementById('user-name');
    const caloriesProgressBar = document.getElementById('calories-progress');
    const caloriesNum = document.getElementById('calories-num');
    const proteinProgressBar = document.getElementById('protein-progress');
    const proteinNum = document.getElementById('protein-num');
    const carbsProgressBar = document.getElementById('carbs-progress');
    const carbsNum = document.getElementById('carbs-num');
    const fatsProgressBar = document.getElementById('fats-progress');
    const fatsNum = document.getElementById('fats-num');
    const weightProgressBar = document.getElementById('weight-progress');
    const weightNum = document.getElementById('weight-num');
    const weightRemainingText = document.getElementById('weight-remaining-text');
    const weightPredictionText = document.getElementById('weight-prediction-text');
    const weightLostGainedText = document.getElementById('weight-lost-gained-text');
    const userRankDisplay = document.getElementById('user-rank');
    const highestRankDisplay = document.getElementById('highest-rank-display');
    const showAllRanksBtn = document.getElementById('show-all-ranks-btn');
    const allRanksList = document.getElementById('all-ranks-list');

    // Target Date field
    const targetDateInput = document.getElementById('target-date');

    // Chart.js elements
    const weightChartCanvas = document.getElementById('weightChart');
    let weightChart;

    // New elements for Weight Page
    const createDeficitBtn = document.getElementById('create-deficit-btn');
    const weightPageFeedbackMessage = document.getElementById('weight-page-feedback-message');

    // --- Application Data (simulating a "database" with LocalStorage) ---
    let userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;
    let dailyData = JSON.parse(localStorage.getItem('dailyData')) || {
        date: new Date().toLocaleDateString('pt-BR'),
        consumedCalories: 0,
        consumedProtein: 0,
        consumedCarbs: 0,
        consumedFats: 0,
        mealGroups: []
    };
    let checkinHistory = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];
    let pastDailySummaries = JSON.parse(localStorage.getItem('pastDailySummaries')) || [];
    let lastWeightCheckDate = localStorage.getItem('lastWeightCheckDate') ? new Date(localStorage.getItem('lastWeightCheckDate')) : null;

    let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
    let maxStreak = parseInt(localStorage.getItem('maxStreak')) || 0;
    let highestAchievedRank = localStorage.getItem('highestAchievedRank') || 'Novato';
    let lastSuccessfulCheckinDate = localStorage.getItem('lastSuccessfulCheckinDate') ? new Date(localStorage.getItem('lastSuccessfulCheckinDate')) : null;

    let foodDatabase = JSON.parse(localStorage.getItem('foodDatabase')) || [];
    let defaultFoods = [
        // NOVAS ADIÇÕES
        { name: 'Whey Protein Growth (Concentrado)', kcalPer100g: 380, proteinPer100g: 75, carbsPer100g: 8, fatsPer100g: 5, isCustom: false },
        { name: 'Leite Integral', kcalPer100g: 60, proteinPer100g: 3.2, carbsPer100g: 4.7, fatsPer100g: 3.3, isCustom: false },
        { name: 'Leite Desnatado', kcalPer100g: 35, proteinPer100g: 3.4, carbsPer100g: 5, fatsPer100g: 0.5, isCustom: false },
        // More food entries omitted for brevity...
    ];
    
    // Add default foods to foodDatabase if it's empty or they haven't been added yet
    if (foodDatabase.length === 0 || !foodDatabase.some(food => !food.isCustom)) {
        foodDatabase = defaultFoods.concat(foodDatabase.filter(food => food.isCustom));
        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
    }

    // --- Initialization and Rendering Functions ---
    function initApp() {
        checkDailyReset();
        renderUserProfile();
        updateProgressBars();
        renderMealGroups();
        renderCheckinHistory();
        renderWeightHistory();
        renderCustomFoodList();
        updateWeightPrediction();
        renderPastMealsSummaries(); // Changed to renderPastMealSummaries
        checkWeeklyWeightProgress();
        setupWeightChart();
        updateCheckinStreakDisplay();
        updateUserRank();
        updateHighestRankDisplay();
    }

    function checkDailyReset() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLocaleString = today.toLocaleDateString('pt-BR');

        if (dailyData.date !== todayLocaleString) {
            console.log("Reiniciando dados diários e salvando resumo do dia anterior...");
            if (dailyData.consumedCalories > 0 || dailyData.consumedProtein > 0 || dailyData.consumedCarbs > 0 || dailyData.consumedFats > 0) {
                pastDailySummaries.unshift({
                    date: dailyData.date,
                    calories: dailyData.consumedCalories,
                    protein: dailyData.consumedProtein,
                    carbs: dailyData.consumedCarbs,
                    fats: dailyData.consumedFats
                });
                pastDailySummaries = pastDailySummaries.slice(0, 7);
                localStorage.setItem('pastDailySummaries', JSON.stringify(pastDailySummaries));
            }

            // Manter os grupos de refeições, mas limpar os alimentos
            dailyData = {
                date: todayLocaleString,
                consumedCalories: 0,
                consumedProtein: 0,
                consumedCarbs: 0,
                consumedFats: 0,
                mealGroups: dailyData.mealGroups // Manter os grupos de refeições
            };
            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            checkinCheckboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.removeItem('currentDayCheckinState');
        }
    }

    // **Excluir Perfil**
    document.getElementById('delete-profile-btn').addEventListener('click', () => {
        const confirmDelete = confirm("Tem certeza que deseja excluir todos os seus dados e retornar ao estado inicial?");
        if (confirmDelete) {
            localStorage.clear(); // Limpa todos os dados armazenados no localStorage
            alert("Perfil excluído com sucesso!");
            location.reload(); // Recarrega a página para reiniciar o app
        }
    });

    // Funções de renderização e outras interações omitidas para brevidade...

    // Inicializar o aplicativo
    initApp();

    // Mostrar a página inicial ou configurações, caso o perfil não tenha sido preenchido
    if (!userProfile) {
        showPage('settings-page');
    } else {
        showPage('home-page');
    }
});
