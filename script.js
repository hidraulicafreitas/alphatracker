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
        if (!userProfileComplete()) {
            showWelcomeScreen();
        } else {
            renderUserProfile();
            updateProgressBars();
            renderMealGroups();
            renderCheckinHistory();
            renderWeightHistory();
            renderCustomFoodList();
            updateWeightPrediction();
            showPage('home-page');
        }
    }

    function showWelcomeScreen() {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        navButtons.forEach(btn => btn.style.display = 'none');
        document.getElementById('app-content').innerHTML = `
            <section id="welcome-page" class="page-content active">
                <h2 style="color: var(--vibrant-green); text-align: center; margin-bottom: 25px; font-family: 'Orbitron', sans-serif;">Bem-vindo ao Alpha Tracker!</h2>
                <p style="text-align: center; color: var(--text-light); font-size: 1.1em; margin-bottom: 30px;">
                    Para começar a controlar seus macros e seu progresso, precisamos de algumas informações sobre você.
                </p>
                <p style="text-align: center; color: var(--text-gray); font-size: 1em; margin-bottom: 40px;">
                    Por favor, preencha seu perfil na aba de configurações.
                </p>
                <button id="go-to-settings-btn" class="main-btn" style="display: block; margin: 0 auto;">Ir para Configurações</button>
            </section>
        `;
        document.getElementById('go-to-settings-btn').addEventListener('click', () => {
            navButtons.forEach(btn => btn.style.display = 'block');
            showPage('settings-page');
        });
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
        const targetDate = new Date(userProfile.targetDate + 'T23:59:59'); // Para incluir o dia inteiro
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const initialWeightEntry = weightHistory[0];
        const initialWeight = initialWeightEntry.weight;
        const initialDate = new Date(formatDateToISO(initialWeightEntry.date)); // Converter para YYYY-MM-DD para Date object
        initialDate.setHours(0, 0, 0, 0);

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
            statusMessage = `Você está no caminho certo! Seu peso atual (${lastWeight.toFixed(1)} Kg) está próximo do esperado (${expectedWeightToday.toFixed(1)} Kg).`;
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
                if (foodDatabase.some(food => removeAccents(food.name).toLowerCase() === removeAccents(e.target.value).toLowerCase())) {
                    // Alimento selecionado é válido
                } else {
                    e.target.value = ''; // Limpa se não for um alimento válido da lista
                }
            });
        });
    }

    // Função para remover acentos
    function removeAccents(str) {
        if (typeof str !== 'string' || str === null) return ''; // Garante que é uma string e não é nulo
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function handleFoodSearch(inputElement, dataListElement) {
        const searchTerm = removeAccents(inputElement.value).toLowerCase();
        dataListElement.innerHTML = '';

        if (searchTerm.length < 2) {
            return;
        }

        const filteredFoods = foodDatabase.filter(food =>
            removeAccents(food.name).toLowerCase().includes(searchTerm)
        ).sort((a, b) => removeAccents(a.name).localeCompare(removeAccents(b.name)));

        filteredFoods.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            dataListElement.appendChild(option);
        });
    }

    function renderCheckinHistory() {
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
    }

    function renderWeightHistory() {
        weightHistoryList.innerHTML = '';
        if (weightHistory.length === 0) {
            weightHistoryList.innerHTML = '<p class="no-data-message">Nenhum peso registrado ainda.</p>';
            return;
        }
        // Exibe os pesos em ordem cronológica reversa (mais recente primeiro)
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
    }

    function renderCustomFoodList() {
        customFoodList.innerHTML = '';
        const customFoods = foodDatabase.filter(food => food.isCustom);

        if (customFoods.length === 0) {
            customFoodList.innerHTML = '<p class="no-data-message">Nenhum alimento personalizado adicionado.</p>';
            return;
        }

        customFoods.forEach((food) => { // Removido o index do forEach pois o indexOf é mais seguro
            const listItem = document.createElement('li');
            const foodDatabaseIndex = foodDatabase.indexOf(food);
            listItem.innerHTML = `
                <div class="food-details">
                    <strong>${food.name}</strong>
                    <span>${food.kcalPer100g} Kcal | P: ${food.proteinPer100g}g | C: ${food.carbsPer100g}g | G: ${food.fatsPer100g}g</span>
                </div>
                <div class="food-actions">
                    <button class="edit-custom-food-btn" data-index="${foodDatabaseIndex}">Editar</button>
                    <button class="delete-custom-food-btn" data-index="${foodDatabaseIndex}">Excluir</button>
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


    // --- Funções de Interação ---

    function showPage(pageId) {
        const welcomePage = document.getElementById('welcome-page');
        if (welcomePage) {
            welcomePage.remove();
            navButtons.forEach(btn => btn.style.display = 'block');
        }

        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        navButtons.forEach(btn => btn.classList.remove('active'));
        const activeNavButton = document.getElementById(`nav-${pageId.replace('-page', '')}`);
        if (activeNavButton) {
            activeNavButton.classList.add('active');
        }

        if (pageId === 'weight-page') {
            renderWeightHistory();
            updateWeightPrediction();
            // Define a data atual no input de data do peso ao abrir a aba
            if (newWeightDateInput) { // Verifica se o elemento existe
                newWeightDateInput.valueAsDate = new Date();
            }
        }
        if (pageId === 'settings-page') {
            renderUserProfile();
            renderCustomFoodList();
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!userProfileComplete() && button.id !== 'nav-settings') {
                alert('Por favor, complete seu perfil na aba de Configurações antes de usar outras funcionalidades.');
                showPage('settings-page');
                return;
            }
            const pageId = button.id.replace('nav-', '') + '-page';
            showPage(pageId);
        });
    });

    function userProfileComplete() {
        return userProfile &&
               userProfile.name &&
               !isNaN(userProfile.age) &&
               !isNaN(userProfile.height) &&
               userProfile.gender &&
               !isNaN(userProfile.currentWeight) &&
               !isNaN(userProfile.targetWeight) &&
               userProfile.activityFactor && // Já é um número de 1.2 a 1.9
               userProfile.targetDate; // targetDate é uma string de data
    }


    profileForm.addEventListener('submit', saveProfile);

    addMealGroupBtn.addEventListener('click', () => {
        const mealGroupName = prompt('Qual o nome do grupo de refeição? (Ex: Café da Manhã)');
        if (mealGroupName) {
            dailyData.mealGroups.push({
                name: mealGroupName,
                foods: [],
                totalKcal: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0
            });
            localStorage.setItem('dailyData', JSON.stringify(dailyData));
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

        // Usa removeAccents para a comparação na busca por foodInfo
        const foodInfo = foodDatabase.find(food => removeAccents(food.name).toLowerCase() === removeAccents(foodName).toLowerCase());
        if (foodInfo) {
            const factor = quantity / 100;
            const kcal = Math.round(foodInfo.kcalPer100g * factor);
            const protein = parseFloat((foodInfo.proteinPer100g * factor).toFixed(1));
            const carbs = parseFloat((foodInfo.carbsPer100g * factor).toFixed(1));
            const fats = parseFloat((foodInfo.fatsPer100g * factor).toFixed(1));

            dailyData.mealGroups[groupIndex].foods.push({
                name: foodInfo.name, // Usa o nome do banco de dados para consistência
                quantity,
                kcal,
                protein,
                carbs,
                fats
            });

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
            dailyData.mealGroups.splice(groupIndex, 1);
        }

        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        renderMealGroups();
        updateProgressBars();
    }

    function removeMealGroup(event) {
        const groupIndex = parseInt(event.target.dataset.groupIndex);

        if (confirm(`Tem certeza que deseja remover o grupo de refeição "${dailyData.mealGroups[groupIndex].name}"? Todos os alimentos dentro dele também serão removidos.`)) {
            const groupToRemove = dailyData.mealGroups[groupIndex];

            dailyData.consumedCalories -= groupToRemove.totalKcal;
            dailyData.consumedProtein -= groupToRemove.totalProtein;
            dailyData.consumedCarbs -= groupToRemove.totalCarbs;
            dailyData.consumedFats -= groupToRemove.totalFats;

            dailyData.mealGroups.splice(groupIndex, 1);
            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            renderMealGroups();
            updateProgressBars();
            alert('Grupo de refeição removido.');
        }
    }

    saveCheckinBtn.addEventListener('click', () => {
        const today = new Date().toLocaleDateString('pt-BR');
        const existingCheckinIndex = checkinHistory.findIndex(entry => entry.date === today);

        const currentCheckinState = {
            sleep: document.getElementById('check-sleep').checked,
            workout: document.getElementById('check-workout').checked,
            diet: document.getElementById('check-diet').checked,
            nofap: document.getElementById('check-nofap').checked,
        };

        if (existingCheckinIndex !== -1) {
            checkinHistory[existingCheckinIndex] = { date: today, ...currentCheckinState };
        } else {
            checkinHistory.push({ date: today, ...currentCheckinState });
        }

        localStorage.setItem('checkinHistory', JSON.stringify(checkinHistory));
        localStorage.setItem('currentDayCheckinState', JSON.stringify(currentCheckinState));
        renderCheckinHistory();
        alert('Check-in salvo!');
    });

    // Função auxiliar para converter "yyyy-mm-dd" para "dd/mm/yyyy"
    function formatDateToBR(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // Função auxiliar para converter "dd/mm/yyyy" para "yyyy-mm-dd" (para criar Date objects)
    function formatDateToISO(dateString) {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }

    // Função para adicionar/atualizar um registro de peso no histórico, mantendo-o ordenado
    function addWeightEntry(weight, dateStringBR) { // dateStringBR é no formato DD/MM/YYYY
        const dateToAddBR = dateStringBR;

        const existingEntryIndex = weightHistory.findIndex(entry => entry.date === dateToAddBR);

        if (existingEntryIndex !== -1) {
            weightHistory[existingEntryIndex].weight = parseFloat(weight.toFixed(1));
        } else {
            weightHistory.push({ date: dateToAddBR, weight: parseFloat(weight.toFixed(1)) });
        }

        // Ordena o histórico por data (do mais antigo ao mais recente)
        weightHistory.sort((a, b) => {
            const dateA = new Date(formatDateToISO(a.date));
            const dateB = new Date(formatDateToISO(b.date));
            return dateA - dateB;
        });
        localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
    }


    addWeightEntryBtn.addEventListener('click', () => {
        const weight = parseFloat(newCurrentWeightInput.value);
        const dateISO = newWeightDateInput.value; // Pega a data no formato YYYY-MM-DD

        if (isNaN(weight) || weight <= 0) {
            alert('Por favor, insira um peso válido.');
            return;
        }
        if (!dateISO) {
            alert('Por favor, selecione uma data para o registro do peso.');
            return;
        }

        const formattedDateBR = formatDateToBR(dateISO); // Converte para DD/MM/YYYY para armazenar

        // Chama a função auxiliar para adicionar/atualizar o peso e ordenar
        addWeightEntry(weight, formattedDateBR);

        // Atualiza o userProfile.currentWeight para o último peso no histórico (após a ordenação)
        if (userProfile && weightHistory.length > 0) {
            userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        renderWeightHistory();
        updateProgressBars();
        updateWeightPrediction();
        newCurrentWeightInput.value = '';
        newWeightDateInput.valueAsDate = new Date(); // Reseta a data para hoje
        alert('Peso registrado com sucesso!');
    });


    function editWeightEntry(event) {
        const index = parseInt(event.target.dataset.index);
        const entryToEdit = weightHistory[index];

        const newWeight = prompt(`Editar peso para ${entryToEdit.weight} Kg. Insira o novo peso:`, entryToEdit.weight);
        if (newWeight === null) return;

        const parsedNewWeight = parseFloat(newWeight);
        if (isNaN(parsedNewWeight) || parsedNewWeight <= 0) {
            alert('Por favor, insira um peso válido.');
            return;
        }

        // Converte a data atual para YYYY-MM-DD para usar no prompt de data tipo date
        const currentISODate = formatDateToISO(entryToEdit.date);
        let newDateISO = prompt(`Editar data para ${entryToEdit.date}. Insira a nova data (AAAA-MM-DD):`, currentISODate);
        if (newDateISO === null) return;

        // Valida o formato AAAA-MM-DD e se é uma data real
        const testDate = new Date(newDateISO + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
        if (isNaN(testDate.getTime())) {
            alert('Data inválida. Por favor, insira uma data real no formato AAAA-MM-DD.');
            return;
        }

        const formattedNewDateBR = formatDateToBR(newDateISO); // Converte para DD/MM/YYYY para armazenamento

        // Verifica se a nova data já existe para outro registro (exceto para o próprio registro sendo editado)
        const existingDateIndex = weightHistory.findIndex((entry, i) => i !== index && entry.date === formattedNewDateBR);
        if (existingDateIndex !== -1) {
            alert('Já existe um registro de peso para esta data. Por favor, escolha outra data ou edite o registro existente.');
            return;
        }

        entryToEdit.weight = parseFloat(parsedNewWeight.toFixed(1));
        entryToEdit.date = formattedNewDateBR; // Armazena no formato BR

        // Após a edição, reordena o histórico e salva
        weightHistory.sort((a, b) => {
            const dateA = new Date(formatDateToISO(a.date));
            const dateB = new Date(formatDateToISO(b.date));
            return dateA - dateB;
        });
        localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

        // Atualiza userProfile.currentWeight se o peso editado for o último no histórico (após a reordenação)
        if (userProfile && weightHistory.length > 0) {
             userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
             localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        renderWeightHistory();
        updateProgressBars();
        updateWeightPrediction();
        alert('Peso e data atualizados com sucesso!');
    }


    function deleteWeightEntry(event) {
        const index = parseInt(event.target.dataset.index);
        if (confirm(`Tem certeza que deseja excluir o registro de peso de ${weightHistory[index].weight} Kg em ${weightHistory[index].date}?`)) {
            weightHistory.splice(index, 1);
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));

            if (userProfile) {
                // Atualiza o currentWeight para o último peso restante ou 0 se não houver mais registros
                userProfile.currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            }
            renderWeightHistory();
            updateProgressBars();
            updateWeightPrediction();
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

        // Usa removeAccents para a comparação
        const existingFood = foodDatabase.find(food => removeAccents(food.name).toLowerCase() === removeAccents(customFoodName).toLowerCase());
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

        // Usa removeAccents para a comparação
        const existingFoodWithNewName = foodDatabase.find((food, i) => i !== index && removeAccents(food.name).toLowerCase() === removeAccents(newName).toLowerCase());
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
    });

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

    initApp();
});
