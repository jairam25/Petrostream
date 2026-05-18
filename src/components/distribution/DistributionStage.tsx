import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Ship, Train, Truck, Warehouse, Plane, Scale, BookOpen, Network } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRefining, useDistribution } from '../../store/hooks';
import {
    totalDeliveredCost,
    safetyStock,
    daysOfCover,
    reorderPoint,
    seasonalDemandIndex,
    hubSpokeEfficiency,
    networkUtilization,
    batchSizeRequired,
    transmixVolume,
    interfaceLengthFeet,
    pipelineTransitTimeHours,
    pipelineLinefill,
    batchCycleDays,
    pipelineRevenuePerBbl,
    pipelineUtilization,
    sequenceCompatibility,
    interfaceDetectorDelta,
    voyageTimeDays,
    freightCostPerBbl,
    demurrageCost,
    fleetUtilization,
    trainCycleDays,
    railFleetSize,
    unitTrainCostPerBbl,
    loadsPerDayPerLane,
    deliveryCostPerGallon,
    routeMilesPerTrip,
    truckFleetSize,
    truckUtilizationRate,
    hosComplianceCheck,
    terminalThroughput,
    rackLanesRequired,
    tankInventoryDays,
    gainLossReconciliation,
    turnoverRate,
    tankSwitchFrequency,
    vaporRecoveryEfficiency,
    terminalOPEXPerBbl,
    additiveInjectionRate,
    filtrationEfficiency,
    safBlendRatio,
    staticDissipaterDosage,
    fuelFarmDaysOfSupply,
    intoPlaneFuelingCost,
    jftotDeltaP,
    rackPriceBreakdown,
    totalTaxPerGallon,
    exchangeDifferential,
    disruptionExpectedCost,
    carbonTaxCost,
    rinComplianceCost,
    biofuelBlendMargin,
    totalDeliveredCostPerGallon,
    spotVsContractMargin,
    formulaPrice,
    storageArbitrage,
    productMarginWaterfall,
} from '../../lib/distribution';
import DistributionSVGs from './DistributionSVGs';

type DistributionSubTab = 'supply-chain' | 'pipelines' | 'marine' | 'rail' | 'truck' | 'terminal' | 'aviation' | 'commercial' | 'references';

const subTabs: { id: DistributionSubTab; label: string; icon: React.FC<{ size?: number }> }[] = [
    { id: 'supply-chain', label: 'Supply Chain', icon: Network },
    { id: 'pipelines', label: 'Pipelines', icon: ArrowRight },
    { id: 'marine', label: 'Marine', icon: Ship },
    { id: 'rail', label: 'Rail', icon: Train },
    { id: 'truck', label: 'Truck', icon: Truck },
    { id: 'terminal', label: 'Terminal Ops', icon: Warehouse },
    { id: 'aviation', label: 'Aviation Fuel', icon: Plane },
    { id: 'commercial', label: 'Commercial', icon: Scale },
    { id: 'references', label: 'References', icon: BookOpen },
];

