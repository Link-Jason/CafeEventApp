document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the form and output elements
    const profitForm = document.getElementById('profit-form');
    const profitOutput = document.getElementById('profit-output');
    const breakEvenOutput = document.getElementById('break-even-output');
    
    // 2. Attach ONE event listener to the entire form (listens for ANY input change)
    // The 'input' event triggers the function every time a value is typed or changed.
    profitForm.addEventListener('input', calculateProfit);
    
    // Call calculation once on load to populate the break-even with defaults
    calculateProfit();

    function calculateProfit() {
        // --- A. GET ALL INPUT VALUES ---
        const guests = parseFloat(document.getElementById('guests').value) || 0;
        const ticketPrice = parseFloat(document.getElementById('ticket-price').value) || 0;
        const extraSpend = parseFloat(document.getElementById('extra-spend').value) || 0;
        const lostSales = parseFloat(document.getElementById('lost-sales').value) || 0;  
        const staffWages = parseFloat(document.getElementById('staff-wages').value) || 0;
        const materialsCost = parseFloat(document.getElementById('materials-cost').value) || 0;
        const rentalCost = parseFloat(document.getElementById('rental-cost').value) || 0;

        // --- B. PERFORM CALCULATIONS ---
        const revenuePerGuest = ticketPrice + extraSpend;
        const totalFixedCosts = lostSales + staffWages + materialsCost + rentalCost;
        
        const totalRevenue = guests * revenuePerGuest;
        const finalProfit = totalRevenue - totalFixedCosts;

        // --- C. CALCULATE BREAK-EVEN POINT ---
        let breakEvenGuests = 0;
        if (revenuePerGuest > 0) {
            // Formula: Fixed Costs / Revenue Per Guest
            breakEvenGuests = Math.ceil(totalFixedCosts / revenuePerGuest);
        } else if (totalFixedCosts > 0) {
             // If costs exist but revenue per guest is zero (e.g., free event with no extra spend)
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
    }
});