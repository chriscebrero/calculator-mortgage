const calculateMinimumDownPayment = (propertyPrice) => {
    let minDownPayment = 0;
    if (propertyPrice <= 500000) {
        minDownPayment = propertyPrice * 0.05;
    } else if (propertyPrice <= 999999) {
        minDownPayment = (500000 * 0.05) + ((propertyPrice - 500000) * 0.10);
    } else {
        minDownPayment = propertyPrice * 0.20;
    }
    return minDownPayment;
}

const calculateCMHCInsurance = (loanAmount, propertyPrice) => {
    const ltv = (loanAmount / propertyPrice) * 100;
    let insuranceRate = 0;

    if (ltv <= 65) {
        insuranceRate = 0.60;
    } else if (ltv <= 75) {
        insuranceRate = 1.70;
    } else if (ltv <= 80) {
        insuranceRate = 2.40;
    } else if (ltv <= 85) {
        insuranceRate = 2.80;
    } else if (ltv <= 90) {
        insuranceRate = 3.10;
    } else if (ltv <= 95) {
        insuranceRate = 4.00;
    }

    return (loanAmount * insuranceRate) / 100;
  }

  const calculateMortgage = (principal, annualInterestRate, amortizationPeriod, paymentSchedule, cmhcInsurance) => {
    let paymentsPerYear;
    let paymentAmount;

    const monthlyRate = annualInterestRate / 100 / 12; // 
    const monthlyPayment = ((principal + cmhcInsurance) * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -amortizationPeriod * 12));

    switch (paymentSchedule) {
        case 'monthly':
            paymentsPerYear = 12;
            paymentAmount = monthlyPayment;
            break;
        case 'bi-weekly':
            paymentsPerYear = 26;
            paymentAmount = (monthlyPayment / 12) * 2;
            break;
        case 'accelerated bi-weekly':
            paymentsPerYear = 26;
            paymentAmount = (monthlyPayment / 2) + ((monthlyPayment / 12) / 26); // This ensures that you are making half a month's payment 26 times a year
            break;
        default:
            throw new Error('Invalid payment schedule');
    }

    const totalPayments = paymentsPerYear * amortizationPeriod;
    const ratePerPayment = annualInterestRate / paymentsPerYear / 100;
    const numerator = ratePerPayment * Math.pow((1 + ratePerPayment), totalPayments);
    const denominator = Math.pow((1 + ratePerPayment), totalPayments) - 1;

    return principal * (numerator / denominator);
};

exports.calculateMortgagePayment = (req, res) => {
    try {
      const { propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule } = req.body;

      const minDownPayment = calculateMinimumDownPayment(propertyPrice);
      if (downPayment >= propertyPrice || downPayment < minDownPayment) {
        return res.status(400).json({ error: `The minimum down payment for a property price of $${propertyPrice} is $${minDownPayment.toFixed(2)}` });
      }
  
      const principal = propertyPrice - downPayment;
      const cmhcInsurance = calculateCMHCInsurance(principal, propertyPrice);
      const totalLoanAmount = principal + cmhcInsurance;
  
      const paymentAmount = calculateMortgage(totalLoanAmount, annualInterestRate, amortizationPeriod, paymentSchedule, cmhcInsurance);
      res.json({
        paymentPerSchedule: paymentAmount.toFixed(2),
        cmhcInsurance: cmhcInsurance.toFixed(2),
        minDownPayment: minDownPayment.toFixed(2)
    });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