export default function DistributionStage() {
    const [activeSubTab, setActiveSubTab] = useState<DistributionSubTab>('supply-chain');

    // ─── Data flow: read refining products → seed distribution inputs ───
    const { data: refining } = useRefining();
    const { data: distData, update: updateDist } = useDistribution();

    // ─── Supply Chain State ───
    const [scProductCost, setScProductCost] = useState(72);
    const [scPipelineTariff, setScPipelineTariff] = useState(3.5);
    const [scTerminalFee, setScTerminalFee] = useState(1.8);
    const [scTruckFreight, setScTruckFreight] = useState(4.2);
    const [scStorageCost, setScStorageCost] = useState(0.9);
    const [scCarryingCost, setScCarryingCost] = useState(0.6);
    const [scAvgDemand, setScAvgDemand] = useState(250000);
    const [scLeadTime, setScLeadTime] = useState(7);
    const [scDemandStdDev, setScDemandStdDev] = useState(35000);
    const [scServiceZ, setScServiceZ] = useState(1.645);
    const [scTotalInv, setScTotalInv] = useState(2200000);
    const [scMonth, setScMonth] = useState(6);
    const [scSeasonalAmplitude, setScSeasonalAmplitude] = useState(15);
    const [scDirectCost, setScDirectCost] = useState(7.5);
    const [scHubSpokeCost, setScHubSpokeCost] = useState(5.8);
    const [scThroughput, setScThroughput] = useState(380000);
    const [scDesignCap, setScDesignCap] = useState(500000);

    const deliveredCost = useMemo(() => totalDeliveredCost(scProductCost, scPipelineTariff, scTerminalFee, scTruckFreight, scStorageCost, scCarryingCost), [scProductCost, scPipelineTariff, scTerminalFee, scTruckFreight, scStorageCost, scCarryingCost]);
    const safetystock = useMemo(() => safetyStock(scAvgDemand, scLeadTime, scDemandStdDev, scServiceZ), [scAvgDemand, scLeadTime, scDemandStdDev, scServiceZ]);
    const doc = useMemo(() => daysOfCover(scTotalInv, scAvgDemand), [scTotalInv, scAvgDemand]);
    const rop = useMemo(() => reorderPoint(scAvgDemand, scLeadTime, safetystock), [scAvgDemand, scLeadTime, safetystock]);
    const seasonalDemand = useMemo(() => seasonalDemandIndex(scMonth, scAvgDemand, scSeasonalAmplitude), [scMonth, scAvgDemand, scSeasonalAmplitude]);
    const hubEff = useMemo(() => hubSpokeEfficiency(scDirectCost, scHubSpokeCost), [scDirectCost, scHubSpokeCost]);
    const netUtil = useMemo(() => networkUtilization(scThroughput, scDesignCap), [scThroughput, scDesignCap]);

    // ─── Pipeline State ───
    const [plDemandVol, setPlDemandVol] = useState(500000);
    const [plCycleDays, setPlCycleDays] = useState(10);
    const [plSafetyFactor, setPlSafetyFactor] = useState(0.15);
    const [plDiameter, setPlDiameter] = useState(24);
    const [plLength, setPlLength] = useState(350);
    const [plReynolds, setPlReynolds] = useState(250000);
    const [plSchmidt, setPlSchmidt] = useState(800);
    const [plFlowRate, setPlFlowRate] = useState(200000);
    const [plTariff, setPlTariff] = useState(3.5);
    const [plThroughput, setPlThroughput] = useState(200000);
    const [plNameplate, setPlNameplate] = useState(250000);
    const [plProductA, setPlProductA] = useState<'gasoline' | 'diesel' | 'jet' | 'fuelOil' | 'naphtha' | 'ethanol'>('gasoline');
    const [plProductB, setPlProductB] = useState<'gasoline' | 'diesel' | 'jet' | 'fuelOil' | 'naphtha' | 'ethanol'>('diesel');
    const [plApi1, setPlApi1] = useState(58);
    const [plApi2, setPlApi2] = useState(38);

    const batchSize = useMemo(() => batchSizeRequired(plDemandVol, plCycleDays, plSafetyFactor), [plDemandVol, plCycleDays, plSafetyFactor]);
    const transmix = useMemo(() => transmixVolume(plDiameter, plLength, plReynolds), [plDiameter, plLength, plReynolds]);
    const ifLength = useMemo(() => interfaceLengthFeet(plDiameter, plReynolds, plSchmidt), [plDiameter, plReynolds, plSchmidt]);
    const transitTime = useMemo(() => pipelineTransitTimeHours(plLength, plFlowRate, plDiameter), [plLength, plFlowRate, plDiameter]);
    const linefill = useMemo(() => pipelineLinefill(plDiameter, plLength), [plDiameter, plLength]);
    const batchCyc = useMemo(() => batchCycleDays(linefill, plThroughput, 4), [linefill, plThroughput]);
    const plRevenue = useMemo(() => pipelineRevenuePerBbl(plTariff, plThroughput), [plTariff, plThroughput]);
    const plUtil = useMemo(() => pipelineUtilization(plThroughput, plNameplate), [plThroughput, plNameplate]);
    const seqCompat = useMemo(() => sequenceCompatibility(plProductA, plProductB), [plProductA, plProductB]);
    const ifDelta = useMemo(() => interfaceDetectorDelta(plApi1, plApi2), [plApi1, plApi2]);

    // ─── Marine State ───
    const [marDist, setMarDist] = useState(4500);
    const [marSpeed, setMarSpeed] = useState(14.5);
    const [marPortTime, setMarPortTime] = useState(3);
    const [marWSFlat, setMarWSFlat] = useState(18);
    const [marWSPct, setMarWSPct] = useState(75);
    const [marCargoSize, setMarCargoSize] = useState(600000);
    const [marCharterRate, setMarCharterRate] = useState(45000);
    const [marPortCharges, setMarPortCharges] = useState(85000);
    const [marBunkerCost, setMarBunkerCost] = useState(650);
    const [marBunkerConsumption, setMarBunkerConsumption] = useState(55);
    const [marDemurrageRate, setMarDemurrageRate] = useState(32000);
    const [marMonthlyVol, setMarMonthlyVol] = useState(2400000);
    const [marLoadPort, setMarLoadPort] = useState(2);
    const [marDischargePort, setMarDischargePort] = useState(2);
    const [marFreeLaytime, setMarFreeLaytime] = useState(4);
    const [marUsedLaytime, setMarUsedLaytime] = useState(5.5);
    const [marFleetDays, setMarFleetDays] = useState(30);

    const transitDays = useMemo(() => voyageTimeDays(marDist, marSpeed, marPortTime), [marDist, marSpeed, marPortTime]);
    const voyageFreq = useMemo(() => marMonthlyVol / marCargoSize, [marMonthlyVol, marCargoSize]);
    const marFleetCalc = useMemo(() => Math.ceil(transitDays * voyageFreq / 30), [transitDays, voyageFreq]);
    const demDays = useMemo(() => marUsedLaytime - marFreeLaytime, [marUsedLaytime, marFreeLaytime]);
    const demCost = useMemo(() => demurrageCost(marDemurrageRate, demDays), [marDemurrageRate, demDays]);
    const marFreightCost = useMemo(() => freightCostPerBbl(marWSFlat, marWSPct, marCargoSize), [marWSFlat, marWSPct, marCargoSize]);
    const marUtil = useMemo(() => fleetUtilization(marFleetDays, marFleetDays), [marFleetDays]);

    // ─── Rail State ───
    const [rlDist, setRlDist] = useState(1200);
    const [rlSpeed, setRlSpeed] = useState(22);
    const [rlYardTime, setRlYardTime] = useState(2.5);
    const [rlCarCap, setRlCarCap] = useState(700);
    const [rlTrainset, setRlTrainset] = useState(100);
    const [rlLeaseRate, setRlLeaseRate] = useState(850);
    const [rlFuelSurcharge, setRlFuelSurcharge] = useState(0.42);
    const [rlTransloadFee, setRlTransloadFee] = useState(1.25);
    const [rlMonthlyVol2, setRlMonthlyVol2] = useState(600000);
    const [rlDemurrageRate2, setRlDemurrageRate2] = useState(75);
    const [rlDemurrageDays2, setRlDemurrageDays2] = useState(3);
    // Additional rail params needed by trainCycleDays
    const [rlLoadingDays, setRlLoadingDays] = useState(1.0);
    const [rlUnloadingDays, setRlUnloadingDays] = useState(1.0);
    const [rlInspectionDays, setRlInspectionDays] = useState(0.5);

    const railCycle = useMemo(() => trainCycleDays(rlDist / rlSpeed / 24, rlLoadingDays, rlUnloadingDays, rlInspectionDays), [rlDist, rlSpeed, rlLoadingDays, rlUnloadingDays, rlInspectionDays]);
    const railFleet = useMemo(() => railFleetSize(rlMonthlyVol2 / 30, rlCarCap, railCycle, rlTrainset), [rlMonthlyVol2, rlCarCap, railCycle, rlTrainset]);
    const railCost = useMemo(() => unitTrainCostPerBbl(rlLeaseRate, railCycle, rlCarCap, rlFuelSurcharge, rlTrainset, rlMonthlyVol2), [rlLeaseRate, railCycle, rlCarCap, rlFuelSurcharge, rlTrainset, rlMonthlyVol2]);

    // ─── Truck State ───
    const [tkDailyVol, setTkDailyVol] = useState(42000);
    const [tkTruckCap, setTkTruckCap] = useState(9000);
    const [tkTripsPerDay, setTkTripsPerDay] = useState(2);
    const [tkOneWay, setTkOneWay] = useState(45);
    const [tkDetour, setTkDetour] = useState(8);
    const [tkLeaseCost, setTkLeaseCost] = useState(280);
    const [tkDriverCost, setTkDriverCost] = useState(32);
    const [tkFuelPrice, setTkFuelPrice] = useState(3.85);
    const [tkMpg, setTkMpg] = useState(5.5);
    const [tkGallonsPerLoad, setTkGallonsPerLoad] = useState(8500);
    const [tkMilesPerTrip, setTkMilesPerTrip] = useState(90);
    const [tkUtilFactor, setTkUtilFactor] = useState(0.85);
    const [tkOpHours, setTkOpHours] = useState(12);
    const [tkAvailHours, setTkAvailHours] = useState(16);
    const [tkDriveHours, setTkDriveHours] = useState(9);
    const [tkDutyHours, setTkDutyHours] = useState(13);
    const [tkOffHours, setTkOffHours] = useState(8);

    const loadsPerDay = useMemo(() => loadsPerDayPerLane(tkDailyVol, tkTruckCap), [tkDailyVol, tkTruckCap]);
    const delivCost = useMemo(() => deliveryCostPerGallon(tkLeaseCost, tkDriverCost, tkFuelPrice, tkMilesPerTrip, tkMpg, tkGallonsPerLoad), [tkLeaseCost, tkDriverCost, tkFuelPrice, tkMilesPerTrip, tkMpg, tkGallonsPerLoad]);
    const routeMiles = useMemo(() => routeMilesPerTrip(tkOneWay, tkDetour), [tkOneWay, tkDetour]);
    const tkFleetSize = useMemo(() => truckFleetSize(tkDailyVol, tkTruckCap, tkTripsPerDay, tkUtilFactor), [tkDailyVol, tkTruckCap, tkTripsPerDay, tkUtilFactor]);
    const tkUtil = useMemo(() => truckUtilizationRate(tkOpHours, tkAvailHours), [tkOpHours, tkAvailHours]);
    const hosCheck = useMemo(() => hosComplianceCheck(tkDriveHours, tkDutyHours, tkOffHours), [tkDriveHours, tkDutyHours, tkOffHours]);

    // ─── Terminal State ───
    const [tmDailyVol, setTmDailyVol] = useState(250000);
    const [tmLoadRate, setTmLoadRate] = useState(600);
    const [tmOpHoursDay, setTmOpHoursDay] = useState(14);
    const [tmLaneUtil, setTmLaneUtil] = useState(0.8);
    const [tmTankCap, setTmTankCap] = useState(500000);
    const [tmDailyThroughput, setTmDailyThroughput] = useState(250000);
    const [tmHeel, setTmHeel] = useState(15000);
    const [tmRecBbl, setTmRecBbl] = useState(250000);
    const [tmShipBbl, setTmShipBbl] = useState(248000);
    const [tmInvChange, setTmInvChange] = useState(50000);
    const [tmReceipts, setTmReceipts] = useState(250000);
    const [tmShipments, setTmShipments] = useState(248000);
    const [tmOpDaysYear, setTmOpDaysYear] = useState(350);
    const [tmAnnualThroughput, setTmAnnualThroughput] = useState(84000000);
    const [tmTankCap2, setTmTankCap2] = useState(350000);
    const [tmProductDemand, setTmProductDemand] = useState(500000);
    const [tmNumGrades, setTmNumGrades] = useState(3);
    const [tmVaporCollected, setTmVaporCollected] = useState(95);
    const [tmVaporGenerated, setTmVaporGenerated] = useState(100);
    const [tmAnnualOPEX, setTmAnnualOPEX] = useState(4500000);
    const [tmDosagePpm, setTmDosagePpm] = useState(15);
    const [tmProductRate, setTmProductRate] = useState(30000);
    const [tmAdditiveSg, setTmAdditiveSg] = useState(0.85);

    const termThroughput = useMemo(() => terminalThroughput(tmReceipts, tmShipments, tmOpDaysYear), [tmReceipts, tmShipments, tmOpDaysYear]);
    const rackLanes = useMemo(() => rackLanesRequired(tmDailyVol, tmLoadRate, tmOpHoursDay, tmLaneUtil), [tmDailyVol, tmLoadRate, tmOpHoursDay, tmLaneUtil]);
    const tankInvDays = useMemo(() => tankInventoryDays(tmTankCap, tmDailyThroughput, tmHeel), [tmTankCap, tmDailyThroughput, tmHeel]);
    const glRec = useMemo(() => gainLossReconciliation(tmRecBbl, tmShipBbl, tmInvChange), [tmRecBbl, tmShipBbl, tmInvChange]);
    const turnRate = useMemo(() => turnoverRate(tmAnnualThroughput, tmTankCap2), [tmAnnualThroughput, tmTankCap2]);
    const tankSwitch = useMemo(() => tankSwitchFrequency(tmTankCap2, tmProductDemand, tmNumGrades), [tmTankCap2, tmProductDemand, tmNumGrades]);
    const vapRecovery = useMemo(() => vaporRecoveryEfficiency(tmVaporCollected, tmVaporGenerated), [tmVaporCollected, tmVaporGenerated]);
    const termOPEX = useMemo(() => terminalOPEXPerBbl(tmAnnualOPEX, tmAnnualThroughput), [tmAnnualOPEX, tmAnnualThroughput]);
    const additiveRate = useMemo(() => additiveInjectionRate(tmDosagePpm, tmProductRate, tmAdditiveSg), [tmDosagePpm, tmProductRate, tmAdditiveSg]);

    // ─── Aviation State ───
    const [avFiltration, setAvFiltration] = useState(98);
    const [avWaterInlet, setAvWaterInlet] = useState(250);
    const [avWaterOutlet, setAvWaterOutlet] = useState(15);
    const [avSAFBlend, setAvSAFBlend] = useState(12);
    const [avConductivityTarget, setAvConductivityTarget] = useState(250);
    const [avBaseConductivity, setAvBaseConductivity] = useState(50);
    const [avAdditiveStrength, setAvAdditiveStrength] = useState(0.012);
    const [avFuelCostPerBbl, setAvFuelCostPerBbl] = useState(85);
    const [avFuelingCost, setAvFuelingCost] = useState(0.08);
    const [avJftotSulfur, setAvJftotSulfur] = useState(2800);
    const [avJftotNitrogen, setAvJftotNitrogen] = useState(1.2);
    const [avHydrotreatingSeverity, setAvHydrotreatingSeverity] = useState(8.5);

    const filtEff = useMemo(() => filtrationEfficiency(avWaterInlet, avWaterOutlet), [avWaterInlet, avWaterOutlet]);
    const safRatio = useMemo(() => safBlendRatio(avSAFBlend, tmDailyVol), [avSAFBlend, tmDailyVol]);
    const sdDosage = useMemo(() => staticDissipaterDosage(avConductivityTarget, avBaseConductivity, avAdditiveStrength), [avConductivityTarget, avBaseConductivity, avAdditiveStrength]);
    const fuelFarmDS = useMemo(() => fuelFarmDaysOfSupply(tmTankCap, tmDailyThroughput, tmHeel), [tmTankCap, tmDailyThroughput, tmHeel]);
    const planeFuelCost = useMemo(() => intoPlaneFuelingCost(avFuelCostPerBbl, avFuelingCost, tmDailyVol), [avFuelCostPerBbl, avFuelingCost, tmDailyVol]);
    const jftotDeltaPCalc = useMemo(() => jftotDeltaP(avJftotSulfur, avJftotNitrogen, avHydrotreatingSeverity), [avJftotSulfur, avJftotNitrogen, avHydrotreatingSeverity]);

    // ─── Commercial State ───
    const [cmSpotPrice, setCmSpotPrice] = useState(78);
    const [cmTermMargin, setCmTermMargin] = useState(6.5);
    const [cmBrandPremium, setCmBrandPremium] = useState(3.2);
    const [cmAdditiveCost, setCmAdditiveCost] = useState(1.8);
    const [cmFederalTax, setCmFederalTax] = useState(18.4);
    const [cmStateTax, setCmStateTax] = useState(38.7);
    const [cmLocalTax, setCmLocalTax] = useState(4.8);
    const [cmCarbonTaxCpg, setCmCarbonTaxCpg] = useState(12.5);
    const [cmContractPrice, setCmContractPrice] = useState(74);
    const [cmSpotPrice2, setCmSpotPrice2] = useState(78);
    const [cmContractPrice2, setCmContractPrice2] = useState(74);
    const [cmExchangeFee, setCmExchangeFee] = useState(1.5);
    const [cmDisruptionProb, setCmDisruptionProb] = useState(0.08);
    const [cmFinImpact, setCmFinImpact] = useState(2500000);
    const [cmDisruptionDays, setCmDisruptionDays] = useState(14);
    const [cmExRefinery, setCmExRefinery] = useState(82);
    const [cmPipeTariff2, setCmPipeTariff2] = useState(3.5);
    const [cmTermCost, setCmTermCost] = useState(2.2);
    const [cmTruckCost, setCmTruckCost] = useState(4.2);
    const [cmTaxesPerBbl, setCmTaxesPerBbl] = useState(25.2);
    const [cmVolBpd, setCmVolBpd] = useState(45000);
    const [cmBenchmark, setCmBenchmark] = useState(78);
    const [cmDiff, setCmDiff] = useState(-2.5);
    const [cmEscalator, setCmEscalator] = useState(1.05);
    const [cmQualityAdj, setCmQualityAdj] = useState(0.8);
    const [cmStorageCost2, setCmStorageCost2] = useState(0.9);
    const [cmForwardPrice, setCmForwardPrice] = useState(82);
    // Additional commercial params for missing function arguments
    const [cmD4RinPrice, setCmD4RinPrice] = useState(1.8);
    const [cmD5RinPrice, setCmD5RinPrice] = useState(1.2);
    const [cmD6ObligationPct, setCmD6ObligationPct] = useState(10.5);
    const [cmD4ObligationPct, setCmD4ObligationPct] = useState(2.0);
    const [cmD5ObligationPct, setCmD5ObligationPct] = useState(5.0);
    const [cmEthanolPrice, setCmEthanolPrice] = useState(62);
    const [cmEthanolBlendPct, setCmEthanolBlendPct] = useState(10);
    const [cmRinValue, setCmRinValue] = useState(1.5);
    const [cmMonthsHeld, setCmMonthsHeld] = useState(3);
    const [cmFinancingRate, setCmFinancingRate] = useState(7.5);
    const [cmPromptPriceTotal, setCmPromptPriceTotal] = useState(3500000);

    const rackPrice = useMemo(() => rackPriceBreakdown(cmSpotPrice, cmTermMargin, cmBrandPremium, cmAdditiveCost), [cmSpotPrice, cmTermMargin, cmBrandPremium, cmAdditiveCost]);
    const totalTax = useMemo(() => totalTaxPerGallon(cmFederalTax, cmStateTax, cmLocalTax, cmCarbonTaxCpg), [cmFederalTax, cmStateTax, cmLocalTax, cmCarbonTaxCpg]);
    const exchDiff = useMemo(() => exchangeDifferential(cmContractPrice, cmSpotPrice, cmExchangeFee), [cmContractPrice, cmSpotPrice, cmExchangeFee]);
    const disruptionCost = useMemo(() => disruptionExpectedCost(cmDisruptionProb, cmFinImpact, cmDisruptionDays), [cmDisruptionProb, cmFinImpact, cmDisruptionDays]);
    const carbonTaxVal = useMemo(() => carbonTaxCost(0.43, cmCarbonTaxCpg), [cmCarbonTaxCpg]);
    const rinCost = useMemo(() => rinComplianceCost(1.5, cmD4RinPrice, cmD5RinPrice, cmD6ObligationPct, cmD4ObligationPct, cmD5ObligationPct), [cmD4RinPrice, cmD5RinPrice, cmD6ObligationPct, cmD4ObligationPct, cmD5ObligationPct]);
    const bioBlendMargin = useMemo(() => biofuelBlendMargin(cmSpotPrice, cmEthanolPrice, cmEthanolBlendPct, cmRinValue), [cmSpotPrice, cmEthanolPrice, cmEthanolBlendPct, cmRinValue]);
    const deliveredCostGal = useMemo(() => totalDeliveredCostPerGallon(cmExRefinery, cmPipeTariff2, cmTermCost, cmTruckCost, cmTaxesPerBbl), [cmExRefinery, cmPipeTariff2, cmTermCost, cmTruckCost, cmTaxesPerBbl]);
    const spotVsContract = useMemo(() => spotVsContractMargin(cmSpotPrice2, cmContractPrice2, cmVolBpd), [cmSpotPrice2, cmContractPrice2, cmVolBpd]);
    const formulaP = useMemo(() => formulaPrice(cmBenchmark, cmDiff, cmEscalator, cmQualityAdj), [cmBenchmark, cmDiff, cmEscalator, cmQualityAdj]);
    const storArb = useMemo(() => storageArbitrage(cmSpotPrice, cmForwardPrice, cmStorageCost2, cmMonthsHeld, cmFinancingRate, cmPromptPriceTotal), [cmSpotPrice, cmForwardPrice, cmStorageCost2, cmMonthsHeld, cmFinancingRate, cmPromptPriceTotal]);

    // ─── Seed distribution from refining (runs once when refining products become available) ───
    const [seeded, setSeeded] = useState(false);
    useEffect(() => {
        if (seeded) return;
        const products = refining?.products;
        if (!products || products.length === 0) return;

        const totalProductBpd = products.reduce((sum, p) => sum + p.volume, 0);
        if (totalProductBpd > 0) {
            setScThroughput(totalProductBpd);
            setPlThroughput(totalProductBpd);
            setTkDailyVol(totalProductBpd / 42);
            setTmDailyVol(totalProductBpd);
            setTmAnnualThroughput(totalProductBpd * 350);
        }

        // Seed commercial pricing from first product
        const firstProduct = products[0];
        if (firstProduct && firstProduct.price > 0) {
            setCmSpotPrice(firstProduct.price);
            setScProductCost(firstProduct.price);
        }

        setSeeded(true);
    }, [refining?.products, seeded]);

    // ─── Persist distribution data to store ───
    useEffect(() => {
        const products = refining?.products ?? [];
        const terminalProducts = products.map((p, i) => ({
            productId: `prod-${i}-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            inventory: scTotalInv / Math.max(products.length, 1),
            daysOfCover: doc,
            quality: { ...p.quality },
            rackPrice: p.price + scTerminalFee + scTruckFreight,
        }));

        updateDist({
            terminals: [{
                terminalId: 'T1',
                products: terminalProducts,
                truckLoadsPerDay: loadsPerDay,
            }],
            fleetUtilization: tkUtil,
            lastUpdated: Date.now(),
            version: (distData?.version ?? 0) + 1,
        });
    }, [scTotalInv, doc, scTerminalFee, scTruckFreight, loadsPerDay, tkUtil]);

    return (
        <div className="p-4 space-y-5">
            {/* Sub-Tab Navigation */}
            <div className="flex flex-wrap gap-1.5 bg-gray-100 rounded-lg p-1">
                {subTabs.map(st => {
                    const Icon = st.icon;
                    return (
                        <button
                            key={st.id}
                            onClick={() => setActiveSubTab(st.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                activeSubTab === st.id
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            )}
                        >
                            <Icon size={14} />
                            {st.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeSubTab === 'supply-chain' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Product Cost ($/bbl)</span><input type="number" value={scProductCost} onChange={e => setScProductCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Pipeline Tariff ($/bbl)</span><input type="number" step="0.1" value={scPipelineTariff} onChange={e => setScPipelineTariff(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Terminal Fee ($/bbl)</span><input type="number" step="0.1" value={scTerminalFee} onChange={e => setScTerminalFee(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Truck Freight ($/bbl)</span><input type="number" step="0.1" value={scTruckFreight} onChange={e => setScTruckFreight(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Storage Cost ($/bbl)</span><input type="number" step="0.1" value={scStorageCost} onChange={e => setScStorageCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Carrying Cost ($/bbl)</span><input type="number" step="0.1" value={scCarryingCost} onChange={e => setScCarryingCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Avg Demand (bbl)</span><input type="number" value={scAvgDemand} onChange={e => setScAvgDemand(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Lead Time (days)</span><input type="number" value={scLeadTime} onChange={e => setScLeadTime(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Demand StdDev</span><input type="number" value={scDemandStdDev} onChange={e => setScDemandStdDev(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Service Z</span><input type="number" step="0.001" value={scServiceZ} onChange={e => setScServiceZ(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Total Inventory (bbl)</span><input type="number" value={scTotalInv} onChange={e => setScTotalInv(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Month (1-12)</span><input type="number" min={1} max={12} value={scMonth} onChange={e => setScMonth(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Seasonal Amp (%)</span><input type="number" value={scSeasonalAmplitude} onChange={e => setScSeasonalAmplitude(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Direct Cost ($/bbl)</span><input type="number" step="0.1" value={scDirectCost} onChange={e => setScDirectCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Hub-Spoke Cost ($)</span><input type="number" step="0.1" value={scHubSpokeCost} onChange={e => setScHubSpokeCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Throughput (bbl)</span><input type="number" value={scThroughput} onChange={e => setScThroughput(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Design Capacity</span><input type="number" value={scDesignCap} onChange={e => setScDesignCap(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Delivered Cost</div>
                                <div className="text-xl font-bold text-blue-900">${deliveredCost.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Safety Stock</div>
                                <div className="text-xl font-bold text-green-900">{safetystock.toLocaleString()} bbl</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Days of Cover</div>
                                <div className="text-xl font-bold text-amber-900">{doc.toFixed(1)} days</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Reorder Point</div>
                                <div className="text-xl font-bold text-purple-900">{rop.toLocaleString()} bbl</div>
                            </div>
                        </div>
                        <DistributionSVGs type="supply-chain" data={{ deliveredCost, safetystock, doc, rop, seasonalDemand, hubEff, netUtil }} />
                    </div>
                )}

                {activeSubTab === 'pipelines' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Demand Vol (bbl)</span><input type="number" value={plDemandVol} onChange={e => setPlDemandVol(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Cycle Days</span><input type="number" value={plCycleDays} onChange={e => setPlCycleDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Safety Factor</span><input type="number" step="0.01" value={plSafetyFactor} onChange={e => setPlSafetyFactor(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Diameter (in)</span><input type="number" value={plDiameter} onChange={e => setPlDiameter(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Length (mi)</span><input type="number" value={plLength} onChange={e => setPlLength(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Reynolds #</span><input type="number" value={plReynolds} onChange={e => setPlReynolds(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Schmidt #</span><input type="number" value={plSchmidt} onChange={e => setPlSchmidt(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Flow Rate (bbl/day)</span><input type="number" value={plFlowRate} onChange={e => setPlFlowRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Tariff ($/bbl)</span><input type="number" step="0.1" value={plTariff} onChange={e => setPlTariff(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Throughput (bbl/day)</span><input type="number" value={plThroughput} onChange={e => setPlThroughput(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Nameplate (bbl/day)</span><input type="number" value={plNameplate} onChange={e => setPlNameplate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Product A</span><select value={plProductA} onChange={e => setPlProductA(e.target.value as any)} className="w-full border border-gray-300 rounded px-2 py-1 text-xs"><option>gasoline</option><option>diesel</option><option>jet</option><option>fuelOil</option><option>naphtha</option><option>ethanol</option></select></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Product B</span><select value={plProductB} onChange={e => setPlProductB(e.target.value as any)} className="w-full border border-gray-300 rounded px-2 py-1 text-xs"><option>gasoline</option><option>diesel</option><option>jet</option><option>fuelOil</option><option>naphtha</option><option>ethanol</option></select></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">API Gravity A</span><input type="number" step="0.1" value={plApi1} onChange={e => setPlApi1(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">API Gravity B</span><input type="number" step="0.1" value={plApi2} onChange={e => setPlApi2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Batch Size</div>
                                <div className="text-xl font-bold text-blue-900">{batchSize.toLocaleString()} bbl</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Transmix Volume</div>
                                <div className="text-xl font-bold text-green-900">{transmix.toLocaleString()} bbl</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Revenue</div>
                                <div className="text-xl font-bold text-amber-900">${plRevenue.toFixed(0)}/day</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Utilization</div>
                                <div className="text-xl font-bold text-purple-900">{plUtil.toFixed(1)}%</div>
                            </div>
                        </div>
                        <DistributionSVGs type="pipelines" data={{ batchSize, transmix, ifLength, transitTime, linefill, batchCyc, plRevenue, plUtil, seqCompat, ifDelta }} />
                    </div>
                )}

                {activeSubTab === 'marine' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Distance (nm)</span><input type="number" value={marDist} onChange={e => setMarDist(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Speed (knots)</span><input type="number" step="0.1" value={marSpeed} onChange={e => setMarSpeed(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Port Time (days)</span><input type="number" step="0.1" value={marPortTime} onChange={e => setMarPortTime(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">WS Flat ($/ton)</span><input type="number" step="0.1" value={marWSFlat} onChange={e => setMarWSFlat(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">WS Pct (%)</span><input type="number" step="0.1" value={marWSPct} onChange={e => setMarWSPct(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Cargo Size (bbl)</span><input type="number" value={marCargoSize} onChange={e => setMarCargoSize(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Charter Rate ($/d)</span><input type="number" value={marCharterRate} onChange={e => setMarCharterRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Port Charges ($)</span><input type="number" value={marPortCharges} onChange={e => setMarPortCharges(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Bunker Cost ($/ton)</span><input type="number" step="0.1" value={marBunkerCost} onChange={e => setMarBunkerCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Bunker Cons (ton/day)</span><input type="number" step="0.1" value={marBunkerConsumption} onChange={e => setMarBunkerConsumption(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Demurrage Rate ($/d)</span><input type="number" value={marDemurrageRate} onChange={e => setMarDemurrageRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Monthly Vol (bbl)</span><input type="number" value={marMonthlyVol} onChange={e => setMarMonthlyVol(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Load Port Days</span><input type="number" step="0.1" value={marLoadPort} onChange={e => setMarLoadPort(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Discharge Port Days</span><input type="number" step="0.1" value={marDischargePort} onChange={e => setMarDischargePort(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Free Laytime (days)</span><input type="number" step="0.1" value={marFreeLaytime} onChange={e => setMarFreeLaytime(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Used Laytime (days)</span><input type="number" step="0.1" value={marUsedLaytime} onChange={e => setMarUsedLaytime(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Fleet Days</span><input type="number" value={marFleetDays} onChange={e => setMarFleetDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Voyage Time</div>
                                <div className="text-xl font-bold text-blue-900">{transitDays.toFixed(1)} days</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Freight Cost</div>
                                <div className="text-xl font-bold text-green-900">${marFreightCost.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Demurrage</div>
                                <div className="text-xl font-bold text-amber-900">${demCost.toLocaleString()}</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Fleet Utilization</div>
                                <div className="text-xl font-bold text-purple-900">{marUtil.toFixed(1)}%</div>
                            </div>
                        </div>
                        <DistributionSVGs type="marine" data={{ transitDays, voyageFreq, marFleetCalc, demDays, demCost, marFreightCost, marUtil }} />
                    </div>
                )}

                {activeSubTab === 'rail' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Distance (mi)</span><input type="number" value={rlDist} onChange={e => setRlDist(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Speed (mph)</span><input type="number" step="0.1" value={rlSpeed} onChange={e => setRlSpeed(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Yard Time (days)</span><input type="number" step="0.1" value={rlYardTime} onChange={e => setRlYardTime(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Car Capacity (bbl)</span><input type="number" value={rlCarCap} onChange={e => setRlCarCap(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Trainset (cars)</span><input type="number" value={rlTrainset} onChange={e => setRlTrainset(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Lease Rate ($/car/mo)</span><input type="number" step="0.01" value={rlLeaseRate} onChange={e => setRlLeaseRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Fuel Surcharge ($/mi)</span><input type="number" step="0.01" value={rlFuelSurcharge} onChange={e => setRlFuelSurcharge(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Transload Fee ($/bbl)</span><input type="number" step="0.01" value={rlTransloadFee} onChange={e => setRlTransloadFee(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Monthly Vol (bbl)</span><input type="number" value={rlMonthlyVol2} onChange={e => setRlMonthlyVol2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Loading Days</span><input type="number" step="0.1" value={rlLoadingDays} onChange={e => setRlLoadingDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Unloading Days</span><input type="number" step="0.1" value={rlUnloadingDays} onChange={e => setRlUnloadingDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Inspection Days</span><input type="number" step="0.1" value={rlInspectionDays} onChange={e => setRlInspectionDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Cycle Days</div>
                                <div className="text-xl font-bold text-blue-900">{railCycle.toFixed(1)} days</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Fleet Size</div>
                                <div className="text-xl font-bold text-green-900">{railFleet} cars</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Cost per Bbl</div>
                                <div className="text-xl font-bold text-amber-900">${railCost.toFixed(2)}</div>
                            </div>
                        </div>
                        <DistributionSVGs type="rail" data={{ railCycle, railFleet, railCost }} />
                    </div>
                )}

                {activeSubTab === 'truck' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Daily Vol (bbl)</span><input type="number" value={tkDailyVol} onChange={e => setTkDailyVol(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Truck Cap (gal)</span><input type="number" value={tkTruckCap} onChange={e => setTkTruckCap(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Trips/Day</span><input type="number" step="0.1" value={tkTripsPerDay} onChange={e => setTkTripsPerDay(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">One-Way (mi)</span><input type="number" step="0.1" value={tkOneWay} onChange={e => setTkOneWay(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Detour (mi)</span><input type="number" step="0.1" value={tkDetour} onChange={e => setTkDetour(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Lease Cost ($/d)</span><input type="number" value={tkLeaseCost} onChange={e => setTkLeaseCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Driver Cost ($/h)</span><input type="number" step="0.01" value={tkDriverCost} onChange={e => setTkDriverCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Fuel Price ($/gal)</span><input type="number" step="0.01" value={tkFuelPrice} onChange={e => setTkFuelPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">MPG</span><input type="number" step="0.1" value={tkMpg} onChange={e => setTkMpg(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Gallons/Load</span><input type="number" value={tkGallonsPerLoad} onChange={e => setTkGallonsPerLoad(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Miles/Trip</span><input type="number" step="0.1" value={tkMilesPerTrip} onChange={e => setTkMilesPerTrip(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Util Factor</span><input type="number" step="0.01" value={tkUtilFactor} onChange={e => setTkUtilFactor(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Op Hours</span><input type="number" step="0.5" value={tkOpHours} onChange={e => setTkOpHours(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Avail Hours</span><input type="number" step="0.5" value={tkAvailHours} onChange={e => setTkAvailHours(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Drive Hours (HOS)</span><input type="number" step="0.5" value={tkDriveHours} onChange={e => setTkDriveHours(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Duty Hours (HOS)</span><input type="number" step="0.5" value={tkDutyHours} onChange={e => setTkDutyHours(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Off Hours (HOS)</span><input type="number" step="0.5" value={tkOffHours} onChange={e => setTkOffHours(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Loads/Day</div>
                                <div className="text-xl font-bold text-blue-900">{loadsPerDay.toFixed(1)}</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Delivery Cost</div>
                                <div className="text-xl font-bold text-green-900">${delivCost.toFixed(3)}/gal</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Fleet Size</div>
                                <div className="text-xl font-bold text-amber-900">{tkFleetSize} trucks</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Utilization</div>
                                <div className="text-xl font-bold text-purple-900">{tkUtil.toFixed(1)}%</div>
                            </div>
                        </div>
                        <DistributionSVGs type="truck" data={{ loadsPerDay, delivCost, routeMiles, tkFleetSize, tkUtil, hosCheck }} />
                    </div>
                )}

                {activeSubTab === 'terminal' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Daily Vol (bbl)</span><input type="number" value={tmDailyVol} onChange={e => setTmDailyVol(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Load Rate (bbl/h)</span><input type="number" value={tmLoadRate} onChange={e => setTmLoadRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Op Hours/Day</span><input type="number" value={tmOpHoursDay} onChange={e => setTmOpHoursDay(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Lane Util</span><input type="number" step="0.01" value={tmLaneUtil} onChange={e => setTmLaneUtil(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Tank Cap (bbl)</span><input type="number" value={tmTankCap} onChange={e => setTmTankCap(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Daily Throughput</span><input type="number" value={tmDailyThroughput} onChange={e => setTmDailyThroughput(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Heel (bbl)</span><input type="number" value={tmHeel} onChange={e => setTmHeel(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Rec'd (bbl)</span><input type="number" value={tmRecBbl} onChange={e => setTmRecBbl(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Shipped (bbl)</span><input type="number" value={tmShipBbl} onChange={e => setTmShipBbl(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Inv Change (bbl)</span><input type="number" value={tmInvChange} onChange={e => setTmInvChange(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Receipts (bbl)</span><input type="number" value={tmReceipts} onChange={e => setTmReceipts(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Shipments (bbl)</span><input type="number" value={tmShipments} onChange={e => setTmShipments(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Op Days/Year</span><input type="number" value={tmOpDaysYear} onChange={e => setTmOpDaysYear(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Annual Throughput</span><input type="number" value={tmAnnualThroughput} onChange={e => setTmAnnualThroughput(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Tank Capacity</span><input type="number" value={tmTankCap2} onChange={e => setTmTankCap2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Product Demand</span><input type="number" value={tmProductDemand} onChange={e => setTmProductDemand(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Num Grades</span><input type="number" value={tmNumGrades} onChange={e => setTmNumGrades(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Vapor Collected</span><input type="number" value={tmVaporCollected} onChange={e => setTmVaporCollected(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Vapor Generated</span><input type="number" value={tmVaporGenerated} onChange={e => setTmVaporGenerated(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Annual OPEX ($)</span><input type="number" value={tmAnnualOPEX} onChange={e => setTmAnnualOPEX(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Dosage (ppm)</span><input type="number" value={tmDosagePpm} onChange={e => setTmDosagePpm(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Product Rate</span><input type="number" value={tmProductRate} onChange={e => setTmProductRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Additive SG</span><input type="number" step="0.01" value={tmAdditiveSg} onChange={e => setTmAdditiveSg(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Throughput</div>
                                <div className="text-xl font-bold text-blue-900">{termThroughput.toLocaleString()} bpd</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Rack Lanes</div>
                                <div className="text-xl font-bold text-green-900">{rackLanes}</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Tank Days</div>
                                <div className="text-xl font-bold text-amber-900">{tankInvDays.toFixed(1)} days</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Turnover Rate</div>
                                <div className="text-xl font-bold text-purple-900">{turnRate.toFixed(1)}x/yr</div>
                            </div>
                        </div>
                        <DistributionSVGs type="terminal" data={{ termThroughput, rackLanes, tankInvDays, glRec, turnRate, tankSwitch, vapRecovery, termOPEX, additiveRate }} />
                    </div>
                )}

                {activeSubTab === 'aviation' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Filtration Rating</span><input type="number" step="0.1" value={avFiltration} onChange={e => setAvFiltration(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Water Inlet (ppm)</span><input type="number" value={avWaterInlet} onChange={e => setAvWaterInlet(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Water Outlet (ppm)</span><input type="number" value={avWaterOutlet} onChange={e => setAvWaterOutlet(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">SAF Blend (%)</span><input type="number" step="0.1" value={avSAFBlend} onChange={e => setAvSAFBlend(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Conductivity Target</span><input type="number" value={avConductivityTarget} onChange={e => setAvConductivityTarget(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Base Conductivity</span><input type="number" value={avBaseConductivity} onChange={e => setAvBaseConductivity(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Additive Strength</span><input type="number" step="0.001" value={avAdditiveStrength} onChange={e => setAvAdditiveStrength(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Fuel Cost ($/bbl)</span><input type="number" step="0.01" value={avFuelCostPerBbl} onChange={e => setAvFuelCostPerBbl(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Fueling Cost ($/gal)</span><input type="number" step="0.01" value={avFuelingCost} onChange={e => setAvFuelingCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">JFTOT Sulfur</span><input type="number" value={avJftotSulfur} onChange={e => setAvJftotSulfur(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">JFTOT Nitrogen</span><input type="number" step="0.01" value={avJftotNitrogen} onChange={e => setAvJftotNitrogen(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Hydrotreating Severity</span><input type="number" step="0.01" value={avHydrotreatingSeverity} onChange={e => setAvHydrotreatingSeverity(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Filter Efficiency</div>
                                <div className="text-xl font-bold text-blue-900">{filtEff.toFixed(1)}%</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">SAF Blend Ratio</div>
                                <div className="text-xl font-bold text-green-900">{safRatio.toFixed(1)}%</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">SD Dosage</div>
                                <div className="text-xl font-bold text-amber-900">{sdDosage.toFixed(2)} ppm</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Fuel Farm DS</div>
                                <div className="text-xl font-bold text-purple-900">{fuelFarmDS.toFixed(1)} days</div>
                            </div>
                        </div>
                        <DistributionSVGs type="aviation" data={{ filtEff, safRatio, sdDosage, fuelFarmDS, planeFuelCost, jftotDeltaPCalc }} />
                    </div>
                )}

                {activeSubTab === 'commercial' && (
                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg border border-gray-200" open>
                            <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">⚙ Customize Parameters</summary>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Spot Price ($/bbl)</span><input type="number" step="0.01" value={cmSpotPrice} onChange={e => setCmSpotPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Term Margin ($/bbl)</span><input type="number" step="0.01" value={cmTermMargin} onChange={e => setCmTermMargin(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Brand Premium ($)</span><input type="number" step="0.01" value={cmBrandPremium} onChange={e => setCmBrandPremium(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Additive Cost ($)</span><input type="number" step="0.01" value={cmAdditiveCost} onChange={e => setCmAdditiveCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Federal Tax (¢/gal)</span><input type="number" step="0.01" value={cmFederalTax} onChange={e => setCmFederalTax(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">State Tax (¢/gal)</span><input type="number" step="0.01" value={cmStateTax} onChange={e => setCmStateTax(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Local Tax (¢/gal)</span><input type="number" step="0.01" value={cmLocalTax} onChange={e => setCmLocalTax(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Carbon Tax (¢/gal)</span><input type="number" step="0.01" value={cmCarbonTaxCpg} onChange={e => setCmCarbonTaxCpg(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Contract Price ($/bbl)</span><input type="number" step="0.01" value={cmContractPrice} onChange={e => setCmContractPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Spot Price #2 ($/bbl)</span><input type="number" step="0.01" value={cmSpotPrice2} onChange={e => setCmSpotPrice2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Contract Price #2 ($/bbl)</span><input type="number" step="0.01" value={cmContractPrice2} onChange={e => setCmContractPrice2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Exchange Fee ($/bbl)</span><input type="number" step="0.01" value={cmExchangeFee} onChange={e => setCmExchangeFee(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Disruption Prob</span><input type="number" step="0.001" value={cmDisruptionProb} onChange={e => setCmDisruptionProb(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Financial Impact ($)</span><input type="number" value={cmFinImpact} onChange={e => setCmFinImpact(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Disruption Days</span><input type="number" step="0.1" value={cmDisruptionDays} onChange={e => setCmDisruptionDays(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Ex-Refinery ($/bbl)</span><input type="number" step="0.01" value={cmExRefinery} onChange={e => setCmExRefinery(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Pipe Tariff ($/bbl)</span><input type="number" step="0.01" value={cmPipeTariff2} onChange={e => setCmPipeTariff2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Terminal Cost ($/bbl)</span><input type="number" step="0.01" value={cmTermCost} onChange={e => setCmTermCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Truck Cost ($/bbl)</span><input type="number" step="0.01" value={cmTruckCost} onChange={e => setCmTruckCost(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Taxes/Bbl ($)</span><input type="number" step="0.01" value={cmTaxesPerBbl} onChange={e => setCmTaxesPerBbl(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Volume (BPD)</span><input type="number" value={cmVolBpd} onChange={e => setCmVolBpd(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Benchmark ($)</span><input type="number" step="0.01" value={cmBenchmark} onChange={e => setCmBenchmark(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Differential ($)</span><input type="number" step="0.01" value={cmDiff} onChange={e => setCmDiff(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Escalator</span><input type="number" step="0.001" value={cmEscalator} onChange={e => setCmEscalator(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Quality Adj ($)</span><input type="number" step="0.01" value={cmQualityAdj} onChange={e => setCmQualityAdj(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Storage Cost ($/bbl)</span><input type="number" step="0.01" value={cmStorageCost2} onChange={e => setCmStorageCost2(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Forward Price ($)</span><input type="number" step="0.01" value={cmForwardPrice} onChange={e => setCmForwardPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">D4 RIN Price ($)</span><input type="number" step="0.01" value={cmD4RinPrice} onChange={e => setCmD4RinPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">D5 RIN Price ($)</span><input type="number" step="0.01" value={cmD5RinPrice} onChange={e => setCmD5RinPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">D6 Oblig Pct (%)</span><input type="number" step="0.01" value={cmD6ObligationPct} onChange={e => setCmD6ObligationPct(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">D4 Oblig Pct (%)</span><input type="number" step="0.01" value={cmD4ObligationPct} onChange={e => setCmD4ObligationPct(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">D5 Oblig Pct (%)</span><input type="number" step="0.01" value={cmD5ObligationPct} onChange={e => setCmD5ObligationPct(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Ethanol Price ($)</span><input type="number" step="0.01" value={cmEthanolPrice} onChange={e => setCmEthanolPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Ethanol Blend (%)</span><input type="number" step="0.1" value={cmEthanolBlendPct} onChange={e => setCmEthanolBlendPct(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">RIN Value ($)</span><input type="number" step="0.01" value={cmRinValue} onChange={e => setCmRinValue(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Months Held</span><input type="number" step="0.1" value={cmMonthsHeld} onChange={e => setCmMonthsHeld(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Financing Rate (%)</span><input type="number" step="0.01" value={cmFinancingRate} onChange={e => setCmFinancingRate(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                                <label className="flex flex-col gap-1"><span className="text-[10px] text-gray-500">Prompt Price Total ($)</span><input type="number" value={cmPromptPriceTotal} onChange={e => setCmPromptPriceTotal(Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></label>
                            </div>
                        </details>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-blue-600 font-medium">Rack Price</div>
                                <div className="text-xl font-bold text-blue-900">${rackPrice.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-green-600 font-medium">Total Tax</div>
                                <div className="text-xl font-bold text-green-900">{totalTax.toFixed(1)} ¢/gal</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                                <div className="text-xs text-amber-600 font-medium">Exchange Diff</div>
                                <div className="text-xl font-bold text-amber-900">${exchDiff.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-purple-600 font-medium">Disruption Cost</div>
                                <div className="text-xl font-bold text-purple-900">${disruptionCost.toLocaleString()}</div>
                            </div>
                            <div className="bg-teal-50 rounded-lg p-3">
                                <div className="text-xs text-teal-600 font-medium">RIN Compliance</div>
                                <div className="text-xl font-bold text-teal-900">${rinCost.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-3">
                                <div className="text-xs text-indigo-600 font-medium">Biofuel Margin</div>
                                <div className="text-xl font-bold text-indigo-900">${bioBlendMargin.toFixed(2)}/bbl</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3">
                                <div className="text-xs text-orange-600 font-medium">Delivered Cost</div>
                                <div className="text-xl font-bold text-orange-900">${deliveredCostGal.toFixed(2)}/gal</div>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-3">
                                <div className="text-xs text-pink-600 font-medium">Storage Arb</div>
                                <div className="text-xl font-bold text-pink-900">${storArb.toFixed(2)}/bbl</div>
                            </div>
                        </div>
                        <DistributionSVGs type="commercial" data={{ rackPrice, totalTax, exchDiff, disruptionCost, carbonTaxVal, rinCost, bioBlendMargin, deliveredCostGal, spotVsContract, formulaP, storArb }} />
                    </div>
                )}

                {activeSubTab === 'references' && (
                    <div className="prose prose-sm max-w-none">
                        <DistributionSVGs type="references" data={{}} />
                    </div>
                )}
            </div>
        </div>
    );
}