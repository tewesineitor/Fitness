
import { Recipe, AddedFood, MealType } from './types';
import { foodData } from './data-foods';

export const recipesData: Recipe[] = [
    {
        id: 'plan-desayuno-base-salado',
        name: 'Desayuno Base ("El Salado")',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop',
        mealType: 'Desayuno',
        foods: [
            { foodItem: foodData.find(f => f.id === 'huevo-entero-generico')!, portions: 2.4 }, // ~120ml/120g
            { foodItem: foodData.find(f => f.id === 'claras-san-juan')!, portions: 1 }, // 150ml
            { foodItem: foodData.find(f => f.id === 'jamon-corona-extrafino')!, portions: 1.3 }, // 65g (Base 50g x 1.3)
            { foodItem: foodData.find(f => f.id === 'tortilla-maiz')!, portions: 4 }, // 4 piezas
            { foodItem: foodData.find(f => f.id === 'aceite-cocina')!, portions: 1 }, // 5g
        ].filter(f => f.foodItem),
        preparation: '1. Calienta el aceite en un sartén a fuego medio.\n2. Corta el jamón en cuadros y las tortillas en tiras o triángulos (opcional).\n3. Sofríe ligeramente las tortillas y el jamón.\n4. Agrega los huevos enteros (aprox 120ml) y las claras (150ml), revuelve hasta que estén cocidos al gusto.\n5. Sirve caliente.',
    },
    {
        id: 'plan-cena-base-licuado',
        name: 'Cena Base ("Licuado Todo-en-Uno")',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=800&auto=format&fit=crop',
        mealType: 'Cena',
        foods: [
            { foodItem: foodData.find(f => f.id === 'leche-lala-100-light')!, portions: 1 }, // 250ml
            { foodItem: foodData.find(f => f.id === 'whey-protein-on')!, portions: 1 }, // 30g scoop
            { foodItem: foodData.find(f => f.id === 'avena-buenahora')!, portions: 1 }, // 50g
            { foodItem: foodData.find(f => f.id === 'platano')!, portions: 0.83 }, // 100g (Base 120g x 0.83)
            { foodItem: foodData.find(f => f.id === 'crema-cacahuate-kirkland')!, portions: 1 }, // 15g
            { foodItem: foodData.find(f => f.id === 'cacao-polvo')!, portions: 1 }, // 10g
            { foodItem: foodData.find(f => f.id === 'maca-peruana')!, portions: 2 }, // 10g (Base 5g x 2)
            { foodItem: foodData.find(f => f.id === 'espirulina')!, portions: 1 }, // 5g
        ].filter(f => f.foodItem),
        preparation: '1. Coloca la leche, proteína, avena, plátano, crema de cacahuate, cacao, maca y espirulina en la licuadora.\n2. Agrega hielo si prefieres una textura tipo frappé.\n3. Licúa a alta velocidad hasta obtener una mezcla homogénea y sin grumos.\n4. Sirve inmediatamente.',
    },
    {
        id: 'plan-desayuno-proteico',
        name: 'Desayuno Proteico de Campeón',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
        mealType: 'Desayuno',
        foods: [
            { foodItem: foodData.find(f => f.id === 'huevo-entero-generico')!, portions: 2 },
            { foodItem: foodData.find(f => f.id === 'jamon-pavo-generico')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'aguacate')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'tortilla-maiz')!, portions: 1 },
        ].filter(f => f.foodItem),
        preparation: '1. Calienta un sartén a fuego medio.\n2. Bate los huevos y cocínalos al gusto.\n3. Calienta el jamón y las tortillas.\n4. Sirve los huevos revueltos con el jamón, aguacate y tortillas.',
    },
    {
        id: 'plan-comida-balanceada',
        name: 'Pollo, Arroz y Brócoli Clásico',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
        mealType: 'Almuerzo',
        foods: [
            { foodItem: foodData.find(f => f.id === 'pechuga-pollo-cruda')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'arroz-blanco-cocido')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'brocoli-picado')!, portions: 1.5 },
            { foodItem: foodData.find(f => f.id === 'aceite-cocina')!, portions: 1 },
        ].filter(f => f.foodItem),
        preparation: '1. Cocina la pechuga de pollo a la plancha o al horno.\n2. Cuece el arroz y el brócoli al vapor.\n3. Sirve todo en un plato y adereza con el aceite de oliva, sal y pimienta al gusto.',
    },
    {
        id: 'plan-avena-nocturna',
        name: 'Avena Nocturna con Frutos Rojos',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
        mealType: 'Desayuno',
        foods: [
            { foodItem: foodData.find(f => f.id === 'avena-buenahora')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'leche-lala-100')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'semillas-chia-secas')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'fresas')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'almendras')!, portions: 0.5 },
        ].filter(f => f.foodItem),
        preparation: '1. En un frasco o recipiente, mezcla la avena con la leche y las semillas de chía.\n2. Deja reposar en el refrigerador durante toda la noche (o al menos 4 horas).\n3. Al momento de servir, agrega las fresas picadas y las almendras por encima.\n4. Disfruta frío, ideal para mañanas con poco tiempo.',
    },
    {
        id: 'plan-tacos-arrachera',
        name: 'Tacos de Arrachera con Nopales',
        type: 'plan',
        imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop',
        mealType: 'Almuerzo',
        foods: [
            { foodItem: foodData.find(f => f.id === 'res-arrachera')!, portions: 1.5 },
            { foodItem: foodData.find(f => f.id === 'tortilla-maiz')!, portions: 3 },
            { foodItem: foodData.find(f => f.id === 'nopales')!, portions: 1 },
            { foodItem: foodData.find(f => f.id === 'cebolla')!, portions: 0.5 },
            { foodItem: foodData.find(f => f.id === 'aguacate')!, portions: 0.5 },
        ].filter(f => f.foodItem),
        preparation: '1. Asar la arrachera al término deseado y cortarla en tiras o cubos.\n2. Asar los nopales y la cebolla en el mismo sartén o parrilla.\n3. Calentar las tortillas.\n4. Armar los tacos colocando la carne, nopales y cebolla sobre las tortillas.\n5. Finalizar con rebanadas de aguacate y salsa al gusto (opcional).',
    }
];

export const mealGoals = {
  Desayuno: { kcal: 450, protein: 35, carbs: 45, fat: 15 },
  Almuerzo: { kcal: 550, protein: 40, carbs: 75, fat: 10 },
  Cena: { kcal: 600, protein: 45, carbs: 80, fat: 10 },
  Colación: { kcal: 350, protein: 30, carbs: 21, fat: 15 },
};
