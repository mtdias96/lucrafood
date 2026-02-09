import { PackageUnit } from '@shared/types/PackageUnit';

export class UnitPriceService {
  private static readonly multiplier: Record<PackageUnit, number> = {
    g: 1,
    kg: 1000,
    ml: 1,
    l: 1000,
    un: 1,
  } as const;

  static toBaseQty(packageQty: number, packageUnit: PackageUnit): number {
    return packageQty * this.multiplier[packageUnit];
  }

  static calcUnitPrice(totalPrice: number, packageQty: number, packageUnit: PackageUnit): number {
    const baseQty = this.toBaseQty(packageQty, packageUnit);
    return Number((totalPrice / baseQty).toFixed(6));
  }
}
