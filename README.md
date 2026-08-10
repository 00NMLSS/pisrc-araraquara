# Quintadinha Online - E-Commerce Microservices Architecture

Plataforma e-commerce de hortifruti orgânico construída com arquitetura de microserviços e API Gateway BFF.

## Arquitetura do Sistema

Componentes da aplicação:

- **Frontend**: Aplicação web em React/Next.js (porta 3000).
- **Nginx Reverse Proxy**: Gateway de entrada (porta 80).
- **BFF Gateway**: API Gateway Node.js/TypeScript (porta 8080).
- **Auth Service**: Autenticação e gestão de JWT em GraalVM Native (porta 8081).
- **Catalog Service**: Catálogo de produtos com suporte a busca via Elasticsearch e Redis (porta 8082).
- **Order Service**: Processamento transacional de pedidos via RabbitMQ (porta 8083).
- **Banco de Dados**: PostgreSQL 16 (Primary e Replica) com pooling PgBouncer.
- **Cache e Filas**: Redis 7.0 e RabbitMQ 3.12.
- **Observabilidade**: OpenTelemetry Collector, Grafana, Loki, Tempo e Mimir.

## Benchmarks de Performance

A suíte de testes de desempenho está localizada no diretório `benchmarks/`. Os testes cobrem dois cenários distintos de uso.

---

### Caso 1: Comparativo de Desempenho de Leitura (Redis Cache Hit vs. PostgreSQL Direct Query)

Este teste avalia o tempo de resposta no endpoint `GET /api/catalog/products` ao consultar dados em cache (Redis) versus consulta direta ao PostgreSQL via JPA com pool do PgBouncer. Os testes variam de 10 a 500 usuários simultâneos.

#### Gráficos

![Latência Média: Redis Cache vs PostgreSQL Direto](benchmarks/charts/case1_latency_cache_vs_db.png)

![Comparativo de Vazão Máxima (RPS)](benchmarks/charts/case1_throughput_comparison.png)

#### Resultados Medidos

| Concorrência (VUs) | Redis Latência Média (ms) | Redis p95 (ms) | Redis Throughput (RPS) | PostgreSQL Latência Média (ms) | PostgreSQL p95 (ms) | PostgreSQL Throughput (RPS) | Redução de Latência (%) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **10** | 2.61 ms | 4.15 ms | 11.676 RPS | 20.85 ms | 46.82 ms | 2.299 RPS | 87,5% |
| **50** | 3.07 ms | 4.88 ms | 11.055 RPS | 28.04 ms | 64.80 ms | 1.819 RPS | 89,1% |
| **100** | 3.28 ms | 5.10 ms | 10.241 RPS | 40.70 ms | 95.15 ms | 1.536 RPS | 91,9% |
| **250** | 4.24 ms | 6.53 ms | 8.276 RPS | 73.89 ms | 176.80 ms | 925 RPS | 94,3% |
| **500** | 6.60 ms | 9.78 ms | 6.387 RPS | 126.51 ms | 307.19 ms | 636 RPS | 94,8% |

A utilização de cache em memória com Redis mantém o percentil p95 abaixo de 10 ms sob carga de 500 requisições simultâneas, enquanto a consulta direta ao banco atinge 307 ms. O throughput com cache atinge 6.387 RPS contra 636 RPS na consulta direta ao PostgreSQL.

---

### Caso 2: Latência por Percentis e Comportamento sob Carga por Endpoint

Este teste compara a distribuição de latência (p50, p90, p95 e p99) entre três serviços:

1. **Auth JWT Validate** (`/api/auth/validate`): Validação de token no Auth Service.
2. **Catalog Search** (`/api/catalog/products`): Consulta de produtos indexados.
3. **Order Checkout** (`/api/orders/checkout`): Criação de pedido com persistência transacional e mensageria via RabbitMQ.

#### Gráficos

![Percentis de Latência por Endpoint](benchmarks/charts/case2_endpoint_percentiles.png)

![Degradação de Latência sob Estresse](benchmarks/charts/case2_concurrency_degradation.png)

#### Resultados Medidos (Percentis em Carga Média)

| Endpoint | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | p95 a 500 VUs (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Auth JWT Validate** | 4.2 | 8.5 | 11.8 | 18.4 | 36.5 |
| **Catalog Search** | 6.8 | 14.2 | 19.5 | 31.0 | 58.0 |
| **Order Checkout** | 42.0 | 88.5 | 115.0 | 185.2 | 385.0 |

Os endpoints de leitura (`Auth` e `Catalog`) mantêm latências p95 inferiores a 60 ms no nível máximo de estresse. O fluxo de checkout apresenta latência superior devido ao custo de gravação síncrona no PostgreSQL e publicação da mensagem no RabbitMQ.

---

## Execução dos Benchmarks

Estrutura das ferramentas de teste em `benchmarks/`:

1. Instale as dependências:
   ```bash
   pip install -r benchmarks/requirements.txt
   ```

2. Colete as métricas de execução:
   ```bash
   python benchmarks/runner.py
   ```

3. Gere os gráficos de desempenho:
   ```bash
   python benchmarks/generate_charts.py
   ```
