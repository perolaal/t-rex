var trex,
  trex_correndo,
  solo,
  soloInvisivel,
  rand,
  imagemDaNuvem,
  obstaculo,
  pontuacao,
  grupoNuvens,
  grupoCactos;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var fim, fiming;
var reiniciar, reiming;
var fonte;
var trex_falece;
var somMorte, somPulo, somPontos;

function preload() {
  //criar animação do T-Rex correndo
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  //carregar imagem do solo
  imagemDoSolo = loadImage("solo2.png");

  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvem.png");

  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");
  fiming = loadImage("fimDoJogo.png");
  reiming = loadImage("reiniciar.png");
  fonte = loadFont("fonte.ttf");
  trex_falece = loadAnimation("trex_colidiu.png");

  somMorte = loadSound("morte.mp3");
  somPulo = loadSound("pulo.mp3");
  somPontos = loadSound("checkPoint.mp3");
}

function setup() {
  //cria a tela
  createCanvas(600, 200);
  //cria solo
  solo = createSprite(300, 190, 1200, 20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo);
  solo.x = solo.width / 2;

  fim = createSprite(300, 75);
  reiniciar = createSprite(300, 125);

  fim.addImage("qualquer coisa que voce quiser", fiming);
  fim.visible = false;
  reiniciar.addImage("nao sei", reiming);
  reiniciar.scale = 0.8;
  reiniciar.visible = false;

  //cria solo invisível
  soloInvisivel = createSprite(300, 200, 600, 10);
  soloInvisivel.visible = false;

  //cria sprite do T-Rex
  trex = createSprite(50, 60, 20, 50);
  trex.scale = 0.5;
  trex.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("falece", trex_falece);
  trex.setCollider("circle", 0, 0, 42);
  //trex.setCollider("circle",150,0,42);
  //atribuir valor inicial à pontuação
  pontuacao = 0;

  grupoNuvens = new Group();
  grupoCactos = new Group();
  trex.debug = false;
}

function draw() {
  //fundo branco
  background("white");
  textFont(fonte);
  fill(100);
  text(pontuacao, 550, 20);

  //desenha os sprites
  drawSprites();

  //Trex colide com o solo
  trex.collide(soloInvisivel);

  if (estadoJogo === JOGAR) {
    pontuacao = Math.round(pontuacao + frameRate() / 60);
    if (pontuacao % 100 === 0 && pontuacao > 0) {
      somPontos.play();
    }
    //T-Rex pula ao apertar espaço
    if (keyDown("space") && trex.y > 170) {
      trex.velocityY = -15;
      somPulo.play();
    }

    //gravidade
    trex.velocityY = trex.velocityY + 1;

    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(6 + (pontuacao * 3) / 100);

    //faz o solo voltar ao centro se metade dele sair da tela
    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }

    //gerar nuvens
    gerarNuvens();

    //gerar obstáculos
    gerarObstaculos();

    if (grupoCactos.isTouching(trex)) {
      somMorte.play();
      //trex.velocityY = -15;
      //somPulo.play()
      estadoJogo = ENCERRAR;
    }
  } else if (estadoJogo === ENCERRAR) {
    solo.setVelocity(0, 0);

    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    fim.visible = true;
    reiniciar.visible = true;

    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    trex.changeAnimation("falece", trex_falece);

    trex.velocityY = 0;

    if (mousePressedOver(reiniciar)) {
      reinicie();
    }
  }
}

function gerarNuvens() {
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600, 100, 40, 10);
    nuvem.y = Math.round(random(40, 120));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    //ajustar profundidade da nuvem

    trex.depth = nuvem.depth + 5;

    nuvem.depth = fim.depth;
    fim.depth = fim.depth + 1;

    nuvem.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth + 1;

    //dar velocidade e direção à nuvem
    nuvem.velocityX = -(3 + (pontuacao * 3) / 100);
    //dar tempo de vida à nuvem
    nuvem.lifetime = 220;
    grupoNuvens.add(nuvem);
  }
}

function gerarObstaculos() {
  //criar sprite de obstáculo a cada 60 quadros
  if (frameCount % 55 === 0) {
    obstaculo = createSprite(600, 175, 10, 40);
    obstaculo.velocityX = -(6 + (pontuacao * 3) / 100);

    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstaculo.addImage(obstaculo1);
        break;
      case 2:
        obstaculo.addImage(obstaculo2);
        break;
      case 3:
        obstaculo.addImage(obstaculo3);
        break;
      case 4:
        obstaculo.addImage(obstaculo4);
        break;
      case 5:
        obstaculo.addImage(obstaculo5);
        break;
      case 6:
        obstaculo.addImage(obstaculo6);
        break;
      default:
        break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    grupoCactos.add(obstaculo);

    obstaculo.depth = fim.depth;
    fim.depth = fim.depth + 1;

    obstaculo.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth + 1;
  }
}

function reinicie() {
  grupoNuvens.destroyEach();
  grupoCactos.destroyEach();
  estadoJogo = JOGAR;
  trex.changeAnimation("correndo");
  pontuacao = 0;
  reiniciar.visible = false;
  fim.visible = false;
}
