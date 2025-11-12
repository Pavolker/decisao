
export interface SimulationResult {
  realDecision: {
    summary: string;
  };
  invertedDecision: {
    summary: string;
  };
  impacts: {
    economic: {
      real: string;
      inverted: string;
    };
    operational: {
      real: string;
      inverted: string;
    };
    reputational: {
      real: string;
      inverted: string;
    };
  };
  strategicNarrative: string;
  radarMetrics: {
    real: {
      financial: number;
      operational: number;
      reputation: number;
      risk: number;
      innovation: number;
      sustainability: number;
    };
    inverted: {
      financial: number;
      operational: number;
      reputation: number;
      risk: number;
      innovation: number;
      sustainability: number;
    };
  };
}
