// --- 1. DOM Element Selectors ---
const profitForm = document.getElementById('profit-form');
const profitOutput = document.getElementById('profit-output');
const breakEvenOutput = document.getElementById('break-even-output');
const revenueSummary = document.getElementById('revenue-summary');
const costsSummary = document.getElementById('costs-summary');
const profitSummary = document.getElementById('profit-summary');
const dialPercentage = document.getElementById('dial-percentage');
const dialFillSvg = document.getElementById('dial-fill-svg');
const appContainer = document.getElementById('app-container');
// NEW INSIGHT SELECTOR
const insightMessage = document.getElementById('insight-message');

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
    const totalCosts = totalFixedCosts;

    // C. Calculate Net Profit
    const netProfit = totalRevenue - totalCosts;

    // D. Calculate Net Margin Percentage
    const netMargin = (totalRevenue > 0) 
        ? (netProfit / totalRevenue) * 100 
        : (netProfit > 0 ? 100 : 0);
    
    // E. Calculate Break Even Guests
    const revenuePerGuest = ticketPrice + extraSpend;
    let breakEvenGuests = 0;
    if (revenuePerGuest > 0) {
        breakEvenGuests = Math.ceil(totalFixedCosts / revenuePerGuest);
    }
    
    // F. Update UI Elements
    updateProfitOutput(netProfit);
    updateSummary(totalRevenue, totalCosts, netProfit);
    updateBreakEven(totalFixedCosts, ticketPrice, extraSpend, breakEvenGuests);
    updateProfitDial(netProfit, netMargin);
    updateInsights(guests, netProfit, netMargin, breakEvenGuests); // NEW FUNCTION CALL
}

/**
 * Updates the main profit/loss message style with a friendlier tone.
 * @param {number} profit - The calculated net profit.
 */
function updateProfitOutput(profit) {
    profitOutput.classList.remove('profit-result', 'loss-result');

    if (profit > 0) {
        // Updated message: More conversational, less corporate
        profitOutput.textContent = `☕ Profit Forecast: You're brewing up a profit of €${profit.toFixed(2)}! Go for it.`;
        profitOutput.classList.add('profit-result');
    } else if (profit < 0) {
        // Updated message: A helpful warning
        profitOutput.textContent = `🚩 Loss Projected: This event may cost you €${Math.abs(profit).toFixed(2)}. Time to adjust?`;
        profitOutput.classList.add('loss-result');
    } else {
        profitOutput.textContent = `⚖️ Balanced Book: You are projected to break even. A low-risk way to build community!`;
    }
}

/**
 * Updates the consolidated summary panel.
 * (No changes needed here, keeping for completeness)
 */
function updateSummary(revenue, costs, profit) {
    revenueSummary.textContent = `€${revenue.toFixed(2)}`;
    costsSummary.textContent = `€${costs.toFixed(2)}`;
    profitSummary.textContent = `€${profit.toFixed(2)}`;

    const finalProfitLine = document.querySelector('.final-profit-line');
    finalProfitLine.style.color = profit > 0 ? 'var(--color-success)' : profit < 0 ? 'var(--color-danger)' : 'var(--color-text)';
}

/**
 * Calculates and updates the break-even guest count.
 */
function updateBreakEven(fixedCosts, ticketPrice, extraSpend, breakEvenGuests) {
    if (breakEvenGuests === 0 && fixedCosts > 0) {
        breakEvenOutput.textContent = `You need 1 guest to start covering costs.`;
    } else if (breakEvenGuests > 0) {
        breakEvenOutput.textContent = `You need ${breakEvenGuests} guests to break even.`;
    } else {
        breakEvenOutput.textContent = `You need 0 guests to break even (costs are €0).`;
    }
}

/**
 * Updates the circular profit dial based on profit and margin.
 */
function updateProfitDial(profit, margin) {
    const circumference = 283;
    const normalizedMargin = Math.min(Math.max(margin, -100), 100); 

    const fillPercentage = (normalizedMargin + 100) / 200;
    const dashOffset = circumference * (1 - fillPercentage);

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

/**
 * NEW: Displays contextual advice based on the calculated results.
 */
function updateInsights(guests, profit, margin, breakEven) {
    let message = "Adjust your inputs to see helpful tips here!";

    if (profit > 0 && margin < 15) {
        message = "✨ Your profit is modest. Consider slightly raising your ticket price or focusing on higher-margin extra sales!";
    } else if (profit < 0) {
        if (guests < breakEven) {
             message = `🛑 You need ${breakEven - guests} more guests to break even. Double-down on promotion to hit your target!`;
        } else {
             message = "💸 High fixed costs are the issue. Can you find ways to reduce vendor fees or staffing for this event?";
        }
    } else if (margin >= 25 && profit > 100) {
        message = "🏆 Excellent Margins! This is a highly profitable model. Plan your next one now!";
    } else if (guests > 100 && profit > 0) {
        message = "🎉 Great Attendance! Ensure your staff-to-guest ratio can handle the crowd for a smooth, high-quality event.";
    }

    insightMessage.textContent = message;
}


// --- 3. Input Listeners (Triggers Recalculation) ---
function setupInputListeners() {
    const inputFields = profitForm.querySelectorAll('input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('input', calculateProfit);
    });
}

// --- 4. VIBE BUTTON HANDLERS (No changes needed here) ---
function setupVibeButtons() {
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const customVibeContainer = document.getElementById('custom-vibe-container');
    const eventNameInput = document.getElementById('event-name');

    vibeButtons.forEach(button => {
        button.addEventListener('click', function() {
            vibeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

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
    calculateProfit();
    setupInputListeners();
    setupVibeButtons();
});