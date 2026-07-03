import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Veiculo, VeiculosAPI, VeiculoData } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class Vehicle {
  constructor(private http: HttpClient) {}

  /**
   * Busca a lista de veículos disponíveis (GET /vehicles).
   * Usa o operador "pluck" para extrair somente o array "vehicles" da resposta.
   */
  getVehicles(): Observable<Veiculo[]> {
    return this.http
      .get<VeiculosAPI>(`${environment.apiUrl}/vehicles`)
      .pipe(pluck('vehicles'));
  }

  /**
   * Busca os dados detalhados de um veículo a partir do código VIN
   * (POST /vehicleData). Usa "map" para repassar somente os dados úteis.
   */
  getVehicleData(vin: string): Observable<VeiculoData> {
    return this.http
      .post<VeiculoData>(`${environment.apiUrl}/vehicleData`, { vin })
      .pipe(map((data) => data));
  }
}
