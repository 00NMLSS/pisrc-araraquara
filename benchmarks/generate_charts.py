import json
import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def setup_style():
    """Configura o estilo estético premium escuro para os gráficos."""
    plt.style.use('dark_background')
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
    plt.rcParams['axes.edgecolor'] = '#2d3748'
    plt.rcParams['axes.linewidth'] = 1.2
    plt.rcParams['grid.color'] = '#1a202c'
    plt.rcParams['grid.linestyle'] = '--'
    plt.rcParams['grid.alpha'] = 0.7

def generate_case1_charts(case1_data, output_dir):
    """Gera os gráficos referentes ao Caso 1: Redis Cache vs PostgreSQL."""
    concurrency = case1_data["concurrency"]
    redis_lat = case1_data["redis_cache"]["avg_latency_ms"]
    pg_lat = case1_data["postgres_db"]["avg_latency_ms"]
    redis_rps = case1_data["redis_cache"]["throughput_rps"]
    pg_rps = case1_data["postgres_db"]["throughput_rps"]

    fig_bg = '#0f172a'
    ax_bg = '#1e293b'

    # --- Chart 1A: Latency vs Concurrency ---
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=fig_bg)
    ax.set_facecolor(ax_bg)

    ax.plot(concurrency, redis_lat, marker='o', linewidth=3, markersize=8, color='#38bdf8', label='Redis Cache Hit (RAM)')
    ax.plot(concurrency, pg_lat, marker='s', linewidth=3, markersize=8, color='#f43f5e', label='PostgreSQL Direct Query (Disk/JPA)')

    ax.set_title('Caso 1: Latência Média de Leitura vs. Concorrência', fontsize=15, fontweight='bold', pad=15, color='#f8fafc')
    ax.set_xlabel('Usuários Concorrentes (Virtual Users)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_ylabel('Latência Média (ms)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_xticks(concurrency)
    ax.grid(True)
    ax.legend(frameon=True, facecolor='#0f172a', edgecolor='#334155', fontsize=11, labelcolor='#f1f5f9')

    # Anotações nos pontos extremos
    ax.annotate(f'{redis_lat[-1]} ms', (concurrency[-1], redis_lat[-1]), textcoords="offset points", xytext=(-25,12),
                ha='center', color='#38bdf8', fontweight='bold', fontsize=10,
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#0f172a', edgecolor='#38bdf8', alpha=0.9))
    
    ax.annotate(f'{pg_lat[-1]} ms', (concurrency[-1], pg_lat[-1]), textcoords="offset points", xytext=(-25,12),
                ha='center', color='#f43f5e', fontweight='bold', fontsize=10,
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#0f172a', edgecolor='#f43f5e', alpha=0.9))

    plt.tight_layout()
    chart1_path = os.path.join(output_dir, "case1_latency_cache_vs_db.png")
    plt.savefig(chart1_path, dpi=300)
    plt.close()

    # --- Chart 1B: Throughput Comparison ---
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=fig_bg)
    ax.set_facecolor(ax_bg)

    x = np.arange(len(concurrency))
    width = 0.35

    rects1 = ax.bar(x - width/2, redis_rps, width, label='Redis Cache (RPS)', color='#0ea5e9')
    rects2 = ax.bar(x + width/2, pg_rps, width, label='PostgreSQL Direct (RPS)', color='#e11d48')

    ax.set_title('Caso 1: Comparativo de Vazão Máxima (Requests / seg)', fontsize=15, fontweight='bold', pad=15, color='#f8fafc')
    ax.set_xlabel('Usuários Concorrentes', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_ylabel('Requisições por Segundo (RPS)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_xticks(x)
    ax.set_xticklabels(concurrency)
    ax.grid(True, axis='y')
    ax.legend(frameon=True, facecolor='#0f172a', edgecolor='#334155', fontsize=11, labelcolor='#f1f5f9')

    # Valores no topo das barras
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height}', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', color='#38bdf8', fontweight='bold', fontsize=8)

    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height}', xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', color='#fb7185', fontweight='bold', fontsize=8)

    plt.tight_layout()
    chart2_path = os.path.join(output_dir, "case1_throughput_comparison.png")
    plt.savefig(chart2_path, dpi=300)
    plt.close()

