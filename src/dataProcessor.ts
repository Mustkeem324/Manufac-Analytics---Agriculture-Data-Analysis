// src/dataProcessor.ts
import rawData from './Manufac_India_Agro_Dataset.json';

interface CropData {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': number | string;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': number | string;
  'Area Under Cultivation (UOM:Ha(Hectares))': number | string;
}

interface YearlyProduction {
  year: string;
  maxCrop: string;
  minCrop: string;
}

interface CropAverage {
  crop: string;
  avgYield: number;
  avgArea: number;
}

const processData = (): { yearlyProduction: YearlyProduction[], cropAverages: CropAverage[] } => {
  const cropData: CropData[] = rawData as CropData[];

  console.log("Raw data loaded:", cropData); // Debug: Check raw data

  const yearlyProduction: YearlyProduction[] = [];
  const cropYieldAreaMap: { [key: string]: { totalYield: number, totalArea: number, count: number } } = {};

  cropData.forEach(item => {
    const year = item.Year.split(' ')[3];
    const production = parseFloat(item['Crop Production (UOM:t(Tonnes))'].toString()) || 0;
    const yieldValue = parseFloat(item['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'].toString()) || 0;
    const area = parseFloat(item['Area Under Cultivation (UOM:Ha(Hectares))'].toString()) || 0;
    const crop = item['Crop Name'];

    // Debug: Log each processed item
    console.log(`Processed item - Year: ${year}, Crop: ${crop}, Production: ${production}, Yield: ${yieldValue}, Area: ${area}`);

    // Update yearly production data
    const yearlyEntry = yearlyProduction.find(entry => entry.year === year);
    if (yearlyEntry) {
      if (production > parseFloat(cropData.find(c => c['Crop Name'] === yearlyEntry.maxCrop && c.Year.split(' ')[3] === year)?.['Crop Production (UOM:t(Tonnes))'].toString() || '0')) {
        yearlyEntry.maxCrop = crop;
      }
      if (production < parseFloat(cropData.find(c => c['Crop Name'] === yearlyEntry.minCrop && c.Year.split(' ')[3] === year)?.['Crop Production (UOM:t(Tonnes))'].toString() || 'Infinity')) {
        yearlyEntry.minCrop = crop;
      }
    } else {
      yearlyProduction.push({ year, maxCrop: crop, minCrop: crop });
    }

    // Update crop averages data
    if (!cropYieldAreaMap[crop]) {
      cropYieldAreaMap[crop] = { totalYield: 0, totalArea: 0, count: 0 };
    }
    cropYieldAreaMap[crop].totalYield += yieldValue;
    cropYieldAreaMap[crop].totalArea += area;
    cropYieldAreaMap[crop].count += 1;
  });

  const cropAverages = Object.keys(cropYieldAreaMap).map(crop => ({
    crop,
    avgYield: parseFloat((cropYieldAreaMap[crop].totalYield / cropYieldAreaMap[crop].count).toFixed(3)),
    avgArea: parseFloat((cropYieldAreaMap[crop].totalArea / cropYieldAreaMap[crop].count).toFixed(3)),
  }));

  // Debug: Log results
  console.log("Yearly production:", yearlyProduction);
  console.log("Crop averages:", cropAverages);

  return { yearlyProduction, cropAverages };
};

export default processData;
