$(document).ready(function(){

  // Ações do usuário que mostram e/ou escondem o logotipo.
  // Por padrão, mostra no topo e fim da página.
  // Remova ou reescreva de acordo com o projeto.

  $(window).on('scroll', _.debounce(function(){

    var nav = $("nav");
    var scroll = $(window).scrollTop();

    // Mostra o nav quando a página está no topo
    if(scroll == 0){
      nav.fadeIn();
    // Mostra a nav quando a página chega no fim
    } else if (scroll == $(document).height() - $(window).height()) {
      nav.fadeIn();
    //Esconde a nav
    } else {
      nav.fadeOut();
    }

  }, 50));

  // Volta uma etapa

  $(".etapa .voltarEtapa").on("click", function(){
    var etapaAtual = $(this).parents(".etapa");
    etapaAtual.hide();
    etapaAtual.prev(".etapa").fadeIn();
  })

  // Avança uma etapa ou mostra mensagem de erro

  $(".etapa .avancarEtapa").on("click", function(){
    var etapaAtual = $(this).parents(".etapa");
    if($(this).hasClass("habilitado")){
      etapaAtual.hide();
      etapaAtual.next(".etapa").fadeIn("slow");
    } else {
      etapaAtual.find(".mensagem-erro").fadeIn();
    }
  });

  $("#navOrientada .avancarEtapa").on("click", function(){
    $("#autoaval_orientada ol li").each(function(){
      var lengthChecked = $(this).find("input:checked").length;
      if(lengthChecked == 0){
        $(this).addClass("form-error");
      }
    });
  })

  // Clique nos botões de navegação entre etapas scrolla página para o topo

  $(".voltarEtapa, .avancarEtapa").on("click", function(){
    $('html,body').scrollTop(0);
  })

  // Aplica estilo na opção selecionada em Autoavaliação Espontânea

  $("input").on("click", function(){
    var formcheck = $(this).parent();
    if($(this).is(":checked")){
      formcheck.addClass("selecionado");
      formcheck.siblings().removeClass("selecionado");
    };
  });

  // Fixa labels da Autoavaliação orientada no scroll

  $("#autoaval_orientada .labels-header").stick_in_parent();

  // Volta ou avança perguntas da Autoavaliação Orientada

  $("#navPerguntas .avancarPergunta").on("click", function(){
    var perguntaAtual = $(".atual");
    // Verifica se respondeu
    var lengthChecked = perguntaAtual.find("input:checked").length;
    var mensagemErro = perguntaAtual.parent("ol").siblings(".mensagem-erro");
    // Se sim, avança
    if(lengthChecked != 0){
      mensagemErro.hide();
      perguntaAtual.removeClass("form-error atual");
      perguntaAtual.next("li").addClass("atual");
    // Se não, exibe erro
    } else {
      mensagemErro.show();
      perguntaAtual.addClass("form-error");
    }
    // Remove mensagem de erro quando o input é marcado
    $(".atual input").on("change", function(){
      mensagemErro.hide();
    })
    // Atualiza navegação
    atualizaNavPerguntas();
  });

  $("#navPerguntas .voltarPergunta").on("click", function(){
    var perguntaAtual = $(".atual");
    perguntaAtual.removeClass("atual");
    perguntaAtual.prev("li").addClass("atual");
    atualizaNavPerguntas();
  })

  // Se primeira pergunta ou última pergunta, exibe botão de navegação entre etapas

  function atualizaNavPerguntas(){
    $("#navPerguntas div:first-child").attr("class", "");
    if($(".atual").index() == 0){
      $("#navPerguntas div").addClass("inicio");
    } else if($(".atual").index() == $("#autoaval_orientada li").length - 1){
      $("#navPerguntas div").addClass("fim");
    } else {
      $("#navPerguntas div").addClass("meio");
    }
  }

  // Libera botão após todos os campos da etapa estarem preenchidos

  $("#autoaval_espontanea input").on("change", function(){
    $("#autoaval_espontanea .btn.avancarEtapa")
      .addClass("habilitado")
      .parents(".etapa").find(".mensagem-erro").fadeOut();
  })

  $("#autoaval_orientada input").on("change", function(){
    var lengthChecked = $("#autoaval_orientada input:checked").length;
    var lengthLi = $("#autoaval_orientada .input-group").length;
    if(lengthChecked == lengthLi){
      $("#autoaval_orientada .avancarEtapa")
        .addClass("habilitado")
        .parents(".etapa").find(".mensagem-erro").fadeOut();
    }
    $(this).parents("li").removeClass("form-error");

    // Atualiza barra de progresso da visualização para telas pequenas

    var perc_pergunta = 100/lengthLi;
    var perc_usuario = lengthChecked * perc_pergunta;
    $("#navPerguntas .barra-progresso > div").css("width", perc_usuario + "%");
  })

  // Clona opção selecionada em Autoavaliação Espontânea na Etapa de Análise do resultado

  $("#navEspontanea .btn").on("click", function(){
    $(".clone-espontanea .form-check").empty();
    $("#autoaval_espontanea .form-check.selecionado label").clone().appendTo(".clone-espontanea .form-check");
  })

  // No clique do botão ao final da Avaliação Orientada

  $("#autoaval_orientada .avancarEtapa").on("click", function(){

    // Define multiplicadores

    var multiplicador1 = 1;
    var multiplicador2 = 2;
    var multiplicador3 = 3;
    var multiplicador4 = 4;
    var multiplicador5 = 5;

    // Conta total de seleção de cada item e o multiplica pelo multiplicador correspondente

    function calcula_dimensao(dimensao){
      var n_option1 = $("#autoaval_orientada ." + dimensao + " input[value='option1']:checked").length;
      var n_option2 = $("#autoaval_orientada ." + dimensao + " input[value='option2']:checked").length;
      var n_option3 = $("#autoaval_orientada ." + dimensao + " input[value='option3']:checked").length;
      var n_option4 = $("#autoaval_orientada ." + dimensao + " input[value='option4']:checked").length;
      var n_option5 = $("#autoaval_orientada ." + dimensao + " [value='option5']:checked").length;

      var total_dimensao = n_option1 * multiplicador1 + n_option2 * multiplicador2 + n_option3 * multiplicador3 + n_option4 * multiplicador4 + n_option5 * multiplicador5;
      return total_dimensao;
    }

    // Soma o total de cada dimensão

    var total_disposicao = calcula_dimensao("dimensao-disposicao");
    var total_facilidade = calcula_dimensao("dimensao-facilidade");
    var total_reconhecimento = calcula_dimensao("dimensao-reconhecimento");
    var total_assertividade = calcula_dimensao("dimensao-assertividade");
    var total_competicao = calcula_dimensao("dimensao-competicao");
    var total_poder = calcula_dimensao("dimensao-poder");

    var total_orientada_usuario = total_disposicao + total_facilidade + total_reconhecimento + total_assertividade + total_competicao + total_poder;

    // Aponta nível do usuário de acordo com a soma total

    if(total_orientada_usuario >= 89){
      var nivel = "desenvolvida";
    } else if(total_orientada_usuario >= 56){
      var nivel = "moderada";
    } else if(total_orientada_usuario >= 24){
      var nivel = "inicial";
    } else {
      var nivel = "";
    }

    // Descobre o máximo total possível (número de perguntas * máximo multiplicador)

    var total_orientada_max = $("#autoaval_orientada li").length * multiplicador5;

    // Transforma total do usuário em porcentagem

    var porcentagem = total_orientada_usuario/total_orientada_max * 100;

    // Exibe porcentagem na barra de progresso da Parte 3

    $("#analise .barra-progresso > div").css("width", porcentagem + "%");

    // Exibe informações do nível na Parte 3

    $("#analise .nivel").text(nivel);
    $("#resposta_geral > div").removeClass("d-flex");
    $("#resposta_geral > div." + nivel).addClass("d-flex");

    // Atualiza gráficos das dimensões

    function atualiza_grafico(dimensao, total_dimensao){
      $(".quadro ." + dimensao + " .grafico > div").removeClass("filled");
      $(".quadro ." + dimensao + " .grafico > div:nth-child(-n+" + total_dimensao + ")").addClass("filled");
    }

    atualiza_grafico("disposicao", total_disposicao);
    atualiza_grafico("facilidade", total_facilidade);
    atualiza_grafico("reconhecimento", total_reconhecimento);
    atualiza_grafico("assertividade", total_assertividade);
    atualiza_grafico("competicao", total_competicao);
    atualiza_grafico("poder", total_poder);

  });

  // Libera resposta detalhada

  $(".btn-detalhada").on("click", function(){
    $("#resposta_detalhada").fadeIn("slow");
    $('html, body').animate({
      scrollTop: $("#resposta_detalhada").offset().top - 60
    }, 1000)
  })

  // Libera conclusão e popup de impressão

  $("#btnConclusao").on("click", function(){
    $(this).hide();
    $("#conclusao").fadeIn("slow");
    $('html, body').animate({
      scrollTop: $("#conclusao").offset().top - 60
    }, 1000)
    $(".popup").addClass("visible");
  })

  // Clique no link de impressão abre janela de impressão
  $(".btn-imprimir").on("click", function(){
    window.print();
  });

});
