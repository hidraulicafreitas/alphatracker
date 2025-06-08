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
    const newWeightDateInput = document.getElementById('new-weight-date'); // Novo campo de data
    const addCustomFoodForm = document.getElementById('add-custom-food-form');
    const customFoodList = document.getElementById('custom-food-list');
    const pastMealsList = document.getElementById('past-meals-list');
    const dietFeedbackMessage = document.getElementById('diet-feedback-message'); // Mensagem de feedback

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

    // Target Date field
    const targetDateInput = document.getElementById('target-date');

    // Chart elements
    const weightChartCanvas = document.getElementById('weightChart');
    const chartNoDataMessage = document.getElementById('chart-no-data');
    let weightChartInstance = null; // To hold the Chart.js instance


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

    // Variável para armazenar a mensagem de feedback da dieta temporariamente
    let pendingDietFeedback = { message: '', color: '' };


    let foodDatabase = JSON.parse(localStorage.getItem('foodDatabase')) || [];
    let defaultFoods = [
        // Carnes (novas adições)
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
        // Proteins
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
    if (foodDatabase.length === 0 || !foodDatabase.some(food => !food.isCustom)) {
        foodDatabase = defaultFoods.concat(foodDatabase.filter(food => food.isCustom));
        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
    }


    // --- Initialization and Rendering Functions ---

    function initApp() {
        console.log("initApp: Starting initialization.");
        checkDailyReset();
        renderUserProfile();
        updateProgressBars();
        renderMealGroups();
        renderCheckinHistory();
        renderCustomFoodList();
        updateWeightPrediction(); // Always update prediction on home page
        renderPastMealsHistory();
        newWeightDateInput.valueAsDate = new Date();

        // The checkWeeklyWeightProgress is now ONLY called when navigating to weight page
        console.log("initApp: Initialization complete.");
    }

    function checkDailyReset() {
        console.log("checkDailyReset: Checking daily reset conditions.");
        const today = new Date().toLocaleDateString('pt-BR');
        if (dailyData.date !== today) {
            console.log("Reiniciando dados diários e salvando resumo do dia anterior...");
            if (dailyData.consumedCalories > 0 || dailyData.consumedProtein > 0 || dailyData.carbsPer100g > 0 || dailyData.consumedFats > 0) {
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

            dailyData = {
                date: today,
                consumedCalories: 0,
                consumedProtein: 0,
                consumedCarbs: 0,
                consumedFats: 0,
                mealGroups: []
            };
            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            checkinCheckboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.removeItem('currentDayCheckinState');
        } else {
            const savedCheckinState = JSON.parse(localStorage.getItem('currentDayCheckinState'));
            if (savedCheckinState) {
                checkinCheckboxes.forEach(checkbox => {
                    checkbox.checked = savedCheckinState[checkbox.id] || false;
                });
            }
        }
        console.log("checkDailyReset: Daily reset check complete.");
    }

    function renderUserProfile() {
        console.log("renderUserProfile: Rendering user profile.");
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
        } else {
            userNameSpan.textContent = 'Guerreiro';
        }
        console.log("renderUserProfile: User profile rendered.");
    }

    function calculateDailyCaloricNeeds(weight, height, age, gender, activityFactor) {
        let tmb;
        if (gender === 'male') {
            tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            tmb = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        return tmb * activityFactor;
    }

    function saveProfile(event) {
        console.log("saveProfile: Saving profile.");
        if (event) event.preventDefault();

        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const gender = document.getElementById('gender').value;
        const currentWeightFromSettings = parseFloat(document.getElementById('current-weight-settings').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);
        const activityFactor = parseFloat(document.getElementById('activity-factor').value);
        const targetDate = document.getElementById('target-date').value;

        if (!name || isNaN(age) || isNaN(height) || isNaN(currentWeightFromSettings) || isNaN(targetWeight) || isNaN(activityFactor) || !targetDate) {
            alert('Por favor, preencha todos os campos do perfil corretamente, incluindo a data final da meta.');
            return;
        }

        const dailyCaloricNeeds = calculateDailyCaloricNeeds(currentWeightFromSettings, height, age, gender, activityFactor);
        const caloricDeficit = dailyCaloricNeeds * 0.20;
        let targetCalories = Math.round(dailyCaloricNeeds - caloricDeficit);

        let targetProtein = Math.round((targetCalories * 0.40) / 4);
        let targetCarbs = Math.round((targetCalories * 0.40) / 4);
        let targetFats = Math.round((targetCalories * 0.20) / 9);

        if (userProfile && userProfile.carbDeficitApplied) {
            targetCarbs = Math.round(targetCarbs * 0.80);
            targetCalories = Math.round(targetProtein * 4 + targetCarbs * 4 + targetFats * 9);
        }

        userProfile = {
            name, age, height, gender,
            currentWeight: currentWeightFromSettings,
            targetWeight, activityFactor, targetDate,
            dailyCaloricNeeds: Math.round(dailyCaloricNeeds),
            targetCalories,
            targetProtein,
            targetCarbs,
            targetFats,
            carbDeficitApplied: userProfile ? userProfile.carbDeficitApplied : false
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        if (weightHistory.length === 0 || weightHistory[weightHistory.length - 1].weight !== currentWeightFromSettings) {
            const dateToLog = new Date().toISOString().split('T')[0];
            addWeightEntry(currentWeightFromSettings, dateToLog, false);
        }

        renderUserProfile();
        updateProgressBars();
        updateWeightPrediction();
        if (event && event.type === 'submit') {
            alert('Perfil salvo e o app está pronto para uso!');
            showPage('home-page');
        }
        console.log("saveProfile: Profile saved.");
    }

    function updateProgressBars() {
        console.log("updateProgressBars: Updating progress bars.");
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
            targetDateInput.textContent = '';
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
            const lastRecordedWeight = userProfile.currentWeight;
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
        console.log("updateProgressBars: Progress bars updated.");
    }

    function updateWeightPrediction() {
        console.log("updateWeightPrediction: Updating weight prediction.");
        if (!userProfile || weightHistory.length < 1 || !userProfile.targetDate) {
            weightPredictionText.textContent = 'Registre seu peso atual e defina a data final da meta para uma previsão.';
            return;
        }

        const initialWeightEntry = weightHistory[0];
        const initialWeight = initialWeightEntry.weight;
        const initialDate = new Date(initialWeightEntry.date.split('/').reverse().join('-') + 'T00:00:00');

        const targetWeight = userProfile.targetWeight;
        const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalDurationMs = targetDate.getTime() - initialDate.getTime();
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);

        if (totalDurationDays <= 0) {
            if (Math.abs(userProfile.currentWeight - targetWeight) < 0.1) {
                weightPredictionText.textContent = `Parabéns! Você atingiu sua meta de ${targetWeight.toFixed(1)} Kg!`;
            } else if (today > targetDate) {
                weightPredictionText.textContent = `A data da sua meta (${userProfile.targetDate}) já passou. Você terminou em ${userProfile.currentWeight.toFixed(1)} Kg.`;
            } else {
                weightPredictionText.textContent = 'A data final da meta deve ser no futuro.';
            }
            return;
        }

        const daysPassedSinceInitial = (today.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysPassedSinceInitial < 0) {
            weightPredictionText.textContent = 'Aguardando o início da sua meta de peso.';
            return;
        }

        const totalWeightDifference = targetWeight - initialWeight;
        const requiredChangePerDay = totalWeightDifference / totalDurationDays;

        const expectedWeightToday = initialWeight + (requiredChangePerDay * daysPassedSinceInitial);

        let statusMessage = '';
        const deviation = userProfile.currentWeight - expectedWeightToday;

        if (Math.abs(deviation) < 0.2) {
            statusMessage = `Você está no caminho certo! Seu peso atual (${userProfile.currentWeight.toFixed(1)} Kg) está próximo do esperado (${expectedWeightToday.toFixed(1)} Kg).`;
        } else if (targetWeight > initialWeight) {
            if (deviation > 0) {
                statusMessage = `Você está adiantado na sua meta de ganho de peso! Atual: ${userProfile.currentWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de ganho de peso. Atual: ${userProfile.currentWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        } else {
            if (deviation < 0) {
                statusMessage = `Você está adiantado na sua meta de perda de peso! Atual: ${userProfile.currentWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de perda de peso. Atual: ${userProfile.currentWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        }
        weightPredictionText.textContent = statusMessage;
        console.log("updateWeightPrediction: Weight prediction updated.");
    }

    function checkWeeklyWeightProgress() {
        console.log("checkWeeklyWeightProgress: Starting weekly weight progress check.");
        // Clear pending feedback at start of check, regardless of whether a prompt is shown
        // This ensures old messages don't linger if the conditions for a new prompt aren't met.
        pendingDietFeedback = { message: '', color: '' }; 

        if (!userProfile || weightHistory.length < 2) {
            console.log("checkWeeklyWeightProgress: Not enough data for check.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toLocaleDateString('pt-BR');

        const lastCheckDateString = lastWeightCheckDate ? lastWeightCheckDate.toLocaleDateString('pt-BR') : '';

        // Only run the prompt logic if it's been at least 7 days since the last check (or never checked)
        // AND if a prompt hasn't already been shown for today
        if (lastCheckDateString === todayString) {
            console.log("checkWeeklyWeightProgress: Already checked today. Skipping prompt.");
            // Even if already checked, we want to ensure the last feedback message is displayed
            displayDietFeedback(); 
            return;
        }

        const daysSinceLastCheck = lastWeightCheckDate ?
            Math.floor((today.getTime() - lastWeightCheckDate.getTime()) / (1000 * 60 * 60 * 24)) :
            7; 

        console.log(`Days since last check: ${daysSinceLastCheck}`);

        if (daysSinceLastCheck >= 7) {
            let weight7DaysAgoEntry = null;
            for (let i = weightHistory.length - 1; i >= 0; i--) {
                const entryDate = new Date(weightHistory[i].date.split('/').reverse().join('-'));
                entryDate.setHours(0, 0, 0, 0);
                const diffDaysFromToday = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDaysFromToday >= 7) {
                    weight7DaysAgoEntry = weightHistory[i];
                    break;
                }
            }

            if (!weight7DaysAgoEntry && weightHistory.length > 0) {
                weight7DaysAgoEntry = weightHistory[0];
            }

            if (!weight7DaysAgoEntry) {
                localStorage.setItem('lastWeightCheckDate', today.toISOString());
                console.log("checkWeeklyWeightProgress: No historical data for 7 days ago. Setting last check date.");
                displayDietFeedback(); // Try to display feedback even if conditions aren't met
                return;
            }

            const currentWeight = userProfile.currentWeight;
            const weight7DaysAgo = weight7DaysAgoEntry.weight;
            const weightChange = currentWeight - weight7DaysAgo;

            console.log(`Current Weight: ${currentWeight}, Weight 7 days ago: ${weight7DaysAgo}, Change: ${weightChange}`);

            // Set lastWeightCheckDate immediately after the check logic to prevent re-prompting
            localStorage.setItem('lastWeightCheckDate', today.toISOString());

            // Scenario: User has a weight loss goal
            if (userProfile.targetWeight < currentWeight) {
                if (weightChange >= -0.5) { // Lost less than 500g (or gained/maintained)
                    const followedDiet = confirm(`Nos últimos ${daysSinceLastCheck} dias, seu peso mudou em ${weightChange.toFixed(1)} Kg (meta: perder peso). Você seguiu a dieta e os treinos corretamente?
                        \n(Clique em 'OK' para SIM, 'Cancelar' para NÃO)`);

                    if (followedDiet) {
                        userProfile.targetCarbs = Math.round(userProfile.targetCarbs * 0.80);
                        userProfile.targetCalories = Math.round(userProfile.targetProtein * 4 + userProfile.targetCarbs * 4 + userProfile.targetFats * 9);
                        userProfile.carbDeficitApplied = true;
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        saveProfile(null);
                        pendingDietFeedback = {
                            message: `Ajuste de metas: Foi aplicado um déficit de 20% nos carboidratos (Nova meta de Carb: ${userProfile.targetCarbs}g) e Kcal recalculadas para ${userProfile.targetCalories} Kcal, devido ao baixo progresso na perda de peso. Mantenha o foco!`,
                            color: 'var(--vibrant-orange)'
                        };
                        console.log("checkWeeklyWeightProgress: Diet adjusted for loss.");
                    } else {
                        userProfile.carbDeficitApplied = false;
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        saveProfile(null);
                        pendingDietFeedback = {
                            message: 'Metas mantidas. Tente seguir a dieta e treinos corretamente pelos próximos 7 dias para avaliar o progresso.',
                            color: 'var(--vibrant-blue)'
                        };
                        console.log("checkWeeklyWeightProgress: Diet maintained for loss.");
                    }
                } else { // User lost 500g or more, good progress!
                    if (userProfile.carbDeficitApplied) {
                        userProfile.carbDeficitApplied = false;
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        saveProfile(null);
                        pendingDietFeedback = {
                            message: 'Parabéns! Suas metas de carboidratos foram normalizadas pois você está no caminho certo para perder peso!',
                            color: 'var(--vibrant-blue)'
                        };
                        console.log("checkWeeklyWeightProgress: Carb deficit removed, good loss progress.");
                    } else {
                        pendingDietFeedback = {
                            message: `Ótimo trabalho! Você perdeu ${Math.abs(weightChange).toFixed(1)} Kg nos últimos ${daysSinceLastCheck} dias. Continue assim!`,
                            color: 'var(--vibrant-blue)'
                        };
                        console.log("checkWeeklyWeightProgress: Good loss progress.");
                    }
                }
            } else if (userProfile.targetWeight > currentWeight) { // Goal is to gain weight
                if (weightChange <= 0.5) { // Gained less than 500g (or lost/maintained)
                    const followedDiet = confirm(`Nos últimos ${daysSinceLastCheck} dias, seu peso mudou em ${weightChange.toFixed(1)} Kg (meta: ganhar peso). Você seguiu a dieta e os treinos corretamente?
                        \n(Clique em 'OK' para SIM, 'Cancelar' para NÃO)`);

                    if (followedDiet) {
                        userProfile.targetCarbs = Math.round(userProfile.targetCarbs * 1.10);
                        userProfile.targetCalories = Math.round(userProfile.targetProtein * 4 + userProfile.targetCarbs * 4 + userProfile.targetFats * 9);
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        saveProfile(null);
                        pendingDietFeedback = {
                            message: `Ajuste de metas: Foi aplicado um aumento de 10% nos carboidratos (Nova meta de Carb: ${userProfile.targetCarbs}g) e Kcal recalculadas para ${userProfile.targetCalories} Kcal, para auxiliar no ganho de peso. Mantenha o foco!`,
                            color: 'var(--vibrant-orange)'
                        };
                        console.log("checkWeeklyWeightProgress: Diet adjusted for gain.");
                    } else {
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        saveProfile(null);
                        pendingDietFeedback = {
                            message: 'Metas mantidas. Tente seguir a dieta e treinos corretamente pelos próximos 7 dias para avaliar o progresso.',
                            color: 'var(--vibrant-blue)'
                        };
                        console.log("checkWeeklyWeightProgress: Diet maintained for gain.");
                    }
                } else {
                    pendingDietFeedback = {
                        message: `Ótimo trabalho! Você ganhou ${weightChange.toFixed(1)} Kg nos últimos ${daysSinceLastCheck} dias. Continue assim!`,
                        color: 'var(--vibrant-blue)'
                    };
                    console.log("checkWeeklyWeightProgress: Good gain progress.");
                }
            } else { // Already at target weight or no significant change needed
                if (userProfile.carbDeficitApplied) {
                    userProfile.carbDeficitApplied = false;
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    saveProfile(null);
                    pendingDietFeedback = {
                        message: 'Parabéns! Suas metas de carboidratos foram normalizadas pois você atingiu ou está próximo de sua meta de peso.',
                        color: 'var(--vibrant-blue)'
                    };
                    console.log("checkWeeklyWeightProgress: Carb deficit removed, target reached.");
                } else {
                    pendingDietFeedback = {
                        message: `Você está no peso ideal (${currentWeight.toFixed(1)} Kg). Mantenha o foco!`,
                        color: 'var(--vibrant-blue)'
                    };
                    console.log("checkWeeklyWeightProgress: At ideal weight.");
                }
            }
        }
        console.log("checkWeeklyWeightProgress: Weekly weight progress check finished.");
        // After the check, ensure the feedback is displayed if on the weight page
        const currentPageId = document.querySelector('.page-content.active').id;
        if (currentPageId === 'weight-page') {
            displayDietFeedback();
        }
    }

    // Function to display pending diet feedback
    function displayDietFeedback() {
        console.log("displayDietFeedback: Attempting to display feedback.");
        if (pendingDietFeedback.message) {
            dietFeedbackMessage.textContent = pendingDietFeedback.message;
            dietFeedbackMessage.style.color = pendingDietFeedback.color;
            // The pendingDietFeedback is now only cleared at the START of checkWeeklyWeightProgress
            console.log("displayDietFeedback: Feedback displayed.");
        } else {
            dietFeedbackMessage.textContent = ''; // Ensure it's cleared if no pending message
            console.log("displayDietFeedback: No pending feedback to display.");
        }
    }


    // Helper function to remove accents and convert to lowercase
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }


    function renderMealGroups() {
        console.log("renderMealGroups: Rendering meal groups.");
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
                                ${food.name} (${food.quantity}g)
                                <span>${food.kcal} Kcal | P: ${food.protein.toFixed(1)}g | C: ${food.carbs.toFixed(1)}g | G: ${food.fats.toFixed(1)}g</span>
                            </div>
                            <button class="remove-food-item-btn" data-group-index="${groupIndex}" data-food-index="${foodIndex}">Remover</button>
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

        mealGroupsContainer.querySelectorAll('.add-food-form').forEach(form => {
            form.addEventListener('submit', addFoodItem);
            const searchInput = form.querySelector('.food-search-input');
            const dataList = form.querySelector(`datalist#food-suggestions-${form.dataset.groupIndex}`);

            searchInput.addEventListener('input', () => handleFoodSearch(searchInput, dataList));
            searchInput.addEventListener('change', (e) => {
                if (foodDatabase.some(food => normalizeString(food.name) === normalizeString(e.target.value))) {
                } else {
                    e.target.value = '';
                }
            });
        });
        console.log("renderMealGroups: Meal groups rendered.");
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
        console.log("renderCheckinHistory: Rendering check-in history.");
        checkinHistoryList.innerHTML = '';
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
        console.log("renderCheckinHistory: Check-in history rendered.");
    }

    function renderWeightHistory() {
        console.log("renderWeightHistory: Rendering weight history and chart.");
        weightHistoryList.innerHTML = ''; // Clear existing list items
        if (weightHistory.length === 0) {
            weightHistoryList.innerHTML = '<p class="no-data-message">Nenhum peso registrado ainda.</p>';
            chartNoDataMessage.style.display = 'block';
            weightChartCanvas.style.display = 'none'; // Hide canvas if no data
            if (weightChartInstance) {
                weightChartInstance.destroy();
                weightChartInstance = null;
            }
            displayDietFeedback(); // Display feedback message if any, even with no weight history
            console.log("renderWeightHistory: No weight history.");
            return;
        }

        // Sort weight history by date to ensure chronological order for chart and correct display
        weightHistory.sort((a, b) => {
            // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for accurate Date object creation
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateA - dateB;
        });

        // Displaying the list (most recent first)
        weightHistory.slice().reverse().forEach((entry, originalIndex) => {
            const listItem = document.createElement('li');
            // Find actual index to ensure correct editing/deletion of original sorted array
            const actualIndex = weightHistory.findIndex(wh => wh.date === entry.date && wh.weight === entry.weight);

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

        // Add event listeners for edit and delete buttons
        weightHistoryList.querySelectorAll('.edit-weight-btn').forEach(button => {
            button.addEventListener('click', editWeightEntry);
        });
        weightHistoryList.querySelectorAll('.delete-weight-btn').forEach(button => {
            button.addEventListener('click', deleteWeightEntry);
        });

        // Render the chart only if there's enough data
        if (weightHistory.length >= 1 && userProfile) {
            renderWeightChart();
        } else {
            chartNoDataMessage.style.display = 'block';
            weightChartCanvas.style.display = 'none';
            if (weightChartInstance) {
                weightChartInstance.destroy();
                weightChartInstance = null;
            }
        }
        displayDietFeedback(); // Display feedback message after rendering history and chart
        console.log("renderWeightHistory: Weight history and chart rendered.");
    }

    function renderWeightChart() {
        console.log("renderWeightChart: Drawing weight chart.");
        if (weightHistory.length < 1 || !userProfile) {
            chartNoDataMessage.style.display = 'block';
            weightChartCanvas.style.display = 'none';
            if (weightChartInstance) { // Destroy existing chart if data is insufficient
                weightChartInstance.destroy();
                weightChartInstance = null;
            }
            console.log("renderWeightChart: Not enough data for chart.");
            return;
        }

        chartNoDataMessage.style.display = 'none';
        weightChartCanvas.style.display = 'block';

        const labels = weightHistory.map(entry => entry.date);
        const actualWeightData = weightHistory.map(entry => entry.weight);

        const expectedWeightData = [];
        const initialWeight = weightHistory[0].weight;
        const initialDate = new Date(weightHistory[0].date.split('/').reverse().join('-'));
        const targetWeight = userProfile.targetWeight;
        const targetDate = new Date(userProfile.targetDate + 'T23:59:59');

        const totalDurationMs = targetDate.getTime() - initialDate.getTime();
        const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);
        const totalWeightDifference = targetWeight - initialWeight;

        weightHistory.forEach(entry => {
            const currentDate = new Date(entry.date.split('/').reverse().join('-'));
            const daysPassedSinceInitial = (currentDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
            let expectedWeight;

            if (totalDurationDays > 0) {
                expectedWeight = initialWeight + (totalWeightDifference / totalDurationDays) * daysPassedSinceInitial;
            } else {
                expectedWeight = initialWeight;
            }
            expectedWeightData.push(parseFloat(expectedWeight.toFixed(1)));
        });

        const today = new Date();
        today.setHours(0,0,0,0);
        const lastLabelDate = new Date(labels[labels.length - 1].split('/').reverse().join('-'));
        lastLabelDate.setHours(0,0,0,0);

        if (today.getTime() > lastLabelDate.getTime()) {
            labels.push(today.toLocaleDateString('pt-BR'));
            const daysPassedSinceInitial = (today.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
            let expectedWeightToday;
            if (totalDurationDays > 0) {
                expectedWeightToday = initialWeight + (totalWeightDifference / totalDurationDays) * daysPassedSinceInitial;
            } else {
                expectedWeightToday = initialWeight;
            }
            expectedWeightData.push(parseFloat(expectedWeightToday.toFixed(1)));
            actualWeightData.push(null);
        }


        const ctx = weightChartCanvas.getContext('2d');

        if (weightChartInstance) {
            weightChartInstance.destroy();
        }

        weightChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Peso Atual',
                        data: actualWeightData,
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue'),
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        fill: false,
                        tension: 0.1,
                        pointRadius: 5,
                        pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--vibrant-blue'),
                        pointBorderColor: '#fff',
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Peso Esperado',
                        data: expectedWeightData,
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--vibrant-orange'),
                        backgroundColor: 'rgba(230, 126, 34, 0.2)',
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5],
                        pointRadius: 0
                    }
                ]
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
                            color: 'rgba(255, 255, 255, 0.1)'
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
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--text-light)'
                        }
                    }
                }
            }
        });
        console.log("renderWeightChart: Chart drawn successfully.");
    }


    function renderPastMealsHistory() {
        console.log("renderPastMealsHistory: Rendering past meals history.");
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
        console.log("renderPastMealsHistory: Past meals history rendered.");
    }


    function renderCustomFoodList() {
        console.log("renderCustomFoodList: Rendering custom food list.");
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
        console.log("renderCustomFoodList: Custom food list rendered.");
    }


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

    // Initialize the app on DOMContentLoaded
    initApp();

    // Set today's date as default for new weight entry
    newWeightDateInput.valueAsDate = new Date();

    // Show home page by default, or settings if no profile
    if (!userProfile) {
        showPage('settings-page');
    } else {
        showPage('home-page');
    }
});