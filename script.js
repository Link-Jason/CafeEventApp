// --- 1. DOM Element Selectors ---
const profitForm = document.getElementById('profit-form');
const profitOutput = document.getElementById('profit-output');
const breakEvenOutput = document.getElementById('break-even-output');
const revenueSummary = document.getElementById('revenue-summary');
const costsSummary = document.getElementById('costs-summary');
const profitSummary = document.getElementById('profit-summary');
const meterFill = document.getElementById('meter-fill');
const appContainer = document.getElementById('app-container');

// --- 2. Calculation Logic ---

/**
 * Calculates the total profit/loss and updates the UI.
 */
function calculateProfit() {
    // A. Gather Input Values
    const guests = parseFloat(document.getElementById('guests').value) || 0;
    const ticketPrice = parseFloat(document.getElementById('ticket-price').value) || 0;
    const extraSpend = parseFloat(document.getElementById('extra-spend').value) || 0;
    const lostSales = parseFloat(document.getElementById('lost-sales').value) || 0;
    const staffWages = parseFloat(document.getElementById('staff-wages').value) || 0;
    const materialsCost = parseFloat(document.getElementById('materials-cost').value) || 0;
    const rentalCost = parseFloat(document.getElementById('rental-cost').value) || 0;

    // B. Calculate Revenue and Costs
    const totalTicketRevenue = guests * ticketPrice;
    const totalExtraRevenue = guests * extraSpend;
    const totalRevenue = totalTicketRevenue + totalExtraRevenue;

    const totalFixedCosts = lostSales + staffWages + materialsCost + rentalCost;
    const totalCosts = totalFixedCosts; // No variable costs other than extra spend margin, which is ignored for simplicity

    // C. Calculate Net Profit
    const netProfit = totalRevenue - totalCosts;

    // D. Update UI Elements
    updateProfitOutput(netProfit);
    updateSummary(totalRevenue, totalCosts, netProfit);
    updateBreakEven(totalFixedCosts, ticketPrice, extraSpend);
    updateVisualMeter(netProfit);
}

/**
 * Updates the main profit/loss message style.
 * @param {number} profit - The calculated net profit.
 */
function updateProfitOutput(profit) {
    profitOutput.classList.remove('profit-result', 'loss-result');

    if (profit > 0) {
        profitOutput.textContent = `🚀 Great! You are projected to make a profit of €${profit.toFixed(2)}.`;
        profitOutput.classList.add('profit-result');
    } else if (profit < 0) {
        profitOutput.textContent = `⚠️ Warning! You are projected to make a loss of €${Math.abs(profit).toFixed(2)}.`;
        profitOutput.classList.add('loss-result');
    } else {
        profitOutput.textContent = `⚖️ Break Even! Your event is projected to neither profit nor lose.`;
    }
}

/**
 * Updates the consolidated summary panel.
 * @param {number} revenue - Total calculated revenue.
 * @param {number} costs - Total calculated costs.
 * @param {number} profit - The calculated net profit.
 */
function updateSummary(revenue, costs, profit) {
    revenueSummary.textContent = `€${revenue.toFixed(2)}`;
    costsSummary.textContent = `€${costs.toFixed(2)}`;
    profitSummary.textContent = `€${profit.toFixed(2)}`;

    // Optional: Style final profit line based on outcome
    const finalProfitLine = document.querySelector('.final-profit-line');
    finalProfitLine.style.color = profit > 0 ? 'var(--color-success)' : profit < 0 ? 'var(--color-danger)' : 'var(--color-text)';
}

/**
 * Calculates and updates the break-even guest count.
 * @param {number} fixedCosts - Total costs that don't change with guest count.
 * @param {number} ticketPrice - Price per ticket.
 * @param {number} extraSpend - Average extra spend per guest.
 */
function updateBreakEven(fixedCosts, ticketPrice, extraSpend) {
    const revenuePerGuest = ticketPrice + extraSpend;
    let breakEvenGuests = 0;

    if (revenuePerGuest > 0) {
        breakEvenGuests = Math.ceil(fixedCosts / revenuePerGuest);
    }

    if (breakEvenGuests === 0 && fixedCosts > 0) {
        breakEvenOutput.textContent = `You need 1 guest to start covering costs.`;
    } else if (breakEvenGuests > 0) {
        breakEvenOutput.textContent = `You need ${breakEvenGuests} guests to break even.`;
    } else {
         breakEvenOutput.textContent = `You need 0 guests to break even (costs are €0).`;
    }
}

/**
 * Updates the visual meter based on profitability.
 * @param {number} profit - The calculated net profit.
 */
function updateVisualMeter(profit) {
    // Define the range for the visual meter: e.g., max visual profit/loss is €500
    const maxRange = 500; 
    let percentage = 50; // Start in the middle (break-even)

    if (profit > 0) {
        // Profit: max 100% fill
        percentage = 50 + Math.min(profit / maxRange, 1) * 50; 
        meterFill.style.backgroundColor = 'var(--color-success)';
    } else if (profit < 0) {
        // Loss: min 0% fill
        percentage = 50 - Math.min(Math.abs(profit) / maxRange, 1) * 50; 
        meterFill.style.backgroundColor = 'var(--color-danger)';
    } else {
        // Break Even
        percentage = 50;
        meterFill.style.backgroundColor = 'var(--color-secondary)';
    }
    
    meterFill.style.height = `${percentage}%`;
}


// --- 3. Input Listeners (Triggers Recalculation) ---
function setupInputListeners() {
    const inputFields = profitForm.querySelectorAll('input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('input', calculateProfit);
    });
}

// --- 4. VIBE BUTTON HANDLERS (New Code for Interaction) ---
function setupVibeButtons() {
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const customVibeContainer = document.getElementById('custom-vibe-container');
    const eventNameInput = document.getElementById('event-name');

    vibeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            vibeButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            this.classList.add('active');

            // Check if the clicked button is 'Other'
            if (this.dataset.vibe === 'Other') {
                customVibeContainer.classList.remove('hidden');
                eventNameInput.focus();
            } else {
                customVibeContainer.classList.add('hidden');
            }
        });
    });
}

// --- 5. Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    // Set up the main functionality
    calculateProfit();
    setupInputListeners();
    
    // Set up the interactive vibe buttons
    setupVibeButtons();
});