def generate_case2_charts(case2_data, output_dir):
    """Gera os gráficos referentes ao Caso 2: Percentis de Latência e Estresse por Endpoint."""
    endpoints = case2_data["endpoints"]
    concurrency_levels = case2_data["concurrency_levels"]

    fig_bg = '#0f172a'
    ax_bg = '#1e293b'

    # --- Chart 2A: Percentiles comparison ---
    fig, ax = plt.subplots(figsize=(11, 6), facecolor=fig_bg)
    ax.set_facecolor(ax_bg)

    percentiles = ['p50', 'p90', 'p95', 'p99']
    ep_names = list(endpoints.keys())
    colors = ['#10b981', '#3b82f6', '#f59e0b']

    x = np.arange(len(percentiles))
    width = 0.25

    for i, ep in enumerate(ep_names):
        vals = [endpoints[ep][p] for p in percentiles]
        rects = ax.bar(x + (i - 1) * width, vals, width, label=ep.split(' ')[0] + ' ' + ep.split(' ')[1], color=colors[i])
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height}ms', xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', color='#f1f5f9', fontsize=8, fontweight='bold')

    ax.set_title('Caso 2: Distribuição de Percentis de Latência (ms)', fontsize=15, fontweight='bold', pad=15, color='#f8fafc')
    ax.set_xlabel('Percentis de Resposta', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_ylabel('Latência (ms)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_xticks(x)
    ax.set_xticklabels(['p50 (Mediana)', 'p90', 'p95', 'p99 (Cauda)'])
    ax.grid(True, axis='y')
    ax.legend(frameon=True, facecolor='#0f172a', edgecolor='#334155', fontsize=10, labelcolor='#f1f5f9')

    plt.tight_layout()
    chart3_path = os.path.join(output_dir, "case2_endpoint_percentiles.png")
    plt.savefig(chart3_path, dpi=300)
    plt.close()

    # --- Chart 2B: Concurrency Stress Degradation (p95) ---
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=fig_bg)
    ax.set_facecolor(ax_bg)

    markers = ['o', 's', '^']
    for i, ep in enumerate(ep_names):
        stress_vals = endpoints[ep]["concurrency_stress"]
        ax.plot(concurrency_levels, stress_vals, marker=markers[i], linewidth=3, markersize=8, color=colors[i], label=ep)

    ax.set_title('Caso 2: Curva de Degradação de Latência (p95) sob Carga Extrema', fontsize=15, fontweight='bold', pad=15, color='#f8fafc')
    ax.set_xlabel('Usuários Concorrentes (Virtual Users)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_ylabel('Latência p95 (ms)', fontsize=12, color='#cbd5e1', labelpad=10)
    ax.set_xticks(concurrency_levels)
    ax.grid(True)
    ax.legend(frameon=True, facecolor='#0f172a', edgecolor='#334155', fontsize=10, labelcolor='#f1f5f9')

    plt.tight_layout()
    chart4_path = os.path.join(output_dir, "case2_concurrency_degradation.png")
    plt.savefig(chart4_path, dpi=300)
    plt.close()

def main():
    setup_style()
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, "results", "benchmark_data.json")
    output_dir = os.path.join(base_dir, "charts")
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print("Arquivo de dados não encontrado! Executando runner.py primeiro...")
        import runner
        runner.main()

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("Gerando gráficos de benchmark...")
    generate_case1_charts(data["case1"], output_dir)
    generate_case2_charts(data["case2"], output_dir)
    print(f"4 gráficos gerados com sucesso no diretório: {output_dir}")

if __name__ == "__main__":
    main()
