import type { SensitivityProfile, ProPreset, DiagnosticResult } from '../types/sensitivity';

export const DEFAULT_ANCHOR = 47;
export const DEFAULT_ACCELERATION = 273;

/**
 * Calculates a balanced Sensitivity Profile based on a Red Dot Camera anchor.
 * Applies the core 47 Anchor Model ratios defined in CODM competitive specs.
 */
export function calculateBalancedProfile(
  redDotAnchor: number = DEFAULT_ANCHOR,
  accelerationValue: number = DEFAULT_ACCELERATION,
  rotationMode: 'Speed Acceleration' | 'Fixed Speed' | 'Distance Acceleration' = 'Speed Acceleration'
): SensitivityProfile {
  const redDot = Math.max(1, Math.round(redDotAnchor));

  // Correlative Ratios
  const tppCamera = Math.round(redDot * 0.94); // ~44 for 47
  const adsCamera = Math.round(redDot * 0.68); // ~32 for 47
  const sniperCamera = Math.round(redDot * 0.89); // ~42 for 47
  const scope3xCamera = Math.round(redDot * 0.55); // Step-down curve
  const scope4xCamera = Math.round(redDot * 0.45);

  // Firing Sensitivities (75% - 85% of camera values to steady recoil)
  const redDotFiring = Math.round(redDot * 0.78); // ~37 for 47
  const tppFiring = Math.round(tppCamera * 0.82);
  const adsFiring = Math.round(adsCamera * 0.88); // ~28-30 for 32
  const sniperFiring = Math.round(sniperCamera * 0.95); // ~40 for 42
  const scope3xFiring = Math.round(scope3xCamera * 0.90);
  const scope4xFiring = Math.round(scope4xCamera * 0.90);

  // Gyroscope Sensitivities
  const tppGyro = Math.min(100, Math.round(redDot * 1.38)); // ~65
  const redDotGyro = Math.round(redDot * 0.89); // ~42
  const adsGyro = Math.round(adsCamera * 1.09); // ~35
  const sniperGyro = Math.round(sniperCamera * 0.71); // ~30

  return {
    rotationMode,
    accelerationValue,

    tppCamera,
    redDotCamera: redDot,
    adsCamera,
    sniperCamera,
    scope3xCamera,
    scope4xCamera,
    verticalTurning: 100, // 1:1 ratio

    tppFiring,
    redDotFiring,
    adsFiring,
    sniperFiring,
    scope3xFiring,
    scope4xFiring,

    tppGyro,
    redDotGyro,
    adsGyro,
    sniperGyro,

    profileName: `Balanced ${redDot} Anchor Profile`,
    notes: 'Mathematically balanced profile generated via 47 Anchor Model ratios.',
  };
}

export const PRO_PRESETS: ProPreset[] = [
  {
    id: '47-anchor-standard',
    name: 'Standard 47 Anchor (Balanced)',
    player: 'SenseAI Engine Benchmark',
    team: 'Competitive Standard',
    device: 'Phone',
    layout: '4-Finger Claw',
    role: 'Flex / Main AR',
    profile: calculateBalancedProfile(47, 273),
  },
  {
    id: 'fast-flick-aggressive',
    name: 'Aggressive Speed Entry',
    player: 'Velo / Aggro Entry',
    team: 'Pro Benchmark A',
    device: 'Phone',
    layout: '5-Finger Claw',
    role: 'Aggressive SMG',
    profile: {
      ...calculateBalancedProfile(52, 285),
      profileName: 'Aggressive Speed Entry',
      notes: 'Higher base Red Dot (52) & Acceleration (285) for fast 180 entries and close-quarters snapping.',
    },
  },
  {
    id: 'precision-control-sniper',
    name: 'Precision Anchor / Sniper',
    player: 'Kilo / Anchor Specialist',
    team: 'Pro Benchmark B',
    device: 'Tablet / iPad',
    layout: '6-Finger Claw',
    role: 'Main Sniper / Anchor',
    profile: {
      ...calculateBalancedProfile(42, 240),
      verticalTurning: 105,
      profileName: 'Precision Anchor / Sniper',
      notes: 'Lower Red Dot (42) & Acceleration (240) with 105% vertical turning to maximize long-range stability.',
    },
  },
];

