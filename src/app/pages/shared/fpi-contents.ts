/**
 * conteudo redundante com modelos das enums, para evitar fazer
 * uma método de transformar enum em par chave-valor...
 */

export const fpiContents = {
  // Postura do pé
  'footPosture': [
    { value: 'SupinatedHighly', viewValue: 'Altamente Supinado' },
    { value: 'Supinated', viewValue: 'Supinado' },
    { value: 'Neutral', viewValue: 'Neutro' },
    { value: 'Pronated', viewValue: 'Pronado' },
    { value: 'PronatedHighly', viewValue: 'Altamente Pronado' }
  ],
  // Critérios de observação
  'criterias': [
    { value: 'SupraAndInfraLateralNalleoliCurvature', viewValue: 'Curvatura supra e infra maleolar lateral' },
    { value: 'CalcanealFrontalPlanePosition', viewValue: 'Posição do calcâneo' },
    { value: 'AbductionAdductionOfForefootOnRearfoot', viewValue: 'Abdução e adução do antepé sobre o retropé' },
    { value: 'CongruenceOfMedialLongitudinalArch', viewValue: 'Altura do arco longitudinal medial' },
    { value: 'ProeminenceInRegionOfTnj', viewValue: 'Proeminência na região da ATN' }
  ],
  // Vistas de observação
  'footView': [
    { value: 'InsideRearAngle', viewValue: 'Poterior interno oblíquo' },
    { value: 'Medial', viewValue: 'Medial' },
    { value: 'Rear', viewValue: 'Posterior' }
    
  ]
};
