export interface TransportationInput {
  carType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none'
  kmPerWeek: number
  flightsPerYear: number
}

export interface EnergyInput {
  electricityKwh: number
  heatingSource: 'gas' | 'electric' | 'oil' | 'solar'
}

export interface DietInput {
  type: 'meat-heavy' | 'meat-medium' | 'vegetarian' | 'vegan'
}

export interface ShoppingInput {
  monthlySpend: number
}

export interface WasteInput {
  recycleEnabled: boolean
  compostEnabled: boolean
}

export interface FootprintInput {
  transportation: TransportationInput
  energy: EnergyInput
  diet: DietInput
  shopping: ShoppingInput
  waste: WasteInput
}

export interface FootprintCalculationResult {
  totalCo2e: number // in kg CO2e per year
  breakdown: {
    transportation: number
    energy: number
    diet: number
    shopping: number
    waste: number
  }
}

// Standard Annual Emission Factors (in kg CO2e)
export const EMISSION_FACTORS = {
  transportation: {
    petrol: 0.18 * 52,    // kg CO2e per km/week * 52 weeks
    diesel: 0.17 * 52,
    hybrid: 0.10 * 52,
    electric: 0.04 * 52,
    none: 0,
    flightShort: 200,     // kg CO2e per flight
  },
  energy: {
    electricityKwhYearly: 0.40 * 12, // kg CO2e per monthly kWh * 12 months
    heating: {
      gas: 1500,     // kg CO2e flat annual
      electric: 600,
      oil: 2500,
      solar: 0,
    }
  },
  diet: {
    'meat-heavy': 2500,
    'meat-medium': 1700,
    'vegetarian': 1000,
    'vegan': 600,
  },
  shopping: {
    multiplierYearly: 0.45 * 12, // kg CO2e per monthly spend dollar * 12 months
  },
  waste: {
    baseYearly: 400,
    recycleDiscount: -120,
    compostDiscount: -80,
  }
}

export function calculateFootprint(input: FootprintInput): FootprintCalculationResult {
  // 1. Transportation
  const transFactor = EMISSION_FACTORS.transportation[input.transportation.carType] || 0
  const carEmissions = input.transportation.kmPerWeek * transFactor
  const flightEmissions = input.transportation.flightsPerYear * EMISSION_FACTORS.transportation.flightShort
  const transportationTotal = Math.round(carEmissions + flightEmissions)

  // 2. Energy
  const elecEmissions = input.energy.electricityKwh * EMISSION_FACTORS.energy.electricityKwhYearly
  const heatEmissions = EMISSION_FACTORS.energy.heating[input.energy.heatingSource] || 0
  const energyTotal = Math.round(elecEmissions + heatEmissions)

  // 3. Diet
  const dietTotal = EMISSION_FACTORS.diet[input.diet.type] || 1000

  // 4. Shopping
  const shoppingTotal = Math.round(input.shopping.monthlySpend * EMISSION_FACTORS.shopping.multiplierYearly)

  // 5. Waste
  let wasteTotal = EMISSION_FACTORS.waste.baseYearly
  if (input.waste.recycleEnabled) wasteTotal += EMISSION_FACTORS.waste.recycleDiscount
  if (input.waste.compostEnabled) wasteTotal += EMISSION_FACTORS.waste.compostDiscount
  wasteTotal = Math.max(80, wasteTotal) // min emissions floor

  const totalCo2e = transportationTotal + energyTotal + dietTotal + shoppingTotal + wasteTotal

  return {
    totalCo2e,
    breakdown: {
      transportation: transportationTotal,
      energy: energyTotal,
      diet: dietTotal,
      shopping: shoppingTotal,
      waste: wasteTotal,
    }
  }
}
