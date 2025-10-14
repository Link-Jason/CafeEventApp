document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the form and output elements
    const profitForm = document.getElementById('profit-form');
    const profitOutput = document.getElementById('profit-output');
    const breakEvenOutput = document.getElementById('break-even-output');
    const meterFill = document.getElementById('meter-fill'); 
    
    // NEW: Get the summary output elements
    const revenueSummary = document.getElementById('revenue-summary');
    const costsSummary = document.getElementById('costs-summary');
    const profitSummary = document.getElementById('profit-summary');
    
    // 2. Attach ONE event listener to the entire form (listens for ANY input change)
    profitForm.addEventListener('input', calculateProfit);
    
    // Call calculation once on load to populate the break-even with defaults
    calculateProfit();

    function calculateProfit() {
        // --- A. GET ALL INPUT VALUES ---
        const guests = parseFloat(document.getElementById('guests').value) || 0;
        const ticketPrice = parseFloat(document.getElementById('ticket-price').value) || 0;
        const extraSpend = parseFloat(document.getElementById('extra-spend').value) || 0;
        
        // Lost sales variable
        const lostSales = parseFloat(document.getElementById('lost-sales').value) || 0; 
        
        const staffWages = parseFloat(document.getElementById('staff-wages').value) || 0;
        const materialsCost = parseFloat(document.getElementById('materials-cost').value) || 0;
        const rentalCost = parseFloat(document.getElementById('rental-cost').value) || 0;

        // --- B. PERFORM CALCULATIONS ---
        const revenuePerGuest = ticketPrice + extraSpend;
        // Lost Sales included in total fixed costs
        const totalFixedCosts = lostSales + staffWages + materialsCost + rentalCost;
        
        const totalRevenue = guests * revenuePerGuest;
        const finalProfit = totalRevenue - totalFixedCosts;

        // --- C. CALCULATE BREAK-EVEN POINT ---
        let breakEvenGuests = 0;
        if (revenuePerGuest > 0) {
            // Formula: Fixed Costs / Revenue Per Guest
            breakEvenGuests = Math.ceil(totalFixedCosts / revenuePerGuest);
        } else if (totalFixedCosts > 0) {
            breakEvenGuests = 'impossible to calculate.';
        }
        
        // --- D. DISPLAY RESULTS (Profit/Loss Message) ---
        const formattedProfit = Math.abs(finalProfit).toFixed(2);
        
        // Clear previous color styles
        profitOutput.classList.remove('profit-result', 'loss-result');
        
        let profitMessage = '';
        
        if (finalProfit >= 0) {
            profitMessage = `🎉 **BREW-TIFUL!** Your event is estimated to make €${finalProfit.toFixed(2)}. This looks like a smart move.`;
            profitOutput.classList.add('profit-result');
        } else {
            profitMessage = `🔴 **COLD BREW DISASTER.** Your forecast shows a loss of €${formattedProfit}. Let's rethink your costs or boost attendance.`;
            profitOutput.classList.add('loss-result');
        }

        // Output the result message and Break-Even point
        profitOutput.innerHTML = profitMessage;

        if (typeof breakEvenGuests === 'number') {
            breakEvenOutput.innerHTML = `You need **${breakEvenGuests}** guests to break even (cover all costs).`;
        } else {
            breakEvenOutput.innerHTML = `Break-even requires revenue per guest (€${revenuePerGuest.toFixed(2)}).`;
        }

        // --- E. UPDATE CONSOLIDATED SUMMARY (NEW) ---
        revenueSummary.innerHTML = `€${totalRevenue.toFixed(2)}`;
        costsSummary.innerHTML = `€${totalFixedCosts.toFixed(2)}`;
        profitSummary.innerHTML = `€${finalProfit.toFixed(2)}`;
        
        // Style the final profit line based on profit/loss status
        if (finalProfit >= 0) {
            profitSummary.style.color = 'var(--color-success)';
        } else {
            profitSummary.style.color = 'var(--color-danger)';
        }


        // --- F. UPDATE VISUAL METER ---
        const maxGoal = 500; // Define a realistic maximum profit goal for the meter's visual scale (e.g., €500)
        let fillHeight = 0;
        let fillColor = '';

        if (finalProfit < 0) {
            // Loss: Show meter at 0% and red/danger color
            fillHeight = 0;
            fillColor = 'var(--color-danger)';
        } else if (finalProfit > 0) {
            // Profit: Scale height up to maxGoal
            fillHeight = Math.min((finalProfit / maxGoal) * 100, 100);
            fillColor = (fillHeight >= 100) ? 'var(--color-success)' : 'var(--color-secondary)';
        }
        
        // Apply the calculated height and color to the meter element
        meterFill.style.height = `${fillHeight}%`;
        meterFill.style.backgroundColor = fillColor;
    }
    
    // --- VIBE BUTTONS LOGIC ---
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const customVibeContainer = document.getElementById('custom-vibe-container');
    const eventNameInput = document.getElementById('event-name');

    vibeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            vibeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Set 'active' class on the clicked button
            button.classList.add('active');
            
            // Check if 'Other' button was clicked
            if (button.dataset.vibe === 'Other') {
                customVibeContainer.classList.remove('hidden');
                eventNameInput.focus(); // Focus on the new input field
            } else {
                customVibeContainer.classList.add('hidden');
                // Clear the custom input if a standard vibe is selected
                eventNameInput.value = '';
            }
        });
    });
});