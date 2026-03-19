
import { FoodItem } from './types';

export const foodData: FoodItem[] = [
    // ============================================================
    // CALLE (ANTOJITOS)
    // ============================================================
    { 
        id: 'calle-barbacoa-carne', 
        name: 'Barbacoa de Res (Carne)', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Grasita/Labio)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 260, protein: 19.0, carbs: 0.0, fat: 20.0 } 
    },
    { 
        id: 'calle-birria-carne', 
        name: 'Birria de Res (Solo Carne)', 
        brand: 'Birriería',
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Carne s/consomé)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 180, protein: 26.0, carbs: 1.0, fat: 7.0 } 
    },
    { 
        id: 'calle-carnaza', 
        name: 'Carnaza de Res (Vapor)', 
        brand: 'Puesto Tacos',
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Ya Cocido)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 205, protein: 24.0, carbs: 0.0, fat: 11.0 } 
    },
    { 
        id: 'calle-carne-asada', 
        name: 'Carne Asada Picada', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Ya Cocido)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 190, protein: 26.0, carbs: 0.0, fat: 9.0 } 
    },
    { 
        id: 'calle-pastor', 
        name: 'Carne al Pastor / Adobada', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Ya Cocido)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 270, protein: 22.0, carbs: 4.0, fat: 18.0 } 
    },
    {
        id: 'calle-carnitas-buche',
        name: 'Carnitas - Buche',
        brand: 'Puesto Tacos',
        category: 'Calle (Antojitos)',
        standardPortion: '100g (Ya Cocido)',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 260, protein: 17.0, carbs: 0.0, fat: 20.0 } 
    },
    {
        id: 'calle-carnitas-cuerito',
        name: 'Carnitas - Cuerito',
        brand: 'Puesto Tacos',
        category: 'Calle (Antojitos)',
        standardPortion: '100g (Ya Cocido)',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 450, protein: 22.0, carbs: 0.0, fat: 37.5 } 
    },
    {
        id: 'calle-carnitas-maciza',
        name: 'Carnitas - Maciza (Carne Lomo/Pierna)',
        brand: 'Puesto Tacos',
        category: 'Calle (Antojitos)',
        standardPortion: '100g (Ya Cocido)',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 230, protein: 27.0, carbs: 0.0, fat: 12.0 } 
    },
    { 
        id: 'calle-chicharron-prensado', 
        name: 'Chicharrón Prensado', 
        brand: 'Guisado',
        category: 'Calle (Antojitos)', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 340, protein: 19.0, carbs: 1.0, fat: 28.0 } 
    },
    {
        id: 'chile-relleno-queso',
        name: 'Chile Relleno de Queso (Capeado)',
        brand: 'Genérico',
        category: 'Calle (Antojitos)',
        standardPortion: '1 Pieza Mediana (~200g)',
        cookedWeightG: 200,
        macrosPerPortion: { kcal: 410, protein: 14.0, carbs: 15.0, fat: 32.0 } 
    },
    { 
        id: 'calle-labio', 
        name: 'Labio de Res (Vapor)', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Gelatinoso)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 260, protein: 18.0, carbs: 0.0, fat: 21.0 } 
    },
    { 
        id: 'calle-lengua', 
        name: 'Lengua de Res (Vapor)', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Ya cocida)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 220, protein: 19.0, carbs: 0.0, fat: 16.0 } 
    },
    {
        id: 'calle-menudo-carne',
        name: 'Menudo / Pancita (Solo Carne)',
        brand: 'Genérico',
        category: 'Calle (Antojitos)',
        standardPortion: '100g (Ya Cocido)',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 95, protein: 14.0, carbs: 0.0, fat: 4.0 } 
    },
    { 
        id: 'calle-mojarra-frita', 
        name: 'Mojarra Frita (Solo Carne)', 
        brand: 'Mariscos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Carne limpia)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 190, protein: 20.0, carbs: 0.0, fat: 12.0 } 
    },
    { 
        id: 'calle-papas-francesa', 
        name: 'Papas a la Francesa', 
        brand: 'Genérico', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g', 
        rawWeightG: 140, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 310, protein: 3.0, carbs: 35.0, fat: 15.0 } 
    },
    { 
        id: 'calle-pierna-lonche', 
        name: 'Pierna de Cerdo (Lonche)', 
        brand: 'Lonchería', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Preparada)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 200, protein: 25.0, carbs: 2.0, fat: 10.0 } 
    },
    { 
        id: 'calle-pollo-rostizado-muslo', 
        name: 'Pollo Rostizado (Muslo/Pierna)', 
        brand: 'Rosticería',
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Carne Limpia)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 215, protein: 24.0, carbs: 0.5, fat: 13.0 } 
    },
    { 
        id: 'calle-pollo-rostizado-pechuga', 
        name: 'Pollo Rostizado (Pechuga)', 
        brand: 'Rosticería',
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Carne Limpia)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 175, protein: 29.0, carbs: 0.5, fat: 6.0 } 
    },
    { 
        id: 'calle-tripa', 
        name: 'Tripa Dorada', 
        brand: 'Puesto Tacos', 
        category: 'Calle (Antojitos)', 
        standardPortion: '100g (Ya frita)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 390, protein: 16.0, carbs: 0.0, fat: 35.0 } 
    },
    { 
        id: 'kfc-cruji', 
        name: 'KFC Cruji (1 Pieza)', 
        brand: 'KFC', 
        category: 'Calle (Antojitos)', 
        standardPortion: '1 Pieza (~160g)', 
        cookedWeightG: 160, 
        macrosPerPortion: { kcal: 370, protein: 19.0, carbs: 11.0, fat: 25.0 } 
    },

    // ============================================================
    // CALLE (CALDOS)
    // ============================================================
    { 
        id: 'caldo-camaron', 
        name: 'Caldo de Camarón (Rojo)', 
        brand: 'Genérico', 
        category: 'Calle (Caldos)', 
        standardPortion: '1 Taza (250ml)', 
        cookedWeightG: 250, 
        macrosPerPortion: { kcal: 80, protein: 5.0, carbs: 5.0, fat: 4.0 } 
    },
    {
        id: 'caldo-carne-jugo',
        name: 'Caldo de Carne en su Jugo',
        brand: 'Genérico',
        category: 'Calle (Caldos)',
        standardPortion: '1 Taza (250ml)',
        cookedWeightG: 250, 
        macrosPerPortion: { kcal: 70, protein: 2.0, carbs: 4.0, fat: 5.0 } 
    },
    { 
        id: 'caldo-menudo', 
        name: 'Caldo de Menudo (Líquido)', 
        brand: 'Genérico', 
        category: 'Calle (Caldos)', 
        standardPortion: '1 Taza (250ml)', 
        cookedWeightG: 250, 
        macrosPerPortion: { kcal: 70, protein: 1.5, carbs: 3.0, fat: 5.5 } 
    },
    {
        id: 'caldo-pescado',
        name: 'Caldo de Pescado (Sopa)',
        brand: 'Genérico',
        category: 'Calle (Caldos)',
        standardPortion: '1 Taza (250ml)',
        cookedWeightG: 250,
        macrosPerPortion: { kcal: 40, protein: 3.0, carbs: 2.0, fat: 2.0 } 
    },
    { 
        id: 'caldo-pozole', 
        name: 'Caldo de Pozole (Líquido)', 
        brand: 'Genérico', 
        category: 'Calle (Caldos)', 
        standardPortion: '1 Taza (250ml)', 
        cookedWeightG: 250, 
        macrosPerPortion: { kcal: 80, protein: 2.0, carbs: 4.0, fat: 6.0 } 
    },
    { 
        id: 'caldo-consome-birria', 
        name: 'Consomé de Birria (Grasoso)', 
        brand: 'Genérico', 
        category: 'Calle (Caldos)', 
        standardPortion: '1 Taza (250ml)', 
        cookedWeightG: 250, 
        macrosPerPortion: { kcal: 90, protein: 2.0, carbs: 2.0, fat: 8.0 } 
    },
    {
        id: 'caldo-coctel',
        name: 'Salsa para Coctel (Catsup prep.)',
        brand: 'Genérico',
        category: 'Calle (Caldos)',
        standardPortion: '1 Taza (250ml)',
        cookedWeightG: 250,
        macrosPerPortion: { kcal: 110, protein: 1.0, carbs: 25.0, fat: 0.0 } 
    },

    // ============================================================
    // CARNICERÍA (CERDO)
    // ============================================================
    {
        id: 'cerdo-aldilla',
        name: 'Aldilla de Cerdo / Falda',
        brand: 'Genérico',
        category: 'Carnicería (Cerdo)',
        standardPortion: '100g Crudo',
        rawWeightG: 100,
        cookedWeightG: 65,
        macrosPerPortion: { kcal: 290, protein: 16.0, carbs: 0.0, fat: 23.0 }
    },
    {
        id: 'cerdo-chuleta',
        name: 'Chuleta de Cerdo (Ahumada)',
        brand: 'Genérico',
        category: 'Carnicería (Cerdo)',
        standardPortion: '100g Crudo (~85g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 85,
        macrosPerPortion: { kcal: 200, protein: 16.0, carbs: 1.0, fat: 14.0 } 
    },
    { 
        id: 'cerdo-costilla', 
        name: 'Costilla de Cerdo (C/Hueso)', 
        brand: 'Genérico', 
        category: 'Carnicería (Cerdo)', 
        standardPortion: '100g Crudo (Con Hueso)', 
        rawWeightG: 100, 
        cookedWeightG: 65, 
        macrosPerPortion: { kcal: 230, protein: 15.0, carbs: 0.0, fat: 18.0 } 
    },
    {
        id: 'cerdo-espinazo',
        name: 'Espinazo de Cerdo (S/Hueso)',
        brand: 'Genérico',
        category: 'Carnicería (Cerdo)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 215, protein: 17.5, carbs: 0.0, fat: 16.0 }
    },
    {
        id: 'cerdo-lomo',
        name: 'Lomo de Cerdo',
        brand: 'Genérico',
        category: 'Carnicería (Cerdo)',
        standardPortion: '100g Crudo (~75g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 75,
        macrosPerPortion: { kcal: 125, protein: 22.0, carbs: 0.0, fat: 3.5 } 
    },
    {
        id: 'cerdo-pierna-cruda',
        name: 'Pierna de Cerdo',
        brand: 'Genérico',
        category: 'Carnicería (Cerdo)',
        standardPortion: '100g Crudo (~75g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 75,
        macrosPerPortion: { kcal: 140, protein: 21.0, carbs: 0.0, fat: 5.0 } 
    },

    // ============================================================
    // CARNICERÍA (POLLO)
    // ============================================================
    {
        id: 'pollo-milanesa-empanizada',
        name: 'Milanesa de Pollo (Empanizada Cruda)',
        brand: 'Genérico',
        category: 'Carnicería (Pollo)',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 185, protein: 17.0, carbs: 18.0, fat: 4.0 }
    },
    {
        id: 'pollo-mollejas',
        name: 'Mollejas de Pollo (Limpias)',
        brand: 'Genérico',
        category: 'Carnicería (Pollo)',
        standardPortion: '100g Crudo (~60g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 60,
        macrosPerPortion: { kcal: 95, protein: 18.0, carbs: 0.0, fat: 2.0 } 
    },
    {
        id: 'pollo-muslo-crudo',
        name: 'Muslo de Pollo (Sin Piel)',
        brand: 'Genérico',
        category: 'Carnicería (Pollo)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 120, protein: 19.5, carbs: 0.0, fat: 4.5 } 
    },
    {
        id: 'pollo-pechuga-cruda',
        name: 'Pechuga de Pollo (Sin Piel)',
        brand: 'Genérico',
        category: 'Carnicería (Pollo)',
        standardPortion: '100g Crudo (~75g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 75,
        macrosPerPortion: { kcal: 110, protein: 23.0, carbs: 0.0, fat: 1.5 } 
    },
    {
        id: 'pollo-pierna-cruda',
        name: 'Pierna de Pollo (Sin Piel)',
        brand: 'Genérico',
        category: 'Carnicería (Pollo)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 115, protein: 21.0, carbs: 0.0, fat: 3.0 } 
    },

    // ============================================================
    // CARNICERÍA (RES)
    // ============================================================
    {
        id: 'res-arrachera',
        name: 'Arrachera Marinada',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 210, protein: 18.0, carbs: 1.0, fat: 14.0 } 
    },
    {
        id: 'res-bistec-diezmillo',
        name: 'Bistec de Res (Diezmillo/Sirloin)',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 190, protein: 19.0, carbs: 0.0, fat: 12.0 } 
    },
    {
        id: 'res-peinecillo',
        name: 'Bistec de Res (Peinecillo)',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~65g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 65,
        macrosPerPortion: { kcal: 242, protein: 23.3, carbs: 0.0, fat: 16.6 } 
    },
    { 
        id: 'res-costilla', 
        name: 'Costilla de Res (C/Hueso)', 
        brand: 'Genérico', 
        category: 'Carnicería (Res)', 
        standardPortion: '100g Crudo (Con Hueso)', 
        rawWeightG: 100, 
        cookedWeightG: 60, 
        macrosPerPortion: { kcal: 238, protein: 14.5, carbs: 0.0, fat: 20.0 } 
    },
    { 
        id: 'res-costilla-carne', 
        name: 'Costilla de Res (S/Hueso)', 
        brand: 'Genérico', 
        category: 'Carnicería (Res)', 
        standardPortion: '100g (Ya cocida)', 
        rawWeightG: 145, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 348, protein: 24.0, carbs: 0.0, fat: 28.0 } 
    },
    {
        id: 'res-molida-magra',
        name: 'Molida Extra Magra (90/10)',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~75g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 75,
        macrosPerPortion: { kcal: 130, protein: 21.0, carbs: 0.0, fat: 4.5 } 
    },
    {
        id: 'res-molida-mixta',
        name: 'Molida Mixta (50/50)',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~70g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 70,
        macrosPerPortion: { kcal: 240, protein: 18.0, carbs: 0.0, fat: 18.0 } 
    },
    {
        id: 'res-platanillo',
        name: 'Platanillo / Cuete (Trozos)',
        brand: 'Genérico',
        category: 'Carnicería (Res)',
        standardPortion: '100g Crudo (~65g Cocido)',
        rawWeightG: 100,
        cookedWeightG: 65,
        macrosPerPortion: { kcal: 125, protein: 21.5, carbs: 0.0, fat: 3.5 } 
    },

    // ============================================================
    // CEREALES Y TUBÉRCULOS
    // ============================================================
    { 
        id: 'arroz-blanco-cocido', 
        name: 'Arroz Blanco (Vapor)', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '100g (Peso Cocido)', 
        rawWeightG: 33, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 130, protein: 2.5, carbs: 28.0, fat: 0.3 } 
    },
    { 
        id: 'arroz-rojo-cocido', 
        name: 'Arroz Rojo (Frito/Casero)', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '100g (Peso Cocido)', 
        rawWeightG: 33, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 145, protein: 2.5, carbs: 25.0, fat: 3.5 } 
    },
    { 
        id: 'avena-buenahora', 
        name: 'Avena (Hojuelas)', 
        brand: 'Buenahora', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '1/2 taza (50g Crudo)', 
        rawWeightG: 50, 
        macrosPerPortion: { kcal: 194, protein: 6.5, carbs: 34.0, fat: 3.5 } 
    },
    {
        id: 'camote-cocido',
        name: 'Camote Cocido',
        brand: 'Genérico',
        category: 'Cereales y Tubérculos',
        standardPortion: '100g (Peso Cocido)',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 86, protein: 1.5, carbs: 20.0, fat: 0.0 } 
    },
    { 
        id: 'maiz-pozolero', 
        name: 'Maíz Pozolero (Granos)', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '1 Taza (160g)', 
        cookedWeightG: 160, 
        macrosPerPortion: { kcal: 160, protein: 4.5, carbs: 32.0, fat: 2.5 } 
    },
    { 
        id: 'papa-cocida', 
        name: 'Papa Cocida', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 86, protein: 1.7, carbs: 20.0, fat: 0.1 } 
    },
    { 
        id: 'pasta-cocida', 
        name: 'Pasta Italiana (Hervida)', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '100g (Peso Cocido)', 
        rawWeightG: 40, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 131, protein: 5.0, carbs: 25.0, fat: 1.1 } 
    },
    {
        id: 'pure-papa',
        name: 'Puré de Papa (Casero)',
        brand: 'Genérico',
        category: 'Cereales y Tubérculos',
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 120, protein: 2.0, carbs: 18.0, fat: 5.0 } 
    },
    { 
        id: 'quinoa-members', 
        name: 'Quinoa', 
        brand: 'Member\'s Mark', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '50g Crudo (~150g Cocido)', 
        rawWeightG: 50, 
        cookedWeightG: 150, 
        macrosPerPortion: { kcal: 183, protein: 7.0, carbs: 32.0, fat: 3.0 } 
    },
    { 
        id: 'sopa-pasta', 
        name: 'Sopa de Pasta / Fideo', 
        brand: 'Genérico', 
        category: 'Cereales y Tubérculos', 
        standardPortion: '1 Taza (240g)', 
        cookedWeightG: 240, 
        macrosPerPortion: { kcal: 145, protein: 3.5, carbs: 22.0, fat: 4.5 } 
    },

    // ============================================================
    // CONDIMENTOS Y SALSAS
    // ============================================================
    { 
        id: 'mole-rojo', 
        name: 'Salsa de Mole Rojo (Preparada)', 
        brand: 'Genérico', 
        category: 'Condimentos y Salsas', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 180, protein: 3.0, carbs: 15.0, fat: 12.0 } 
    },
    { 
        id: 'salsa-pico-gallo', 
        name: 'Salsa Mexicana / Pico de Gallo', 
        brand: 'Genérico', 
        category: 'Condimentos y Salsas', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 25, protein: 1.0, carbs: 5.0, fat: 0.0 } 
    },

    // ============================================================
    // EMBUTIDOS
    // ============================================================
    {
        id: 'chorizo-argentino',
        name: 'Chorizo Argentino',
        brand: 'Genérico',
        category: 'Embutidos',
        standardPortion: '100g',
        rawWeightG: 100,
        cookedWeightG: 85,
        macrosPerPortion: { kcal: 323, protein: 21.0, carbs: 2.0, fat: 25.7 } 
    },
    {
        id: 'chorizo-pierna-compacto',
        name: 'Chorizo de Pierna (Compacto)',
        brand: 'Genérico',
        category: 'Embutidos',
        standardPortion: '100g',
        rawWeightG: 100,
        cookedWeightG: 85,
        macrosPerPortion: { kcal: 278, protein: 18.0, carbs: 2.0, fat: 22.0 } 
    },
    { 
        id: 'chorizo-freir', 
        name: 'Chorizo para Freír (Grasoso)', 
        brand: 'Genérico', 
        category: 'Embutidos', 
        standardPortion: '100g', 
        rawWeightG: 100, 
        cookedWeightG: 65, 
        macrosPerPortion: { kcal: 375, protein: 11.0, carbs: 4.0, fat: 35.0 } 
    },
    { 
        id: 'jamon-pavo-generico', 
        name: 'Jamón de Pavo', 
        brand: 'Genérico', 
        category: 'Embutidos', 
        standardPortion: '2 rebanadas (40g)', 
        cookedWeightG: 40, 
        macrosPerPortion: { kcal: 40, protein: 6.0, carbs: 1.5, fat: 1.0 } 
    },
    {
        id: 'jamon-sabori-pavo',
        name: 'Jamón Pavo (Extrafino)',
        brand: 'Sabori',
        category: 'Embutidos',
        standardPortion: '50g',
        cookedWeightG: 50,
        macrosPerPortion: { kcal: 55, protein: 9.0, carbs: 2.5, fat: 1.0 }
    },
    {
        id: 'jamon-corona-extrafino',
        name: 'Jamón Pierna (Extrafino)',
        brand: 'Corona',
        category: 'Embutidos',
        standardPortion: '50g',
        cookedWeightG: 50,
        macrosPerPortion: { kcal: 50, protein: 9.0, carbs: 1.0, fat: 1.0 }
    },
    {
        id: 'jamon-san-rafael',
        name: 'Jamón Pierna (Extrafino)',
        brand: 'San Rafael',
        category: 'Embutidos',
        standardPortion: '50g',
        cookedWeightG: 50,
        macrosPerPortion: { kcal: 52, protein: 9.0, carbs: 0.4, fat: 1.6 }
    },
    { 
        id: 'salchicha-pavo', 
        name: 'Salchicha de Pavo', 
        brand: 'Genérico', 
        category: 'Embutidos', 
        standardPortion: '1 pieza (33g)', 
        cookedWeightG: 33, 
        macrosPerPortion: { kcal: 60, protein: 4.0, carbs: 2.0, fat: 4.0 } 
    },
    { 
        id: 'tocino', 
        name: 'Tocino de Cerdo', 
        brand: 'Genérico', 
        category: 'Embutidos', 
        standardPortion: '2 rebanadas (Crudo 24g)', 
        rawWeightG: 24, 
        cookedWeightG: 10, 
        macrosPerPortion: { kcal: 44, protein: 3.7, carbs: 0.1, fat: 3.0 } 
    },

    // ============================================================
    // ENLATADOS
    // ============================================================
    { 
        id: 'atun-dolores-aceite', 
        name: 'Atún en Aceite', 
        brand: 'Dolores', 
        category: 'Enlatados', 
        standardPortion: '1 lata (100g drenado)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 122, protein: 20.0, carbs: 2.6, fat: 3.5 } 
    },
    { 
        id: 'atun-tuny-agua', 
        name: 'Atún en Agua', 
        brand: 'Tuny Premium', 
        category: 'Enlatados', 
        standardPortion: '1 lata (100g drenado)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 97, protein: 22.0, carbs: 0.0, fat: 1.0 } 
    },

    // ============================================================
    // FRUTAS
    // ============================================================
    { 
        id: 'fresas', 
        name: 'Fresas', 
        brand: 'Genérico', 
        category: 'Frutas', 
        standardPortion: '100g', 
        rawWeightG: 100, 
        macrosPerPortion: { kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3 } 
    },
    {
        id: 'guayaba',
        name: 'Guayaba',
        brand: 'Genérico',
        category: 'Frutas',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 68, protein: 2.6, carbs: 14.0, fat: 1.0 }
    },
    { 
        id: 'limon', 
        name: 'Limón (Jugo)', 
        brand: 'Genérico', 
        category: 'Frutas', 
        standardPortion: '2 Limones (30ml)', 
        rawWeightG: 30, 
        macrosPerPortion: { kcal: 12, protein: 0.2, carbs: 3.0, fat: 0.0 } 
    },
    { 
        id: 'manzana', 
        name: 'Manzana', 
        brand: 'Genérico', 
        category: 'Frutas', 
        standardPortion: '1 Pieza (180g)', 
        rawWeightG: 180, 
        macrosPerPortion: { kcal: 94, protein: 0.5, carbs: 24.8, fat: 0.3 } 
    },
    {
        id: 'papaya',
        name: 'Papaya Picada',
        brand: 'Genérico',
        category: 'Frutas',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 43, protein: 0.5, carbs: 11.0, fat: 0.3 }
    },
    { 
        id: 'platano', 
        name: 'Plátano (Tabasco)', 
        brand: 'Genérico', 
        category: 'Frutas', 
        standardPortion: '1 Pieza (120g)', 
        rawWeightG: 120, 
        macrosPerPortion: { kcal: 107, protein: 1.3, carbs: 27.6, fat: 0.4 } 
    },
    { 
        id: 'platano-macho-frito', 
        name: 'Plátano Macho Frito', 
        brand: 'Genérico', 
        category: 'Frutas', 
        standardPortion: '1/2 Pieza (80g)', 
        cookedWeightG: 80, 
        macrosPerPortion: { kcal: 150, protein: 1.0, carbs: 25.0, fat: 6.0 } 
    },
    {
        id: 'sandia',
        name: 'Sandía Picada',
        brand: 'Genérico',
        category: 'Frutas',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 30, protein: 0.6, carbs: 7.6, fat: 0.2 } 
    },

    // ============================================================
    // GRASAS Y ACEITES
    // ============================================================
    { 
        id: 'aceite-cocina', 
        name: 'Aceite (Cualquiera)', 
        brand: 'Genérico', 
        category: 'Grasas y Aceites', 
        standardPortion: '1 Cdita (5g)', 
        rawWeightG: 5, 
        macrosPerPortion: { kcal: 43, protein: 0, carbs: 0, fat: 5.0 } 
    },
    { 
        id: 'aguacate', 
        name: 'Aguacate Hass', 
        brand: 'Genérico', 
        category: 'Grasas y Aceites', 
        standardPortion: '1/2 Pieza (100g)', 
        rawWeightG: 100, 
        macrosPerPortion: { kcal: 160, protein: 2.0, carbs: 8.5, fat: 14.7 } 
    },
    { 
        id: 'crema-cacahuate-kirkland', 
        name: 'Crema de Cacahuate', 
        brand: 'Kirkland', 
        category: 'Grasas y Aceites', 
        standardPortion: '1 cda (15g)', 
        rawWeightG: 15, 
        macrosPerPortion: { kcal: 89, protein: 3.6, carbs: 2.0, fat: 7.4 } 
    },
    { 
        id: 'manteca-cerdo', 
        name: 'Manteca de Cerdo', 
        brand: 'Genérico', 
        category: 'Grasas y Aceites', 
        standardPortion: '1 Cda (13g)', 
        rawWeightG: 13, 
        macrosPerPortion: { kcal: 115, protein: 0, carbs: 0, fat: 13.0 } 
    },
    { 
        id: 'mayonesa', 
        name: 'Mayonesa', 
        brand: 'Genérico', 
        category: 'Grasas y Aceites', 
        standardPortion: '1 Cda (15g)', 
        rawWeightG: 15, 
        macrosPerPortion: { kcal: 100, protein: 0.2, carbs: 0.5, fat: 11.0 } 
    },

    // ============================================================
    // HUEVO Y LÁCTEOS
    // ============================================================
    {
        id: 'clara-generica',
        name: 'Clara de Huevo (Separada)',
        brand: 'Genérico',
        category: 'Huevo y Lácteos',
        standardPortion: '1 Clara (~33g)',
        rawWeightG: 33,
        cookedWeightG: 33,
        macrosPerPortion: { kcal: 17, protein: 3.6, carbs: 0.2, fat: 0.0 }
    },
    { 
        id: 'claras-san-juan', 
        name: 'Claras de Huevo', 
        brand: 'San Juan', 
        category: 'Huevo y Lácteos', 
        standardPortion: '150 ml (150g)', 
        rawWeightG: 150, 
        macrosPerPortion: { kcal: 60, protein: 15.0, carbs: 0.0, fat: 0.0 } 
    },
    { 
        id: 'crema-rancho', 
        name: 'Crema de Rancho (Espesa)', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '1 Cda (15g)', 
        rawWeightG: 15, 
        macrosPerPortion: { kcal: 50, protein: 0.4, carbs: 0.6, fat: 5.0 } 
    },
    { 
        id: 'huevo-entero-generico', 
        name: 'Huevo Entero (1 Pza)', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '1 Pieza (50g)', 
        rawWeightG: 50, 
        cookedWeightG: 50, 
        macrosPerPortion: { kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8 } 
    },
    { 
        id: 'leche-entera-generica', 
        name: 'Leche Entera', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '1 Taza (250ml)', 
        rawWeightG: 250, 
        macrosPerPortion: { kcal: 150, protein: 8.0, carbs: 12.0, fat: 8.0 } 
    },
    { 
        id: 'leche-lala-100', 
        name: 'Leche Lala 100 - Dorada', 
        brand: 'Lala', 
        category: 'Huevo y Lácteos', 
        standardPortion: '1 taza (250ml)', 
        rawWeightG: 250, 
        macrosPerPortion: { kcal: 136, protein: 13.5, carbs: 8.4, fat: 5.4 } 
    },
    {
        id: 'leche-lala-100-light',
        name: 'Leche Lala 100 Light - Gris',
        brand: 'Lala', 
        category: 'Huevo y Lácteos', 
        standardPortion: '1 taza (250ml)', 
        rawWeightG: 250, 
        macrosPerPortion: { kcal: 105, protein: 13.5, carbs: 8.4, fat: 2.5 } 
    },
    { 
        id: 'queso-adobera', 
        name: 'Queso Adobera (Fundir)', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 300, protein: 21.0, carbs: 2.0, fat: 23.0 } 
    },
    { 
        id: 'queso-cotija', 
        name: 'Queso Cotija (Seco)', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 380, protein: 25.0, carbs: 2.0, fat: 30.0 } 
    },
    {
        id: 'queso-mesa-seco',
        name: 'Queso de Mesa / Ranchero Seco',
        brand: 'Genérico',
        category: 'Huevo y Lácteos',
        standardPortion: '100g',
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 340, protein: 24.0, carbs: 2.0, fat: 26.0 } 
    },
    { 
        id: 'queso-oaxaca', 
        name: 'Queso Oaxaca / Hebra', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 310, protein: 22.0, carbs: 2.0, fat: 24.0 } 
    },
    { 
        id: 'queso-panela', 
        name: 'Queso Panela (Cremería)', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 205, protein: 17.0, carbs: 2.0, fat: 14.0 } 
    },
    { 
        id: 'requeson', 
        name: 'Requesón', 
        brand: 'Genérico', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 110, protein: 13.0, carbs: 3.0, fat: 5.0 } 
    },
    { 
        id: 'yogurt-oikos-pro', 
        name: 'Yogurt Griego Pro', 
        brand: 'Oikos', 
        category: 'Huevo y Lácteos', 
        standardPortion: '100g', 
        rawWeightG: 100, 
        macrosPerPortion: { kcal: 89, protein: 10.1, carbs: 8.3, fat: 1.8 } 
    },
    {
        id: 'yogurt-oikos-select',
        name: 'Yogurt Oikos Select (Monk Fruit)',
        brand: 'Oikos',
        category: 'Huevo y Lácteos',
        standardPortion: '150g',
        rawWeightG: 150,
        macrosPerPortion: { kcal: 140, protein: 11.1, carbs: 13.4, fat: 4.7 }
    },

    // ============================================================
    // LEGUMBRES
    // ============================================================
    { 
        id: 'frijoles-olla', 
        name: 'Frijoles de la Olla', 
        brand: 'Genérico', 
        category: 'Legumbres', 
        standardPortion: '100g (Cocido) (~35g Crudo)', 
        rawWeightG: 35, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 130, protein: 8.0, carbs: 23.0, fat: 0.5 } 
    },
    { 
        id: 'frijoles-puercos', 
        name: 'Frijoles Puercos (Con Chorizo)', 
        brand: 'Genérico', 
        category: 'Legumbres', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 245, protein: 7.0, carbs: 18.0, fat: 16.0 } 
    },
    { 
        id: 'frijoles-refritos', 
        name: 'Frijoles Refritos (Caseros)', 
        brand: 'Genérico', 
        category: 'Legumbres', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 160, protein: 6.0, carbs: 18.0, fat: 6.0 } 
    },
    { 
        id: 'lentejas', 
        name: 'Lentejas Cocidas', 
        brand: 'Genérico', 
        category: 'Legumbres', 
        standardPortion: '100g (Cocido) (~35g Crudo)', 
        rawWeightG: 35, 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 116, protein: 9.0, carbs: 20.0, fat: 0.4 } 
    },
    {
        id: 'soya-texturizada',
        name: 'Soya Texturizada (Hidratada)',
        brand: 'Genérico',
        category: 'Legumbres',
        standardPortion: '100g (Peso Hidratado)',
        rawWeightG: 30,
        cookedWeightG: 100,
        macrosPerPortion: { kcal: 110, protein: 16.0, carbs: 10.0, fat: 0.5 } 
    },

    // ============================================================
    // PANADERÍA
    // ============================================================
    { 
        id: 'birote-salado', 
        name: 'Birote Salado (GDL)', 
        brand: 'Genérico', 
        category: 'Panadería', 
        standardPortion: '1 Pieza (80g)', 
        cookedWeightG: 80, 
        macrosPerPortion: { kcal: 270, protein: 8.0, carbs: 55.0, fat: 1.0 } 
    },
    { 
        id: 'bolillo', 
        name: 'Bolillo / Fleima', 
        brand: 'Genérico', 
        category: 'Panadería', 
        standardPortion: '1 Pieza (60g)', 
        cookedWeightG: 60, 
        macrosPerPortion: { kcal: 200, protein: 6.0, carbs: 42.0, fat: 1.0 } 
    },
    {
        id: 'pan-dulce-concha',
        name: 'Pan Dulce (Concha)',
        brand: 'Genérico',
        category: 'Panadería',
        standardPortion: '1 Pieza (60g)',
        cookedWeightG: 60, 
        macrosPerPortion: { kcal: 280, protein: 6.0, carbs: 35.0, fat: 12.0 } 
    },
    { 
        id: 'pan-integral-bimbo', 
        name: 'Pan Integral', 
        brand: 'Bimbo', 
        category: 'Panadería', 
        standardPortion: '2 rebanadas (62g)', 
        cookedWeightG: 62, 
        macrosPerPortion: { kcal: 135, protein: 6.6, carbs: 23.1, fat: 1.8 } 
    },
    {
        id: 'pan-tostado-integral',
        name: 'Pan Tostado Integral',
        brand: 'Bimbo',
        category: 'Panadería',
        standardPortion: '1 Rebanada (~18g)',
        cookedWeightG: 18,
        macrosPerPortion: { kcal: 68, protein: 2.3, carbs: 12.5, fat: 1.0 }
    },

    // ============================================================
    // PESCADERÍA
    // ============================================================
    { 
        id: 'pescado-atun-fresco', 
        name: 'Atún Fresco (Medallón)', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g Crudo (~75g Cocido)', 
        rawWeightG: 100, 
        cookedWeightG: 75, 
        macrosPerPortion: { kcal: 110, protein: 24.0, carbs: 0.0, fat: 1.0 } 
    },
    { 
        id: 'camaron-crudo', 
        name: 'Camarones (Crudos)', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g Crudo (~70g Cocido)', 
        rawWeightG: 100, 
        cookedWeightG: 70, 
        macrosPerPortion: { kcal: 85, protein: 20.0, carbs: 0.0, fat: 0.5 } 
    },
    { 
        id: 'pescado-salmon', 
        name: 'Filete Salmón', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g Crudo (~75g Cocido)', 
        rawWeightG: 100, 
        cookedWeightG: 75, 
        macrosPerPortion: { kcal: 208, protein: 20.0, carbs: 0.0, fat: 13.0 } 
    },
    { 
        id: 'pescado-tilapia', 
        name: 'Filete Tilapia / Blanco', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g Crudo (~75g Cocido)', 
        rawWeightG: 100, 
        cookedWeightG: 75, 
        macrosPerPortion: { kcal: 95, protein: 20.0, carbs: 0.0, fat: 1.7 } 
    },
    { 
        id: 'pulpo-cocido', 
        name: 'Pulpo (Cocido)', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 140, protein: 25.0, carbs: 2.0, fat: 2.0 } 
    },
    { 
        id: 'surimi', 
        name: 'Surimi (Barra)', 
        brand: 'Genérico', 
        category: 'Pescadería', 
        standardPortion: '100g', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 100, protein: 8.0, carbs: 15.0, fat: 0.5 } 
    },

    // ============================================================
    // SEMILLAS Y FRUTOS SECOS
    // ============================================================
    {
        id: 'almendras',
        name: 'Almendras',
        brand: 'Genérico', 
        category: 'Semillas y Frutos Secos',
        standardPortion: '10 piezas (12g)',
        rawWeightG: 12,
        macrosPerPortion: { kcal: 70, protein: 2.5, carbs: 2.5, fat: 6 } 
    },
    { 
        id: 'cacahuates', 
        name: 'Cacahuates (Japonés/Salado)', 
        brand: 'Genérico', 
        category: 'Semillas y Frutos Secos', 
        standardPortion: '1 bolsita (40g)', 
        rawWeightG: 40, 
        macrosPerPortion: { kcal: 240, protein: 10.0, carbs: 12.0, fat: 20.0 } 
    },
    {
        id: 'mix-nueces-members',
        name: 'Mix de Nueces',
        brand: 'Member\'s Mark',
        category: 'Semillas y Frutos Secos',
        standardPortion: '30g (Un puño)',
        rawWeightG: 30,
        macrosPerPortion: { kcal: 156, protein: 6.5, carbs: 3.2, fat: 13.0 } 
    },
    { 
        id: 'nueces', 
        name: 'Nuez', 
        brand: 'Genérico', 
        category: 'Semillas y Frutos Secos', 
        standardPortion: '30g', 
        rawWeightG: 30, 
        macrosPerPortion: { kcal: 196, protein: 4.6, carbs: 4.1, fat: 19.6 } 
    },
    {
        id: 'semillas-chia-secas',
        name: 'Semillas de Chía',
        brand: 'Genérico',
        category: 'Semillas y Frutos Secos',
        standardPortion: '1 cda (10g)',
        rawWeightG: 10,
        macrosPerPortion: { kcal: 49, protein: 1.6, carbs: 4, fat: 3 } 
    },
    {
        id: 'semillas-chia', // Duplicate check - renaming or replacing if needed, keeping distinct ID if logic requires
        name: 'Semillas de Chía (Secas)',
        brand: 'Genérico',
        category: 'Semillas y Frutos Secos',
        standardPortion: '1 Cda (10g)',
        rawWeightG: 10,
        macrosPerPortion: { kcal: 49, protein: 1.7, carbs: 4.2, fat: 3.1 } 
    },

    // ============================================================
    // SUPLEMENTOS
    // ============================================================
    { 
        id: 'barra-wild', 
        name: 'Barra de Proteína', 
        brand: 'Wild Protein', 
        category: 'Suplementos', 
        standardPortion: '1 barra (45g)', 
        rawWeightG: 45, 
        macrosPerPortion: { kcal: 130, protein: 15.4, carbs: 9.6, fat: 3.3 } 
    },
    { 
        id: 'cacao-polvo', 
        name: 'Cacao en Polvo', 
        brand: 'Genérico', 
        category: 'Suplementos', 
        standardPortion: '1 cda (10g)', 
        rawWeightG: 10, 
        macrosPerPortion: { kcal: 27, protein: 2.3, carbs: 1.4, fat: 1.4 } 
    },
    { 
        id: 'creatina', 
        name: 'Creatina Monohidratada', 
        brand: 'Genérico', 
        category: 'Suplementos', 
        standardPortion: '1 Scoop (5g)', 
        rawWeightG: 5, 
        macrosPerPortion: { kcal: 0, protein: 0, carbs: 0, fat: 0 } 
    },
    { 
        id: 'espirulina', 
        name: 'Espirulina', 
        brand: 'Genérico', 
        category: 'Suplementos', 
        standardPortion: '1 cdita (5g)', 
        rawWeightG: 5, 
        macrosPerPortion: { kcal: 19, protein: 3.2, carbs: 1.5, fat: 0 } 
    },
    { 
        id: 'maca-peruana', 
        name: 'Maca Peruana', 
        brand: 'Genérico', 
        category: 'Suplementos', 
        standardPortion: '1 cdita (5g)', 
        rawWeightG: 5, 
        macrosPerPortion: { kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1 } 
    },
    { 
        id: 'whey-protein-on', 
        name: 'Whey Protein', 
        brand: 'ON (Optimum Nutrition)', 
        category: 'Suplementos', 
        standardPortion: '1 scoop (30g)', 
        rawWeightG: 30, 
        macrosPerPortion: { kcal: 111, protein: 24.0, carbs: 1.6, fat: 1.0 } 
    },

    // ============================================================
    // TORTILLAS Y MAÍZ
    // ============================================================
    {
        id: 'elote-granos',
        name: 'Elote / Esquite (Granos)',
        brand: 'Genérico',
        category: 'Tortillas y Maíz',
        standardPortion: '1 Taza (160g)',
        cookedWeightG: 160,
        macrosPerPortion: { kcal: 140, protein: 5.0, carbs: 30.0, fat: 2.0 } 
    },
    { 
        id: 'masa-maiz-base', 
        name: 'Masa en Comal (Gorditas/Huaraches)', 
        brand: 'Genérico', 
        category: 'Tortillas y Maíz', 
        standardPortion: '100g Cruda (~85g Cocida comal)', 
        rawWeightG: 100, 
        cookedWeightG: 85,
        macrosPerPortion: { kcal: 230, protein: 4.0, carbs: 50.0, fat: 1.5 } 
    },
    { 
        id: 'masa-frita-gordita', 
        name: 'Masa Frita (Sope/Quesadilla)', 
        brand: 'Puesto Calle', 
        category: 'Tortillas y Maíz', 
        standardPortion: '100g (Ya cocinado/frito)', 
        cookedWeightG: 100, 
        macrosPerPortion: { kcal: 465, protein: 6.0, carbs: 60.0, fat: 22.5 } 
    },
    { 
        id: 'tortilla-hecha-a-mano', 
        name: 'Tortilla Hecha a Mano', 
        brand: 'Genérico', 
        category: 'Tortillas y Maíz', 
        standardPortion: '1 Pieza (50g)', 
        cookedWeightG: 50, 
        macrosPerPortion: { kcal: 110, protein: 2.5, carbs: 22.0, fat: 1.0 } 
    },
    { 
        id: 'tortilla-maiz', 
        name: 'Tortilla de Maíz', 
        brand: 'Genérico', 
        category: 'Tortillas y Maíz', 
        standardPortion: '1 Pieza (25g)', 
        cookedWeightG: 25, 
        macrosPerPortion: { kcal: 54, protein: 1.25, carbs: 10.8, fat: 0.4 } 
    },
    { 
        id: 'tortilla-taquera', 
        name: 'Tortilla Taquera (Pequeña)', 
        brand: 'Genérico', 
        category: 'Tortillas y Maíz', 
        standardPortion: '1 Pieza (15g)', 
        cookedWeightG: 15, 
        macrosPerPortion: { kcal: 33, protein: 0.8, carbs: 6.8, fat: 0.3 } 
    },
    { 
        id: 'tostada-deshidratada', 
        name: 'Tostada Deshidratada (Horneada)', 
        brand: 'Genérico / Sanissimo', 
        category: 'Tortillas y Maíz', 
        standardPortion: '1 Pieza (12g)', 
        cookedWeightG: 12, 
        macrosPerPortion: { kcal: 45, protein: 1.0, carbs: 9.0, fat: 0.5 } 
    },
    { 
        id: 'tostada-frita', 
        name: 'Tostada Frita', 
        brand: 'Genérico', 
        category: 'Tortillas y Maíz', 
        standardPortion: '1 Pieza (15g)', 
        cookedWeightG: 15, 
        macrosPerPortion: { kcal: 75, protein: 1.0, carbs: 9.0, fat: 4.0 } 
    },

    // ============================================================
    // VERDURAS
    // ============================================================
    {
        id: 'brocoli-picado',
        name: 'Brócoli',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4 } 
    },
    {
        id: 'calabacita',
        name: 'Calabacita (Cruda)',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 17, protein: 1.2, carbs: 3.0, fat: 0.3 } 
    },
    {
        id: 'cebolla',
        name: 'Cebolla Blanca',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 40, protein: 1.1, carbs: 9.0, fat: 0.1 } 
    },
    { 
        id: 'jitomate', 
        name: 'Jitomate', 
        brand: 'Genérico', 
        category: 'Verduras', 
        standardPortion: '1 Pieza (120g)', 
        rawWeightG: 120, 
        macrosPerPortion: { kcal: 22, protein: 1.1, carbs: 4.7, fat: 0.2 } 
    },
    {
        id: 'lechuga',
        name: 'Lechuga (Romana/Orejana)',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2 } 
    },
    { 
        id: 'nopales', 
        name: 'Nopales', 
        brand: 'Genérico', 
        category: 'Verduras', 
        standardPortion: '1 Taza (150g)', 
        cookedWeightG: 150, 
        macrosPerPortion: { kcal: 22, protein: 2.0, carbs: 4.9, fat: 0.1 } 
    },
    {
        id: 'pepino',
        name: 'Pepino (Con Cáscara)',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1 } 
    },
    {
        id: 'verduras-mixtas',
        name: 'Verduras Mixtas (Congeladas)',
        brand: 'Genérico',
        category: 'Verduras',
        standardPortion: '100g',
        rawWeightG: 100,
        macrosPerPortion: { kcal: 60, protein: 3.0, carbs: 13.0, fat: 0.5 } 
    },

    // ============================================================
    // UNTABLES / EXTRAS
    // ============================================================
    {
        id: 'cajeta-sayula',
        name: 'Cajeta Sayula',
        brand: 'Sayula',
        category: 'Untables / Extras',
        standardPortion: '15 g (1 Cucharada Sopera rasa)',
        rawWeightG: 15,
        macrosPerPortion: { kcal: 55, protein: 1.0, carbs: 12.0, fat: 1.0 }
    }
];
