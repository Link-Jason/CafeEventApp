// --- 1. DOM Element Selectors ---
const profitForm = document.getElementById('profit-form');
const profitOutput = document.getElementById('profit-output');
const breakEvenOutput = document.getElementById('break-even-output');
const revenueSummary = document.getElementById('revenue-summary');
const costsSummary = document.getElementById('costs-summary');
const profitSummary = document.getElementById('profit-summary');
// REMOVED: const meterFill = document.getElementById('meter-fill');
// NEW DIAL SELECTORS
const dialPercentage = document.getElementById('dial-percentage');
const dialFillSvg = document.getElementById('dial-fill-svg');
// ... existing selectors ...
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

    // D. Calculate Net Margin Percentage (New Calculation)
    const netMargin = (totalRevenue > 0) 
        ? (netProfit / totalRevenue) * 100 
        : (netProfit > 0 ? 100 : 0); // Handle zero revenue case

    // E. Update UI Elements
    updateProfitOutput(netProfit);
    updateSummary(totalRevenue, totalCosts, netProfit);
    updateBreakEven(totalFixedCosts, ticketPrice, extraSpend);
    updateProfitDial(netProfit, netMargin); // UPDATED to new dial function
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
 * Updates the circular profit dial based on profit and margin. (REPLACEMENT FOR updateVisualMeter)
 * @param {number} profit - The calculated net profit.
 * @param {number} margin - The calculated net margin percentage (e.g., 25 for 25%).
 */
function updateProfitDial(profit, margin) {
    // Circumference of the circle (2 * pi * 45 ≈ 282.7)
    const circumference = 283;
    
    // 1. Calculate the fill amount (0% to 100% of the circle)
    // Clamp margin between -100% (max loss shown) and +100% (max profit shown).
    const normalizedMargin = Math.min(Math.max(margin, -100), 100); 

    // Convert the margin percentage to a dash offset for the SVG circle.
    // Normalized range is -100 to 100. We map this to a 0 to 1 fill percentage.
    const fillPercentage = (normalizedMargin + 100) / 200; // 0 to 1
    const dashOffset = circumference * (1 - fillPercentage);

    // 2. Apply the fill and color
    dialFillSvg.style.strokeDasharray = circumference;
    dialFillSvg.style.strokeDashoffset = dashOffset;
    dialPercentage.textContent = `${Math.round(margin)}%`;
    
    let color;
    if (profit > 0) {
        color = 'var(--color-success)';
    } else if (profit < 0) {
        color = 'var(--color-danger)';
    } else {
        color = 'var(--color-secondary)';
    }

    dialFillSvg.style.stroke = color;
    dialPercentage.style.color = color;
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