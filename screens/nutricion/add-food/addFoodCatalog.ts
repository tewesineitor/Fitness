import type { FoodCategory, MainCategory } from './addFoodTypes';

export const filterCategories: { key: MainCategory; label: string }[] = [
  { key: 'Todos', label: 'Todos' },
  { key: 'Proteínas', label: 'Proteínas' },
  { key: 'Carbohidratos', label: 'Carbs' },
  { key: 'Frutas y Verduras', label: 'Verduras' },
  { key: 'Grasas', label: 'Grasas' },
  { key: 'Preparados', label: 'Calle / Prep' },
];

export const categoryFilterMap: Record<Exclude<MainCategory, 'Todos'>, FoodCategory[]> = {
  Proteínas: [
    'Carnicería (Pollo)',
    'Carnicería (Res)',
    'Carnicería (Cerdo)',
    'Pescadería',
    'Huevo y Lácteos',
    'Embutidos',
    'Suplementos',
    'Enlatados',
  ],
  Carbohidratos: [
    'Tortillas y Maíz',
    'Panadería',
    'Cereales y Tubérculos',
    'Legumbres',
    'Untables / Extras',
  ],
  'Frutas y Verduras': ['Frutas', 'Verduras'],
  Grasas: ['Grasas y Aceites', 'Semillas y Frutos Secos', 'Condimentos y Salsas'],
  Preparados: ['Calle (Antojitos)', 'Calle (Caldos)'],
};

export const subCategoryLabels: Record<string, string> = {
  'Carnicería (Pollo)': 'Pollo',
  'Carnicería (Res)': 'Res',
  'Carnicería (Cerdo)': 'Cerdo',
  'Calle (Antojitos)': 'Antojitos',
  'Calle (Caldos)': 'Caldos',
  Pescadería: 'Pescado',
  Enlatados: 'Enlatados',
  'Huevo y Lácteos': 'Lácteos',
  Embutidos: 'Embutidos',
  Panadería: 'Panadería',
  'Tortillas y Maíz': 'Maíz',
  'Cereales y Tubérculos': 'Cereales',
  Frutas: 'Frutas',
  Verduras: 'Verduras',
  Legumbres: 'Legumbres',
  'Semillas y Frutos Secos': 'Semillas',
  'Grasas y Aceites': 'Grasas',
  'Condimentos y Salsas': 'Salsas',
  Suplementos: 'Suplementos',
  'Untables / Extras': 'Untables',
};

export const getCategoryPriority = (category: string): number => {
  if (categoryFilterMap.Proteínas.includes(category as FoodCategory)) return 1;
  if (categoryFilterMap.Carbohidratos.includes(category as FoodCategory)) return 2;
  if (categoryFilterMap['Frutas y Verduras'].includes(category as FoodCategory)) return 3;
  if (categoryFilterMap.Grasas.includes(category as FoodCategory)) return 4;
  if (categoryFilterMap.Preparados.includes(category as FoodCategory)) return 5;
  return 6;
};
