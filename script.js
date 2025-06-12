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
    const carbsNum = document = document.getElementById('carbs-num');
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

    // Difficulty Mode
    const difficultyModeSelect = document.getElementById('difficulty-mode');
    const checkinSleep = document.querySelector('.checkin-sleep');
    const checkinWorkout = document.querySelector('.checkin-workout');
    const checkinDiet = document.querySelector('.checkin-diet');
    const checkinNofap = document.querySelector('.checkin-nofap');
    const helpDifficultyModeBtn = document.getElementById('help-difficulty-mode');

    // Manual Rank Adjustment
    const manualCurrentRankInput = document.getElementById('manual-current-rank');


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
    let defaultFoods = [
        // NOVAS ADIÇÕES
        { name: 'Whey Protein Growth (Concentrado)', kcalPer100g: 380, proteinPer100g: 75, carbsPer100g: 8, fatsPer100g: 5, isCustom: false },
        { name: 'Leite Integral', kcalPer100g: 60, proteinPer100g: 3.2, carbsPer100g: 4.7, fatsPer100g: 3.3, isCustom: false },
        { name: 'Leite Desnatado', kcalPer100g: 35, proteinPer100g: 3.4, carbsPer100g: 5, fatsPer100g: 0.5, isCustom: false },
        // Carnes
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
        // Frutas
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
        // Vegetais
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
        // Proteins (existing ones)
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
        // Carbohydrates
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
        // Fats and Others
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
        renderPastMealsSummaries();
        checkWeeklyWeightProgress();
        setupWeightChart();
        updateCheckinStreakDisplay();
        updateUserRank();
        updateHighestRankDisplay();
        updateCheckinVisibility();
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

            // Streak continuity check based on lastSuccessfulCheckinDate
            if (lastSuccessfulCheckinDate) {
                const lastCheckinDay = new Date(lastSuccessfulCheckinDate);
                lastCheckinDay.setHours(0, 0, 0, 0);

                const diffTime = today.getTime() - lastCheckinDay.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    currentStreak = 0;
                    console.log("Streak resetado devido a falha na continuidade.");
                }
            } else {
                currentStreak = 0;
            }
            localStorage.setItem('currentStreak', currentStreak);

            // ONLY reset consumed macros and non-daily foods in meal groups
            dailyData.consumedCalories = 0;
            dailyData.consumedProtein = 0;
            dailyData.consumedCarbs = 0;
            dailyData.consumedFats = 0;

            // Preserve meal group structure, but clear non-daily foods and recalculate totals
            dailyData.mealGroups = storedMealGroups.map(group => {
                const newFoods = group.foods.filter(food => food.isDailyStandard);
                let totalKcal = 0;
                let totalProtein = 0;
                let totalCarbs = 0;
                let totalFats = 0;

                newFoods.forEach(food => {
                    totalKcal += food.kcal;
                    totalProtein += food.protein;
                    totalCarbs += food.carbs;
                    totalFats += food.fats;
                });

                dailyData.consumedCalories += totalKcal;
                dailyData.consumedProtein += totalProtein;
                dailyData.consumedCarbs += totalCarbs;
                dailyData.consumedFats += totalFats;

                return {
                    name: group.name,
                    foods: newFoods,
                    totalKcal: totalKcal,
                    totalProtein: totalProtein,
                    totalCarbs: totalCarbs,
                    totalFats: totalFats
                };
            });
            
            dailyData.date = todayLocaleString;
            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            
            checkinCheckboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.removeItem('currentDayCheckinState');
        } else {
            // Ensure mealGroups in dailyData reflect the current storedMealGroups structure,
            // but keep today's consumed items if already present.
            if (dailyData.mealGroups.length !== storedMealGroups.length) {
                const tempDailyMealGroups = [...dailyData.mealGroups];

                dailyData.mealGroups = storedMealGroups.map(storedGroup => {
                    const existingDailyGroup = tempDailyMealGroups.find(dg => dg.name === storedGroup.name);
                    if (existingDailyGroup) {
                        return existingDailyGroup;
                    } else {
                        return {
                            name: storedGroup.name,
                            foods: [],
                            totalKcal: 0,
                            totalProtein: 0,
                            totalCarbs: 0,
                            totalFats: 0
                        };
                    }
                });
                localStorage.setItem('dailyData', JSON.stringify(dailyData));
            }

            const savedCheckinState = JSON.parse(localStorage.getItem('currentDayCheckinState'));
            if (savedCheckinState) {
                checkinCheckboxes.forEach(checkbox => {
                    checkbox.checked = savedCheckinState[checkbox.id] || false;
                });
            }
        }
    }

    function renderUserProfile() {
        if (userProfile) {
            userNameSpan.textContent = userProfile.name;
            document.getElementById('name').value = userProfile.name;
            document.getElementById('age').value = userProfile.age;
            document.getElementById('height').value = userProfile.height;
            document.getElementById('gender').value = userProfile.gender;
            document.getElementById('current-weight-settings').value = userProfile.currentWeight;
            document.getElementById('target-weight').value = userProfile.targetWeight;
            document.getElementById('activity-factor').value = userProfile.activityFactor;
            if (userProfile.targetDate) {
                targetDateInput.value = userProfile.targetDate;
            }
            difficultyModeSelect.value = userProfile.difficultyMode || 'easy';
            manualCurrentRankInput.value = currentStreak; // Display current streak in the manual input
        } else {
            userNameSpan.textContent = 'Guerreiro';
            showPage('settings-page');
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.getElementById('nav-settings').classList.add('active');
            difficultyModeSelect.value = 'easy';
            manualCurrentRankInput.value = 0;
        }
        updateCheckinVisibility();
    }

    function calculateDailyCaloricNeeds(weight, height, age, gender, activityFactor) {
        let tmb;
        if (gender === 'male') {
            tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        } else { // female
            tmb = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        return tmb * activityFactor;
    }

    function saveProfile(event) {
        if (event) event.preventDefault();

        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const gender = document.getElementById('gender').value;
        const currentWeight = parseFloat(document.getElementById('current-weight-settings').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);
        const activityFactor = parseFloat(document.getElementById('activity-factor').value);
        const targetDate = document.getElementById('target-date').value;
        const difficultyMode = difficultyModeSelect.value;
        const manualRankValue = parseInt(manualCurrentRankInput.value);

        if (!name || isNaN(age) || isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight) || isNaN(activityFactor) || !targetDate) {
            alert('Por favor, preencha todos os campos do perfil corretamente, incluindo a data final da meta.');
            return;
        }

        const initialDailyCaloricNeeds = calculateDailyCaloricNeeds(currentWeight, height, age, gender, activityFactor);
        const initialCaloricDeficit = initialDailyCaloricNeeds * 0.20;
        const initialTargetCalories = Math.round(initialDailyCaloricNeeds - initialCaloricDeficit);

        const initialTargetProtein = Math.round((initialTargetCalories * 0.40) / 4);
        const initialTargetCarbs = Math.round((initialTargetCalories * 0.40) / 4);
        const initialTargetFats = Math.round((initialTargetCalories * 0.20) / 9);

        let currentTargetCalories = userProfile ? userProfile.targetCalories : initialTargetCalories;
        let currentTargetProtein = userProfile ? userProfile.targetProtein : initialTargetProtein;
        let currentTargetCarbs = userProfile ? userProfile.targetCarbs : initialTargetCarbs;
        let currentTargetFats = userProfile ? userProfile.targetFats : initialTargetFats;

        if (userProfile && userProfile.carbDeficitApplied && event && event.type === 'submit') {
            userProfile.carbDeficitApplied = false;
            currentTargetCarbs = initialTargetCarbs;
            currentTargetCalories = initialTargetCalories;
        }

        userProfile = {
            name, age, height, gender, currentWeight, targetWeight, activityFactor, targetDate, difficultyMode,
            dailyCaloricNeeds: Math.round(initialDailyCaloricNeeds),
            targetCalories: currentTargetCalories,
            targetProtein: currentTargetProtein,
            targetCarbs: currentTargetCarbs,
            targetFats: currentTargetFats,
            carbDeficitApplied: userProfile ? userProfile.carbDeficitApplied : false
        };

        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Update currentStreak if manual input is provided and valid
        if (!isNaN(manualRankValue) && manualRankValue >= 0) {
            currentStreak = manualRankValue;
            localStorage.setItem('currentStreak', currentStreak);
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
                localStorage.setItem('maxStreak', maxStreak);
            }
            updateCheckinStreakDisplay();
            updateUserRank();
            alert('Nível atual ajustado manualmente!');
        }


        if (weightHistory.length === 0 || weightHistory[weightHistory.length - 1].weight !== currentWeight) {
            if (event && event.type === 'submit') {
                addWeightEntry(currentWeight, new Date().toLocaleDateString('pt-BR'), false);
            }
        }

        renderUserProfile();
        updateProgressBars();
        updateWeightPrediction();
        updateCheckinVisibility();
        if (event && event.type === 'submit') {
            alert('Perfil salvo e o app está pronto para uso!');
            showPage('home-page');
        }
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

        let caloriesPercentage = (dailyData.consumedCalories / userProfile.targetCalories) * 100;
        caloriesPercentage = Math.min(caloriesPercentage, 100);
        caloriesProgressBar.style.width = `${caloriesPercentage}%`;
        caloriesNum.textContent = `${dailyData.consumedCalories} / ${userProfile.targetCalories} Kcal`;
        caloriesProgressBar.style.backgroundColor = dailyData.consumedCalories > userProfile.targetCalories ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue');

        let proteinPercentage = (dailyData.consumedProtein / userProfile.targetProtein) * 100;
        proteinPercentage = Math.min(proteinPercentage, 100);
        proteinProgressBar.style.width = `${proteinPercentage}%`;
        proteinNum.textContent = `${dailyData.consumedProtein.toFixed(1)} / ${userProfile.targetProtein} g`;
        proteinProgressBar.style.backgroundColor = dailyData.consumedProtein > userProfile.targetProtein ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue');

        let carbsPercentage = (dailyData.consumedCarbs / userProfile.targetCarbs) * 100;
        carbsPercentage = Math.min(carbsPercentage, 100);
        carbsProgressBar.style.width = `${carbsPercentage}%`;
        carbsNum.textContent = `${dailyData.consumedCarbs.toFixed(1)} / ${userProfile.targetCarbs} g`;
        carbsProgressBar.style.backgroundColor = dailyData.consumedCarbs > userProfile.targetCarbs ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue');

        let fatsPercentage = (dailyData.consumedFats / userProfile.targetFats) * 100;
        fatsPercentage = Math.min(fatsPercentage, 100);
        fatsProgressBar.style.width = `${fatsPercentage}%`;
        fatsNum.textContent = `${dailyData.consumedFats.toFixed(1)} / ${userProfile.targetFats} g`;
        fatsProgressBar.style.backgroundColor = dailyData.consumedFats > userProfile.targetFats ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue');

        const targetWeight = userProfile.targetWeight;
        let weightProgress;

        if (weightHistory.length > 0) {
            const lastRecordedWeight = weightHistory[weightHistory.length - 1].weight;
            const initialWeight = weightHistory[0].weight;

            const totalWeightChangeGoal = Math.abs(initialWeight - targetWeight);
            const currentWeightChange = Math.abs(initialWeight - lastRecordedWeight);

            if (totalWeightChangeGoal === 0) {
                weightProgress = 100;
                weightRemainingText.textContent = `Meta de peso é ${targetWeight.toFixed(1)} Kg.`;
                weightLostGainedText.textContent = '';
            } else {
                weightProgress = (currentWeightChange / totalWeightChangeGoal) * 100;
                weightProgress = Math.max(0, Math.min(weightProgress, 100));

                const remaining = Math.abs(lastRecordedWeight - targetWeight).toFixed(1);
                weightRemainingText.textContent = `Faltam ${remaining} Kg para atingir ${targetWeight.toFixed(1)} Kg!`;

                const weightDiff = lastRecordedWeight - initialWeight;
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
            weightNum.textContent = `${userProfile.currentWeight.toFixed(1)} Kg / ${targetWeight.toFixed(1)} Kg`;
            weightProgressBar.style.width = '0%';
            weightRemainingText.textContent = `Faltam ${Math.abs(userProfile.currentWeight - targetWeight).toFixed(1)} Kg para atingir sua meta.`;
            weightLostGainedText.textContent = '';
        }
    }

    function calculateExpectedWeight(initialWeight, targetWeight, initialDate, targetDate, currentDate) {
        initialDate.setHours(0, 0, 0, 0);
        targetDate.setHours(23, 59, 59, 999);
        currentDate.setHours(0, 0, 0, 0);

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
        if (!userProfile || weightHistory.length < 1 || !userProfile.targetDate) {
            weightPredictionText.textContent = 'Registre seu peso atual e defina a data final da meta para uma previsão.';
            createDeficitBtn.style.display = 'none';
            weightPageFeedbackMessage.textContent = '';
            return;
        }

        const lastWeightEntry = weightHistory[weightHistory.length - 1];
        const initialWeightEntry = weightHistory[0];
        const initialWeight = initialWeightEntry.weight;
        const initialDateParts = initialWeightEntry.date.split('/');
        const initialDate = new Date(`${initialDateParts[2]}-${initialDateParts[1]}-${initialDateParts[0]}T00:00:00`);

        const targetWeight = userProfile.targetWeight;
        const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalDurationMs = targetDate.getTime() - initialDate.getTime();
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);

        if (totalDurationDays <= 0) {
            if (Math.abs(lastWeightEntry.weight - targetWeight) < 0.1) {
                weightPredictionText.textContent = `Parabéns! Você atingiu sua meta de ${targetWeight.toFixed(1)} Kg!`;
            } else if (today > targetDate) {
                weightPredictionText.textContent = `A data da sua meta (${userProfile.targetDate}) já passou. Você terminou em ${lastWeightEntry.weight.toFixed(1)} Kg.`;
            } else {
                weightPredictionText.textContent = 'A data final da meta deve ser no futuro.';
            }
            createDeficitBtn.style.display = 'none';
            weightPageFeedbackMessage.textContent = '';
            return;
        }

        const daysPassedSinceInitial = (today.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysPassedSinceInitial < 0) {
            weightPredictionText.textContent = 'Aguardando o início da sua meta de peso.';
            createDeficitBtn.style.display = 'none';
            weightPageFeedbackMessage.textContent = '';
            return;
        }

        const expectedWeightToday = calculateExpectedWeight(initialWeight, targetWeight, initialDate, targetDate, today);

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

        // Logic for "Criar Défit 20%" button
        if (weightHistory.length >= 2) {
            const lastTwoWeights = weightHistory.slice(-2);
            const weightChangeFromPrevious = Math.abs(lastTwoWeights[1].weight - lastTwoWeights[0].weight);

            if (weightChangeFromPrevious < 0.5) { // Less than 500g variation
                createDeficitBtn.style.display = 'block';
                weightPageFeedbackMessage.textContent = 'Você registrou seu peso com sucesso. Você perdeu menos de 500g, sugiro fazer o déficit nas metas. Se você não seguiu o plano 100%, sugiro melhorar o foco nos próximos 7 dias para melhorar os resultados.';
                weightPageFeedbackMessage.style.color = 'var(--vibrant-orange)';
            } else {
                createDeficitBtn.style.display = 'none';
                weightPageFeedbackMessage.textContent = '';
            }
        } else {
            createDeficitBtn.style.display = 'none';
            weightPageFeedbackMessage.textContent = '';
        }
    }

    function checkWeeklyWeightProgress() {
        dietFeedbackMessage.textContent = '';

        if (!userProfile || weightHistory.length < 2) {
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastRecordedWeightDateParts = weightHistory[weightHistory.length - 1].date.split('/');
        const lastRecordedWeightDate = new Date(`${lastRecordedWeightDateParts[2]}-${lastRecordedWeightDateParts[1]}-${lastRecordedWeightDateParts[0]}`);
        lastRecordedWeightDate.setHours(0, 0, 0, 0);

        const daysSinceLastCheck = lastWeightCheckDate ?
            Math.floor((today.getTime() - lastWeightCheckDate.getTime()) / (1000 * 60 * 60 * 24)) :
            7;

        if (daysSinceLastCheck >= 7) {
            let weight7DaysAgoEntry = null;
            for (let i = weightHistory.length - 1; i >= 0; i--) {
                const entryDateParts = weightHistory[i].date.split('/');
                const entryDate = new Date(`${entryDateParts[2]}-${entryDateParts[1]}-${entryDateParts[0]}`);
                entryDate.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((lastRecordedWeightDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays >= 7) {
                    weight7DaysAgoEntry = weightHistory[i];
                    break;
                }
            }

            if (!weight7DaysAgoEntry && weightHistory.length > 0) {
                weight7DaysAgoEntry = weightHistory[0];
            }

            if (!weight7DaysAgoEntry) {
                return;
            }

            const currentWeight = weightHistory[weightHistory.length - 1].weight;
            const weight7DaysAgo = weight7DaysAgoEntry.weight;
            const weightChange = currentWeight - weight7DaysAgo;

            if (userProfile.targetWeight < userProfile.currentWeight) { // User wants to lose weight
                if (weightChange >= -0.5) { // Lost less than 500g or gained
                    userProfile.targetCarbs = Math.round(userProfile.targetCarbs * 0.80);
                    userProfile.targetCalories = Math.round(userProfile.targetProtein * 4 + userProfile.targetCarbs * 4 + userProfile.targetFats * 9);
                    userProfile.carbDeficitApplied = true;
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    saveProfile(null);
                    dietFeedbackMessage.textContent = 'Ajuste de metas: Foi aplicado um déficit de 20% nos carboidratos devido ao baixo progresso na perda de peso. Mantenha o foco!';
                    dietFeedbackMessage.style.color = 'var(--vibrant-orange)';

                } else { // Good progress on losing weight
                    if (userProfile.carbDeficitApplied) {
                        userProfile.carbDeficitApplied = false;
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        saveProfile(null);
                        dietFeedbackMessage.textContent = 'Parabéns! Suas metas de carboidratos foram normalizadas após bom progresso.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                    } else {
                        localStorage.setItem('lastWeightCheckDate', today.toISOString());
                        dietFeedbackMessage.textContent = 'Ótimo progresso! Continue assim.';
                        dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                    }
                }
            } else if (userProfile.targetWeight > userProfile.currentWeight) { // User wants to gain weight
                if (weightChange <= 0.5) { // Gained less than 500g or lost
                    userProfile.targetCarbs = Math.round(userProfile.targetCarbs * 1.10);
                    userProfile.targetCalories = Math.round(userProfile.targetProtein * 4 + userProfile.targetCarbs * 4 + userProfile.targetFats * 9);
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    saveProfile(null);
                    dietFeedbackMessage.textContent = 'Ajuste de metas: Foi aplicado um aumento de 10% nos carboidratos para auxiliar no ganho de peso. Mantenha o foco!';
                    dietFeedbackMessage.style.color = 'var(--vibrant-orange)';
                } else { // Good progress on gaining weight
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    dietFeedbackMessage.textContent = 'Ótimo progresso! Continue assim.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
                }
            } else { // Target weight is current weight (maintenance)
                if (userProfile.carbDeficitApplied) {
                    userProfile.carbDeficitApplied = false;
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    localStorage.setItem('lastWeightCheckDate', today.toISOString());
                    saveProfile(null);
                    dietFeedbackMessage.textContent = 'Parabéns! Suas metas de carboidratos foram normalizadas.';
                    dietFeedbackMessage.style.color = 'var(--vibrant-blue)';
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
            'Novato',
            '⚔️ Soldado',
            '🛡️ Cabo',
            '🥉 Terceiro Sargento',
            '🥈 Segundo Sargento',
            '🥇 Primeiro Sargento',
            '🌟 Subtenente',
            '✨ Aspirante a Oficial',
            '💎 Segundo Tenente',
            '🚀 Primeiro Tenente',
            '🌠 Capitão',
            '👑 Major',
            '🔥 Coronel',
            '🐺 General de Exército',
            '🦁 Rei',
            '🧘 Monge'
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

    // Function to calculate a moving average
    function calculateMovingAverage(data, windowSize) {
        if (data.length < windowSize) {
            return new Array(data.length).fill(null);
        }
        const averages = [];
        for (let i = 0; i < data.length; i++) {
            if (i < windowSize - 1) {
                averages.push(null);
            } else {
                let sum = 0;
                for (let j = 0; j < windowSize; j++) {
                    sum += data[i - j];
                }
                averages.push(sum / windowSize);
            }
        }
        return averages;
    }

    function setupWeightChart() {
        if (weightChart) {
            weightChart.destroy();
        }

        const labels = weightHistory.map(entry => entry.date);
        const actualWeightData = weightHistory.map(entry => entry.weight);

        let expectedWeightData = [];
        if (userProfile && weightHistory.length > 0 && userProfile.targetDate) {
            const initialWeightEntry = weightHistory[0];
            const initialWeight = initialWeightEntry.weight;
            const initialDateParts = initialWeightEntry.date.split('/');
            const initialDate = new Date(`${initialDateParts[2]}-${initialDateParts[1]}-${initialDateParts[0]}T00:00:00`);
            const targetWeight = userProfile.targetWeight;
            const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

            labels.forEach(labelDateStr => {
                const labelDateParts = labelDateStr.split('/');
                const currentDate = new Date(`${labelDateParts[2]}-${labelDateParts[1]}-${labelDateParts[0]}T00:00:00`);
                expectedWeightData.push(calculateExpectedWeight(initialWeight, targetWeight, initialDate, targetDate, currentDate));
            });
        }

        const averageWeightData = calculateMovingAverage(actualWeightData, 7);


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
                },
                {
                    label: 'Média de Peso (7 dias)',
                    data: averageWeightData,
                    borderColor: 'rgba(150, 150, 150, 0.5)',
                    backgroundColor: 'rgba(150, 150, 150, 0.1)',
                    borderDash: [2, 2],
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

            if (userProfile && weightHistory.length > 0 && userProfile.targetDate) {
                const initialWeightEntry = weightHistory[0];
                const initialWeight = initialWeightEntry.weight;
                const initialDateParts = initialWeightEntry.date.split('/');
                const initialDate = new Date(`${initialDateParts[2]}-${initialDateParts[1]}-${initialDateParts[0]}T00:00:00`);
                const targetWeight = userProfile.targetWeight;
                const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

                let expectedWeightData = [];
                weightChart.data.labels.forEach(labelDateStr => {
                    const labelDateParts = labelDateStr.split('/');
                    const currentDate = new Date(`${labelDateParts[2]}-${labelDateParts[1]}-${labelDateParts[0]}T00:00:00`);
                    expectedWeightData.push(calculateExpectedWeight(initialWeight, targetWeight, initialDate, targetDate, currentDate));
                });
                if (weightChart.data.datasets.length < 2) {
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
                } else {
                    weightChart.data.datasets[1].data = expectedWeightData;
                }
            } else {
                if (weightChart.data.datasets.length > 1) {
                    weightChart.data.datasets.splice(1, 1);
                }
            }

            const actualWeightData = weightHistory.map(entry => entry.weight);
            const averageWeightData = calculateMovingAverage(actualWeightData, 7);
            if (weightChart.data.datasets.length < 3) {
                weightChart.data.datasets.push({
                    label: 'Média de Peso (7 dias)',
                    data: averageWeightData,
                    borderColor: 'rgba(150, 150, 150, 0.5)',
                    backgroundColor: 'rgba(150, 150, 150, 0.1)',
                    borderDash: [2, 2],
                    tension: 0.1,
                    fill: false,
                    pointRadius: 0
                });
            } else {
                weightChart.data.datasets[2].data = averageWeightData;
            }

            weightChart.update();
        }
    }


    // --- Interaction Functions ---

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

    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.id.replace('nav-', '') + '-page';
            showPage(pageId);
        });
    });

    // Save profile settings
    profileForm.addEventListener('submit', saveProfile);

    // Add meal group
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

        // Se for um alimento padrão diário, remova-o também do storedMealGroups
        if (foodToRemove.isDailyStandard) {
            const storedGroup = storedMealGroups.find(g => g.name === dailyData.mealGroups[groupIndex].name);
            if (storedGroup) {
                storedGroup.foods = storedGroup.foods.filter(food =>
                    !(food.name === foodToRemove.name && food.quantity === foodToRemove.quantity && food.kcal === foodToRemove.kcal)
                );
                recalculateGroupTotals(storedGroup);
                localStorage.setItem('storedMealGroups', JSON.stringify(storedMealGroups));
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

        // NÂO REMOVE O GRUPO SE FICAR VAZIO. APENAS ZERA OS TOTAIS.
        // A remoção de grupos só deve ser feita explicitamente pelo botão "X" do grupo.
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
        const groupIndex = parseInt(event.target.dataset.groupIndex); // Acessa corretamente o data-group-index
        const groupToRemoveName = dailyData.mealGroups[groupIndex].name;

        if (confirm(`Tem certeza que deseja remover o grupo de refeição "${groupToRemoveName}"? Todos os alimentos dentro dele também serão removidos permanentemente.`)) {
            const groupToRemove = dailyData.mealGroups[groupIndex];

            dailyData.consumedCalories -= groupToRemove.totalKcal;
            dailyData.consumedProtein -= groupToRemove.totalProtein;
            dailyData.consumedCarbs -= groupToRemove.totalCarbs;
            dailyData.consumedFats -= groupToRemove.totalFats;

            dailyData.mealGroups.splice(groupIndex, 1);

            // Garante que o grupo seja removido de storedMealGroups também
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
                !(food.name === foodItem.name && food.quantity === foodItem.quantity && food.kcal === foodItem.kcal)
            );
            if (foodItem.isDailyStandard) {
                storedGroup.foods.push(foodItem);
            }
            recalculateGroupTotals(storedGroup);
        } else {
            console.error("Grupo não encontrado em storedMealGroups. Criando novo.");
            const newStoredGroup = {
                name: dailyData.mealGroups[groupIndex].name,
                foods: foodItem.isDailyStandard ? [foodItem] : [],
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

        checkinSleep.style.display = 'flex';
        checkinDiet.style.display = 'flex';

        if (mode === 'easy') {
            checkinWorkout.style.display = 'none';
            checkinNofap.style.display = 'none';
        } else if (mode === 'hard') {
            checkinWorkout.style.display = 'flex';
            checkinNofap.style.display = 'none';
        } else if (mode === 'god') {
            checkinWorkout.style.display = 'flex';
            checkinNofap.style.display = 'flex';
        }
    }


    // Save Check-in
    saveCheckinBtn.addEventListener('click', () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
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
            if (mode === 'easy') {
                allRequiredChecked = sleepChecked && dietChecked;
            } else if (mode === 'hard') {
                allRequiredChecked = sleepChecked && workoutChecked && dietChecked;
            } else if (mode === 'god') {
                allRequiredChecked = sleepChecked && workoutChecked && dietChecked && nofapChecked;
            }
        } else {
            allRequiredChecked = sleepChecked && dietChecked;
        }

        const existingCheckinEntryIndex = checkinHistory.findIndex(entry => entry.date === todayLocaleString);
        let wasPreviouslyAllRequiredChecked = false;

        if (existingCheckinEntryIndex !== -1) {
            const previousState = checkinHistory[existingCheckinEntryIndex];
            if (userProfile) {
                const mode = userProfile.difficultyMode;
                if (mode === 'easy') {
                    wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.diet;
                } else if (mode === 'hard') {
                    wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.workout && previousState.diet;
                } else if (mode === 'god') {
                    wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.workout && previousState.diet && previousState.nofap;
                }
            } else {
                wasPreviouslyAllRequiredChecked = previousState.sleep && previousState.diet;
            }
        }

        const lastSuccessfulCheckinDayStart = lastSuccessfulCheckinDate ? new Date(lastSuccessfulCheckinDate) : null;
        if (lastSuccessfulCheckinDayStart) {
            lastSuccessfulCheckinDayStart.setHours(0, 0, 0, 0);
        }

        const diffDaysSinceLastSuccess = lastSuccessfulCheckinDayStart ?
            Math.round((today.getTime() - lastSuccessfulCheckinDayStart.getTime()) / (1000 * 60 * 60 * 24)) :
            Infinity;

        if (allRequiredChecked) {
            if (diffDaysSinceLastSuccess === 0) {
                // No increment needed if already completed today
            } else if (diffDaysSinceLastSuccess === 1) {
                currentStreak++;
            } else if (diffDaysSinceLastSuccess > 1) {
                currentStreak = 1;
            } else {
                 currentStreak = 1;
            }
            lastSuccessfulCheckinDate = today.toISOString();
        } else {
            if (wasPreviouslyAllRequiredChecked || (diffDaysSinceLastSuccess === 1 && currentStreak > 0) || (diffDaysSinceLastSuccess === 0 && currentStreak > 0 && !allRequiredChecked)) {
                currentStreak = 0;
            }
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        localStorage.setItem('currentStreak', currentStreak);
        localStorage.setItem('maxStreak', maxStreak);
        if (allRequiredChecked) {
            localStorage.setItem('lastSuccessfulCheckinDate', lastSuccessfulCheckinDate);
        }

        if (existingCheckinEntryIndex !== -1) {
            checkinHistory[existingCheckinEntryIndex] = { date: todayLocaleString, ...currentCheckinState };
        } else {
            checkinHistory.push({ date: todayLocaleString, ...currentCheckinState });
        }
        localStorage.setItem('checkinHistory', JSON.stringify(checkinHistory));
        localStorage.setItem('currentDayCheckinState', JSON.stringify(currentCheckinState));

        renderCheckinHistory();
        updateCheckinStreakDisplay();
        updateUserRank();
        alert('Check-in salvo!');
    });


    // Add weight entry
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

        const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');

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
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

            if (showAlert) {
                alert(`Registro de peso para ${date} atualizado de ${oldWeight.toFixed(1)} Kg para ${weight.toFixed(1)} Kg.`);
            }
        } else {
            weightHistory.push({ date: date, weight: parseFloat(weight.toFixed(1)) });
            weightHistory.sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
            if (showAlert) {
                alert('Peso registrado com sucesso!');
            }
        }

        if (userProfile && weightHistory.length > 0) {
            userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            saveProfile(null);
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
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);
            return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
        });

        localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

        if (userProfile && weightHistory.length > 0) {
            userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            saveProfile(null);
        }
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

            if (userProfile) {
                userProfile.currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                saveProfile(null);
            }
            renderWeightHistory();
            updateProgressBars();
            updateWeightPrediction();
            checkWeeklyWeightProgress();
            alert('Registro de peso excluído.');
        }
    }


    // Add custom food
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

        const allFoods = defaultFoods.concat(foodDatabase.filter(food => food.isCustom));
        const existingFood = allFoods.find(food => normalizeString(food.name) === normalizeString(customFoodName));
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
    }

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

    // New: Handle "Create 20% Deficit" button click
    createDeficitBtn.addEventListener('click', () => {
        if (!userProfile) {
            alert('Por favor, preencha seu perfil primeiro.');
            return;
        }

        const confirmDeficit = confirm('Tem certeza que deseja aplicar um DÉFICIT ADICIONAL de 20% nas calorias, focado em carboidratos? Isso ajustará suas metas.');
        if (confirmDeficit) {
            userProfile.targetCarbs = Math.round(userProfile.targetCarbs * 0.80);
            userProfile.targetCalories = Math.round(userProfile.targetProtein * 4 + userProfile.targetCarbs * 4 + userProfile.targetFats * 9);

            localStorage.setItem('userProfile', JSON.stringify(userProfile));

            saveProfile(null);
            
            alert('Déficit adicional de 20% aplicado com sucesso nas metas de carboidratos!');
        }
    });


    // Check-in Animations
    checkinCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const animationDiv = event.target.nextElementSibling.nextElementSibling;
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

    // Toggle all ranks list visibility
    showAllRanksBtn.addEventListener('click', () => {
        allRanksList.classList.toggle('visible');
        if (allRanksList.classList.contains('visible')) {
            showAllRanksBtn.textContent = 'Esconder Níveis';
        } else {
            showAllRanksBtn.textContent = 'Mostrar Todos os Níveis';
        }
    });

    // Help button for difficulty mode
    helpDifficultyModeBtn.addEventListener('click', () => {
        alert(
            'O Modo de Dificuldade define quais itens do Check-in diário são obrigatórios para você manter ou avançar sua sequência de dias de foco:\n\n' +
            '💪 Fácil (Dieta): Você precisa apenas registrar que Dormiu bem e que fez a Dieta corretamente.\n\n' +
            '🏋️ Hard (Dieta e Treino): Além de Dormir bem e fazer a Dieta corretamente, você também precisa registrar que Fez o treino.\n\n' +
            '🧘 God (Dieta, Treino e NoFap): Para este modo, todos os itens (Dormiu bem, Fez o treino, Dieta corretamente e NoFap firme?) são obrigatórios para o avanço de nível. Escolha este modo para o desafio máximo!'
        );
    });


    // Initialize the app
    initApp();

    // Show home page by default, or settings if no profile
    if (!userProfile) {
        showPage('settings-page');
    } else {
        showPage('home-page');
    }
});