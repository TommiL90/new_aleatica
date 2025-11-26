export interface MtAdministration {
  mtCountry: string;
  mtCountryId: number;
  name: string;
  id: number;
  disabled: boolean;
}

export interface AdministrationOption {
  label: string;
  value: number;
  countryId: number;
}
