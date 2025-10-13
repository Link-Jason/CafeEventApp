document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the button and the results display element
    const calculateBtn = document.getElementById('calculate-btn');
    const profitOutput = document.getElementById('profit-output');
    
    // 2. Attach an event listener to the button
    calculateBtn.addEventListener('click', calculateProfit);

    function calculateProfit() {
        // --- A. GET ALL INPUT VALUES ---
        // (The '|| 0' ensures we treat empty inputs as zero for math)
        const guests = parseFloat(document.getElementById('guests').value) || 0;
        const ticketPrice = parseFloat(document.getElementById('ticket-price').value) || 0;
        const extraSpend = parseFloat(document.getElementById('extra-spend').value) || 0;
        
        const staffWages = parseFloat(document.getElementById('staff-wages').value) || 0;
        const materialsCost = parseFloat(document.getElementById('materials-cost').value) || 0;
        const rentalCost = parseFloat(document.getElementById('rental-cost').value) || 0;

        // --- B. PERFORM CALCULATIONS ---
        const totalRevenue = (guests * ticketPrice) + (guests * extraSpend);
        const totalCosts = staffWages + materialsCost + rentalCost;
        const finalProfit = totalRevenue - totalCosts;

        // --- C. DISPLAY RESULTS (Human-centered feedback) ---
        // Format the number to two decimal places
        const formattedProfit = Math.abs(finalProfit).toFixed(2);
        
        // Remove old style classes before adding the new one
        profitOutput.classList.remove('profit-result', 'loss-result');
        
        let message = '';
        
        if (finalProfit >= 0) {
            // Success: Profit is €0 or more
            message = `🎉 **BREW-TIFUL!** Your event is estimated to make €${finalProfit.toFixed(2)}. This looks like a smart move.`;
            profitOutput.classList.add('profit-result');
        } else {
            // Loss: Profit is less than €0
            message = `🔴 **COLD BREW DISASTER.** Your forecast shows a loss of €${formattedProfit}. Let's rethink your costs or expected attendance.`;
            profitOutput.classList.add('loss-result');
        }

        // Output the result message to the HTML
        profitOutput.innerHTML = message;
    }
});