/**
 * Diagnostic logic rule engine to compute local diagnostic prescriptions
 * when offline or when direct rule application is needed.
 */
export function diagnoseAimSymptoms(
  currentProfile: SensitivityProfile,
  symptoms: {
    handShake?: boolean;
    overFlicking?: boolean;
    recoilSlip?: boolean;
    longRangeUnderTrack?: boolean;
  }
): DiagnosticResult {
  const detected: string[] = [];
  let newProfile = { ...currentProfile };
  const mathExplanations: string[] = [];

  if (symptoms.handShake) {
    detected.push('Nervous Hand Shake / Micro-Jitter');
    newProfile.redDotGyro = Math.max(20, newProfile.redDotGyro - 6);
    newProfile.adsGyro = Math.max(20, newProfile.adsGyro - 5);
    if (newProfile.redDotCamera > 50) {
      newProfile.redDotCamera = 47;
    }
    mathExplanations.push(
      'Lowered Gyroscope Red Dot & ADS by 5-6 points to cushion nervous hand tremors during clutch engagements.'
    );
  }

  if (symptoms.overFlicking) {
    detected.push('Over-Flicking Past Targets');
    newProfile.accelerationValue = Math.max(180, newProfile.accelerationValue - 23);
    newProfile.tppCamera = Math.max(30, newProfile.tppCamera - 2);
    mathExplanations.push(
      'Reduced Speed Acceleration value by 23 points to prevent the velocity curve from kicking in prematurely on flick swipes.'
    );
  }

  if (symptoms.recoilSlip) {
    detected.push('Vertical Weapon Recoil Slippage');
    newProfile.verticalTurning = 102;
    newProfile.redDotFiring = Math.round(newProfile.redDotCamera * 0.80);
    newProfile.adsFiring = Math.round(newProfile.adsCamera * 0.90);
    mathExplanations.push(
      'Boosted Vertical Turning to 102% and increased Firing Sensitivity relative to Camera Sensitivity to stabilize pull-down during sustained fire.'
    );
  }

  if (symptoms.longRangeUnderTrack) {
    detected.push('Sluggish / Under-Tracking at Long Range');
    newProfile.adsCamera = Math.round(newProfile.redDotCamera * 0.72);
    mathExplanations.push(
      'Adjusted Standard ADS Camera to 72% of Red Dot anchor to prevent track drag when scoping long-range targets.'
    );
  }

  if (detected.length === 0) {
    detected.push('General Optimization Checkup');
    newProfile = calculateBalancedProfile(currentProfile.redDotCamera || 47, currentProfile.accelerationValue || 273);
    mathExplanations.push('Re-aligned profile strictly to the 47 Anchor Model mathematical ratios.');
  }

  const immediateDiagnosis = `Detected ${detected.length} primary friction points (${detected.join(
    ', '
  )}). Your baseline is tuned with Acceleration at ${newProfile.accelerationValue} and Red Dot Camera at ${
    newProfile.redDotCamera
  }.`;

  return {
    symptomsDetected: detected,
    immediateDiagnosis,
    recommendedProfile: newProfile,
    mathExplanation: mathExplanations,
    inGameDrill: {
      title: 'Target Switching & Recoil Smoothing Routine (2 Mins)',
      description: 'Perform in CODM Practice Range against 10m, 20m, and 30m targets.',
      steps: [
        'Minute 1: Execute single-swipe ADS flicks between stationary targets at 20m. Verify crosshair lands on head/chest without overshooting.',
        'Minute 2: Perform full 30-round ADS sprays on moving targets at 25m. Ensure weapon recoil stays perfectly centered at chest level.',
      ],
    },
  };
}
