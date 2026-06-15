// Banco de Dados do NutriGame
// Sincronizado com os módulos da pós-graduação de Nutrição Funcional, Ortomolecular e Fitoterapia

const nutriGameData = {
  careerLevels: [
    { threshold: 0, title: "Nutricionista Residente" },
    { threshold: 500, title: "Nutricionista Clínico I" },
    { threshold: 1200, title: "Especialista em Fitoterapia" },
    { threshold: 2200, title: "Especialista Ortomolecular" },
    { threshold: 3500, title: "Mestre da Nutrição Funcional" },
    { threshold: 5000, title: "Preceptora do Ambulatório" },
    { threshold: 7000, title: "Doutora em Nutrição Funcional" }
  ],
  modules: [
    {
      id: 1,
      title: "Módulo 1: Introdução Clínica e Fitoterapia Funcional",
      subtitle: "Princípios da Nutrição Funcional e Abordagem Sistêmica",
      case: {
        patient: {
          name: "Júlia Santos",
          age: 29,
          occupation: "Arquiteta",
          avatar: "👩‍💼", // Usamos emojis bonitos como avatars padrão de iOS
          complaint: "Cansaço crônico incapacitante, sono não-reparador (acorda exausta) e episódios frequentes de névoa mental (brain fog) durante a tarde, dificultando o foco no trabalho."
        },
        anamnese: "Júlia relata rotina estressante com prazos apertados. Dorme tarde (cerca de 1h da manhã) utilizando o celular na cama até pegar no sono. Alimenta-se mal devido à correria, consumindo muito café (5 a 6 xícaras ao dia) para se manter alerta e abusando de carboidratos refinados à noite por ansiedade.",
        semiologia: "Ao exame físico, apresenta unhas frágeis com descamação, cabelos finos e opacos com queda acentuada, e queixa de extremidades (mãos e pés) sempre muito frias. Mucosas levemente hipocoradas.",
        investigation: {
          limit: 3, // Limite de exames que podem ser pedidos sem perder vidas
          options: [
            {
              id: "cortisol",
              name: "Cortisol Salivar (Curva de 3 pontos)",
              price: "medium",
              needed: true,
              result: "Manhã: Baixo (limiar inferior) | Tarde: Muito baixo | Noite: Levemente elevado. Sugere fadiga adrenal / desregulação do eixo HPA.",
              feedback: "Excelente escolha! A curva de cortisol salivar é fundamental na Nutrição Funcional para avaliar o ritmo circadiano e a resposta do eixo HPA ao estresse crônico."
            },
            {
              id: "ferritin",
              name: "Ferritina e Ferro Sérico",
              price: "low",
              needed: true,
              result: "Ferritina: 18 ng/dL (Ideal funcional: > 70 ng/dL para mulheres jovens) | Ferro: 52 mcg/dL. Indica deficiência de ferro (mesmo sem anemia estabelecida).",
              feedback: "Correto! A ferritina abaixo de 30-40 ng/dL está diretamente associada a fadiga, queda de cabelo e unhas fracas, mesmo com hemograma normal."
            },
            {
              id: "tsh",
              name: "TSH e T4 Livre",
              price: "low",
              needed: true,
              result: "TSH: 3.8 mUI/L (Ideal funcional: 1.0 a 2.0 mUI/L) | T4 Livre: 0.9 ng/dL. Sugere um quadro de hipotireoidismo subclínico / funcional.",
              feedback: "Perfeito! O cansaço crônico e extremidades frias são sinais típicos de lentidão tireoidiana, comum na presença de estresse crônico e baixo cortisol."
            },
            {
              id: "vitd",
              name: "Vitamina D (25-hidroxivitamina D)",
              price: "low",
              needed: false,
              result: "25(OH)D: 32 ng/mL (Suficiente, mas abaixo do ideal funcional de 40-50 ng/mL).",
              feedback: "Útil, mas secundário neste momento de queixa aguda."
            },
            {
              id: "amylase",
              name: "Amilase Sérica",
              price: "high",
              needed: false,
              result: "Amilase: 65 U/L (Normal).",
              feedback: "Inadequado. Não há queixa clínica abdominal ou suspeita de pancreatite que justifique este exame."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "higiene",
              name: "Higiene do sono rigorosa (desligar telas 1h antes, luz quente) + Chá de Mulungu (Erythrina mulungu) e Passiflora (Passiflora incarnata) 1h antes de deitar.",
              correct: true,
              critical: false,
              feedback: "Perfeito! A modulação do sono é a base da recuperação do eixo HPA. O Mulungu e a Passiflora agem como ansiolíticos suaves via receptores GABAérgicos."
            },
            {
              id: "magnesium",
              name: "Suplementação magistral de Magnésio Inositol (250mg) + L-Teanina (150mg) e Zinco Quelado (15mg) à noite.",
              correct: true,
              critical: false,
              feedback: "Ótima conduta! O magnésio inositol atua na estabilidade neuronal e sono. O zinco é cofactor para enzimas tireoidianas e síntese de neurotransmissores."
            },
            {
              id: "cafeina",
              name: "Prescrever cafeína anidra (200mg) pela manhã para combater o cansaço e melhorar a produtividade da arquiteta.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Estimulantes como cafeína em alta dose estressam ainda mais o eixo HPA em fadiga, piorando a exaustão adrenal e desregulando o sono à noite."
            },
            {
              id: "diet",
              name: "Ajuste dietético: reduzir carboidratos refinados à noite, introduzir gorduras boas, proteínas no café da manhã e reduzir café para no máximo 2 xícaras antes das 12h.",
              correct: true,
              critical: false,
              feedback: "Excelente! Proteínas no desjejum ajudam no alerta matinal. A redução do café e dos carboidratos simples estabiliza a glicemia e o cortisol."
            },
            {
              id: "fitomedicamento",
              name: "Prescrever Sibutramina (15mg/dia) para controlar a ansiedade e desejos por carboidratos à noite.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Sibutramina é um medicamento alopático de controle especial restrito a médicos. Nutricionistas não possuem competência legal para prescrevê-la."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "O caso da Júlia retrata a clássica síndrome da fadiga crônica decorrente de estresse crônico desregulador do eixo HPA (hipotálamo-pituitária-adrenal), aliada a deficiências nutricionais funcionais. Na Nutrição Funcional, os valores ideais de referência (ou limiares funcionais) diferem dos laboratoriais tradicionais. Uma ferritina de 18 ng/dL, embora dentro da maioria dos limites de laboratório (>10), é insuficiente para a produção de energia mitocondrial e saúde tireoidiana, pois o ferro é cofator da tireoide peroxidase (TPO). Além disso, a curva de cortisol salivar confirmou a 'fadiga adrenal', onde o uso de estimulantes centrais (cafeína) é contraindicado, devendo-se priorizar ervas adaptógenas/calmantes e minerais relaxantes (magnésio)."
        }
      },
      quiz: [
        {
          question: "Qual das seguintes alternativas representa um dos 5 princípios fundamentais da Nutrição Clínica Funcional?",
          options: [
            "Controle calórico estrito e pesagem diária de alimentos.",
            "Individualidade bioquímica e inter-relação teia de conexões metabólicas.",
            "Restrição de glúten e laticínios para toda e qualquer patologia.",
            "Utilização prioritária de alimentos cozidos para evitar contaminação."
          ],
          correct: 1,
          explanation: "Os princípios centrais da Nutrição Funcional são a individualidade bioquímica, biodisponibilidade de nutrientes, teia de conexões metabólicas, saúde como vitalidade positiva e foco centrado no paciente."
        },
        {
          question: "O ferro é um mineral essencial que atua como cofator de qual importante hormônio/enzima na fisiologia tireoidiana?",
          options: [
            "Enzima Monodeiodinase tipo 1.",
            "Tireoglobulina sérica.",
            "Enzima Tireoide Peroxidase (TPO).",
            "Hormônio Estimulador da Tireoide (TSH)."
          ],
          correct: 2,
          explanation: "A tireoide peroxidase (TPO), enzima responsável pela iodação da tirosina na síntese dos hormônios tireoidianos, é uma enzima heme-dependente (depende de ferro)."
        },
        {
          question: "Na prescrição fitoterápica para modular o sono, qual o mecanismo farmacológico principal da Passiflora incarnata?",
          options: [
            "Inibição da recaptação de serotonina e dopamina.",
            "Aumento da atividade do neurotransmissor inibitório GABA.",
            "Estimulação direta dos receptores de melatonina MT1 e MT2.",
            "Bloqueio dos canais de cálcio do tipo L nos neurônios motores."
          ],
          correct: 1,
          explanation: "Os flavonoides presentes na Passiflora agem modulando positivamente os receptores GABA-A, potencializando a transmissão sináptica inibitória, gerando o efeito sedativo suave."
        },
        {
          question: "O eixo HPA (Hipotálamo-Pituitária-Adrenal) é o principal regulador da resposta ao estresse. Em um quadro de estresse crônico com 'fadiga adrenal', qual padrão de cortisol salivar é tipicamente esperado?",
          options: [
            "Cortisol elevado de manhã e à noite, de forma constante.",
            "Cortisol matinal baixo (achatado) e, por vezes, elevação noturna, invertendo o ritmo circadiano.",
            "Cortisol indetectável nas 24 horas.",
            "Curva idêntica à de uma pessoa saudável, sem alterações."
          ],
          correct: 1,
          explanation: "Na desregulação crônica do eixo HPA, o pico matinal de cortisol (CAR - Cortisol Awakening Response) fica achatado, gerando exaustão ao acordar, e pode haver elevação noturna inadequada, prejudicando o sono e invertendo o ritmo circadiano."
        },
        {
          question: "A L-Teanina, aminoácido presente no chá verde e usado como ansiolítico suave, atua principalmente por qual mecanismo neurológico?",
          options: [
            "Bloqueio dos receptores de adrenalina (beta-bloqueador).",
            "Aumento das ondas cerebrais alfa e modulação de GABA, glutamato e dopamina.",
            "Inibição irreversível da monoaminoxidase (MAO).",
            "Estímulo direto da liberação de cortisol adrenal."
          ],
          correct: 1,
          explanation: "A L-Teanina promove relaxamento sem sedação ao aumentar a atividade das ondas alfa cerebrais e modular neurotransmissores (GABA, glutamato e dopamina), sendo útil na ansiedade e na qualidade do sono sem causar dependência."
        },
        {
          question: "Por que a recomendação de incluir proteínas no café da manhã é estratégica para a paciente Júlia, que sofre de fadiga e névoa mental matinal?",
          options: [
            "Porque a proteína fornece triptofano e tirosina, precursores de neurotransmissores de alerta (dopamina/noradrenalina), e estabiliza a glicemia.",
            "Porque a proteína tem efeito laxativo que melhora a disposição.",
            "Porque proteínas no desjejum aumentam a secreção de melatonina diurna.",
            "Porque substitui totalmente a necessidade de tratar a tireoide."
          ],
          correct: 0,
          explanation: "A tirosina (precursora de dopamina e noradrenalina) favorece o estado de alerta matinal, enquanto a estabilização glicêmica evita os picos e quedas que pioram a névoa mental e o cansaço ao longo da manhã."
        }
      ]
    },
    {
      id: 2,
      title: "Módulo 2: Semiologia Nutricional & Legislação",
      subtitle: "Diagnóstico Clínico Físico e Limites de Prescrição",
      case: {
        patient: {
          name: "Carlos Mendes",
          age: 34,
          occupation: "Gerente de TI",
          avatar: "👨‍💻",
          complaint: "Dificuldade de digestão, sensação de empachamento após as refeições (que dura horas) e flatulências fétidas excessivas. Deseja melhorar a disposição física."
        },
        anamnese: "Carlos come rápido demais, trabalhando em frente ao computador. Consome dieta rica em proteínas (frango e carnes vermelhas) e suplementa whey protein, porém nota que a digestão piorou muito. Relata episódios alternados de diarreia e constipação.",
        semiologia: "Ao exame físico da língua, nota-se saburra esbranquiçada e espessa na parte central-posterior. Unhas apresentam estrias longitudinais (verticais) e descamação. Pele seca, descamativa nos cotovelos.",
        investigation: {
          limit: 2,
          options: [
            {
              id: "b12",
              name: "Vitamina B12 e Homocisteína",
              price: "low",
              needed: true,
              result: "B12: 240 pg/mL (Ideal funcional: > 500 pg/mL) | Homocisteína: 16.2 mcmol/L (Ideal funcional: < 9.0 mcmol/L).",
              feedback: "Excelente! B12 baixa e homocisteína alta indicam disfunção no processo de metilação, possivelmente associada à baixa acidez estomacal (hipocloridria), que impede a absorção correta da B12."
            },
            {
              id: "coprologia",
              name: "Coprologia Funcional (Ph, gordura, fibras)",
              price: "medium",
              needed: true,
              result: "Fibras musculares mal digeridas (++), amido residual (+) e pH fecal: 7.2 (alcalino). Indica má digestão proteica.",
              feedback: "Fantástico! Confirmou a digestão proteica incompleta, muito comum em casos de hipocloridria."
            },
            {
              id: "endoscopia",
              name: "Endoscopia Digestiva Alta (EDA)",
              price: "high",
              needed: false,
              result: "Ausência de úlceras ou esofagite. Discreta gastrite enantematosa leve de antro.",
              feedback: "Desnecessário neste estágio inicial. A EDA é um procedimento invasivo e caro, indicado em caso de sinais de alerta (perda de peso rápida, sangramento, disfagia)."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "espinheira",
              name: "Prescrever tintura de Espinheira Santa (Maytenus ilicifolia) - 40 gotas diluídas em água 30 minutos antes das refeições principais.",
              correct: true,
              critical: false,
              feedback: "Correto! A Espinheira Santa é excelente para dispepsia, tem ação carminativa e protetora de mucosa, melhorando o desconforto gástrico."
            },
            {
              id: "enzimas",
              name: "Prescrever Cloridrato de Betaína (250mg) + Pepsina (50mg) + Bromelina (100mg) em cápsulas para tomar no início das refeições com proteínas.",
              correct: true,
              critical: false,
              feedback: "Excepcional! A betaína e pepsina auxiliam diretamente na restauração da acidez gástrica (combate à hipocloridria sugerida pelas unhas com estrias e empachamento), auxiliando na quebra proteica."
            },
            {
              id: "omeprazol",
              name: "Recomendar o uso de Omeprazol 20mg em jejum para reduzir o empachamento e azia.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O omeprazol é um Inibidor da Bomba de Prótons que alcaliniza ainda mais o estômago. No caso de hipocloridria (sugerida pelos exames e unhas), ele agravará drasticamente a má digestão proteica."
            },
            {
              id: "fitomedicamento_med",
              name: "Prescrever fitoterápico industrializado de controle médico exclusivo contendo extrato de Beladona (Atropa belladonna) para espasmos.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A Beladona contém alcaloides tropânicos tóxicos e é de prescrição médica exclusiva. O nutricionista não pode prescrevê-la pela legislação do CFN."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Carlos apresenta sinais clássicos de hipocloridria (baixa acidez estomacal gástrica), evidenciada na semiologia pelas estrias verticais nas unhas (dificuldade de absorção de minerais e proteínas) e saburra lingual espessa (má digestão gerando proliferação bacteriana e disbiose). A hipocloridria crônica impede a ativação da pepsina e a liberação de B12 das proteínas da dieta. Isso causou a baixa de B12 e elevação da homocisteína (um marcador inflamatório e de risco cardiovascular). Tratar com antiácidos/omeprazol piora o quadro. A conduta funcional visa reacidificar o estômago com Betaína e Pepsina, e auxiliar com fitoterápicos digestivos como a Espinheira Santa."
        }
      },
      quiz: [
        {
          question: "Unhas com sulcos ou estrias longitudinais (verticais), associadas a empachamento pós-prandial de carnes, sugerem clinicamente:",
          options: [
            "Excesso de ingestão de proteínas e cálcio.",
            "Hipocloridria gástrica com má absorção de minerais.",
            "Deficiência isolada de vitamina A.",
            "Disfunção do pâncreas exócrino."
          ],
          correct: 1,
          explanation: "As estrias longitudinais nas unhas são sinais semiológicos associados a má digestão proteica e má absorção mineral secundárias à hipocloridria."
        },
        {
          question: "Conforme as resoluções do CFN sobre prescrição de fitoterápicos por nutricionistas, assinale a conduta legalmente PERMITIDA:",
          options: [
            "Prescrever plantas medicinais em qualquer forma farmacêutica, incluindo injetáveis.",
            "Prescrever fitoterápicos que necessitam de receita médica restrita (ex: tarja preta).",
            "Prescrever extratos fitoterápicos secos ou tinturas, desde que a via de administração seja exclusivamente oral ou enteral.",
            "Prescrever medicamentos fitoterápicos sem necessidade de possuir pós-graduação na área."
          ],
          correct: 2,
          explanation: "O nutricionista pode prescrever fitoterápicos, drogas vegetais e derivados por via oral/enteral. A prescrição de fitoterápicos contendo substâncias sujeitas a controle especial (médico) ou injetáveis é vedada."
        },
        {
          question: "O Cloridrato de Betaína (HCl) é prescrito para auxiliar a digestão em casos de hipocloridria. Qual é o seu mecanismo de ação?",
          options: [
            "Neutraliza o ácido clorídrico do estômago, aliviando a azia.",
            "Fornece ácido clorídrico exógeno, reduzindo o pH gástrico e ativando o pepsinogênio em pepsina.",
            "Estimula a liberação de bile pela vesícula biliar.",
            "Bloqueia a bomba de prótons das células parietais."
          ],
          correct: 1,
          explanation: "A betaína HCl libera ácido clorídrico no estômago, acidificando o meio (baixando o pH). Esse ambiente ácido é necessário para converter o pepsinogênio em pepsina (enzima proteolítica) e para a absorção de minerais e da vitamina B12."
        },
        {
          question: "A baixa acidez estomacal (hipocloridria) compromete a absorção de vitamina B12 porque:",
          options: [
            "O ácido clorídrico e a pepsina são necessários para liberar a B12 das proteínas alimentares e permitir sua ligação ao fator intrínseco.",
            "A B12 só é absorvida em meio alcalino.",
            "A hipocloridria destrói diretamente as moléculas de B12.",
            "A B12 depende exclusivamente da bile para ser absorvida."
          ],
          correct: 0,
          explanation: "Em meio ácido, a B12 alimentar (ligada a proteínas) é liberada e pode se ligar ao fator intrínseco, permitindo sua absorção no íleo. Sem acidez suficiente, essa liberação falha, gerando deficiência de B12 e elevação da homocisteína."
        },
        {
          question: "A homocisteína elevada (16,2 mcmol/L) encontrada no Carlos é um marcador de risco. Sua elevação está associada à deficiência funcional de quais nutrientes envolvidos na remetilação?",
          options: [
            "Vitamina C, vitamina E e selênio.",
            "Vitamina B12, ácido fólico (B9) e vitamina B6.",
            "Cálcio, magnésio e potássio.",
            "Vitamina A, vitamina D e vitamina K."
          ],
          correct: 1,
          explanation: "A homocisteína é reciclada em metionina pela via dependente de B12 e folato, e degradada via transsulfuração dependente de B6. A deficiência desses nutrientes (aqui agravada pela hipocloridria) eleva a homocisteína plasmática."
        },
        {
          question: "A saburra lingual espessa e esbranquiçada observada no exame físico do Carlos é um sinal semiológico que sugere principalmente:",
          options: [
            "Excelente higiene oral e equilíbrio digestivo.",
            "Disbiose intestinal e sobrecarga digestiva por má digestão de proteínas.",
            "Deficiência exclusiva de vitamina C.",
            "Infecção viral aguda das vias aéreas."
          ],
          correct: 1,
          explanation: "Na semiologia funcional, a saburra lingual central espessa reflete sobrecarga digestiva e disbiose: alimentos mal digeridos (por hipocloridria) fermentam e favorecem a proliferação bacteriana, sinalizando o desequilíbrio do trato gastrointestinal."
        }
      ]
    },
    {
      id: 3,
      title: "Módulo 3: Noções de Botânica e Fitoquímica",
      subtitle: "Princípios Ativos, Nomenclatura e Segurança",
      case: {
        patient: {
          name: "Marcos Vinícius",
          age: 52,
          occupation: "Comerciante",
          avatar: "👨‍💼",
          complaint: "Ansiedade leve, palpitações esporádicas de origem tensional (emocional) e má digestão com gases e cólicas abdominais frequentes."
        },
        anamnese: "Marcos relata ser muito ansioso com as vendas do comércio. Não toma remédios controlados, mas consome bebidas alcoólicas aos finais de semana e fuma ocasionalmente. O cardiologista já descartou arritmias ou cardiopatias orgânicas.",
        semiologia: "Apresenta abdômen distendido à palpação, com relato de gases constantes. Frequência cardíaca basal de 78 bpm. Sem outros achados físicos significativos.",
        investigation: {
          limit: 1,
          options: [
            {
              id: "enzimas_hep",
              name: "Perfil Hepático (TGO, TGP, GGT)",
              price: "low",
              needed: true,
              result: "TGO: 22 U/L | TGP: 25 U/L | GGT: 28 U/L (Tudo normal).",
              feedback: "Correto! Sempre importante verificar a integridade hepática do paciente antes de prescrever fitoterápicos de uso crônico."
            },
            {
              id: "us_abd",
              name: "Ultrassom Abdominal Total",
              price: "high",
              needed: false,
              result: "Laudo normal, ausência de cálculos em vesícula ou esteatose.",
              feedback: "Excesso de investigação para queixa simples de gases e cólicas tensionais gástricas."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "melissa",
              name: "Prescrever extrato seco de Cidreira (Melissa officinalis) - 300mg padronizado em 5% de ácido rosmarínico, 2x ao dia.",
              correct: true,
              critical: false,
              feedback: "Excelente! A Melissa é rica em ácido rosmarínico (flavonoide), que inibe a enzima GABA transaminase, aumentando os níveis de GABA e reduzindo a ansiedade e espasmos digestivos."
            },
            {
              id: "kava",
              name: "Prescrever Kava-Kava (Piper methysticum) - 100mg, 3x ao dia para ansiedade intensa.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A Kava-Kava (Piper methysticum) teve sua comercialização e prescrição suspensa/restrita no Brasil pela Anvisa devido a relatos graves de hepatotoxicidade aguda."
            },
            {
              id: "peppermint",
              name: "Prescrever óleo essencial de Hortelã-Pimenta (Mentha piperita) em cápsulas gastrorresistentes (0.2mL) - 1 cápsula 30 min antes das refeições.",
              correct: true,
              critical: false,
              feedback: "Perfeito! A Mentha piperita tem ação antiespasmódica direta sobre a musculatura lisa do trato gastrointestinal, reduzindo gases e cólicas intestinais."
            },
            {
              id: "hiperico_interacao",
              name: "Prescrever Hipérico (Hypericum perforatum) associado a calmantes benzodiazepínicos que o paciente revelou tomar por conta própria.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O Hipérico (Erva de São João) é um potente indutor das enzimas do citocromo P450 (CYP3A4) e da glicoproteína P. Ele reduz drasticamente a eficácia de ansiolíticos, anticoncepcionais, anticoagulantes e antidepressivos, gerando interações perigosas."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Marcos se beneficia da fitoquímica clássica. O ácido rosmarínico presente na Melissa officinalis age de forma dupla: acalma o sistema nervoso central (modulador GABA) e reduz a motilidade gástrica excessiva (espasmos). A Hortelã-Pimenta (Mentha piperita), rica em mentol, bloqueia os canais de cálcio da musculatura intestinal, aliviando a distensão abdominal. Erros na prescrição botânica podem ser fatais ou causar processos éticos: a Kava-Kava é proibidia no Brasil por risco hepático, e o Hipérico possui uma das maiores taxas de interações medicamentosas conhecidas na farmacologia botânica devido à indução enzimática do CYP450."
        }
      },
      quiz: [
        {
          question: "Qual o nome da nomenclatura botânica oficial (gênero e espécie) da verdadeira Erva-Cidreira, amplamente estudada por seus efeitos ansiolíticos e digestivos?",
          options: [
            "Lippia alba",
            "Melissa officinalis",
            "Cymbopogon citratus",
            "Passiflora alata"
          ],
          correct: 1,
          explanation: "Melissa officinalis é a cidreira verdadeira. Lippia alba é a erva-cidreira brasileira e Cymbopogon citratus é o capim-limão/santo."
        },
        {
          question: "Os taninos, compostos fenólicos abundantes em diversas plantas medicinais, possuem como principal propriedade fitoquímica/farmacológica:",
          options: [
            "Ação estimulante central idêntica à cafeína.",
            "Propriedade adstringente (precipitação de proteínas), útil como cicatrizante e antidiarréico.",
            "Efeito vasodilatador coronariano imediato.",
            "Inibição da síntese de melatonina pineal."
          ],
          correct: 1,
          explanation: "Os taninos precipitam proteínas e formam uma camada protetora sobre mucosas lesionadas, conferindo propriedades adstringentes, anti-inflamatórias, cicatrizantes e antidiarreicas."
        },
        {
          question: "O Hipérico (Hypericum perforatum / Erva de São João) é conhecido por causar interações medicamentosas perigosas. Qual mecanismo explica essa característica?",
          options: [
            "Inibe fortemente as enzimas do citocromo P450, aumentando a toxicidade de outros fármacos.",
            "É um potente indutor das enzimas do citocromo P450 (CYP3A4) e da glicoproteína-P, reduzindo a eficácia de muitos medicamentos.",
            "Precipita os fármacos no estômago impedindo sua dissolução.",
            "Não possui nenhuma interação relevante conhecida."
          ],
          correct: 1,
          explanation: "A hiperforina do Hipérico induz o CYP3A4 e a glicoproteína-P, acelerando o metabolismo e a excreção de fármacos como anticoncepcionais, anticoagulantes, imunossupressores e antidepressivos, podendo levar à falha terapêutica."
        },
        {
          question: "Os glicosídeos são uma importante classe de metabólitos secundários vegetais. O que caracteriza estruturalmente um glicosídeo?",
          options: [
            "Uma molécula composta apenas por cadeias de ácidos graxos.",
            "Uma porção açúcar (glicona) ligada a uma porção não-açúcar farmacologicamente ativa (aglicona).",
            "Um polímero exclusivo de aminoácidos.",
            "Um mineral quelado a uma proteína transportadora."
          ],
          correct: 1,
          explanation: "Glicosídeos são formados por uma glicona (açúcar) ligada a uma aglicona (parte ativa). Exemplos incluem os glicosídeos cardiotônicos da Digitalis e os antraquinônicos laxativos do Sene."
        },
        {
          question: "Sobre a nomenclatura botânica binomial (Lineu), assinale a afirmação correta:",
          options: [
            "O primeiro termo indica a espécie e o segundo o gênero.",
            "O primeiro termo (maiúsculo) indica o gênero e o segundo (minúsculo) o epíteto específico; ambos em destaque (itálico).",
            "Os dois termos devem sempre ser escritos com inicial maiúscula.",
            "A nomenclatura popular tem o mesmo valor científico da binomial."
          ],
          correct: 1,
          explanation: "Na nomenclatura binomial, o gênero vem primeiro (inicial maiúscula) e o epíteto específico em seguida (minúscula), ambos em itálico (ex.: Melissa officinalis). Nomes populares variam por região e geram confusão, daí a importância da nomenclatura científica."
        },
        {
          question: "A importância de avaliar o perfil hepático (TGO, TGP, GGT) antes de iniciar uma fitoterapia de uso crônico deve-se a que princípio de segurança?",
          options: [
            "Fitoterápicos nunca apresentam risco hepático, sendo o exame meramente burocrático.",
            "Muitos fitoativos são metabolizados no fígado e alguns têm potencial hepatotóxico, exigindo monitoramento da integridade hepática.",
            "O perfil hepático mede diretamente a concentração da planta no sangue.",
            "O exame serve apenas para diagnosticar hepatites virais."
          ],
          correct: 1,
          explanation: "O fígado é o principal órgão de biotransformação de fitoativos. Avaliar transaminases e GGT antes e durante o uso crônico garante segurança, especialmente com plantas de potencial hepatotóxico (ex.: Kava-Kava, Confrei)."
        }
      ]
    },
    {
      id: 4,
      title: "Módulo 4: Hepatologia e Destoxificação",
      subtitle: "Esteatose Hepática e Fisiologia do Detox",
      case: {
        patient: {
          name: "Sandra Regina",
          age: 42,
          occupation: "Advogada",
          avatar: "👩‍💼",
          complaint: "Diagnóstico médico de Esteatose Hepática Grau 2 (gordura no fígado). Reclama de fadiga constante, fadiga muscular ao acordar e dores de cabeça frequentes na região frontal."
        },
        anamnese: "Sandra tem alimentação baseada em ultraprocessados, alto consumo de açúcar, refrigerantes diet e carboidratos simples. Apresenta dificuldades para emagrecer. Nega consumo frequente de álcool. Toma analgésicos (paracetamol) quase diariamente para suas dores de cabeça.",
        semiologia: "Apresenta IMC: 28.5 kg/m² (sobrepeso). Circunferência abdominal de 94 cm (risco cardiovascular elevado). Discreta dor à palpação profunda na região do fígado (hipocôndrio direito). Presença de acne vulgar inflamatória tardia na mandíbula.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "aminotrans",
              name: "Transaminases (ALT/TGP, AST/TGO) e GGT",
              price: "low",
              needed: true,
              result: "ALT: 64 U/L (Elevada) | AST: 48 U/L (Elevada) | GGT: 72 U/L (Elevada). Indica inflamação hepática ativa.",
              feedback: "Excelente! Imprescindível para monitorar a lesão/inflamação dos hepatócitos decorrente da gordura acumulada."
            },
            {
              id: "homair",
              name: "Insulina de Jejum e Glicemia (HOMA-IR)",
              price: "low",
              needed: true,
              result: "Glicemia: 98 mg/dL | Insulina: 18.5 uUI/mL | HOMA-IR: 4.47. Indica resistência à insulina severa.",
              feedback: "Perfeito! A resistência à insulina é o motor fisiopatológico principal da esteatose hepática não-alcoólica."
            },
            {
              id: "lipido",
              name: "Perfil Lipídico Completo",
              price: "low",
              needed: true,
              result: "Colesterol Total: 238 mg/dL | Triglicerídeos: 210 mg/dL (Elevado) | HDL: 41 mg/dL (Baixo) | LDL: 155 mg/dL.",
              feedback: "Correto. Triglicerídeos altos e HDL baixo são característicos do quadro metabólico que gera gordura visceral e hepática."
            },
            {
              id: "biopsia",
              name: "Biópsia Hepática",
              price: "high",
              needed: false,
              result: "Não realizada.",
              feedback: "ERRO DE CONDUTA! A biópsia é um exame padrão-ouro invasivo, caro e arriscado, indicado apenas em casos graves de suspeita de cirrose ou hepatite avançada, não na investigação básica de esteatose metabólica grau 2."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "silimarina",
              name: "Prescrever extrato seco de Cardo Mariano / Silimarina (Silybum marianum) - 300mg padronizado em 70% de silimarina, 2x ao dia.",
              correct: true,
              critical: false,
              feedback: "Fantástico! A Silimarina estimula a RNA polimerase nos hepatócitos, promovendo a regeneração celular, além de ser antioxidante e anti-inflamatória gástrica e hepática."
            },
            {
              id: "nac",
              name: "Prescrever N-Acetilcisteína (NAC) - 600mg em jejum pela manhã.",
              correct: true,
              critical: false,
              feedback: "Excepcional! A NAC é o precursor direto da glutationa (o maior antioxidante do fígado), vital para a fase 2 da destoxificação hepática, especialmente com o estresse gerado pelo paracetamol que a paciente toma."
            },
            {
              id: "paracetamol_cont",
              name: "Manter ou aumentar o uso de Paracetamol livre para as dores de cabeça gástricas.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O paracetamol em uso contínuo depleta os estoques hepáticos de glutationa. Seus metabólitos reativos (NAPQI) são altamente hepatotóxicos e vão piorar a inflamação de um fígado já esteatótico."
            },
            {
              id: "diet_detox",
              name: "Plano Alimentar: Redução drástica de frutose (xarope de milho), carboidratos simples e gorduras trans. Prescrever vegetais crucíferos (brócolis, couve, repolho) e fontes de colina (ovos).",
              correct: true,
              critical: false,
              feedback: "Excelente! As crucíferas contêm sulforafano, potente indutor da via Nrf2 (fase 2 de detox). A colina é essencial para exportar triglicerídeos do fígado via VLDL."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "A esteatose hepática de Sandra é consequência direta da resistência periférica à insulina e da sobrecarga de xenobióticos (paracetamol). A resistência à insulina aumenta a lipólise no tecido adiposo, gerando fluxo massivo de ácidos graxos livres para o fígado (lipotoxicidade). O uso crônico de paracetamol consome a glutationa hepática na fase 2 de detox (conjugação com glutationa). A abordagem da nutrição funcional visa induzir a via antioxidante Nrf2 com sulforafano (crucíferas) e reabastecer a glutationa com NAC. A silimarina age protegendo a membrana celular dos hepatócitos contra a peroxidação lipídica e estabilizando as transaminases."
        }
      },
      quiz: [
        {
          question: "Na destoxificação hepática, a Fase 2 consiste em reações de conjugação para tornar as toxinas mais hidrossolúveis. Qual dos seguintes compostos é o precursor limitante para a síntese de glutationa, cofator da enzima Glutationa S-Transferase (GST)?",
          options: [
            "Cisteína (fornecida via N-Acetilcisteína)",
            "L-Metionina isolada",
            "Ácido glutâmico",
            "Glicina quelada"
          ],
          correct: 0,
          explanation: "A cisteína é o aminoácido limitante para a produção da glutationa tripeptídeo (composta por glutamato, cisteína e glicina). A NAC fornece cisteína biodisponível."
        },
        {
          question: "Qual fitoquímico presente nos vegetais crucíferos (como brócolis, couve de bruxelas) atua como potente indutor das enzimas de fase 2 através da ativação do fator de transcrição Nrf2?",
          options: [
            "Resveratrol",
            "Sulforafano (isotiocianato)",
            "Licopeno",
            "Ácido cafeico"
          ],
          correct: 1,
          explanation: "O sulforafano, derivado da glicorafanina presente em crucíferas, estimula o Nrf2, promovendo a transcrição de genes antioxidantes e enzimas de fase 2 (detox)."
        },
        {
          question: "Na destoxificação hepática, qual a sequência correta e o objetivo das fases 1 e 2?",
          options: [
            "Fase 1 conjuga as toxinas e a Fase 2 as oxida; o objetivo é torná-las lipossolúveis.",
            "Fase 1 (citocromo P450) oxida/funcionaliza as toxinas, gerando metabólitos intermediários reativos; Fase 2 os conjuga, tornando-os hidrossolúveis para excreção.",
            "Ambas as fases apenas armazenam toxinas no tecido adiposo.",
            "A Fase 2 ocorre antes da Fase 1, no intestino."
          ],
          correct: 1,
          explanation: "A Fase 1 (oxidação via CYP450) funcionaliza as toxinas, mas gera intermediários reativos potencialmente mais tóxicos. A Fase 2 (conjugação: glicuronidação, sulfatação, conjugação com glutationa, metilação) os neutraliza e torna hidrossolúveis para excreção. As fases precisam estar equilibradas."
        },
        {
          question: "O uso crônico de paracetamol é hepatotóxico porque seu metabólito reativo (NAPQI):",
          options: [
            "É inerte e eliminado diretamente pela urina.",
            "Depleta os estoques de glutationa hepática; quando ela se esgota, o NAPQI livre lesa os hepatócitos.",
            "Estimula a regeneração das células hepáticas.",
            "Bloqueia a absorção intestinal de gorduras."
          ],
          correct: 1,
          explanation: "O paracetamol gera o metabólito NAPQI na Fase 1, normalmente neutralizado pela conjugação com glutationa. Em uso crônico ou doses altas, a glutationa se esgota e o NAPQI acumulado causa necrose hepatocelular. Por isso a NAC (precursora de glutationa) é o antídoto."
        },
        {
          question: "A resistência à insulina é considerada o principal motor fisiopatológico da esteatose hepática não-alcoólica (DHGNA). Por quê?",
          options: [
            "A insulina alta reduz totalmente o apetite, levando à desnutrição hepática.",
            "A hiperinsulinemia aumenta a lipogênese de novo no fígado e o fluxo de ácidos graxos livres do tecido adiposo, acumulando triglicerídeos nos hepatócitos.",
            "A resistência à insulina impede qualquer entrada de glicose nas células.",
            "A insulina alta protege o fígado contra o acúmulo de gordura."
          ],
          correct: 1,
          explanation: "A resistência à insulina eleva a lipólise no tecido adiposo (mais ácidos graxos livres para o fígado) e estimula a lipogênese de novo hepática, resultando em acúmulo de triglicerídeos intra-hepáticos — a base da esteatose metabólica."
        },
        {
          question: "A colina, recomendada na conduta da Sandra (via ovos, por exemplo), é importante no tratamento da esteatose porque:",
          options: [
            "É essencial para a síntese de fosfatidilcolina e a exportação de triglicerídeos do fígado via VLDL.",
            "Bloqueia a absorção de qualquer gordura na dieta.",
            "Atua como um laxante potente.",
            "Substitui a necessidade de glutationa na Fase 2."
          ],
          correct: 0,
          explanation: "A colina é necessária para sintetizar fosfatidilcolina, componente das lipoproteínas VLDL que transportam triglicerídeos para fora do fígado. Sua deficiência contribui para o acúmulo de gordura hepática."
        }
      ]
    },
    {
      id: 5,
      title: "Módulo 5: Bioquímica de Micronutrientes (Minerais e Vitaminas)",
      subtitle: "Fadiga Mitocondrial e Cãibras Musculares",
      case: {
        patient: {
          name: "Pedro Albuquerque",
          age: 45,
          occupation: "Empresário",
          avatar: "👨‍💼",
          complaint: "Cãibras musculares severas principalmente à noite, espasmos involuntários na pálpebra e cansaço extremo que prejudica a rotina de trabalho."
        },
        anamnese: "Pedro possui rotina de alto estresse, viajando constantemente. Consome bebida alcoólica diariamente (2 a 3 taças de vinho no jantar) e toma muito café (cerca de 5 xícaras pretas ao dia). Suplementa carbonato de cálcio (500mg) por indicação de um colega, mas relata que as cãibras pioraram. Dieta pobre em folhas verdes escuras, sementes e castanhas.",
        semiologia: "Ao exame físico, apresenta mioquimia palpebral (tremor na pálpebra), pele seca e reflexos tendinosos exacerbados (hiperreflexia). Extremidades frias e queixa de sono interrompido.",
        investigation: {
          limit: 2,
          options: [
            {
              id: "magnesium_erythrocyte",
              name: "Magnésio Intraeritrocitário",
              price: "medium",
              needed: true,
              result: "Magnésio intraeritrocitário: 3.8 mg/dL (Ideal funcional: > 5.5 mg/dL). Indica deficiência severa de magnésio tecidual.",
              feedback: "Excelente! O magnésio sérico normal não exclui a deficiência tecidual, pois apenas 1% do magnésio está no sangue extracelular. O magnésio intraeritrocitário é o padrão-ouro funcional."
            },
            {
              id: "vitd_5",
              name: "Vitamina D (25-hidroxivitamina D)",
              price: "low",
              needed: true,
              result: "25(OH)D: 22 ng/mL (Deficiente. Ideal funcional: 40-50 ng/mL para saúde músculo-esquelética).",
              feedback: "Excelente! A hipovitaminose D piora a absorção intestinal de cálcio e magnésio, desregulando o tônus muscular."
            },
            {
              id: "calcio_serico",
              name: "Cálcio Sérico e Ionizado",
              price: "low",
              needed: false,
              result: "Cálcio sérico: 9.8 mg/dL (Normal) | Cálcio ionizado: 1.25 mmol/L (Normal).",
              feedback: "Secundário. O cálcio sérico é rigidamente controlado pelo paratormônio (PTH), raramente caindo exceto em patologias graves."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "magnesium_glycinate",
              name: "Prescrever Magnésio Quelado (Glicinato ou Malato) - 350mg associado a Piridoxal-5-Fosfato (B6 ativa) - 30mg à noite.",
              correct: true,
              critical: false,
              feedback: "Perfeito! O malato/glicinato de magnésio tem alta biodisponibilidade e o malato auxilia na produção de ATP mitocondrial. A B6 age como cofator essencial para colocar o magnésio para dentro da célula."
            },
            {
              id: "vitd_k2",
              name: "Suplementação de Vitamina D3 (4000 UI) + Vitamina K2 MK-7 (100mcg) em gotas sublinguais.",
              correct: true,
              critical: false,
              feedback: "Excelente! A vitamina D regula a absorção de cálcio e magnésio, e a K2 MK-7 direciona o cálcio para os ossos, evitando calcificação vascular."
            },
            {
              id: "calcio_high",
              name: "Aumentar a dose de Carbonato de Cálcio isolado para 1000mg/dia para conter as cãibras.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O excesso de cálcio compete pelo mesmo sítio de absorção do magnésio e acentua a contração muscular (cálcio contrai, magnésio relaxa), agravando as cãibras e a depleção de magnésio."
            },
            {
              id: "potassio_high",
              name: "Prescrever alta dosagem de Cloreto de Potássio (1000mg) em cápsulas sem exames prévios de potássio ou função renal.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A suplementação indiscriminada de potássio em alta dose pode causar hipercalemia, gerando arritmias cardíacas graves e parada cardíaca. Nutricionistas devem ter extrema cautela com potássio isolado."
            },
            {
              id: "diet_magnesium",
              name: "Recomendação dietética: reduzir café e álcool (ambos aumentam excreção renal de magnésio). Incluir sementes de abóbora, amêndoas e couve diariamente.",
              correct: true,
              critical: false,
              feedback: "Excelente conduta! O álcool e a cafeína são potentes depletores de magnésio via renal. Alimentos ricos em clorofila contêm magnésio no centro da molécula."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "O caso de Pedro exemplifica a deficiência de magnésio celular mascarada por níveis normais de cálcio sérico. O magnésio atua como bloqueador natural dos canais de cálcio na musculatura. Quando há falta de magnésio (depletado pelo estresse crônico, cafeína e álcool), o cálcio entra livremente no citoplasma muscular, promovendo contrações contínuas dolorosas (cãibras) e tremores (mioquimia). A suplementação de cálcio isolado piora a relação cálcio:magnésio (ideal funcional de 2:1 a 1:1). Tratar a fadiga e as cãibras exige reabastecer o estoque de magnésio celular usando formas queladas (malato ou glicinato) e associar a vitamina B6 (piridoxal-5-fosfato), essencial no transporte celular de minerais."
        }
      },
      quiz: [
        {
          question: "Qual forma de magnésio apresenta excelente absorção celular e é preferida para fadiga mitocondrial devido ao seu papel direto no ciclo de Krebs?",
          options: [
            "Carbonato de Magnésio",
            "Malato de Magnésio (Dimagnésio Malato)",
            "Óxido de Magnésio",
            "Sulfato de Magnésio"
          ],
          correct: 1,
          explanation: "O malato de magnésio fornece ácido málico, um intermediário do ciclo de Krebs envolvido na síntese de ATP celular, sendo ideal para fadiga muscular e fibromialgia."
        },
        {
          question: "Qual vitamina atua como o cofator ativo essencial para a captação celular de magnésio e síntese de serotonina?",
          options: [
            "Piridoxal-5-Fosfato (Vitamina B6 ativa)",
            "Cianocobalamina (Vitamina B12)",
            "Riboflavina (Vitamina B2)",
            "Ácido Ascórbico (Vitamina C)"
          ],
          correct: 0,
          explanation: "O piridoxal-5-fosfato (forma ativa da B6) atua na transaminação e facilita o transporte e a retenção de magnésio nos tecidos e eritrócitos."
        },
        {
          question: "Por que o magnésio sérico (sanguíneo) normal NÃO exclui uma deficiência tecidual de magnésio, sendo o intraeritrocitário o padrão funcional preferido?",
          options: [
            "Porque o magnésio sérico mede apenas o magnésio dos ossos.",
            "Porque apenas ~1% do magnésio corporal está no sangue, sendo rigidamente regulado; o restante é intracelular/ósseo, refletido melhor pelo magnésio intraeritrocitário.",
            "Porque o magnésio sérico é sempre mais baixo que o real.",
            "Porque o magnésio não circula no sangue."
          ],
          correct: 1,
          explanation: "Cerca de 99% do magnésio é intracelular ou ósseo; o sérico (1%) é mantido estável pela homeostase mesmo na depleção tecidual. Por isso o magnésio intraeritrocitário reflete melhor o status funcional real."
        },
        {
          question: "Fisiologicamente, qual é a relação antagônica entre cálcio e magnésio na contração muscular?",
          options: [
            "O cálcio promove o relaxamento e o magnésio a contração muscular.",
            "O cálcio promove a contração e o magnésio atua como bloqueador natural dos canais de cálcio, favorecendo o relaxamento.",
            "Ambos promovem apenas contração, sem relaxamento.",
            "Nenhum dos dois participa da contração muscular."
          ],
          correct: 1,
          explanation: "O influxo de cálcio dispara a contração muscular; o magnésio bloqueia fisiologicamente os canais de cálcio e ativa a bomba de cálcio, promovendo relaxamento. Sua deficiência leva a contrações sustentadas (cãibras) e tremores (mioquimia)."
        },
        {
          question: "Qual é o papel da vitamina K2 (MK-7) quando associada à suplementação de vitamina D3 e cálcio?",
          options: [
            "Aumenta a deposição de cálcio nas artérias.",
            "Ativa proteínas (osteocalcina e MGP) que direcionam o cálcio para os ossos e o afastam dos tecidos moles/vasos.",
            "Inibe completamente a absorção de cálcio.",
            "Substitui a necessidade de vitamina D."
          ],
          correct: 1,
          explanation: "A K2 (MK-7) carboxila a osteocalcina (fixa cálcio no osso) e a Matrix Gla Protein (impede calcificação vascular). Por isso é associada à D3, que aumenta a absorção de cálcio, evitando sua deposição indevida nas artérias."
        },
        {
          question: "Tanto o álcool quanto a cafeína em excesso pioram a deficiência de magnésio do Pedro principalmente porque:",
          options: [
            "Aumentam a excreção renal de magnésio.",
            "Bloqueiam a produção de bile.",
            "Aumentam a absorção intestinal de cálcio.",
            "Estimulam a síntese hepática de magnésio."
          ],
          correct: 0,
          explanation: "Álcool e cafeína têm efeito diurético e aumentam a perda renal de magnésio, depletando os estoques corporais — daí a importância de reduzi-los no manejo das cãibras e da fadiga associadas à hipomagnesemia."
        }
      ]
    },
    {
      id: 6,
      title: "Módulo 6: Interpretação de Exames Laboratoriais",
      subtitle: "Disbiose Intestinal e Inflamação Subclínica",
      case: {
        patient: {
          name: "Mariana Souza",
          age: 38,
          occupation: "Professora",
          avatar: "👩‍🏫",
          complaint: "Dificuldade extrema para perder peso, cansaço mental (brain fog), distensão abdominal severa no final do dia e desejo incontrolável por doces à tarde."
        },
        anamnese: "Mariana relata rotina sedentária e estressante com preparação de aulas. Alimenta-se de forma prática: pães, biscoitos, refrigerante zero e sucos de caixinha. Evita gorduras, mas consome açúcar refinado quando está cansada. Apresenta constipação crônica (evacua a cada 3 dias, fezes ressecadas tipo 1/2 de Bristol).",
        semiologia: "Língua com saburra branca espessa na região central e marcas de dentes nas laterais. Abdômen distendido e dolorido à palpação gástrica/intestinal. Extremidades frias e olheiras profundas.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "insulin_fasting",
              name: "Insulina e Glicemia de Jejum (HOMA-IR)",
              price: "low",
              needed: true,
              result: "Glicemia: 96 mg/dL | Insulina: 14 uUI/mL (HOMA-IR: 3.32). Indica resistência periférica à insulina.",
              feedback: "Excelente escolha! A insulina ideal funcional de jejum deve estar entre 2 e 6 uUI/mL. Valores acima de 10 indicam resistência à insulina e bloqueio na queima de gordura."
            },
            {
              id: "crp_ultrasensitive",
              name: "Proteína C Reativa Ultrassensível (PCR-us)",
              price: "low",
              needed: true,
              result: "PCR-us: 3.4 mg/L (Elevada. Ideal funcional: < 1.0 mg/L). Indica inflamação subclínica crônica.",
              feedback: "Correto! A inflamação sistêmica de baixo grau (sugerida pela PCR-us > 1.0) está diretamente ligada à disbiose (endotoxemia metabólica) e bloqueio metabólico de peso."
            },
            {
              id: "hba1c",
              name: "Hemoglobina Glicada (HbA1c)",
              price: "low",
              needed: true,
              result: "HbA1c: 5.7% (Ideal funcional: < 5.4%). Indica glicação de proteínas nos últimos 90 dias.",
              feedback: "Perfeito! A HbA1c de 5.7% já aponta para um estado pré-diabético / resistência insulínica crônica pela visão funcional."
            },
            {
              id: "t3_reverse",
              name: "T3 Reverso (rT3)",
              price: "medium",
              needed: false,
              result: "rT3: 0.35 ng/mL (Normal).",
              feedback: "Secundário. Embora útil em fadiga severa com hipotireoidismo franco, outros exames inflamatórios/metabólicos são prioritários."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "berberina_chromium",
              name: "Prescrever Berberina (500mg) + Picolinato de Cromo (250mcg) 30 minutos antes do almoço e jantar.",
              correct: true,
              critical: false,
              feedback: "Excelente! A berberina melhora a sensibilidade à insulina ativando a AMPK (mimetiza o exercício) e o cromo potencializa o receptor de insulina, reduzindo o desejo por doces."
            },
            {
              id: "antiinflammatory_diet",
              name: "Prescrever Dieta Anti-inflamatória e de Baixo Índice Glicêmico, excluindo carboidratos refinados. Introduzir cúrcuma (curcumina) e chá verde.",
              correct: true,
              critical: false,
              feedback: "Fantástico! O corte de refinados desinflama o organismo e reduz o HOMA-IR. A curcumina e o chá verde são potentes antioxidantes que ativam vias anti-inflamatórias (Nrf2/SIRT1)."
            },
            {
              id: "metformina_presc",
              name: "Prescrever Cloridrato de Metformina (850mg) para tratar a resistência à insulina da paciente.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A Metformina é um medicamento alopático de controle metabólico. O nutricionista não possui autorização legal para prescrever fármacos sintéticos."
            },
            {
              id: "laxante_sena",
              name: "Prescrever laxante fitoterápico de Sene (Senna alexandrina) 500mg por dia para uso contínuo.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O uso contínuo de laxantes antraquinônicos (como o Sene) causa dependência intestinal, dano ao plexo mioentérico e espoliação eletrolítica grave, sendo contraindicado no manejo da disbiose/constipação crônica."
            },
            {
              id: "glutamina_probiotico",
              name: "Prescrever L-Glutamina (5g) em jejum para modular a barreira intestinal (leakygut) e auxiliar no tratamento da disbiose.",
              correct: true,
              critical: false,
              feedback: "Perfeito! A glutamina é o principal combustível dos enterócitos, ajudando a fechar as tight junctions intestinais (reparando a hiperpermeabilidade)."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Mariana apresenta a tríade clássica: disbiose intestinal, hiperpermeabilidade (leakygut) e resistência insulínica inflamatória. Na Nutrição Funcional, valores de referência laboratoriais convencionais de jejum (ex: glicose 96 e insulina 14) são vistos como disfuncionais. A insulina alta bloqueia a lipase hormônio-sensível, impedindo a quebra de gordura. O quadro de constipação crônica e dieta rica em carboidratos refinados geram proliferação de bactérias patogênicas produtoras de LPS (lipopolissacarídeo). O LPS entra na circulação via barreira gástrica/intestinal hiperpermeável e ativa receptores TLR4, gerando inflamação subclínica crônica (PCR-us 3.4), o que sabota o metabolismo mitocondrial. O uso de Berberina e Cromo atua na AMPK e GLUT-4, enquanto a Glutamina repara a barreira intestinal."
        }
      },
      quiz: [
        {
          question: "Na interpretação de exames bioquímicos funcionais, qual o valor de referência ideal para o marcador inflamatório Proteína C Reativa Ultrassensível (PCR-us) em pacientes saudáveis?",
          options: [
            "< 5.0 mg/L",
            "< 1.0 mg/L",
            "Entre 1.0 e 3.0 mg/L",
            "Qualquer valor abaixo de 10.0 mg/L"
          ],
          correct: 1,
          explanation: "Na nutrição funcional, o ideal para a PCR-us é < 1.0 mg/L. Valores entre 1.0 e 3.0 sugerem risco metabólico intermediário, e acima de 3.0 indicam inflamação sistêmica de baixo grau ativa."
        },
        {
          question: "O aumento do T3 reverso (rT3) em detrimento de T3 livre sob estresse crônico deve-se a qual alteração metabólica estimulada pelo cortisol?",
          options: [
            "Inibição da tireoide peroxidase (TPO).",
            "Bloqueio da liberação de TSH na hipófise anterior.",
            "Inibição da enzima deiodinase tipo 1 (D1) e ativação da deiodinase tipo 3 (D3).",
            "Aumento da ligação dos hormônios à albumina sérica."
          ],
          correct: 2,
          explanation: "O estresse crônico e o cortisol elevado desviam a conversão periférica de T4, inibindo a enzima D1 (que produz T3 ativo) e ativando a D3 (que converte T4 em T3 reverso, que é inativo)."
        },
        {
          question: "O HOMA-IR é um índice calculado a partir da glicemia e insulina de jejum. O que valores elevados (ex.: 3,32) indicam?",
          options: [
            "Excelente sensibilidade à insulina.",
            "Resistência à insulina: as células respondem mal ao hormônio, exigindo mais insulina para captar glicose.",
            "Deficiência absoluta de insulina (diabetes tipo 1).",
            "Hipoglicemia reativa isolada."
          ],
          correct: 1,
          explanation: "O HOMA-IR estima a resistência à insulina. Valores acima do ideal funcional (~2,0) indicam que é preciso mais insulina para manter a glicemia, com hiperinsulinemia compensatória que bloqueia a lipólise e favorece o ganho de peso."
        },
        {
          question: "A 'endotoxemia metabólica' que conecta a disbiose à inflamação subclínica (PCR-us elevada) ocorre por qual mecanismo?",
          options: [
            "Aumento de vitaminas produzidas pelas bactérias benéficas.",
            "Passagem de LPS (lipopolissacarídeo de bactérias Gram-negativas) pela barreira intestinal hiperpermeável, ativando receptores TLR4 e a resposta inflamatória.",
            "Excesso de fibras solúveis na circulação.",
            "Redução total da microbiota intestinal."
          ],
          correct: 1,
          explanation: "Na hiperpermeabilidade (leaky gut), o LPS bacteriano atravessa a barreira e cai na circulação, ativando receptores TLR4 e a via NF-kB, gerando inflamação sistêmica de baixo grau (endotoxemia metabólica) que sabota o metabolismo."
        },
        {
          question: "A berberina é prescrita para resistência à insulina e disbiose. Qual seu principal mecanismo metabólico?",
          options: [
            "Inibição da AMPK, reduzindo a queima de energia.",
            "Ativação da enzima AMPK (mimetizando o efeito do exercício), melhorando a captação de glicose e a sensibilidade à insulina.",
            "Estímulo direto da secreção de insulina pancreática.",
            "Bloqueio da absorção de água no intestino."
          ],
          correct: 1,
          explanation: "A berberina ativa a AMPK ('sensor energético celular'), aumentando a translocação de GLUT-4 e a captação de glicose, além de modular favoravelmente a microbiota — efeitos que melhoram a sensibilidade à insulina, comparáveis em estudos a fármacos como a metformina."
        },
        {
          question: "A L-Glutamina é indicada para reparar a barreira intestinal (leaky gut). Qual o racional bioquímico?",
          options: [
            "É o principal substrato energético dos enterócitos, favorecendo a renovação celular e a integridade das tight junctions.",
            "Atua como laxante estimulante.",
            "Elimina todas as bactérias intestinais indistintamente.",
            "É um inibidor de bomba de prótons."
          ],
          correct: 0,
          explanation: "A glutamina é o combustível preferencial dos enterócitos (células do epitélio intestinal), apoiando sua renovação e a manutenção das junções de oclusão (tight junctions), o que ajuda a restaurar a barreira intestinal hiperpermeável."
        }
      ]
    },
    {
      id: 7,
      title: "Módulo 7: Nutrigenômica e Epigenética",
      subtitle: "Metilação, Polimorfismo MTHFR e Homocisteína",
      case: {
        patient: {
          name: "Letícia Ramos",
          age: 31,
          occupation: "Designer",
          avatar: "👩‍🎨",
          complaint: "Ansiedade crônica, histórico de enxaquecas recorrentes e dois abortos espontâneos precoces sem causa anatômica explicável. Cansaço persistente."
        },
        anamnese: "Letícia relata que as enxaquecas pioram em períodos de sobrecarga de trabalho. Possui histórico familiar de infarto agudo do miocárdio precoce (pai aos 45 anos). Está tentando engravidar novamente e faz uso diário de suplemento gestacional comercial contendo 400mcg de Ácido Fólico sintético.",
        semiologia: "Apresenta palidez cutânea e unhas com fragilidade distal. Extremidades frias e relato de baixa tolerância ao estresse mental.",
        investigation: {
          limit: 2,
          options: [
            {
              id: "homocysteine",
              name: "Homocisteína Plasmática",
              price: "low",
              needed: true,
              result: "Homocisteína: 17.5 mcmol/L (Ideal funcional: < 9.0 mcmol/L). Indica hiperhomocisteinemia significativa.",
              feedback: "Excelente escolha! A homocisteína é um biomarcador crucial de metilação. Níveis acima de 10 aumentam o risco cardiovascular, abortos de repetição e enxaqueca."
            },
            {
              id: "mthfr_genotype",
              name: "Pesquisa de Polimorfismos do Gene MTHFR (C677T e A1298C)",
              price: "high",
              needed: true,
              result: "MTHFR C677T: Homozigoto Mutado (T/T) | MTHFR A1298C: Homozigoto Selvagem (A/A). Confirmou mutação C677T.",
              feedback: "Excelente! A presença da mutação homozigota (677T/T) reduz a atividade da enzima MTHFR em aproximadamente 60% a 70%, comprometendo a metilação."
            },
            {
              id: "folate_serum",
              name: "Folato Sérico e Intraeritrocitário",
              price: "low",
              needed: false,
              result: "Folato sérico: 4.2 ng/mL (Limiar inferior).",
              feedback: "Secundário. O folato sérico flutua muito com a dieta recente. A homocisteína e a genética do MTHFR fornecem informações mais precisas sobre o status funcional do folato."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "methylfolate_b12",
              name: "Prescrever Metilfolato (L-5-MTHF) - 400mcg + Metilcobalamin (B12 ativa) - 500mcg + Piridoxal-5-Fosfato (B6 ativa) - 30mg em cápsulas sublinguais.",
              correct: true,
              critical: false,
              feedback: "Fantástico! O metilfolato (forma ativa) pula o bloqueio genético da MTHFR. A B12 ativa (metilcobalamina) e a B6 ativa cooperam na via da metionina sintase para converter homocisteína de volta em metionina."
            },
            {
              id: "riboflavin_b2",
              name: "Adicionar Riboflavina (Vitamina B2) - 10mg à formulação magistral.",
              correct: true,
              critical: false,
              feedback: "Excelente raciocínio bioquímico! A riboflavina é a precursora do FAD, que atua como cofator essencial obrigatório da própria enzima MTHFR. Ela ajuda a otimizar a atividade da enzima mutada restante."
            },
            {
              id: "folic_acid_high",
              name: "Substituir o suplemento comercial por Ácido Fólico sintético concentrado (5mg/dia) para contornar a mutação.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Em portadores da mutação MTHFR C677T (T/T), o ácido fólico sintético em alta dose não consegue ser convertido de forma eficiente na enzima e satura a enzima DHFR, acumulando ácido fólico não-metabolizado (UMFA) no sangue, o que piora o bloqueio de metilação."
            },
            {
              id: "antiinflammatory_greens",
              name: "Orientação dietética: excluir alimentos fortificados com ácido fólico sintético (farinhas refinadas). Estimular o consumo de vegetais folhosos verde-escuros orgânicos, beterraba e abacate.",
              correct: true,
              critical: false,
              feedback: "Excelente conduta! As folhas verde-escuras fornecem folato natural (tetraidrofolato), muito melhor metabolizado, enquanto a beterraba fornece betaína (trimetilglicina), que ativa a via alternativa de metilação hepática (BHMT)."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "O caso da Letícia ilustra um defeito metabólico genético comum. O gene MTHFR codifica a enzima que converte o folato alimentar em 5-metilfolato (forma ativa doadora de metil). Portadores da mutação homozigota C677T (T/T) têm a síntese de 5-metilfolato severamente reduzida. Sem folato ativo, a metilação da homocisteína em metionina falha, gerando acúmulo de homocisteína sérica (17.5 mcmol/L). A hiperhomocisteinemia lesa o endotélio vascular e promove trombofilias na placenta, justificando os abortos de repetição e enxaquecas. Suplementar ácido fólico sintético (forma inativa comum em suplementos convencionais) agrava a situação metabólica. A conduta ideal é fornecer a forma ativa 5-MTHF (Metilfolato) junto a cofatores de metilação (Metil-B12, B6 ativa e Riboflavina B2)."
        }
      },
      quiz: [
        {
          question: "A mutação homozigota C677T no gene da enzima MTHFR altera a estrutura proteica e reduz a sua atividade enzimática em cerca de quantos por cento?",
          options: [
            "De 10% a 20%",
            "De 60% a 70%",
            "Apenas 5% em mulheres",
            "Causa inativação de 100% da enzima"
          ],
          correct: 1,
          explanation: "A homozigose para o alelo T (T/T) no codon 677 resulta em uma enzima MTHFR termolábil com perda de 60% a 70% de sua atividade catalítica."
        },
        {
          question: "Qual vitamina atua especificamente como a precursora do FAD, cofator coenzimático obrigatório da MTHFR, e deve ser incluída no tratamento?",
          options: [
            "Tiamina (Vitamina B1)",
            "Niacina (Vitamina B3)",
            "Riboflavina (Vitamina B2)",
            "Ácido Pantotênico (Vitamina B5)"
          ],
          correct: 2,
          explanation: "A riboflavina (Vitamina B2) é convertida em FAD (Flavina Adenina Dinucleotídeo), cofator da enzima MTHFR. Sua suplementação melhora a cinética enzimática em portadores do polimorfismo."
        },
        {
          question: "Por que prescrever metilfolato (L-5-MTHF) é superior ao ácido fólico sintético em portadores da mutação MTHFR C677T (T/T)?",
          options: [
            "Porque o metilfolato é a forma ativa, já metilada, que dispensa a conversão pela enzima MTHFR deficiente.",
            "Porque o ácido fólico sintético é tóxico em qualquer dose.",
            "Porque o metilfolato bloqueia a enzima MTHFR.",
            "Porque o ácido fólico sintético não é absorvido pelo intestino."
          ],
          correct: 0,
          explanation: "O metilfolato (5-MTHF) é a forma biologicamente ativa, que 'pula' o passo limitado pela MTHFR mutada. O ácido fólico sintético depende da conversão (DHFR e MTHFR) e, em alta dose nesses pacientes, acumula ácido fólico não-metabolizado (UMFA) no sangue."
        },
        {
          question: "A hiperhomocisteinemia da Letícia ajuda a explicar seu histórico de abortos de repetição e enxaqueca porque a homocisteína elevada:",
          options: [
            "Melhora a circulação placentária.",
            "Lesa o endotélio vascular e favorece estados pró-trombóticos, prejudicando a circulação placentária e cerebral.",
            "Aumenta a produção de progesterona.",
            "Não tem qualquer efeito vascular."
          ],
          correct: 1,
          explanation: "A homocisteína elevada é tóxica ao endotélio e pró-trombótica, podendo causar microtromboses placentárias (associadas a abortos de repetição) e disfunção vascular cerebral (associada a enxaquecas)."
        },
        {
          question: "A betaína (trimetilglicina), presente na beterraba e recomendada à Letícia, contribui para a metilação por qual via alternativa?",
          options: [
            "Pela via da BHMT (betaína-homocisteína metiltransferase), que remetila a homocisteína em metionina independentemente do folato.",
            "Inibindo totalmente a produção de metionina.",
            "Pela via exclusiva da MTHFR mutada.",
            "Convertendo metionina em homocisteína."
          ],
          correct: 0,
          explanation: "A betaína atua como doadora de metil na via da BHMT (predominante no fígado), remetilando a homocisteína em metionina sem depender do folato/MTHFR — uma rota de apoio valiosa em portadores do polimorfismo MTHFR."
        },
        {
          question: "O conceito central da epigenética aplicado à nutrigenômica é que:",
          options: [
            "A sequência do DNA é totalmente alterada pela dieta em poucas horas.",
            "Fatores ambientais e nutricionais (como a disponibilidade de grupos metil) modulam a EXPRESSÃO dos genes sem alterar a sequência do DNA.",
            "Os genes não têm qualquer influência do ambiente.",
            "A epigenética só ocorre em bactérias."
          ],
          correct: 1,
          explanation: "A epigenética estuda alterações na expressão gênica (ex.: metilação do DNA, modificação de histonas) influenciadas pelo ambiente e pela dieta, sem mudar a sequência de bases — daí a importância dos doadores de metil (folato, B12, betaína, colina)."
        }
      ]
    },
    {
      id: 8,
      title: "Módulo 8: Obesidade e Síndrome Metabólica",
      subtitle: "Resistência Insulínica e Inflamação Adiposa",
      case: {
        patient: {
          name: "Roberto Oliveira",
          age: 49,
          occupation: "Engenheiro",
          avatar: "👨‍💼",
          complaint: "Dificuldade absoluta para perder peso, fadiga acentuada após refeições e episódios de ronco com sonolência diurna (apneia obstrutiva do sono)."
        },
        anamnese: "Roberto trabalha sentado muitas horas, consome fast food frequentemente e consome cerveja aos finais de semana. Dorme em média 5h por noite. Diagnosticado recentemente com hipertensão arterial leve, sem uso de medicação fixa.",
        semiologia: "Ao exame físico, apresenta IMC: 31.2 kg/m² (Obesidade Grau 1). Circunferência abdominal: 112 cm (Risco metabólico muito elevado). Presença de placas aveludadas escurecidas (hiperpigmentação) na região cervical posterior e axilar (Acantose Nigricans).",
        investigation: {
          limit: 3,
          options: [
            {
              id: "triglycerides_ratio",
              name: "Relação Triglicerídeos/HDL e Perfil Lipídico",
              price: "low",
              needed: true,
              result: "Triglicerídeos: 240 mg/dL | HDL: 35 mg/dL | Relação TG/HDL: 6.8 (Elevada). Perfil lipídico alterado.",
              feedback: "Excelente! A relação Triglicerídeos/HDL é um marcador de resistência insulínica e partículas de LDL pequenas e densas. Valores acima de 2.0 indicam disfunção metabólica ativa."
            },
            {
              id: "homa_ir_8",
              name: "Glicemia e Insulina de Jejum (HOMA-IR)",
              price: "low",
              needed: true,
              result: "Glicemia: 104 mg/dL (Glicemia de jejum alterada) | Insulina: 26 uUI/mL (Muito elevada) | HOMA-IR: 6.67. Indica resistência severa à insulina.",
              feedback: "Perfeito! O HOMA-IR de 6.67 aponta para um quadro grave de resistência periférica à insulina. As células de Roberto precisam de quantidades massivas de insulina para captar glicose."
            },
            {
              id: "uric_acid",
              name: "Ácido Úrico Sérico",
              price: "low",
              needed: true,
              result: "Ácido úrico: 7.9 mg/dL (Elevado. Ideal funcional: < 5.5 mg/dL).",
              feedback: "Correto! O ácido úrico elevado está fortemente associado à hiperinsulinemia, pois a insulina reduz a excreção renal de ácido úrico, além do alto consumo de frutose industrializada."
            },
            {
              id: "biopsia_gordura",
              name: "Biópsia de Tecido Adiposo Subcutâneo",
              price: "high",
              needed: false,
              result: "Não realizada.",
              feedback: "ERRO DE CONDUTA! Exame invasivo de pesquisa científica, totalmente injustificável no tratamento clínico ambulatorial da síndrome metabólica."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "berberina_lipoic",
              name: "Prescrever Berberina (500mg) associada a Ácido Alfa-Lipoico (300mg) 30 minutos antes do almoço e jantar.",
              correct: true,
              critical: false,
              feedback: "Excelente conduta! A berberina estimula a via AMPK, ativando receptores GLUT-4. O ácido alfa-lipoico atua como um potente cofator mitocondrial e antioxidante, melhorando a sensibilidade insulínica celular."
            },
            {
              id: "semaglutida_presc",
              name: "Prescrever Semaglutida (Ozempic) em caneta injetável, iniciando em 0.25mg por semana para acelerar a perda de peso.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A Semaglutida é um hormônio análogo de GLP-1 sintético sob regulação de receituário médico. Nutricionistas não possuem competência legal para prescrever medicamentos injetáveis ou alopáticos sob nenhuma hipótese."
            },
            {
              id: "resveratrol_curcumina",
              name: "Prescrever Trans-Resveratrol (150mg) + Curcumina (200mg) para reduzir citocinas inflamatórias (IL-6 e TNF-alfa).",
              correct: true,
              critical: false,
              feedback: "Excelente! O tecido adiposo inflamado de Roberto libera citocinas que bloqueiam o receptor de insulina. O resveratrol e a curcumina reduzem a ativação do complexo inflamatório NF-kB."
            },
            {
              id: "diet_ketogenic_cycle",
              name: "Prescrever Dieta de Restrição de Carboidratos (Low-Carb ou Cetogênica cíclica) com jejum intermitente e alto teor de fibras solúveis.",
              correct: true,
              critical: false,
              feedback: "Perfeito! A redução na carga glicêmica dietética reduz de imediato as oscilações de insulina, permitindo que a lipase hormônio-sensível queime gordura. O jejum ajuda a restaurar a sensibilidade dos receptores celulares de insulina."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Roberto apresenta Síndrome Metabólica clássica caracterizada por obesidade abdominal, hipertensão, dislipidemia e resistência à insulina severa. No exame físico, a presença de Acantose Nigricans é sinal patognomônico de hiperinsulinemia crônica. A insulina em excesso estimula a proliferação de queratinócitos e fibroblastos na pele. O alto nível de triglicerídeos e baixo HDL (relação TG/HDL 6.8) refletem a lipogênese de novo hepática hiperativa estimulada pela insulina. O ácido úrico alto decorre da retenção renal induzida por insulina. A terapia visa quebrar esse ciclo desinflamando o tecido adiposo com Resveratrol e Curcumina, e restaurando a sensibilidade à insulina com Berberina, Ácido Alfa-Lipoico e uma dieta Low-Carb."
        }
      },
      quiz: [
        {
          question: "Na semiologia nutricional, qual sinal dermatológico clássico (placas aveludadas hiperpigmentadas em dobras cutâneas) é considerado indicativo direto de resistência à insulina grave?",
          options: [
            "Queratose pilar",
            "Acantose nigricans",
            "Língua geográfica",
            "Dermatite seborreica"
          ],
          correct: 1,
          explanation: "A acantose nigricans caracteriza-se pelo escurecimento e espessamento da pele em dobras cutâneas, sendo causada pela ligação do excesso de insulina circulante aos receptores de fator de crescimento IGF-1 na epiderme."
        },
        {
          question: "Qual fitoativo atua na translocação de vesículas de GLUT-4 para a membrana celular através da ativação da via enzimática AMPK, auxiliando no tratamento da síndrome metabólica?",
          options: [
            "Piperina",
            "Licopeno",
            "Berberina (extrato seco)",
            "Ginkgo biloba"
          ],
          correct: 2,
          explanation: "A berberina é um alcaloide isoquinolínico que ativa a enzima AMPK (adenosina monofosfato quinase), responsável por sinalizar a captação de glicose via GLUT-4 independentemente da via tradicional de insulina."
        },
        {
          question: "A relação Triglicerídeos/HDL (TG/HDL) é um marcador prático de resistência à insulina. Valores elevados (ex.: 6,8) também se associam a qual padrão de partículas de LDL?",
          options: [
            "Partículas de LDL grandes e flutuantes (padrão A), menos aterogênicas.",
            "Partículas de LDL pequenas e densas (padrão B), mais aterogênicas.",
            "Ausência total de LDL circulante.",
            "Apenas aumento de HDL funcional."
          ],
          correct: 1,
          explanation: "Uma relação TG/HDL alta reflete predomínio de LDL pequenas e densas (padrão B), que penetram mais facilmente no endotélio e são mais oxidáveis, elevando o risco cardiovascular — marca da dislipidemia aterogênica da síndrome metabólica."
        },
        {
          question: "Os critérios diagnósticos da Síndrome Metabólica incluem a combinação de pelo menos três dos seguintes. Qual conjunto está correto?",
          options: [
            "Circunferência abdominal aumentada, triglicerídeos altos, HDL baixo, pressão arterial elevada e glicemia de jejum alterada.",
            "Apenas IMC acima de 25 kg/m².",
            "Colesterol total baixo, pressão baixa e bradicardia.",
            "Deficiência de vitamina D isolada."
          ],
          correct: 0,
          explanation: "A Síndrome Metabólica é definida pela presença de ≥3 critérios: obesidade central (circunferência abdominal), hipertrigliceridemia, HDL baixo, hipertensão e glicemia de jejum elevada — todos ligados à resistência à insulina."
        },
        {
          question: "O ácido úrico elevado do Roberto (7,9 mg/dL) relaciona-se com a hiperinsulinemia e o consumo de frutose industrializada porque:",
          options: [
            "A insulina aumenta a excreção renal de ácido úrico.",
            "A insulina reduz a excreção renal de ácido úrico e o metabolismo da frutose gera ácido úrico, elevando seus níveis.",
            "A frutose é convertida diretamente em HDL.",
            "O ácido úrico não tem relação alguma com o metabolismo."
          ],
          correct: 1,
          explanation: "A hiperinsulinemia reduz a excreção renal de urato e o metabolismo hepático da frutose consome ATP gerando ácido úrico. Por isso a hiperuricemia é frequente na síndrome metabólica e marcador de disfunção metabólica e endotelial."
        },
        {
          question: "O Ácido Alfa-Lipoico (ALA), associado à berberina na conduta, contribui no tratamento da síndrome metabólica por quê?",
          options: [
            "É um antioxidante mitocondrial anfipático (atua em meio aquoso e lipídico) que melhora a sensibilidade à insulina e regenera outros antioxidantes.",
            "É um carboidrato simples de rápida absorção.",
            "Bloqueia a produção de glutationa.",
            "Aumenta a resistência à insulina."
          ],
          correct: 0,
          explanation: "O ALA é cofator de complexos enzimáticos mitocondriais e antioxidante anfipático, melhorando a captação de glicose, reduzindo o estresse oxidativo e regenerando vitaminas C e E e a glutationa — útil também na neuropatia associada à disglicemia."
        }
      ]
    },
    {
      id: 9,
      title: "Módulo 9: Saúde Intestinal e Microbiota (SIBO)",
      subtitle: "Disbiose, SIBO e Eixo Intestino-Cérebro",
      ambulatorio: true,
      case: {
        patient: {
          name: "Fernanda Lima",
          age: 36,
          occupation: "Jornalista",
          avatar: "👩‍💼",
          complaint: "Distensão abdominal severa que piora ao longo do dia (parece 'grávida de gases' à noite), arrotos frequentes, e alternância entre diarreia e constipação. Piora muito ao comer fibras e probióticos."
        },
        anamnese: "Fernanda já fez uso repetido de antibióticos no último ano e usou inibidor de bomba de prótons (omeprazol) por meses para 'gastrite'. Relata que alimentos saudáveis e ricos em fibras (alho, cebola, maçã, feijão) e iogurtes pioram dramaticamente o inchaço. Refere ansiedade e episódios de 'brain fog'.",
        semiologia: "Abdômen muito distendido e timpânico à percussão, sobretudo no período vespertino. Língua com saburra. Sinais de carência: queda de cabelo e palidez. Relato de fezes com restos alimentares e gordura (esteatorreia leve).",
        investigation: {
          limit: 2,
          options: [
            {
              id: "breath_test",
              name: "Teste Respiratório do Hidrogênio e Metano Expirados (Lactulose)",
              price: "medium",
              needed: true,
              result: "Pico precoce de hidrogênio (> 20 ppm acima do basal antes de 90 min) e elevação de metano. Compatível com Supercrescimento Bacteriano do Intestino Delgado (SIBO).",
              feedback: "Excelente! O teste respiratório é o padrão não-invasivo para SIBO: a fermentação precoce de carboidratos no intestino delgado (que deveria ocorrer no cólon) gera pico precoce de H2/CH4."
            },
            {
              id: "b12_sibo",
              name: "Vitamina B12 e Ferritina",
              price: "low",
              needed: true,
              result: "B12: 210 pg/mL (baixa) | Ferritina: 14 ng/dL (baixa). As bactérias do delgado consomem B12 e competem por nutrientes.",
              feedback: "Correto! No SIBO, as bactérias em excesso no delgado consomem B12 e ferro e podem desconjugar sais biliares, gerando má absorção e carências."
            },
            {
              id: "colono_sibo",
              name: "Colonoscopia",
              price: "high",
              needed: false,
              result: "Mucosa do cólon sem lesões; sem pólipos ou doença inflamatória.",
              feedback: "Inadequado como primeira linha aqui. A colonoscopia avalia o cólon, não o intestino delgado (sede do SIBO), e é invasiva. Indicada com sinais de alarme (sangramento, anemia inexplicada, idade/risco)."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "low_fodmap",
              name: "Implementar dieta low-FODMAP temporária (fase de eliminação por 2-6 semanas, seguida de reintrodução estruturada) para reduzir o substrato fermentável.",
              correct: true,
              critical: false,
              feedback: "Correto! A dieta low-FODMAP reduz carboidratos fermentáveis que alimentam as bactérias do delgado, aliviando os sintomas. Deve ser TEMPORÁRIA, com reintrodução para preservar a diversidade da microbiota."
            },
            {
              id: "berberina_oregano",
              name: "Fitoterápicos antimicrobianos: Berberina + óleo de Orégano (carvacrol) padronizado, em ciclo orientado, como 'antibiótico herbal' para reduzir o supercrescimento.",
              correct: true,
              critical: false,
              feedback: "Excelente! Berberina e óleo de orégano têm evidência como antimicrobianos herbais no manejo do SIBO, com eficácia comparável a antibióticos em alguns estudos, reduzindo a carga bacteriana."
            },
            {
              id: "probiotico_alto_sibo",
              name: "Prescrever altas doses de probióticos com múltiplas cepas e prebióticos (inulina/FOS) imediatamente para 'repor a flora'.",
              correct: false,
              critical: false,
              feedback: "Conduta inadequada NESTE momento. Prebióticos fermentáveis (inulina/FOS) e altas doses de probióticos podem PIORAR o SIBO na fase ativa, aumentando gás e distensão. A reposição é feita após reduzir o supercrescimento."
            },
            {
              id: "ppi_sibo",
              name: "Reintroduzir omeprazol em dose dobrada continuamente para controlar os arrotos e a 'gastrite'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O uso crônico de inibidor de bomba de prótons reduz a acidez gástrica (barreira antimicrobiana natural) e é um FATOR DE RISCO conhecido para SIBO. Dobrar a dose agravaria a causa do quadro."
            },
            {
              id: "motilidade_gengibre",
              name: "Apoiar o Complexo Motor Migratório (MMC) com espaçamento entre refeições (3-4h, sem beliscar) e procinético natural (gengibre/Zingiber officinale).",
              correct: true,
              critical: false,
              feedback: "Ótimo! O Complexo Motor Migratório 'varre' o intestino delgado entre as refeições. O beliscar constante o inibe. Espaçar refeições e usar procinéticos (gengibre) ajuda a prevenir a recidiva do SIBO."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Fernanda apresenta um quadro clássico de SIBO (Small Intestinal Bacterial Overgrowth), suspeitado pela PIORA paradoxal com fibras, prebióticos e probióticos — alimentos saudáveis que viram substrato de fermentação no local errado. Fatores de risco presentes: antibióticos de repetição (disbiose) e uso crônico de IBP (perda da barreira ácida gástrica). As bactérias em excesso no delgado consomem B12 e ferro e desconjugam sais biliares (esteatorreia). A abordagem funcional segue uma lógica de fases: (1) reduzir o substrato (low-FODMAP temporária), (2) reduzir a carga bacteriana (antimicrobianos herbais como berberina e orégano), (3) restaurar a motilidade (apoio ao MMC com gengibre e espaçamento de refeições) e só então (4) recolonizar e reparar. Repor probióticos/prebióticos na fase ativa e perpetuar o IBP são erros que mantêm o ciclo."
        }
      },
      quiz: [
        {
          question: "A sigla FODMAP refere-se a um grupo de carboidratos de cadeia curta fermentáveis. O que significa e qual o objetivo da dieta low-FODMAP no SIBO?",
          options: [
            "São gorduras saturadas; o objetivo é aumentá-las.",
            "São Oligo-, Di- e Monossacarídeos e Polióis Fermentáveis; reduzi-los temporariamente diminui o substrato de fermentação e os sintomas.",
            "São proteínas de alto valor biológico que devem ser eliminadas para sempre.",
            "São fibras insolúveis sem qualquer efeito sobre os gases."
          ],
          correct: 1,
          explanation: "FODMAP = Fermentable Oligo-, Di-, Mono-saccharides And Polyols. São carboidratos osmóticos e fermentáveis (ex.: frutanos, lactose, frutose em excesso, sorbitol). Reduzi-los temporariamente alivia distensão e gases no SIBO/SII, com reintrodução posterior."
        },
        {
          question: "O Complexo Motor Migratório (MMC) tem papel central na prevenção do SIBO. Qual sua função e o que o inibe?",
          options: [
            "É o movimento de 'limpeza' do intestino delgado entre as refeições; o ato de beliscar constantemente o inibe.",
            "É a contração que ocorre apenas durante a refeição; o jejum o inibe.",
            "É um reflexo exclusivo do cólon, sem relação com o SIBO.",
            "É a secreção de insulina pós-prandial."
          ],
          correct: 0,
          explanation: "O MMC são ondas de contração em jejum (a cada ~90-120 min) que varrem resíduos e bactérias do delgado para o cólon. Comer/beliscar com frequência o suprime; por isso espaçar refeições e usar procinéticos ajuda a prevenir a recidiva do SIBO."
        },
        {
          question: "Por que o uso crônico de Inibidores da Bomba de Prótons (IBP, como omeprazol) é um fator de risco para o desenvolvimento de SIBO?",
          options: [
            "Porque aumenta a acidez estomacal e mata as bactérias benéficas.",
            "Porque reduz a acidez gástrica, que é uma barreira natural contra a colonização bacteriana do trato digestivo superior.",
            "Porque acelera demais o esvaziamento gástrico.",
            "Porque não tem nenhuma relação com o SIBO."
          ],
          correct: 1,
          explanation: "O ácido clorídrico gástrico é uma das principais barreiras antimicrobianas do organismo. A hipocloridria induzida por IBP crônico facilita a sobrevivência e a migração de bactérias para o intestino delgado, favorecendo o SIBO."
        },
        {
          question: "No SIBO predominantemente metanogênico (com produção de metano, hoje chamado IMO), o sintoma intestinal mais característico costuma ser:",
          options: [
            "Diarreia aquosa explosiva.",
            "Constipação, pois o metano reduz a motilidade intestinal.",
            "Ausência total de sintomas.",
            "Vômitos em jato."
          ],
          correct: 1,
          explanation: "O metano produzido por arqueias (ex.: Methanobrevibacter smithii) lentifica o trânsito intestinal, associando-se mais à constipação. Já o predomínio de hidrogênio associa-se mais à diarreia."
        },
        {
          question: "O eixo intestino-cérebro ajuda a explicar a ansiedade e o 'brain fog' de Fernanda. Qual afirmação está correta sobre essa comunicação?",
          options: [
            "O intestino não tem qualquer comunicação com o cérebro.",
            "A microbiota influencia o cérebro via nervo vago, produção de neurotransmissores (ex.: GABA, serotonina) e modulação imune/inflamatória.",
            "A comunicação ocorre apenas em uma direção, do cérebro para o intestino.",
            "Toda a serotonina do corpo é produzida exclusivamente no cérebro."
          ],
          correct: 1,
          explanation: "O eixo intestino-cérebro é bidirecional: a microbiota modula o nervo vago, produz e influencia neurotransmissores (cerca de 90-95% da serotonina é produzida no intestino) e regula a inflamação, impactando humor e cognição. A disbiose/SIBO pode gerar ansiedade e névoa mental."
        }
      ]
    },
    {
      id: 10,
      title: "Módulo 10: Imunonutrição",
      subtitle: "Imunidade, Vitamina D e Zinco",
      ambulatorio: true,
      case: {
        patient: {
          name: "Rafael Costa",
          age: 41,
          occupation: "Professor de Educação Física",
          avatar: "👨‍🏫",
          complaint: "Infecções respiratórias de repetição (resfriados e amigdalites frequentes), cicatrização lenta de pequenas feridas e cansaço. Refere que 'pega tudo que está no ar'."
        },
        anamnese: "Rafael treina intensamente (overtraining), dorme pouco (~5h) e tem alimentação pobre em frutas, vegetais coloridos e frutos do mar. Exposição solar mínima (treina em ambiente fechado e usa protetor o dia todo). Relata estresse elevado e consumo frequente de açúcar pós-treino.",
        semiologia: "Apresenta manchas brancas nas unhas (leuconíquia), distúrbio do paladar (disgeusia), pele seca e algumas lesões cutâneas de cicatrização lenta. Mucosas levemente hipocoradas. Queda de cabelo difusa.",
        investigation: {
          limit: 2,
          options: [
            {
              id: "vitd_imuno",
              name: "Vitamina D (25-hidroxivitamina D)",
              price: "low",
              needed: true,
              result: "25(OH)D: 19 ng/mL (Deficiente. Ideal funcional para imunidade: 40-60 ng/mL).",
              feedback: "Excelente! A vitamina D é um imunomodulador essencial: atua em células do sistema imune e na produção de peptídeos antimicrobianos (catelicidina). Níveis baixos associam-se a infecções respiratórias de repetição."
            },
            {
              id: "zinco_imuno",
              name: "Zinco Plasmático e Cobre",
              price: "medium",
              needed: true,
              result: "Zinco: 62 mcg/dL (baixo) | Cobre: normal. A leuconíquia, disgeusia e cicatrização lenta apontavam para deficiência de zinco.",
              feedback: "Perfeito! Zinco baixo combina com os sinais clínicos (manchas nas unhas, alteração do paladar, má cicatrização) e compromete a imunidade celular (linfócitos T) e a barreira epitelial."
            },
            {
              id: "fan_imuno",
              name: "FAN (Fator Antinuclear) e painel reumatológico completo",
              price: "high",
              needed: false,
              result: "FAN não reagente; sem evidência de autoimunidade.",
              feedback: "Excesso de investigação para o quadro. O caso aponta para imunodeficiência nutricional funcional (carências + estilo de vida), não para doença autoimune. Reservar para sinais/sintomas sugestivos."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "vitd_supl_imuno",
              name: "Repor Vitamina D3 (com reavaliação) associada a vitamina K2 e magnésio (cofator), buscando 25(OH)D entre 40-60 ng/mL, junto a exposição solar segura.",
              correct: true,
              critical: false,
              feedback: "Correto! A reposição de D3 com cofatores (magnésio é necessário para sua ativação; K2 para direcionar o cálcio) e exposição solar otimiza a imunomodulação. A meta funcional de 40-60 ng/mL apoia a imunidade."
            },
            {
              id: "zinco_supl",
              name: "Suplementar Zinco quelado (ex.: bisglicinato 15-30 mg/dia) por período definido, preferencialmente longe de altas doses de cálcio/ferro, com atenção ao equilíbrio com o cobre.",
              correct: true,
              critical: false,
              feedback: "Excelente! O zinco quelado tem boa absorção e é cofator de centenas de enzimas, da imunidade celular e da cicatrização. Cuidado com o equilíbrio zinco:cobre em uso prolongado para não induzir deficiência de cobre."
            },
            {
              id: "vitc_quercetina",
              name: "Vitamina C com Quercetina e alimentos ricos em compostos bioativos (frutas vermelhas, vegetais coloridos) para suporte antioxidante e imune.",
              correct: true,
              critical: false,
              feedback: "Ótimo! A vitamina C apoia a função de neutrófilos e a barreira epitelial; a quercetina é um flavonoide com ação anti-inflamatória e antiviral (e atua como ionóforo de zinco). A base alimentar é fundamental."
            },
            {
              id: "megadose_vitd",
              name: "Prescrever megadose única de Vitamina D de 600.000 UI em 'pulso', sem reavaliação nem controle de cálcio.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Megadoses não monitoradas de vitamina D podem causar hipercalcemia e toxicidade. A reposição deve ser individualizada, com dose racional e reavaliação laboratorial — não 'pulsos' arbitrários sem controle."
            },
            {
              id: "manter_overtraining",
              name: "Manter o overtraining, a privação de sono e o açúcar pós-treino, focando apenas em suplementos.",
              correct: false,
              critical: false,
              feedback: "Conduta incompleta e equivocada. Overtraining, privação de sono e excesso de açúcar suprimem a imunidade (a hiperglicemia prejudica a função dos neutrófilos). Nenhum suplemento compensa esses fatores; o estilo de vida é parte central."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Rafael ilustra a imunodeficiência funcional de origem nutricional e comportamental. A vitamina D atua como hormônio imunomodulador, regulando a imunidade inata (produção de catelicidina, um peptídeo antimicrobiano) e a adaptativa; sua deficiência (19 ng/mL) associa-se a maior frequência de infecções respiratórias. O zinco é cofator da imunidade celular (linfócitos T, timo) e da integridade epitelial — seus sinais semiológicos clássicos são leuconíquia (manchas brancas nas unhas), disgeusia (alteração do paladar) e má cicatrização. Além das carências, o estilo de vida sabota a imunidade: o overtraining e a privação de sono elevam o cortisol e geram a 'janela aberta' imunológica pós-exercício, e a hiperglicemia pós-açúcar prejudica transitoriamente a fagocitose dos neutrófilos. A conduta integra reposição racional e monitorada (D3 com cofatores magnésio/K2; zinco com atenção ao cobre), suporte antioxidante (vitamina C, quercetina, vegetais coloridos) e, sobretudo, correção do sono, da carga de treino e do açúcar."
        }
      },
      quiz: [
        {
          question: "Qual o principal mecanismo pelo qual a vitamina D fortalece a imunidade INATA contra patógenos respiratórios?",
          options: [
            "Aumenta a produção de muco que bloqueia toda entrada de ar.",
            "Estimula a produção de peptídeos antimicrobianos endógenos, como a catelicidina, e modula a resposta inflamatória.",
            "Eleva a temperatura corporal continuamente.",
            "Inativa permanentemente os linfócitos."
          ],
          correct: 1,
          explanation: "A vitamina D, via receptor VDR presente em células imunes, induz a expressão de peptídeos antimicrobianos (catelicidina e defensinas) e modula a resposta inflamatória, fortalecendo a imunidade inata das mucosas respiratórias."
        },
        {
          question: "A tríade semiológica leuconíquia (manchas brancas nas unhas) + disgeusia (alteração do paladar) + cicatrização lenta sugere deficiência de qual mineral?",
          options: [
            "Cálcio",
            "Zinco",
            "Sódio",
            "Fósforo"
          ],
          correct: 1,
          explanation: "Esses são sinais clássicos de deficiência de zinco, mineral essencial para a renovação epitelial, a percepção do paladar (gustina), a cicatrização e a imunidade celular."
        },
        {
          question: "Para a ativação metabólica e a ação da vitamina D suplementada, qual mineral é um cofator essencial frequentemente negligenciado?",
          options: [
            "Magnésio",
            "Selênio",
            "Iodo",
            "Manganês"
          ],
          correct: 0,
          explanation: "O magnésio é cofator das enzimas que hidroxilam a vitamina D (ativação no fígado e rim). Sua deficiência pode tornar a suplementação de D menos eficaz — por isso costuma ser associado."
        },
        {
          question: "Por que o overtraining e a privação de sono prejudicam a imunidade de Rafael?",
          options: [
            "Porque reduzem o cortisol a zero, eliminando a inflamação.",
            "Porque elevam o cortisol cronicamente e geram a 'janela aberta' pós-exercício, suprimindo a função imune e aumentando a suscetibilidade a infecções.",
            "Porque aumentam excessivamente a produção de anticorpos.",
            "Porque não têm qualquer efeito sobre o sistema imune."
          ],
          correct: 1,
          explanation: "Exercício extenuante sem recuperação adequada e privação de sono elevam o cortisol e reduzem a imunovigilância (queda transitória de NK e IgA salivar — a 'open window'), aumentando o risco de infecções respiratórias."
        },
        {
          question: "A quercetina, recomendada no caso, é um flavonoide que também auxilia a ação do zinco na célula porque:",
          options: [
            "Bloqueia totalmente a entrada de zinco nas células.",
            "Atua como ionóforo de zinco, facilitando sua entrada na célula, além de ter ação anti-inflamatória e antioxidante.",
            "Converte o zinco em cobre.",
            "É um carboidrato de rápida absorção."
          ],
          correct: 1,
          explanation: "A quercetina funciona como ionóforo de zinco, ajudando a transportá-lo para o meio intracelular, onde ele exerce efeitos antivirais; além disso, é anti-inflamatória e antioxidante, com efeito sinérgico no suporte imune."
        }
      ]
    },
    {
      id: 11,
      title: "Módulo 11: Tireoide e Autoimunidade (Hashimoto)",
      subtitle: "Tireoidite de Hashimoto e Conversão de T4 em T3",
      ambulatorio: true,
      case: {
        patient: {
          name: "Beatriz Alves",
          age: 39,
          occupation: "Contadora",
          avatar: "👩‍💼",
          complaint: "Ganho de peso inexplicado, intolerância ao frio, constipação, queda de cabelo (inclusive na borda lateral das sobrancelhas), pele seca e cansaço profundo com lentidão de raciocínio."
        },
        anamnese: "Beatriz tem diagnóstico de hipotireoidismo e usa levotiroxina prescrita pelo médico, mas mantém sintomas. Relata doença celíaca na família e sensibilidade a glúten. Dieta pobre em selênio e zinco; consumo elevado de soja e vegetais crucíferos crus em grande quantidade (sucos verdes). Estresse alto.",
        semiologia: "Madarose (queda do terço lateral das sobrancelhas), pele seca e fria, edema discreto (mixedema), reflexos tendinosos lentificados e bradicardia leve. Cabelos quebradiços.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "tireoide_completo",
              name: "TSH, T4 livre e T3 livre",
              price: "low",
              needed: true,
              result: "TSH: 5,2 mUI/L (elevado) | T4 livre: normal-baixo | T3 livre: baixo. Sugere hipotireoidismo ainda não compensado e possível falha de conversão de T4 em T3.",
              feedback: "Correto! Avaliar T3 livre (não só TSH e T4) é essencial: muitos pacientes 'tratados' seguem sintomáticos por baixa conversão periférica de T4 em T3 (o hormônio ativo)."
            },
            {
              id: "anticorpos_tireoide",
              name: "Anti-TPO e Anti-Tireoglobulina (anticorpos antitireoidianos)",
              price: "medium",
              needed: true,
              result: "Anti-TPO: 480 UI/mL (muito elevado) | Anti-Tireoglobulina: elevado. Confirma Tireoidite de Hashimoto (autoimune).",
              feedback: "Excelente! Os anticorpos elevados confirmam a natureza AUTOIMUNE (Hashimoto) do hipotireoidismo — o que muda a abordagem para o controle da autoimunidade, e não apenas a reposição hormonal."
            },
            {
              id: "selenio_vitd_tireoide",
              name: "Selênio e Vitamina D",
              price: "medium",
              needed: true,
              result: "Selênio: baixo | 25(OH)D: 24 ng/mL (insuficiente). Ambos relevantes na modulação autoimune e na função tireoidiana.",
              feedback: "Ótimo! Selênio é cofator das deiodinases (conversão de T4 em T3) e da glutationa peroxidase tireoidiana; a vitamina D baixa associa-se a maior atividade autoimune. Ambos são alvos terapêuticos."
            },
            {
              id: "cintilografia_tireoide",
              name: "Cintilografia tireoidiana com iodo radioativo",
              price: "high",
              needed: false,
              result: "Não realizada.",
              feedback: "Inadequado neste contexto. A cintilografia investiga nódulos hiperfuncionantes/hipertireoidismo, não é a investigação de escolha no hipotireoidismo de Hashimoto, e expõe a radiação desnecessária."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "selenio_supl",
              name: "Suplementar Selênio (ex.: selenometionina ~200 mcg/dia, sem ultrapassar limites de segurança), cofator das deiodinases e antioxidante tireoidiano.",
              correct: true,
              critical: false,
              feedback: "Correto! O selênio é cofator das enzimas deiodinases (conversão de T4→T3) e da glutationa peroxidase, reduz os anticorpos anti-TPO em estudos e protege a tireoide do estresse oxidativo. Atenção à dose (toxicidade acima de ~400 mcg)."
            },
            {
              id: "retirada_gluten",
              name: "Investigar e, se confirmada sensibilidade/doença celíaca, retirar glúten; priorizar dieta anti-inflamatória para modular a autoimunidade.",
              correct: true,
              critical: false,
              feedback: "Excelente! Há forte associação entre Hashimoto e doença celíaca/sensibilidade ao glúten (mimetismo molecular). Em pacientes sensíveis, a retirada do glúten pode reduzir anticorpos e sintomas — orientada e individualizada."
            },
            {
              id: "iodo_altadose",
              name: "Prescrever altas doses de iodo (ex.: Lugol/iodo concentrado) para 'estimular' a tireoide.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Em Tireoidite de Hashimoto, o excesso de iodo pode AGRAVAR a autoimunidade e a destruição glandular (aumenta a imunogenicidade da tireoglobulina). Iodo em alta dose é contraindicado nesse contexto."
            },
            {
              id: "zinco_vitd_tireoide",
              name: "Corrigir zinco e vitamina D (com cofatores), reduzir o estresse e cozinhar bem as crucíferas; moderar a soja crua, espaçando-a da levotiroxina.",
              correct: true,
              critical: false,
              feedback: "Ótimo! O zinco participa da conversão de T4→T3; a vitamina D modula a autoimunidade. Crucíferas cruas em grande quantidade contêm goitrogênios (reduzidos pelo cozimento) e a soja pode interferir na absorção da levotiroxina — daí o espaçamento."
            },
            {
              id: "suspender_levo",
              name: "Orientar a paciente a suspender por conta própria a levotiroxina prescrita pelo médico e substituí-la apenas por fitoterápicos.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! O nutricionista não suspende nem altera medicação prescrita por outro profissional. A levotiroxina é conduta médica; a atuação nutricional é COMPLEMENTAR (nutrientes, autoimunidade, conversão), em conjunto com o médico."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Beatriz tem hipotireoidismo de causa AUTOIMUNE (Tireoidite de Hashimoto), confirmado pelos anticorpos anti-TPO e anti-tireoglobulina elevados. O ponto-chave funcional é olhar além do TSH: avaliar o T3 livre revela falha de conversão periférica de T4 em T3 — processo dependente das enzimas deiodinases, que têm o SELÊNIO como cofator e são prejudicadas pelo estresse (cortisol), pela deficiência de zinco e pela inflamação. A madarose (perda do terço lateral das sobrancelhas) é um sinal semiológico clássico de hipotireoidismo. A abordagem integra: (1) corrigir cofatores da conversão e da imunomodulação (selênio, zinco, vitamina D); (2) modular a autoimunidade pela alimentação anti-inflamatória, com investigação e eventual retirada do glúten (alta coassociação com doença celíaca por mimetismo molecular); (3) cuidados práticos — cozinhar crucíferas (reduz goitrogênios), espaçar soja e cálcio da levotiroxina. Erros graves seriam dar iodo em alta dose (piora a autoimunidade) ou interferir na medicação médica — a atuação do nutricionista é complementar e em equipe."
        }
      },
      quiz: [
        {
          question: "A Tireoidite de Hashimoto é a principal causa de hipotireoidismo em regiões sem deficiência de iodo. Qual exame CONFIRMA sua natureza autoimune?",
          options: [
            "Apenas o TSH elevado.",
            "Os anticorpos antitireoidianos elevados (Anti-TPO e Anti-Tireoglobulina).",
            "A glicemia de jejum.",
            "O colesterol total."
          ],
          correct: 1,
          explanation: "A presença de anticorpos anti-TPO e anti-tireoglobulina elevados confirma a autoimunidade contra a tireoide (Hashimoto). O TSH indica a função, mas não a causa autoimune."
        },
        {
          question: "O selênio é um nutriente central na fisiologia tireoidiana. Por quê?",
          options: [
            "É cofator das deiodinases (conversão de T4 em T3) e da glutationa peroxidase, que protege a tireoide do estresse oxidativo.",
            "É o principal componente estrutural do hormônio T4.",
            "Substitui completamente a necessidade de iodo.",
            "Inibe a produção de todos os hormônios tireoidianos."
          ],
          correct: 0,
          explanation: "O selênio é cofator das enzimas deiodinases (que convertem T4 no T3 ativo) e da glutationa peroxidase tireoidiana (antioxidante). Sua adequação melhora a conversão hormonal e pode reduzir os anticorpos anti-TPO."
        },
        {
          question: "Muitos pacientes com hipotireoidismo em uso de levotiroxina permanecem sintomáticos. Qual mecanismo funcional frequentemente explica isso?",
          options: [
            "Baixa conversão periférica de T4 em T3 (o hormônio metabolicamente ativo), por deficiência de cofatores, estresse ou inflamação.",
            "Excesso de produção endógena de T3.",
            "Hipersensibilidade dos receptores ao hormônio.",
            "Conversão excessiva de TSH em T4."
          ],
          correct: 0,
          explanation: "A levotiroxina é T4, que precisa ser convertido em T3 nos tecidos. Deficiência de selênio/zinco, cortisol elevado e inflamação reduzem essa conversão (e aumentam o T3 reverso), mantendo sintomas mesmo com TSH 'controlado'."
        },
        {
          question: "Por que o excesso de iodo é potencialmente PERIGOSO na Tireoidite de Hashimoto?",
          options: [
            "Porque o iodo cura imediatamente a autoimunidade.",
            "Porque o iodo em excesso pode aumentar a imunogenicidade da tireoglobulina e agravar a destruição autoimune da glândula.",
            "Porque o iodo reduz o TSH a zero.",
            "Porque o iodo não tem qualquer papel na tireoide."
          ],
          correct: 1,
          explanation: "Em tireoide com autoimunidade, o excesso de iodo aumenta a iodação da tireoglobulina, tornando-a mais imunogênica, o que pode intensificar a agressão autoimune. Por isso megadoses de iodo são contraindicadas em Hashimoto."
        },
        {
          question: "Existe forte associação entre Tireoidite de Hashimoto e doença celíaca. Qual o conceito imunológico que ajuda a explicar essa ligação?",
          options: [
            "Mimetismo molecular: semelhança entre antígenos do glúten e tecidos do próprio corpo, favorecendo reação cruzada autoimune.",
            "O glúten contém iodo em excesso.",
            "A doença celíaca produz hormônios tireoidianos.",
            "Não há qualquer associação descrita entre as duas."
          ],
          correct: 0,
          explanation: "O mimetismo molecular (semelhança estrutural entre a gliadina do glúten e antígenos teciduais) e o aumento da permeabilidade intestinal ajudam a explicar a alta coassociação entre doenças autoimunes como Hashimoto e a doença celíaca."
        }
      ]
    },
    {
      id: 12,
      title: "Módulo 12: Saúde Hormonal Feminina (SOP)",
      subtitle: "Síndrome dos Ovários Policísticos e Resistência à Insulina",
      ambulatorio: true,
      case: {
        patient: {
          name: "Camila Duarte",
          age: 27,
          occupation: "Publicitária",
          avatar: "👩‍💻",
          complaint: "Ciclos menstruais irregulares e espaçados, acne persistente na mandíbula, aumento de pelos no rosto e abdômen (hirsutismo) e grande dificuldade para emagrecer. Desejo de engravidar futuramente."
        },
        anamnese: "Camila tem diagnóstico de SOP (Síndrome dos Ovários Policísticos). Consome muitos carboidratos refinados e doces, é sedentária e relata ansiedade. Histórico familiar de diabetes tipo 2. Pele oleosa e queda de cabelo no topo da cabeça (padrão androgênico).",
        semiologia: "IMC: 29 kg/m² com adiposidade central. Acne inflamatória em mandíbula e dorso, hirsutismo (escala de Ferriman elevada) e acantose nigricans discreta na nuca (sinal de resistência à insulina).",
        investigation: {
          limit: 3,
          options: [
            {
              id: "homa_sop",
              name: "Glicemia e Insulina de Jejum (HOMA-IR)",
              price: "low",
              needed: true,
              result: "Glicemia: 95 mg/dL | Insulina: 19 uUI/mL | HOMA-IR: 4,45. Resistência à insulina significativa.",
              feedback: "Excelente! A resistência à insulina é o motor metabólico de grande parte das SOP: a hiperinsulinemia estimula os ovários e as adrenais a produzir andrógenos e reduz a SHBG, elevando a testosterona livre."
            },
            {
              id: "androgenos_sop",
              name: "Testosterona total e livre, SHBG e Androstenediona",
              price: "medium",
              needed: true,
              result: "Testosterona livre elevada | SHBG baixa | Androstenediona elevada. Confirma hiperandrogenismo bioquímico.",
              feedback: "Correto! O hiperandrogenismo (clínico e/ou laboratorial) é critério diagnóstico da SOP. A SHBG baixa (reduzida pela hiperinsulinemia) aumenta a fração livre e ativa da testosterona."
            },
            {
              id: "vitd_inositol_sop",
              name: "Vitamina D e perfil tireoidiano (TSH)",
              price: "low",
              needed: true,
              result: "25(OH)D: 23 ng/mL (insuficiente) | TSH: normal. A deficiência de vitamina D é comum na SOP e piora a resistência à insulina.",
              feedback: "Bom! Vale descartar tireoidopatia (que mimetiza sintomas) e avaliar a vitamina D, frequentemente baixa na SOP e relacionada à sensibilidade insulínica e à função ovariana."
            },
            {
              id: "rm_ovario",
              name: "Ressonância magnética de pelve de alta resolução",
              price: "high",
              needed: false,
              result: "Não realizada.",
              feedback: "Inadequado/desnecessário. O diagnóstico de SOP é clínico-laboratorial (critérios de Rotterdam) com ultrassom transvaginal quando indicado; a ressonância não é exame de rotina e eleva custos sem mudar a conduta."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "inositol_sop",
              name: "Suplementar Mio-inositol + D-quiro-inositol (proporção ~40:1), que melhoram a sinalização da insulina, a função ovariana e a regularidade dos ciclos.",
              correct: true,
              critical: false,
              feedback: "Excelente! O mio-inositol (com D-quiro-inositol na proporção fisiológica ~40:1) atua como segundo mensageiro da insulina, melhorando a sensibilidade insulínica, reduzindo andrógenos e favorecendo a ovulação — com boa evidência na SOP."
            },
            {
              id: "dieta_baixo_ig_sop",
              name: "Dieta de baixo índice/carga glicêmica, anti-inflamatória, com fibras e proteínas adequadas, associada a exercício de força e aeróbico.",
              correct: true,
              critical: false,
              feedback: "Correto! Reduzir a carga glicêmica diminui a hiperinsulinemia (o gatilho do hiperandrogenismo), e o exercício melhora a sensibilidade à insulina. É a base do tratamento da SOP, mesmo com perda de peso modesta (5-10%)."
            },
            {
              id: "anabolizante_sop",
              name: "Prescrever anabolizantes/testosterona para 'equilibrar os hormônios' e melhorar a composição corporal.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A SOP já cursa com hiperandrogenismo; prescrever andrógenos é contraindicado, fora da competência do nutricionista e perigoso (piora acne, hirsutismo, risco cardiovascular e virilização)."
            },
            {
              id: "anticoncepcional_sop",
              name: "Prescrever e iniciar anticoncepcional hormonal oral para regularizar a menstruação da paciente.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Anticoncepcionais são medicamentos de prescrição médica (ginecologista). O nutricionista não os prescreve; sua atuação é nutricional/metabólica e em conjunto com o médico."
            },
            {
              id: "berberina_nac_sop",
              name: "Considerar Berberina e/ou N-Acetilcisteína (NAC) como adjuvantes para melhorar a sensibilidade à insulina e o perfil metabólico/ovulatório.",
              correct: true,
              critical: false,
              feedback: "Ótimo! Berberina (ativa AMPK, melhora a sensibilidade à insulina) e NAC (antioxidante que melhora parâmetros metabólicos e ovulatórios em estudos) são adjuvantes úteis na SOP com resistência à insulina."
            }
          ]
        },
        discussion: {
          title: "Discussão Clínica e Raciocínio Funcional",
          text: "Camila apresenta SOP no fenótipo metabólico, em que a RESISTÊNCIA À INSULINA é o eixo central. A hiperinsulinemia compensatória age em duas frentes hormonais: estimula diretamente a teca ovariana e as adrenais a produzir andrógenos e reduz a produção hepática de SHBG (globulina ligadora de hormônios sexuais), aumentando a testosterona LIVRE e ativa. Isso explica a tríade hirsutismo + acne + alopecia androgênica, e a anovulação/irregularidade menstrual. Os sinais semiológicos (acantose nigricans, adiposidade central) reforçam a resistência à insulina, confirmada pelo HOMA-IR. A base do tratamento funcional é metabólica: reduzir a carga glicêmica, praticar exercício (força + aeróbico) e melhorar a sensibilidade à insulina — pois reduzir a insulina reduz os andrógenos. O mio-inositol associado ao D-quiro-inositol (proporção ~40:1) é um adjuvante de destaque (atua como segundo mensageiro da insulina), e berberina e NAC ajudam o perfil metabólico/ovulatório. A vitamina D deve ser corrigida. Limites importantes: prescrever andrógenos é contraindicado e perigoso, e anticoncepcionais são conduta médica — o nutricionista atua de forma complementar e ética, dentro de sua competência."
        }
      },
      quiz: [
        {
          question: "Qual é o principal eixo fisiopatológico que conecta a resistência à insulina ao hiperandrogenismo na SOP?",
          options: [
            "A hiperinsulinemia reduz a produção de andrógenos.",
            "A hiperinsulinemia estimula a produção ovariana/adrenal de andrógenos e reduz a SHBG, aumentando a testosterona livre.",
            "A insulina alta aumenta a SHBG e reduz a testosterona livre.",
            "A resistência à insulina não tem relação com os hormônios sexuais."
          ],
          correct: 1,
          explanation: "A hiperinsulinemia estimula a teca ovariana e as adrenais a produzir andrógenos e diminui a síntese hepática de SHBG. Com menos SHBG, sobra mais testosterona livre (ativa), gerando acne, hirsutismo e alopecia androgênica."
        },
        {
          question: "A SHBG (globulina ligadora de hormônios sexuais) está tipicamente BAIXA na SOP com resistência à insulina. Qual a consequência disso?",
          options: [
            "Menor fração de testosterona livre e menos sintomas.",
            "Maior fração de testosterona LIVRE e ativa, intensificando o hiperandrogenismo.",
            "Aumento exclusivo do estrogênio.",
            "Bloqueio completo da ovulação por excesso de SHBG."
          ],
          correct: 1,
          explanation: "A SHBG transporta os hormônios sexuais no sangue. Quando está baixa (reduzida pela hiperinsulinemia), aumenta a fração livre da testosterona, que é a biologicamente ativa, agravando os sintomas androgênicos."
        },
        {
          question: "O mio-inositol é um dos adjuvantes mais estudados na SOP. Qual seu principal mecanismo de ação?",
          options: [
            "Atua como bloqueador dos receptores de estrogênio.",
            "Atua como segundo mensageiro da insulina, melhorando a sensibilidade insulínica e a função ovulatória.",
            "É um hormônio androgênico sintético.",
            "Aumenta diretamente a produção de testosterona."
          ],
          correct: 1,
          explanation: "Os inositóis (mio-inositol e D-quiro-inositol) participam da sinalização pós-receptor da insulina. Melhorando essa sinalização, reduzem a hiperinsulinemia, os andrógenos e favorecem a ovulação, melhorando a regularidade menstrual."
        },
        {
          question: "Mesmo uma perda de peso modesta tem grande impacto na SOP. Qual é a faixa de redução de peso que já melhora significativamente os parâmetros metabólicos e reprodutivos?",
          options: [
            "Apenas perdas acima de 30% do peso corporal.",
            "Cerca de 5% a 10% do peso corporal.",
            "Qualquer perda é irrelevante na SOP.",
            "É necessário atingir o peso ideal teórico para qualquer melhora."
          ],
          correct: 1,
          explanation: "Reduções de 5% a 10% do peso já melhoram a sensibilidade à insulina, reduzem andrógenos e podem restaurar a ovulação na SOP — reforçando que a abordagem metabólica e de estilo de vida é a primeira linha."
        },
        {
          question: "Dentro da ética e das competências profissionais, qual conduta é APROPRIADA para o nutricionista no manejo da SOP da Camila?",
          options: [
            "Prescrever anticoncepcional oral para regular o ciclo.",
            "Prescrever testosterona para melhorar a composição corporal.",
            "Conduzir a terapia nutricional e os adjuvantes (dieta de baixa carga glicêmica, inositóis, correção de vitamina D) em conjunto com o acompanhamento médico.",
            "Suspender qualquer medicação prescrita pelo ginecologista."
          ],
          correct: 2,
          explanation: "O nutricionista atua na terapia nutricional, no estilo de vida e em adjuvantes dentro de sua competência (ex.: inositóis, ajuste da carga glicêmica, correção de carências), de forma complementar e integrada ao médico — sem prescrever fármacos hormonais nem alterar prescrições médicas."
        }
      ]
    },

    // ============================================================
    // TERAPIA NUTRICIONAL ENTERAL — CASOS CRÍTICOS (HOSPITALAR)
    // Conteúdo baseado nas planilhas de fórmulas da instituição.
    // REVISAR com a Dra. Ana antes do uso oficial.
    // ============================================================
    {
      id: 13,
      title: "Módulo 13: Terapia Nutricional na Doença Renal Crônica",
      subtitle: "DRC em Hemodiálise — quando as taxas renais mudam, a fórmula muda",
      enteral: true,
      case: {
        patient: {
          name: "Sr. João Ribeiro",
          age: 68,
          occupation: "Aposentado",
          avatar: "👴",
          complaint: "Internado em uso de sonda nasoenteral (SNE). Doença renal crônica (DRC) estágio 5 em hemodiálise 3x/semana. Vinha recebendo fórmula hipoproteica e evoluiu com perda de massa muscular, fraqueza e inchaço."
        },
        anamnese: "DRC dialítica há 1 ano. Por engano, recebia uma dieta enteral HIPOPROTEICA (conduta de DRC conservador, não-dialítico). Apresenta anorexia, sarcopenia progressiva e baixa ingestão. Faz hemodiálise 3x/semana, 4h por sessão.",
        semiologia: "Sarcopenia evidente (perda de massa em região temporal e tênar), edema de membros inferiores, mucosas hipocoradas. Sinais de desnutrição proteico-energética associada à diálise.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "ureia_eletro_drc",
              name: "Ureia, Creatinina, Potássio e Fósforo",
              price: "low",
              needed: true,
              result: "Ureia pré-HD: 180 mg/dL | Potássio: 5,8 mEq/L (elevado) | Fósforo: 6,2 mg/dL (elevado). Quadro dialítico com hipercalemia e hiperfosfatemia.",
              feedback: "Essencial! Na DRC dialítica o cuidado é com POTÁSSIO, FÓSFORO, SÓDIO e VOLUME — e não com restrição proteica (que é do DRC conservador)."
            },
            {
              id: "albumina_drc",
              name: "Albumina e Proteínas Totais",
              price: "low",
              needed: true,
              result: "Albumina: 2,8 g/dL (baixa). Marcador de desnutrição/inflamação e de oferta proteica insuficiente.",
              feedback: "Correto! A hipoalbuminemia aqui reflete oferta proteica inadequada + perdas dialíticas, confirmando que a fórmula hipoproteica está prejudicando o paciente."
            },
            {
              id: "oferta_proteica_drc",
              name: "Recordatório da TNE atual (oferta calórico-proteica)",
              price: "medium",
              needed: true,
              result: "Recebendo ~0,8 g de proteína/kg/dia e ~20 kcal/kg/dia. Muito abaixo do necessário para um paciente em hemodiálise.",
              feedback: "Exato! Paciente em diálise precisa de 1,2 a 1,4 g de proteína/kg/dia. A oferta atual está catabolizando a massa magra."
            },
            {
              id: "amilase_drc",
              name: "Amilase Sérica",
              price: "high",
              needed: false,
              result: "Amilase: 70 U/L (normal).",
              feedback: "Inadequado. Não há suspeita de pancreatite; exame desnecessário."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "trocar_proteica_drc",
              name: "Trocar para fórmula com OFERTA PROTEICA ADEQUADA à diálise (1,2–1,4 g/kg/dia), mantendo controle de potássio, fósforo, sódio e volume.",
              correct: true,
              critical: false,
              feedback: "Perfeito! Ao entrar em diálise, a necessidade proteica AUMENTA. A fórmula renal hipoproteica (tipo conservador) deve ser substituída por uma com proteína adequada."
            },
            {
              id: "densidade_drc",
              name: "Usar fórmula com alta densidade calórica (1,5–2,0 kcal/ml) para atingir as calorias com MENOR volume (restrição hídrica do dialítico).",
              correct: true,
              critical: false,
              feedback: "Ótimo! A restrição de volume exige fórmulas calóricas densas, oferecendo energia sem excesso de líquido."
            },
            {
              id: "monitorar_kp_drc",
              name: "Monitorar potássio e fósforo, restringir fósforo e ajustar volume conforme as sessões de hemodiálise (em conjunto com a equipe médica).",
              correct: true,
              critical: false,
              feedback: "Correto! O controle eletrolítico (K, P, Na) e de volume é o foco da DRC dialítica, integrado ao nefrologista."
            },
            {
              id: "manter_hipoproteico_drc",
              name: "Manter (ou reduzir ainda mais) a proteína com a fórmula hipoproteica 'para proteger o rim'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Restrição proteica é conduta do DRC CONSERVADOR (não-dialítico). Em diálise, restringir proteína agrava a desnutrição e a sarcopenia."
            },
            {
              id: "liberar_kp_drc",
              name: "Liberar livremente frutas, sucos e alimentos ricos em potássio e fósforo para 'melhorar a nutrição'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Hipercalemia pode causar arritmias fatais. Potássio e fósforo devem ser controlados na DRC dialítica."
            }
          ]
        },
        discussion: {
          title: "Discussão — DRC Conservador x Dialítico",
          text: "O ponto-chave é que a conduta nutricional muda conforme o estágio e a terapia renal. No DRC CONSERVADOR (não-dialítico), restringe-se proteína (~0,6–0,8 g/kg/dia) para reduzir a produção de escórias nitrogenadas (ureia) e poupar o rim — fórmulas hipoproteicas como a Nutri Renal são indicadas. Já no paciente EM DIÁLISE, a necessidade proteica AUMENTA (1,2–1,4 g/kg/dia) por causa das perdas de aminoácidos no dialisato e do estado catabólico; manter a fórmula hipoproteica leva à desnutrição e hipoalbuminemia, como no Sr. João. Em ambos os casos controlam-se potássio, fósforo, sódio e volume, e usam-se fórmulas calóricas densas pela restrição hídrica. Resumindo: quando as taxas renais e a terapia mudam (entrada em diálise), a fórmula muda."
        }
      },
      quiz: [
        {
          question: "Qual a necessidade proteica de um paciente com DRC em hemodiálise?",
          options: [
            "Reduzida (0,6 g/kg/dia), para poupar o rim.",
            "Aumentada (1,2 a 1,4 g/kg/dia), pelas perdas dialíticas e catabolismo.",
            "Igual à de um adulto saudável (0,8 g/kg/dia).",
            "Proteína deve ser zerada durante a diálise."
          ],
          correct: 1,
          explanation: "Na hemodiálise há perda de aminoácidos no dialisato e estado catabólico, elevando a necessidade proteica para 1,2–1,4 g/kg/dia."
        },
        {
          question: "A restrição proteica com fórmula hipoproteica (ex.: Nutri Renal) é indicada em qual situação?",
          options: [
            "No paciente em hemodiálise.",
            "No DRC conservador (não-dialítico), para reduzir a ureia.",
            "Em qualquer paciente renal, sempre.",
            "Na insuficiência renal aguda em diálise contínua."
          ],
          correct: 1,
          explanation: "A restrição proteica visa reduzir escórias nitrogenadas no DRC CONSERVADOR (sem diálise). Em diálise, a conduta se inverte."
        },
        {
          question: "Por que se prefere uma fórmula com alta densidade calórica (1,5–2 kcal/ml) na DRC dialítica?",
          options: [
            "Para aumentar a oferta de potássio.",
            "Para atingir as calorias com MENOR volume, respeitando a restrição hídrica.",
            "Porque são mais baratas.",
            "Para reduzir a oferta de proteína."
          ],
          correct: 1,
          explanation: "O paciente dialítico tem restrição de volume; fórmulas calóricas densas entregam energia com menos líquido."
        },
        {
          question: "Qual o principal risco eletrolítico a ser monitorado nesse paciente?",
          options: [
            "Hipocalcemia isolada.",
            "Hipercalemia (potássio alto), que pode causar arritmias graves.",
            "Hipernatremia por excesso de proteína.",
            "Hipoglicemia."
          ],
          correct: 1,
          explanation: "A hipercalemia é uma emergência na DRC; potássio e fósforo devem ser rigorosamente controlados."
        }
      ]
    },

    {
      id: 14,
      title: "Módulo 14: Terapia Nutricional em Oncologia",
      subtitle: "Caquexia Neoplásica e Imunonutrição no paciente com câncer",
      enteral: true,
      case: {
        patient: {
          name: "Dona Marta Nogueira",
          age: 59,
          occupation: "Costureira",
          avatar: "👩‍🦲",
          complaint: "Câncer de cabeça e pescoço em radioterapia. Mucosite intensa, dor e dificuldade para engolir (disfagia), com perda de 12% do peso corporal em 2 meses e fraqueza importante."
        },
        anamnese: "Tratamento oncológico ativo. Ingestão oral abaixo de 50% das necessidades por mucosite (grau 3) e disfagia. Caquexia neoplásica com hipermetabolismo e inflamação sistêmica. Provável necessidade de via enteral e, se evoluir, cirurgia.",
        semiologia: "IMC: 17 kg/m² (magreza), sarcopenia, mucosa oral ulcerada e dolorosa, perda ponderal involuntária acentuada. Sinais clássicos de desnutrição associada ao câncer.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "perda_ponderal_onco",
              name: "Avaliação nutricional e percentual de perda de peso",
              price: "low",
              needed: true,
              result: "Perda de 12% do peso habitual em 2 meses (perda grave e involuntária). Triagem (ex.: NRS-2002) indica alto risco nutricional.",
              feedback: "Essencial! Perda ponderal involuntária > 5% em 1 mês ou > 10% em 6 meses já caracteriza desnutrição e indica terapia nutricional."
            },
            {
              id: "albumina_pcr_onco",
              name: "Albumina e PCR (estado inflamatório)",
              price: "low",
              needed: true,
              result: "Albumina: 2,9 g/dL (baixa) | PCR: elevada. Padrão inflamatório da caquexia neoplásica.",
              feedback: "Correto! A caquexia do câncer cursa com inflamação sistêmica (TNF-α, IL-6), que perpetua o catabolismo muscular."
            },
            {
              id: "via_disfagia_onco",
              name: "Avaliação da deglutição / risco de aspiração",
              price: "medium",
              needed: true,
              result: "Disfagia importante por mucosite. Ingestão oral insegura/insuficiente — indicação de via enteral (SNE; gastrostomia se prolongada).",
              feedback: "Exato! Com TGI funcionante e via oral insuficiente, a nutrição enteral é a escolha (preferível à parenteral)."
            },
            {
              id: "marcador_tumoral_onco",
              name: "Marcadores tumorais para 'acompanhar o câncer'",
              price: "high",
              needed: false,
              result: "Fora do escopo nutricional e sem impacto na conduta de nutrição.",
              feedback: "Inadequado. Marcadores tumorais são acompanhamento médico/oncológico, não orientam a terapia nutricional."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "hipercalorica_onco",
              name: "Iniciar TNE com fórmula HIPERCALÓRICA e HIPERPROTEICA (densa), por sonda, devido à mucosite e disfagia.",
              correct: true,
              critical: false,
              feedback: "Perfeito! O hipermetabolismo da caquexia exige alta densidade calórica e proteica para frear a perda de massa magra."
            },
            {
              id: "imunonutricao_onco",
              name: "Considerar imunonutrição perioperatória (arginina, ômega-3/EPA e nucleotídeos — ex.: fórmulas tipo Impact) se houver cirurgia oncológica programada.",
              correct: true,
              critical: false,
              feedback: "Ótimo! A imunonutrição no perioperatório de cirurgia oncológica reduz complicações infecciosas e melhora a cicatrização."
            },
            {
              id: "progressao_onco",
              name: "Progredir a dieta gradualmente e monitorar eletrólitos (fósforo, potássio, magnésio) pelo risco de síndrome de realimentação no desnutrido grave.",
              correct: true,
              critical: false,
              feedback: "Correto! O paciente muito desnutrido tem risco de síndrome de realimentação; progressão lenta e reposição de fósforo/tiamina são essenciais."
            },
            {
              id: "jejum_onco",
              name: "Deixar a paciente em jejum (dieta zero) até a mucosite melhorar.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Jejum agrava a desnutrição e a caquexia. Com TGI funcionante, deve-se iniciar via enteral por sonda."
            },
            {
              id: "hipocalorica_onco",
              name: "Prescrever apenas soro glicosado / dieta hipocalórica para 'não sobrecarregar o organismo doente'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Subnutrir o paciente oncológico acelera a perda de massa magra e piora o prognóstico."
            }
          ]
        },
        discussion: {
          title: "Discussão — Caquexia e Imunonutrição",
          text: "A caquexia neoplásica é uma síndrome de desnutrição multifatorial dirigida por inflamação sistêmica (TNF-α, IL-6), hipermetabolismo e anorexia, levando à perda acentuada de massa muscular que NÃO se reverte só com aumento de oferta. A meta é ofertar calorias e proteínas adequadas (fórmulas hipercalóricas/hiperproteicas), preferindo a via enteral quando o TGI está funcionante e a via oral é insuficiente. O EPA (ômega-3) ajuda a modular a inflamação. No perioperatório de cirurgias oncológicas, a imunonutrição (arginina, ômega-3 e nucleotídeos) reduz complicações. Em desnutridos graves, atenção à síndrome de realimentação (queda de fósforo, potássio e magnésio; repor tiamina). Jejum ou hipoalimentação são condutas erradas."
        }
      },
      quiz: [
        {
          question: "A caquexia neoplásica é caracterizada principalmente por:",
          options: [
            "Apenas redução da ingestão alimentar, sem inflamação.",
            "Inflamação sistêmica + hipermetabolismo + perda de massa magra que não se reverte só com mais comida.",
            "Ganho de peso por retenção hídrica.",
            "Deficiência isolada de vitamina C."
          ],
          correct: 1,
          explanation: "A caquexia combina inflamação (TNF-α, IL-6), hipermetabolismo e anorexia, com catabolismo muscular resistente à oferta isolada."
        },
        {
          question: "Quais nutrientes caracterizam uma fórmula de IMUNONUTRIÇÃO perioperatória?",
          options: [
            "Apenas maltodextrina e sacarose.",
            "Arginina, ômega-3 (EPA) e nucleotídeos.",
            "Somente fibras insolúveis.",
            "Cafeína e taurina."
          ],
          correct: 1,
          explanation: "A imunonutrição combina arginina, ômega-3 e nucleotídeos, reduzindo complicações infecciosas no perioperatório oncológico."
        },
        {
          question: "Com o TGI funcionante e via oral insuficiente, a via de escolha é:",
          options: [
            "Nutrição parenteral total imediatamente.",
            "Nutrição enteral (por sonda).",
            "Apenas suplemento oral, mesmo com disfagia grave.",
            "Jejum até melhora espontânea."
          ],
          correct: 1,
          explanation: "‘Se o intestino funciona, use-o’: a via enteral é preferível à parenteral quando o TGI está íntegro."
        },
        {
          question: "No paciente muito desnutrido, ao reiniciar a nutrição, qual o principal risco a vigiar?",
          options: [
            "Síndrome de realimentação (queda de fósforo, potássio e magnésio).",
            "Hipertensão arterial por excesso de fibras.",
            "Hipervitaminose A imediata.",
            "Alcalose por jejum."
          ],
          correct: 0,
          explanation: "A reintrodução calórica em desnutridos graves causa queda de fósforo/potássio/magnésio; progredir devagar e repor tiamina."
        }
      ]
    },

    {
      id: 15,
      title: "Módulo 15: Terapia Nutricional no Paciente Crítico",
      subtitle: "Trauma, Traqueostomia e Ventilação Mecânica na UTI",
      enteral: true,
      case: {
        patient: {
          name: "Sr. Antônio Farias",
          age: 45,
          occupation: "Motorista",
          avatar: "🤕",
          complaint: "Vítima de politrauma com traumatismo cranioencefálico (TCE). Internado na UTI, sedado, em ventilação mecânica e traqueostomizado, com sonda nasoenteral. Estado hipermetabólico (resposta catabólica ao trauma)."
        },
        anamnese: "5º dia de UTI após acidente automobilístico. Hemodinamicamente estabilizando, em ventilação mecânica via traqueostomia. Grande estresse metabólico e catabolismo proteico acentuado, típico do trauma.",
        semiologia: "Paciente sedado, traqueostomizado, em ventilação mecânica. Sinais de catabolismo (balanço nitrogenado negativo). Risco elevado de broncoaspiração e de pneumonia associada à ventilação.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "timing_critico",
              name: "Avaliar o momento de início da TNE (precoce x tardio)",
              price: "low",
              needed: true,
              result: "Paciente crítico hemodinamicamente estável: indicação de nutrição enteral PRECOCE (primeiras 24–48h).",
              feedback: "Correto! A TNE precoce (24–48h) no crítico estável reduz complicações infecciosas e preserva a barreira intestinal."
            },
            {
              id: "necessidades_critico",
              name: "Estimar necessidades calórico-proteicas do crítico",
              price: "low",
              needed: true,
              result: "Meta: ~25–30 kcal/kg/dia e proteína ALTA (1,5–2,0 g/kg/dia) pela resposta catabólica ao trauma.",
              feedback: "Exato! O trauma eleva muito a demanda proteica; a oferta proteica adequada é determinante no paciente crítico."
            },
            {
              id: "aspiracao_critico",
              name: "Avaliar risco de broncoaspiração e posicionamento",
              price: "medium",
              needed: true,
              result: "Com traqueostomia e ventilação, há risco de aspiração: indicar cabeceira elevada a 30–45° e monitorar tolerância.",
              feedback: "Perfeito! Cabeceira elevada 30–45° é medida-chave para prevenir broncoaspiração e pneumonia."
            },
            {
              id: "lipase_critico",
              name: "Lipase para 'rastrear pancreatite' sem indicação clínica",
              price: "high",
              needed: false,
              result: "Sem dor abdominal ou suspeita clínica; exame desnecessário.",
              feedback: "Inadequado. Não há suspeita de pancreatite que justifique o exame."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "precoce_critico",
              name: "Iniciar TNE PRECOCE por sonda nasoenteral com fórmula HIPERCALÓRICA/HIPERPROTEICA (paciente grave/trauma), com progressão conforme tolerância.",
              correct: true,
              critical: false,
              feedback: "Perfeito! A nutrição enteral precoce no crítico estável, com fórmula adequada ao trauma, é o padrão-ouro."
            },
            {
              id: "cabeceira_critico",
              name: "Manter cabeceira elevada a 30–45° e monitorar tolerância para reduzir broncoaspiração.",
              correct: true,
              critical: false,
              feedback: "Ótimo! Essencial com traqueostomia/ventilação para prevenir pneumonia aspirativa."
            },
            {
              id: "proteina_critico",
              name: "Ofertar proteína alta (1,5–2,0 g/kg/dia) e progredir as calorias evitando hiperalimentação.",
              correct: true,
              critical: false,
              feedback: "Correto! Alta proteína atende ao catabolismo do trauma; progressão calórica gradual evita complicações."
            },
            {
              id: "jejum_critico",
              name: "Aguardar o paciente 'acordar' e ser extubado para só então iniciar a nutrição (jejum prolongado).",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Jejum prolongado no paciente crítico aumenta complicações infecciosas e atrofia a mucosa intestinal. A TNE deve ser precoce."
            },
            {
              id: "hipocalorica_critico",
              name: "Prescrever fórmula hipocalórica padrão, sem ajuste proteico, 'para não sobrecarregar'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Subnutrir o paciente de trauma agrava o catabolismo e atrasa a recuperação."
            }
          ]
        },
        discussion: {
          title: "Discussão — Nutrição no Paciente Crítico",
          text: "No paciente crítico/trauma hemodinamicamente estável, a nutrição enteral PRECOCE (24–48h) é recomendada: preserva a integridade e a função da barreira intestinal, modula a resposta imune e reduz complicações infecciosas. A resposta catabólica ao trauma eleva muito a necessidade proteica (1,5–2,0 g/kg/dia), com calorias em torno de 25–30 kcal/kg/dia e progressão gradual para evitar hiperalimentação e síndrome de realimentação. Com traqueostomia e ventilação mecânica, a cabeceira elevada a 30–45° e o monitoramento de tolerância são fundamentais para prevenir broncoaspiração e pneumonia. Fórmulas hipercalóricas/hiperproteicas para paciente grave (ex.: tipo Protison/HP Energy) são adequadas. A via enteral é preferível à parenteral sempre que o TGI estiver funcionante."
        }
      },
      quiz: [
        {
          question: "Quando deve ser iniciada a nutrição enteral no paciente crítico hemodinamicamente estável?",
          options: [
            "Apenas após a extubação.",
            "Precocemente, nas primeiras 24–48 horas.",
            "Somente após 7 dias de jejum.",
            "Nunca; usar sempre parenteral."
          ],
          correct: 1,
          explanation: "A TNE precoce (24–48h) no crítico estável reduz infecções e preserva a barreira intestinal."
        },
        {
          question: "Qual a meta proteica típica no paciente de trauma/crítico?",
          options: [
            "0,6 g/kg/dia.",
            "0,8 g/kg/dia.",
            "1,5 a 2,0 g/kg/dia.",
            "Proteína deve ser evitada."
          ],
          correct: 2,
          explanation: "A resposta catabólica ao trauma eleva a demanda proteica para 1,5–2,0 g/kg/dia."
        },
        {
          question: "Que medida reduz a broncoaspiração no paciente traqueostomizado/ventilado em TNE?",
          options: [
            "Manter o paciente deitado totalmente na horizontal.",
            "Cabeceira elevada a 30–45°.",
            "Aumentar ao máximo a velocidade de infusão.",
            "Suspender a nutrição todas as noites."
          ],
          correct: 1,
          explanation: "A cabeceira elevada 30–45° é medida-chave contra aspiração e pneumonia associada à ventilação."
        },
        {
          question: "Com o TGI funcionante, a via preferencial de nutrição no crítico é:",
          options: [
            "Parenteral total sempre.",
            "Enteral (por sonda).",
            "Apenas hidratação venosa.",
            "Oral, mesmo sedado e intubado."
          ],
          correct: 1,
          explanation: "‘Se o intestino funciona, use-o’: a enteral é preferível à parenteral quando possível."
        }
      ]
    },

    {
      id: 16,
      title: "Módulo 16: Disfagia Neurológica e Vias de Acesso",
      subtitle: "AVC, Gastrostomia (GTT) e Nutrição Enteral Domiciliar",
      enteral: true,
      case: {
        patient: {
          name: "Dona Cecília Lopes",
          age: 74,
          occupation: "Aposentada",
          avatar: "👵",
          complaint: "Sequela de AVC (acidente vascular cerebral) isquêmico há 2 meses, com disfagia grave e episódios de engasgo/broncoaspiração. Em uso de gastrostomia (GTT) para nutrição enteral domiciliar, com quadros de constipação."
        },
        anamnese: "AVC isquêmico com disfagia confirmada por videofluoroscopia. Por necessidade de via enteral PROLONGADA (acima de 4–6 semanas), foi indicada gastrostomia (GTT) em vez de sonda nasoenteral. Clinicamente estável, em acompanhamento domiciliar. Relata fezes ressecadas e baixa oferta de água.",
        semiologia: "Hemiparesia à direita, GTT funcionante e bem cuidada, sinais de constipação (distensão leve, fezes endurecidas) e hidratação limítrofe.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "via_tempo_gtt",
              name: "Avaliar a indicação da via (tempo previsto de TNE)",
              price: "low",
              needed: true,
              result: "Necessidade de TNE prolongada (> 4–6 semanas) por disfagia persistente: indicação correta de GTT (e não SNE, que é para curto prazo).",
              feedback: "Correto! SNE é para curto prazo; ostomias (GTT) são indicadas quando a TNE será prolongada."
            },
            {
              id: "fibras_hidratacao_gtt",
              name: "Avaliar fibras e oferta de água livre (constipação)",
              price: "low",
              needed: true,
              result: "Fórmula atual SEM fibras e baixa oferta de água livre — causa provável da constipação.",
              feedback: "Exato! Fibras e água livre são essenciais para regular o intestino na TNE prolongada."
            },
            {
              id: "glicemia_gtt",
              name: "Glicemia / histórico de diabetes",
              price: "low",
              needed: true,
              result: "Glicemia de jejum: 150 mg/dL — paciente diabética. Pode se beneficiar de fórmula especializada para controle glicêmico.",
              feedback: "Boa! Em diabéticos, fórmulas específicas (baixo índice glicêmico, ex.: tipo Diason) ajudam no controle."
            },
            {
              id: "endoscopia_gtt",
              name: "Endoscopia digestiva alta de rotina, sem indicação",
              price: "high",
              needed: false,
              result: "Sem queixa que justifique; exame desnecessário no momento.",
              feedback: "Inadequado. Procedimento invasivo sem indicação clínica atual."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "polimerica_fibras_gtt",
              name: "Fórmula POLIMÉRICA PADRÃO com FIBRAS (regula o intestino) e oferta de ÁGUA LIVRE (flushes) pela GTT.",
              correct: true,
              critical: false,
              feedback: "Perfeito! Com TGI íntegro, a polimérica padrão é adequada; fibras + água livre resolvem a constipação."
            },
            {
              id: "lavagem_gtt",
              name: "Lavar a sonda com água antes e depois da dieta e das medicações, administrando os medicamentos corretamente (diluídos) para evitar obstrução.",
              correct: true,
              critical: false,
              feedback: "Ótimo! A lavagem regular previne a obstrução da GTT, complicação comum."
            },
            {
              id: "diason_gtt",
              name: "Por ser diabética, considerar fórmula especializada para controle glicêmico (baixo índice glicêmico).",
              correct: true,
              critical: false,
              feedback: "Correto! Fórmulas específicas para diabetes melhoram o controle glicêmico na TNE."
            },
            {
              id: "oral_gtt",
              name: "Retornar à dieta por via oral plena imediatamente, ignorando a disfagia, 'para estimular a paciente'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Com disfagia grave e risco de broncoaspiração, a via oral plena pode causar pneumonia aspirativa. Manter a via enteral segura."
            },
            {
              id: "triturar_gtt",
              name: "Triturar quaisquer comprimidos e administrar pela GTT sem diluir nem lavar a sonda.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Medicações administradas de forma inadequada obstruem a sonda e podem inativar fármacos. Diluir e lavar sempre."
            }
          ]
        },
        discussion: {
          title: "Discussão — Vias de Acesso e TNE Prolongada",
          text: "A escolha da via depende do tempo previsto de terapia: a sonda nasoenteral (SNE) é indicada para CURTO prazo (em geral até 4–6 semanas), enquanto as ostomias — gastrostomia (GTT) ou jejunostomia — são preferidas para uso PROLONGADO, como na disfagia neurológica pós-AVC. Com o TGI íntegro, usa-se fórmula polimérica padrão; a adição de FIBRAS e a oferta de ÁGUA LIVRE (flushes) previnem a constipação, muito comum na TNE. A lavagem da sonda antes/depois da dieta e das medicações (sempre diluídas) evita obstrução. Em diabéticos, fórmulas especializadas auxiliam o controle glicêmico. Enquanto a disfagia e o risco de broncoaspiração persistirem, a via enteral deve ser mantida — o retorno à via oral exige reavaliação fonoaudiológica da deglutição."
        }
      },
      quiz: [
        {
          question: "Quando se prefere uma gastrostomia (GTT) à sonda nasoenteral (SNE)?",
          options: [
            "Sempre, em qualquer paciente.",
            "Quando a nutrição enteral será PROLONGADA (acima de 4–6 semanas).",
            "Apenas por 2 ou 3 dias de nutrição.",
            "Somente em pacientes pediátricos."
          ],
          correct: 1,
          explanation: "SNE é para curto prazo; a GTT é indicada para TNE prolongada, como na disfagia pós-AVC."
        },
        {
          question: "Qual conduta ajuda a prevenir a constipação na nutrição enteral?",
          options: [
            "Reduzir a água e usar fórmula sem fibras.",
            "Usar fórmula com fibras e ofertar água livre (flushes).",
            "Aumentar a velocidade de infusão ao máximo.",
            "Suspender a dieta a cada constipação."
          ],
          correct: 1,
          explanation: "Fibras e água livre regulam o trânsito intestinal e previnem a constipação na TNE."
        },
        {
          question: "Como evitar a obstrução da sonda/GTT ao administrar medicações?",
          options: [
            "Administrar comprimidos inteiros sem triturar.",
            "Diluir adequadamente e lavar a sonda com água antes e depois.",
            "Misturar todos os medicamentos com a fórmula.",
            "Nunca lavar a sonda para economizar água."
          ],
          correct: 1,
          explanation: "Diluir as medicações e lavar a sonda antes/depois previne a obstrução."
        },
        {
          question: "Diante de disfagia grave com risco de broncoaspiração, o retorno à via oral plena:",
          options: [
            "Deve ser imediato para estimular o paciente.",
            "Só após reavaliação da deglutição; mantém-se a via enteral segura enquanto houver risco.",
            "Nunca é possível.",
            "Depende apenas da vontade do paciente."
          ],
          correct: 1,
          explanation: "A via oral plena com disfagia pode causar pneumonia aspirativa; mantém-se a enteral até reavaliação fonoaudiológica."
        }
      ]
    },

    {
      id: 17,
      title: "Módulo 17: Complicações da Nutrição Enteral",
      subtitle: "Diarreia em paciente com SNE — investigar antes de suspender",
      enteral: true,
      case: {
        patient: {
          name: "Sr. Pedro Tavares",
          age: 60,
          occupation: "Comerciante",
          avatar: "🧔",
          complaint: "Internado em terapia nutricional por sonda nasoenteral (SNE) há 5 dias. Evoluiu com diarreia (6 a 8 evacuações líquidas por dia) após o aumento do volume da dieta e o início de um antibiótico de amplo espectro."
        },
        anamnese: "Recebe TNE por SNE. A dieta foi progredida rapidamente. Está em uso de antibiótico de amplo espectro e recebe várias medicações líquidas pela sonda (algumas contendo sorbitol). Sem fibras na fórmula atual.",
        semiologia: "Distensão abdominal leve, fezes líquidas frequentes, sem febre alta. Em risco de desidratação e de desnutrição se a oferta for interrompida.",
        investigation: {
          limit: 3,
          options: [
            {
              id: "causas_diarreia",
              name: "Revisar causas: velocidade/osmolaridade da dieta e medicações",
              price: "low",
              needed: true,
              result: "Infusão progredida rápido + medicações com SORBITOL pela sonda + antibiótico de amplo espectro. Múltiplas causas potenciais de diarreia.",
              feedback: "Excelente! A diarreia na TNE é quase sempre MULTIFATORIAL — velocidade/osmolaridade, medicações (sorbitol), antibióticos e contaminação."
            },
            {
              id: "cdiff_diarreia",
              name: "Pesquisa de toxina de Clostridioides difficile / coprocultura",
              price: "medium",
              needed: true,
              result: "Paciente em antibiótico: necessário descartar diarreia infecciosa (C. difficile) antes de atribuir tudo à dieta.",
              feedback: "Correto! Em uso de antibiótico, é essencial descartar C. difficile — não assumir que a causa é apenas a fórmula."
            },
            {
              id: "fibras_diarreia",
              name: "Avaliar o tipo de fórmula (presença de fibras / peptídeos)",
              price: "low",
              needed: true,
              result: "Fórmula atual SEM fibras e polimérica. Considerar fibra solúvel e/ou fórmula peptídica (oligomérica) se houver má absorção.",
              feedback: "Boa! Fibras solúveis e fórmulas oligoméricas (peptídeos/TCM) ajudam em diarreia por intolerância/má absorção."
            },
            {
              id: "amilase_diarreia",
              name: "Amilase sérica de rotina",
              price: "high",
              needed: false,
              result: "Amilase normal; sem suspeita de pancreatite.",
              feedback: "Inadequado. Não contribui para a investigação da diarreia neste contexto."
            }
          ]
        },
        prescription: {
          options: [
            {
              id: "reduzir_velocidade",
              name: "NÃO suspender a TNE de imediato: reduzir a VELOCIDADE de infusão e reavaliar a tolerância.",
              correct: true,
              critical: false,
              feedback: "Perfeito! Reduzir a velocidade é a primeira medida; suspender a nutrição como reflexo agrava a desnutrição."
            },
            {
              id: "corrigir_causas",
              name: "Corrigir causas: revisar medicações com sorbitol, reavaliar o antibiótico com a equipe médica, descartar C. difficile e checar a higiene/contaminação da dieta.",
              correct: true,
              critical: false,
              feedback: "Ótimo! Tratar a causa é o cerne da conduta — medicações, infecção e contaminação são culpados frequentes."
            },
            {
              id: "trocar_formula_diarreia",
              name: "Trocar para fórmula com FIBRAS (solúvel) e/ou PEPTÍDICA/OLIGOMÉRICA (ex.: Peptamen) se houver má absorção/intolerância.",
              correct: true,
              critical: false,
              feedback: "Correto! Fórmulas oligoméricas (peptídeos, TCM) e com fibras melhoram a tolerância na má absorção."
            },
            {
              id: "jejum_diarreia",
              name: "Suspender a nutrição e deixar o paciente em jejum como PRIMEIRA conduta.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! A diarreia raramente é causada só pela dieta. Suspender de imediato agrava a desnutrição; primeiro reduz-se a velocidade e investiga-se a causa."
            },
            {
              id: "aumentar_diarreia",
              name: "Aumentar a velocidade e a osmolaridade da dieta para 'compensar as perdas'.",
              correct: false,
              critical: true,
              feedback: "ERRO CRÍTICO! Aumentar velocidade/osmolaridade PIORA a diarreia osmótica e a desidratação."
            }
          ]
        },
        discussion: {
          title: "Discussão — Diarreia na Terapia Nutricional Enteral",
          text: "A diarreia é a complicação gastrointestinal mais comum da TNE e quase sempre é MULTIFATORIAL: velocidade/osmolaridade de infusão excessivas, medicações (especialmente as que contêm SORBITOL e os antibióticos, que predispõem ao Clostridioides difficile), contaminação da dieta, ausência de fibras e quadros de má absorção. A conduta correta NÃO é suspender a nutrição de imediato — isso agrava a desnutrição. Primeiro: reduzir a velocidade de infusão, investigar e corrigir as causas (rever medicações e antibiótico com a equipe, descartar C. difficile, cuidar da higiene), e ajustar a fórmula — fibras solúveis e/ou fórmulas peptídicas/oligoméricas (com peptídeos e TCM, ex.: Peptamen) são úteis na má absorção e intolerância. Reidratar e corrigir eletrólitos. Suspender a dieta só após excluir as causas tratáveis."
        }
      },
      quiz: [
        {
          question: "A diarreia em paciente com nutrição enteral é, na maioria das vezes:",
          options: [
            "Causada exclusivamente pela fórmula da dieta.",
            "Multifatorial (velocidade/osmolaridade, medicações, antibióticos, contaminação, má absorção).",
            "Sempre infecciosa por vírus.",
            "Um sinal de que a dieta está adequada."
          ],
          correct: 1,
          explanation: "A diarreia na TNE costuma ter múltiplas causas; é preciso investigá-las antes de culpar a fórmula."
        },
        {
          question: "Qual deve ser a PRIMEIRA conduta diante de diarreia na TNE?",
          options: [
            "Suspender a nutrição e deixar em jejum.",
            "Reduzir a velocidade de infusão e investigar/corrigir as causas.",
            "Aumentar a osmolaridade da dieta.",
            "Trocar a sonda imediatamente."
          ],
          correct: 1,
          explanation: "Reduzir a velocidade e tratar a causa preserva a nutrição; o jejum reflexo agrava a desnutrição."
        },
        {
          question: "Em paciente usando antibiótico de amplo espectro com diarreia, deve-se descartar:",
          options: [
            "Apenas intolerância à lactose.",
            "Infecção por Clostridioides difficile.",
            "Deficiência de vitamina D.",
            "Excesso de fibras."
          ],
          correct: 1,
          explanation: "Antibióticos predispõem à colite por C. difficile; é essencial descartá-la antes de atribuir a diarreia à dieta."
        },
        {
          question: "Qual tipo de fórmula pode ser indicado na diarreia por má absorção/intolerância?",
          options: [
            "Fórmula hiperosmolar sem fibras.",
            "Fórmula peptídica/oligomérica (peptídeos e TCM) e/ou com fibras solúveis.",
            "Apenas soro glicosado.",
            "Fórmula com alto teor de sacarose."
          ],
          correct: 1,
          explanation: "Fórmulas oligoméricas (peptídeos, TCM) e com fibras solúveis melhoram a tolerância na má absorção."
        }
      ]
    }
  ],

  // ============================================================
  // CÓDEX DE REFERÊNCIA — material de consulta rápida para estudo
  // ============================================================
  codex: {
    fitoterapicos: [
      { nome: "Mulungu (Erythrina mulungu)", classe: "Ansiolítico / Sedativo", mecanismo: "Ação calmante via modulação GABAérgica; reduz ansiedade e melhora o sono.", uso: "Insônia, ansiedade, fadiga adrenal.", alerta: "Evitar associação com depressores do SNC.", modulo: 1 },
      { nome: "Passiflora (Passiflora incarnata)", classe: "Ansiolítico / Sedativo", mecanismo: "Flavonoides modulam positivamente os receptores GABA-A, potencializando a inibição sináptica.", uso: "Ansiedade, insônia.", alerta: "Pode potencializar sedativos; cuidado ao dirigir.", modulo: 1 },
      { nome: "Espinheira Santa (Maytenus ilicifolia)", classe: "Digestivo / Protetor de mucosa", mecanismo: "Ação carminativa e protetora da mucosa gástrica; alivia dispepsia.", uso: "Dispepsia, desconforto gástrico.", alerta: "Evitar na gestação.", modulo: 2 },
      { nome: "Melissa / Cidreira (Melissa officinalis)", classe: "Ansiolítico / Antiespasmódico", mecanismo: "Ácido rosmarínico inibe a GABA-transaminase, elevando GABA; reduz ansiedade e espasmos digestivos.", uso: "Ansiedade tensional, cólicas/espasmos digestivos.", alerta: "Doses altas podem interferir na função tireoidiana.", modulo: 3 },
      { nome: "Hortelã-Pimenta (Mentha piperita)", classe: "Antiespasmódico digestivo", mecanismo: "Mentol bloqueia canais de cálcio da musculatura lisa intestinal, relaxando o trato GI.", uso: "Cólicas, gases, síndrome do intestino irritável (cápsulas gastrorresistentes).", alerta: "Pode piorar refluxo (relaxa o esfíncter esofágico).", modulo: 3 },
      { nome: "Kava-Kava (Piper methysticum)", classe: "⚠️ Restrito no Brasil", mecanismo: "Ansiolítico potente, porém com relatos de hepatotoxicidade aguda grave.", uso: "Comercialização/prescrição suspensa/restrita pela Anvisa.", alerta: "CONTRAINDICADO — risco hepático. Não prescrever.", modulo: 3 },
      { nome: "Hipérico / Erva de São João (Hypericum perforatum)", classe: "Antidepressivo leve", mecanismo: "Inibe recaptação de monoaminas; potente INDUTOR do CYP3A4 e da glicoproteína-P.", uso: "Depressão leve a moderada.", alerta: "⚠️ Muitas interações: reduz eficácia de anticoncepcionais, anticoagulantes, imunossupressores e antidepressivos.", modulo: 3 },
      { nome: "Cardo Mariano / Silimarina (Silybum marianum)", classe: "Hepatoprotetor", mecanismo: "Estimula a RNA polimerase nos hepatócitos (regeneração); antioxidante e estabilizador de membrana.", uso: "Esteatose hepática, proteção hepática, transaminases elevadas.", alerta: "Geralmente bem tolerado.", modulo: 4 },
      { nome: "Berberina", classe: "Metabólico / Antimicrobiano", mecanismo: "Ativa a AMPK (mimetiza exercício), melhora sensibilidade à insulina e captação de glicose (GLUT-4); ação antimicrobiana.", uso: "Resistência à insulina, síndrome metabólica, SIBO, SOP.", alerta: "Pode interagir com fármacos (CYP); evitar na gestação/lactação.", modulo: 6 },
      { nome: "Óleo de Orégano (carvacrol)", classe: "Antimicrobiano herbal", mecanismo: "Carvacrol e timol com ação antibacteriana/antifúngica.", uso: "Adjuvante no manejo do SIBO/disbiose (em ciclo orientado).", alerta: "Uso por tempo definido; pode irritar mucosas.", modulo: 9 },
      { nome: "Gengibre (Zingiber officinale)", classe: "Procinético / Anti-inflamatório", mecanismo: "Estimula a motilidade gástrica e o Complexo Motor Migratório; ação anti-inflamatória e antiemética.", uso: "Apoio à motilidade no SIBO, náuseas, digestão lenta.", alerta: "Cautela com anticoagulantes em altas doses.", modulo: 9 },
      { nome: "Cúrcuma / Curcumina (Curcuma longa)", classe: "Anti-inflamatório", mecanismo: "Inibe a via NF-kB e citocinas inflamatórias (IL-6, TNF-α); antioxidante.", uso: "Inflamação subclínica, síndrome metabólica.", alerta: "Baixa biodisponibilidade — associar piperina/lipídios.", modulo: 8 },
      { nome: "Sene (Senna alexandrina)", classe: "⚠️ Laxante antraquinônico", mecanismo: "Estimula a motilidade do cólon por irritação do plexo mioentérico.", uso: "Constipação aguda pontual — NUNCA uso contínuo.", alerta: "Uso crônico causa dependência intestinal e espoliação eletrolítica.", modulo: 6 }
    ],
    nutrientes: [
      { nome: "Ferro / Ferritina", funcao: "Transporte de oxigênio; cofator da tireoide peroxidase (TPO) e da energia mitocondrial.", deficiencia: "Fadiga, queda de cabelo, unhas frágeis, extremidades frias.", forma: "Bisglicinato (quelado) — melhor tolerância.", modulo: 1 },
      { nome: "Magnésio", funcao: "Cofator de >300 enzimas; relaxamento muscular (bloqueia canais de cálcio); produção de ATP.", deficiencia: "Cãibras, mioquimia (tremor de pálpebra), insônia, ansiedade.", forma: "Glicinato (calmante), Malato (energia/ATP), Treonato (cognição).", modulo: 5 },
      { nome: "Vitamina B6 (Piridoxal-5-fosfato)", funcao: "Cofator do transporte celular de magnésio; síntese de neurotransmissores; transsulfuração da homocisteína.", deficiencia: "Irritabilidade, retenção de magnésio prejudicada.", forma: "P-5-P (forma ativa).", modulo: 5 },
      { nome: "Vitamina D (25-OH-D)", funcao: "Imunomodulação (catelicidina), saúde óssea, sensibilidade à insulina.", deficiencia: "Infecções de repetição, fadiga, dor musculoesquelética.", forma: "D3 + cofatores (magnésio para ativar, K2 para direcionar o cálcio). Alvo funcional: 40-60 ng/mL.", modulo: 10 },
      { nome: "Vitamina K2 (MK-7)", funcao: "Ativa osteocalcina (cálcio→osso) e MGP (impede calcificação vascular).", deficiencia: "Calcificação inadequada de tecidos moles.", forma: "MK-7 (meia-vida longa). Associar à D3.", modulo: 5 },
      { nome: "Zinco", funcao: "Imunidade celular, cicatrização, paladar, síntese proteica; cofator da conversão T4→T3.", deficiencia: "Leuconíquia (manchas brancas nas unhas), disgeusia, má cicatrização, infecções.", forma: "Bisglicinato; equilibrar com cobre em uso prolongado.", modulo: 10 },
      { nome: "Selênio", funcao: "Cofator das deiodinases (T4→T3) e da glutationa peroxidase tireoidiana (antioxidante).", deficiencia: "Pior conversão hormonal, maior autoimunidade tireoidiana.", forma: "Selenometionina ~200 mcg/dia (não exceder ~400 mcg — risco de toxicidade).", modulo: 11 },
      { nome: "Metilfolato (L-5-MTHF)", funcao: "Forma ativa do folato; doador de metil que remetila a homocisteína em metionina.", deficiencia: "Hiperhomocisteinemia, defeitos de metilação (agravados na mutação MTHFR).", forma: "5-MTHF — dispensa a conversão pela MTHFR.", modulo: 7 },
      { nome: "Vitamina B12 (Metilcobalamina)", funcao: "Metilação, síntese de DNA e mielina; recicla homocisteína (com folato).", deficiencia: "Anemia, neuropatia, homocisteína elevada, fadiga.", forma: "Metilcobalamina (ativa). Absorção depende de acidez gástrica e fator intrínseco.", modulo: 2 },
      { nome: "N-Acetilcisteína (NAC)", funcao: "Precursor da cisteína → glutationa (maior antioxidante hepático e da Fase 2 de detox).", deficiencia: "Baixa capacidade antioxidante e de destoxificação.", forma: "600 mg, em jejum.", modulo: 4 },
      { nome: "L-Glutamina", funcao: "Principal substrato energético dos enterócitos; reparo das tight junctions (barreira intestinal).", deficiencia: "Hiperpermeabilidade intestinal (leaky gut).", forma: "5 g em jejum.", modulo: 6 },
      { nome: "Mio-inositol + D-quiro-inositol", funcao: "Segundos mensageiros da insulina; melhoram sensibilidade insulínica e função ovariana.", deficiencia: "Associada à resistência à insulina na SOP.", forma: "Proporção fisiológica ~40:1.", modulo: 12 },
      { nome: "Cromo (picolinato)", funcao: "Potencializa o receptor de insulina; reduz desejo por doces.", deficiencia: "Pior tolerância à glicose.", forma: "Picolinato de cromo ~200-250 mcg.", modulo: 6 }
    ],
    exames: [
      { nome: "Cortisol Salivar (curva)", lab: "Manhã 3,7-9,5 ng/mL; Noite < 1,0", funcional: "Curva robusta de manhã, decaindo à noite. Achatamento matinal + elevação noturna = desregulação do eixo HPA.", modulo: 1 },
      { nome: "Ferritina", lab: "10-150 ng/dL", funcional: "> 70 ng/dL (mulheres férteis). < 30-40 já associa a fadiga e queda de cabelo.", modulo: 1 },
      { nome: "TSH", lab: "0,45-4,5 mUI/L", funcional: "1,0-2,0 mUI/L. Avaliar também T4 livre e T3 livre.", modulo: 1 },
      { nome: "Homocisteína", lab: "5-15 mcmol/L", funcional: "< 9,0 mcmol/L. Marcador de metilação e risco cardiovascular.", modulo: 2 },
      { nome: "Magnésio Intraeritrocitário", lab: "Sérico 1,8-2,6 mg/dL", funcional: "> 5,5 mg/dL (intraeritrocitário — padrão funcional, pois o sérico não reflete o tecidual).", modulo: 5 },
      { nome: "Insulina de Jejum / HOMA-IR", lab: "Insulina 2-20 uUI/mL", funcional: "Insulina 2-6 uUI/mL; HOMA-IR ideal < 2,0. Valores altos = resistência à insulina.", modulo: 6 },
      { nome: "PCR ultrassensível (PCR-us)", lab: "< 5,0 mg/L", funcional: "< 1,0 mg/L. Entre 1-3 = risco intermediário; > 3 = inflamação subclínica ativa.", modulo: 6 },
      { nome: "Hemoglobina Glicada (HbA1c)", lab: "< 5,7%", funcional: "< 5,4%. Reflete a glicemia média de ~90 dias.", modulo: 6 },
      { nome: "Relação Triglicerídeos/HDL", lab: "—", funcional: "< 2,0. Marcador de resistência à insulina e de LDL pequena e densa.", modulo: 8 },
      { nome: "Ácido Úrico", lab: "M até ~7,0; F até ~6,0 mg/dL", funcional: "< 5,5 mg/dL. Associado à hiperinsulinemia e ao consumo de frutose.", modulo: 8 },
      { nome: "MTHFR (C677T / A1298C)", lab: "Genótipo", funcional: "C677T homozigoto (T/T) reduz a atividade da enzima em ~60-70%. Orienta o uso de metilfolato.", modulo: 7 },
      { nome: "Teste Respiratório H2/CH4 (SIBO)", lab: "Lactulose/glicose", funcional: "Pico precoce de H2 (> 20 ppm acima do basal antes de 90 min) e/ou metano = SIBO/IMO.", modulo: 9 },
      { nome: "Anticorpos antitireoidianos (Anti-TPO / Anti-Tg)", lab: "Anti-TPO < ~34 UI/mL", funcional: "Elevados confirmam autoimunidade (Tireoidite de Hashimoto).", modulo: 11 },
      { nome: "Androgênios (Testosterona livre, SHBG)", lab: "Variável", funcional: "Testosterona livre alta + SHBG baixa = hiperandrogenismo (SOP). A insulina alta reduz a SHBG.", modulo: 12 }
    ],
    legislacao: [
      { tema: "O que o nutricionista PODE prescrever", detalhe: "Fitoterápicos, drogas vegetais e derivados (extratos secos, tinturas, óleos) por via ORAL ou ENTERAL, desde que habilitado e dentro das resoluções do CFN." },
      { tema: "O que é VEDADO", detalhe: "Substâncias sujeitas a controle especial (tarja preta/médico), fitoterápicos injetáveis, e qualquer fármaco alopático sintético (ex.: metformina, omeprazol, sibutramina, semaglutida, anticoncepcionais, levotiroxina)." },
      { tema: "Plantas restritas/proibidas", detalhe: "Kava-Kava (Piper methysticum) — suspensa por hepatotoxicidade. Beladona (Atropa belladonna) — alcaloides tóxicos, uso médico exclusivo." },
      { tema: "Atuação complementar", detalhe: "Não suspender nem alterar medicação prescrita por outro profissional. A conduta nutricional é complementar e integrada à equipe médica." }
    ]
  },

  // ============================================================
  // CONQUISTAS (achievements)
  // ============================================================
  achievements: [
    { id: "primeiro_caso", icon: "🩺", title: "Primeiro Atendimento", desc: "Conclua seu primeiro caso clínico." },
    { id: "ala_gastrica", icon: "🌿", title: "Especialista Gástrica/Fito", desc: "Conclua os módulos 1 a 4 (ala rosa)." },
    { id: "ala_bioquimica", icon: "🧬", title: "Mestre da Bioquímica", desc: "Conclua os módulos 5 a 8 (ala azul)." },
    { id: "ambulatorio", icon: "📋", title: "Plantão no Ambulatório", desc: "Conclua um caso avançado do Ambulatório (módulos 9-12)." },
    { id: "todos_modulos", icon: "🎓", title: "Pós-Graduada", desc: "Conclua todos os 12 módulos." },
    { id: "perfeccionista", icon: "⭐", title: "Conduta Impecável", desc: "Conclua um caso com 3 estrelas (nenhuma vida perdida)." },
    { id: "tres_estrelas_5", icon: "🏅", title: "Excelência Clínica", desc: "Conclua 5 casos com 3 estrelas." },
    { id: "boss_perfeito", icon: "⚔️", title: "Caçadora de Bosses", desc: "Vença um quiz-boss sem errar nenhuma questão." },
    { id: "quiz_100", icon: "🧠", title: "Estudiosa Dedicada", desc: "Acerte 100 questões de quiz no total." },
    { id: "colecionadora", icon: "🎁", title: "Colecionadora", desc: "Reúna todos os itens de loot no inventário." },
    { id: "streak_7", icon: "🔥", title: "Ofensiva de Estudos", desc: "Estude o jogo por 7 dias seguidos." },
    { id: "revisora", icon: "📚", title: "Revisora", desc: "Use o Modo Estudo Livre para revisar 10 quizzes." }
  ],

  // ============================================================
  // REFERÊNCIAS POR MÓDULO — guia de estudo (apostilas/slides da pós)
  // Aponta a disciplina e os tópicos a revisar; não substitui o material oficial.
  // ============================================================
  referencias: {
    1: "Disciplina: Introdução à Nutrição Funcional e Fitoterapia. Revisar: 5 princípios da Nutrição Funcional, eixo HPA e fadiga adrenal, curva de cortisol salivar, ferritina/TSH funcionais, fitoterápicos calmantes (Mulungu, Passiflora) e magnésio/L-teanina.",
    2: "Disciplina: Semiologia Nutricional & Legislação (CFN). Revisar: sinais ungueais e língua, hipocloridria, Betaína HCl/pepsina, B12/homocisteína e Resoluções do CFN sobre prescrição de fitoterápicos.",
    3: "Disciplina: Botânica e Fitoquímica. Revisar: nomenclatura binomial, classes de metabólitos (flavonoides, taninos, glicosídeos), Melissa/Hortelã, segurança (Kava-Kava, Hipérico/CYP450) e avaliação hepática prévia.",
    4: "Disciplina: Hepatologia e Destoxificação. Revisar: fases 1 e 2 do detox, glutationa/NAC, Silimarina, sulforafano/Nrf2, colina e fisiopatologia da esteatose (resistência à insulina).",
    5: "Disciplina: Bioquímica de Micronutrientes. Revisar: magnésio intraeritrocitário, relação cálcio:magnésio, formas de magnésio (glicinato/malato), B6 (P-5-P), vitamina D3/K2 e depletores (álcool/cafeína).",
    6: "Disciplina: Interpretação de Exames Laboratoriais. Revisar: HOMA-IR, PCR-us, HbA1c, disbiose/leaky gut e endotoxemia (LPS/TLR4), berberina/AMPK, glutamina e T3 reverso.",
    7: "Disciplina: Nutrigenômica e Epigenética. Revisar: ciclo de metilação, polimorfismo MTHFR C677T, metilfolato vs ácido fólico, cofatores (B12, B6, B2/FAD), betaína/BHMT e homocisteína.",
    8: "Disciplina: Obesidade e Síndrome Metabólica. Revisar: critérios da síndrome metabólica, acantose nigricans, relação TG/HDL, ácido úrico, berberina/ácido alfa-lipoico, resveratrol/curcumina e dieta de baixa carga glicêmica.",
    9: "Disciplina (Ambulatório): Saúde Intestinal e Microbiota. Revisar: SIBO (teste respiratório H2/CH4), dieta low-FODMAP, Complexo Motor Migratório, antimicrobianos herbais (berberina/orégano) e eixo intestino-cérebro.",
    10: "Disciplina (Ambulatório): Imunonutrição. Revisar: vitamina D (catelicidina) e cofator magnésio, zinco (leuconíquia/disgeusia), vitamina C/quercetina e impacto de sono/overtraining/glicemia na imunidade.",
    11: "Disciplina (Ambulatório): Tireoide e Autoimunidade. Revisar: Hashimoto (anti-TPO/anti-Tg), conversão T4→T3 e deiodinases (selênio), zinco e vitamina D, glúten/mimetismo molecular e cuidado com excesso de iodo.",
    12: "Disciplina (Ambulatório): Saúde Hormonal Feminina (SOP). Revisar: critérios de Rotterdam, resistência à insulina e SHBG, hiperandrogenismo, mio-inositol+D-quiro-inositol, berberina/NAC e limites éticos (medicação hormonal é do médico).",
    13: "Terapia Nutricional Enteral — DRC. Revisar: diferença entre DRC conservador (restrição proteica, fórmula hipoproteica tipo Nutri Renal) e DRC em diálise (proteína 1,2–1,4 g/kg, fórmula calórica densa), controle de potássio/fósforo/sódio/volume e desnutrição associada à diálise.",
    14: "Terapia Nutricional Enteral — Oncologia. Revisar: caquexia neoplásica (TNF-α, IL-6, hipermetabolismo), fórmulas hipercalóricas/hiperproteicas, EPA/ômega-3, imunonutrição perioperatória (arginina, ômega-3, nucleotídeos — ex.: Impact), via enteral vs parenteral e síndrome de realimentação.",
    15: "Terapia Nutricional Enteral — Paciente Crítico. Revisar: TNE precoce (24–48h), metas de 25–30 kcal/kg e proteína 1,5–2,0 g/kg, fórmulas para paciente grave/trauma (ex.: Protison, HP Energy), cabeceira elevada 30–45° e prevenção de broncoaspiração na traqueostomia/ventilação.",
    16: "Terapia Nutricional Enteral — Disfagia/Vias. Revisar: SNE (curto prazo) x GTT/ostomias (longo prazo, >4–6 semanas), fórmula polimérica padrão, fibras + água livre (constipação), lavagem da sonda e administração de medicações, fórmulas para diabetes (Diason) e segurança na disfagia.",
    17: "Terapia Nutricional Enteral — Complicações (Diarreia). Revisar: causas multifatoriais (velocidade/osmolaridade, sorbitol, antibióticos/C. difficile, contaminação, má absorção), conduta (reduzir velocidade, investigar causa, NÃO suspender de imediato) e fórmulas peptídicas/oligoméricas (Peptamen) e com fibras."
  }
};

// Exportar para uso no navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = nutriGameData;
}
