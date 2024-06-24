document.addEventListener('DOMContentLoaded', () => {
    const totalBudgetInput = document.getElementById('total-budget');
    const totalBudgetDisplay = document.getElementById('total-budget-display');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const enterButton = document.getElementById('enter-btn');
    const resetButton = document.getElementById('reset-btn');
    const progressBar = document.getElementById('progress-bar');
    const message = document.getElementById('message');
    const splitline = document.querySelector('.splitline');
    const splitlinePosition = 50; // Position of the splitline in percentage (50 means 50% of the total budget)
    const duplicateMessage = document.createElement('div'); // New message element for duplicate alerts
    duplicateMessage.className = 'duplicate-message';

    let totalBudget = parseFloat(localStorage.getItem('totalBudget')) || 0;
    let currentProgress = parseFloat(localStorage.getItem('currentProgress')) || 0;
    let lastTransaction = null;

    const updateProgressBar = () => {
        const progressPercentage = Math.min((currentProgress / totalBudget) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
        
        if ((currentProgress / totalBudget) * 100 > 100) {
            progressBar.style.backgroundColor = 'red';
            message.textContent = `Exceeded budget by ${(currentProgress - totalBudget).toFixed(2)}`;
        } else if (progressPercentage > splitlinePosition) {
            progressBar.style.backgroundColor = 'orange';
            message.textContent = '';
        } else {
            progressBar.style.backgroundColor = 'green';
            message.textContent = '';
        }

        splitline.style.left = `${splitlinePosition}%`;
    };

    const updateTotalBudgetDisplay = () => {
        totalBudgetDisplay.textContent = `Total Budget: $${totalBudget.toFixed(2)}`;
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('totalBudget', totalBudget);
        localStorage.setItem('currentProgress', currentProgress);
    };

    const handleTransaction = () => {
        const transactionAmount = parseFloat(transactionAmountInput.value);
        if (transactionAmount === lastTransaction) {
            duplicateMessage.textContent = 'Duplicate transaction amount entered.';
            message.after(duplicateMessage);
            return;
        } else {
            duplicateMessage.textContent = ''; // Clear the duplicate message
        }
        if (transactionAmount !== 0) {
            currentProgress += transactionAmount;
            lastTransaction = transactionAmount;
            saveToLocalStorage();
            updateProgressBar();
        }
    };

    totalBudgetInput.addEventListener('change', () => {
        totalBudget = parseFloat(totalBudgetInput.value);
        saveToLocalStorage();
        updateTotalBudgetDisplay();
        updateProgressBar();
    });

    enterButton.addEventListener('click', handleTransaction);
    transactionAmountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleTransaction();
        }
    });

    resetButton.addEventListener('click', () => {
        currentProgress = 0;
        lastTransaction = null;
        saveToLocalStorage();
        updateProgressBar();
    });

    updateTotalBudgetDisplay();
    updateProgressBar();
});
