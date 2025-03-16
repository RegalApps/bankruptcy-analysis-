
export const simulateProcessingStages = async (isForm76: boolean, isExcel: boolean): Promise<void> => {
  // Initial validation stage (fast)
  await new Promise(r => setTimeout(r, 1000));
  
  // Upload stage (slow)
  await new Promise(r => setTimeout(r, 2000));
  
  // Processing stages (variable time based on document type)
  if (isForm76) {
    await new Promise(r => setTimeout(r, 3000));
  } else if (isExcel) {
    await new Promise(r => setTimeout(r, 2500));
  } else {
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (isForm76) {
    // Compliance risk assessment
  } else if (isExcel) {
    // Financial data pattern analysis
  } else {
    // Document key information extraction
  }
  await new Promise(r => setTimeout(r, 2500));
  
  // Organization and finalization
  await new Promise(r => setTimeout(r, 2000));
  await new Promise(r => setTimeout(r, 1500));
};
