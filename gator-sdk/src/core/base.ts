type GatorConfig = {
  gatorAppId: string;
  gatorAuthApiKey: string;
  gatorAuthApiUrl: string;
};

export abstract class Base {
  protected gatorConfig: GatorConfig;

  constructor(gatorConfig: GatorConfig) {
    this.gatorConfig = gatorConfig;
  }
}
