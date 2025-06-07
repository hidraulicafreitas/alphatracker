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

    // Elemento da página de boas-vindas
    const welcomePage = document.getElementById('welcome-page');

    // Elementos de progresso na Home Page
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

    // Campo de data final da meta
    const targetDateInput = document.getElementById('target-date');

    // --- Dados do Aplicativo (simulando um "banco de dados" com LocalStorage) ---
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

    // "Banco de dados" de alimentos comum e personalizado
    let foodDatabase = JSON.parse(localStorage.getItem('foodDatabase')) || [];
    let defaultFoods = [
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
        // Proteínas
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
        // Carboidratos
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
        // Gorduras e Outros
        { name: 'Azeite de Oliva Extra Virgem', kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100, isCustom: false },
        { name: 'Pasta de Amendoim Natural', kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50, isCustom: false },
        { name: 'Amêndoas', kcalPer100g: 579, proteinPer100g: 21, carbsPer100g: 21, fatsPer100g: 49, isCustom: false },
        { name: 'Castanha do Pará', kcalPer100g: 659, proteinPer100g: 14, carbsPer100g: 12, fatsPer100g: 66, isCustom: false },
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
        // Novos alimentos adicionados
        { name: 'Leite Integral', kcalPer100g: 60, proteinPer100g: 3.2, carbsPer100g: 4.8, fatsPer100g: 3.3, isCustom: false },
        { name: 'Leite Desnatado', kcalPer100g: 35, proteinPer100g: 3.4, carbsPer100g: 4.9, fatsPer100g: 0.1, isCustom: false },
        { name: 'Farinha de Tapioca', kcalPer100g: 350, proteinPer100g: 0.2, carbsPer100g: 87, fatsPer100g: 0.1, isCustom: false },
    ];
    if (foodDatabase.length === 0 || !foodDatabase.some(food => !food.isCustom)) {
        const currentCustomFoods = foodDatabase.filter(food => food.isCustom);
        foodDatabase = defaultFoods.concat(currentCustomFoods);
        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
    }


    // --- Funções de Inicialização e Renderização ---

    function initApp() {
        checkDailyReset();

        // PASSO IMPORTANTE PARA TESTE: Limpar userProfile para forçar a tela de boas-vindas.
        // Se você já tem um perfil salvo e quer ver a tela de boas-vindas,
        // DESCOMENTE A LINHA ABAIXO, SALVE E RECARREGUE A PÁGINA.
        // LEMBRE-SE DE COMENTAR OU REMOVER ELA DEPOIS DE TESTAR,
        // para não apagar os dados do usuário a cada carregamento!
        // localStorage.removeItem('userProfile');
        // userProfile = null; // Garante que a variável local reflita a remoção do localStorage


        if (!userProfileComplete()) {
            // Se o perfil não estiver completo, mostra APENAS a tela de boas-vindas
            // e esconde os botões de navegação e as outras páginas.
            // Esconde TODAS as seções de conteúdo que são filhas diretas de 'main'
            document.querySelectorAll('main > section').forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none'; // Garante que estejam escondidas via estilo inline
            });

            if (welcomePage) {
                welcomePage.style.display = 'block'; // Torna a welcomePage visível
            }
            navButtons.forEach(btn => btn.style.display = 'none'); // Esconde a navegação

            // Adiciona o listener do botão da welcome page aqui, onde temos certeza que o botão existe
            setupWelcomeButtonListener();

        } else {
            // Caso contrário, o perfil está completo.
            // Esconde a welcomePage (se ela estiver visível por algum motivo)
            if (welcomePage) {
                welcomePage.style.display = 'none';
            }
            // Mostra os botões de navegação
            navButtons.forEach(btn => btn.style.display = 'block');
            // Renderiza o perfil e mostra a página inicial
            renderUserProfile();
            updateProgressBars();
            renderMealGroups();
            renderCheckinHistory();
            renderWeightHistory();
            renderCustomFoodList();
            updateWeightPrediction();
            showPage('home-page'); // Mostra a página inicial por padrão
        }
    }

    // Função dedicada para configurar o listener do botão da tela de boas-vindas
    function setupWelcomeButtonListener() {
        const goToSettingsBtn = document.getElementById('go-to-settings-btn');
        if (goToSettingsBtn) {
            // Remove qualquer listener existente antes de adicionar um novo para evitar duplicação
            // Isso é importante pois initApp pode ser chamada mais de uma vez em cenários complexos
            if (typeof goToSettingsBtn._currentClickListener === 'function') {
                goToSettingsBtn.removeEventListener('click', goToSettingsBtn._currentClickListener);
            }

            const newClickListener = () => {
                // Ao clicar no botão, mostra os botões de navegação e redireciona para configurações
                navButtons.forEach(btn => btn.style.display = 'block');
                showPage('settings-page');
            };
            goToSettingsBtn.addEventListener('click', newClickListener);
            // Armazena a referência do listener para poder removê-lo no futuro
            goToSettingsBtn._currentClickListener = newClickListener;
        }
    }


    function checkDailyReset() {
        const today = new Date().toLocaleDateString('pt-BR');
        if (dailyData.date !== today) {
            console.log("Reiniciando dados diários...");
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
        } else {
            userNameSpan.textContent = 'Guerreiro';
        }
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
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const gender = document.getElementById('gender').value;
        const currentWeight = parseFloat(document.getElementById('current-weight-settings').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);
        const activityFactor = parseFloat(document.getElementById('activity-factor').value);
        const targetDate = document.getElementById('target-date').value;

        if (!name || isNaN(age) || isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight) || isNaN(activityFactor) || !targetDate) {
            alert('Por favor, preencha todos os campos do perfil corretamente, incluindo a data final da meta.');
            return;
        }

        const dailyCaloricNeeds = calculateDailyCaloricNeeds(currentWeight, height, age, gender, activityFactor);
        const caloricDeficit = dailyCaloricNeeds * 0.20;
        const targetCalories = Math.round(dailyCaloricNeeds - caloricDeficit);

        const targetProtein = Math.round((targetCalories * 0.40) / 4);
        const targetCarbs = Math.round((targetCalories * 0.40) / 4);
        const targetFats = Math.round((targetCalories * 0.20) / 9);

        userProfile = {
            name, age, height, gender, currentWeight, targetWeight, activityFactor, targetDate,
            dailyCaloricNeeds: Math.round(dailyCaloricNeeds),
            targetCalories,
            targetProtein,
            targetCarbs,
            targetFats
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Ao salvar o perfil, adicione o currentWeight ao histórico se ainda não houver nenhum ou se for diferente do último.
        // A data será a de hoje.
        if (weightHistory.length === 0 || (weightHistory.length > 0 && weightHistory[weightHistory.length - 1].weight !== currentWeight)) {
            addWeightEntry(currentWeight, new Date().toLocaleDateString('pt-BR'));
        }

        renderUserProfile();
        updateProgressBars();
        updateWeightPrediction();
        alert('Perfil salvo e metas recalculadas!');

        // Garante que os botões de navegação estejam visíveis após preencher o perfil
        navButtons.forEach(btn => btn.style.display = 'block');
        showPage('home-page');
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
            return;
        }

        let caloriesPercentage = (dailyData.consumedCalories / userProfile.targetCalories) * 100;
        caloriesPercentage = Math.min(caloriesPercentage, 100);
        caloriesProgressBar.style.width = `${caloriesPercentage}%`;
        caloriesNum.textContent = `${dailyData.consumedCalories} / ${userProfile.targetCalories} Kcal`;
        caloriesProgressBar.style.backgroundColor = dailyData.consumedCalories > userProfile.targetCalories ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-green');

        let proteinPercentage = (dailyData.consumedProtein / userProfile.targetProtein) * 100;
        proteinPercentage = Math.min(proteinPercentage, 100);
        proteinProgressBar.style.width = `${proteinPercentage}%`;
        proteinNum.textContent = `${dailyData.consumedProtein.toFixed(1)} / ${userProfile.targetProtein} g`;
        proteinProgressBar.style.backgroundColor = dailyData.consumedProtein > userProfile.targetProtein ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-green');

        let carbsPercentage = (dailyData.consumedCarbs / userProfile.targetCarbs) * 100;
        carbsPercentage = Math.min(carbsPercentage, 100);
        carbsProgressBar.style.width = `${carbsPercentage}%`;
        carbsNum.textContent = `${dailyData.consumedCarbs.toFixed(1)} / ${userProfile.targetCarbs} g`;
        carbsProgressBar.style.backgroundColor = dailyData.consumedCarbs > userProfile.targetCarbs ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-green');

        let fatsPercentage = (dailyData.consumedFats / userProfile.targetFats) * 100;
        fatsPercentage = Math.min(fatsPercentage, 100);
        fatsProgressBar.style.width = `${fatsPercentage}%`;
        fatsNum.textContent = `${dailyData.consumedFats.toFixed(1)} / ${userProfile.targetFats} g`;
        fatsProgressBar.style.backgroundColor = dailyData.consumedFats > userProfile.targetFats ? getComputedStyle(document.documentElement).getPropertyValue('--vibrant-red') : getComputedStyle(document.documentElement).getPropertyValue('--vibrant-green');

        // Peso
        // Garante que userProfile.currentWeight esteja sempre atualizado com o último peso do histórico
        if (weightHistory.length > 0) {
            userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        const currentWeight = userProfile.currentWeight;
        const targetWeight = userProfile.targetWeight;
        let weightProgress;
        let weightDiffMessage = '';

        if (currentWeight === targetWeight) {
            weightProgress = 100;
            weightDiffMessage = `Parabéns! Você atingiu sua meta de ${targetWeight.toFixed(1)} Kg!`;
        } else if (weightHistory.length > 0) {
            const initialWeight = weightHistory[0].weight; // Primeiro peso registrado
            const diffValue = Math.abs(currentWeight - initialWeight).toFixed(1);
            let action = '';

            if (currentWeight < initialWeight) {
                action = `perdeu`;
            } else if (currentWeight > initialWeight) {
                action = `ganhou`;
            }

            if (initialWeight === targetWeight) {
                weightProgress = 100;
                weightDiffMessage = `Meta de peso é ${targetWeight.toFixed(1)} Kg.`;
            } else if (targetWeight < initialWeight) { // Meta de perda de peso
                const totalToLose = initialWeight - targetWeight;
                const progressToLose = initialWeight - currentWeight;
                weightProgress = (progressToLose / totalToLose) * 100;
                weightProgress = Math.max(0, Math.min(weightProgress, 100));
                const remaining = (currentWeight - targetWeight).toFixed(1);
                weightDiffMessage = `Você ${action} ${diffValue} Kg até agora. Faltam ${remaining} Kg para atingir ${targetWeight.toFixed(1)} Kg!`;
            } else if (targetWeight > initialWeight) { // Meta de ganho de peso
                const totalToGain = targetWeight - initialWeight;
                const progressToGain = currentWeight - initialWeight;
                weightProgress = (progressToGain / totalToGain) * 100;
                weightProgress = Math.max(0, Math.min(weightProgress, 100));
                const remaining = (targetWeight - currentWeight).toFixed(1);
                weightDiffMessage = `Você ${action} ${diffValue} Kg até agora. Faltam ${remaining} Kg para atingir ${targetWeight.toFixed(1)} Kg!`;
            }
        } else { // Sem histórico de peso, apenas mostra a diferença inicial
            weightProgress = 0;
            const remaining = Math.abs(currentWeight - targetWeight).toFixed(1);
            weightDiffMessage = `Faltam ${remaining} Kg para atingir sua meta.`;
        }

        weightProgressBar.style.width = `${weightProgress}%`;
        weightProgressBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--vibrant-green');
        weightNum.textContent = `${currentWeight.toFixed(1)} Kg / ${targetWeight.toFixed(1)} Kg`;
        weightRemainingText.textContent = weightDiffMessage;
    }

    function updateWeightPrediction() {
        if (!userProfile || weightHistory.length < 2 || !userProfile.targetDate) {
            weightPredictionText.textContent = 'Registre mais pesos e defina a data final da meta para uma previsão.';
            return;
        }

        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        const targetWeight = userProfile.targetWeight;
        const targetDate = new Date(userProfile.targetDate + 'T23:59:57-03:00'); // Fuso horário do Brasil -03
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const initialWeightEntry = weightHistory[0];
        const initialWeight = initialWeightEntry.weight;
        // Adaptação da data para garantir consistência no fuso horário
        const initialDateParts = initialWeightEntry.date.split('/');
        const initialDate = new Date(`<span class="math-inline">\{initialDateParts\[2\]\}\-</span>{initialDateParts[1]}-${initialDateParts[0]}T00:00:00-03:00`); // Fuso horário do Brasil -03


        const daysTotal = (targetDate - today) / (1000 * 60 * 60 * 24);
        const daysPassedSinceStart = (today - initialDate) / (1000 * 60 * 60 * 24);

        if (daysTotal <= 0) {
            weightPredictionText.textContent = 'A data final da meta deve ser no futuro.';
            if (Math.abs(lastWeight - targetWeight) < 0.1) {
                weightPredictionText.textContent = `**Meta atingida!** Seu peso atual é ${lastWeight.toFixed(1)} Kg.`;
            } else if (today > targetDate) {
                weightPredictionText.textContent = `A data da sua meta (${userProfile.targetDate}) já passou. Você terminou em ${lastWeight.toFixed(1)} Kg.`;
            }
            return;
        }

        const requiredChangePerDay = (targetWeight - initialWeight) / ((targetDate - initialDate) / (1000 * 60 * 60 * 24));
        const expectedWeightToday = initialWeight + (requiredChangePerDay * daysPassedSinceStart);

        let statusMessage = '';
        if (Math.abs(lastWeight - targetWeight) < 0.1) {
            statusMessage = `**Meta atingida!** Seu peso atual é ${lastWeight.toFixed(1)} Kg.`;
        } else if (Math.abs(lastWeight - expectedWeightToday) < 0.5) { // Margem de erro de 0.5kg
            statusMessage = `Você está no caminho certo! Seu peso atual (<span class="math-inline">\{lastWeight\.toFixed\(1\)\} Kg\) está próximo do esperado \(</span>{expectedWeightToday.toFixed(1)} Kg).`;
        } else if (userProfile.targetWeight > initialWeight) { // Meta de ganho
            if (lastWeight > expectedWeightToday) {
                statusMessage = `Você está adiantado na sua meta de ganho de peso! Atual: ${lastWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de ganho de peso. Atual: ${lastWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        } else { // Meta de perda
            if (lastWeight < expectedWeightToday) {
                statusMessage = `Você está adiantado na sua meta de perda de peso! Atual: ${lastWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            } else {
                statusMessage = `Você está um pouco atrasado na sua meta de perda de peso. Atual: ${lastWeight.toFixed(1)} Kg, Esperado: ${expectedWeightToday.toFixed(1)} Kg.`;
            }
        }
        weightPredictionText.textContent = statusMessage;
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
                    <span class="meal-total-macros">Total: ${group.totalKcal} Kcal | P: ${group.totalProtein.toFixed(1)}g | C: ${group.totalCarbs.toFixed(1)}g | G: <span class="math-inline">\{group\.totalFats\.toFixed\(1\)\}g</span\>
