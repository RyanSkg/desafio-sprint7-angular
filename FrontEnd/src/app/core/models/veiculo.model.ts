export interface Veiculos extends Array<Veiculo> {}

export interface Veiculo{
  id: number | string
  vehicle: string
  volumetotal: number | string
  connected: number | string
  softwareUpdates: number | string
  img?: string
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}

// Dados retornados pelo endpoint POST /vehicleData (consulta por VIN)
export interface VeiculoData {
  id: number | string
  odometro: number
  nivelCombustivel: number
  status: 'on' | 'off' | string
  lat: number
  long: number
}

