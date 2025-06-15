document.addEventListener('DOMContentLoaded', () => {
    let appContent = null; 

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
    const proteinNum = document = document.getElementById('protein-num');
    const carbsProgressBar = document.getElementById('carbs-progress');
    const carbsNum = document.getElementById('carbs-num');
    const fatsProgressBar = document = document.getElementById('fats-progress');
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

    // Campos de ajuste manual de metas
    const manualTargetCaloriesInput = document.getElementById('manual-target-calories');
    const manualTargetProteinInput = document.getElementById('manual-target-protein');
    const manualTargetCarbsInput = document.getElementById('manual-target-carbs');
    const manualTargetFatsInput = document.getElementById('manual-target-fats');
    const saveManualTargetsBtn = document.getElementById('save-manual-targets-btn'); 
    
    // Elementos para ocultar/mostrar seções de ajuste
    const toggleAddCustomFoodBtn = document.getElementById('toggle-custom-food-section-btn'); 
    const addCustomFoodSection = document.getElementById('add-custom-food-section');
    const toggleAdjustTargetsBtn = document.getElementById('toggle-adjust-targets-btn');
    const adjustTargetsSection = document.getElementById('adjust-targets-section');


    // Difficulty Mode
    const difficultyModeSelect = document.getElementById('difficulty-mode');
    const genderSelect = document.getElementById('gender');
    const checkinSleep = document.querySelector('.checkin-sleep');
    const checkinWorkout = document.querySelector('.checkin-workout');
    const checkinDiet = document.querySelector('.checkin-diet');
    const checkinNofap = document.querySelector('.checkin-nofap');
    const helpDifficultyModeBtn = document.getElementById('help-difficulty-mode');
    const helpManualRankBtn = document.getElementById('help-manual-rank');
    const helpTargetDateBtn = document.getElementById('help-target-date');

    // Manual Rank Adjustment
    const manualCurrentRankInput = document.getElementById('manual-current-rank');

    // New: Initial Weight Settings
    const initialWeightSettingsInput = document.getElementById('initial-weight-settings');

    // Onboarding Elements
    const onboardingScreen = document.getElementById('onboarding-screen');
    const onboardingSteps = document.querySelectorAll('.onboarding-step');
    const nextStepBtn = document.getElementById('next-step-btn');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const onboardingWelcomeScreen = document.getElementById('welcome-step');
    let currentStepIndex = 0;

    // Onboarding Form Inputs
    const onboardingNameInput = document.getElementById('onboarding-name');
    const onboardingGenderSelect = document.getElementById('onboarding-gender');
    const onboardingAgeInput = document.getElementById('onboarding-age');
    const onboardingCurrentWeightInput = document.getElementById('onboarding-current-weight');
    const onboardingHeightInput = document.getElementById('onboarding-height');
    const onboardingTargetWeightInput = document.getElementById('onboarding-target-weight');
    const onboardingTargetDateInput = document.getElementById('onboarding-target-date');
    const onboardingActivityFactorSelect = document.getElementById('onboarding-activity-factor');
    const onboardingDifficultyModeSelect = document.getElementById('onboarding-difficulty-mode');


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
    let storedMealGroups = JSON.parse(localStorage.getItem('storedMealGroups')) || [];
    let checkinHistory = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];
    let pastDailySummaries = JSON.parse(localStorage.getItem('pastDailySummaries')) || [];
    let lastWeightCheckDate = localStorage.getItem('lastWeightCheckDate') ? new Date(localStorage.getItem('lastWeightCheckDate')) : null;

    let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
    let maxStreak = parseInt(localStorage.getItem('maxStreak')) || 0;
    let highestAchievedRank = localStorage.getItem('highestAchievedRank') || 'Novato';
    let lastSuccessfulCheckinDate = localStorage.getItem('lastSuccessfulCheckinDate') ? new Date(localStorage.getItem('lastSuccessfulCheckinDate')) : null;


    let foodDatabase = JSON.parse(localStorage.getItem('foodDatabase')) || [];
    const defaultFoods = [
        { name: 'Whey Protein Growth (Concentrado)', kcalPer100g: 380, proteinPer100g: 75, carbsPer100g: 8, fatsPer100g: 5, isCustom: false },
        { name: 'Leite Integral', kcalPer100g: 60, proteinPer100g: 3.2, carbsPer100g: 4.7, fatsPer100g: 3.3, isCustom: false },
        { name: 'Leite Desnatado', kcalPer100g: 35, proteinPer100g: 3.4, carbsPer100g: 5, fatsPer100g: 0.5, isCustom: false },
        { name: 'Picanha Grelhada', kcalPer100g: 290, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 20, isCustom: false },
        { name: 'Alcatra Grelhada', kcalPer100g: 190, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 9, isCustom: false },
        { name: 'Maminha Grelhada', kcalPer100g: 210, proteinPer100g: 27, carbsPer100g: 0, fatsPer100g: 11, isCustom: false },
        { name: 'Costela Bovina Assada', kcalPer100g: 350, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 28, isCustom: false },
        { name: 'Pato Assado', kcalPer100g: 337, proteinPer100g: 19, carbsPer100g: 0, fatsPer100g: 28, isCustom: false },
        { name: 'Cordeiro Assado', kcalPer100g: 250, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 16, isCustom: false },
        { name: 'Carne Seca Cozida', kcalPer100g: 260, proteinPer100g: 35, carbsPer100g: 0, fatsPer100g: 13, isCustom: false },
        { name: 'Linguiça de Frango', kcalPer100g: 230, proteinPer100g: 15, carbsPer100g: 1, fatsPer100g: 18, isCustom: false },
        { name: 'Linguiça de Porco', kcalPer100g: 320, proteinPer100g: 14, carbsPer100g: 2, fatsPer100g: 28, isCustom: false },
        { name: 'Bacon Frito', kcalPer100g: 540, proteinPer100g: 37, carbsPer100g: 0, fatsPer100g: 42, isCustom: false },
        { name: 'Filé de Tilápia Grelhado', kcalPer100g: 128, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 2.7, isCustom: false },
        { name: 'Sardinha em Lata (óleo, drenada)', kcalPer100g: 208, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 12, isCustom: false },
        { name: 'Atum em Lata (água, drenado)', kcalPer100g: 100, proteinPer100g: 23, carbsPer100g: 0, fatsPer100g: 1, isCustom: false },
        { name: 'Salmão Cozido', kcalPer100g: 170, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 7, isCustom: false },
        { name: 'Camarão Cozido', kcalPer100g: 85, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 0.5, isCustom: false },
        { name: 'Ostra', kcalPer100g: 81, proteinPer100g: 9, carbsPer100g: 4.8, fatsPer100g: 2.3, isCustom: false },
        { name: 'Lagosta', kcalPer100g: 89, proteinPer100g: 19, carbsPer100g: 0, fatsPer100g: 0.5, isCustom: false },
        { name: 'Costelinha de Porco Assada', kcalPer100g: 300, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 20, isCustom: false },
        { name: 'Sobrecoxa de Frango Cozida', kcalPer100g: 210, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 12, isCustom: false },
        { name: 'Patinho Moído Cozido', kcalPer100g: 170, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 6, isCustom: false },
        { name: 'Contra-filé Grelhado', kcalPer100g: 240, proteinPer100g: 29, carbsPer100g: 0, fatsPer100g: 14, isCustom: false },
        { name: 'Filé Mignon Grelhado', kcalPer100g: 200, proteinPer100g: 30, carbsPer100g: 0, fatsPer100g: 8, isCustom: false },
        { name: 'Carne de Sol Cozida', kcalPer100g: 280, proteinPer100g: 38, carbsPer100g: 0, fatsPer100g: 15, isCustom: false },
        { name: 'Coxa de Frango sem Pele', kcalPer100g: 170, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 7, isCustom: false },
        { name: 'Peito de Peru Defumado Light', kcalPer100g: 80, proteinPer100g: 18, carbsPer100g: 0, fatsPer100g: 1, isCustom: false },
        { name: 'Lombo de Porco Assado', kcalPer100g: 190, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 8, isCustom: false },
        { name: 'Bisteca de Porco Grelhada', kcalPer100g: 280, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 19, isCustom: false },
        { name: 'Carne Suína Moída', kcalPer100g: 260, proteinPer100g: 22, carbsPer100g: 0, fatsPer100g: 19, isCustom: false },
        { name: 'Filé de Merluza Cozido', kcalPer100g: 90, proteinPer100g: 18, carbsPer100g: 0, fatsPer100g: 1.5, isCustom: false },
        { name: 'Bacalhau Desfiado', kcalPer100g: 130, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 2, isCustom: false },
        { name: 'Ovas de Peixe', kcalPer100g: 140, proteinPer100g: 20, carbsPer100g: 2, fatsPer100g: 6, isCustom: false },
        { name: 'Caranguejo Cozido', kcalPer100g: 80, proteinPer100g: 17, carbsPer100g: 0, fatsPer100g: 0.8, isCustom: false },
        { name: 'Polvo Cozido', kcalPer100g: 82, proteinPer100g: 15, carbsPer100g: 2, fatsPer100g: 1, isCustom: false },
        { name: 'Linguado Grelhado', kcalPer100g: 90, proteinPer100g: 17, carbsPer100g: 0, fatsPer100g: 2, isCustom: false },
        { name: 'Truta Assada', kcalPer100g: 148, proteinPer100g: 23, carbsPer100g: 0, fatsPer100g: 6, isCustom: false },
        { name: 'Pescada Cozida', kcalPer100g: 80, proteinPer100g: 17, carbsPer100g: 0, fatsPer100g: 1, isCustom: false },
        { name: 'Pernil de Porco Assado', kcalPer100g: 250, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 16, isCustom: false },
        { name: 'Maçã', kcalPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatsPer100g: 0.2, isCustom: false },
        { name: 'Banana', kcalPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatsPer100g: 0.3, isCustom: false },
        { name: 'Laranja', kcalPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 11.8, fatsPer100g: 0.1, isCustom: false },
        { name: 'Morango', kcalPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatsPer100g: 0.3, isCustom: false },
        { name: 'Abacate', kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatsPer100g: 14.7, isCustom: false },
        { name: 'Pêssego', kcalPer100g: 39, proteinPer100g: 0.9, carbsPer100g: 9.5, fatsPer100g: 0.3, isCustom: false },
        { name: 'Uva', kcalPer100g: 69, proteinPer100g: 0.7, carbsPer100g: 18, fatsPer100g: 0.2, isCustom: false },
        { name: 'Pera', kcalPer100g: 57, proteinPer100g: 0.4, carbsPer100g: 15, fatsPer100g: 0.1, isCustom: false },
        { name: 'Melancia', kcalPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 7.6, fatsPer100g: 0.2, isCustom: false },
        { name: 'Melão', kcalPer100g: 34, proteinPer100g: 0.8, carbsPer100g: 8.2, fatsPer100g: 0.2, isCustom: false },
        { name: 'Abacaxi', kcalPer100g: 50, proteinPer100g: 0.5, carbsPer100g: 13, fatsPer100g: 0.1, isCustom: false },
        { name: 'Manga', kcalPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15, fatsPer100g: 0.4, isCustom: false },
        { name: 'Kiwi', kcalPer100g: 61, proteinPer100g: 1.1, carbsPer100g: 15, fatsPer100g: 0.5, isCustom: false },
        { name: 'Cereja', kcalPer100g: 50, proteinPer100g: 1, carbsPer100g: 12, fatsPer100g: 0.3, isCustom: false },
        { name: 'Ameixa', kcalPer100g: 46, proteinPer100g: 0.7, carbsPer100g: 11, fatsPer100g: 0.3, isCustom: false },
        { name: 'Tangerina', kcalPer100g: 53, proteinPer100g: 0.8, carbsPer100g: 13, fatsPer100g: 0.3, isCustom: false },
        { name: 'Limão', kcalPer100g: 29, proteinPer100g: 1.1, carbsPer100g: 9, fatsPer100g: 0.3, isCustom: false },
        { name: 'Brócolis Cozido', kcalPer100g: 55, proteinPer100g: 3.7, carbsPer100g: 11.2, fatsPer100g: 0.6, isCustom: false },
        { name: 'Cenoura Crua', kcalPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatsPer100g: 0.2, isCustom: false },
        { name: 'Tomate', kcalPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatsPer100g: 0.2, isCustom: false },
        { name: 'Espinafre Cozido', kcalPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatsPer100g: 0.4, isCustom: false },
        { name: 'Pepino', kcalPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatsPer100g: 0.1, isCustom: false },
        { name: 'Abobrinha', kcalPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatsPer100g: 0.3, isCustom: false },
        { name: 'Berinjela', kcalPer100g: 25, proteinPer100g: 1, carbsPer100g: 6, fatsPer100g: 0.2, isCustom: false },
        { name: 'Pimentão Verde', kcalPer100g: 20, proteinPer100g: 0.9, carbsPer100g: 4.6, fatsPer100g: 0.2, isCustom: false },
        { name: 'Cebola', kcalPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatsPer100g: 0.1, isCustom: false },
        { name: 'Alho', kcalPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatsPer100g: 0.5, isCustom: false },
        { name: 'Batata Inglesa Cozida', kcalPer100g: 87, proteinPer100g: 1.9, carbsPer100g: 20, fatsPer100g: 0.1, isCustom: false },
        { name: 'Couve-flor Cozida', kcalPer100g: 25, proteinPer100g: 1.9, carbsPer100g: 4.9, fatsPer100g: 0.3, isCustom: false },
        { name: 'Repolho Cru', kcalPer100g: 25, proteinPer100g: 1.3, carbsPer100g: 5.8, fatsPer100g: 0.1, isCustom: false },
        { name: 'Cogumelos Paris', kcalPer100g: 22, proteinPer100g: 3.1, carbsPer100g: 3.3, fatsPer100g: 0.3, isCustom: false },
        { name: 'Abóbora Cozida', kcalPer100g: 26, proteinPer100g: 1, carbsPer100g: 6.5, fatsPer100g: 0.1, isCustom: false },
        { name: 'Inhame Cozido', kcalPer100g: 118, proteinPer100g: 1.5, carbsPer100g: 27.5, fatsPer100g: 0.2, isCustom: false },
        { name: 'Mandioca Cozida', kcalPer100g: 160, proteinPer100g: 1.4, carbsPer100g: 38, fatsPer100g: 0.3, isCustom: false },
        { name: 'Frango Grelhado (Peito)', kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6, isCustom: false },
        { name: 'Bife Grelhado (Patinho)', kcalPer100g: 200, proteinPer100g: 29, carbsPer100g: 0, fatsPer100g: 9, isCustom: false },
        { name: 'Ovo Cozido', kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatsPer100g: 11, isCustom: false },
        { name: 'Whey Protein (isolado)', kcalPer100g: 370, proteinPer100g: 80, carbsPer100g: 5, fatsPer100g: 5, isCustom: false },
        { name: 'Iogurte Natural Desnatado', kcalPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatsPer100g: 0.4, isCustom: false },
        { name: 'Queijo Cottage', kcalPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatsPer100g: 4.3, isCustom: false },
        { name: 'Lentilha Cozida', kcalPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatsPer100g: 0.4, isCustom: false },
        { name: 'Queijo Minas Frescal', kcalPer100g: 260, proteinPer100g: 17, carbsPer100g: 2, fatsPer100g: 20, isCustom: false },
        { name: 'Queijo Muçarela', kcalPer100g: 300, proteinPer100g: 22, carbsPer100g: 2.2, fatsPer100g: 22, isCustom: false },
        { name: 'Peito de Peru Defumado', kcalPer100g: 100, proteinPer100g: 22, carbsPer100g: 1, fatsPer100g: 1.5, isCustom: false },
        { name: 'Tofu Firme', kcalPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatsPer100g: 4.8, isCustom: false },
        { name: 'Edamame', kcalPer100g: 122, proteinPer100g: 11, carbsPer100g: 10, fatsPer100g: 5, isCustom: false },
        { name: 'Salsicha de Frango', kcalPer100g: 260, proteinPer100g: 11, carbsPer100g: 2, fatsPer100g: 23, isCustom: false },
        { name: 'Presunto Cozido', kcalPer100g: 145, proteinPer100g: 18, carbsPer100g: 1, fatsPer100g: 8, isCustom: false },
        { name: 'Bacalhau Cozido', kcalPer100g: 105, proteinPer100g: 23, carbsPer100g: 0, fatsPer100g: 1, isCustom: false },
        { name: 'Soja Cozida', kcalPer100g: 172, proteinPer100g: 18, carbsPer100g: 9, fatsPer100g: 9, isCustom: false },
        { name: 'Arroz Branco Cozido', kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatsPer100g: 0.3, isCustom: false },
        { name: 'Batata Doce Cozida', kcalPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatsPer100g: 0.1, isCustom: false },
        { name: 'Aveia em Flocos', kcalPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatsPer100g: 6.9, isCustom: false },
        { name: 'Pão Integral', kcalPer100g: 265, proteinPer100g: 13, carbsPer100g: 45, fatsPer100g: 3.5, isCustom: false },
        { name: 'Macarrão Cozido', kcalPer100g: 158, proteinPer100g: 5.8, carbsPer100g: 31, fatsPer100g: 0.9, isCustom: false },
        { name: 'Quinoa Cozida', kcalPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatsPer100g: 1.9, isCustom: false },
        { name: 'Pão Francês', kcalPer100g: 280, proteinPer100g: 8, carbsPer100g: 56, fatsPer100g: 2, isCustom: false },
        { name: 'Feijão Carioca Cozido', kcalPer100g: 76, proteinPer100g: 4.8, carbsPer100g: 13.6, fatsPer100g: 0.5, isCustom: false },
        { name: 'Cuscuz Marroquino Cozido', kcalPer100g: 112, proteinPer100g: 3.8, carbsPer100g: 23, fatsPer100g: 0.2, isCustom: false },
        { name: 'Grão de Bico Cozido', kcalPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27, fatsPer100g: 2.6, isCustom: false },
        { name: 'Milho Cozido', kcalPer100g: 86, proteinPer100g: 3.2, carbsPer100g: 19, fatsPer100g: 1.2, isCustom: false },
        { name: 'Ervilha Cozida', kcalPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14.5, fatsPer100g: 0.4, isCustom: false },
        { name: 'Feijão Fradinho Cozido', kcalPer100g: 130, proteinPer100g: 8.5, carbsPer100g: 23, fatsPer100g: 0.5, isCustom: false },
        { name: 'Cuscuz de Milho Cozido', kcalPer100g: 113, proteinPer100g: 3.4, carbsPer100g: 24, fatsPer100g: 0.5, isCustom: false },
        { name: 'Pão Sírio', kcalPer100g: 260, proteinPer100g: 9, carbsPer100g: 50, fatsPer100g: 2, isCustom: false },
        { name: 'Torrada Integral', kcalPer100g: 380, proteinPer100g: 12, carbsPer100g: 65, fatsPer100g: 8, isCustom: false },
        { name: 'Granola', kcalPer100g: 470, proteinPer100g: 10, carbsPer100g: 65, fatsPer100g: 20, isCustom: false },
        { name: 'Barrinha de Cereal (comum)', kcalPer100g: 400, proteinPer100g: 5, carbsPer100g: 70, fatsPer100g: 10, isCustom: false },
        { name: 'Biscoito Cream Cracker', kcalPer100g: 430, proteinPer100g: 9, carbsPer100g: 68, fatsPer100g: 14, isCustom: false },
        { name: 'Arroz Integral Cozido', kcalPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 23.5, fatsPer100g: 0.9, isCustom: false },
        { name: 'Pão de Forma Branco', kcalPer100g: 265, proteinPer100g: 8, carbsPer100g: 49, fatsPer100g: 3, isCustom: false },
        { name: 'Pão de Centeio', kcalPer100g: 250, proteinPer100g: 8.5, carbsPer100g: 48, fatsPer100g: 2, isCustom: false },
        { name: 'Pão de Milho', kcalPer100g: 270, proteinPer100g: 7, carbsPer100g: 50, fatsPer100g: 4, isCustom: false },
        { name: 'Cereal Matinal (açucarado)', kcalPer100g: 380, proteinPer100g: 5, carbsPer100g: 85, fatsPer100g: 2, isCustom: false },
        { name: 'Azeite de Oliva Extra Virgem', kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100, isCustom: false },
        { name: 'Pasta de Amendoim Natural', kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50, isCustom: false },
        { name: 'Amêndoas', kcalPer100g: 579, proteinPer100g: 21, carbsPer100g: 21, fatsPer100g: 49, isCustom: false },
        { name: 'Castanha do Pará', kcalPer100g: 659, proteinPer100g: 14, carbsPer100g: 12, fatsPer100g: 66, isCustom: false },
        { name: 'Leite Semi-desnatado', kcalPer100g: 47, proteinPer100g: 3.2, carbsPer100g: 4.8, fatsPer100g: 1.6, isCustom: false },
        { name: 'Manteiga de Amendoim', kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50, isCustom: false },
        { name: 'Pizza de Mussarela', kcalPer100g: 266, proteinPer100g: 11, carbsPer100g: 33, fatsPer100g: 10, isCustom: false },
        { name: 'Hambúrguer (carne)', kcalPer100g: 250, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 18, isCustom: false },
        { name: 'Batata Frita', kcalPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41, fatsPer100g: 15, isCustom: false },
        { name: 'Refrigerante Cola', kcalPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.6, fatsPer100g: 0, isCustom: false },
        { name: 'Chocolate ao Leite', kcalPer100g: 535, proteinPer100g: 7, carbsPer100g: 59, fatsPer100g: 30, isCustom: false },
        { name: 'Açúcar Refinado', kcalPer100g: 400, proteinPer100g: 0, carbsPer100g: 100, fatsPer100g: 0, isCustom: false },
        { name: 'Café (sem açúcar)', kcalPer100g: 1, proteinPer100g: 0.1, carbsPer100g: 0, fatsPer100g: 0, isCustom: false },
        { name: 'Chá (sem açúcar)', kcalPer100g: 1, proteinPer100g: 0, carbsPer100g: 0.3, fatsPer100g: 0, isCustom: false },
        { name: 'Mel', kcalPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82.4, fatsPer100g: 0, isCustom: false },
        { name: 'Geléia de Fruta', kcalPer100g: 270, proteinPer100g: 0.5, carbsPer100g: 70, fatsPer100g: 0.1, isCustom: false },
        { name: 'Creme de Leite (25% gordura)', kcalPer100g: 240, proteinPer100g: 2.3, carbsPer100g: 3.6, fatsPer100g: 25, isCustom: false },
        { name: 'Oleo de Coco', kcalPer100g: 892, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100, isCustom: false },
        { name: 'Manteiga', kcalPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatsPer100g: 81, isCustom: false },
        { name: 'Pipoca (sem manteiga)', kcalPer100g: 375, proteinPer100g: 11, carbsPer100g: 78, fatsPer100g: 4, isCustom: false },
        { name: 'Cerveja Lager', kcalPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 3.6, fatsPer100g: 0, isCustom: false },
        { name: 'Vinho Tinto Seco', kcalPer100g: 85, proteinPer100g: 0.1, carbsPer100g: 2.6, fatsPer100g: 0, isCustom: false },
        { name: 'Açúcar Mascavo', kcalPer100g: 380, proteinPer100g: 0, carbsPer100g: 98, fatsPer100g: 0, isCustom: false },
        { name: 'Melado de Cana', kcalPer100g: 290, proteinPer100g: 0, carbsPer100g: 75, fatsPer100g: 0, isCustom: false },
        { name: 'Café com Leite e Açúcar', kcalPer100g: 60, proteinPer100g: 2, carbsPer100g: 10, fatsPer100g: 1.5, isCustom: false },
        { name: 'Suco de Laranja Natural', kcalPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10.4, fatsPer100g: 0.2, isCustom: false },
        { name: 'Suco de Uva Integral', kcalPer100g: 70, proteinPer100g: 0.3, carbsPer100g: 17, fatsPer100g: 0.1, isCustom: false },
        { name: 'Gelatina Diet', kcalPer100g: 10, proteinPer100g: 2, carbsPer100g: 0, fatsPer100g: 0, isCustom: false },
        { name: 'Chocolate Amargo (70% cacau)', kcalPer100g: 580, proteinPer100g: 8, carbsPer100g: 45, fatsPer100g: 40, isCustom: false },
        { name: 'Bolacha Maria', kcalPer100g: 420, proteinPer100g: 7, carbsPer100g: 75, fatsPer100g: 10, isCustom: false },
        { name: 'Doce de Leite', kcalPer100g: 320, proteinPer100g: 6, carbsPer100g: 55, fatsPer100g: 8, isCustom: false },
        { name: 'Brigadeiro', kcalPer100g: 450, proteinPer100g: 5, carbsPer100g: 60, fatsPer100g: 20, isCustom: false },
    ];
    defaultFoods.forEach(defaultFood => {
        if (!foodDatabase.some(food => normalizeString(food.name) === normalizeString(defaultFood.name))) {
            foodDatabase.push(defaultFood);
        }
    });
    localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));


    function initApp() {
        appContent = document.getElementById('app-container');
        
        const isFirstTimeUser = localStorage.getItem('isFirstTimeUser') === null;

        if (isFirstTimeUser) {
            onboardingScreen.style.display = 'flex';
            showOnboardingStep('welcome'); 
            applyTheme('male'); 
        } else {
            onboardingScreen.style.display = 'none'; 
            checkDailyReset(); 
            applyTheme(userProfile ? userProfile.gender : 'male'); 
            renderUserProfile();
            updateProgressBars();
            renderMealGroups();
            renderCheckinHistory();
            renderWeightHistory();
            renderCustomFoodList();
            updateWeightPrediction();
            renderPastMealsSummaries();
            checkWeeklyWeightProgress();
            setupWeightChart();
            updateCheckinStreakDisplay();
            updateUserRank();
            updateHighestRankDisplay();
            updateCheckinVisibility();
            if (!userProfile) { 
                showPage('settings-page');
            } else {
                showPage('home-page');
            }
        }

        if (addCustomFoodSection) {
            addCustomFoodSection.style.display = 'none';
        }
        if (adjustTargetsSection) {
            adjustTargetsSection.style.display = 'none';
        }
    }

    function applyTheme(genderPreference) {
        let currentGenderForTheme = genderPreference;

        if (currentGenderForTheme === 'female') {
            document.documentElement.style.setProperty('--vibrant-blue', '#ff69b4');
            document.documentElement.style.setProperty('--accent-blue', '#5e3b5e');
            document.documentElement.style.setProperty('--primary-dark', '#330033');
            document.documentElement.style.setProperty('--secondary-dark', '#4a1a4a');
            document.documentElement.style.setProperty('--vibrant-orange', '#8a2be2');
            document.documentElement.style.setProperty('--border-color', '#7c4d7c');
        } else {
            document.documentElement.style.setProperty('--vibrant-blue', '#007bff');
            document.documentElement.style.setProperty('--accent-blue', '#2a3459');
            document.documentElement.style.setProperty('--primary-dark', '#0d1223');
            document.documentElement.style.setProperty('--secondary-dark', '#1a2036');
            document.documentElement.style.setProperty('--vibrant-orange', '#e67e22');
            document.documentElement.style.setProperty('--border-color', '#3f4a6b');
        }

        if (appContent) {
            appContent.classList.add('temp-restyle');
            void appContent.offsetWidth; 
            appContent.classList.remove('temp-restyle');
        }
    }

    function getDateOnly(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function recalculateDailyDataFromProfileAndStandards() {
        const todayLocaleString = getDateOnly(new Date()).toLocaleDateString('pt-BR');

        dailyData.consumedCalories = 0;
        dailyData.consumedProtein = 0;
        dailyData.consumedCarbs = 0;
        dailyData.consumedFats = 0;
        dailyData.mealGroups = []; 

        if (userProfile && userProfile.targetCalories) {
            storedMealGroups.forEach(storedGroup => {
                const newGroup = {
                    name: storedGroup.name,
                    foods: [],
                    totalKcal: 0,
                    totalProtein: 0,
                    totalCarbs: 0,
                    totalFats: 0
                };
                storedGroup.foods.filter(food => food.isDailyStandard).forEach(food => {
                    const clonedFood = JSON.parse(JSON.stringify(food));
                    newGroup.foods.push(clonedFood);
                    newGroup.totalKcal += clonedFood.kcal;
                    newGroup.totalProtein += clonedFood.protein;
                    newGroup.totalCarbs += clonedFood.carbs;
                    newGroup.totalFats += clonedFood.fats;

                    dailyData.consumedCalories += clonedFood.kcal;
                    dailyData.consumedProtein += clonedFood.protein;
                    dailyData.consumedCarbs += clonedFood.carbs;
                    dailyData.consumedFats += clonedFood.fats;
                });
                if (newGroup.foods.length > 0) {
                    dailyData.mealGroups.push(newGroup);
                }
            });
        }
        dailyData.date = todayLocaleString; 
        localStorage.setItem('dailyData', JSON.stringify(dailyData));
    }


    function checkDailyReset() {
        const today = getDateOnly(new Date());
        const todayLocaleString = today.toLocaleDateString('pt-BR');

        if (lastSuccessfulCheckinDate) {
            const lastCheckinDay = getDateOnly(new Date(lastSuccessfulCheckinDate));
            const diffTime = today.getTime() - lastCheckinDay.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                currentStreak = 0;
                localStorage.removeItem('lastSuccessfulCheckinDate');
            }
        } else {
            currentStreak = 0;
        }
        localStorage.setItem('currentStreak', currentStreak);


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

            recalculateDailyDataFromProfileAndStandards(); 
            checkinCheckboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.removeItem('currentDayCheckinState');
        } else {
            const savedCheckinState = JSON.parse(localStorage.getItem('currentDayCheckinState'));
            if (savedCheckinState) {
                checkinCheckboxes.forEach(checkbox => {
                    checkbox.checked = savedCheckinState[checkbox.id] || false;
                });
            }
            const updatedDailyMealGroups = [];
            const currentDailyMealGroups = dailyData.mealGroups; 

            storedMealGroups.forEach(storedGroup => {
                let existingDailyGroup = currentDailyMealGroups.find(dg => dg.name === storedGroup.name);
                if (existingDailyGroup) {
                    updatedDailyMealGroups.push(existingDailyGroup);
                } else {
                    const newGroup = {
                        name: storedGroup.name,
                        foods: [],
                        totalKcal: 0,
                        totalProtein: 0,
                        totalCarbs: 0,
                        totalFats: 0
                    };
                    storedGroup.foods.filter(food => food.isDailyStandard).forEach(food => {
                        const clonedFood = JSON.parse(JSON.stringify(food));
                        newGroup.foods.push(clonedFood);
                        newGroup.totalKcal += clonedFood.kcal;
                        newGroup.totalProtein += clonedFood.protein;
                        newGroup.totalCarbs += clonedFood.carbs;
                        newGroup.totalFats += clonedFood.fats;
                    });
                    updatedDailyMealGroups.push(newGroup);
                }
            });

            currentDailyMealGroups.forEach(dailyGroup => {
                const alreadyInUpdated = updatedDailyMealGroups.some(g => g.name === dailyGroup.name);
                if (!alreadyInUpdated) {
                    updatedDailyMealGroups.push(dailyGroup);
                }
            });


            let totalConsumedCalories = 0;
            let totalConsumedProtein = 0;
            let totalConsumedCarbs = 0;
            let totalConsumedFats = 0;

            updatedDailyMealGroups.forEach(group => {
                group.foods.forEach(food => {
                    totalConsumedCalories += food.kcal;
                    totalConsumedProtein += food.protein;
                    totalConsumedCarbs += food.carbs;
                    totalConsumedFats += food.fats;
                });
            });
            dailyData.mealGroups = updatedDailyMealGroups;
            dailyData.consumedCalories = totalConsumedCalories;
            dailyData.consumedProtein = totalConsumedProtein;
            dailyData.consumedCarbs = totalConsumedCarbs;
            dailyData.consumedFats = totalConsumedFats;

            localStorage.setItem('dailyData', JSON.stringify(dailyData));
        }
    }

    function renderUserProfile() {
        if (userProfile) {
            userNameSpan.textContent = userProfile.name;
            document.getElementById('name').value = userProfile.name;
            document.getElementById('age').value = userProfile.age;
            document.getElementById('height').value = userProfile.height;
            document.getElementById('gender').value = userProfile.gender;
            initialWeightSettingsInput.value = userProfile.initialWeight;
            document.getElementById('target-weight').value = userProfile.targetWeight;
            document.getElementById('activity-factor').value = userProfile.activityFactor;
            if (userProfile.targetDate) {
                targetDateInput.value = userProfile.targetDate;
            }
            populateDifficultyModeOptions(userProfile.gender);
            difficultyModeSelect.value = userProfile.difficultyMode || 'easy';
            manualCurrentRankInput.value = currentStreak;

            manualTargetCaloriesInput.value = userProfile.targetCalories || '';
            manualTargetProteinInput.value = userProfile.targetProtein || '';
            manualTargetCarbsInput.value = userProfile.targetCarbs || '';
            manualTargetFatsInput.value = userProfile.targetFats || '';

        } else {
            userNameSpan.textContent = 'Guerreiro';
            populateDifficultyModeOptions('male');
            difficultyModeSelect.value = 'easy';
            manualCurrentRankInput.value = 0;
            initialWeightSettingsInput.value = '';
            manualTargetCaloriesInput.value = '';
            manualTargetProteinInput.value = '';
            manualTargetCarbsInput.value = '';
            manualTargetFatsInput.value = '';
        }
        updateCheckinVisibility();
    }

    function populateDifficultyModeOptions(gender) {
        difficultyModeSelect.innerHTML = '';
        onboardingDifficultyModeSelect.innerHTML = ''; 

        const options = [
            { value: 'easy', text: 'Fácil (Apenas Dieta)' },
            { value: 'hard', text: 'Hard (Dieta e Treino)' }
        ];

        if (gender === 'male') {
            options.push({ value: 'god', text: 'God (Dieta, Treino e NoFap)' });
        }

        options.forEach(optionData => {
            const optionElement = document.createElement('option');
            optionElement.value = optionData.value;
            optionElement.textContent = optionData.text;
            difficultyModeSelect.appendChild(optionElement);

            const onboardingOptionElement = document.createElement('option');
            onboardingOptionElement.value = optionData.value;
            onboardingOptionElement.textContent = optionData.text;
            onboardingDifficultyModeSelect.appendChild(onboardingOptionElement);
        });
    }

    genderSelect.addEventListener('change', (event) => {
        userProfile = userProfile || {}; 
        userProfile.gender = event.target.value;
        populateDifficultyModeOptions(event.target.value);
        if (event.target.value === 'female' && difficultyModeSelect.value === 'god') {
            difficultyModeSelect.value = 'hard';
        }
        applyTheme(event.target.value); 
    });

    onboardingGenderSelect.addEventListener('change', (event) => {
        populateDifficultyModeOptions(event.target.value); 
        if (event.target.value === 'female' && onboardingDifficultyModeSelect.value === 'god') {
            onboardingDifficultyModeSelect.value = 'hard';
        }
        applyTheme(event.target.value); 
    });

    function calculateDailyCaloricNeeds(weight, height, age, gender, activityFactor) {
        let tmb;
        if (gender === 'male') {
            tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            tmb = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        return tmb * activityFactor;
    }

    function saveProfile(event, suppressAlert = false, fromSettingsPage = false, isFromOnboarding = false) {
        if (event) event.preventDefault();

        const name = isFromOnboarding ? onboardingNameInput.value : document.getElementById('name').value;
        const age = isFromOnboarding ? parseInt(onboardingAgeInput.value) : parseInt(document.getElementById('age').value);
        const height = isFromOnboarding ? parseInt(onboardingHeightInput.value) : parseInt(document.getElementById('height').value);
        const gender = isFromOnboarding ? onboardingGenderSelect.value : document.getElementById('gender').value;
        const initialWeight = isFromOnboarding ? parseFloat(onboardingCurrentWeightInput.value) : parseFloat(initialWeightSettingsInput.value);
        const targetWeight = isFromOnboarding ? parseFloat(onboardingTargetWeightInput.value) : parseFloat(document.getElementById('target-weight').value);
        const activityFactor = isFromOnboarding ? parseFloat(onboardingActivityFactorSelect.value) : parseFloat(document.getElementById('activity-factor').value);
        const targetDate = isFromOnboarding ? onboardingTargetDateInput.value : document.getElementById('target-date').value;
        const difficultyMode = isFromOnboarding ? onboardingDifficultyModeSelect.value : difficultyModeSelect.value;
        const manualRankValue = isFromOnboarding ? 0 : parseInt(manualCurrentRankInput.value); 

        if (!name || isNaN(age) || isNaN(height) || isNaN(initialWeight) || isNaN(targetWeight) || isNaN(activityFactor) || !targetDate) {
            if (!suppressAlert) alert('Ops! 🤠 Parece que tu esqueceu de preencher algo ou preencheu errado. Dá uma olhada nos campos destacados!');
            return false; 
        }

        const calculatedDailyCaloricNeeds = calculateDailyCaloricNeeds(initialWeight, height, age, gender, activityFactor);

        // Sempre recalcula as metas com base no perfil atualizado
        const baseTargetCalories = Math.round(calculatedDailyCaloricNeeds);
        const newTargetCalories = Math.round(baseTargetCalories * 0.80); 
        const newTargetProtein = Math.round((newTargetCalories * 0.40) / 4); 
        const newTargetCarbs = Math.round((newTargetCalories * 0.40) / 4);   
        const newTargetFats = Math.round((newTargetCalories * 0.20) / 9);     


        userProfile = {
            name, age, height, gender, initialWeight, targetWeight, activityFactor, targetDate, difficultyMode,
            dailyCaloricNeeds: Math.round(calculatedDailyCaloricNeeds), 
            targetCalories: newTargetCalories,    
            targetProtein: newTargetProtein,
            targetCarbs: newTargetCarbs,
            targetFats: newTargetFats
        };

        localStorage.setItem('userProfile', JSON.stringify(userProfile)); 
        
        if (weightHistory.length === 0) {
            addWeightEntry(initialWeight, getDateOnly(new Date()).toLocaleDateString('pt-BR'), false);
        }

        if (!isFromOnboarding && fromSettingsPage && !isNaN(manualRankValue) && manualRankValue >= 0 && manualRankValue !== currentStreak) {
            currentStreak = manualRankValue;
            localStorage.setItem('currentStreak', currentStreak);
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            updateCheckinStreakDisplay();
            updateUserRank();
            if (!suppressAlert) alert('Nível atual ajustado manualmente!');
        }

        recalculateDailyDataFromProfileAndStandards(); 

        if (!isFromOnboarding) {
            userNameSpan.textContent = userProfile.name;
            document.getElementById('name').value = userProfile.name;
            document.getElementById('age').value = userProfile.age;
            document.getElementById('height').value = userProfile.height;
            document.getElementById('gender').value = userProfile.gender;
            initialWeightSettingsInput.value = userProfile.initialWeight;
            document.getElementById('target-weight').value = userProfile.targetWeight;
            document.getElementById('activity-factor').value = userProfile.activityFactor;
            if (userProfile.targetDate) {
                targetDateInput.value = userProfile.targetDate;
            }
            populateDifficultyModeOptions(userProfile.gender);
            difficultyModeSelect.value = userProfile.difficultyMode || 'easy';
            manualCurrentRankInput.value = currentStreak;

            manualTargetCaloriesInput.value = userProfile.targetCalories;
            manualTargetProteinInput.value = userProfile.targetProtein;
            manualTargetCarbsInput.value = userProfile.targetCarbs;
            manualTargetFatsInput.value = userProfile.targetFats;
        }
        
        const finalOnboardingNameDisplay = document.getElementById('final-onboarding-name-display');
        if (finalOnboardingNameDisplay) {
            finalOnboardingNameDisplay.textContent = name;
        }

        updateProgressBars(); 
        updateWeightPrediction(); 
        updateCheckinVisibility();
        if (event && event.type === 'submit' && !suppressAlert && !isFromOnboarding) {
            alert('Perfil salvo e o app está pronto para uso!');
            showPage('home-page');
        } 
        return true; 
    }

    function saveManualTargets() {
        if (!userProfile) {
            alert('Primeiro, configure seu perfil antes de ajustar as metas.');
            return;
        }

        const protein = parseFloat(manualTargetProteinInput.value);
        const carbs = parseFloat(manualTargetCarbsInput.value);
        const fats = parseFloat(manualTargetFatsInput.value);

        if (isNaN(protein) || isNaN(carbs) || isNaN(fats) || protein < 0 || carbs < 0 || fats < 0) {
            alert('Por favor, insira valores válidos para Proteína, Carboidratos e Gorduras.');
            return;
        }

        const calculatedKcal = Math.round((protein * 4) + (carbs * 4) + (fats * 9));

        userProfile.targetProtein = protein;
        userProfile.targetCarbs = carbs;
        userProfile.targetFats = fats;
        userProfile.targetCalories = calculatedKcal; 

        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        updateProgressBars();
        alert('Metas ajustadas manualmente e Kcal recalculadas!');

        manualTargetCaloriesInput.value = calculatedKcal;
    }


    function updateProgressBars() {
        if (!userProfile) {
            caloriesNum.textContent = '0 / 0 Kcal';
            caloriesProgressBar.style.width = '0%';
            proteinNum.textContent = '0 / 0 g';
            proteinProgressBar.style.width = '0%';
            carbsNum.textContent = '0 / 0 g';
            carbsProgressBar.style.width = '0%';
            fatsNum.textContent = '0 / 0 g';
            fatsProgressBar.style.width = '0%';
            weightNum.textContent = '0 Kg / 0 Kg';
            weightProgressBar.style.width = '0%';
            weightRemainingText.textContent = '';
            weightLostGainedText.textContent = '';
            return;
        }

        const todayLocaleString = getDateOnly(new Date()).toLocaleDateString('pt-BR');
        if (dailyData.date !== todayLocaleString) {
             recalculateDailyDataFromProfileAndStandards();
        }

        let caloriesPercentage = (dailyData.consumedCalories / userProfile.targetCalories) * 100;
        caloriesPercentage = Math.min(caloriesPercentage, 100);
        caloriesProgressBar.style.width = `${caloriesPercentage}%`;
        caloriesProgressBar.classList.remove('red-bar', 'blue-bar'); 
        if (dailyData.consumedCalories > userProfile.targetCalories) {
            caloriesProgressBar.classList.add('red-bar');
        } else {
            caloriesProgressBar.classList.add('blue-bar');
        }
        caloriesNum.textContent = `${dailyData.consumedCalories} / ${userProfile.targetCalories} Kcal`;


        let proteinPercentage = (dailyData.consumedProtein / userProfile.targetProtein) * 100;
        proteinPercentage = Math.min(proteinPercentage, 100);
        proteinProgressBar.style.width = `${proteinPercentage}%`;
        proteinProgressBar.classList.remove('red-bar', 'blue-bar');
        if (dailyData.consumedProtein > userProfile.targetProtein) {
            proteinProgressBar.classList.add('red-bar');
        } else {
            proteinProgressBar.classList.add('blue-bar');
        }
        proteinNum.textContent = `${dailyData.consumedProtein.toFixed(1)} / ${userProfile.targetProtein} g`;


        let carbsPercentage = (dailyData.consumedCarbs / userProfile.targetCarbs) * 100;
        carbsPercentage = Math.min(carbsPercentage, 100);
        carbsProgressBar.style.width = `${carbsPercentage}%`;
        carbsProgressBar.classList.remove('red-bar', 'blue-bar');
        if (dailyData.consumedCarbs > userProfile.targetCarbs) {
            carbsProgressBar.classList.add('red-bar');
        } else {
            carbsProgressBar.classList.add('blue-bar');
        }
        carbsNum.textContent = `${dailyData.consumedCarbs.toFixed(1)} / ${userProfile.targetCarbs} g`;


        let fatsPercentage = (dailyData.consumedFats / userProfile.targetFats) * 100;
        fatsPercentage = Math.min(fatsPercentage, 100);
        fatsProgressBar.style.width = `${fatsPercentage}%`;
        fatsProgressBar.classList.remove('red-bar', 'blue-bar');
        if (dailyData.consumedFats > userProfile.targetFats) {
            fatsProgressBar.classList.add('red-bar');
        } else {
            fatsProgressBar.classList.add('blue-bar');
        }
        fatsNum.textContent = `${dailyData.consumedFats.toFixed(1)} / ${userProfile.targetFats} g`;


        const targetWeight = userProfile.targetWeight;
        let weightProgress;

        if (weightHistory.length > 0) {
            const lastRecordedWeight = weightHistory[weightHistory.length - 1].weight;
            const initialWeightForProgress = userProfile.initialWeight;

            const totalWeightChangeGoal = Math.abs(initialWeightForProgress - targetWeight);
            const currentWeightChange = Math.abs(initialWeightForProgress - lastRecordedWeight);

            if (totalWeightChangeGoal === 0) {
                weightProgress = 100;
                weightRemainingText.textContent = `Meta de peso é ${targetWeight.toFixed(1)} Kg.`;
                weightLostGainedText.textContent = '';
            } else {
                weightProgress = (currentWeightChange / totalWeightChangeGoal) * 100;
                weightProgress = Math.max(0, Math.min(weightProgress, 100));

                const remaining = Math.abs(lastRecordedWeight - targetWeight).toFixed(1);
                weightRemainingText.textContent = `Faltam ${remaining} Kg para atingir ${targetWeight.toFixed(1)} Kg!`;

                const weightDiff = lastRecordedWeight - initialWeightForProgress;
                if (weightDiff < 0) {
                    weightLostGainedText.textContent = `Você já perdeu ${Math.abs(weightDiff).toFixed(1)} Kg!`;
                } else if (weightDiff > 0) {
                    weightLostGainedText.textContent = `Você já ganhou ${weightDiff.toFixed(1)} Kg!`;
                } else {
                    weightLostGainedText.textContent = '';
                }
            }


            weightProgressBar.style.width = `${weightProgress}%`;
            weightProgressBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue');
            weightNum.textContent = `${lastRecordedWeight.toFixed(1)} Kg / ${targetWeight.toFixed(1)} Kg`;

        } else {
            weightNum.textContent = `${userProfile.initialWeight.toFixed(1)} Kg / ${targetWeight.toFixed(1)} Kg`;
            weightProgressBar.style.width = '0%';
            weightRemainingText.textContent = `Faltam ${Math.abs(userProfile.initialWeight - targetWeight).toFixed(1)} Kg para atingir sua meta.`;
            weightLostGainedText.textContent = '';
        }
    }

    function calculateExpectedWeight(initialWeight, targetWeight, initialDate, targetDate, currentDate) {
        initialDate = getDateOnly(initialDate);
        targetDate = getDateOnly(targetDate);
        currentDate = getDateOnly(currentDate);

        const totalDurationMs = targetDate.getTime() - initialDate.getTime();
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);

        if (totalDurationDays <= 0 || currentDate.getTime() < initialDate.getTime()) {
            return initialWeight;
        }

        const daysPassedSinceInitial = (currentDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysPassedSinceInitial > totalDurationDays) {
            return targetWeight;
        }

        const totalWeightDifference = targetWeight - initialWeight;
        const requiredChangePerDay = totalWeightDifference / totalDurationDays;

        return initialWeight + (requiredChangePerDay * daysPassedSinceInitial);
    }


    function updateWeightPrediction() {
        if (!userProfile || !userProfile.targetDate) { 
            weightPredictionText.textContent = 'Registre seu peso atual e defina a data final da meta para uma previsão.';
            dietFeedbackMessage.textContent = '';
            return;
        }

        const lastWeightEntry = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : { weight: userProfile.initialWeight };
        const initialWeight = userProfile.initialWeight;

        const initialDateForPrediction = weightHistory.length > 0 ? 
                                         parseDateString(weightHistory[0].date) : 
                                         getDateOnly(new Date(userProfile.targetDate)); 

        const targetWeight = userProfile.targetWeight;
        const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

        const today = getDateOnly(new Date());

        const totalDurationMs = targetDate.getTime() - initialDateForPrediction.getTime(); 
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);

        if (totalDurationDays <= 0) {
            if (Math.abs(lastWeightEntry.weight - targetWeight) < 0.1) {
                weightPredictionText.textContent = `Parabéns! Você atingiu sua meta de ${targetWeight.toFixed(1)} Kg!`;
            } else if (today > targetDate) {
                weightPredictionText.textContent = `A data da sua meta (${userProfile.targetDate}) já passou. Você terminou em ${lastWeightEntry.weight.toFixed(1)} Kg.`;
            } else {
                weightPredictionText.textContent = 'A data final da meta deve ser no futuro.';
            }
            dietFeedbackMessage.textContent = '';
            return;
        }

        const daysPassedSinceInitial = (today.getTime() - initialDateForPrediction.getTime()) / (1000 * 60 * 60 * 24);
        if (daysPassedSinceInitial < 0) {
            weightPredictionText.textContent = 'Aguardando o início da sua meta de peso.';
            dietFeedbackMessage.textContent = '';
            return;
        }

        const expectedWeightToday = calculateExpectedWeight(initialWeight, targetWeight, initialDateForPrediction, targetDate, today);

        let statusMessage = '';
        const deviation = lastWeightEntry.weight - expectedWeightToday;

        if (Math.abs(deviation) < 0.2) {
            statusMessage = `Você está no caminho certo! Seu peso atual (${lastWeightEntry.weight.toFixed(1)} Kg) está próximo do esperado (${expectedWeightToday.toFixed(1)} Kg).`;
        } else if (targetWeight > initialWeight) {
            if (deviation > 0) {
                statusMessage = `Você está adiantado na sua meta de ganho de peso! Atual: ${lastWeightEntry.weight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de ganho de peso. Atual: ${lastWeightEntry.weight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        } else {
            if (deviation < 0) {
                statusMessage = `Você está adiantado na sua meta de perda de peso! Atual: ${lastWeightEntry.weight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de perda de peso. Atual: ${lastWeightEntry.weight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        }
        weightPredictionText.textContent = statusMessage;

        if (weightHistory.length >= 2) {
            const currentWeight = lastWeightEntry.weight;
            
            let weight7DaysAgoEntry = null;
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            for (let i = weightHistory.length - 1; i >= 0; i--) {
                const entryDate = parseDateString(weightHistory[i].date);
                if (entryDate <= sevenDaysAgo) {
                    weight7DaysAgoEntry = weightHistory[i];
                    break;
                }
            }

            if (!weight7DaysAgoEntry) {
                weight7DaysAgoEntry = weightHistory[0];
            }

            if (weight7DaysAgoEntry) {
                const weight7DaysAgo = weight7DaysAgoEntry.weight;
                const weightChange = currentWeight - weight7DaysAgo;

                if (userProfile.targetWeight < initialWeight) {
                    if (weightChange >= -0.5) {
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        dietFeedbackMessage.textContent = 'Você registrou seu peso com sucesso. Você perdeu menos de 500g na última semana. Se você não seguiu o plano 100%, sugiro melhorar o foco nos próximos 7 dias para melhorar os resultados.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                    } else {
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        dietFeedbackMessage.textContent = 'Ótimo progresso! Continue assim.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                    }
                } else if (userProfile.targetWeight > initialWeight) {
                    if (weightChange <= 0.5) {
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        dietFeedbackMessage.textContent = 'Você ganhou menos de 500g na última semana. Considere aumentar as calorias se necessário.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                    } else {
                        dietFeedbackMessage.textContent = '';
                    }
                } else {
                    if (Math.abs(weightChange) >= 0.5) {
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        dietFeedbackMessage.textContent = 'Seu peso variou mais de 500g na última semana. Sugiro rever suas metas para manutenção.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                    } else {
                        dietFeedbackMessage.textContent = '';
                    }
                }
            } else {
                dietFeedbackMessage.textContent = '';
            }
        } else {
            dietFeedbackMessage.textContent = '';
        }
    }

    function checkWeeklyWeightProgress() {
        dietFeedbackMessage.textContent = '';

        if (!userProfile || weightHistory.length < 2) {
            return;
        }

        const today = getDateOnly(new Date());
        const lastRecordedWeightDate = parseDateString(weightHistory[weightHistory.length - 1].date);

        const daysSinceLastCheck = lastWeightCheckDate ?
            Math.floor((today.getTime() - getDateOnly(lastWeightCheckDate).getTime()) / (1000 * 60 * 60 * 24)) :
            7;

        if (daysSinceLastCheck >= 7) {
            let weight7DaysAgoEntry = null;
            const sevenDaysBeforeLastEntry = new Date(lastRecordedWeightDate);
            sevenDaysBeforeLastEntry.setDate(lastRecordedWeightDate.getDate() - 7);
            
            for (let i = weightHistory.length - 1; i >= 0; i--) {
                const entryDate = parseDateString(weightHistory[i].date);
                if (entryDate <= sevenDaysBeforeLastEntry) {
                    weight7DaysAgoEntry = weightHistory[i];
                    break;
                }
            }

            if (!weight7DaysAgoEntry) {
                weight7DaysAgoEntry = weightHistory[0];
            }

            if (!weight7DaysAgoEntry) {
                return;
            }

            const currentWeight = weightHistory[weightHistory.length - 1].weight;
            const weight7DaysAgo = weight7DaysAgoEntry.weight;
            const weightChange = currentWeight - weight7DaysAgo;

            if (userProfile.targetWeight < initialWeight) {
                if (weightChange >= -0.5) {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Você registrou seu peso com sucesso. Você perdeu menos de 500g na última semana, sugiro melhorar o foco nos próximos 7 dias para melhorar os resultados.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                } else {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Ótimo progresso! Continue assim.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                }
            } else if (userProfile.targetWeight > initialWeight) {
                if (weightChange <= 0.5) {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Você ganhou menos de 500g na última semana. Considere aumentar as calorias se necessário.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                } else {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Ótimo progresso! Continue assim.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                }
            } else {
                if (Math.abs(weightChange) >= 0.5) {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Seu peso variou mais de 500g na última semana. Sugiro rever suas metas para manutenção.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                } else {
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Mantenha o bom trabalho!';
                    dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                }
            }
        }
    }


    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }


    function renderMealGroups() {
        mealGroupsContainer.innerHTML = '';
        if (dailyData.mealGroups.length === 0) {
            mealGroupsContainer.innerHTML = '<p class="no-data-message">Nenhum grupo de refeição adicionado ainda. Clique em "Adicionar Grupo de Refeição".</p>';
            return;
        }

        dailyData.mealGroups.forEach((group, groupIndex) => {
            const mealGroupDiv = document.createElement('div');
            mealGroupDiv.classList.add('meal-group');
            mealGroupDiv.innerHTML = `
                <h4>
                    ${group.name}
                    <span class="meal-total-macros">Total: ${group.totalKcal} Kcal | P: ${group.totalProtein.toFixed(1)}g | C: ${group.totalCarbs.toFixed(1)}g | G: ${group.totalFats.toFixed(1)}g</span>
                    <button class="remove-meal-group-btn" data-group-index="${groupIndex}">X</button>
                </h4>
                <ul class="meal-items-list" id="meal-list-${groupIndex}">
                    ${group.foods.map((food, foodIndex) => `
                        <li class="meal-item">
                            <div class="meal-item-details">
                                ${food.name} (${food.quantity}g) ${food.isDailyStandard ? '<span class="daily-standard-tag">(Padrão Diário)</span>' : ''}
                                <span>${food.kcal} Kcal | P: ${food.protein.toFixed(1)}g | C: ${food.carbs.toFixed(1)}g | G: ${food.fats.toFixed(1)}g</span>
                            </div>
                            <div class="meal-item-actions">
                                <button class="toggle-daily-standard-btn" data-group-index="${groupIndex}" data-food-index="${foodIndex}">
                                    ${food.isDailyStandard ? 'Remover Padrão' : 'Definir Padrão'}
                                </button>
                                <button class="remove-food-item-btn" data-group-index="${groupIndex}" data-food-index="${foodIndex}">Remover</button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
                <form class="add-food-form" data-group-index="${groupIndex}">
                    <input type="text" class="food-search-input" placeholder="Buscar alimento..." list="food-suggestions-${groupIndex}">
                    <datalist id="food-suggestions-${groupIndex}"></datalist>
                    <input type="number" class="food-quantity" placeholder="Quantidade (g)" required>
                    <button type="submit">Adicionar Alimento</button>
                </form>
            `;
            mealGroupsContainer.appendChild(mealGroupDiv);
        });

        mealGroupsContainer.querySelectorAll('.remove-food-item-btn').forEach(button => {
            button.addEventListener('click', removeFoodItem);
        });

        mealGroupsContainer.querySelectorAll('.remove-meal-group-btn').forEach(button => {
            button.addEventListener('click', removeMealGroup);
        });

        mealGroupsContainer.querySelectorAll('.toggle-daily-standard-btn').forEach(button => {
            button.addEventListener('click', toggleDailyStandard);
        });

        mealGroupsContainer.querySelectorAll('.add-food-form').forEach(form => {
            form.addEventListener('submit', addFoodItem);
            const searchInput = form.querySelector('.food-search-input');
            const dataList = form.querySelector(`datalist#food-suggestions-${form.dataset.groupIndex}`);

            searchInput.addEventListener('input', () => handleFoodSearch(searchInput, dataList));
            searchInput.addEventListener('change', (e) => {
                const isValidFood = foodDatabase.some(food => normalizeString(food.name) === normalizeString(e.target.value));
                if (!isValidFood) {
                    e.target.value = '';
                }
            });
        });
    }

    function handleFoodSearch(inputElement, dataListElement) {
        const searchTerm = normalizeString(inputElement.value);
        dataListElement.innerHTML = '';

        if (searchTerm.length < 2) {
            return;
        }

        const filteredFoods = foodDatabase.filter(food =>
            normalizeString(food.name).includes(searchTerm)
        ).sort((a, b) => a.name.localeCompare(b.name));

        filteredFoods.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            dataListElement.appendChild(option);
        });
    }


    function renderCheckinHistory() {
        checkinHistoryList.innerHTML = '';
        checkinHistory = JSON.parse(localStorage.getItem('checkinHistory')) || [];
        if (checkinHistory.length === 0) {
            checkinHistoryList.innerHTML = '<p class="no-data-message">Nenhum check-in registrado ainda.</p>';
            return;
        }
        checkinHistory.slice(-7).reverse().forEach(entry => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${entry.date}:</strong>
                ${entry.sleep ? '😴' : ''}
                ${entry.workout ? '🏋️‍♂️' : ''}
                ${entry.diet ? '🥗' : ''}
                ${entry.nofap ? '🚫💦' : ''}
            `;
            checkinHistoryList.appendChild(listItem);
        });
    }

    function updateCheckinStreakDisplay() {
        document.getElementById('current-streak-display').textContent = currentStreak;
        document.getElementById('max-streak-display').textContent = maxStreak;
    }

    function getRankName(streak) {
        if (streak >= 30) return '🧘 Monge';
        if (streak === 29) return '🦁 Rei';
        if (streak === 28) return '🐺 General de Exército';
        if (streak === 27) return '🔥 Coronel';
        if (streak === 26) return '👑 Major';
        if (streak === 25) return '🌠 Capitão';
        if (streak === 24) return '🚀 Primeiro Tenente';
        if (streak >= 21 && streak <= 23) return '💎 Segundo Tenente';
        if (streak >= 16 && streak <= 20) return '✨ Aspirante a Oficial';
        if (streak >= 14 && streak <= 15) return '🌟 Subtenente';
        if (streak >= 11 && streak <= 13) return '🥇 Primeiro Sargento';
        if (streak >= 6 && streak <= 10) return '🥈 Segundo Sargento';
        if (streak >= 3 && streak <= 5) return '🥉 Terceiro Sargento';
        if (streak === 2) return '🛡️ Cabo';
        if (streak === 1) return '⚔️ Soldado';
        return 'Novato';
    }

    function updateUserRank() {
        userRankDisplay.textContent = getRankName(currentStreak);
        const currentRankName = getRankName(currentStreak);
        const highestRankOrder = [
            'Novato', '⚔️ Soldado', '🛡️ Cabo', '🥉 Terceiro Sargento', '🥈 Segundo Sargento',
            '🥇 Primeiro Sargento', '🌟 Subtenente', '✨ Aspirante a Oficial', '💎 Segundo Tenente',
            '🚀 Primeiro Tenente', '🌠 Capitão', '👑 Major', '🔥 Coronel', '🐺 General de Exército',
            '🦁 Rei', '🧘 Monge'
        ];
        const currentRankIndex = highestRankOrder.indexOf(currentRankName);
        const highestAchievedRankIndex = highestRankOrder.indexOf(highestAchievedRank);

        if (currentRankIndex > highestAchievedRankIndex) {
            highestAchievedRank = currentRankName;
            localStorage.setItem('highestAchievedRank', highestAchievedRank);
            updateHighestRankDisplay();
        }
    }

    function updateHighestRankDisplay() {
        highestRankDisplay.textContent = highestAchievedRank;
    }

    function parseDateString(dateString) {
        const parts = dateString.split('/');
        return getDateOnly(new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))));
    }

    function renderWeightHistory() {
        weightHistoryList.innerHTML = '';
        if (weightHistory.length === 0) {
            weightHistoryList.innerHTML = '<p class="no-data-message">Nenhum peso registrado ainda.</p>';
            return;
        }
        weightHistory.slice().reverse().forEach((entry, originalIndex) => {
            const listItem = document.createElement('li');
            const actualIndex = weightHistory.length - 1 - originalIndex;
            listItem.innerHTML = `
                <span>${entry.date}</span>
                <span>${entry.weight.toFixed(1)} Kg</span>
                <div class="weight-actions">
                    <button class="edit-weight-btn" data-index="${actualIndex}">Editar</button>
                    <button class="delete-weight-btn" data-index="${actualIndex}">Excluir</button>
                </div>
            `;
            weightHistoryList.appendChild(listItem);
        });

        weightHistoryList.querySelectorAll('.edit-weight-btn').forEach(button => {
            button.addEventListener('click', editWeightEntry);
        });
        weightHistoryList.querySelectorAll('.delete-weight-btn').forEach(button => {
            button.addEventListener('click', deleteWeightEntry);
        });
        updateWeightChart();
    }

    function renderPastMealsSummaries() {
        pastMealsList.innerHTML = '';
        if (pastDailySummaries.length === 0) {
            pastMealsList.innerHTML = '<p class="no-data-message">Nenhum histórico de refeições anteriores.</p>';
            return;
        }
        pastDailySummaries.forEach(summary => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${summary.date}:</strong> Kcal: ${summary.calories} | P: ${summary.protein.toFixed(1)}g | C: ${summary.carbs.toFixed(1)}g | G: ${summary.fats.toFixed(1)}g
            `;
            pastMealsList.appendChild(listItem);
        });
    }


    function renderCustomFoodList() {
        customFoodList.innerHTML = '';
        const customFoods = foodDatabase.filter(food => food.isCustom);

        if (customFoods.length === 0) {
            customFoodList.innerHTML = '<p class="no-data-message">Nenhum alimento personalizado adicionado.</p>';
            return;
        }

        customFoods.forEach((food, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="food-details">
                    <strong>${food.name}</strong>
                    <span>${food.kcalPer100g} Kcal | P: ${food.proteinPer100g}g | C: ${food.carbsPer100g}g | G: ${food.fatsPer100g}g</span>
                </div>
                <div class="food-actions">
                    <button class="edit-custom-food-btn" data-index="${foodDatabase.indexOf(food)}">Editar</button>
                    <button class="delete-custom-food-btn" data-index="${foodDatabase.indexOf(food)}">Excluir</button>
                </div>
            `;
            customFoodList.appendChild(listItem);
        });

        customFoodList.querySelectorAll('.edit-custom-food-btn').forEach(button => {
            button.addEventListener('click', editCustomFood);
        });

        customFoodList.querySelectorAll('.delete-custom-food-btn').forEach(button => {
            button.addEventListener('click', deleteCustomFood);
        });
    }

    function setupWeightChart() {
        if (weightChart) {
            weightChart.destroy();
        }

        const labels = weightHistory.map(entry => entry.date);
        const actualWeightData = weightHistory.map(entry => entry.weight);

        let expectedWeightData = [];
        if (userProfile && userProfile.targetDate) {
            const initialWeightForChart = userProfile.initialWeight;
            const initialDateForChart = weightHistory.length > 0 ? 
                                         parseDateString(weightHistory[0].date) : 
                                         getDateOnly(new Date(userProfile.targetDate)); 

            const targetWeight = userProfile.targetWeight;
            const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

            labels.forEach(labelDateStr => {
                const currentDate = parseDateString(labelDateStr);
                expectedWeightData.push(calculateExpectedWeight(initialWeightForChart, targetWeight, initialDateForChart, targetDate, currentDate));
            });
        }
        
        weightChart = new Chart(weightChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Peso Atual (Kg)',
                    data: actualWeightData,
                    borderColor: 'rgb(0, 123, 255)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    tension: 0.1,
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(0, 123, 255)'
                },
                {
                    label: 'Peso Esperado (Kg)',
                    data: expectedWeightData,
                    borderColor: 'rgb(230, 126, 34)',
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.1,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Data',
                            color: 'var(--text-light)'
                        },
                        ticks: {
                            color: 'var(--text-gray)'
                        },
                        grid: {
                            color: 'rgba(63, 74, 107, 0.3)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Peso (Kg)',
                            color: 'var(--text-light)'
                        },
                        ticks: {
                            color: 'var(--text-gray)'
                        },
                        grid: {
                            color: 'rgba(63, 74, 107, 0.3)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--text-light)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(1)} Kg`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateWeightChart() {
        if (weightChart) {
            weightChart.data.labels = weightHistory.map(entry => entry.date);
            weightChart.data.datasets[0].data = weightHistory.map(entry => entry.weight);

            let expectedWeightData = [];
            if (userProfile && userProfile.targetDate) {
                const initialWeightForChart = userProfile.initialWeight;
                const initialDateForChart = weightHistory.length > 0 ? 
                                             parseDateString(weightHistory[0].date) : 
                                             getDateOnly(new Date(userProfile.targetDate)); 

                const targetWeight = userProfile.targetWeight;
                const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

                weightChart.data.labels.forEach(labelDateStr => {
                    const currentDate = parseDateString(labelDateStr);
                    expectedWeightData.push(calculateExpectedWeight(initialWeightForChart, targetWeight, initialDateForChart, targetDate, currentDate));
                });

                if (weightChart.data.datasets.length > 1 && weightChart.data.datasets[1].label === 'Peso Esperado (Kg)') {
                    weightChart.data.datasets[1].data = expectedWeightData;
                } else {
                    weightChart.data.datasets.push({
                        label: 'Peso Esperado (Kg)',
                        data: expectedWeightData,
                        borderColor: 'rgb(230, 126, 34)',
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.1,
                        fill: false,
                        pointRadius: 0
                    });
                }
            } else {
                if (weightChart.data.datasets.length > 1 && weightChart.data.datasets[1].label === 'Peso Esperado (Kg)') {
                    weightChart.data.datasets.splice(1, 1);
                }
            }
            
            weightChart.update();
        } else {
            setupWeightChart();
        }
    }


    function showPage(pageId) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        navButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`nav-${pageId.replace('-page', '')}`).classList.add('active');

        if (pageId === 'weight-page') {
            renderWeightHistory();
            updateWeightPrediction();
            checkWeeklyWeightProgress();
            newWeightDateInput.valueAsDate = new Date();
        }
        if (pageId === 'settings-page') {
            renderUserProfile();
            renderCustomFoodList();
        }
        if (pageId === 'meals-page') {
            renderPastMealsSummaries();
        }
        if (pageId === 'checkin-page') {
            renderCheckinHistory();
            updateCheckinStreakDisplay();
            updateCheckinVisibility();
        }
        if (pageId !== 'home-page') {
            dietFeedbackMessage.textContent = '';
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.id.replace('nav-', '') + '-page';
            showPage(pageId);
        });
    });

    profileForm.addEventListener('submit', (event) => saveProfile(event, false, true));

    if (saveManualTargetsBtn) { 
        saveManualTargetsBtn.addEventListener('click', saveManualTargets);
    }

    if (manualTargetProteinInput) { manualTargetProteinInput.addEventListener('input', () => {
        const protein = parseFloat(manualTargetProteinInput.value) || 0;
        const carbs = parseFloat(manualTargetCarbsInput.value) || 0;
        const fats = parseFloat(manualTargetFatsInput.value) || 0;
        manualTargetCaloriesInput.value = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    });}
    if (manualTargetCarbsInput) { manualTargetCarbsInput.addEventListener('input', () => {
        const protein = parseFloat(manualTargetProteinInput.value) || 0;
        const carbs = parseFloat(manualTargetCarbsInput.value) || 0;
        const fats = parseFloat(manualTargetFatsInput.value) || 0;
        manualTargetCaloriesInput.value = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    });}
    if (manualTargetFatsInput) { manualTargetFatsInput.addEventListener('input', () => {
        const protein = parseFloat(manualTargetProteinInput.value) || 0;
        const carbs = parseFloat(manualTargetCarbsInput.value) || 0;
        const fats = parseFloat(manualTargetFatsInput.value) || 0;
        manualTargetCaloriesInput.value = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    });}

    if (toggleAddCustomFoodBtn) {
        toggleAddCustomFoodBtn.addEventListener('click', () => {
            if (addCustomFoodSection.style.display === 'none' || addCustomFoodSection.style.display === '') {
                addCustomFoodSection.style.display = 'block';
                toggleAddCustomFoodBtn.textContent = 'Esconder Formulário de Alimento';
            } else {
                addCustomFoodSection.style.display = 'none';
                toggleAddCustomFoodBtn.textContent = 'Alimentos Personalizados';
            }
        });
    }

    if (toggleAdjustTargetsBtn) {
        toggleAdjustTargetsBtn.addEventListener('click', () => {
            if (adjustTargetsSection.style.display === 'none' || adjustTargetsSection.style.display === '') {
                adjustTargetsSection.style.display = 'block';
                toggleAdjustTargetsBtn.textContent = 'Esconder Ajuste de Metas';
                if (userProfile) {
                    manualTargetCaloriesInput.value = userProfile.targetCalories;
                    manualTargetProteinInput.value = userProfile.targetProtein;
                    manualTargetCarbsInput.value = userProfile.targetCarbs;
                    manualTargetFatsInput.value = userProfile.targetFats;
                }
            } else {
                adjustTargetsSection.style.display = 'none';
                toggleAdjustTargetsBtn.textContent = 'Ajustar Metas Manualmente';
            }
        });
    }

    addMealGroupBtn.addEventListener('click', () => {
        const mealGroupName = prompt('Qual o nome do grupo de refeição? (Ex: Café da Manhã)');
        if (mealGroupName) {
            const newGroup = {
                name: mealGroupName,
                foods: [],
                totalKcal: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0
            };
            dailyData.mealGroups.push(newGroup);
            storedMealGroups.push(newGroup);

            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            localStorage.setItem('storedMealGroups', JSON.stringify(storedMealGroups));
            renderMealGroups();
        }
    });

    function addFoodItem(event) {
        event.preventDefault();
        const form = event.target;
        const groupIndex = parseInt(form.dataset.groupIndex);
        const foodName = form.querySelector('.food-search-input').value.trim();
        const quantity = parseFloat(form.querySelector('.food-quantity').value);

        if (!foodName || isNaN(quantity) || quantity <= 0) {
            alert('Por favor, digite o nome de um alimento, selecione-o e insira uma quantidade válida.');
            return;
        }

        const foodInfo = foodDatabase.find(food => normalizeString(food.name) === normalizeString(foodName));
        if (foodInfo) {
            const factor = quantity / 100;
            const kcal = Math.round(foodInfo.kcalPer100g * factor);
            const protein = parseFloat((foodInfo.proteinPer100g * factor).toFixed(1));
            const carbs = parseFloat((foodInfo.carbsPer100g * factor).toFixed(1));
            const fats = parseFloat((foodInfo.fatsPer100g * factor).toFixed(1));

            const newFoodItem = {
                name: foodInfo.name,
                quantity,
                kcal,
                protein,
                carbs,
                fats,
                isDailyStandard: false
            };

            dailyData.mealGroups[groupIndex].foods.push(newFoodItem);

            dailyData.mealGroups[groupIndex].totalKcal += kcal;
            dailyData.mealGroups[groupIndex].totalProtein += protein;
            dailyData.mealGroups[groupIndex].totalCarbs += carbs;
            dailyData.mealGroups[groupIndex].totalFats += fats;

            dailyData.consumedCalories += kcal;
            dailyData.consumedProtein += protein;
            dailyData.consumedCarbs += carbs;
            dailyData.consumedFats += fats;

            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            renderMealGroups();
            updateProgressBars();
            form.reset();
        } else {
            alert('Alimento não encontrado no banco de dados. Verifique a ortografia ou adicione-o na aba de Configurações.');
        }
    }

    function removeFoodItem(event) {
        const groupIndex = parseInt(event.target.dataset.groupIndex);
        const foodIndex = parseInt(event.target.dataset.foodIndex);

        const foodToRemove = dailyData.mealGroups[groupIndex].foods[foodIndex];

        if (foodToRemove.isDailyStandard) {
            const storedGroup = storedMealGroups.find(g => g.name === dailyData.mealGroups[groupIndex].name);
            if (storedGroup) {
                const indexInStoredGroup = storedGroup.foods.findIndex(food =>
                    food.name === foodToRemove.name &&
                    food.quantity === foodToRemove.quantity &&
                    food.kcal === foodToRemove.kcal &&
                    food.protein === foodToRemove.protein &&
                    food.carbs === foodToRemove.carbs &&
                    food.fats === foodToRemove.fats
                );
                if (indexInStoredGroup !== -1) {
                    storedGroup.foods.splice(indexInStoredGroup, 1);
                    recalculateGroupTotals(storedGroup);
                    localStorage.setItem('storedMealGroups', JSON.stringify(storedMealGroups));
                }
            }
        }

        dailyData.consumedCalories -= foodToRemove.kcal;
        dailyData.consumedProtein -= foodToRemove.protein;
        dailyData.consumedCarbs -= foodToRemove.carbs;
        dailyData.consumedFats -= foodToRemove.fats;

        dailyData.mealGroups[groupIndex].totalKcal -= foodToRemove.kcal;
        dailyData.mealGroups[groupIndex].totalProtein -= foodToRemove.protein;
        dailyData.mealGroups[groupIndex].totalCarbs -= foodToRemove.carbs;
        dailyData.mealGroups[groupIndex].totalFats -= foodToRemove.fats;

        dailyData.mealGroups[groupIndex].foods.splice(foodIndex, 1);

        if (dailyData.mealGroups[groupIndex].foods.length === 0) {
            dailyData.mealGroups[groupIndex].totalKcal = 0;
            dailyData.mealGroups[groupIndex].totalProtein = 0;
            dailyData.mealGroups[groupIndex].totalCarbs = 0;
            dailyData.mealGroups[groupIndex].totalFats = 0;
        }

        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        renderMealGroups();
        updateProgressBars();
    }

    function removeMealGroup(event) {
        const groupIndex = parseInt(event.target.dataset.groupIndex);
        const groupToRemoveName = dailyData.mealGroups[groupIndex].name;

        if (confirm(`Tem certeza que deseja remover o grupo de refeição "${groupToRemoveName}"? Todos os alimentos dentro dele também serão removidos permanentemente.`)) {
            const groupToRemove = dailyData.mealGroups[groupIndex];

            dailyData.consumedCalories -= groupToRemove.totalKcal;
            dailyData.consumedProtein -= groupToRemove.totalProtein;
            dailyData.consumedCarbs -= groupToRemove.totalCarbs;
            dailyData.consumedFats -= groupToRemove.totalFats;

            dailyData.mealGroups.splice(groupIndex, 1);

            storedMealGroups = storedMealGroups.filter(group => group.name !== groupToRemoveName);

            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            localStorage.setItem('storedMealGroups', JSON.stringify(storedMealGroups));
            renderMealGroups();
            updateProgressBars();
            alert('Grupo de refeição removido.');
        }
    }

    function toggleDailyStandard(event) {
        const groupIndex = parseInt(event.target.dataset.groupIndex);
        const foodIndex = parseInt(event.target.dataset.foodIndex);

        const foodItem = dailyData.mealGroups[groupIndex].foods[foodIndex];
        foodItem.isDailyStandard = !foodItem.isDailyStandard;

        const storedGroup = storedMealGroups.find(g => g.name === dailyData.mealGroups[groupIndex].name);

        if (storedGroup) {
            storedGroup.foods = storedGroup.foods.filter(food =>
                !(food.name === foodItem.name &&
                  food.quantity === foodItem.quantity &&
                  food.kcal === foodItem.kcal &&
                  food.protein === foodItem.protein &&
                  food.carbs === foodItem.carbs &&
                  food.fats === foodItem.fats)
            );

            if (foodItem.isDailyStandard) {
                const clonedFood = JSON.parse(JSON.stringify(foodItem));
                storedGroup.foods.push(clonedFood);
            }
            recalculateGroupTotals(storedGroup);
        } else {
            const newStoredGroup = {
                name: dailyData.mealGroups[groupIndex].name,
                foods: foodItem.isDailyStandard ? [JSON.parse(JSON.stringify(foodItem))] : [],
                totalKcal: foodItem.isDailyStandard ? foodItem.kcal : 0,
                totalProtein: foodItem.isDailyStandard ? foodItem.protein : 0,
                totalCarbs: foodItem.isDailyStandard ? foodItem.carbs : 0,
                totalFats: foodItem.isDailyStandard ? foodItem.fats : 0,
            };
            storedMealGroups.push(newStoredGroup);
        }

        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        localStorage.setItem('storedMealGroups', JSON.stringify(storedMealGroups));
        renderMealGroups();
    }

    function recalculateGroupTotals(group) {
        group.totalKcal = 0;
        group.totalProtein = 0;
        group.totalCarbs = 0;
        group.totalFats = 0;
        group.foods.forEach(food => {
            group.totalKcal += food.kcal;
            group.totalProtein += food.protein;
            group.totalCarbs += food.carbs;
            group.totalFats += food.fats;
        });
    }

    function updateCheckinVisibility() {
        if (!userProfile) {
            checkinSleep.style.display = 'none';
            checkinWorkout.style.display = 'none';
            checkinDiet.style.display = 'none';
            checkinNofap.style.display = 'none';
            return;
        }

        const mode = userProfile.difficultyMode;
        const gender = userProfile.gender;

        checkinSleep.style.display = 'flex';
        checkinDiet.style.display = 'flex'; 

        if (mode === 'easy') {
            checkinWorkout.style.display = 'none';
            checkinNofap.style.display = 'none';
        } else if (mode === 'hard') {
            checkinWorkout.style.display = 'flex';
            checkinNofap.style.display = 'none';
        } else if (mode === 'god' && gender === 'male') {
            checkinWorkout.style.display = 'flex';
            checkinNofap.style.display = 'flex';
        } else { 
            checkinWorkout.style.display = 'none';
            checkinNofap.style.display = 'none';
        }
    }


    saveCheckinBtn.addEventListener('click', () => {
        const today = getDateOnly(new Date());
        const todayLocaleString = today.toLocaleDateString('pt-BR');

        const sleepChecked = document.getElementById('check-sleep').checked;
        const workoutChecked = document.getElementById('check-workout').checked;
        const dietChecked = document.getElementById('check-diet').checked;
        const nofapChecked = document.getElementById('check-nofap').checked;

        const currentCheckinState = {
            sleep: sleepChecked,
            workout: workoutChecked,
            diet: dietChecked,
            nofap: nofapChecked,
        };

        let allRequiredChecked = true;
        if (userProfile) {
            const mode = userProfile.difficultyMode;
            const gender = userProfile.gender;
            if (mode === 'easy') {
                allRequiredChecked = sleepChecked && dietChecked;
            } else if (mode === 'hard') {
                allRequiredChecked = sleepChecked && workoutChecked && dietChecked;
            } else if (mode === 'god' && gender === 'male') {
                allRequiredChecked = sleepChecked && workoutChecked && dietChecked && nofapChecked;
            } else if (mode === 'god' && gender === 'female') {
                allRequiredChecked = sleepChecked && workoutChecked && dietChecked; 
            } else {
                allRequiredChecked = sleepChecked && dietChecked; 
            }
        } else {
            allRequiredChecked = sleepChecked && dietChecked; 
        }

        const existingCheckinEntryIndex = checkinHistory.findIndex(entry => entry.date === todayLocaleString);
        
        let lastSuccessfulCheckinDay = null;
        if (lastSuccessfulCheckinDate) {
            lastSuccessfulCheckinDay = getDateOnly(new Date(lastSuccessfulCheckinDate));
        }

        if (allRequiredChecked) {
            if (lastSuccessfulCheckinDay) {
                const diffDays = Math.round((today.getTime() - lastSuccessfulCheckinDay.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) { 
                    currentStreak++;
                } else if (diffDays > 1) { 
                    currentStreak = 1;
                } else { 
                }
            } else { 
                currentStreak = 1;
            }
            lastSuccessfulCheckinDate = today.toISOString();
        } else {
            if (existingCheckinEntryIndex !== -1) {
                const previousState = checkinHistory[existingCheckinEntryIndex];
                let wasPreviouslyAllRequiredChecked = false;
                 if (userProfile) {
                    const mode = userProfile.difficultyMode;
                    const gender = userProfile.gender;
                    if (mode === 'easy') {
                        wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.diet;
                    } else if (mode === 'hard') {
                        wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.workout && previousState.diet;
                    } else if (mode === 'god' && gender === 'male') {
                        wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.workout && previousState.diet && previousState.nofap;
                    } else if (mode === 'god' && gender === 'female') {
                        wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.workout && previousState.diet;
                    }
                } else {
                    wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.diet;
                }

                if (wasPreviouslyAllRequiredChecked && !allRequiredChecked) {
                    currentStreak = 0;
                    localStorage.removeItem('lastSuccessfulCheckinDate');
                }
            } else if (currentStreak > 0 && lastSuccessfulCheckinDay && Math.round((today.getTime() - lastSuccessfulCheckinDay.getTime()) / (1000 * 60 * 60 * 24)) === 0) {
                currentStreak = 0;
                localStorage.removeItem('lastSuccessfulCheckinDate');
            }
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        localStorage.setItem('currentStreak', currentStreak);
        localStorage.setItem('maxStreak', maxStreak);
        if (lastSuccessfulCheckinDate) {
            localStorage.setItem('lastSuccessfulCheckinDate', lastSuccessfulCheckinDate);
        } else {
            localStorage.removeItem('lastSuccessfulCheckinDate');
        }


        if (existingCheckinEntryIndex !== -1) {
            checkinHistory[existingCheckinEntryIndex] = { date: todayLocaleString, ...currentCheckinState };
        } else {
            checkinHistory.push({ date: todayLocaleString, ...currentCheckinState });
        }
        checkinHistory.sort((a,b) => {
            const dateA = parseDateString(a.date);
            const dateB = parseDateString(b.date);
            return dateA.getTime() - dateB.getTime();
        });
        localStorage.setItem('checkinHistory', JSON.stringify(checkinHistory));
        localStorage.setItem('currentDayCheckinState', JSON.stringify(currentCheckinState));

        renderCheckinHistory();
        updateCheckinStreakDisplay();
        updateUserRank();
        alert('Check-in salvo!');
    });


    addWeightEntryBtn.addEventListener('click', () => {
        const weight = parseFloat(newCurrentWeightInput.value);
        const date = newWeightDateInput.value; 

        if (isNaN(weight) || weight <= 0) {
            alert('Por favor, insira um peso válido.');
            return;
        }
        if (!date) {
            alert('Por favor, selecione uma data para o registro de peso.');
            return;
        }

        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        
        addWeightEntry(weight, formattedDate, true);
        newCurrentWeightInput.value = '';
        newWeightDateInput.valueAsDate = new Date(); 
    });

    function addWeightEntry(weight, date, showAlert = true) {
        const existingEntryIndex = weightHistory.findIndex(entry => entry.date === date);

        if (existingEntryIndex !== -1) {
            const oldWeight = weightHistory[existingEntryIndex].weight;
            weightHistory[existingEntryIndex].weight = parseFloat(weight.toFixed(1));
            weightHistory.sort((a, b) => {
                const dateA = parseDateString(a.date);
                const dateB = parseDateString(b.date);
                return dateA.getTime() - dateB.getTime();
            });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

            if (showAlert) {
                alert(`Registro de peso para ${date} atualizado de ${oldWeight.toFixed(1)} Kg para ${weight.toFixed(1)} Kg.`);
            }
        } else {
            weightHistory.push({ date: date, weight: parseFloat(weight.toFixed(1)) });
            weightHistory.sort((a, b) => {
                const dateA = parseDateString(a.date);
                const dateB = parseDateString(b.date);
                return dateA.getTime() - dateB.getTime();
            });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
            if (showAlert) {
                alert('Peso registrado com sucesso!');
            }
        }

        renderWeightHistory();
        updateProgressBars();
        updateWeightPrediction();
        checkWeeklyWeightProgress();
    }


    function editWeightEntry(event) {
        const index = parseInt(event.target.dataset.index);
        const entryToEdit = weightHistory[index];

        const newWeight = prompt(`Editar peso para ${entryToEdit.weight} Kg (Data: ${entryToEdit.date}). Insira o novo peso:`, entryToEdit.weight);
        if (newWeight === null) return;
        const parsedNewWeight = parseFloat(newWeight);
        if (isNaN(parsedNewWeight) || parsedNewWeight <= 0) {
            alert('Por favor, insira um peso válido.');
            return;
        }

        const newDate = prompt(`Editar data para ${entryToEdit.date} (Peso: ${entryToEdit.weight} Kg). Insira a nova data (DD/MM/AAAA):`, entryToEdit.date);
        if (newDate === null) return;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(newDate.trim())) {
            alert('Por favor, insira a data no formato DD/MM/AAAA.');
            return;
        }
        const formattedNewDate = newDate.trim();


        const duplicateIndex = weightHistory.findIndex((entry, i) =>
            i !== index && entry.date === formattedNewDate && entry.weight === parseFloat(parsedNewWeight.toFixed(1))
        );
        if (duplicateIndex !== -1) {
            alert('Já existe um registro de peso com essa data e peso. Por favor, ajuste os valores.');
            return;
        }


        entryToEdit.weight = parseFloat(parsedNewWeight.toFixed(1));
        entryToEdit.date = formattedNewDate;

        weightHistory.sort((a, b) => {
            const dateA = parseDateString(a.date);
            const dateB = parseDateString(b.date);
            return dateA.getTime() - dateB.getTime();
        });

        localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

        renderWeightHistory();
        updateProgressBars();
        updateWeightPrediction();
        checkWeeklyWeightProgress();
        alert('Peso atualizado com sucesso!');
    }

    function deleteWeightEntry(event) {
        const index = parseInt(event.target.dataset.index);
        if (confirm(`Tem certeza que deseja excluir o registro de peso de ${weightHistory[index].weight} Kg em ${weightHistory[index].date}?`)) {
            weightHistory.splice(index, 1);
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

            renderWeightHistory();
            updateProgressBars();
            updateWeightPrediction();
            checkWeeklyWeightProgress();
            alert('Registro de peso excluído.');
        }
    }


    addCustomFoodForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const customFoodName = document.getElementById('custom-food-name').value.trim();
        const customFoodKcal = parseFloat(document.getElementById('custom-food-kcal').value);
        const customFoodProtein = parseFloat(document.getElementById('custom-food-protein').value);
        const customFoodCarbs = parseFloat(document.getElementById('custom-food-carbs').value);
        const customFoodFats = parseFloat(document.getElementById('custom-food-fats').value);

        if (!customFoodName || isNaN(customFoodKcal) || isNaN(customFoodProtein) || isNaN(customFoodCarbs) || isNaN(customFoodFats) || customFoodKcal < 0 || customFoodProtein < 0 || customFoodCarbs < 0 || customFoodFats < 0) {
            alert('Por favor, preencha todos os campos do alimento personalizado com valores válidos.');
            return;
        }

        const existingFood = foodDatabase.find(food => normalizeString(food.name) === normalizeString(customFoodName));
        if (existingFood) {
            alert('Um alimento com este nome já existe no banco de dados. Use um nome diferente.');
            return;
        }

        foodDatabase.push({
            name: customFoodName,
            kcalPer100g: customFoodKcal,
            proteinPer100g: customFoodProtein,
            carbsPer100g: customFoodCarbs,
            fatsPer100g: customFoodFats,
            isCustom: true
        });
        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
        renderMealGroups();
        renderCustomFoodList();
        addCustomFoodForm.reset();
        alert(`Alimento "${customFoodName}" adicionado com sucesso!`);
    });

    function editCustomFood(event) {
        const index = parseInt(event.target.dataset.index);
        const foodToEdit = foodDatabase[index];

        const newName = prompt(`Editar nome de "${foodToEdit.name}". Novo nome:`, foodToEdit.name);
        if (newName === null || newName.trim() === '') return;

        const newKcal = prompt(`Editar Kcal de "${foodToEdit.name}" (${foodToEdit.kcalPer100g} Kcal/100g). Novas Kcal:`, foodToEdit.kcalPer100g);
        if (newKcal === null || isNaN(parseFloat(newKcal)) || parseFloat(newKcal) < 0) return alert('Kcal inválidas.');

        const newProtein = prompt(`Editar Proteína de "${foodToEdit.name}" (${foodToEdit.proteinPer100g}g/100g). Nova Proteína:`, foodToEdit.proteinPer100g);
        if (newProtein === null || isNaN(parseFloat(newProtein)) || parseFloat(newProtein) < 0) return alert('Proteína inválida.');

        const newCarbs = prompt(`Editar Carboidratos de "${foodToEdit.name}" (${foodToEdit.carbsPer100g}g/100g). Novos Carboidratos:`, foodToEdit.carbsPer100g);
        if (newCarbs === null || isNaN(parseFloat(newCarbs)) || parseFloat(newCarbs) < 0) return alert('Carboidratos inválidos.');

        const newFats = prompt(`Editar Gorduras de "${foodToEdit.name}" (${foodToEdit.fatsPer100g}g/100g). Novas Gorduras:`, foodToEdit.fatsPer100g);
        if (newFats === null || isNaN(parseFloat(newFats)) || parseFloat(newFats) < 0) return alert('Gorduras inválidas.');

        const existingFoodWithNewName = foodDatabase.find((food, i) => i !== index && normalizeString(food.name) === normalizeString(newName));
        if (existingFoodWithNewName) {
            alert('Já existe um alimento com este novo nome. Por favor, escolha um nome diferente.');
            return;
        }

        foodToEdit.name = newName.trim();
        foodToEdit.kcalPer100g = parseFloat(newKcal);
        foodToEdit.proteinPer100g = parseFloat(newProtein);
        foodToEdit.carbsPer100g = parseFloat(newCarbs);
        foodToEdit.fatsPer100g = parseFloat(newFats);

        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
        renderCustomFoodList();
        renderMealGroups();
        alert(`Alimento "${foodToEdit.name}" atualizado com sucesso!`);
    };

    function deleteCustomFood(event) {
        const index = parseInt(event.target.dataset.index);
        const foodToDelete = foodDatabase[index];

        if (!foodToDelete.isCustom) {
            alert('Você não pode excluir alimentos padrão do sistema.');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir o alimento personalizado "${foodToDelete.name}"?`)) {
            foodDatabase.splice(index, 1);
            localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
            renderCustomFoodList();
            renderMealGroups();
            alert('Alimento personalizado excluído.');
        }
    }


    checkinCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const animationDiv = event.target.closest('.checkin-item').querySelector('.check-animation');
            if (event.target.checked) {
                animationDiv.textContent = '🎉';
                animationDiv.style.opacity = '1';
                animationDiv.style.transform = 'scale(1)';
            } else {
                animationDiv.style.opacity = '0';
                animationDiv.style.transform = 'scale(0)';
                animationDiv.textContent = '';
            }
        });
    });

    showAllRanksBtn.addEventListener('click', () => {
        allRanksList.classList.toggle('visible');
        if (allRanksList.classList.contains('visible')) {
            showAllRanksBtn.textContent = 'Esconder Níveis';
        } else {
            showAllRanksBtn.textContent = 'Mostrar Todos os Níveis';
        }
    });

    helpDifficultyModeBtn.addEventListener('click', () => {
        let helpText =
            'O Modo de Dificuldade define quais itens do Check-in diário são obrigatórios para você manter ou avançar sua sequência de dias de foco:\n\n' +
            'Fácil (Dieta): Você precisa apenas registrar que Dormiu bem e que fez a Dieta corretamente.\n\n' +
            'Hard (Dieta e Treino): Além de Dormir bem e fazer a Dieta corretamente, você também precisa registrar que Fez o treino.\n\n';
        
        if (onboardingGenderSelect.value === 'male' || (userProfile && userProfile.gender === 'male')) { 
            helpText += 'God (Dieta, Treino e NoFap): Para este modo, todos os itens (Dormiu bem, Fez o treino, Dieta corretamente e NoFap firme?) são obrigatórios para o avanço de nível. Escolha este modo para o desafio máximo!';
        }
        alert(helpText);
    });

    helpManualRankBtn.addEventListener('click', () => { 
        alert('Aqui você pode ajustar manualmente o seu "Nível Atual" (dias de foco). Digite o número de dias que você já está focado para definir seu nível inicial ou corrigir sua sequência. Isso afetará seu progresso de rank.');
    });

    helpTargetDateBtn.addEventListener('click', () => {
        alert('A "Data Final da Meta de Peso" é crucial! Ela é usada para projetar um gráfico de peso esperado que você deve seguir para atingir seu objetivo. Para um bom progresso, seu peso atual no gráfico deve sempre estar abaixo (para perda de peso) ou acima (para ganho de peso) da linha do peso esperado. É o seu guia visual para o sucesso!');
    });

    nextStepBtn.addEventListener('click', () => {
        if (!validateOnboardingStep(currentStepIndex)) {
            return;
        }

        if (currentStepIndex === -1) { // Se estiver na tela de boas-vindas
            currentStepIndex = 0; // Vai para a primeira etapa do formulário
            showOnboardingStep(currentStepIndex);
        } else if (currentStepIndex < onboardingSteps.length - 1) {
            currentStepIndex++;
            showOnboardingStep(currentStepIndex);
        } else {
            if (saveProfile(null, false, false, true)) { 
                localStorage.setItem('isFirstTimeUser', 'false'); 
                onboardingScreen.style.display = 'none'; 
                showPage('home-page');
                const userName = userProfile ? userProfile.name : 'Campeão';
                alert(`Tudo pronto, ${userName}! Agora você está pronto para dominar o jogo!`);
            }
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            showOnboardingStep(currentStepIndex);
        } else if (currentStepIndex === 0) { 
            showOnboardingStep('welcome'); 
        }
    });

    function showOnboardingStep(stepIdentifier) {
        if (stepIdentifier === 'welcome') {
            onboardingWelcomeScreen.classList.add('active'); 
            onboardingSteps.forEach(step => {
                if (step.id !== 'welcome-step') {
                    step.classList.remove('active');
                }
            });
            prevStepBtn.style.display = 'none'; 
            nextStepBtn.textContent = 'Próximo'; 
            currentStepIndex = -1; 
            return;
        }

        let index = typeof stepIdentifier === 'number' ? stepIdentifier : 0; 
        
        onboardingSteps.forEach((step, idx) => {
            step.classList.remove('active'); 
            if (idx === index) {
                step.classList.add('active'); 
            }
        });
        currentStepIndex = index;

        prevStepBtn.style.display = (currentStepIndex === 0) ? 'none' : 'block';
        nextStepBtn.textContent = (currentStepIndex === onboardingSteps.length - 1) ? 'Finalizar' : 'Próximo';
        
        if (currentStepIndex !== -1) { 
            onboardingWelcomeScreen.classList.remove('active');
        }

        if (currentStepIndex === onboardingSteps.length -1) {
            const finalOnboardingNameDisplay = document.getElementById('final-onboarding-name-display');
            if (finalOnboardingNameDisplay && onboardingNameInput.value) {
                finalOnboardingNameDisplay.textContent = onboardingNameInput.value;
            }
        }
    }

    function validateOnboardingStep(stepIndex) {
        let isValid = true;
        
        if (stepIndex === -1) { 
            return true;
        }

        const currentStep = onboardingSteps[stepIndex];
        const inputs = currentStep.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            if (input.type === 'number' && (isNaN(parseFloat(input.value)) || parseFloat(input.value) <= 0)) {
                isValid = false;
                input.classList.add('invalid');
            } else if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });

        if (!isValid) {
            alert('Ops! 🤠 Parece que tu esqueceu de preencher algo ou preencheu errado. Dá uma olhada nos campos destacados!');
        }
        return isValid;
    }

    const initialTargetDate = new Date();
    initialTargetDate.setMonth(initialTargetDate.getMonth() + 3);
    const formattedInitialTargetDate = initialTargetDate.toISOString().split('T')[0];
    onboardingTargetDateInput.value = formattedInitialTargetDate;

    if (onboardingGenderSelect) {
        onboardingGenderSelect.value = 'male'; 
        populateDifficultyModeOptions('male'); 
    }

    initApp(); 
});