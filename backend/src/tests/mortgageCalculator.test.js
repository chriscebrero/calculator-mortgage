const request = require('supertest');
const app = require('../app');

describe('POST /api/calculateMortgage', () => {
    it('should calculate the mortgage payment correctly', async () => {
        const response = await request(app)
            .post('/api/calculateMortgage')
            .send({
                propertyPrice: 500000,
                downPayment: 50000,
                annualInterestRate: 5,
                amortizationPeriod: 25,
                paymentSchedule: 'monthly'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('paymentPerSchedule');
        expect(response.body.paymentPerSchedule).toEqual('2712.21');
    });
    
    it('should calculate the mortgage payment correctly (biweekly)', async () => {
        const response = await request(app)
            .post('/api/calculateMortgage')
            .send({
                propertyPrice: 500000,
                downPayment: 50000,
                annualInterestRate: 5,
                amortizationPeriod: 25,
                paymentSchedule: 'bi-weekly'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('paymentPerSchedule');
        expect(response.body.paymentPerSchedule).toEqual('1251.08');
    });    
    

    it('should return an error for invalid down payment', async () => {
        const response = await request(app)
            .post('/api/calculateMortgage')
            .send({
                propertyPrice: 500000,
                downPayment: 600000,  // Invalid down payment
                annualInterestRate: 5,
                amortizationPeriod: 25,
                paymentSchedule: 'monthly'
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should calculate correctly with a very low interest rate', async () => {
        const response = await request(app)
            .post('/api/calculateMortgage')
            .send({
                propertyPrice: 500000,
                downPayment: 50000,
                annualInterestRate: 1, 
                amortizationPeriod: 25,
                paymentSchedule: 'monthly'
            });
        expect(response.status).toBe(200);
        expect(parseFloat(response.body.paymentPerSchedule)).toBeCloseTo(1748.50, 2);
    });


    
});

