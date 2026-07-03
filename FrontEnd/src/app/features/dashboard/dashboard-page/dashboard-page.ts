import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Vehicle } from '../../../core/services/vehicle';
import { Veiculo, VeiculoData } from '../../../core/models/veiculo.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit, OnDestroy {
  private vehicleService = inject(Vehicle);

  // Lista completa de veículos vinda do back-end (GET /vehicles)
  veiculos = signal<Veiculo[]>([]);
  carregandoVeiculos = signal(false);

  // Destaques (Passo 9): os 3 veículos com maior volume de vendas
  emDestaque = signal<Veiculo[]>([]);

  // Busca por modelo (Passo 8)
  termoBuscaModelo = '';
  veiculosFiltrados = signal<Veiculo[]>([]);
  veiculoSelecionado = signal<Veiculo | null>(null);
  private buscaModelo$ = new Subject<string>();

  // Busca por VIN na tabela (Passo 11)
  vin = '';
  dadosVeiculo = signal<VeiculoData | null>(null);
  erroVin = signal('');
  carregandoVin = signal(false);
  private buscaVin$ = new Subject<string>();

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.carregandoVeiculos.set(true);
    this.vehicleService.getVehicles().subscribe({
      next: (veiculos) => {
        this.veiculos.set(veiculos);
        this.veiculosFiltrados.set(veiculos);
        this.emDestaque.set(
          [...veiculos].sort((a, b) => Number(b.volumetotal) - Number(a.volumetotal)).slice(0, 3)
        );
        this.carregandoVeiculos.set(false);
        this.selecionarVeiculo(veiculos[0]);
      },
      error: () => {
        this.veiculos.set([]);
        this.veiculosFiltrados.set([]);
        this.emDestaque.set([]);
        this.carregandoVeiculos.set(false);
      },
    });

    // RxJS: debounceTime + distinctUntilChanged + filter + map
    const subModelo = this.buscaModelo$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((termo) => termo !== null && termo !== undefined),
        map((termo) =>
          this.veiculos().filter((v) =>
            v.vehicle.toLowerCase().includes(termo.trim().toLowerCase())
          )
        )
      )
      .subscribe((resultado) => {
        this.veiculosFiltrados.set(resultado);
        const aindaExiste = resultado.some((v) => v.id === this.veiculoSelecionado()?.id);
        if (resultado.length && !aindaExiste) {
          this.selecionarVeiculo(resultado[0]);
        } else if (!resultado.length) {
          this.veiculoSelecionado.set(null);
        }
      });

    const subVin = this.buscaVin$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((vin) => vin.trim().length >= 5)
      )
      .subscribe((vin) => this.consultarVeiculo(vin));

    this.subscriptions.add(subModelo);
    this.subscriptions.add(subVin);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onBuscaModeloChange(termo: string): void {
    this.termoBuscaModelo = termo;
    if (!termo) {
      this.veiculosFiltrados.set(this.veiculos());
      return;
    }
    this.buscaModelo$.next(termo);
  }

  selecionarVeiculo(veiculo: Veiculo | undefined | null): void {
    if (!veiculo) return;
    this.veiculoSelecionado.set(veiculo);
  }

  taxaConectividade(veiculo: Veiculo): number {
    const total = Number(veiculo.volumetotal) || 0;
    const conectados = Number(veiculo.connected) || 0;
    return total > 0 ? Math.round((conectados / total) * 100) : 0;
  }

  onBuscaVinChange(vin: string): void {
    this.vin = vin;
    this.erroVin.set('');
    if (!vin || vin.trim().length < 5) {
      this.dadosVeiculo.set(null);
      return;
    }
    this.buscaVin$.next(vin);
  }

  private consultarVeiculo(vin: string): void {
    this.carregandoVin.set(true);
    this.vehicleService.getVehicleData(vin).subscribe({
      next: (dados) => {
        this.carregandoVin.set(false);
        this.dadosVeiculo.set(dados);
        this.erroVin.set('');
      },
      error: (err) => {
        this.carregandoVin.set(false);
        this.dadosVeiculo.set(null);
        this.erroVin.set(err?.error?.message ?? 'Veículo não encontrado.');
      },
    });
  }

  statusBadgeClass(status: string): string {
    return status.toLowerCase() === 'on' ? 'selo selo--on' : 'selo selo--off';
  }
}
