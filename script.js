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
const insightMessage = document.getElementById('insight-message');

// --- 2. WOW! START: Event Preset Data Structure ---
const eventPresets = {
    'Live Music': { guests: 75, ticketPrice: 5.00, extraSpend: 15.00, lostSales: 80.00, staffWages: 250.00, materialsCost: 100.00, rentalCost: 150.00 },
    'Trivia': { guests: 50, ticketPrice: 2.00, extraSpend: 12.00, lostSales: 50.00, staffWages: 150.00, materialsCost: 30.00, rentalCost: 0.00 },
    'Competition': { guests: 100, ticketPrice: 0.00, extraSpend: 18.00, lostSales: 100.00, staffWages: 300.00, materialsCost: 150.00, rentalCost: 50.00 },
    'Workshop': { guests: 20, ticketPrice: 25.00, extraSpend: 5.00, lostSales: 30.00, staffWages: 100.00, materialsCost: 75.00, rentalCost: 0.00 },
    'Art Event': { guests: 60, ticketPrice: 0.00, extraSpend: 10.00, lostSales: 60.00, staffWages: 180.00, materialsCost: 40.00, rentalCost: 0.00 },
    'Watch Party': { guests: 80, ticketPrice: 0.00, extraSpend: 20.00, lostSales: 120.00, staffWages: 220.00, materialsCost: 20.00, rentalCost: 0.00 },
    'Pop-up': { guests: 40, ticketPrice: 0.00, extraSpend: 15.00, lostSales: 40.00, staffWages: 120.00, materialsCost: 30.00, rentalCost: 50.00 },
    'Other': { guests: 50, ticketPrice: 0.00, extraSpend: 10.00, lostSales: 50.00, staffWages: 150.00, materialsCost: 50.00, rentalCost: 0.00 } // Default/Other values
};
// --- 2. WOW! END: Event Preset Data Structure ---


/**
 * Resets all output elements to a default, clear state.
 */
function resetOutput() {
    profitOutput.classList.remove('profit-result', 'loss-result');
    profitOutput.textContent = `Enter your event numbers to see the forecast.`;
    
    revenueSummary.textContent = `€0.00`;
    costsSummary.textContent = `€0.00`;
    profitSummary.textContent = `€0.00`;
    document.querySelector('.final-profit-line').style.color = 'var(--color-text)';
    
    breakEvenOutput.textContent = `You need 0 guests to break even.`;
    
    // Reset Dial
    const circumference = 283;
    dialFillSvg.style.strokeDashoffset = circumference;
    dialFillSvg.style.stroke = 'var(--color-secondary)';
    dialPercentage.textContent = `0%`;
    dialPercentage.style.color = 'var(--color-primary)';
    
    insightMessage.textContent = "Adjust your inputs to see helpful tips here!";
}


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

    // INPUT VALIDATION & GUARD CLAUSE
    if (guests <= 0 || isNaN(guests)) {
        resetOutput();
        if (guests < 0) {
            profitOutput.textContent = "⚠️ Guests must be a positive number.";
        } else {
            profitOutput.textContent = "📝 Tip: Enter an expected guest count to begin the forecast.";
        }
        return; // Stop the calculation
    }


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
    updateInsights(guests, netProfit, netMargin, breakEvenGuests);
}

/**
 * Updates the main profit/loss message style with a friendlier tone.
 */
function updateProfitOutput(profit) {
    profitOutput.classList.remove('profit-result', 'loss-result');

    if (profit > 0) {
        profitOutput.textContent = `☕ Profit Forecast: You're brewing up a profit of €${profit.toFixed(2)}! Go for it.`;
        profitOutput.classList.add('profit-result');
    } else if (profit < 0) {
        profitOutput.textContent = `🚩 Loss Projected: This event may cost you €${Math.abs(profit).toFixed(2)}. Time to adjust?`;
        profitOutput.classList.add('loss-result');
    } else {
        profitOutput.textContent = `⚖️ Balanced Book: You are projected to break even. A low-risk way to build community!`;
    }
}

/**
 * Updates the consolidated summary panel.
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
 * Displays contextual advice based on the calculated results.
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

/**
 * Loads predefined values for a selected event type into the form.
 * @param {string} vibe - The selected event type (key in eventPresets).
 */
function loadPreset(vibe) {
    const preset = eventPresets[vibe];
    
    document.getElementById('guests').value = preset.guests.toString();
    document.getElementById('ticket-price').value = preset.ticketPrice.toFixed(2);
    document.getElementById('extra-spend').value = preset.extraSpend.toFixed(2);
    document.getElementById('lost-sales').value = preset.lostSales.toFixed(2);
    document.getElementById('staff-wages').value = preset.staffWages.toFixed(2);
    document.getElementById('materials-cost').value = preset.materialsCost.toFixed(2);
    document.getElementById('rental-cost').value = preset.rentalCost.toFixed(2);

    calculateProfit(); // Recalculate immediately with new values
}

// --- 3. Input Listeners (Triggers Recalculation) ---
function setupInputListeners() {
    const inputFields = profitForm.querySelectorAll('input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('input', calculateProfit);
        input.addEventListener('change', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
}

// --- 4. WOW! START: VIBE BUTTON HANDLERS (Updated to load presets) ---
function setupVibeButtons() {
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const customVibeContainer = document.getElementById('custom-vibe-container');
    const eventNameInput = document.getElementById('event-name');

    vibeButtons.forEach(button => {
        button.addEventListener('click', function() {
            vibeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const vibe = this.dataset.vibe;
            loadPreset(vibe); // Load the context-aware preset

            if (vibe === 'Other') {
                customVibeContainer.classList.add('show');
                eventNameInput.focus();
            } else {
                customVibeContainer.classList.remove('show');
            }
        });
    });
    // Set the initial state based on the 'Other' or first button
    loadPreset('Other');
    document.querySelector('.vibe-btn').classList.add('active');
}
// --- 4. WOW! END: VIBE BUTTON HANDLERS ---

// --- 5. Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    setupInputListeners();
    setupVibeButtons(); 
    // calculateProfit is called within setupVibeButtons, so we remove the redundant call here.
});