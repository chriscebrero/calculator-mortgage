import React, { useState } from "react";

interface MortgageFormState {
	propertyPrice: string;
	downPayment: string;
	annualInterestRate: string;
	amortizationPeriod: string;
	paymentSchedule: "monthly" | "bi-weekly" | "accelerated bi-weekly";
}

const MortgageCalculator: React.FC = () => {
	const [formData, setFormData] = useState<MortgageFormState>({
		propertyPrice: "",
		downPayment: "",
		annualInterestRate: "",
		amortizationPeriod: "",
		paymentSchedule: "monthly",
	});

	const [result, setResult] = useState<string | null>(null);
	const [cmhcInsurance, setCmhcInsurance] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setResult(null);

		try {
			const response = await fetch(
				"http://localhost:3000/api/calculateMortgage",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						propertyPrice: parseFloat(formData.propertyPrice),
						downPayment: parseFloat(formData.downPayment),
						annualInterestRate: parseFloat(formData.annualInterestRate),
						amortizationPeriod: parseInt(formData.amortizationPeriod),
						paymentSchedule: formData.paymentSchedule,
					}),
				}
			);

			if (!response.ok) {
				const data = await response.json();
				setError(
					data.error || "An error occurred while calculating the mortgage."
				);
				return;
			}

			const data = await response.json();
			setResult(
				`Your ${formData.paymentSchedule} payment will be $${data.paymentPerSchedule}`
			);
			setCmhcInsurance(`CMHC Insurance: $${data.cmhcInsurance}`);
		} catch (error) {
			setError("Failed to fetch data. Please try again later.");
			console.error("Error fetching data: ", error);
		}
	};

	return (
		<div className="container mx-auto p-4 bg-slate-200">
			<h1 className="text-xl font-bold mb-4 text-center">
				Mortgage Calculator
			</h1>
			<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
				<input
					type="number"
					name="propertyPrice"
					placeholder="Property Price"
					value={formData.propertyPrice}
					onChange={handleChange}
					className="input input-bordered p-4 rounded-xl"
					required
				/>
				<input
					type="number"
					name="downPayment"
					placeholder="Down Payment"
					value={formData.downPayment}
					onChange={handleChange}
					className="input input-bordered p-4 rounded-xl"
					required
				/>
				<input
					type="number"
					step="0.01"
					name="annualInterestRate"
					placeholder="Annual Interest Rate (%)"
					value={formData.annualInterestRate}
					onChange={handleChange}
					className="input input-bordered p-4 rounded-xl"
					required
				/>
				<input
					type="number"
					name="amortizationPeriod"
					placeholder="Amortization Period (years)"
					value={formData.amortizationPeriod}
					onChange={handleChange}
					className="input input-bordered p-4 rounded-xl"
					required
				/>
				<select
					name="paymentSchedule"
					value={formData.paymentSchedule}
					onChange={handleChange}
					className="select select-bordered p-4 rounded-xl"
				>
					<option value="monthly">Monthly</option>
					<option value="bi-weekly">Bi-weekly</option>
					<option value="accelerated bi-weekly">Accelerated Bi-weekly</option>
				</select>
				<button type="submit" className="btn btn-primary bg-sky-400 p-4">
					Calculate
				</button>
			</form>

			{result && <p className="mt-4 text-green-600 font-bold">{result}</p>}
			{cmhcInsurance && (
				<p className="mt-2 text-blue-500 font-bold">{cmhcInsurance}</p>
			)}
			{error && <p className="mt-4 text-red-600 font-bold">{error}</p>}
		</div>
	);
};

export default MortgageCalculator;
