const replacements: Array<[string, string]> = [
  ['ProteÃ­nas', 'Proteinas'],
  ['CarnicerÃ­a', 'Carniceria'],
  ['PescaderÃ­a', 'Pescaderia'],
  ['LÃ¡cteos', 'Lacteos'],
  ['Tortillas y MaÃ­z', 'Tortillas y Maiz'],
  ['PanaderÃ­a', 'Panaderia'],
  ['TubÃ©rculos', 'Tuberculos'],
  ['ColaciÃ³n', 'Colacion'],
  ['InformaciÃ³n', 'Informacion'],
  ['nutriciÃ³n', 'nutricion'],
  ['energÃ©tico', 'energetico'],
  ['cÃ¡mara', 'camara'],
  ['cÃ³digo', 'codigo'],
  ['Ã¡', 'a'],
  ['Ã©', 'e'],
  ['Ã­', 'i'],
  ['Ã³', 'o'],
  ['Ãº', 'u'],
  ['Ã±', 'n'],
  ['Â¿', ''],
  ['Â¡', ''],
];

export const cleanNutritionText = (value: string): string =>
  replacements.reduce((result, [search, replacement]) => result.replaceAll(search, replacement), value);
