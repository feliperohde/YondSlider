/*
 Yond Slider para jQuery versão 1.0
 Copyright (c) 2011 Felipe Rohde
 http://felipeRohde.deviantart.com
 http://grooveshark.com/feliperohde
 http://yond.com.br/

 OBS: alguns Eases do jQuery Easing podem não funcionar adequadamente no evento MOUSEOVER pelo fato de que o posicionamento dos elementos é dinâmico, exemplo: easeInElastic e afins

 */
(function($) {
	$.fn.YondSlider = function(options) {
		var defaults = {
			event : 'click', // jQuery EVENTS: Em que evento a ação será iniciada; (mouseover,click,doubleclick,mouseout...)
			easing : 'easeInOutCirc', // jQuery Easing Plug-in: Define o efeito de easing para os sliders pais
			easingInner : 'easeOutExpo', // jQuery Easing Plug-in: Define o easing para sliders internos
			hubVertical : false, // TRUE/FALSE: Em fase de testes; É possíve escolher se o slider pai vai funcionar na vertical ou na horizontal (são necessárias mudanças de css para tudo ocorrer bem)
			hubVerticalInner : false, // TRUE/FALSE: Em fase de testes, eixo dos slides filhos, define se a transição interna ocorrerá na vertical ou na horizontal
			scroll : false, // TRUE/FALSE: Se true Habilita o scroll do mouse nos slides (jQuery mouse whell necessário)
			keyboard : false, // TRUE/FALSE: Em fase de testes (nao recomendavel usar): habilita controles pelo teclado.
			pagerOver : true, // TRUE/FALSE: Se true faz com que a paginação suma no Mouse Out
			caption : true, // TRUE/FALSE: Se true faz com que caption seja mostrado (necessita HTML)
			pin : true, // TRUE/FALSE: Se true podemos deixar o ultimo slide da ação aberto :)
			defaultYond : null, // NÚMERO (int): Se for diferente de null o valor será o slide aberto inicialmente da esquerda para a direita começando com 1
			defaultYondInner : 1, // NÚMERO (int): Igual ao item acima, no entanto este é valido apenas para os filhos.
			spacing : 1, // NÚMERO (int): Espaço entre os slides pais (em px)
			duration : 400, // NÚMERO (int): Tempo de transição para slides pais
			durationInner : 800, // NÚMERO (int): Tempo de transição para slides filhos
			pager : true, // TRUE/FALSE: Se true, mostra a paginação dos slides filhos (verificar HTML)
			animation : true, // TRUE/FALSE: Se true, haverá efeitos de transição nos slides filhos
			rand : '[all]', // TRUE/FALSE/array[]/string: true/false/[1,2,5...]/[all]/all: os slides filhos selecionados com a regra serão rotacionados automaticamente e aleatoriamente
			OutRand : false, // TRUE/FALSE: Passa os sliders externos de tempo em tempo
			randtime : 4000, //4seg    // NÚMERO (int): Se rand tiver uma régra diferente de false/null/undefined, este é o tempo de entre as randomizações
			display : 1, // NÚMERO (int): Quantos slides (filhos) serão passados por ação (tem influência sobre a paginação)
			controls : true, // TRUE/FALSE: Se true, será exibido controles de proximo e antreios nos sliders filhos
			innerSlider : '.slider', // ELEM (string): Elemento/class dos sliders filhos (verifique HTML e siga o padrão)
			outSlider : this, // ELEM (string): Elemento/class dos sliders pais (verifique HTML e siga o padrão)
			iListMarker : 'dt', // ELEM (string): Elemento/TAG, os sliders internos são identificados por esta tag :)
			callback : null, // resposta de ação para sliders pais
			callbackInner : null 		    // resposta de ação para sliders filhos
		};

		var o = $.extend(defaults, options);
		// o = opções
		var CoA = (o.hubVertical ? 'height' : 'width');
		// CoA = comprimento ou altura
		var EoT = (o.hubVertical ? 'top' : 'left');
		// EoT = esquerda ou topo

		var total = $(o.innerSlider).size();

		// verifica se um indice pode ser encontrado nos valores informados em OBJ
		function randIncs(arr, obj) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == obj) {
					return true;
				}
			}
		}

		//Habilita controles externos
		$.fn.Ystart = function() {
			$(o.innerSlider, o.outSlider).data('ynd').start();
		};
		// o.innerSlider ou THIS
		$.fn.Ystop = function() {
			$(o.innerSlider, o.outSlider).data('ynd').stop();
		};
		// o.innerSlider ou THIS
		$.fn.Ymove = function(iNum) {
			$(o.innerSlider, o.outSlider).data('ynd').move(iNum - 1, true);
		};

		$.fn.YOmove = function(iNum) {
			$(o.innerSlider).eq(iNum).trigger(o.event).addClass('active');
		};

		$.fn.YOnext = function() {

			var index = $('.active').index();

			if(index == (total - 1))
				$('.theyond').eq(0).trigger(o.event,[true]);
			else
				$('.theyond.active').next().trigger(o.event,[true]);
		};

		$.fn.YOprev = function() {

			var index = $('.active').index();

			if(index == 0)
				$('.theyond').eq(total - 1).trigger(o.event,[true]);
			else
				$('.theyond.active').prev().trigger(o.event,[true]);
		};
		function randExternal() {
			clearTimeout(tempo);
			var index = $('.active').index();
			if(index == (total - 1))
				$('.theyond').eq(0).trigger(o.event,[true]);
			else
				$('.theyond.active').next().trigger(o.event,[true]);
			var tempo = setTimeout(randExternal, o.randtime + (o.randtime / 2));
		}

		if(o.OutRand)
			randExternal();

		$(o.outSlider).find('.pagenum').click(function() {

			var ehActive = $(this).parents('theyond').parent().parent();
			// coisa feia

			if(!$(ehActive).hasClass('active')) {
				//alert($(ehActive).attr('class'));
				$(ehActive).trigger(o.event,[true]);
			}
			return false;
		});

		$('.buttons', o.outSlider).click(function() {
			$(this).parent().trigger(o.event,[true]);
		});

		o.outSlider.each(function()// verificar compatibilidade jquery, usar $(o.outSlider).each
		{
			box = $(this);
			var beyond = box.children('div');
			var normCoA = beyond.eq(0).css(CoA).replace(/px/, '');
			// normCoA = TAMANHO NORMAL
			//alert(normCoA);
			if(!o.max) {

				o.max = (normCoA * beyond.size()) - (o.min * (beyond.size() - 1));
			} else {
				o.min = ((normCoA * beyond.size()) - o.max) / (beyond.size() - 1);
			}
			// setando a altura do box do elemento pai
			if(o.hubVertical) {
				box.css({
					width : beyond.eq(0).css('width'),
					height : (normCoA * beyond.size()) + (o.spacing * (beyond.size() - 1)) + 'px'
				});
			} else {
				box.css({
					width : (normCoA * beyond.size()) + (o.spacing * (beyond.size() - 1)) + 'px',
					height : beyond.eq(0).css('height')
				});
			}

			//calcular o valor de todos menos do primeiro e do ultimo
			var preCalcEoTs = [];
			//  pré calculo da esquerda
			for( i = 0; i < beyond.size(); i++) {
				preCalcEoTs[i] = [];
				// nao precisamos calcular valores para o primeiro slider
				for( j = 1; j < beyond.size() - 1; j++) {
					if(i == j) {
						preCalcEoTs[i][j] = o.hubVertical ? j * o.min + (j * o.spacing) : j * o.min + (j * o.spacing);
					} else {
						preCalcEoTs[i][j] = (j <= i ? (j * o.min) : (j - 1) * o.min + o.max) + (j * o.spacing);
					}
				}
			}

			beyond.each(function(i) {

				//arrayRands = (o.randThis).split(',');
				//alert($(this).index());

				if(randIncs(o.rand, $(this).index() + 1) || o.rand == 'all' || o.rand == '[all]' || o.rand == true) {

					$(this).find('.door').addClass('Yrand');
					//alert(1);

				}

				var theBeyond = $(this);
				// setando a altura ou comprimento e a position top ou left
				// para o primeiro slider pai
				if(i === 0) {
					theBeyond.css(EoT, '0px');
				}
				// para o ultimo slider pai
				else if(i == beyond.size() - 1) {
					theBeyond.css(o.hubVertical ? 'bottom' : 'right', '0px');
				}
				// para todos os outros
				else {
					theBeyond.css(EoT, (i * normCoA) + (i * o.spacing));
					if(o.defaultYond != null) {
						theBeyond.css(EoT, preCalcEoTs[(o.defaultYond)-1][i]);
					} else {
						theBeyond.css(EoT, (i * normCoA) + (i * o.spacing));
					}
				}

				// A  T  E  N  Ç  Ã  O  : o.defaultYond -1 é para que na contagem se inicie a partir do 1 e não de zero

				if(o.defaultYond != null) {
					//antigo modo de setar a pagina inicial, feio
					//$(o.outSlider).find('.theyond').eq(o.defaultYond).addClass('active').trigger(o.event);

					if(o.defaultYond - 1 == i) {
						theBeyond.css(CoA, o.max + 'px');
						theBeyond.addClass('active');
					} else {
						theBeyond.css(CoA, o.min + 'px');
						theBeyond.removeClass('active');
					}
				}
				theBeyond.css({
					margin : 0,
					position : 'absolute'
				});

				theBeyond.bind(o.event, function(event) {

					//event.preventDefault(); // ser der preventDefault os links não funcionam

					// CALCULA VALORES DO SLIDER ANTERIOR (ALTURA, LARGURA, POSIÇÃO LEFT E TOP)
					var prevCoAs = [];
					// prevCoAs = PREVIOUS-COMPRIMENTO-OU-ALTURA
					var prevEoTs = [];
					// prevEoTs = PREVIOUS-ESQUERDAS-OU-TOPOS
					beyond.stop().removeClass('active');
					beyond.find('.verticalTitle').removeClass('activeTitle');

					theBeyond.find('.buttons').css('display', 'none');
					// gambi

					for( j = 0; j < beyond.size(); j++) {
						prevCoAs[j] = beyond.eq(j).css(CoA).replace(/px/, '');
						prevEoTs[j] = beyond.eq(j).css(EoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[CoA] = o.max;
					var maxDif = o.max - prevCoAs[i];
					var prevCoAsMaxDifRatio = prevCoAs[i] / maxDif;

					$('.buttons').fadeOut();
					theBeyond.find('.buttons').css('display', 'block');
					// gambi

					$(this).find('.verticalTitle').addClass('activeTitle');
					theBeyond.find('.view').focus();
					theBeyond.addClass('active').animate(aniObj, {

						step : function(now) {
							//calculando o resultado da animação em porcentagem
							var percentage = maxDif != 0 ? now / maxDif - prevCoAsMaxDifRatio : 1;
							// ajustando os outros elementos com esta porcentagem
							beyond.each(function(j) {
								if(j != i) {
									beyond.eq(j).css(CoA, prevCoAs[j] - ((prevCoAs[j] - o.min) * percentage) + 'px');
								}
								if(j > 0 && j < beyond.size() - 1) {// nao precisa para o primero e para o ultimo
									beyond.eq(j).css(EoT, prevEoTs[j] - ((prevEoTs[j] - preCalcEoTs[i][j]) * percentage) + 'px');
								}
							});
						},
						duration : o.animation ? o.duration : 0,
						easing : o.easing,
						complete : function() {
							if( typeof o.callback == 'function')
								o.callback.call(this);
						}
					});
					//return false; // se der return false, os links dentro do slider nao funcionam, isso é como um preventDefault do jquery
				});
			});
			if(o.pin == false) {
				box.bind("mouseleave", function() {
					var prevCoAs = [];
					var prevEoTs = [];
					beyond.removeClass('active').stop();
					for( i = 0; i < beyond.size(); i++) {
						prevCoAs[i] = beyond.eq(i).css(CoA).replace(/px/, '');
						prevEoTs[i] = beyond.eq(i).css(EoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[CoA] = normCoA;
					var normDif = normCoA - prevCoAs[0];
					beyond.eq(0).animate(aniObj, {
						step : function(now) {
							var percentage = normDif != 0 ? (now - prevCoAs[0]) / normDif : 1;
							for( i = 1; i < beyond.size(); i++) {
								beyond.eq(i).css(CoA, prevCoAs[i] - ((prevCoAs[i] - normCoA) * percentage) + 'px');
								if(i < beyond.size() - 1) {
									beyond.eq(i).css(EoT, prevEoTs[i] - ((prevEoTs[i] - ((i * normCoA) + (i * o.spacing))) * percentage) + 'px');
								}
							}
						},
						duration : o.animation ? o.duration : 0,
						easing : o.easing,
						/*complete: function(){
						if(typeof o.callback=='function')
						o.callback.call(this);
						}*/
						// esse é o callBack executado quando o slider PAI volta ao seu estado normal
					});
				});
			}

		});
		//fim out slider

		$(o.innerSlider).each(function() {

			// se tiver paginaçao, iniciamos suas opçoes
			if($(this).find('.pager') && o.pagerOver)// fadeIn/fadeOut na paginaçao
			{
				$(this).hover(function() {
					//alert(1);
					$(this).find('.pager').stop().animate({
						opacity : 1
					}, 'fast');
					//return false;
				}, function() {
					// /alert(1);
					$(this).find('.pager').stop().animate({
						opacity : 0
					}, 1500);
					//return false;
				});
			}

			// se a contagen de itens setados como lista for maior que um, entao criamos o carroucel
			if($(this).find(o.iListMarker).size() > 1) {
				//alert(1);
				$(this).data('ynd', new YondCaroucel($(this), o));
				//ativa a função e da inicio ao laço de sliders internos

			} else// se o slide nao tiver slides internos entao continua fazendo scroll dos slides pais... (verificar laço de slides internos para configuração do wheel para eles)
			{

				if(o.scroll) {

					$(this).mousewheel(function(objEvent, intDelta) {
						//vel = Math.abs(intDelta);
						//alert($(this));
						//$('#shadow').html(vel);
						$(this).trigger(o.event,[true]);
						// se eu rolar o scroll em cima de um slide, este slide vai ser aberto e setado como ativo
						if(!$(this).parent().hasClass('active')) {
							if(!$(this).parent().hasClass('scrolled')) {
								//sem code aqui :( em faze de testes
							}

						} else {
							if(intDelta > 0) {
								$(this).parent().prev().trigger(o.event);
								//$(this).addClass('inactive');
								//$(this).parent().addClass('scrolled');
							}
							if(intDelta < 0) {
								$(this).parent().next().trigger(o.event);
								//$(this).parent().addClass('scrolled');
							}

						}
						return false;
					});
				}
			}
		});
		function YondCaroucel(root, o) {
			var oSelf = this;
			var oViewport = $('.door', root).first();
			var oContent = $('.view', root).first();
			var oPages = oContent.children();
			var oBtnNext = $('.next', root).first();
			var oBtnPrev = $('.prev', root).first();
			var oPager = $('.pager', root).first();

			var iPageSize, iSteps, iCurrent, oTimer, bPause, bForward = true, bhubVerticalInner = o.hubVerticalInner == false;
			var countElens = $(oContent).find(o.iListMarker).size() - 1;
			var intOverallDelta = countElens;

			function ini() {
				iPageSize = bhubVerticalInner ? $(oPages[0]).outerWidth(true) : $(oPages[0]).outerHeight(true);

				var iLeftover = Math.ceil((( bhubVerticalInner ? oViewport.outerWidth() : oViewport.outerHeight()) / (iPageSize * o.display)) - 1);
				iSteps = Math.max(1, Math.ceil(oPages.length / o.display) - iLeftover);
				iCurrent = Math.min(iSteps, Math.max(1, o.defaultYondInner)) - 2;

				oContent.css( bhubVerticalInner ? 'width' : 'height', (iPageSize * oPages.length));

				oSelf.move(1);

				setEvents();

				return oSelf;
			};

			function setEvents() {

				if(o.controls && oBtnPrev.length > 0 && oBtnNext.length > 0) {
					//JQUERY MOUSE WHELL

					if(o.defaultYondInner > 1) {
						// se existir um slider filho padrão para ser aberto, ajusta as posições para o scroll
						intOverallDelta = intOverallDelta + 1 - (o.defaultYondInner);

					}

					if(o.keyboard == true) {

						$(document).bind('keydown', function(e) {// event

							//alert($(event.target).parents().index(o.innerSlider));
							if($(e.target).parents().index(o.innerSlider) == -1) {
								//alert(1);
							}

						});

						$(document).keydown(function(e) {

							//alert($(this).attr('class'));
							//alert(e.keyCode);

							if(e.keyCode == 39) {
								if(intOverallDelta > 0) {
									intOverallDelta--;
									oSelf.move(1);
									//alert(11);
									return false;

								} else {
									//alert($(this).parent().parent().attr('class'));

									//$(this).parent().parent().next().trigger(o.event);
								}

							}

							if(e.keyCode == 37) {
								if(intOverallDelta >= 0 && intOverallDelta < (countElens)) {
									//alert(countElens);
									intOverallDelta++;
									//alert(1); // 37 key code
									oSelf.move(-1);
									return false;
								} else {
									//$(this).parent().parent().prev().trigger(o.event);
								}

							}

						});
					}

					if(o.scroll) {

						$(oViewport).mousewheel(function(objEvent, intDelta) {

							$(this).trigger(o.event);
							// aplica o evento no elemento também no onScroll
							//$('.pagenum').trigger(o.event);
							if(intDelta > 0) {
								if(intOverallDelta >= 0 && intOverallDelta < (countElens)) {
									intOverallDelta++;
									//alert(1); // 37 key code
									oSelf.move(-1);
									return false;
								} else {
									//alert($(this).parent().parent().attr('class'));
									$(this).parents('.theyond').prev().trigger(o.event,[true]);
								}

							} else if(intDelta < 0) {
								if(intOverallDelta > 0) {
									intOverallDelta--;
									oSelf.move(1);
									return false;
								} else {
									$(this).parents('.theyond').next().trigger(o.event,[true]);
								}

							}
						});
					}
					//JQUERY MOUSE WHELL

					oBtnPrev.click(function() {
						intOverallDelta++;
						oSelf.move(-1);
						return false;
					});
					oBtnNext.click(function() {
						intOverallDelta--;
						oSelf.move(1);
						return false;
					});
				}

				if(o.rand != null && o.rand != false) {
					$(o.innerSlider).hover(oSelf.stop, oSelf.start);
				}
				//no estado hover do inner slider para o rand.
				if(o.pager && oPager.length > 0) {
					//alert($(oPager).attr('href'));

					$('a', oPager).click(setPager);
					// not a
				}

			};

			function setButtons() {
				if(o.controls) {
					oBtnPrev.toggleClass('disable', !(iCurrent > 0));
					oBtnNext.toggleClass('disable', !(iCurrent + 1 < iSteps));
				}
				if(o.pager) {
					var oNumbers = $('.pagenum', oPager);
					oNumbers.removeClass('activeslide');
					$(oNumbers[iCurrent]).addClass('activeslide');
				}
				//return false;
			};

			function setPager(oEvent) {
				if($(this).hasClass('pagenum')) {
					intOverallDelta = countElens - parseInt(this.rel);
					oSelf.move(parseInt(this.rel), true);
					// not a
				}
				return false;
			};

			function setTimer() {
				if((o.rand && !bPause && $(oViewport).hasClass('Yrand')))// preciso dar uma melhorada nesses testes
				{
					//$(oSelf).eq(0).css('display', 'none');
					clearTimeout(oTimer);
					oTimer = setTimeout(function() {
						iCurrent = iCurrent + 1 == iSteps ? -1 : iCurrent;
						bForward = iCurrent + 1 == iSteps ? false : iCurrent == 0 ? true : bForward;
						oSelf.move( bForward ? 1 : -1);
						intOverallDelta = countElens - iCurrent;
					}, (o.randtime + (Math.random() * 30)));
				}
				//return false;

			};


			this.stop = function() {
				clearTimeout(oTimer);
				bPause = true;
			};

			this.start = function() {
				bPause = false;
				setTimer();
			};

			this.move = function(iDirection, bPublic) {
				if($(o.iListMarker, this).find('.Ycaption') && o.caption) {
					// /alert(1);
					// alert($(oSelf).find('.YcaptionGroup').find('.Ycaption'));
					$('.Ycaption').stop().delay(o.durationInner + 120).css({
						'opacity' : 0
					}).animate({
						marginTop : +10,
						opacity : 1
					}, {
						duration : 200
					}).animate({
						marginTop : 0,
						opacity : 1
					}, {
						duration : 200
					});
				}
				iCurrent = bPublic ? iDirection : iCurrent += iDirection;

				if(iCurrent > -1 && iCurrent < iSteps) {
					var oPosition = {};
					oPosition[ bhubVerticalInner ? 'left' : 'top'] = -(iCurrent * (iPageSize * o.display));

					//alert(oPosition);
					oContent.animate(oPosition, {
						queue : false,
						easing : o.easingInner,
						duration : o.animation ? o.durationInner : 0,
						complete : function() {
							if( typeof o.callbackInner == 'function')
								o.callbackInner.call(this, oPages[iCurrent], iCurrent);
						}
					});

					setButtons();
					setTimer();
					//intOverallDelta++;

				}
				//return false;
			};
			return ini();
			// faz as mágicas

		};

	};
})(jQuery);
