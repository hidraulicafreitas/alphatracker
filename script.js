document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navButtons = document.querySelectorAll('nav button');
    const registerProfileBtn = document.getElementById('register-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const addMealGroupBtn = document.getElementById('add-meal-group-btn');
    const mealGroupsContainer = document.getElementById('meal-groups-container');
    const saveCheckinBtn = document.getElementById('save-checkin-btn');
    const checkinCheckboxes = document.querySelectorAll('#checkin-page input[type="checkbox"]');
    const checkinHistoryList = document.getElementById('checkin-history-list');
    const weightHistoryList = document.getElementById('weight-history-list');

    // Elementos de progresso
    const userNameSpan = document.getElementById('user-name');
    const caloriesProgressBar = document.getElementById('calories-progress');
    const caloriesText = document.getElementById('calories-text');
    const proteinProgressBar = document.getElementById('protein-progress');
    const proteinText = document.getElementById('protein-text');
    const carbsProgressBar = document.getElementById('carbs-progress');
    const carbsText = document.getElementById('carbs-text');
    const fatsProgressBar = document.getElementById('fats-progress');
    const fatsText = document.getElementById('fats-text');
    const weightProgressBar = document.getElementById('weight-progress');
    const weightText = document.getElementById('weight-text');
    const weightPredictionText = document.getElementById('weight-prediction-text');

    // --- Dados do Aplicativo (simulando um "banco de dados" com LocalStorage) ---
    let userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;
    let dailyData = JSON.parse(localStorage.getItem('dailyData')) || {
        date: new Date().toLocaleDateString(),
        consumedCalories: 0,
        consumedProtein: 0,
        consumedCarbs: 0,
        consumedFats: 0,
        mealGroups: []
    };
    let checkinHistory = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];

    // "Banco de dados" de alimentos simplificado (realmente viria de um backend)
    const foodDatabase = [
        { name: 'Frango Grelhado', kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6 },
        { name: 'Arroz Branco Cozido', kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatsPer100g: 0.3 },
        { name: 'Batata Doce Cozida', kcalPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatsPer100g: 0.1 },
        { name: 'Ovo Cozido', kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatsPer100g: 11 },
        { name: 'Aveia', kcalPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatsPer100g: 6.9 },
        { name: 'Pão Integral', kcalPer100g: 265, proteinPer100g: 13, carbsPer100g: 45, fatsPer100g: 3.5 },
        { name: 'Leite Semi-desnatado', kcalPer100g: 47, proteinPer100g: 3.2, carbsPer100g: 4.8, fatsPer100g: 1.6 },
        { name: 'Maçã', kcalPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatsPer100g: 0.2 },
        { name: 'Brócolis Cozido', kcalPer100g: 55, proteinPer100g: 3.7, carbsPer100g: 11.2, fatsPer100g: 0.6 },
        { name: 'Azeite de Oliva', kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100 },
        { name: 'Salmão Grelhado', kcalPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 13 },
        { name: 'Whey Protein', kcalPer100g: 370, proteinPer100g: 80, carbsPer100g: 5, fatsPer100g: 5 },
        { name: 'Pasta de Amendoim', kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50 },
    ];

    // --- Funções de Inicialização e Renderização ---

    function initApp() {
        checkDailyReset();
        renderUserProfile();
        updateProgressBars();
        renderMealGroups();
        renderCheckinHistory();
        renderWeightHistory();
        updateWeightPrediction();
    }

    function checkDailyReset() {
        const today = new Date().toLocaleDateString();
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
            // Também reinicia os checkboxes de check-in para o novo dia
            checkinCheckboxes.forEach(checkbox => checkbox.checked = false);
            localStorage.removeItem('currentDayCheckinState'); // Remove o estado salvo do dia anterior
        } else {
            // Se for o mesmo dia, carrega o estado dos checkboxes
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
            document.getElementById('current-weight').value = userProfile.currentWeight;
            document.getElementById('target-weight').value = userProfile.targetWeight;
        } else {
            userNameSpan.textContent = 'Guerreiro';
            // Se não tiver perfil, abre a página de cadastro automaticamente
            showPage('profile-page');
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.getElementById('nav-home').classList.remove('active'); // Remove active do início se for para perfil
        }
    }

    function calculateDailyCaloricNeeds(weight, height, age, gender) {
        let tmb; // Taxa Metabólica Basal
        if (gender === 'male') {
            tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        } else { // female
            tmb = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Fator de Atividade (simplificado para o exemplo)
        // Sedentário (pouco ou nenhum exercício): TMB * 1.2
        // Levemente ativo (exercício 1-3 dias/semana): TMB * 1.375
        // Moderadamente ativo (exercício 3-5 dias/semana): TMB * 1.55
        // Muito ativo (exercício 6-7 dias/semana): TMB * 1.725
        // Extremamente ativo (exercício diário/trabalho físico): TMB * 1.9
        const activityFactor = 1.55; // Assumindo atividade moderada para o cálculo padrão

        return tmb * activityFactor;
    }

    function saveProfile(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const gender = document.getElementById('gender').value;
        const currentWeight = parseFloat(document.getElementById('current-weight').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);

        if (!name || isNaN(age) || isNaN(height) || isNaN(currentWeight) || isNaN(targetWeight)) {
            alert('Por favor, preencha todos os campos do perfil corretamente.');
            return;
        }

        const dailyCaloricNeeds = calculateDailyCaloricNeeds(currentWeight, height, age, gender);
        const caloricDeficit = dailyCaloricNeeds * 0.20; // 20% de déficit
        const targetCalories = Math.round(dailyCaloricNeeds - caloricDeficit);

        // Metas de macronutrientes (exemplo: Proteína 40%, Carboidrato 40%, Gordura 20%)
        // 1g Proteína = 4 Kcal
        // 1g Carboidrato = 4 Kcal
        // 1g Gordura = 9 Kcal
        const targetProtein = Math.round((targetCalories * 0.40) / 4);
        const targetCarbs = Math.round((targetCalories * 0.40) / 4);
        const targetFats = Math.round((targetCalories * 0.20) / 9);

        userProfile = {
            name, age, height, gender, currentWeight, targetWeight,
            dailyCaloricNeeds: Math.round(dailyCaloricNeeds),
            targetCalories,
            targetProtein,
            targetCarbs,
            targetFats
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Se o peso atual for diferente do último registrado ou se for a primeira vez
        if (weightHistory.length === 0 || weightHistory[weightHistory.length - 1].weight !== currentWeight) {
            addWeightEntry(currentWeight);
        }

        renderUserProfile();
        updateProgressBars();
        updateWeightPrediction();
        showPage('home-page');
    }

    function updateProgressBars() {
        if (!userProfile) {
            caloriesText.textContent = '0 / 0 Kcal';
            caloriesProgressBar.style.width = '0%';
            proteinText.textContent = '0 / 0 g';
            proteinProgressBar.style.width = '0%';
            carbsText.textContent = '0 / 0 g';
            carbsProgressBar.style.width = '0%';
            fatsText.textContent = '0 / 0 g';
            fatsProgressBar.style.width = '0%';
            weightText.textContent = '0 Kg / 0 Kg (Faltam 0 Kg)';
            weightProgressBar.style.width = '0%';
            return;
        }

        // Calorias
        let caloriesPercentage = (dailyData.consumedCalories / userProfile.targetCalories) * 100;
        caloriesPercentage = Math.min(caloriesPercentage, 100); // Não ultrapassar 100% visualmente
        caloriesProgressBar.style.width = `${caloriesPercentage}%`;
        caloriesText.textContent = `${dailyData.consumedCalories} / ${userProfile.targetCalories} Kcal`;
        caloriesProgressBar.style.backgroundColor = dailyData.consumedCalories > userProfile.targetCalories ? varColor('vibrant-red') : varColor('vibrant-green');

        // Proteína
        let proteinPercentage = (dailyData.consumedProtein / userProfile.targetProtein) * 100;
        proteinPercentage = Math.min(proteinPercentage, 100);
        proteinProgressBar.style.width = `${proteinPercentage}%`;
        proteinText.textContent = `${dailyData.consumedProtein} / ${userProfile.targetProtein} g`;
        proteinProgressBar.style.backgroundColor = dailyData.consumedProtein > userProfile.targetProtein ? varColor('vibrant-red') : varColor('vibrant-green');

        // Carboidratos
        let carbsPercentage = (dailyData.consumedCarbs / userProfile.targetCarbs) * 100;
        carbsPercentage = Math.min(carbsPercentage, 100);
        carbsProgressBar.style.width = `${carbsPercentage}%`;
        carbsText.textContent = `${dailyData.consumedCarbs} / ${userProfile.targetCarbs} g`;
        carbsProgressBar.style.backgroundColor = dailyData.consumedCarbs > userProfile.targetCarbs ? varColor('vibrant-red') : varColor('vibrant-green');

        // Gorduras
        let fatsPercentage = (dailyData.consumedFats / userProfile.targetFats) * 100;
        fatsPercentage = Math.min(fatsPercentage, 100);
        fatsProgressBar.style.width = `${fatsPercentage}%`;
        fatsText.textContent = `${dailyData.consumedFats} / ${userProfile.targetFats} g`;
        fatsProgressBar.style.backgroundColor = dailyData.consumedFats > userProfile.targetFats ? varColor('vibrant-red') : varColor('vibrant-green');

        // Peso
        const currentWeight = userProfile.currentWeight;
        const targetWeight = userProfile.targetWeight;
        const totalWeightDiff = Math.abs(currentWeight - targetWeight);
        const currentWeightReached = Math.abs(currentWeight - weightHistory[weightHistory.length -1].weight); // Diferença do peso inicial
        let weightProgress;

        if (currentWeight > targetWeight) { // Perder peso
            weightProgress = ((currentWeight - weightHistory[weightHistory.length -1].weight) / (currentWeight - targetWeight)) * 100;
            weightProgress = Math.min(weightProgress, 100);
            weightProgressBar.style.width = `${weightProgress}%`;
            weightProgressBar.style.backgroundColor = varColor('vibrant-green');
            const remaining = (currentWeight - targetWeight).toFixed(1);
            weightText.textContent = `${weightHistory[weightHistory.length - 1].weight} Kg / ${targetWeight} Kg (Faltam ${remaining} Kg)`;

        } else if (currentWeight < targetWeight) { // Ganhar peso
            weightProgress = ((weightHistory[weightHistory.length -1].weight - currentWeight) / (targetWeight - currentWeight)) * 100;
            weightProgress = Math.min(weightProgress, 100);
            weightProgressBar.style.width = `${weightProgress}%`;
            weightProgressBar.style.backgroundColor = varColor('vibrant-green');
            const remaining = (targetWeight - currentWeight).toFixed(1);
            weightText.textContent = `${weightHistory[weightHistory.length - 1].weight} Kg / ${targetWeight} Kg (Faltam ${remaining} Kg)`;
        } else { // Já está na meta
            weightProgressBar.style.width = '100%';
            weightProgressBar.style.backgroundColor = varColor('vibrant-green');
            weightText.textContent = `${targetWeight} Kg / ${targetWeight} Kg (Meta Atingida!)`;
        }

        // Atualiza o userProfile.currentWeight com o último peso registrado
        if (weightHistory.length > 0) {
            userProfile.currentWeight = weightHistory[weightHistory.length - 1].weight;
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
    }


    function updateWeightPrediction() {
        if (!userProfile || weightHistory.length < 2) {
            weightPredictionText.textContent = 'Registre mais pesos para uma previsão.';
            return;
        }

        const initialWeight = weightHistory[0].weight;
        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        const daysPassed = (new Date() - new Date(weightHistory[0].date)) / (1000 * 60 * 60 * 24);

        if (daysPassed <= 0) { // Evita divisão por zero ou previsão incorreta para o mesmo dia
            weightPredictionText.textContent = 'Aguardando mais dados para a previsão de peso.';
            return;
        }

        const weightChangeRatePerDay = (lastWeight - initialWeight) / daysPassed;
        const targetWeight = userProfile.targetWeight;
        const remainingWeightChange = targetWeight - lastWeight;

        if (Math.abs(weightChangeRatePerDay) < 0.01) { // Evita divisão por zero se não houver mudança de peso
            weightPredictionText.textContent = 'Não há mudança de peso suficiente para fazer uma previsão.';
            return;
        }

        const estimatedDaysToTarget = Math.round(remainingWeightChange / weightChangeRatePerDay);

        if (estimatedDaysToTarget > 0) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + estimatedDaysToTarget);
            weightPredictionText.textContent = `Com base no seu progresso, você deve atingir sua meta de ${targetWeight} Kg por volta de ${targetDate.toLocaleDateString()}.`;
        } else if (estimatedDaysToTarget <= 0 && Math.abs(lastWeight - targetWeight) < 0.1) {
            weightPredictionText.textContent = `Parabéns! Você está muito perto ou já atingiu sua meta de ${targetWeight} Kg!`;
        } else {
            weightPredictionText.textContent = `A previsão indica que você está se afastando da sua meta de ${targetWeight} Kg. Revise sua estratégia!`;
        }
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
                    <span class="meal-total-macros">Total: ${group.totalKcal} Kcal | P: ${group.totalProtein}g | C: ${group.totalCarbs}g | G: ${group.totalFats}g</span>
                </h4>
                <ul class="meal-items-list" id="meal-list-${groupIndex}">
                    ${group.foods.map((food, foodIndex) => `
                        <li class="meal-item">
                            <div class="meal-item-details">
                                ${food.name} (${food.quantity}g)
                                <span>${food.kcal} Kcal | P: ${food.protein}g | C: ${food.carbs}g | G: ${food.fats}g</span>
                            </div>
                            <button data-group-index="${groupIndex}" data-food-index="${foodIndex}">Remover</button>
                        </li>
                    `).join('')}
                </ul>
                <form class="add-food-form" data-group-index="${groupIndex}">
                    <select class="food-select">
                        <option value="">Selecione um alimento</option>
                        ${foodDatabase.map(food => `<option value="${food.name}">${food.name}</option>`).join('')}
                    </select>
                    <input type="number" class="food-quantity" placeholder="Quantidade (g)" required>
                    <button type="submit">Adicionar Alimento</button>
                </form>
            `;
            mealGroupsContainer.appendChild(mealGroupDiv);
        });

        // Adiciona listeners para remover alimento
        mealGroupsContainer.querySelectorAll('.meal-item button').forEach(button => {
            button.addEventListener('click', removeFoodItem);
        });

        // Adiciona listeners para adicionar alimento
        mealGroupsContainer.querySelectorAll('.add-food-form').forEach(form => {
            form.addEventListener('submit', addFoodItem);
        });
    }

    function renderCheckinHistory() {
        checkinHistoryList.innerHTML = '';
        if (checkinHistory.length === 0) {
            checkinHistoryList.innerHTML = '<p class="no-data-message">Nenhum check-in registrado ainda.</p>';
            return;
        }
        checkinHistory.slice(-7).reverse().forEach(entry => { // Mostra os últimos 7 dias
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
        weightHistory.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${entry.date}</span>
                <span>${entry.weight} Kg</span>
            `;
            weightHistoryList.appendChild(listItem);
        });
    }


    // --- Funções de Interação ---

    function showPage(pageId) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        navButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`nav-${pageId.replace('-page', '')}`).classList.add('active');

        // Se for a página de peso, atualiza a previsão
        if (pageId === 'weight-page') {
            updateWeightPrediction();
        }
    }

    // Navegação
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.id.replace('nav-', '') + '-page';
            showPage(pageId);
        });
    });

    // Botão de cadastro de perfil
    registerProfileBtn.addEventListener('click', () => showPage('profile-page'));

    // Salvar perfil
    profileForm.addEventListener('submit', saveProfile);

    // Adicionar grupo de refeição
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
        const foodName = form.querySelector('.food-select').value;
        const quantity = parseFloat(form.querySelector('.food-quantity').value);

        if (!foodName || isNaN(quantity) || quantity <= 0) {
            alert('Por favor, selecione um alimento e insira uma quantidade válida.');
            return;
        }

        const foodInfo = foodDatabase.find(food => food.name === foodName);
        if (foodInfo) {
            const factor = quantity / 100;
            const kcal = Math.round(foodInfo.kcalPer100g * factor);
            const protein = parseFloat((foodInfo.proteinPer100g * factor).toFixed(1));
            const carbs = parseFloat((foodInfo.carbsPer100g * factor).toFixed(1));
            const fats = parseFloat((foodInfo.fatsPer100g * factor).toFixed(1));

            dailyData.mealGroups[groupIndex].foods.push({
                name: foodName,
                quantity,
                kcal,
                protein,
                carbs,
                fats
            });

            // Atualiza totais da refeição
            dailyData.mealGroups[groupIndex].totalKcal += kcal;
            dailyData.mealGroups[groupIndex].totalProtein += protein;
            dailyData.mealGroups[groupIndex].totalCarbs += carbs;
            dailyData.mealGroups[groupIndex].totalFats += fats;

            // Atualiza totais diários
            dailyData.consumedCalories += kcal;
            dailyData.consumedProtein += protein;
            dailyData.consumedCarbs += carbs;
            dailyData.consumedFats += fats;

            localStorage.setItem('dailyData', JSON.stringify(dailyData));
            renderMealGroups();
            updateProgressBars();
            form.reset(); // Limpa o formulário
        } else {
            alert('Alimento não encontrado no banco de dados. (Em um app real, você poderia adicioná-lo manualmente aqui).');
        }
    }

    function removeFoodItem(event) {
        const groupIndex = parseInt(event.target.dataset.groupIndex);
        const foodIndex = parseInt(event.target.dataset.foodIndex);

        const foodToRemove = dailyData.mealGroups[groupIndex].foods[foodIndex];

        // Atualiza totais diários
        dailyData.consumedCalories -= foodToRemove.kcal;
        dailyData.consumedProtein -= foodToRemove.protein;
        dailyData.consumedCarbs -= foodToRemove.carbs;
        dailyData.consumedFats -= foodToRemove.fats;

        // Atualiza totais da refeição
        dailyData.mealGroups[groupIndex].totalKcal -= foodToRemove.kcal;
        dailyData.mealGroups[groupIndex].totalProtein -= foodToRemove.protein;
        dailyData.mealGroups[groupIndex].totalCarbs -= foodToRemove.carbs;
        dailyData.mealGroups[groupIndex].totalFats -= foodToRemove.fats;

        dailyData.mealGroups[groupIndex].foods.splice(foodIndex, 1);

        localStorage.setItem('dailyData', JSON.stringify(dailyData));
        renderMealGroups();
        updateProgressBars();
    }

    // Salvar Check-in
    saveCheckinBtn.addEventListener('click', () => {
        const today = new Date().toLocaleDateString();
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
        localStorage.setItem('currentDayCheckinState', JSON.stringify(currentCheckinState)); // Salva o estado dos checkboxes para o dia
        renderCheckinHistory();
        alert('Check-in salvo!');
    });

    // Adiciona entrada de peso
    function addWeightEntry(weight) {
        const today = new Date().toLocaleDateString();
        const lastEntry = weightHistory[weightHistory.length - 1];

        // Só adiciona se o peso for diferente do último registrado OU se for o primeiro registro do dia
        if (!lastEntry || lastEntry.date !== today || lastEntry.weight !== weight) {
            weightHistory.push({ date: today, weight: parseFloat(weight.toFixed(1)) });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
            renderWeightHistory();
            updateProgressBars();
            updateWeightPrediction();
        }
    }

    // Listener para o campo de peso atual no formulário de perfil
    document.getElementById('current-weight').addEventListener('change', (event) => {
        if (userProfile) { // Só adiciona ao histórico se já houver um perfil
            addWeightEntry(parseFloat(event.target.value));
        }
    });

    // Animações de Check-in
    checkinCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const animationDiv = event.target.nextElementSibling.nextElementSibling;
            if (event.target.checked) {
                animationDiv.textContent = '🎉'; // Exemplo de emoji
                animationDiv.style.opacity = '1';
                animationDiv.style.transform = 'scale(1)';
            } else {
                animationDiv.style.opacity = '0';
                animationDiv.style.transform = 'scale(0)';
                animationDiv.textContent = '';
            }
        });
    });

    // Função auxiliar para obter variáveis CSS
    function varColor(variableName) {
        return getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`);
    }

    // Inicializa o aplicativo
    initApp();

    // Mostra a página inicial por padrão, ou perfil se não houver dados
    if (!userProfile) {
        showPage('profile-page');
    } else {
        showPage('home-page');
    }
});
