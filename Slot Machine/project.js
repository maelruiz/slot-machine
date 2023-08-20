
document.addEventListener('DOMContentLoaded', () => {
    const depositAmountInput = document.getElementById('deposit-amount');
    const numberOfLinesInput = document.getElementById('number-of-lines');
    const betPerLineInput = document.getElementById('bet-per-line');
    const balanceDisplay = document.getElementById('balance');
    const winningsDisplay = document.getElementById('winnings');
    const slotTable = document.querySelector(".slots table");
    const spinSlotsBtn = document.querySelector(".spin-slots");
    const addMoneyBtn = document.querySelector(".add-money");

    let balance = 0;
    const symbols = ["watermelon.png", "diamond.png", "seven.png", "lemon.png"];
    let reels = [];

    function deposit() {
        return parseFloat(depositAmountInput.value);
    }

    function getNumberOfLines() {
        return parseFloat(numberOfLinesInput.value);
    }

    function getBet(balance, lines) {
        const betAmount = parseFloat(betPerLineInput.value);
        const maxBetPerLine = balance / lines;
        return isNaN(betAmount) || betAmount <= 0 ? 0 : Math.min(betAmount, maxBetPerLine);
    }
    

    function initializeReels() {
        for (let i = 0; i < 3; i++) {
            const reel = [];
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * symbols.length);
                reel.push(symbols[randomIndex]);
            }
            reels.push(reel);
        }
    }

    function updateReels() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * symbols.length);
                reels[i][j] = symbols[randomIndex];
            }
        }
    }

    function spin() {
        updateReels();
        return reels; // Return the updated reels array
    }

    function transpose(reels) {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (const reel of reels) {
                row.push(reel[i]);
            }
            rows.push(row);
        }
        return rows;
    }

    function printRows(rows) {
        slotTable.innerHTML = ""; // Clear the existing table content

        for (const row of rows) {
            const tr = document.createElement("tr");
            for (const symbol of row) {
                const td = document.createElement("td");
                const img = document.createElement("img");
                img.src = symbol;
                img.alt = "Slot Symbol";
                td.appendChild(img);
                tr.appendChild(td);
            }
            slotTable.appendChild(tr);
        }
    }

    function getWinnings(rows, bet, numberOfLines) {
        const winningCombinations = [
            // Horizontal winning combinations
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
    
            // Diagonal winning combinations
            [0, 4, 8], // Diagonal from top-left to bottom-right
            [2, 4, 6], // Diagonal from top-right to bottom-left
        ];
    
        let totalWinnings = 0;
        for (const combination of winningCombinations) {
            let isWinningCombination = true;
            for (const index of combination) {
                const row = Math.floor(index / 3);
                const col = index % 3;
                if (rows[row][col] !== rows[0][0]) {
                    isWinningCombination = false;
                    break;
                }
            }
    
            if (isWinningCombination) {
                totalWinnings += bet;
            }
        }
    
        return totalWinnings * numberOfLines;
    }
    
    

    function updateBalanceAndWinnings(balance, winnings) {
        balanceDisplay.textContent = '$' + balance.toFixed(2);
        winningsDisplay.textContent = 'You won: $' + winnings.toFixed(2);
        if (winnings > 0.00) {
            alert("You won: $" + winnings.toFixed(2));
        }
    }

    function addMoney() {
        const depositAmount = parseFloat(depositAmountInput.value);
        if (!isNaN(depositAmount) && depositAmount > 0) {
            balance += depositAmount;
            updateBalanceAndWinnings(balance, 0);
        } else {
            alert("Invalid deposit");
        }
    }

    function game() {
        //const depositAmount = deposit();
        //if (isNaN(depositAmount) || depositAmount <= 0) {
            //alert("Invalid deposit");
            //return;
        //}

        //balance += depositAmount;

        const numberOfLines = getNumberOfLines();
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            alert("Invalid number of lines");
            return;
        }

        const bet = getBet(balance, numberOfLines);
        if (isNaN(bet) || bet <= 0 || bet > balance || bet > balance / numberOfLines) {
            alert("Invalid bet amount");
            return;
        }

        balance -= bet * numberOfLines;
        const reels = spin(); // Store the result of spin() in a variable
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        updateBalanceAndWinnings(balance, winnings);

        if (balance <= 0) {
            alert("You ran out of money");
            spinSlotsBtn.disabled = true; // Disable spin button when no balance
        }
    }
    
    function resetSpinButton() {
        spinSlotsBtn.disabled = false; // Enable spin button
    }

    initializeReels();
    printRows(reels);

    addMoney();
        resetSpinButton(); // Re-enable the spin button after adding money

    spinSlotsBtn.addEventListener('click', game);
    addMoneyBtn.addEventListener('click', addMoney);
});
