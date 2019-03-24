/**
 * conteudo redundante com modelos das enums, para evitar fazer
 * uma método de transformar enum em par chave-valor...
 */

export const formSelectsContent = {
  // Escolaridade para seleção
  'educations': [
    { value: 'HigherEducationHealthArea', viewValue: 'Superior (Área da Saúde)' },
    { value: 'HigherEducation', viewValue: 'Superior' },
    { value: 'PostGraduteHealthArea', viewValue: 'Pos-Graduacao (Área da Saúde)' },
    { value: 'PostGraduate', viewValue: 'Pos-Graduacao' },
    { value: 'HighSchool', viewValue: 'Médio' },
    { value: 'ElementarySchool', viewValue: 'Fundamental' },
    { value: 'Others', viewValue: 'Outros' }
  ],
  // Ocupações para seleção
  'occupations': [
    { value: 'Doctor', viewValue: 'Médico' },
    { value: 'Physiotherapist', viewValue: 'Fisioterapeuta' },
    { value: 'PhysicalEducator', viewValue: 'Educador Físico' },
    { value: 'SalesMan', viewValue: 'Vendedor' },
    { value: 'HealthAreaStudent', viewValue: 'Estudante (Área da Saúde)' },
    { value: 'Student', viewValue: 'Estudante' },
    { value: 'Others', viewValue: 'Outros' }
  ],
  // Lesões para seleção
  'footDominants': [
    { value: 'Right', viewValue: 'Direito' },
    { value: 'Left', viewValue: 'Esquerdo' }
  ],
  // Lesões para seleção
  'footInjuries': [
    { value: 'AnkleSprain', viewValue: 'Entorse de Tornozelo' },
    { value: 'PlantarFasciitis', viewValue: 'Fascite plantar' },
    { value: 'CalcaneanSpur', viewValue: 'Esporão de Calcâneo' },
    { value: 'Metatarsalgia', viewValue: 'Metatarsalgia' },
    { value: 'Another', viewValue: 'Outro(s)' },
    { value: 'None', viewValue: 'Nenhuma' }
  ],
  // Gêneros para seleção
  'genders': [
    { value: 'Female', viewValue: 'Feminino' },
    { value: 'Male', viewValue: 'Masculino' }
  ],
  // Esportes para seleção
  'sports': [
    { value: 'Soccer', viewValue: 'Futebol' },
    { value: 'Running', viewValue: 'Corrida' },
    { value: 'Triathlon', viewValue: 'Triathlon' },
    { value: 'Cycling', viewValue: 'Ciclismo' },
    { value: 'Swimming', viewValue: 'Natação' },
    { value: 'Basketball', viewValue: 'Basquete' },
    { value: 'MartialArts', viewValue: 'Artes Marciais' },
    { value: 'Volleyball', viewValue: 'Vôlei' },
    { value: 'Another', viewValue: 'Outro(s)' }
  ],
  // Tempo que pratica o esporte para seleção
  'sportPraticeTimes': [
    { value: 'LessThanSixMonths', viewValue: 'Menos de 6 meses' },
    { value: 'BetweenSixAndTwentyFourMonths', viewValue: 'Entre 6 e 24 meses' },
    { value: 'MoreThanTwoYears', viewValue: 'Mais de 2 anos' }
  ],
  // Frequência que pratica o esporte por semana para seleção
  'sportPraticeFrequencies': [
    { value: 'OnePerWeek', viewValue: '1 vez por semana' },
    { value: 'TwoOrTreePerWeek', viewValue: '2 a 3 vezes por semana' },
    { value: 'MoreThanThreePerWeek', viewValue: 'Mais de 3 vezes por semana' }
  ]
};
