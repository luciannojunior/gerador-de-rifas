/**
 * Controller que faz tudo que é possível até agora. Me julguem
 *
 * @author Luciano Júnior
 */
app.controller('TicketsController', [
  'TicketsService',
  function(TicketsService) {
    var self = this

    this.servico = {}

    this.templatesDisponiveis = {
      RIFA_AC: "Rifa Assassins's Creed",
      INGRESSO_NOITE: 'Ingresso Noite de Sobremesas',
      INGRESSO_FEIJOADA: 'Ingresso Feijoada DPF',
      RIFA_GOT: 'Rifa Box Game of Thrones',
      RIFA_SENSOR: 'Rifa Sensor de Ré',
      RIFA_MOEDA: 'Rifa Moeda Centenário',
    }

    this.servico.templateSelecionado = 'RIFA_AC'

    this.getParametroData = function(template) {
      return !self.isEvento(template) ? 'sorteio' : 'evento'
    }

    this.isEvento = function(template) {
      return template.indexOf('INGRESSO') !== -1
    }

    this.gerarTickets = function(dados) {
      dados.paginas = parseInt(dados.paginas)
      dados.numeroInicial = parseInt(dados.numeroInicial)

      switch (dados.templateSelecionado) {
        case 'RIFA_AC':
          TicketsService.gerarRifas(dados)
          break
        case 'INGRESSO_NOITE':
          TicketsService.gerarIngressos(dados)
          break
        case 'INGRESSO_FEIJOADA':
          TicketsService.gerarIngressosFeijoada(dados)
          break
        case 'RIFA_GOT':
          TicketsService.gerarRifasGot(dados)
          break
        case 'RIFA_SENSOR':
          TicketsService.gerarRifasSensor(dados)
          break
        case 'RIFA_MOEDA':
          TicketsService.gerarRifasMoeda(dados)
          break
        default:
          break
      }
    }
  },
])
