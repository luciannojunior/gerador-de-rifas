var app = angular.module('dpf')

app.service('TicketsService', [
  function() {
    function formataNumero(numero) {
      if (typeof numero !== 'number') return ''
      numero = '' + numero
      while (numero.length < 3) {
        numero = '0' + numero
      }
      return numero
    }

    function populaPaginaComImagens72(doc, dataUri) {
      var X_PRIMEIRA_IMAGEM = 10
      var X_SEGUNDA_IMAGEM = 110
      for (var i = 0; i <= 6; i++) {
        var yAtual = i * H_IMG + 10 + i * 5
        doc.addImage(dataUri, 'PNG', X_PRIMEIRA_IMAGEM, yAtual, W_IMG, H_IMG)
        doc.addImage(dataUri, 'PNG', X_SEGUNDA_IMAGEM, yAtual, W_IMG, H_IMG)
      }
    }

    function aplicaDataRifa(doc, dataString, yAtual) {
      var yData = yAtual - 4
      var x1Data = 72
      var x2Data = x1Data + 100
      doc.text(dataString, x1Data, yData)
      doc.text(dataString, x2Data, yData)
    }

    function aplicaPrecoRifa(doc, preco, yAtual) {
      var yPreco = yAtual
      var x1Preco = 50.5
      var x2Preco = x1Preco + 100

      var labelPreco = 'Preço: '
      doc.setFontType('bold')
      doc.text(labelPreco, x1Preco, yPreco)
      doc.text(labelPreco, x2Preco, yPreco)

      x1Preco = 60.5
      x2Preco = x1Preco + 100
      doc.setFontType('normal')
      preco = 'R$ ' + preco
      doc.text(preco, x1Preco, yPreco)
      doc.text(preco, x2Preco, yPreco)
    }

    function aplicaDataHoraIngresso(doc, dataString, hora, yAtual) {
      doc.setFontSize('7')
      doc.setFontType('bold')
      var LABEL_DATA = 'Data:'
      var LABEL_HORA = 'Hora:'
      var yData = yAtual + 2
      var x1Data = 35.5
      var x2Data = x1Data + 100

      var fator1 = 20
      doc.text(LABEL_DATA, x1Data, yData)
      doc.text(LABEL_DATA, x2Data, yData)
      doc.text(LABEL_HORA, x1Data + fator1, yData)
      doc.text(LABEL_HORA, x2Data + fator1, yData)

      doc.setFontType('normal')
      x1Data += 6.5
      x2Data = x1Data + 100
      var fator2 = 20.5
      doc.text(dataString, x1Data, yData)
      doc.text(dataString, x2Data, yData)
      doc.text(hora, x1Data + fator2, yData)
      doc.text(hora, x2Data + fator2, yData)
      return x1Data + fator2
    }

    function aplicaPrecoIngresso(doc, preco, yAtual, xData) {
      yAtual += 2
      var LABEL_PRECO = 'Preço:'
      doc.setFontType('bold')
      var x1Preco = xData + 7
      var x2Preco = x1Preco + 100
      doc.text(LABEL_PRECO, x1Preco, yAtual)
      doc.text(LABEL_PRECO, x2Preco, yAtual)

      doc.setFontType('normal')
      x1Preco += 8
      x2Preco += 8
      doc.text(preco, x1Preco, yAtual)
      doc.text(preco, x2Preco, yAtual)
    }

    function aplicaNomesNosIngressos(doc, yAtual, nome) {
      yAtual -= 20
      doc.setFontType('bold')
      nome = nome.toUpperCase()

      var x = 50
      doc.text(nome, x, yAtual)

      x += 100
      doc.text(nome, x, yAtual)
    }

    function populaPaginaComDataENumeracaoEPrecoRifa(
      doc,
      numeroInicial,
      dataString,
      preco
    ) {
      var numero = numeroInicial
      for (var j = 0; j <= 6; j++) {
        var yAtual = j * H_IMG + 10 + j * 5 + 31
        aplicaNumeracao(doc, numero, yAtual)
        numero += 2

        doc.setFontSize(8)
        doc.setFontType('normal')

        aplicaDataRifa(doc, dataString, yAtual)
        aplicaPrecoRifa(doc, preco, yAtual)
      }
    }

    function aplicaNumeracao(doc, numero, yAtual) {
      doc.setFontSize(12)
      doc.setFontType('bold')

      var x1 = 18
      var x2 = 118
      doc.text(formataNumero(numero), x1, yAtual)
      doc.text(formataNumero(numero), x1 + 73, yAtual)
      numero++
      doc.text(formataNumero(numero), x2, yAtual)
      doc.text(formataNumero(numero), x2 + 73, yAtual)
    }

    function populaMetadadosIngressos(
      doc,
      numeroInicial,
      dataString,
      preco,
      hora
    ) {
      var numero = numeroInicial
      for (var j = 0; j <= 6; j++) {
        var yAtual = j * H_IMG + 10 + j * 5 + 31
        aplicaNumeracao(doc, numero, yAtual)
        numero += 2

        doc.setFontSize(8)
        doc.setFontType('normal')

        var xData = aplicaDataHoraIngresso(doc, dataString, hora, yAtual)
        aplicaPrecoIngresso(doc, preco, yAtual, xData)
      }
    }

    var self = this

    self.gerarRifasDefault = function(dados, fundo) {
      var documentoRifas = new jsPDF()
      for (var pag = 1; pag <= dados.paginas; pag++) {
        populaPaginaComImagens72(documentoRifas, fundo)
        populaPaginaComDataENumeracaoEPrecoRifa(
          documentoRifas,
          (pag - 1) * 14 + dados.numeroInicial,
          dados.data,
          dados.preco
        )
        if (pag !== dados.paginas) {
          documentoRifas.addPage()
        }
      }
      // TODO: Colocar para exibir na página
      documentoRifas.save('Docs.pdf')
    }
    /**
     * Gera Rifas
     */
    self.gerarRifas = function(dados) {
      var documentoRifas = new jsPDF()
      for (var pag = 1; pag <= dados.paginas; pag++) {
        populaPaginaComImagens72(documentoRifas, IMG_RIFA)
        populaPaginaComDataENumeracaoEPrecoRifa(
          documentoRifas,
          (pag - 1) * 14 + dados.numeroInicial,
          dados.data,
          dados.preco
        )
        if (pag !== dados.paginas) {
          documentoRifas.addPage()
        }
      }
      // TODO: Colocar para exibir na página
      documentoRifas.save('Docs.pdf')
    }

    self.gerarRifasGot = function(dados) {
      self.gerarRifasDefault(dados, IMG_RIFA_GOT)
    }

    self.gerarRifasSensor = function gerarRifasSensor(dados) {
      self.gerarRifasDefault(dados, IMG_RIFA_SENSOR)
    }

    self.gerarRifasMoeda = function gerarRifasMoeda(dados) {
      self.gerarRifasDefault(dados, IMG_RIFA_MOEDA)
    }
    /**
     * Gera Rifas
     */
    self.gerarIngressos = function(dados) {
      var documentoIngressos = new jsPDF()
      for (var pag = 1; pag <= dados.paginas; pag++) {
        populaPaginaComImagens72(documentoIngressos, IMG_INGRESSO_SOBREMESA)
        populaMetadadosIngressos(
          documentoIngressos,
          (pag - 1) * 14 + dados.numeroInicial,
          dados.data,
          dados.preco,
          dados.hora
        )
        if (pag !== dados.paginas) {
          documentoIngressos.addPage()
        }
      }
      // TODO: Colocar para exibir na página
      documentoIngressos.save('Docs.pdf')
    }

    self.gerarIngressosFeijoada = function(dados) {
      var documentoIngressos = new jsPDF()
      for (var pag = 1; pag <= dados.paginas; pag++) {
        populaPaginaComImagens72(documentoIngressos, IMG_INGRESSO_FEIJOADA)
        populaMetadadosIngressos(
          documentoIngressos,
          (pag - 1) * 14 + dados.numeroInicial,
          dados.data,
          dados.preco,
          dados.hora
        )
        if (pag !== dados.paginas) {
          documentoIngressos.addPage()
        }
      }
      documentoIngressos.save('Docs.pdf')
    }
  },
])
