export type SensitivityProfile = {
  // Rotation
  rotationMode: 'Speed Acceleration' | 'Fixed Speed' | 'Distance Acceleration';
  accelerationValue: number;

  // Camera Sensitivities
  tppCamera: number;
  redDotCamera: number; // Anchor Point
  adsCamera: number;
  sniperCamera: number;
  scope3xCamera: number;
  scope4xCamera: number;
  verticalTurning: number; // Percentage, e.g., 100%

  // Firing Sensitivities
  tppFiring: number;
  redDotFiring: number;
  adsFiring: number;
  sniperFiring: number;
  scope3xFiring: number;
  scope4xFiring: number;

  // Gyroscope Sensitivities
  tppGyro: number;
  redDotGyro: number;
  adsGyro: number;
  sniperGyro: number;

  // Metadata
  profileName?: string;
  notes?: string;
};

export type ProPreset = {
  id: string;
  name: string;
  player: string;
  team: string;
  device: 'Phone' | 'Tablet / iPad';
  layout: string;
  role: string;
  profile: SensitivityProfile;
};

export type DiagnosticResult = {
  symptomsDetected: string[];
  immediateDiagnosis: string;
  recommendedProfile: SensitivityProfile;
  mathExplanation: string[];
  inGameDrill: {
    title: string;
    description: string;
    steps: string[];
  };
};
